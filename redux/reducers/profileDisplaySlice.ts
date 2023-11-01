import { Display } from "@/components/Autograph/types/autograph.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProfileDisplayState {
  value?: Display;
}

const initialProfileDisplayState: ProfileDisplayState = {
  value: undefined,
};

export const profileDisplaySlice = createSlice({
  name: "profileDisplay",
  initialState: initialProfileDisplayState,
  reducers: {
    setProfileDisplay: (
      state: ProfileDisplayState,
      action: PayloadAction<Display | undefined>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setProfileDisplay } = profileDisplaySlice.actions;

export default profileDisplaySlice.reducer;
