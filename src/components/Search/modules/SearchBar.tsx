import { FunctionComponent, MouseEvent } from "react";
import { SearchBarProps } from "../types/search.types";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Image from "next/legacy/image";
import { setFiltersOpen } from "../../../../redux/reducers/filtersOpenSlice";
import { setLayoutSwitch } from "../../../../redux/reducers/layoutSwitchSlice";

const SearchBar: FunctionComponent<SearchBarProps> = ({
  handleSearch,
  searchActive,
  searchInput,
  setSearchInput,
  filtersOpen,
  handleShuffleSearch,
  placeholderText,
  dispatch,
  layoutAmount,
}): JSX.Element => {
  return (
    <div
      className={`w-full h-fit flex flex-row items-center justify-center p-3 ${
        searchActive || filtersOpen
          ? "searchTransition relative"
          : "absolute top-[35vh]"
      }`}
    >
      <div className="relative h-10 w-3/5 flex flex-row gap-2 items-center justify-center">
        <div
          className="relative w-9 h-7 flex cursor-pointer items-center justify-center active:scale-95 hover:opacity-70"
          onClick={() => handleShuffleSearch()}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmP6jdmuQXERDQ7dtUWjkQaAmeKZtSRmW6gCFT9SmVLgbg`}
            layout="fill"
            draggable={false}
          />
        </div>
        <div
          className="relative w-full h-full rounded-sm p-px flex items-center justify-center"
          id="borderSearch"
        >
          <input
            className="bg-black text-offWhite p-1.5 rounded-sm w-full h-full font-bit flex items-center justify-start relative text-sm"
            id="searchBar"
            placeholder={placeholderText}
            onKeyDown={(e) => handleSearch(e)}
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
          />
          <div
            className="w-12 h-7 flex items-center justify-center absolute right-2 rounded-sm font-bit text-brill uppercase text-center p-px active:scale-95 hover:opacity-70 cursor-pointer"
            id="borderSearch"
            onClick={(e) => handleSearch(e, true)}
          >
            <div className="relative w-full h-full flex items-center justify-center text-center bg-black rounded-sm text-lg">
              GO
            </div>
          </div>
        </div>
        <div
          className="relative w-9 h-7 flex cursor-pointer items-center justify-center active:scale-95 hover:opacity-70"
          onClick={() => dispatch(setFiltersOpen(!filtersOpen))}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmdAeKBRKxgPrnpQzFbXtvnRZ8pUU3DkFMQnBKosYFJhX1`}
            layout="fill"
            draggable={false}
          />
        </div>
        <div
          className="relative w-9 h-7 flex cursor-pointer items-center justify-center active:scale-95 hover:opacity-70"
          onClick={() =>
            dispatch(setLayoutSwitch(layoutAmount < 4 ? layoutAmount + 1 : 2))
          }
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmeVN7HiJ6K2gfVx3QfXQoCcpS8ijHr7tJpyonZNV9HLBt`}
            layout="fill"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
