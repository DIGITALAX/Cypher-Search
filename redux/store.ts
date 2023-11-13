import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import searchActiveReducer from "./reducers/searchActiveSlice";
import walletConnectedReducer from "./reducers/walletConnectedSlice";
import lensConnectedReducer from "./reducers/lensConnectedSlice";
import filterReducer from "./reducers/filterSlice";
import availableCurrenciesReducer from "./reducers/availableCurrenciesSlice";
import oracleDataReducer from "./reducers/oracleDataSlice";
import successCheckoutReducer from "./reducers/successCheckoutSlice";
import postCollectGifReducer from "./reducers/postCollectGifSlice";
import mapReducer from "./reducers/mapSlice";
import reportPubReducer from "./reducers/reportPubSlice";
import postBoxReducer from "./reducers/postBoxSlice";
import fullScreenVideoReducer from "./reducers/fullScreenVideoSlice";
import filtersOpenReducer from "./reducers/filtersOpenSlice";
import cartAnimReducer from "./reducers/cartAnimSlice";
import cartItemsReducer from "./reducers/cartItemsSlice";
import ImageLargeReducer from "./reducers/ImageLargeSlice";
import layoutSwitchReducer from "./reducers/layoutSwitchSlice";
import reactBoxReducer from "./reducers/reactBoxSlice";
import interactionsCountReducer from "./reducers/interactionsCountSlice";
import indexerReducer from "./reducers/indexerSlice";
import profileDisplayReducer from "./reducers/profileDisplaySlice";
import displaySearchBoxReducer from "./reducers/displaySearchBoxSlice";
import searchItemsReducer from "./reducers/searchItemsSlice";
import filterConstantsReducer from "./reducers/filterConstantsSlice";
import interactErrorReducer from "./reducers/interactErrorSlice";
import autographProfileReducer from "./reducers/autographProfileSlice";
import galleryItemsReducer from "./reducers/galleryItemsSlice";
import autographFeedReducer from "./reducers/autographFeedSlice";
import screenDisplayReducer from "./reducers/screenDisplaySlice";
import followCollectReducer from "./reducers/followCollectSlice";

const reducer = combineReducers({
  searchActiveReducer,
  walletConnectedReducer,
  reportPubReducer,
  lensConnectedReducer,
  filterReducer,
  mapReducer,
  fullScreenVideoReducer,
  filtersOpenReducer,
  cartAnimReducer,
  cartItemsReducer,
  ImageLargeReducer,
  layoutSwitchReducer,
  reactBoxReducer,
  interactionsCountReducer,
  searchItemsReducer,
  filterConstantsReducer,
  interactErrorReducer,
  autographProfileReducer,
  displaySearchBoxReducer,
  galleryItemsReducer,
  profileDisplayReducer,
  autographFeedReducer,
  indexerReducer,
  postBoxReducer,
  screenDisplayReducer,
  followCollectReducer,
  availableCurrenciesReducer,
  postCollectGifReducer,
  successCheckoutReducer,
  oracleDataReducer,
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
