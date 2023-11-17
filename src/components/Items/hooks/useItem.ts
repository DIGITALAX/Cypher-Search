import {
  Community,
  Creation,
  Publication,
} from "@/components/Tiles/types/tiles.types";
import { useEffect, useState } from "react";
import { getOneCollectionTitle } from "../../../../graphql/subgraph/queries/getOneCollection";
import {
  ImageMetadataV3,
  Post,
  Quote,
  Comment,
  Mirror,
  Profile,
} from "../../../../graphql/generated";
import getPublication from "../../../../graphql/lens/queries/publication";
import { FilterValues } from "@/components/Search/types/search.types";
import getProfile from "../../../../graphql/lens/queries/profile";
import { getCollectionsPaginated } from "../../../../graphql/subgraph/queries/getCollections";
import { getCommunityName } from "../../../../graphql/subgraph/queries/getCommunities";
import getProfiles from "../../../../graphql/lens/queries/profiles";
import {
  numberToItemTypeMap,
  numberToPrintType,
} from "../../../../lib/constants";

const useItem = (
  type: string,
  id: string,
  filterConstants: FilterValues | undefined,
  lensConnected: Profile | undefined
) => {
  const [itemLoading, setItemLoading] = useState<boolean>(false);
  const [itemData, setItemData] = useState<Publication>();
  const [relatedCollections, setRelatedCollections] = useState<Creation[]>([]);

  const getItemData = async () => {
    setItemLoading(true);
    try {
      let pub: Post | Mirror | Comment | Quote;
      switch (type) {
        case "chromadin":
        case "coinop":
        case "pub":
          pub = (await getPub()) as Post;
          const collection = (await getCollection(
            (pub?.metadata as ImageMetadataV3)?.title
          )) as Creation;
          setItemData({
            post: collection
              ? {
                  ...collection,
                  profile: pub?.by,
                  publication: pub,
                }
              : pub,
            type,
          });
          break;

        case "microbrand":
          const profile = await getIdProfile();
          const collections = await getIdCollections(profile?.ownedBy?.address);
          setItemData({
            post: profile,
            type,
          });
          setRelatedCollections(collections || []);
          break;

        case "community":
          const community = await getCommunity();
          setItemData({
            post: community,
            type,
          });
          break;
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setItemLoading(false);
  };

  const getIdProfile = async (): Promise<Profile | undefined> => {
    try {
      const item = filterConstants?.microbrands?.find((item) => item[1] === id);
      const data = await getProfile({
        forProfileId: item?.[3],
      });

      return data?.data?.profile as Profile;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getIdCollections = async (
    creator: string
  ): Promise<Creation[] | undefined> => {
    try {
      const data = await getCollectionsPaginated(creator, 3, 0);
      data?.data?.collectionCreateds?.map((collection: any) => ({
        ...collection,
        sizes: collection?.sizes?.split(",").map((word: string) => word.trim()),
        colors: collection?.colors
          ?.split(",")
          .map((word: string) => word.trim()),
        mediaTypes: collection?.mediaTypes
          ?.split(",")
          .map((word: string) => word.trim()),
        access: collection?.access
          ?.split(",")
          .map((word: string) => word.trim()),
        communities: collection?.communities
          ?.split(",")
          .map((word: string) => word.trim()),
        tags: collection?.tags?.split(",").map((word: string) => word.trim()),
      }));
      return data?.data?.collectionCreateds;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getCommunity = async (): Promise<Community | undefined> => {
    try {
      const data = await getCommunityName(id);

      if (data?.data?.communityCreateds) {
        data?.data?.communityCreateds?.map(async (item: any) => {
          const members = await getProfiles({
            where: {
              profileIds: item.members,
            },
          });

          const creators = await getProfiles({
            where: {
              profileIds: item.validCreators,
            },
          });

          const items = (item.validCreators as string[])
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.min(4, item.validCreators.length));

          const sample = items?.map(async (item: string) => {
            return await getIdCollections(item);
          });

          const steward = await getProfile({
            forProfileId: item.steward,
          });

          return {
            ...item,
            steward: steward?.data?.profile,
            validPrintTypes: item.validPrintTypes.map(
              (value: string) => numberToPrintType[Number(value)]
            ),
            sample: await Promise.all(sample),
            validCreators: creators?.data?.profiles,
            validOrigins: item.validOrigins.map(
              (value: string) => numberToItemTypeMap[Number(value)]
            ),
            members: members?.data?.profiles,
          };
        });

        return data?.data?.communityCreateds?.[0];
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getCollection = async (
    title: string
  ): Promise<Creation | undefined> => {
    try {
      const data = await getOneCollectionTitle(title);

      if (data?.data?.collectionCreateds) {
        data?.data?.collectionCreateds?.map((collection: any) => ({
          ...collection,
          sizes: collection?.sizes
            ?.split(",")
            .map((word: string) => word.trim()),
          colors: collection?.colors
            ?.split(",")
            .map((word: string) => word.trim()),
          mediaTypes: collection?.mediaTypes
            ?.split(",")
            .map((word: string) => word.trim()),
          access: collection?.access
            ?.split(",")
            .map((word: string) => word.trim()),
          communities: collection?.communities
            ?.split(",")
            .map((word: string) => word.trim()),
          tags: collection?.tags?.split(",").map((word: string) => word.trim()),
        }));

        return data?.data?.collectionCreateds?.[0];
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getPub = async (): Promise<
    Post | Mirror | Comment | Quote | undefined | null
  > => {
    try {
      const { data } = await getPublication({
        forId: id,
      });

      return data?.publication as Post | Mirror | Comment | Quote;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (type) {
      getItemData();
    }
  }, []);

  return {
    itemLoading,
    itemData,
  };
};

export default useItem;
