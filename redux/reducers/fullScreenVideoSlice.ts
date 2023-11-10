import { createSlice } from "@reduxjs/toolkit";
import { Post, Quote } from "../../graphql/generated";

export interface FullScreenVideoState {
  open?: boolean;
  currentTime?: { [key: string]: number };
  duration?: { [key: string]: number };
  isPlaying?: { [key: string]: boolean };
  video?: { [key: string]: Post | Quote };
}

const initialFullScreenVideoState: FullScreenVideoState = {
  open: false,
};

export const fullScreenVideoSlice = createSlice({
  name: "fullScreenVideo",
  initialState: initialFullScreenVideoState,
  reducers: {
    setFullScreenVideo: (
      state: FullScreenVideoState,
      {
        payload: {
          actionOpen,
          actionTime,
          actionDuration,
          actionIsPlaying,
          actionVideo,
        },
      }
    ) => {
      state.open = actionOpen;
      state.currentTime = actionTime;
      state.duration = actionDuration;
      state.isPlaying = actionIsPlaying;
      state.video = actionVideo;
    },
  },
});

export const { setFullScreenVideo } = fullScreenVideoSlice.actions;

export default fullScreenVideoSlice.reducer;
