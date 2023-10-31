import { createSlice } from "@reduxjs/toolkit";
import { Profile } from "../../graphql/generated";
import { Creation } from "@/components/Tiles/types/tiles.types";

export interface AutographState {
  display:
    | {
        main: {
          private: Creation;
          community: Creation;
          public: Creation;
        };
        side: {
          private: Creation[];
          community: Creation[];
          public: Creation[];
        };
      }
    | undefined;
  gallery:
    | {
        collected: Creation[] | undefined;
        created: Creation[] | undefined;
      }
    | undefined;
  profile: Profile | undefined;
  owner: boolean;
}

const initialAutographState: AutographState = {
  gallery: undefined,
  display: undefined,
  profile: undefined,
  owner: false,
};

export const autographSlice = createSlice({
  name: "autograph",
  initialState: initialAutographState,
  reducers: {
    setAutograph: (
      state: AutographState,
      { payload: { actionProfile, actionGallery, actionDisplay, actionOwner } }
    ) => {
      state.gallery = actionGallery;
      state.display = actionDisplay;
      state.profile = actionProfile;
      state.owner = actionOwner;
    },
  },
});

export const { setAutograph } = autographSlice.actions;

export default autographSlice.reducer;
