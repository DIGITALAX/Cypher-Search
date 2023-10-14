import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LensConnectedState {
  profile:
    | {
        appId?: string;
        attributes?: {
          key: string;
          type: any;
          value: any;
        }[];
        bio?: string;
        coverPicture?: string;
        id: string;
        name?: string;
        picture?: string;
      }
    | undefined;
}

const initialLensConnectedState: LensConnectedState = {
  profile: undefined,
};

export const lensConnectedSlice = createSlice({
  name: "lensConnected",
  initialState: initialLensConnectedState,
  reducers: {
    setLensConnected: (
      state: LensConnectedState,
      action: PayloadAction<
        | {
            appId?: string;
            attributes?: {
              key: string;
              type: any;
              value: any;
            }[];
            bio?: string;
            coverPicture?: string;
            id: string;
            name?: string;
            picture?: string;
          }
        | undefined
      >
    ) => {
      state.profile = action.payload;
    },
  },
});

export const { setLensConnected } = lensConnectedSlice.actions;

export default lensConnectedSlice.reducer;
