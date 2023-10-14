import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartAnimState {
  value: boolean;
}

const initialCartAnimState: CartAnimState = {
  value: false,
};

export const cartAnimSlice = createSlice({
  name: "cartAnim",
  initialState: initialCartAnimState,
  reducers: {
    setCartAnim: (state: CartAnimState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setCartAnim } = cartAnimSlice.actions;

export default cartAnimSlice.reducer;
