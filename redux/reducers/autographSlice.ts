import { createSlice } from "@reduxjs/toolkit";
import { Profile } from "../../graphql/generated";
import { Creation } from "@/components/Tiles/types/tiles.types";

export interface AutographState {
  collected: Creation[] | undefined;
  created: Creation[] | undefined;
  profile: Profile | undefined;
  owner: boolean;
}

const initialAutographState: AutographState = {
  collected: undefined,
  created: undefined,
  profile: undefined,
  owner: false,
};

export const autographSlice = createSlice({
  name: "autograph",
  initialState: initialAutographState,
  reducers: {
    setAutograph: (
      state: AutographState,
      {
        payload: { actionProfile, actionCollected, actionCreated, actionOwner },
      }
    ) => {
      state.collected = actionCollected;
      state.created = actionCreated;
      state.profile = actionProfile;
      state.owner = actionOwner;
    },
  },
});

export const { setAutograph } = autographSlice.actions;

export default autographSlice.reducer;
