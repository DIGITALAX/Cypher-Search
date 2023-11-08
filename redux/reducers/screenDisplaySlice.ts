import { ScreenDisplay } from "@/components/Autograph/types/autograph.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ScreenDisplayState {
  value: ScreenDisplay;
}

const initialScreenDisplayState: ScreenDisplayState = {
  value: ScreenDisplay.Display,
};

export const screenDisplaySlice = createSlice({
  name: "screenDisplay",
  initialState: initialScreenDisplayState,
  reducers: {
    setScreenDisplay: (
      state: ScreenDisplayState,
      action: PayloadAction<ScreenDisplay>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setScreenDisplay } = screenDisplaySlice.actions;

export default screenDisplaySlice.reducer;
