import { createSlice } from "@reduxjs/toolkit";
import { Quote } from "../../graphql/generated";

export interface PostBoxState {
  open?: boolean;
  id?: string;
  quote?: Quote;
}

const initialPostBoxState: PostBoxState = {};

export const postBoxSlice = createSlice({
  name: "postBox",
  initialState: initialPostBoxState,
  reducers: {
    setPostBox: (
      state: PostBoxState,
      { payload: { actionOpen, actionId, actionQuote } }
    ) => {
      state.open = actionOpen;
      state.id = actionId;
      state.quote = actionQuote;
    },
  },
});

export const { setPostBox } = postBoxSlice.actions;

export default postBoxSlice.reducer;
