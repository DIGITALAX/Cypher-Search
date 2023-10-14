import { createSlice } from "@reduxjs/toolkit";

export interface MainVideoState {
  id: string;
  collected: boolean;
  liked: boolean;
  mirrored: boolean;
}

const initialMainVideoState: MainVideoState = {
  id: "0x01c6a9-0x41",
  collected: false,
  liked: false,
  mirrored: false,
};

export const mainVideoSlice = createSlice({
  name: "mainVideo",
  initialState: initialMainVideoState,
  reducers: {
    setMainVideo: (
      state: MainVideoState,
      {
        payload: {
          actionCollected,
          actionLiked,
          actionMirrored,
          actionId,
          actionLocal,
        },
      }
    ) => {
      state.collected = actionCollected;
      state.liked = actionLiked;
      state.mirrored = actionMirrored;
      state.id = actionId;
    },
  },
});

export const { setMainVideo } = mainVideoSlice.actions;

export default mainVideoSlice.reducer;
