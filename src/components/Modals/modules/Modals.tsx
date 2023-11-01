import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import dynamic from "next/dynamic";
import FullScreenVideo from "./FullScreenVideo";
import Filters from "./Filters";
import useSearch from "../../Search/hooks/useSearch";
import ImageLarge from "./ImageLarge";
import InteractError from "./InteractError";
import DisplaySearch from "./DisplaySearch";
import useDisplaySearch from "../hooks/useDisplaySearch";

const Map = dynamic(() => import("./Map"), { ssr: false });

const Modals: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const mapOpen = useSelector((state: RootState) => state.app.mapReducer);
  const filterValues = useSelector(
    (state: RootState) => state.app.filterReducer.filter
  );
  const galleryItems = useSelector(
    (state: RootState) => state.app.galleryItemsReducer.items
  );
  const displaySearch = useSelector(
    (state: RootState) => state.app.displaySearchBoxReducer
  );
  const interactError = useSelector(
    (state: RootState) => state.app.interactErrorReducer
  );
  const fullScreenVideo = useSelector(
    (state: RootState) => state.app.fullScreenVideoReducer
  );
  const filtersOpen = useSelector(
    (state: RootState) => state.app.filtersOpenReducer
  );
  const filterConstants = useSelector(
    (state: RootState) => state.app.filterConstantsReducer.items
  );
  const image = useSelector((state: RootState) => state.app.ImageLargeReducer);
  const {
    openDropDown,
    setOpenDropDown,
    filteredDropDownValues,
    setFilteredDropDownValues,
    handleResetFilters,
  } = useSearch();
  const {
    handleItemSelect,
    itemSearch,
    setItemSearch,
    selectedItem,
    sortedGallery,
  } = useDisplaySearch();
  return (
    <>
      {fullScreenVideo?.value && (
        <FullScreenVideo
          dispatch={dispatch}
          mainVideo={mainVideo}
          streamRef={fullVideoRef}
          wrapperRef={wrapperRef}
          dispatchVideos={dispatchVideos}
          videoSync={videoSync}
          videoRef={videoRef}
          viewer={viewer}
          hasMore={hasMore}
          fetchMoreVideos={fetchMoreVideos}
          videosLoading={videosLoading}
          setVideosLoading={setVideosLoading}
        />
      )}
      {mapOpen?.value && (
        <Map dispatch={dispatch} filterValues={filterValues} />
      )}
      {filtersOpen?.value && (
        <Filters
          filterConstants={filterConstants}
          openDropDown={openDropDown}
          setOpenDropDown={setOpenDropDown}
          filteredDropDownValues={filteredDropDownValues!}
          setFilteredDropDownValues={setFilteredDropDownValues}
          dispatch={dispatch}
          filterValues={filterValues}
          handleResetFilters={handleResetFilters}
        />
      )}
      {image?.value && (
        <ImageLarge
          dispatch={dispatch}
          mainImage={image.image}
          type={image.type}
        />
      )}
      {displaySearch?.value !== undefined && (
        <DisplaySearch
          dispatch={dispatch}
          sortType={displaySearch?.type!}
          gallery={galleryItems}
          handleItemSelect={handleItemSelect}
          selectedItem={selectedItem}
          setItemSearch={setItemSearch}
          sortedGallery={sortedGallery}
          itemSearch={itemSearch}
          numberIndex={displaySearch?.value}
        />
      )}
      {interactError.value && <InteractError dispatch={dispatch} />}
    </>
  );
};

export default Modals;
