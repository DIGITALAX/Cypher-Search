import { createSlice } from "@reduxjs/toolkit";

export interface ReportPubState {
  open: boolean;
  for?: string;
}

const initialReportPubState: ReportPubState = {
  open: false,
};

export const reportPubSlice = createSlice({
  name: "reportPub",
  initialState: initialReportPubState,
  reducers: {
    setReportPub: (
      state: ReportPubState,
      { payload: { actionOpen, actionFor } }
    ) => {
      state.open = actionOpen;
      state.for = actionFor;
    },
  },
});

export const { setReportPub } = reportPubSlice.actions;

export default reportPubSlice.reducer;
