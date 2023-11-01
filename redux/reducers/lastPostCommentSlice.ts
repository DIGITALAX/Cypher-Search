import { createSlice } from "@reduxjs/toolkit";
import { SimpleCollectOpenActionModuleInput } from "../../graphql/generated";

export interface LastPostCommentState {
  content: string | undefined;
  images: HTMLImageElement[];
  gifs: string[];
  videos: HTMLVideoElement[];
  collectType: SimpleCollectOpenActionModuleInput | undefined;
}

const initialLastPostCommentState: LastPostCommentState = {
  content: undefined,
  images: [],
  gifs: [],
  videos: [],
  collectType: undefined,
};

export const lastPostCommentSlice = createSlice({
  name: "lastPostComment",
  initialState: initialLastPostCommentState,
  reducers: {
    setLastPostComment: (
      state: LastPostCommentState,
      {
        payload: {
          actionContent,
          actionImages,
          actionGifs,
          actionCollectType,
          actionVideos,
        },
      }
    ) => {
      state.content = actionContent;
      state.images = actionImages;
      state.videos = actionVideos;
      state.gifs = actionGifs;
      state.collectType = actionCollectType;
    },
  },
});

export const { setLastPostComment } = lastPostCommentSlice.actions;

export default lastPostCommentSlice.reducer;
