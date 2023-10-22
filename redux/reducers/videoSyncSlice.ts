import { createSlice } from "@reduxjs/toolkit";

export interface VideoSyncState {
  duration: number;
  currentTime: number;
  heart: boolean;
  isPlaying: boolean;
}

const initialVideoSyncState: VideoSyncState = {
  duration: 0,
  currentTime: 0,
  heart: false,
  isPlaying: false,
};

export const videoSyncSlice = createSlice({
  name: "videoSync",
  initialState: initialVideoSyncState,
  reducers: {
    setVideoSync: (
      state: VideoSyncState,
      {
        payload: {
          actionDuration,
          actionCurrentTime,
          actionHeart,
          actionIsPlaying,
        },
      }
    ) => {
      state.duration = actionDuration;
      state.currentTime = actionCurrentTime;
      state.heart = actionHeart;
      state.isPlaying = actionIsPlaying;
    },
  },
});

export const { setVideoSync } = videoSyncSlice.actions;

export default videoSyncSlice.reducer;
