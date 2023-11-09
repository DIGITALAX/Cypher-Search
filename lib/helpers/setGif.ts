import { MakePostComment } from "@/components/Autograph/types/autograph.types";
import { SetStateAction } from "react";

const setGif = async (
  search: string,
  setMakePostComment: (e: SetStateAction<MakePostComment[]>) => void,
  setContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
        gif: boolean;
      }[]
    >
  ) => void,
  index: number
) => {
  try {
    setContentLoading((prev) => {
      const arr = [...prev];
      arr[index] = {
        ...arr[index],
        gif: true,
      };
      return arr;
    });
    const response = await fetch("/api/giphy", {
      method: "POST",
      body: search,
    });
    const allGifs = await response.json();
    setMakePostComment((prev) => {
      const arr = [...prev];
      arr[index] = {
        ...arr[index],
        searchedGifs: allGifs?.json?.results,
      };
      return arr;
    });
    setContentLoading((prev) => {
      const arr = [...prev];
      arr[index] = {
        ...arr[index],
        gif: false,
      };
      return arr;
    });
  } catch (err: any) {
    console.error(err.message);
  }
};

export default setGif;
