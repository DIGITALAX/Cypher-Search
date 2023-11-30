import { useEffect, useState } from "react";
import { Sale, ScreenDisplay } from "../types/autograph.types";
import {
  getNFTOrderById,
  getOrderById,
  getSalesHistory,
} from "../../../../graphql/subgraph/queries/getSales";
import { Profile } from "../../../../graphql/generated";
import getProfile from "../../../../graphql/lens/queries/profile";
import toHexWithLeadingZero from "../../../../lib/helpers/leadingZero";

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

      const promises = data?.data?.collectionCreateds?.map(
        async (item: {
          collectionMetadata: {
            mediaCover: string;
            images: string[];
          };
          orderIds: string[];
          buyerProfileIds: string;
          origin: string;
        }) => {
          if (!item.orderIds || item.orderIds.length === 0) return;

          const results = await Promise.all(
            item.orderIds.map(async (orderId: string, index: number) => {
              let data;
              if (Number(item.origin) == 1) {
                const order = await getNFTOrderById(orderId);
                data = order?.data?.nftonlyOrderCreateds?.[0];
              } else {
                const order = await getOrderById(orderId);
                data = order?.data?.orderCreateds?.[0];
              }

              if (data) {
                const profileBuyer = await getProfile(
                  {
                    forProfileId:
                      "0x" +
                      toHexWithLeadingZero(
                        Number(item.buyerProfileIds?.[index])
                      ),
                  },
                  lensConnected?.id
                );

                return {
                  orderId: data?.orderId,
                  pubId: data?.pubId,
                  profileId: data?.profileId,
                  transactionHash: data?.transactionHash,
                  currency: data?.currency,
                  buyer: profileBuyer?.data?.profile,
                  totalPrice: data?.totalPrice,
                  images: data?.images,
                  blockTimestamp: data?.blockTimestamp,
                  amount: data?.subOrderAmount?.[0],
                };
              }
            })
          );

          return results.filter((result) => result);
        }
      );

      const finalResults = (await Promise.all(promises)).flat();
      setAllSales(finalResults);
    } catch (err: any) {
      console.error(err.message);
    }
    setSalesLoading(false);
  };

  useEffect(() => {
    if (
      allSales?.length < 1 &&
      screenDisplay === ScreenDisplay.Sales &&
      isDesigner &&
      lensConnected?.handle?.fullHandle === pageProfile?.handle?.fullHandle
    ) {
      handleAllSales();
    }
  }, [pageProfile?.id, screenDisplay, lensConnected?.id]);

  return {
    salesLoading,
    allSales,
  };
};

export default useSales;
