import {
  Display,
  SortType,
} from "@/components/Autograph/types/autograph.types";
import { Creation } from "@/components/Tiles/types/tiles.types";
import { useState } from "react";
import { setProfileDisplay } from "../../../../redux/reducers/profileDisplaySlice";
import { Dispatch } from "redux";

const useDisplaySearch = (
  profileDisplay: Display | undefined,
  dispatch: Dispatch
) => {
  const [itemSearch, setItemSearch] = useState<string>("");
  const [sortedGallery, setSortedGallery] = useState<Creation[]>([]);
  const [selectedItem, setSelectedItem] = useState<Creation>();
  sortedGallery;

  const handleItemSelect = (item: Creation, type: SortType, value: number) => {
    let data: Display = profileDisplay
      ? profileDisplay
      : {
          private: undefined,
          community: undefined,
          public: undefined,
        };

    const newData = { ...data };

    switch (type) {
      case SortType.Community:
        if (value === 0) {
          newData.community = {
            main: item,
            side: data?.community?.side,
          };
        } else {
          const newSide = [...(data?.community?.side || [])];
          newSide[value - 1] = item;
          data = {
            ...data,
            community: {
              main: data?.community?.main,
              side: newSide,
            },
          };
        }
        break;
      case SortType.Private:
        if (value === 0) {
          newData.private = {
            main: item,
            side: data?.private?.side,
          };
        } else {
          const newSide = [...(data?.private?.side || [])];
          newSide[value - 1] = item;
          data = {
            ...data,
            private: {
              main: data?.private?.main,
              side: newSide,
            },
          };
        }

        break;
      case SortType.Public:
        if (value === 0) {
          newData.public = {
            main: item,
            side: data?.public?.side,
          };
        } else {
          const newSide = [...(data?.public?.side || [])];
          newSide[value - 1] = item;
          data = {
            ...data,
            public: {
              main: data?.public?.main,
              side: newSide,
            },
          };
        }

        break;
    }

    dispatch(setProfileDisplay(newData));
    setSelectedItem(item);
  };

  return {
    itemSearch,
    setItemSearch,
    sortedGallery,
    selectedItem,
    handleItemSelect,
  };
};

export default useDisplaySearch;
