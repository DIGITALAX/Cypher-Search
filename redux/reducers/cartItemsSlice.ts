import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum ItemType {
  Chromadin = "chromadin",
  CoinOp = "coinOp",
  Legend = "legend",
}

export interface CartItemsState {
  items: {
    size: string | undefined;
    color: string | undefined;
    amount: number;
    id: string;
    level: number | undefined;
    type: ItemType;
  }[];
}

const initialCartItemsState: CartItemsState = {
  items: [],
};

export const cartItemsSlice = createSlice({
  name: "cartItems",
  initialState: initialCartItemsState,
  reducers: {
    setCartItems: (state: CartItemsState, action: PayloadAction<any[]>) => {
      state.items = action.payload;
    },
  },
});

export const { setCartItems } = cartItemsSlice.actions;

export default cartItemsSlice.reducer;
