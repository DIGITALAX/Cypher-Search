import { FilterValues } from "@/components/Search/types/search.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FilterConstantsState {
  items: FilterValues | undefined;
}

const initialFilterConstantsState: FilterConstantsState = {
  items: undefined,
};

export const filterConstantsSlice = createSlice({
  name: "filterConstants",
  initialState: initialFilterConstantsState,
  reducers: {
    setFilterConstants: (
      state: FilterConstantsState,
      action: PayloadAction<FilterValues>
    ) => {
      state.items = action.payload;
    },
  },
});

export const { setFilterConstants } = filterConstantsSlice.actions;

export default filterConstantsSlice.reducer;
