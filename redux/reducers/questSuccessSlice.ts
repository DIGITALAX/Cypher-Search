import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface QuestSuccessState {
  value: boolean;
}

const initialQuestSuccessState: QuestSuccessState = {
  value: false,
};

export const questSuccessSlice = createSlice({
  name: "questSuccess",
  initialState: initialQuestSuccessState,
  reducers: {
    setQuestSuccess: (
      state: QuestSuccessState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setQuestSuccess } = questSuccessSlice.actions;

export default questSuccessSlice.reducer;
