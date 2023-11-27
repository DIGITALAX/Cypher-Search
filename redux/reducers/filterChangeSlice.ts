import { FilterValues } from "@/components/Search/types/search.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FilterChangeState {
  change: boolean;
}

const initialFilterChangeState: FilterChangeState = {
  change: false,
};

export const filterChangeSlice = createSlice({
  name: "filterChange",
  initialState: initialFilterChangeState,
  reducers: {
    setFilterChange: (
      state: FilterChangeState,
      action: PayloadAction<boolean>
    ) => {
      state.change = action.payload;
    },
  },
});

export const { setFilterChange } = filterChangeSlice.actions;

export default filterChangeSlice.reducer;
