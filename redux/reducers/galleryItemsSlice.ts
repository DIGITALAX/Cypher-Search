import { Creation } from "@/components/Tiles/types/tiles.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GalleryItemsState {
  items?: {
    collected: Creation[];
    created: Creation[];
  };
}

const initialGalleryItemsState: GalleryItemsState = {
  items: undefined,
};

export const galleryItemsSlice = createSlice({
  name: "galleryItems",
  initialState: initialGalleryItemsState,
  reducers: {
    setGalleryItems: (
      state: GalleryItemsState,
      action: PayloadAction<{
        collected: Creation[];
        created: Creation[];
      }>
    ) => {
      state.items = action.payload;
    },
  },
});

export const { setGalleryItems } = galleryItemsSlice.actions;

export default galleryItemsSlice.reducer;
