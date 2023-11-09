import { createSlice } from "@reduxjs/toolkit";
import {
  CollectOpenActionModuleType,
  FollowModuleInput,
  MultirecipientFeeCollectModuleInput,
  SimpleCollectOpenActionModuleInput,
} from "../../graphql/generated";

export interface FollowCollectState {
  type: "Follow" | "Collect" | undefined;
  collect?: {
    collectType: CollectOpenActionModuleType;
    values:
      | SimpleCollectOpenActionModuleInput
      | MultirecipientFeeCollectModuleInput;
  };
  follower?: FollowModuleInput;
}

const initialFollowCollectState: FollowCollectState = {
  type: undefined,
};

export const followCollectSlice = createSlice({
  name: "followCollect",
  initialState: initialFollowCollectState,
  reducers: {
    setFollowCollect: (
      state: FollowCollectState,
      { payload: { actionType, actionCollect, actionFollower } }
    ) => {
      state.type = actionType;
      state.collect = actionCollect;
      state.follower = actionFollower;
    },
  },
});

export const { setFollowCollect } = followCollectSlice.actions;

export default followCollectSlice.reducer;
