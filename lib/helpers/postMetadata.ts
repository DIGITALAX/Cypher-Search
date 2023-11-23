import { INFURA_GATEWAY, IPFS_REGEX } from "../constants";
import {
  PublicationMetadataMedia,
  Quote,
  Comment,
  Mirror,
  Post,
  Maybe,
  PublicationMetadataMediaAudio,
  PublicationMetadataMediaImage,
  PublicationMetadataMediaVideo,
} from "../../graphql/generated";
import formatDuration from "./formatDuration";

export const postMetadata = (
  publication: Post | Mirror | Quote | Comment
): Maybe<PublicationMetadataMedia[]> | undefined => {
  const pub =
    publication?.__typename === "Mirror"
      ? publication.mirrorOn
      : (publication as Post);

  return pub?.metadata?.__typename === "VideoMetadataV3" ||
    pub?.metadata?.__typename === "ImageMetadataV3" ||
    pub?.metadata?.__typename === "AudioMetadataV3"
    ? [pub?.metadata?.asset, ...(pub?.metadata?.attachments || [])]
    : undefined;
};

export const metadataMedia = (
  media:
    | PublicationMetadataMediaAudio
    | PublicationMetadataMediaImage
    | PublicationMetadataMediaVideo
):
  | {
      url: string;
      type: "Image" | "Video" | "Audio";
      cover?: string;
    }
  | undefined => {
  switch (media?.__typename) {
    case "PublicationMetadataMediaAudio":
      return {
        url: media?.audio?.raw?.uri
          ? media?.audio?.raw?.uri?.includes("ipfs://") &&
            IPFS_REGEX.test(media?.audio?.raw?.uri?.split("ipfs://")?.[1])
            ? `${INFURA_GATEWAY}/ipfs/${
                media?.audio?.raw?.uri?.split("ipfs://")[1]
              }`
            : media?.audio?.raw?.uri
          : media?.audio?.optimized?.uri,
        type: "Audio",
        cover: media?.cover?.raw?.uri
          ? media?.cover?.raw?.uri?.includes("ipfs://") &&
            IPFS_REGEX.test(media?.cover?.raw?.uri?.split("ipfs://")?.[1])
            ? `${INFURA_GATEWAY}/ipfs/${
                media?.cover?.raw?.uri?.split("ipfs://")[1]
              }`
            : media?.cover?.raw?.uri
          : `${INFURA_GATEWAY}/ipfs/QmNW7axzePWYgpqXS31FG93fsYJrHjpC1QTPyGmz3nCMmi`,
      };

    case "PublicationMetadataMediaImage":
      return {
        url: media?.image?.raw?.uri
          ? media?.image?.raw?.uri?.includes("ipfs://") &&
            IPFS_REGEX.test(media?.image?.raw?.uri?.split("ipfs://")?.[1])
            ? `${INFURA_GATEWAY}/ipfs/${
                media.image?.raw?.uri?.split("ipfs://")[1]
              }`
            : media?.image?.raw?.uri
          : media?.image?.optimized?.uri,
        type: "Image",
      };

    case "PublicationMetadataMediaVideo":
      return {
        url: media?.video?.raw?.uri
          ? media?.video?.raw?.uri?.includes("ipfs://") &&
            IPFS_REGEX.test(media?.video?.raw?.uri?.split("ipfs://")?.[1])
            ? `${INFURA_GATEWAY}/ipfs/${
                media?.video?.raw?.uri?.split("ipfs://")[1]
              }`
            : media?.video?.raw?.uri
          : media?.video?.optimized?.uri,
        type: "Video",
        cover: media?.cover?.raw?.uri
          ? media?.cover?.raw?.uri?.includes("ipfs://") &&
            IPFS_REGEX.test(media?.cover?.raw?.uri?.split("ipfs://")?.[1])
            ? `${INFURA_GATEWAY}/ipfs/${
                media?.cover?.raw?.uri?.split("ipfs://")[1]
              }`
            : media?.cover?.raw?.uri
          : `${INFURA_GATEWAY}/ipfs/QmNW7axzePWYgpqXS31FG93fsYJrHjpC1QTPyGmz3nCMmi`,
      };
  }
};
