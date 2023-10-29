import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Profile } from "../../graphql/generated";

export interface CachedProfilesState {
  profiles: { [key: string]: Profile } | undefined;
}

const initialCachedProfilesState: CachedProfilesState = {
  profiles: undefined,
};

export const cachedProfilesSlice = createSlice({
  name: "cachedProfiles",
  initialState: initialCachedProfilesState,
  reducers: {
    setCachedProfiles: (
      state: CachedProfilesState,
      action: PayloadAction<{ [key: string]: Profile }>
    ) => {
      state.profiles = action.payload;
    },
  },
});

export const { setCachedProfiles } = cachedProfilesSlice.actions;

export default cachedProfilesSlice.reducer;
