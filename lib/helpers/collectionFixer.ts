import { Creation } from "@/components/Tiles/types/tiles.types";
import fetchIPFSJSON from "./fetchIpfsJson";

const collectionFixer = async (collection: Creation): Promise<Creation> => {
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
};

export default collectionFixer;
