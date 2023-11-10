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
import Index from "./Indexer";
import ReportPub from "./ReportPub";
import useReport from "../hooks/useReport";
import Who from "./Who";
import useWho from "../hooks/useWho";
import { useRouter } from "next/router";
import useFilterPost from "../hooks/useFilterPost";
import PostBox from "./PostBox";
import useQuote from "../hooks/useQuote";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import { useAccount } from "wagmi";
import PostCollectGif from "./PostCollectGif";
import FollowCollect from "./FollowCollect";

const Map = dynamic(() => import("./Map"), { ssr: false });

const Modals: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
  const mapOpen = useSelector((state: RootState) => state.app.mapReducer);
  const layoutAmount = useSelector(
    (state: RootState) => state.app.layoutSwitchReducer.value
  );
  const followCollect = useSelector(
    (state: RootState) => state.app.followCollectReducer
  );
  const filtersOpen = useSelector(
    (state: RootState) => state.app.filtersOpenReducer
  );
  const profileDisplay = useSelector(
    (state: RootState) => state.app.profileDisplayReducer.value
  );
  const reactBox = useSelector((state: RootState) => state.app.reactBoxReducer);
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer?.profile
  );
  const indexer = useSelector((state: RootState) => state.app.indexerReducer);
  const galleryItems = useSelector(
    (state: RootState) => state.app.galleryItemsReducer.items
  );
  const reportReason = useSelector(
    (state: RootState) => state.app.reportPubReducer
  );
  const availableCurrencies = useSelector(
    (state: RootState) => state.app.availableCurrenciesReducer.currencies
  );
  const postBox = useSelector((state: RootState) => state.app.postBoxReducer);
  const displaySearch = useSelector(
    (state: RootState) => state.app.displaySearchBoxReducer
  );
  const interactError = useSelector(
    (state: RootState) => state.app.interactErrorReducer
  );
  const fullScreenVideo = useSelector(
    (state: RootState) => state.app.fullScreenVideoReducer
  );
  const profiles = useSelector(
    (state: RootState) => state.app.cachedProfilesReducer.profiles
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.items
  );
  const searchActive = useSelector(
    (state: RootState) => state.app.searchActiveReducer.value
  );
  const allSearchItems = useSelector(
    (state: RootState) => state.app.searchItemsReducer
  );
  const postCollectGif = useSelector(
    (state: RootState) => state.app.postCollectGifReducer
  );
  const filterConstants = useSelector(
    (state: RootState) => state.app.filterConstantsReducer.items
  );
  const filters = useSelector(
    (state: RootState) => state.app.filterReducer.filter
  );
  const image = useSelector((state: RootState) => state.app.ImageLargeReducer);
  const {
    openDropDown,
    setOpenDropDown,
    filteredDropDownValues,
    setFilteredDropDownValues,
    handleResetFilters,
  } = useSearch(
    filtersOpen,
    lensConnected,
    searchActive,
    filterConstants,
    filters,
    allSearchItems,
    profiles,
    dispatch
  );
  const {
    handleItemSelect,
    itemSearch,
    setItemSearch,
    selectedItem,
    sortedGallery,
  } = useDisplaySearch(profileDisplay, dispatch);
  const {
    dataLoading,
    reactors,
    quoters,
    hasMore,
    hasMoreQuote,
    showMore,
    mirrorQuote,
    setMirrorQuote,
  } = useWho(lensConnected, reactBox);
  const {
    popUpOpen,
    setApparel,
    apparel,
    mirror,
    like,
    setPopUpOpen,
    interactionsLoading,
    openMirrorChoice,
    setOpenMirrorChoice,
    unfollowProfile,
    followProfile,
    followLoading,
    profileHovers,
    setProfileHovers,
    publication,
  } = useFilterPost(filtersOpen);
  const {
    makeQuote,
    setMakeQuote,
    quoteLoading,
    quote,
    quoteContentLoading,
    setQuoteContentLoading,
    openMeasure,
    setOpenMeasure,
    setCollects,
    collects,
    handleGif,
    searchGifLoading,
    transactionLoading,
    informationLoading,
    handleCollect,
    handleFollow,
    approveSpend,
    approved,
  } = useQuote(
    availableCurrencies,
    lensConnected,
    postCollectGif,
    followCollect,
    postBox,
    dispatch,
    publicClient,
    address
  );
  const { handleReportPost, reason, setReason, reportLoading } =
    useReport(dispatch);
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
      {mapOpen?.value && <Map dispatch={dispatch} filterValues={filters} />}
      {filtersOpen?.value && (
        <Filters
          filterConstants={filterConstants}
          openDropDown={openDropDown}
          setOpenDropDown={setOpenDropDown}
          filteredDropDownValues={filteredDropDownValues!}
          setFilteredDropDownValues={setFilteredDropDownValues}
          dispatch={dispatch}
          filterValues={filters}
          handleResetFilters={handleResetFilters}
          layoutAmount={layoutAmount}
          popUpOpen={popUpOpen}
          setPopUpOpen={setPopUpOpen}
          apparel={apparel}
          setApparel={setApparel}
          publication={publication!}
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
      {reactBox?.open && (
        <Who
          router={router}
          dispatch={dispatch}
          type={reactBox.type!}
          reactors={reactors}
          dataLoading={dataLoading}
          quoters={quoters}
          hasMore={hasMore}
          hasMoreQuote={hasMoreQuote}
          showMore={showMore}
          mirrorQuote={mirrorQuote}
          setMirrorQuote={setMirrorQuote}
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
      {reportReason?.open && (
        <ReportPub
          dispatch={dispatch}
          id={reportReason?.for!}
          reason={reason}
          setReason={setReason}
          handleReportPost={handleReportPost}
          reportLoading={reportLoading}
        />
      )}
      {followCollect?.type && (
        <FollowCollect
          dispatch={dispatch}
          type={followCollect?.type!}
          collect={followCollect?.collect}
          follower={followCollect?.follower}
          handleCollect={handleCollect}
          handleFollow={handleFollow}
          informationLoading={informationLoading}
          transactionLoading={transactionLoading}
          approved={approved}
          approveSpend={approveSpend}
        />
      )}
      {postBox?.open && (
        <PostBox
          dispatch={dispatch}
          quote={postBox?.quote}
          makePost={makeQuote}
          setMakePost={setMakeQuote}
          post={quote}
          postLoading={quoteLoading}
          contentLoading={quoteContentLoading}
          setContentLoading={setQuoteContentLoading}
          postCollectGif={postCollectGif}
        />
      )}
      {postCollectGif?.type && (
        <PostCollectGif
          dispatch={dispatch}
          openMeasure={openMeasure}
          setOpenMeasure={setOpenMeasure}
          availableCurrencies={availableCurrencies}
          collects={collects}
          setCollects={setCollects}
          type={postCollectGif?.type}
          id={postCollectGif?.id!}
          collectTypes={postCollectGif?.collectTypes}
          handleGif={handleGif}
          gifs={postCollectGif?.gifs}
          searchGifLoading={searchGifLoading}
        />
      )}
      {interactError.value && <InteractError dispatch={dispatch} />}
      {indexer?.open && <Index message={indexer?.message} />}
    </>
  );
};

export default Modals;
