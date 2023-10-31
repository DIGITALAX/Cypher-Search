import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import searchActiveReducer from "./reducers/searchActiveSlice";
import walletConnectedReducer from "./reducers/walletConnectedSlice";
import lensConnectedReducer from "./reducers/lensConnectedSlice";
import filterReducer from "./reducers/filterSlice";
import mapReducer from "./reducers/mapSlice";
import videoSyncReducer from "./reducers/videoSyncSlice";
import fullScreenVideoReducer from "./reducers/fullScreenVideoSlice";
import mainVideoReducer from "./reducers/mainVideoSlice";
import filtersOpenReducer from "./reducers/filtersOpenSlice";
import cartAnimReducer from "./reducers/cartAnimSlice";
import cartItemsReducer from "./reducers/cartItemsSlice";
import ImageLargeReducer from "./reducers/ImageLargeSlice";
import layoutSwitchReducer from "./reducers/layoutSwitchSlice";
import reactBoxReducer from "./reducers/reactBoxSlice";
import interactionsCountReducer from "./reducers/interactionsCountSlice";
import searchItemsReducer from "./reducers/searchItemsSlice";
import cachedProfilesReducer from "./reducers/cachedProfilesSlice";
import filterConstantsReducer from "./reducers/filterConstantsSlice";
import autographReducer from "./reducers/autographSlice";

const reducer = combineReducers({
  searchActiveReducer,
  walletConnectedReducer,
  lensConnectedReducer,
  filterReducer,
  mapReducer,
  videoSyncReducer,
  fullScreenVideoReducer,
  mainVideoReducer,
  filtersOpenReducer,
  cartAnimReducer,
  cartItemsReducer,
  ImageLargeReducer,
  layoutSwitchReducer,
  reactBoxReducer,
  interactionsCountReducer,
  searchItemsReducer,
  cachedProfilesReducer,
  filterConstantsReducer,
  autographReducer,
});

export const store = configureStore({
  reducer: {
    app: reducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
