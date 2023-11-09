import { createSlice } from "@reduxjs/toolkit";
import { PrimaryPublication } from "../../graphql/generated";

export interface PostBoxState {
  open?: boolean;
  quote?: PrimaryPublication;
}

const initialPostBoxState: PostBoxState = {};

export const postBoxSlice = createSlice({
  name: "postBox",
  initialState: initialPostBoxState,
  reducers: {
    setPostBox: (
      state: PostBoxState,
      { payload: { actionOpen, actionQuote } }
    ) => {
      state.open = actionOpen;
      state.quote = actionQuote;
    },
  },
});

export const { setPostBox } = postBoxSlice.actions;

export default postBoxSlice.reducer;
