import { CartItem } from "@/components/Common/types/common.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ClaimProfileState {
  value: boolean;
}

const initialClaimProfileState: ClaimProfileState = {
  value: false,
};

export const claimProfileSlice = createSlice({
  name: "claimProfile",
  initialState: initialClaimProfileState,
  reducers: {
    setClaimProfile: (
      state: ClaimProfileState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setClaimProfile } = claimProfileSlice.actions;

export default claimProfileSlice.reducer;
