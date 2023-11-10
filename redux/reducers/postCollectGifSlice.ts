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

const initialPostCollectGifState: PostCollectGifState = {
  collectTypes: {},
  gifs: {},
};

export const postCollectGifSlice = createSlice({
  name: "postCollectGif",
  initialState: initialPostCollectGifState,
  reducers: {
    setPostCollectGif: (
      state: PostCollectGifState,
      { payload: { actionType, actionId, actionCollectTypes, actionGifs } }
    ) => {
      state.type = actionType;
      state.id = actionId;
      state.collectTypes = actionCollectTypes;
      state.gifs = actionGifs;
    },
  },
});

export const { setPostCollectGif } = postCollectGifSlice.actions;

export default postCollectGifSlice.reducer;
