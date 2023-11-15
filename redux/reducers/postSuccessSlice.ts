import { createSlice } from "@reduxjs/toolkit";

export interface PostSuccessState {
  value: string | undefined;
  pubId: string | undefined;
  type: string | undefined;
}

const initialPostSuccessState: PostSuccessState = {
  value: undefined,
  pubId: undefined,
  type: undefined,
};

export const postSuccessSlice = createSlice({
  name: "postSuccess",
  initialState: initialPostSuccessState,
  reducers: {
    setPostSuccess: (
      state: PostSuccessState,
      { payload: { actionValue, actionPubId, actionType } }
    ) => {
      state.value = actionValue;
      state.pubId = actionPubId;
      state.type = actionType;
    },
  },
});

export const { setPostSuccess } = postSuccessSlice.actions;

export default postSuccessSlice.reducer;
