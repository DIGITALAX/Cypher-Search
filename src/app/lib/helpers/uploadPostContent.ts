import convertToFile from "./convertToFile";
import {
  image,
  MediaAudioMimeType,
  MediaImageMimeType,
  MediaVideoMimeType,
  textOnly,
  TextOnlyMetadata,
  video,
  audio,
  VideoMetadata,
  ImageMetadata,
  AudioMetadata,
} from "@lens-protocol/metadata";
import { immutable, StorageClient } from "@lens-chain/storage-client";
import { chains } from "@lens-chain/sdk/viem";

const uploadPostContent = async (
  clienteAlmacenamiento: StorageClient,
  contentText: string | undefined,
  images: {
    media: string;
    type: MediaVideoMimeType | MediaAudioMimeType | MediaImageMimeType;
  }[],
  videos: string[],
  audios: string[],
  gifs: string[],
  title?: string,
  tags?: string[],
  cover?: string
): Promise<
  | {
      uri: string;
      schema: TextOnlyMetadata | VideoMetadata | ImageMetadata | AudioMetadata;
    }
  | undefined
> => {
  let schema: TextOnlyMetadata | VideoMetadata | ImageMetadata | AudioMetadata;
  const acl = immutable(chains.mainnet.id);

  if (
    images?.length < 1 &&
    gifs?.length < 1 &&
    videos?.length < 1 &&
    audio?.length < 1
  ) {
    schema = textOnly({
      content: contentText!,
      tags: [...(tags || []), "cyphersearch"],
    });
  } else {
    const cleanedGifs = images
      ?.map((item) => {
        if (item.type !== MediaImageMimeType.PNG) {
          return item.media;
        }
      })
      ?.filter(Boolean);
    const cleanedImages = images
      ?.map((item) => {
        if (item?.type !== MediaImageMimeType.GIF) {
          return item.media;
        }
      })
      ?.filter(Boolean);

    const mediaWithKeys = [
      ...(audios || []).map((audio) => ({
        type: MediaAudioMimeType.MP3,
        item: audio?.includes("ipfs://")
          ? audio
          : convertToFile(audio, "audio/mpeg"),
      })),
      ...(videos || []).map((video) => ({
        type: MediaVideoMimeType.MP4,
        item: video?.includes("ipfs://")
          ? video
          : convertToFile(video, "video/mp4"),
      })),
      ...(cleanedImages || []).map((image) => ({
        type: MediaImageMimeType.PNG,
        item:
          image &&
          (image?.includes("ipfs://")
            ? image
            : convertToFile(image, "image/png")),
      })),
      ...[...(gifs || []), ...(cleanedGifs || [])].map((gif) => ({
        type: MediaImageMimeType.GIF,
        item: gif,
      })),
    ]
      ?.filter(Boolean)
      ?.filter((item) => item.item);

    const uploads = await Promise.all(
      mediaWithKeys.map(async (media) => {
        if (
          typeof media?.item == "string" &&
          ((media?.item as String)?.includes("ipfs://") ||
            (media?.item as String)?.includes("https://media.tenor.com"))
        ) {
          return { type: media?.type, item: media?.item };
        } else {
          const response = await fetch("/api/ipfs", {
            method: "POST",
            body: media.item,
          });
          const responseJSON = await response.json();
          return { type: media?.type, item: "ipfs://" + responseJSON.cid };
        }
      })
    );

    let coverJSON: undefined | string = undefined;
    if (cover) {
      if (typeof cover == "string" && (cover as String)?.includes("ipfs://")) {
        coverJSON = cover;
      } else {
        const loadedCover = await fetch("/api/ipfs", {
          method: "POST",
          body: cover?.includes("ipfs://")
            ? cover
            : convertToFile(cover, "image/png"),
        });
        const res = await loadedCover.json();
        coverJSON = "ipfs://" + res?.cid;
      }
    }

    const primaryMedia = uploads[0];
    let attachments: any | undefined = uploads.filter(
      (media) => media.item !== primaryMedia.item
    );

    if (attachments?.length < 1) {
      attachments = undefined;
    }

    if (primaryMedia?.type === MediaVideoMimeType.MP4) {
      schema = video({
        title:
          title && title?.trim() !== ""
            ? title
            : contentText && contentText?.trim() !== ""
            ? contentText.slice(0, 20)
            : "",
        content: contentText!,
        video: {
          type: primaryMedia?.type as MediaVideoMimeType,
          item: primaryMedia?.item,
          cover: coverJSON ? coverJSON : undefined,
        },
        attachments,
        tags: [...(tags || []), "cyphersearch"],
      });
    } else if (primaryMedia?.type === MediaAudioMimeType.MP3) {
      schema = audio({
        title:
          title && title?.trim() !== ""
            ? title
            : contentText && contentText?.trim() !== ""
            ? contentText.slice(0, 20)
            : "",
        content: contentText!,
        attachments,
        audio: {
          type: primaryMedia?.type as MediaAudioMimeType,
          item: primaryMedia?.item,
          cover: coverJSON ? coverJSON : undefined,
        },
        tags: [...(tags || []), "cyphersearch"],
      });
    } else {
      schema = image({
        title:
          title && title?.trim() !== ""
            ? title
            : contentText && contentText?.trim() !== ""
            ? contentText.slice(0, 20)
            : "",
        attachments,
        content: contentText!,
        image: {
          type: primaryMedia?.type as MediaImageMimeType,
          item: primaryMedia?.item,
        },
        tags: [...(tags || []), "cyphersearch"],
      });
    }
  }

  try {
    const { uri } = await clienteAlmacenamiento?.uploadAsJson(schema, {
      acl,
    })!;

    return {
      uri,
      schema,
    };
  } catch (err: any) {
    console.error(err.message);
  }
};

export default uploadPostContent;
