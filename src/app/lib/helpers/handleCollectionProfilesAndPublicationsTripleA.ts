import { LensConnected } from "@/app/components/Common/types/common.types";
import { PublicClient } from "@lens-protocol/client";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import {
  CollectionType,
  NFTData,
} from "@/app/components/Tiles/types/tiles.types";
import { formatToString, INFURA_GATEWAY } from "../constants";

const handleCollectionProfilesAndPublicationsTripleA = async (
  collections: NFTData[],
  lens: LensConnected,
  lensClient: PublicClient
): Promise<NFTData[] | undefined> => {
  try {
    const promises = [...(collections || [])]?.map(async (collection) => {
      if (collection?.artist && lensClient) {
        const res = await fetchAccountsAvailable(
          lens?.sessionClient ?? lensClient,
          {
            managedBy: collection?.artist,
          }
        );

        let profile;

        if (res?.isOk()) {
          profile = res?.value?.items?.[0]?.account;
        }

        let metadata = collection?.metadata;

        if (!metadata) {
          const cadena = await fetch(
            `${INFURA_GATEWAY}/ipfs/${collection?.uri.split("ipfs://")?.[1]}`
          );
          metadata = await cadena.json();

          metadata = {
            ...metadata,
            sizes:
              typeof metadata?.sizes === "string"
                ? (metadata?.sizes as any)
                    ?.split(",")
                    ?.map((word: string) => word.trim())
                    ?.filter((word: string) => word.length > 0)
                : metadata?.sizes,
            colors:
              typeof metadata?.colors === "string"
                ? (metadata?.colors as any)
                    ?.split(",")
                    ?.map((word: string) => word.trim())
                    ?.filter((word: string) => word.length > 0)
                : metadata?.colors,
          };
        }

        return {
          ...collection,
          metadata,
          id: Number(collection?.id),
          collectionId: Number(collection?.collectionId),
          collectionType:
            (collection as any)?.collectionType == "1"
              ? CollectionType.IRL
              : CollectionType.Digital,
          printType: formatToString[metadata?.format!],
          tokenIdsMinted: (collection as any)?.tokenIds?.length || 0,
          origin: "5",
          profile,
          prices: collection?.prices?.map((item) => ({
            ...item,
            price: Number((Number(item?.price) / 10 ** 18)?.toFixed(2)),
          })),
        } as NFTData;
      }
    });
    const colls = await Promise.all(promises);
    return colls?.filter(Boolean) as NFTData[];
  } catch (err: any) {
    console.error(err.message);
  }
};

export default handleCollectionProfilesAndPublicationsTripleA;
