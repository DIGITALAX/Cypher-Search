import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import dynamic from "next/dynamic";
import FullScreenVideo from "./FullScreenVideo";
import Filters from "./Filters";
import useSearch from "../Search/hooks/useSearch";

const Map = dynamic(() => import("./Map"), { ssr: false });

const Modals: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const mapOpen = useSelector((state: RootState) => state.app.mapReducer.value);
  const filterValues = useSelector(
    (state: RootState) => state.app.filterReducer.filter
  );
  const fullScreenVideo = useSelector(
    (state: RootState) => state.app.fullScreenVideoReducer.value
  );
  const filtersOpen = useSelector(
    (state: RootState) => state.app.filtersOpenReducer.value
  );
  const {
    openDropDown,
    setOpenDropDown,
    filteredDropDownValues,
    setFilteredDropDownValues,
  } = useSearch();
  return (
    <>
      {fullScreenVideo && (
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
      {mapOpen && <Map dispatch={dispatch} filterValues={filterValues} />}
      {filtersOpen && (
        <Filters
          openDropDown={openDropDown}
          setOpenDropDown={setOpenDropDown}
          filteredDropDownValues={filteredDropDownValues}
          setFilteredDropDownValues={setFilteredDropDownValues}
          dispatch={dispatch}
          filterValues={filterValues}
        />
      )}
    </>
  );
};

export default Modals;
