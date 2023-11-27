import { Drop } from "@/components/Autograph/types/autograph.types";
import { Creation } from "@/components/Tiles/types/tiles.types";
import { useEffect, useState } from "react";
import { Profile } from "../../../../graphql/generated";
import { getOneDrop } from "../../../../graphql/subgraph/queries/getDrops";
import { getOneCollection } from "../../../../graphql/subgraph/queries/getOneCollection";
import fetchIPFSJSON from "../../../../lib/helpers/fetchIpfsJson";

const useDrop = (drop: string, profile: Profile | undefined) => {
  const [dropLoading, setDropLoading] = useState<boolean>();
  const [collections, setCollections] = useState<Creation[]>([]);
  const [dropItem, setDropItem] = useState<Drop>();

  const getDrop = async (): Promise<Drop | undefined> => {
    try {
      const res = await getOneDrop(
        profile?.ownedBy?.address,
        drop?.replaceAll("_", " ")
      );

      return res?.data?.dropCreateds?.[0];
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getDropItems = async () => {
    setDropLoading(true);
    try {
      const drop = await getDrop();

      if (drop) {
        if (drop.collectionIds) {
          const promises = drop.collectionIds.map(async (item) => {
            const res = await getOneCollection(item);
            if (res?.data?.collectionCreateds) {
              return Promise.all(
                res.data.collectionCreateds.map(
                  async (collection: Creation) => {
                    let ipfs = {};
                    if (!collection?.title) {
                      let data = await fetchIPFSJSON(collection?.uri);
                      const { cover, ...rest } = data;
                      ipfs = {
                        ...rest,
                        mediaCover: cover,
                      };
                    }
                    const coll = {
                      ...collection,
                      ...ipfs,
                    };
                    return {
                      ...coll,
                      sizes:
                        typeof coll?.sizes === "string"
                          ? (coll?.sizes as any)
                              ?.split(",")
                              ?.map((word: string) => word.trim())
                              ?.filter((word: string) => word.length > 0)
                          : coll?.sizes,
                      colors:
                        typeof coll?.colors === "string"
                          ? (coll?.colors as any)
                              ?.split(",")
                              ?.map((word: string) => word.trim())
                              ?.filter((word: string) => word.length > 0)
                          : coll?.colors,
                      mediaTypes:
                        typeof coll?.mediaTypes === "string"
                          ? (coll?.mediaTypes as any)
                              ?.split(",")
                              ?.map((word: string) => word.trim())
                              ?.filter((word: string) => word.length > 0)
                          : coll?.mediaTypes,
                      access:
                        typeof coll?.access === "string"
                          ? (coll?.access as any)
                              ?.split(",")
                              ?.map((word: string) => word.trim())
                              ?.filter((word: string) => word.length > 0)
                          : coll?.access,
                      communities:
                        typeof coll?.communities === "string"
                          ? (coll?.communities as any)
                              ?.split(",")
                              ?.map((word: string) => word.trim())
                              ?.filter((word: string) => word.length > 0)
                          : coll?.communities,
                      tags:
                        typeof coll?.tags === "string"
                          ? (coll?.tags as any)
                              ?.split(",")
                              ?.map((word: string) => word.trim())
                              ?.filter((word: string) => word.length > 0)
                          : coll?.tags,
                      prices: coll?.prices?.map((price: string) =>
                        String(Number(price) / 10 ** 18)
                      ),
                    } as Creation;
                  }
                )
              );
            }
          });

          const collections = (await Promise.all(promises)).flat();
          setCollections(collections);
        }

        setDropItem(drop);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setDropLoading(false);
  };

  useEffect(() => {
    if (collections?.length < 1 && !dropItem && profile && drop) {
      getDropItems();
    }
  }, [profile, drop]);

  return {
    dropLoading,
    dropItem,
    collections,
  };
};

export default useDrop;
