import { createSlice } from "@reduxjs/toolkit";

export interface FullScreenVideoState {
  open?: boolean;
  id?: string;
  currentTime?: number;
  duration?: number;
  isPlaying?: boolean;
  video?: string;
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
          actionId,
          actionTime,
          actionDuration,
          actionIsPlaying,
          actionVideo,
        },
      }
    ) => {
      state.open = actionOpen;
      state.id = actionId;
      state.currentTime = actionTime;
      state.duration = actionDuration;
      state.isPlaying = actionIsPlaying;
      state.video = actionVideo;
    },
  },
});

export const { setFullScreenVideo } = fullScreenVideoSlice.actions;

export default fullScreenVideoSlice.reducer;
