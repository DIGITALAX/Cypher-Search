import { v4 as uuidv4 } from "uuid";
import { PublicationMetadataMainFocusType } from "../../graphql/generated";
import convertToFile from "./convertToFile";

const uploadPostContent = async (
  contentText: string | undefined,
  images: {
    media: string;
    type: string;
  }[],
  videos: string[],
  audio: string[],
  gifs: string[],
  title?: string,
  tags?: string[],
  skipUpload?: boolean,
  cover?: string
): Promise<{ string: string; object: Object } | undefined> => {
  let $schema: string,
    mainContentFocus: PublicationMetadataMainFocusType,
    value: object = {},
    coverJSON: string | undefined;

  if (
    images?.length < 1 &&
    gifs?.length < 1 &&
    videos?.length < 1 &&
    audio?.length < 1
  ) {
    $schema = "https://json-schemas.lens.dev/publications/text-only/3.0.0.json";
    mainContentFocus = PublicationMetadataMainFocusType.TextOnly;
  } else {
    const cleanedGifs = images?.map((item) => {
      if (item.type !== "image/png") {
        return item.media;
      }
    });
    const cleanedImages = images?.map((item) => {
      if (item?.type !== "image/gif") {
        return item.media;
      }
    });

    const mediaWithKeys = [
      ...(audio || []).map((audio) => ({
        type: "audio/mpeg",
        item: convertToFile(audio, "audio/mpeg"),
      })),
      ...(videos || []).map((video) => ({
        type: "video/mp4",
        item: convertToFile(video, "video/mp4"),
      })),
      ...(cleanedImages || []).map((image) => ({
        type: "image/png",
        item: image && convertToFile(image, "image/png"),
      })),
      ...[...(gifs || []), ...(cleanedGifs || [])].map((gif) => ({
        type: "image/gif",
        item: gif && convertToFile(gif, "image/gif"),
      })),
    ]
      ?.filter(Boolean)
      ?.filter((item) => item.item);

    const uploads = await Promise.all(
      mediaWithKeys.map(async (media) => {
        const response = await fetch("/api/ipfs", {
          method: "POST",
          body: media.item,
        });
        const responseJSON = await response.json();
        return { type: media?.type, item: "ipfs://" + responseJSON.cid };
      })
    );

    if (cover) {
      const loadedCover = await fetch("/api/ipfs", {
        method: "POST",
        body: convertToFile(cover, "image/png"),
      });
      const res = await loadedCover.json();
      coverJSON = "ipfs://" + res?.cid;
    }

    const primaryMedia = uploads[0];
    if (primaryMedia?.type === "video/mp4") {
      $schema = "https://json-schemas.lens.dev/publications/video/3.0.0.json";
      mainContentFocus = PublicationMetadataMainFocusType.Video;
      value = {
        video: {
          ...primaryMedia,
          cover: coverJSON ? coverJSON : undefined,
        },
      };
    } else if (primaryMedia?.type === "audio/mpeg") {
      $schema = "https://json-schemas.lens.dev/publications/audio/3.0.0.json";
      mainContentFocus = PublicationMetadataMainFocusType.Audio;
      value = {
        audio: {
          ...primaryMedia,
          cover: coverJSON ? coverJSON : undefined,
        },
      };
    } else {
      $schema = "https://json-schemas.lens.dev/publications/image/3.0.0.json";
      mainContentFocus = PublicationMetadataMainFocusType.Image;
      value = { image: primaryMedia };
    }

    const attachments = uploads.filter(
      (media) => media.item !== primaryMedia.item
    );

    if (attachments?.length > 0) {
      value = {
        ...value,
        attachments: attachments,
      };
    }
  }

  try {
    const object = {
      $schema,
      lens: {
        mainContentFocus,
        title: title ? title : contentText ? contentText.slice(0, 20) : "",
        content: contentText ? contentText : "",
        appId: "cyphersearch",
        ...value,
        id: uuidv4(),
        hideFromFeed: false,
        locale: "en",
        tags: tags || [],
      },
    };

    let cid: string = "";
    if (!skipUpload) {
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify(object),
      });
      let responseJSON = await response.json();
      cid = responseJSON?.cid;
    }

    return {
      string: "ipfs://" + cid,
      object,
    };
  } catch (err: any) {
    console.error(err.message);
  }
};

export default uploadPostContent;
