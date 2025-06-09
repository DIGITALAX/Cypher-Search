import { MediaAudio, MediaImage, MediaVideo } from "@lens-protocol/client";
import { handleImage } from "./handleImage";

export const handleMedia = (
  media: MediaImage | MediaAudio | MediaVideo
):
  | {
      url: string;
      type: "Image" | "Video" | "Audio";
      cover?: string;
    }
  | undefined => {
  switch (media?.__typename) {
    case "MediaAudio":
      return {
        url: handleImage(media?.item),
        type: "Audio",
        cover: handleImage(media?.cover),
      };

    case "MediaImage":
      return {
        url: handleImage(media?.item),
        type: "Image",
      };

    case "MediaVideo":
      return {
        url: handleImage(media?.item),
        type: "Video",
        cover: handleImage(media?.cover),
      };
  }
};
