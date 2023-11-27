import { Drop } from "@/components/Autograph/types/autograph.types";
import { Creation } from "@/components/Tiles/types/tiles.types";
import { useEffect, useState } from "react";
import { Profile } from "../../../../graphql/generated";
import { getOneDrop } from "../../../../graphql/subgraph/queries/getDrops";
import { getOneCollection } from "../../../../graphql/subgraph/queries/getOneCollection";
import fetchIPFSJSON from "../../../../lib/helpers/fetchIpfsJson";
import collectionFixer from "../../../../lib/helpers/collectionFixer";

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
                  async (collection: Creation) =>
                    await collectionFixer(collection)
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
