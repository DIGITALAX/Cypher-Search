import { createSlice } from "@reduxjs/toolkit";
import { Publication } from "@/components/Tiles/types/tiles.types";

export interface AllSearchItemsState {
  searchInput: string;
  items: Publication[];
  lensPubCursor?: string;
  lensProfileCursor?: string;
  pubProfileCursor?: string;
  videoCursor?: string;
  graphCursor?: number;
  kinoraCursor?: number;
  awardCursor?: number;
  communityCursor?: number;
  hasMore: boolean;
}

const initialAllSearchItemsState: AllSearchItemsState = {
  items: [],
  hasMore: true,
  searchInput: "",
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
          actionInput,
          actionLensPubCursor,
          actionGraphCursor,
          actionKinoraCursor,
          actionAwardCursor,
          actionLensProfileCursor,
          actionPubProfileCursor,
          actionVideoCursor,
          actionHasMore,
        },
      }
    ) => {
      state.items = actionItems;
      state.searchInput = actionInput;
      state.lensPubCursor = actionLensPubCursor;
      state.lensProfileCursor = actionLensProfileCursor;
      state.graphCursor = actionGraphCursor;
      state.kinoraCursor = actionKinoraCursor;
      state.awardCursor = actionAwardCursor;
      state.hasMore = actionHasMore;
      state.videoCursor = actionVideoCursor;
      state.pubProfileCursor = actionPubProfileCursor;
    },
  },
});

export const { setAllSearchItems } = allSearchItemsSlice.actions;

export default allSearchItemsSlice.reducer;
