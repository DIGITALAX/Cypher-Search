import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FullScreenVideoState {
  value: boolean;
}

const initialFullScreenVideoState: FullScreenVideoState = {
  value: false,
};

export const fullScreenVideoSlice = createSlice({
  name: "fullScreenVideo",
  initialState: initialFullScreenVideoState,
  reducers: {
    setFullScreenVideo: (
      state: FullScreenVideoState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setFullScreenVideo } = fullScreenVideoSlice.actions;

export default fullScreenVideoSlice.reducer;
