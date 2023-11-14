import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface IsDesignerState {
  value: boolean;
}

const initialIsDesignerState: IsDesignerState = {
  value: false,
};

export const isDesignerSlice = createSlice({
  name: "isDesigner",
  initialState: initialIsDesignerState,
  reducers: {
    setIsDesigner: (state: IsDesignerState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setIsDesigner } = isDesignerSlice.actions;

export default isDesignerSlice.reducer;
