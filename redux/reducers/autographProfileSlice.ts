import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Profile } from "../../graphql/generated";

export interface AutographProfileState {
  profile: Profile | undefined;
}

const initialAutographProfileState: AutographProfileState = {
  profile: undefined,
};

export const autographProfileSlice = createSlice({
  name: "autographProfile",
  initialState: initialAutographProfileState,
  reducers: {
    setAutographProfile: (
      state: AutographProfileState,
      action: PayloadAction<Profile | undefined>
    ) => {
      state.profile = action.payload;
    },
  },
});

export const { setAutographProfile } = autographProfileSlice.actions;

export default autographProfileSlice.reducer;
