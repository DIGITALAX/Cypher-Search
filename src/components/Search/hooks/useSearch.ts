import { KeyboardEvent, MouseEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { setSearchActive } from "../../../../redux/reducers/searchActiveSlice";
import { PLACEHOLDERS, FILTER_VALUES } from "../../../../lib/constants";

const useSearch = () => {
  const searchActive = useSelector(
    (state: RootState) => state.app.searchActiveReducer.value
  );
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState<string>("");
  const [placeholderText, setPlaceholderText] = useState<string>();
  const [filteredDropDownValues, setFilteredDropDownValues] =
    useState<typeof FILTER_VALUES>(FILTER_VALUES);
  const [openDropDown, setOpenDropDown] = useState<{
    hashtag: boolean;
    community: boolean;
    microbrand: boolean;
    publication: boolean;
    access: boolean;
    format: boolean;
    origin: boolean;
    size: boolean;
    price: boolean;
    token: boolean;
  }>({
    hashtag: false,
    community: false,
    microbrand: false,
    publication: false,
    access: false,
    format: false,
    origin: false,
    size: false,
    price: false,
    token: false,
  });

  const handleSearch = async (
    e: KeyboardEvent | MouseEvent,
    click?: boolean
  ) => {
    try {
      if (
        ((e as KeyboardEvent).key === "Enter" &&
          searchInput.trim() !== "" &&
          !click) ||
        (click && searchInput.trim() !== "")
      ) {
        if (!searchActive) {
          dispatch(setSearchActive(true));
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleMoreSearch = async () => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleShuffleSearch = async () => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    setPlaceholderText(PLACEHOLDERS[Math.floor(Math.random() * 4)]);
  }, []);

  return {
    handleSearch,
    handleMoreSearch,
    searchInput,
    setSearchInput,
    handleShuffleSearch,
    openDropDown,
    setOpenDropDown,
    placeholderText,
    filteredDropDownValues,
    setFilteredDropDownValues,
  };
};

export default useSearch;
