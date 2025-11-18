import { useContext, useEffect, useState } from "react";
import { EncryptedData, Order, ScreenDisplay } from "../types/autograph.types";
import { ModalContext } from "@/app/providers";
import { useAccount } from "wagmi";
import { getOrders } from "../../../../../graphql/queries/getOrders";
import { INFURA_GATEWAY, orderStatus } from "@/app/lib/constants";
import { Account } from "@lens-protocol/client";
import { decryptData } from "@/app/lib/helpers/encryption";
const useOrders = (pageProfile: Account | undefined, dict: any) => {
  const context = useContext(ModalContext);
  const { address } = useAccount();
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [decryptLoading, setDecryptLoading] = useState<boolean[]>([]);
  const [orderOpen, setOrderOpen] = useState<boolean[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [privateKey, setPrivateKey] = useState<string | null>(null);

  const getAllOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await getOrders(address!);

      setOrders(
        (
          data?.data?.orderCreateds?.map((order: Order) => ({
            ...order,
            decrypted: false,
            status: orderStatus[Number(order?.status)],
            totalPrice: Number(order?.totalPrice) / 10 ** 18,
          })) || []
        )?.sort(
          (a: Order, b: Order) =>
            Number(b?.blockTimestamp) - Number(a?.blockTimestamp)
        )
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setOrdersLoading(false);
  };

  const handleDecrypt = async (index: number) => {
    setDecryptLoading((prev) => {
      let arr = [...prev];

      arr[index] = true;

      return arr;
    });

    if (!address) {
      return;
    }

    try {
      const data = await fetch(
        `${INFURA_GATEWAY}/ipfs/${
          orders[index]?.details?.split("ipfs://")?.[1]
        }`
      );

      const details = (await data.json()) as EncryptedData;

      let key = privateKey;

      if (!key) {
        const promptMessage = dict?.decryptPrompt;
        const promptValue = window.prompt(promptMessage);

        if (!promptValue) {
          return;
        }

        key = promptValue.trim();

        if (!key.startsWith("0x")) {
          key = `0x${key}`;
        }

        setPrivateKey(key);
      }

      const fulfillment = await decryptData(details, key, address);

      setOrders((prev) => {
        const pedidos = [...prev];
        pedidos[index] = {
          ...pedidos[index],
          fulfillment,
          decrypted: true,
        };
        return pedidos;
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setDecryptLoading((prev) => {
      let arr = [...prev];

      arr[index] = false;

      return arr;
    });
  };

  useEffect(() => {
    if (
      orders?.length < 1 &&
      address &&
      context?.lensConectado?.profile?.address === pageProfile?.address &&
      context?.screenDisplay === ScreenDisplay.Orders
    ) {
      getAllOrders();
    }
  }, [context?.screenDisplay, context?.lensConectado?.profile, pageProfile]);

  return {
    ordersLoading,
    orders,
    decryptLoading,
    handleDecrypt,
    orderOpen,
    setOrderOpen,
  };
};

export default useOrders;
