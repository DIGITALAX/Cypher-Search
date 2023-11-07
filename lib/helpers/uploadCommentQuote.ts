import { v4 as uuidv4 } from "uuid";
import { PublicationMetadataMainFocusType } from "../../graphql/generated";

const uploadCommentQuoteContent = async (
  contentText: string | undefined,
  images: HTMLImageElement[],
  videos: HTMLVideoElement[],
  gifs: string[]
): Promise<string | undefined> => {
  let $schema: string,
    mainContentFocus: PublicationMetadataMainFocusType,
    value;
  if (images.length < 1 && gifs.length < 1 && videos.length < 1) {
    $schema = "https://json-schemas.lens.dev/publications/text/3.0.0.json";
    mainContentFocus = PublicationMetadataMainFocusType.TextOnly;
  } else if (videos.length > 0) {
    $schema = "https://json-schemas.lens.dev/publications/video/3.0.0.json";
    mainContentFocus = PublicationMetadataMainFocusType.Video;
    value = {
      video: videos[0],
      attachments: videos,
    };
  } else {
    $schema = "https://json-schemas.lens.dev/publications/image/3.0.0.json";
    mainContentFocus = PublicationMetadataMainFocusType.Image;
    value = {
      image: images[0],
      attachments: images,
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

export default uploadCommentQuoteContent;
