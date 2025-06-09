import {
  MediaImageMimeType,
  MediaVideoMimeType,
} from "@lens-protocol/metadata";
import { ChangeEvent } from "react";

const setPostMedia = async (
  e: ChangeEvent<HTMLInputElement>,
  type: string,
  id: string,
  media?: {
    [key: string]: {
      type: MediaImageMimeType | MediaVideoMimeType;
      item: string;
    }[];
  }
): Promise<
  | {
      [key: string]: {
        type: MediaImageMimeType | MediaVideoMimeType;
        item: string;
      }[];
    }
  | undefined
> => {
  if (!e.target.files) return;

  if (type === "video/mp4") {
    const videoReaders = Array.from(e.target.files).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

   return await Promise.all(videoReaders).then((newVideos: string[]) => {
      const images = { ...media };
      images[id] = [
        ...(images?.[id] || []),
        ...newVideos?.map((item) => ({
          item,
          type: "video/mp4" as MediaVideoMimeType,
        })),
      ];

      return images;
    });
  } else {
    let types: string[] = [];
    const imageReaders = Array.from(e.target.files).map((file) => {
      types.push(file.type);
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    return await Promise.all(imageReaders).then((newImages: string[]) => {
      const images = { ...media };
    
      images[id] = [
        ...(images?.[id] || []),
        ...newImages?.map((item) => ({
          item,
          type: "image/png" as MediaImageMimeType,
        })),
      ];

      return images;
    });
  }
};

export default setPostMedia;
