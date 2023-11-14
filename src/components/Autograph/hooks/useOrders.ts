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
import fetchIPFSJSON from "../../../../lib/helpers/fetchIpfsJson";
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

      if (data?.data && data?.data?.orderCreateds?.length > 0) {
        const promises = data?.data?.orderCreateds?.map(async (item: any) => ({
          ...item,
          details: await JSON.parse(
            await fetchIPFSJSON(item?.details as string)
          ),
          decrypted: false,
          subOrders: await Promise.all(
            item.subOrderAmounts.map(async (item: any, index: number) => {
              const collection = await getCollectionOrder(
                item.subOrderCollectionsIds[index]
              );

              return {
                collection: {
                  name: collection?.data?.collectionCreateds?.[0].title,
                  image: collection?.data?.collectionCreateds?.[0].images?.[0],
                  origin: collection?.data?.collectionCreateds?.[0].origin,
                  pubId: collection?.data?.collectionCreateds?.[0]?.pubId,
                },
                isFulfilled: item.subOrderisFulfilled[index],
                fulfillerAddress: item.subOrderFulfillerAddresses[index],
                amount: item.subOrderAmounts[index],
              };
            })
          ),
        }));

        setAllOrders(await Promise.all(promises));
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

      const authSig = await checkAndSignAuthMessage({
        chain: "polygon",
      });

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
        client
      );

      const details = await JSON.parse(decryptedString);

      setAllOrders((prev) => {
        const orders = [...prev];
        orders[index] = {
          ...orders[index],
          details,
          subOrders: orders[index]?.subOrders.map((item, index) => ({
            ...item,
            size: details.sizes[index],
            color: details.colors[index],
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
  }, []);

  return {
    allOrders,
    ordersLoading,
    orderActions,
    setOrderActions,
    decryptOrder,
  };
};

export default useOrders;
