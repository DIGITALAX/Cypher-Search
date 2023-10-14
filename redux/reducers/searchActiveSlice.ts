import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SearchActiveState {
  value: boolean;
}

const initialSearchActiveState: SearchActiveState = {
  value: false,
};

export const searchActiveSlice = createSlice({
  name: "searchActive",
  initialState: initialSearchActiveState,
  reducers: {
    setSearchActive: (
      state: SearchActiveState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setSearchActive } = searchActiveSlice.actions;

export default searchActiveSlice.reducer;
