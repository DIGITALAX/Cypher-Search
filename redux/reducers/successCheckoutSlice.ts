import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SuccessCheckoutState {
  value: boolean;
}

const initialSuccessCheckoutState: SuccessCheckoutState = {
  value: false,
};

export const successCheckoutSlice = createSlice({
  name: "successCheckout",
  initialState: initialSuccessCheckoutState,
  reducers: {
    setSuccessCheckout: (
      state: SuccessCheckoutState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setSuccessCheckout } = successCheckoutSlice.actions;

export default successCheckoutSlice.reducer;
