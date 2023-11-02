import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Mirror, Post, Quote } from "../../graphql/generated";

export interface AutographFeedState {
  feed: (Post | Quote | Mirror)[];
}

const initialAutographFeedState: AutographFeedState = {
  feed: [],
};

export const autographFeedSlice = createSlice({
  name: "autographFeed",
  initialState: initialAutographFeedState,
  reducers: {
    setAutographFeed: (
      state: AutographFeedState,
      action: PayloadAction<(Post | Quote | Mirror)[]>
    ) => {
      state.feed = action.payload;
    },
  },
});

export const { setAutographFeed } = autographFeedSlice.actions;

export default autographFeedSlice.reducer;
