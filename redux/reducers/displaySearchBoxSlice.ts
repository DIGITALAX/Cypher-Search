import { SortType } from "@/components/Autograph/types/autograph.types";
import { createSlice } from "@reduxjs/toolkit";

export interface DisplaySearchBoxState {
  value?: number;
  type?: SortType;
}

const initialDisplaySearchBoxState: DisplaySearchBoxState = {
  value: undefined,
  type: undefined,
};

export const displaySearchBoxSlice = createSlice({
  name: "displaySearchBox",
  initialState: initialDisplaySearchBoxState,
  reducers: {
    setDisplaySearchBox: (
      state: DisplaySearchBoxState,
      { payload: { actionValue, actionType } }
    ) => {
      state.value = actionValue;
      state.type = actionType;
    },
  },
});

export const { setDisplaySearchBox } = displaySearchBoxSlice.actions;

export default displaySearchBoxSlice.reducer;
