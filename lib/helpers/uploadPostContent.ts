import { v4 as uuidv4 } from "uuid";
import { PublicationMetadataMainFocusType } from "../../graphql/generated";

const uploadPostContent = async (
  contentText: string | undefined,
  images: string[],
  videos: string[],
  gifs: string[]
): Promise<string | undefined> => {
  let $schema: string,
    mainContentFocus: PublicationMetadataMainFocusType,
    value: object = {};

  if (images.length < 1 && gifs.length < 1 && videos.length < 1) {
    $schema = "https://json-schemas.lens.dev/publications/text/3.0.0.json";
    mainContentFocus = PublicationMetadataMainFocusType.TextOnly;
  } else {
    const mediaWithKeys = [
      ...videos.map((video) => ({ type: "video/mp4", item: video })),
      ...images.map((image) => ({ type: "image/png", item: image })),
      ...gifs.map((gif) => ({ type: "image/gif", item: gif })),
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

    const primaryMedia = uploads[0];
    if (primaryMedia.type === "video/mp4") {
      $schema = "https://json-schemas.lens.dev/publications/video/3.0.0.json";
      mainContentFocus = PublicationMetadataMainFocusType.Video;
      value = { video: primaryMedia };
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
    const response = await fetch("/api/ipfs", {
      method: "POST",
      body: JSON.stringify({
        $schema,
        lens: {
          mainContentFocus,
          title: contentText ? contentText.slice(0, 20) : "",
          content: contentText ? contentText : "",
          appId: "cyphersearch",
          ...value,
          id: uuidv4(),
          hideFromFeed: false,
          locale: "en",
          tags: ["cypher", "cyphersearch"],
        },
      }),
    });
    if (response.status === 200) {
      let responseJSON = await response.json();
      return "ipfs://" + responseJSON.cid;
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default uploadPostContent;
