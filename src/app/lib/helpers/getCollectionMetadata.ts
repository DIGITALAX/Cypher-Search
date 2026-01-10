import { getOneCollectionQuick } from "../../../../graphql/queries/getAllCollections";
import { itemStringToType, itemTypeToNumber, INFURA_GATEWAY } from "../constants";

export const getCollectionMetadata = async (type: string, id: string) => {
  try {
    const originNumber = itemTypeToNumber[itemStringToType[type]] || "0";
    const title = decodeURIComponent(id?.replaceAll("_", " "));

    const result = await getOneCollectionQuick(Number(originNumber), title);
    const collection = result?.data?.collectionCreateds?.[0];

    if (!collection) return null;

    const metadata = collection?.metadata;
    const image = metadata?.images?.[0]?.split("ipfs://")?.[1] ?? metadata?.mediaCover?.split("ipfs://")?.[1];
    const video = metadata?.video?.split("ipfs://")?.[1];
    const audio = metadata?.audio?.split("ipfs://")?.[1];
    const description = metadata?.description || "";
    const price = collection?.price || "0";
    const amount = collection?.amount || "0";
    const unlimited = collection?.unlimited || false;

    return {
      title: metadata?.title || title,
      description,
      image: image ? `${INFURA_GATEWAY}/ipfs/${image}` : null,
      video: video ? `${INFURA_GATEWAY}/ipfs/${video}` : null,
      audio: audio ? `${INFURA_GATEWAY}/ipfs/${audio}` : null,
      price,
      amount,
      unlimited,
      tags: metadata?.tags || [],
      colors: metadata?.colors || [],
      sizes: metadata?.sizes || [],
      collection,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};