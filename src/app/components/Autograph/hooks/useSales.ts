import { ModalContext } from "@/app/providers";
import { Account } from "@lens-protocol/client";
import { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Order, ScreenDisplay } from "../types/autograph.types";
import { getSalesHistory } from "../../../../../graphql/queries/getSales";
import { orderStatus } from "@/app/lib/constants";

const useSales = (pageProfile: Account | undefined) => {
  const context = useContext(ModalContext);
  const { address } = useAccount();
  const [salesLoading, setSalesLoading] = useState<boolean>(false);
  const [sales, setSales] = useState<Order[]>([]);

  const handleAllSales = async () => {
    if (!address) return;
    setSalesLoading(true);
    try {
      const data = await getSalesHistory(address);

      setSales(
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
    setSalesLoading(false);
  };

  useEffect(() => {
    if (
      sales?.length < 1 &&
      context?.screenDisplay === ScreenDisplay.Sales &&
      context?.isDesigner &&
      context?.lensConectado?.profile?.address === pageProfile?.address
    ) {
      handleAllSales();
    }
  }, [context?.screenDisplay, context?.lensConectado?.profile, pageProfile]);

  return {
    salesLoading,
    sales,
  };
};

export default useSales;
