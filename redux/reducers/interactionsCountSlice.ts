import { createSlice } from "@reduxjs/toolkit";

export interface InteractionsCountState {
  likes: number[];
  mirrors: number[];
  quotes: number[];
  collects: number[];
  comments: number[];
  hasLiked: boolean[];
  hasMirrored: boolean[];
  hasCollected: boolean[];
}

const initialInteractionsCountState: InteractionsCountState = {
  likes: [],
  mirrors: [],
  quotes: [],
  collects: [],
  comments: [],
  hasLiked: [],
  hasMirrored: [],
  hasCollected: [],
};

export const interactionsCountSlice = createSlice({
  name: "interactionsCount",
  initialState: initialInteractionsCountState,
  reducers: {
    setInteractionsCount: (
      state: InteractionsCountState,
      {
        payload: {
          actionLikes,
          actionMirrors,
          actionQuotes,
          actionCollects,
          actionComments,
          actionHasLiked,
          actionHasCollected,
          actionHasMirrored,
        },
      }
    ) => {
      state.likes = actionLikes;
      state.mirrors = actionMirrors;
      state.quotes = actionQuotes;
      state.collects = actionCollects;
      state.comments = actionComments;
      state.hasLiked = actionHasLiked;
      state.hasMirrored = actionHasMirrored;
      state.hasCollected = actionHasCollected;
    },
  },
});

export const { setInteractionsCount } = interactionsCountSlice.actions;

export default interactionsCountSlice.reducer;
