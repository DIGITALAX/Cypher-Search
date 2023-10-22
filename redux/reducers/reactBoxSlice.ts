import { createSlice } from "@reduxjs/toolkit";
import { Profile } from "../../graphql/generated";

export interface ReactBoxState {
  comment: {
    id: string;
    cursor?: string;
    profiles?: Profile[];
  };
  like: {
    id: string;
    cursor?: string;
    profiles?: Profile[];
  };
  mirror: {
    id: string;
    cursor?: string;
    profiles?: Profile[];
  };
  quote: {
    id: string;
    cursor?: string;
    profiles?: Profile[];
  };
}

const initialReactBoxState: ReactBoxState = {
  comment: {
    id: "",
    cursor: "",
    profiles: undefined,
  },
  like: {
    id: "",
    cursor: "",
    profiles: undefined,
  },
  mirror: {
    id: "",
    cursor: "",
    profiles: undefined,
  },
  quote: {
    id: "",
    cursor: "",
    profiles: undefined,
  },
};

export const reactBoxSlice = createSlice({
  name: "reactBox",
  initialState: initialReactBoxState,
  reducers: {
    setReactBox: (
      state: ReactBoxState,
      { payload: { actionLike, actionMirror, actionQuote, actionComment } }
    ) => {
      state.like = actionLike;
      state.mirror = actionMirror;
      state.quote = actionQuote;
      state.comment = actionComment;
    },
  },
});

export const { setReactBox } = reactBoxSlice.actions;

export default reactBoxSlice.reducer;
