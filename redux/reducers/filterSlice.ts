import { Filter } from "@/components/Search/types/search.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FilterState {
  filter: Filter;
}

const initialFilterState: FilterState = {
  filter: {
    hashtag: "",
    community: "",
    microbrand: "",
    publication: "",
    access: "",
    format: "",
    origin: "",
    editions: 1,
    available: true,
    fulfiller: "",
    drop: "",
    size: {
      apparel: [],
      poster: [],
      sticker: [],
    },
    color: [],
    price: {
      min: 0,
      max: 500,
    },
    token: "",
    printType: [],
  },
};

export const filterSlice = createSlice({
  name: "filter",
  initialState: initialFilterState,
  reducers: {
    setFilter: (state: FilterState, action: PayloadAction<Filter>) => {
      state.filter = action.payload;
    },
  },
});

export const { setFilter } = filterSlice.actions;

export default filterSlice.reducer;
