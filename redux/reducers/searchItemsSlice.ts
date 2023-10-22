import { createSlice } from "@reduxjs/toolkit";
import { Post } from "../../graphql/generated";

export interface AllSearchItemsState {
  items: Post[];
  cursor?: string;
}

const initialAllSearchItemsState: AllSearchItemsState = {
  items: [],
  cursor: undefined,
};

export const allSearchItemsSlice = createSlice({
  name: "allSearchItems",
  initialState: initialAllSearchItemsState,
  reducers: {
    setAllSearchItems: (
      state: AllSearchItemsState,
      { payload: { actionItems, actionCursor } }
    ) => {
      state.items = actionItems;
      state.cursor = actionCursor;
    },
  },
});

export const { setAllSearchItems } = allSearchItemsSlice.actions;

export default allSearchItemsSlice.reducer;
