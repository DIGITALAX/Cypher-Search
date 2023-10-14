import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MapState {
  value: boolean;
}

const initialMapState: MapState = {
  value: false,
};

export const mapSlice = createSlice({
  name: "map",
  initialState: initialMapState,
  reducers: {
    setMap: (state: MapState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setMap } = mapSlice.actions;

export default mapSlice.reducer;
