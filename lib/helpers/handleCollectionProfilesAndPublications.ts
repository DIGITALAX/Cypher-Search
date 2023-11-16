import { Creation } from "@/components/Tiles/types/tiles.types";
import getPublications from "../../graphql/lens/queries/publications";
import { numberToItemTypeMap } from "../constants";
import { Post, Profile, PublicationType } from "../../graphql/generated";

const handleCollectionProfilesAndPublications = async (
  collections: Creation[],
  lens: Profile | undefined
): Promise<Creation[] | undefined> => {
  try {
    const { data } = await getPublications(
      {
        where: {
          publicationIds: collections.map(
            (item) =>
              `${numberToItemTypeMap[Number(item?.origin)]}/${
                "0x" + Number(item?.pubId)?.toString(16)
              }-${"0x" + Number(item?.profileId)?.toString(16)}`
          ),
          publicationTypes: [PublicationType.Post],
        },
      },
      lens?.id
    );

    const newCollections: Creation[] = collections.map(
      (collection: Creation) => ({
        ...collection,
        profile: (
          data?.publications?.items.find(
            (item) => (item as Post).by.id === collection.profileId
          ) as Post
        ).by,
        publication: data?.publications?.items.find(
          (item) => item.id === collection.pubId
        ),
        sizes: (collection?.sizes as any)
          ?.split(",")
          .map((word: string) => word.trim()),
        colors: (collection?.colors as any)
          ?.split(",")
          .map((word: string) => word.trim()),
        mediaTypes: (collection?.mediaTypes as any)
          ?.split(",")
          .map((word: string) => word.trim()),
        access: (collection?.access as any)
          ?.split(",")
          .map((word: string) => word.trim()),
        communities: (collection?.communities as any)
          ?.split(",")
          .map((word: string) => word.trim()),
        tags: (collection?.tags as any)
          ?.split(",")
          .map((word: string) => word.trim()),
      })
    ) as Creation[];

    return newCollections;
  } catch (err: any) {
    console.error(err.message);
  }
};

export default handleCollectionProfilesAndPublications;
