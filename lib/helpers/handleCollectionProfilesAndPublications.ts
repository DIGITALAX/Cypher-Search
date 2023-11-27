import { Creation } from "@/components/Tiles/types/tiles.types";
import { Profile } from "../../graphql/generated";
import toHexWithLeadingZero from "./leadingZero";
import getPublication from "../../graphql/lens/queries/publication";
import collectionFixer from "./collectionFixer";

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

      const coll = await collectionFixer(collection);
      return {
        ...coll,
        profile: publication?.data?.publication?.by as Profile,
        publication: publication?.data?.publication,
      } as Creation;
    });
    const colls = await Promise.all(promises);
    return colls;
  } catch (err: any) {
    console.error(err.message);
  }
};

export default handleCollectionProfilesAndPublications;
