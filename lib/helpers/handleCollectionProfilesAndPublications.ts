import { Creation } from "@/components/Tiles/types/tiles.types";
import { Post, Profile } from "../../graphql/generated";
import toHexWithLeadingZero from "./leadingZero";
import getPublication from "../../graphql/lens/queries/publication";

const handleCollectionProfilesAndPublications = async (
  collections: Creation[],
  lens: Profile | undefined
): Promise<Creation[] | undefined> => {
  try {
    const promises = collections?.map(async (collection: Creation) => {
      const publication = await getPublication(
        {
          forId: `${
            "0x" + toHexWithLeadingZero(Number(collection?.profileId))
          }-${"0x" + toHexWithLeadingZero(Number(collection?.pubId))}`,
        },
        lens?.id
      );
      return {
        ...collection,
        profile: publication?.data?.publication?.by as Profile,
        publication: publication?.data?.publication,
        sizes: (collection?.sizes as any)
          ?.split(",")
          .map((word: string) => word.trim())
          .filter((word: string) => word.length > 0),
        colors: (collection?.colors as any)
          ?.split(",")
          .map((word: string) => word.trim())
          .filter((word: string) => word.length > 0),
        mediaTypes: (collection?.mediaTypes as any)
          ?.split(",")
          .map((word: string) => word.trim())
          .filter((word: string) => word.length > 0),
        access: (collection?.access as any)
          ?.split(",")
          .map((word: string) => word.trim())
          .filter((word: string) => word.length > 0),
        communities: (collection?.communities as any)
          ?.split(",")
          .map((word: string) => word.trim())
          .filter((word: string) => word.length > 0),
        tags: (collection?.tags as any)
          ?.split(",")
          .map((word: string) => word.trim())
          .filter((word: string) => word.length > 0),
        prices: collection?.prices?.map((price: string) =>
          String(Number(price) / 10 ** 18)
        ),
      } as Creation;
    });
    const colls = await Promise.all(promises);
    return colls;
  } catch (err: any) {
    console.error(err.message);
  }
};

export default handleCollectionProfilesAndPublications;
