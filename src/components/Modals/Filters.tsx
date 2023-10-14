import { FunctionComponent } from "react";
import ContentSort from "../Search/modules/ContentSort";
import PrerollSort from "../Search/modules/PrerollSort";
import { FilterProps } from "../Search/types/search.types";
import TileSwitch from "@/components/Tiles/modules/TileSwitch";

const Filters: FunctionComponent<FilterProps> = ({
  openDropDown,
  setOpenDropDown,
  setFilteredDropDownValues,
  filteredDropDownValues,
  dispatch,
  filterValues,
}): JSX.Element => {
  return (
    <div className="fixed z-20 top-20 left-0 right-0 bottom-0 overflow-y-auto h-auto bg-offBlack items-start" id="milestone">
      <div className="relative flex flex-row gap-10 mx-auto w-full  p-4 h-full items-start justify-center">
          <TileSwitch type="chromadin" data={""} />
          <ContentSort
            dispatch={dispatch}
            openDropDown={openDropDown}
            setOpenDropDown={setOpenDropDown}
            setFilteredDropDownValues={setFilteredDropDownValues}
            filteredDropDownValues={filteredDropDownValues}
            filterValues={filterValues}
          />
          <PrerollSort
            openDropDown={openDropDown}
            setOpenDropDown={setOpenDropDown}
            setFilteredDropDownValues={setFilteredDropDownValues}
            filteredDropDownValues={filteredDropDownValues}
            dispatch={dispatch}
            filterValues={filterValues}
          />
        </div>
    </div>
  );
};

export default Filters;
