import { createSlice } from "@reduxjs/toolkit";
import { Publication } from "@/components/Tiles/types/tiles.types";

export interface AllSearchItemsState {
  items: Publication[];
  lensPubCursor?: string;
  lensProfileCursor?: string;
  graphCursor?: number;
  hasMore: boolean;
}

const initialAllSearchItemsState: AllSearchItemsState = {
  items: [],
  hasMore: true,
};

export const allSearchItemsSlice = createSlice({
  name: "allSearchItems",
  initialState: initialAllSearchItemsState,
  reducers: {
    setAllSearchItems: (
      state: AllSearchItemsState,
      {
        payload: {
          actionItems,
          actionLensPubCursor,
          actionGraphCursor,
          actionLensProfileCursor,
          actionHasMore,
        },
      }
    ) => {
      state.items = actionItems;
      state.lensPubCursor = actionLensPubCursor;
      state.lensProfileCursor = actionLensProfileCursor;
      state.graphCursor = actionGraphCursor;
      state.hasMore = actionHasMore;
    },
  },
});

export const { setAllSearchItems } = allSearchItemsSlice.actions;

export default allSearchItemsSlice.reducer;
