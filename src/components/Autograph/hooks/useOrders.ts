import { useEffect, useState } from "react";
import {
  EncryptedDetails,
  Order,
  ScreenDisplay,
} from "../types/autograph.types";
import { getOrders } from "../../../../graphql/subgraph/queries/getOrders";
import {
  LitNodeClient,
  checkAndSignAuthMessage,
  decryptToString,
} from "@lit-protocol/lit-node-client";
import { getCollectionOrder } from "../../../../graphql/subgraph/queries/getOneCollection";
import { Profile } from "../../../../graphql/generated";

const useOrders = (
  address: `0x${string}` | undefined,
  client: LitNodeClient,
  lensConnected: Profile | undefined,
  pageProfile: Profile | undefined,
  screenDisplay: ScreenDisplay
) => {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [orderActions, setOrderActions] = useState<
    {
      decryptLoading: boolean;
      orderOpen: boolean;
      decrypted: boolean;
    }[]
  >([]);

  const getAllOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await getOrders(address!);

      if (
        data?.data &&
        (data?.data?.orderCreateds?.length > 0 ||
          data?.data?.nftonlyOrderCreateds?.length > 0)
      ) {
        const promises = [
          ...(data?.data?.orderCreateds || []),
          ...(data?.data?.nftonlyOrderCreateds || []),
        ]?.map(
          async (item: {
            orderId: string;
            totalPrice: string;
            currency: string;
            pubId: string;
            profileId: string;
            buyer: string;
            blockTimestamp: string;
            transactionHash: string;
            images: string[];
            names: string[];
            messages: string[];
            details: string;
            subOrderPrice: string[];
            subOrderStatus: string[];
            subOrderCollectionIds: string[];
            subOrderIsFulfilled: boolean[];
            subOrderAmount: string[];
          }) => ({
            ...item,
            totalPrice: String(Number(item?.totalPrice) / 10 ** 18),
            details:
              item?.details && (await JSON.parse(item?.details as string)),
            decrypted: false,
            subOrders: await Promise.all(
              item?.subOrderCollectionIds?.map(
                async (collectionId: string, index: number) => {
                  const collection = await getCollectionOrder(collectionId);

                  return {
                    collection: {
                      name: collection?.data?.collectionCreateds?.[0]
                        ?.collectionMetadata?.title as string,
                      image: collection?.data?.collectionCreateds?.[0]
                        ?.collectionMetadata?.images?.[0]
                        ? collection?.data?.collectionCreateds?.[0]
                            ?.collectionMetadata?.images?.[0]
                        : (collection?.data?.collectionCreateds?.[0]
                            ?.collectionMetadata?.cover as string),
                      origin: collection?.data?.collectionCreateds?.[0]
                        ?.origin as string,
                      pubId: collection?.data?.collectionCreateds?.[0]
                        ?.pubId as string,
                    },
                    price: String(
                      Number(item?.subOrderPrice?.[index]) / 10 ** 18
                    ) as string,
                    status: item?.subOrderStatus?.[index] as string,
                    isFulfilled: item?.subOrderIsFulfilled?.[index],
                    fulfillerAddress: "",
                    amount: item?.subOrderAmount?.[index] as string,
                  };
                }
              )
            ),
          })
        );

        const orders = await Promise.all(promises);
        setAllOrders(orders as Order[]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setOrdersLoading(false);
  };

  const decryptOrder = async (orderId: string) => {
    const index = allOrders?.findIndex((pub) => pub.orderId === orderId);
    if (index === -1) {
      return;
    }
    setOrderActions((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], decryptLoading: true };
      return updatedArray;
    });

    const order = allOrders[index];
    try {
      if (
        !(order?.details as EncryptedDetails)?.ciphertext ||
        !(order?.details as EncryptedDetails)?.dataToEncryptHash ||
        !address ||
        order?.decrypted
      ) {
        return;
      }

      let nonce = client.getLatestBlockhash();

      const authSig = await checkAndSignAuthMessage({
        chain: "polygon",
        nonce: nonce!,
      });
      await client.connect();

      const decryptedString = await decryptToString(
        {
          authSig,
          accessControlConditions: (order?.details as EncryptedDetails)
            .accessControlConditions,
          ciphertext: (order?.details as EncryptedDetails).ciphertext,
          dataToEncryptHash: (order?.details as EncryptedDetails)
            .dataToEncryptHash,
          chain: "polygon",
        },
        client! as any
      );

      const details = await JSON.parse(decryptedString);

      setAllOrders((prev) => {
        const orders = [...prev];
        orders[index] = {
          ...orders[index],
          details,
          subOrders: orders[index]?.subOrders.map((item, index) => ({
            ...item,
            size: details.sizes[details.sizes.length - 1 - index],
            color: details.colors[details.colors.length - 1 - index],
          })),
          decrypted: true,
        };
        return orders;
      });
    } catch (err: any) {
      console.error(err.message);
    }

    setOrderActions((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], decryptLoading: false };
      return updatedArray;
    });
  };

  useEffect(() => {
    if (
      allOrders?.length < 1 &&
      address &&
      lensConnected?.handle?.fullHandle === pageProfile?.handle?.fullHandle &&
      screenDisplay === ScreenDisplay.Orders
    ) {
      getAllOrders();
    }
  }, [screenDisplay, lensConnected?.id, pageProfile?.id]);

  return {
    allOrders,
    ordersLoading,
    orderActions,
    setOrderActions,
    decryptOrder,
  };
};

export default useOrders;
