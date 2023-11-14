import { createSlice } from "@reduxjs/toolkit";

export interface PostSuccessState {
  value: string | undefined;
  pubId: string | undefined;
}

const initialPostSuccessState: PostSuccessState = {
  value: undefined,
  pubId: undefined,
};

export const postSuccessSlice = createSlice({
  name: "postSuccess",
  initialState: initialPostSuccessState,
  reducers: {
    setPostSuccess: (
      state: PostSuccessState,
      { payload: { actionValue, actionPubId } }
    ) => {
      state.value = actionValue;
      state.pubId = actionPubId;
    },
  },
});

export const { setPostSuccess } = postSuccessSlice.actions;

export default postSuccessSlice.reducer;
