import { FunctionComponent } from "react";
import ContentSort from "../../Search/modules/ContentSort";
import PrerollSort from "../../Search/modules/PrerollSort";
import { FilterProps } from "../../Search/types/search.types";
import TileSwitch from "@/components/Tiles/modules/TileSwitch";

const Filters: FunctionComponent<FilterProps> = ({
  openDropDown,
  setOpenDropDown,
  setFilteredDropDownValues,
  filteredDropDownValues,
  dispatch,
  filterValues,
  locale,
  handleResetFilters,
  filterConstants,
  publication,
  layoutAmount,
  mirror,
  like,
  router,
  cartItems,
  popUpOpen,
  setPopUpOpen,
  interactionsLoading,
  openMirrorChoice,
  setOpenMirrorChoice,
  unfollowProfile,
  followProfile,
  followLoading,
  profileHovers,
  setProfileHovers,
  lensConnected,
  t,
}): JSX.Element => {
  return (
    <div
      className="fixed z-20 top-56 sm:top-32 tablet:top-20 left-0 right-0 bottom-0 overflow-y-auto h-auto bg-offBlack items-start"
      id="milestone"
    >
      <div className="relative flex flex-col lg:flex-row gap-10 mx-auto w-full p-4 h-fit lg:items-start items-center justify-start lg:justify-center">
        <div className="relative w-full h-fit flex lg:items-start items-center justify-start lg:justify-center lg:order-1 order-3">
          {publication?.post && (
            <TileSwitch
              t={t}
              locale={locale}
              type={publication?.type}
              filterConstants={filterConstants}
              lensConnected={lensConnected}
              publication={publication}
              layoutAmount={layoutAmount}
              popUpOpen={popUpOpen}
              setPopUpOpen={setPopUpOpen}
              index={0}
              dispatch={dispatch}
              router={router}
              cartItems={cartItems}
              mirror={mirror}
              like={like}
              interactionsLoading={interactionsLoading}
              openMirrorChoice={openMirrorChoice}
              setOpenMirrorChoice={setOpenMirrorChoice}
              followLoading={followLoading}
              unfollowProfile={unfollowProfile}
              followProfile={followProfile}
              profileHovers={profileHovers}
              setProfileHovers={setProfileHovers}
            />
          )}
        </div>
        <ContentSort
          t={t}
          filterConstants={filterConstants}
          handleResetFilters={handleResetFilters}
          dispatch={dispatch}
          openDropDown={openDropDown}
          setOpenDropDown={setOpenDropDown}
          setFilteredDropDownValues={setFilteredDropDownValues}
          filteredDropDownValues={filteredDropDownValues}
          filterValues={filterValues}
        />
        <PrerollSort
          locale={locale}
          t={t}
          openDropDown={openDropDown}
          setOpenDropDown={setOpenDropDown}
          setFilteredDropDownValues={setFilteredDropDownValues}
          filteredDropDownValues={filteredDropDownValues}
          dispatch={dispatch}
          filterValues={filterValues}
          filterConstants={filterConstants}
        />
      </div>
    </div>
  );
};

export default Filters;
