import { useContext, useEffect, useState } from "react";
import { Order, ScreenDisplay } from "../types/autograph.types";
import { ModalContext } from "@/app/providers";
import { useAccount } from "wagmi";
import { getOrders } from "../../../../../graphql/queries/getOrders";
import { INFURA_GATEWAY, orderStatus } from "@/app/lib/constants";
import { Account } from "@lens-protocol/client";

const useOrders = (pageProfile: Account | undefined) => {
  const context = useContext(ModalContext);
  const { address } = useAccount();
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [downloadLoading, setDownloadLoading] = useState<boolean[]>([]);
  const [orderOpen, setOrderOpen] = useState<boolean[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const getAllOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await getOrders(address!);

      setOrders(
        (
          data?.data?.orderCreateds?.map((order: Order) => ({
            ...order,
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

  const handleDownloadDetails = async (index: number) => {
    const cid = orders[index]?.details?.split("ipfs://")?.[1];

    if (!cid || downloadLoading[index]) {
      return;
    }

    setDownloadLoading((prev) => {
      let arr = [...prev];

      arr[index] = true;

      return arr;
    });

    try {
      const data = await fetch(`${INFURA_GATEWAY}/ipfs/${cid}`);

      if (!data.ok) {
        throw new Error("Order details could not be downloaded");
      }

      const details = await data.text();
      const url = URL.createObjectURL(
        new Blob([details], { type: "application/json" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `order-${orders[index]?.orderId ?? index}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err.message);
    }
    setDownloadLoading((prev) => {
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
    downloadLoading,
    handleDownloadDetails,
    orderOpen,
    setOrderOpen,
  };
};

export default useOrders;
