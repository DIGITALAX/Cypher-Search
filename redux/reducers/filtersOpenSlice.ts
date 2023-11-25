import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FiltersOpenState {
  value: boolean;
  allow: boolean;
}

const initialFiltersOpenState: FiltersOpenState = {
  value: false,
  allow: true,
};

export const filtersOpenSlice = createSlice({
  name: "filtersOpen",
  initialState: initialFiltersOpenState,
  reducers: {
    setFiltersOpen: (
      state: FiltersOpenState,
      { payload: { actionValue, actionAllow } }
    ) => {
      state.value = actionValue;
      state.allow = actionAllow;
    },
  },
});

export const { setFiltersOpen } = filtersOpenSlice.actions;

export default filtersOpenSlice.reducer;
