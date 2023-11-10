import { MakePostComment } from "@/components/Autograph/types/autograph.types";
import { ChangeEvent, SetStateAction } from "react";

const setPostMedia = async (
  e: ChangeEvent<HTMLInputElement>,
  type: string,
  setMakePostComment: (e: SetStateAction<MakePostComment[]>) => void,
  setContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void,
  index: number
) => {
  if (!e.target.files) return;

  if (type === "video") {
    setContentLoading((prev) => {
      const arr = [...prev];
      arr[index] = {
        ...arr[index],
        video: true,
      };
      return arr;
    });
    const videoReaders = Array.from(e.target.files).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    await Promise.all(videoReaders).then((newVideos: string[]) => {
      setMakePostComment((prev) => {
        const arr = [...prev];
        arr[index] = {
          ...arr[index],
          videos: [...prev[index].videos, ...newVideos] as string[],
        };
        return arr;
      });
    });
    setContentLoading((prev) => {
      const arr = [...prev];
      arr[index] = {
        ...arr[index],
        video: false,
      };
      return arr;
    });
  } else {
    setContentLoading((prev) => {
      const arr = [...prev];
      arr[index] = {
        ...arr[index],
        image: true,
      };
      return arr;
    });
    const imageReaders = Array.from(e.target.files).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    await Promise.all(imageReaders).then((newImages: string[]) => {
      setMakePostComment((prev) => {
        const arr = [...prev];
        arr[index] = {
          ...arr[index],
          images: [...prev[index].images, ...newImages] as string[],
        };
        return arr;
      });
    });
    setContentLoading((prev) => {
      const arr = [...prev];
      arr[index] = {
        ...arr[index],
        image: false,
      };
      return arr;
    });
  }
};

export default setPostMedia;
