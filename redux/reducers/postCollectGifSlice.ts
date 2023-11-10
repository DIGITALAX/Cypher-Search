import { createSlice } from "@reduxjs/toolkit";
import { SimpleCollectOpenActionModuleInput } from "../../graphql/generated";

export interface PostCollectGifState {
  type?: string;
  id?: string;
  collectTypes?: {
    [key: string]: SimpleCollectOpenActionModuleInput | undefined;
  };
  gifs?: { [key: string]: string[] };
}

const initialPostCollectGifState: PostCollectGifState = {};

export const postCollectGifSlice = createSlice({
  name: "postCollectGif",
  initialState: initialPostCollectGifState,
  reducers: {
    setPostCollectGif: (
      state: PostCollectGifState,
      { payload: { actionType, actionCollectType, actionGifs } }
    ) => {
      state.type = actionType;
      state.collectTypes = actionCollectType;
      state.gifs = actionGifs;
    },
  },
});

export const { setPostCollectGif } = postCollectGifSlice.actions;

export default postCollectGifSlice.reducer;
