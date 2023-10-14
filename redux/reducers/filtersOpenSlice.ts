import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FiltersOpenState {
  value: boolean;
}

const initialFiltersOpenState: FiltersOpenState = {
  value: false,
};

export const filtersOpenSlice = createSlice({
  name: "filtersOpen",
  initialState: initialFiltersOpenState,
  reducers: {
    setFiltersOpen: (
      state: FiltersOpenState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setFiltersOpen } = filtersOpenSlice.actions;

export default filtersOpenSlice.reducer;
