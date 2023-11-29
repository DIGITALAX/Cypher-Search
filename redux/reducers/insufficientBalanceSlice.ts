import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InsufficientBalanceState {
  value: boolean;
}

const initialInsufficientBalanceState: InsufficientBalanceState = {
  value: false,
};

export const InsufficientBalanceSlice = createSlice({
  name: "InsufficientBalance",
  initialState: initialInsufficientBalanceState,
  reducers: {
    setInsufficientBalance: (
      state: InsufficientBalanceState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setInsufficientBalance } = InsufficientBalanceSlice.actions;

export default InsufficientBalanceSlice.reducer;
