import { useEffect, useState } from "react";
import { Sale, ScreenDisplay } from "../types/autograph.types";
import { getSalesHistory } from "../../../../graphql/subgraph/queries/getSales";
import getDefaultProfile from "../../../../graphql/lens/queries/default";
import { Profile } from "../../../../graphql/generated";

const useSales = (
  address: `0x${string}` | undefined,
  screenDisplay: ScreenDisplay,
  isDesigner: boolean,
  lensConnected: Profile | undefined,
  pageProfile: Profile | undefined
) => {
  const [salesLoading, setSalesLoading] = useState<boolean>(false);
  const [allSales, setAllSales] = useState<Sale[]>([]);

  const handleAllSales = async () => {
    if (!address) return;
    setSalesLoading(true);
    try {
      const data = await getSalesHistory(address);

      if (
        data &&
        (data?.data?.orderCreateds?.length > 0 ||
          data?.data?.nFTOnlyOrderCreateds?.length > 0)
      ) {
        const promises = [
          ...(data?.data?.orderCreateds || []),
          ...(data?.data?.nFTOnlyOrderCreateds || []),
        ]?.map(async (item: any) => {
          const buyer = await getDefaultProfile({
            for: item?.buyer,
          });

          return {
            ...item,
            buyer,
          };
        });

        setAllSales(await Promise.all(promises));
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setSalesLoading(false);
  };

  useEffect(() => {
    if (
      allSales?.length < 0 &&
      screenDisplay === ScreenDisplay.Sales &&
      isDesigner &&
      lensConnected?.handle?.fullHandle === pageProfile?.handle?.fullHandle
    ) {
      handleAllSales();
    }
  }, []);

  return {
    salesLoading,
    allSales,
  };
};

export default useSales;
