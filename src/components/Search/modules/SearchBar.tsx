import { FunctionComponent, KeyboardEvent } from "react";
import { SearchBarProps } from "../types/search.types";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Image from "next/legacy/image";
import { setFiltersOpen } from "../../../../redux/reducers/filtersOpenSlice";
import { setLayoutSwitch } from "../../../../redux/reducers/layoutSwitchSlice";
import { setAllSearchItems } from "../../../../redux/reducers/searchItemsSlice";
import { setFilterChange } from "../../../../redux/reducers/filterChangeSlice";

const SearchBar: FunctionComponent<SearchBarProps> = ({
  handleSearch,
  searchActive,
  filtersOpen,
  handleShuffleSearch,
  placeholderText,
  dispatch,
  layoutAmount,
  router,
  searchItems,
  filterChange,
}): JSX.Element => {
  return (
    <div
      className={`w-full h-fit flex items-center justify-center py-0 px-1 sm:py-3 sm:px-3 ${
        searchActive || filtersOpen
          ? "searchTransition relative"
          : "absolute top-[35vh] sm:right-auto right-0"
      }`}
    >
      <div className="relative h-fit tablet:h-10 w-full sm:w-5/6 lg:w-3/5 flex flex-col tablet:flex-row gap-3 tablet:gap-2 items-center justify-center">
        <div
          className="relative tablet:w-9 w-6 h-5 tablet:h-7 flex cursor-pointer items-center justify-center active:scale-95 hover:opacity-70"
          onClick={() => handleShuffleSearch()}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmP6jdmuQXERDQ7dtUWjkQaAmeKZtSRmW6gCFT9SmVLgbg`}
            layout="fill"
            draggable={false}
          />
        </div>
        <div className="relative w-full h-full flex items-center justify-center flex-col galaxy:flex-row gap-3">
          <div
            className="relative flex items-center justify-center w-full h-full p-px rounded-sm"
            id="borderSearch"
          >
            <input
              className="bg-black text-offWhite p-1.5 rounded-sm w-full h-full font-bit flex items-center justify-start relative text-sm"
              id="searchBar"
              placeholder={
                searchItems?.searchInput
                  ? searchItems?.searchInput
                  : placeholderText
              }
              onKeyDown={(e) =>
                (e as KeyboardEvent).key === "Enter" &&
                searchItems?.searchInput?.trim() !== "" &&
                handleSearch(e)
              }
              onChange={(e) =>
                dispatch(
                  setAllSearchItems({
                    actionItems: searchItems?.items,
                    actionInput: e.target.value,
                    actionLensPubCursor: searchItems?.lensPubCursor,
                    actionGraphCursor: searchItems?.graphCursor,
                    actionLensProfileCursor: searchItems?.lensProfileCursor,
                    actionHasMore: searchItems?.hasMore,
                  })
                )
              }
              value={searchItems?.searchInput}
            />
          </div>
          <div
            className="w-12 h-7 relative tablet:absolute tablet:right-2 flex items-center justify-center rounded-sm font-bit text-brill uppercase text-center p-px active:scale-95 hover:opacity-70 cursor-pointer"
            id="borderSearch"
            onClick={(e) => handleSearch(e, true)}
          >
            <div className="relative w-full h-full flex items-center justify-center text-center bg-black rounded-sm text-lg">
              GO
            </div>
          </div>
        </div>
        <div className="relative w-fit h-fit flex flex-row gap-2 items-center justify-center">
          <div
            className="relative tablet:w-9 w-6 h-5 tablet:h-7 flex cursor-pointer items-center justify-center active:scale-95 hover:opacity-70"
            onClick={() => {
              if (router.asPath !== "/" && filtersOpen && filterChange)
                router.push("/");
              dispatch(
                setFiltersOpen({
                  actionValue: !filtersOpen,
                  actionAllow: filterChange ? true : false,
                })
              );
              dispatch(setFilterChange(false));
            }}
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmdAeKBRKxgPrnpQzFbXtvnRZ8pUU3DkFMQnBKosYFJhX1`}
              layout="fill"
              draggable={false}
            />
          </div>
          <div
            className="relative tablet:w-9 w-6 h-5 tablet:h-7 flex cursor-pointer items-center justify-center active:scale-95 hover:opacity-70"
            onClick={() =>
              dispatch(
                setLayoutSwitch(
                  layoutAmount <
                    (window.innerWidth < 648
                      ? 1
                      : window.innerWidth < 1000
                      ? 2
                      : window.innerWidth < 1200
                      ? 3
                      : 4)
                    ? layoutAmount + 1
                    : window.innerWidth < 1200
                    ? 1
                    : 2
                )
              )
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
    </div>
  );
};

export default SearchBar;
