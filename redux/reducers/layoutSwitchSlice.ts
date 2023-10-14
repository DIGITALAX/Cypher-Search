import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LayoutSwitchState {
  value: number;
}

const initialLayoutSwitchState: LayoutSwitchState = {
  value: 3,
};

export const layoutSwitchSlice = createSlice({
  name: "layoutSwitch",
  initialState: initialLayoutSwitchState,
  reducers: {
    setLayoutSwitch: (
      state: LayoutSwitchState,
      action: PayloadAction<number>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setLayoutSwitch } = layoutSwitchSlice.actions;

export default layoutSwitchSlice.reducer;
