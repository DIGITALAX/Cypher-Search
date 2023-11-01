import { createSlice } from "@reduxjs/toolkit";
import { SimpleCollectOpenActionModuleInput } from "../../graphql/generated";

export interface LastQuoteCommentState {
  content: string | undefined;
  images: HTMLImageElement[];
  gifs: string[];
  videos: HTMLVideoElement[];
  collectType: SimpleCollectOpenActionModuleInput | undefined;
}

const initialLastQuoteCommentState: LastQuoteCommentState = {
  content: undefined,
  images: [],
  gifs: [],
  videos: [],
  collectType: undefined,
};

export const lastQuoteCommentSlice = createSlice({
  name: "lastQuoteComment",
  initialState: initialLastQuoteCommentState,
  reducers: {
    setLastQuoteComment: (
      state: LastQuoteCommentState,
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
      state.gifs = actionGifs;
      state.videos = actionVideos;
      state.collectType = actionCollectType;
    },
  },
});

export const { setLastQuoteComment } = lastQuoteCommentSlice.actions;

export default lastQuoteCommentSlice.reducer;
