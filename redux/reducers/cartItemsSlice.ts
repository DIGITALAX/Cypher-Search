import { CartItem } from "@/components/Layout/types/footer.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItemsState {
  items: CartItem[];
}

const initialCartItemsState: CartItemsState = {
  items: [],
};

export const cartItemsSlice = createSlice({
  name: "cartItems",
  initialState: initialCartItemsState,
  reducers: {
    setCartItems: (
      state: CartItemsState,
      action: PayloadAction<CartItem[]>
    ) => {
      state.items = action.payload;
    },
  },
});

export const { setCartItems } = cartItemsSlice.actions;

export default cartItemsSlice.reducer;
