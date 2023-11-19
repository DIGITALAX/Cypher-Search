import { v4 as uuidv4 } from "uuid";
import { PublicationMetadataMainFocusType } from "../../graphql/generated";

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
  skipUpload?: boolean
): Promise<{ string: string; object: Object } | undefined> => {
  let $schema: string,
    mainContentFocus: PublicationMetadataMainFocusType,
    value: object = {};

  if (
    images.length < 1 &&
    gifs.length < 1 &&
    videos.length < 1 &&
    audio?.length < 1
  ) {
    $schema = "https://json-schemas.lens.dev/publications/text/3.0.0.json";
    mainContentFocus = PublicationMetadataMainFocusType.TextOnly;
  } else {
    const cleanedGifs = images?.map((item) => {
      if (item.type !== "image/png") {
        return item.media;
      }
    });
    const cleanedImages = images?.map((item) => {
      if (item.type !== "image/gif") {
        return item.media;
      }
    });

    const mediaWithKeys = [
      ...audio.map((audio) => ({ type: "audio/mpeg", item: audio })),
      ...videos.map((video) => ({ type: "video/mp4", item: video })),
      ...cleanedImages.map((image) => ({
        type: "image/png",
        item: image,
      })),
      ...[...gifs, ...cleanedGifs].map((gif) => ({
        type: "image/gif",
        item: gif,
      })),
    ];

    const uploads = await Promise.all(
      mediaWithKeys.map(async (media) => {
        const response = await fetch("/api/ipfs", {
          method: "POST",
          body: media.item,
        });
        const responseJSON = await response.json();
        return { type: media.type, item: "ipfs://" + responseJSON.cid };
      })
    );

    const firstImage = uploads.find(
      (img) => img.type === "image/png" || img.type === "image/gif"
    );

    const primaryMedia = uploads[0];
    if (primaryMedia.type === "video/mp4") {
      $schema = "https://json-schemas.lens.dev/publications/video/3.0.0.json";
      mainContentFocus = PublicationMetadataMainFocusType.Video;
      value = {
        video: {
          ...primaryMedia,
          cover: firstImage ? firstImage : undefined,
        },
      };
    } else if (primaryMedia.type === "audio/mpeg") {
      $schema = "https://json-schemas.lens.dev/publications/audio/3.0.0.json";
      mainContentFocus = PublicationMetadataMainFocusType.Audio;
      value = {
        audio: {
          ...primaryMedia,
          cover: firstImage ? firstImage : undefined,
        },
      };
    } else {
      $schema = "https://json-schemas.lens.dev/publications/image/3.0.0.json";
      mainContentFocus = PublicationMetadataMainFocusType.Image;
      value = { image: primaryMedia };
    }

    value = {
      ...value,
      attachments: uploads.slice(1),
    };
  }

  try {
    let cid: string = "";
    if (!skipUpload) {
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify({
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
            tags: [...(tags || []), "cypher", "cyphersearch"],
          },
        }),
      });
      let responseJSON = await response.json();
      cid = responseJSON?.cid;
    }

    return {
      string: "ipfs://" + cid,
      object: {
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
          tags: [...(tags || []), "cypher", "cyphersearch"],
        },
      },
    };
  } catch (err: any) {
    console.error(err.message);
  }
};

export default uploadPostContent;
