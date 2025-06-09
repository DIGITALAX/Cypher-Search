import {
  Collection,
  LensConnected,
} from "@/app/components/Common/types/common.types";
import { PublicClient } from "@lens-protocol/client";
import { fetchPost } from "@lens-protocol/client/actions";
import collectionFixer from "./collectionFixer";

const handleCollectionProfilesAndPublications = async (
  collections: Collection[],
  lens: LensConnected,
  lensClient: PublicClient
): Promise<Collection[] | undefined> => {
  try {
    const promises = [...(collections || [])]?.map(
      async (collection: Collection) => {
        if (collection?.postId && lensClient) {
          const res = await fetchPost(lens?.sessionClient ?? lensClient, {
            post: collection?.postId,
          });

          let publication, profile;

          if (res?.isOk()) {
            publication = res?.value;
            profile = res?.value?.author;
          }

          const coll = await collectionFixer(collection);

          return {
            ...coll,
            profile,
            publication,
          } as Collection;
        }
      }
    );
    const colls = await Promise.all(promises);
    return colls?.filter(Boolean) as Collection[];
  } catch (err: any) {
    console.error(err.message);
  }
};

export default handleCollectionProfilesAndPublications;
