import { Collection } from "@/app/components/Common/types/common.types";
import fetchIPFSJSON from "./fetchIpfsJson";

const collectionFixer = async (collection: Collection): Promise<Collection> => {
  let ipfs = {};
  if (!collection?.metadata?.title && collection?.postId) {
    let data = await fetchIPFSJSON(collection?.uri);
    const { cover, ...rest } = data;
    ipfs = {
      metadata: {
        ...rest,
        mediaCover: rest?.cover,
      },
    };
  }
  const coll = {
    ...collection,
    ...ipfs,
  };

  return {
    ...coll,
    
    metadata: {
      ...coll?.metadata,
      sizes:
        typeof coll?.metadata?.sizes === "string"
          ? (coll?.metadata?.sizes as any)
              ?.split(",")
              ?.map((word: string) => word.trim())
              ?.filter((word: string) => word.length > 0)
          : coll?.metadata?.sizes,
      colors:
        typeof coll?.metadata?.colors === "string"
          ? (coll?.metadata?.colors as any)
              ?.split(",")
              ?.map((word: string) => word.trim())
              ?.filter((word: string) => word.length > 0)
          : coll?.metadata?.colors,
      mediaTypes:
        typeof coll?.metadata?.mediaTypes === "string"
          ? (coll?.metadata?.mediaTypes as any)
              ?.split(",")
              ?.map((word: string) => word.trim())
              ?.filter((word: string) => word.length > 0)
          : coll?.metadata?.mediaTypes,
      access:
        typeof coll?.metadata?.access === "string"
          ? (coll?.metadata?.access as any)
              ?.split(",")
              ?.map((word: string) => word.trim())
              ?.filter((word: string) => word.length > 0)
          : coll?.metadata?.access,
      tags:
        typeof coll?.metadata?.tags === "string"
          ? (coll?.metadata?.tags as any)
              ?.split(",")
              ?.map((word: string) => word.trim())
              ?.filter((word: string) => word.length > 0)
          : coll?.metadata?.tags,
    },
    price: Number(coll?.price) / 10 ** 18,
  } as Collection;
};

export default collectionFixer;
