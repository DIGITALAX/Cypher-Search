import { FunctionComponent, RefObject } from "react";
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
import { NextRouter } from "next/router";
import useFilterPost from "../hooks/useFilterPost";
import PostBox from "./PostBox";
import useQuote from "../hooks/useQuote";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import { useAccount } from "wagmi";
import PostCollectGif from "./PostCollectGif";
import FollowCollect from "./FollowCollect";
import SuccessCheckout from "./SuccessCheckout";
import PostSuccess from "./PostSuccess";
import InsufficientBalance from "./InsufficientBalance";
import ClaimProfile from "./ClaimProfile";
import QuestGates from "./QuestGates";
import QuestSuccess from "./QuestSuccess";
import { useTranslation } from "@/pages/_app";

const Map = dynamic(() => import("./Map"), { ssr: false });

const Modals: FunctionComponent<{
  router: NextRouter;
}> = ({ router }): JSX.Element => {
  const dispatch = useDispatch();
  const { t, locale } = useTranslation();
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const mapOpen = useSelector((state: RootState) => state.app.mapReducer);
  const layoutAmount = useSelector(
    (state: RootState) => state.app.layoutSwitchReducer.value
  );
  const followCollect = useSelector(
    (state: RootState) => state.app.followCollectReducer
  );
  const insufficientBalance = useSelector(
    (state: RootState) => state.app.insufficientBalanceReducer
  );
  const claimProfile = useSelector(
    (state: RootState) => state.app.claimProfileReducer
  );
  const filtersOpen = useSelector(
    (state: RootState) => state.app.filtersOpenReducer
  );
  const questSuccess = useSelector(
    (state: RootState) => state.app.questSuccessReducer
  );
  const questGates = useSelector(
    (state: RootState) => state.app.questGatesReducer
  );
  const successCheckout = useSelector(
    (state: RootState) => state.app.successCheckoutReducer
  );
  const profileDisplay = useSelector(
    (state: RootState) => state.app.profileDisplayReducer.value
  );
  const reactBox = useSelector((state: RootState) => state.app.reactBoxReducer);
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer?.profile
  );
  const indexer = useSelector((state: RootState) => state.app.indexerReducer);
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
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.items
  );
  const searchActive = useSelector(
    (state: RootState) => state.app.searchActiveReducer.value
  );
  const postSuccess = useSelector(
    (state: RootState) => state.app.postSuccessReducer
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
    dispatch,
    router,
    locale
  );
  const {
    handleItemSelect,
    itemSearch,
    setItemSearch,
    selectedItem,
    sortedGallery,
    gallery,
    galleryLoading,
  } = useDisplaySearch(profileDisplay, dispatch, address, displaySearch?.value);
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
  } = useFilterPost(
    filtersOpen,
    dispatch,
    address,
    publicClient,
    lensConnected,
    t
  );
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
    videoRef,
    mentionProfiles,
    setMentionProfiles,
    caretCoord,
    setCaretCoord,
    setProfilesOpen,
    profilesOpen,
    handleNextVideo,
    handlePlayPause,
    handleSeek,
    handleVolumeChange,
    videoLoading,
    wrapperRef,
  } = useQuote(
    availableCurrencies,
    lensConnected,
    postCollectGif,
    followCollect,
    postBox,
    dispatch,
    publicClient,
    address,
    fullScreenVideo,
    t
  );
  const { handleReportPost, reason, setReason, reportLoading } = useReport(
    dispatch,
    t
  );
  return (
    <>
      {fullScreenVideo?.open && (
        <FullScreenVideo
          dispatch={dispatch}
          fullScreenVideo={fullScreenVideo}
          videoRef={videoRef as RefObject<HTMLVideoElement>}
          loading={videoLoading}
          handleNextVideo={handleNextVideo}
          handlePlayPause={handlePlayPause}
          handleVolumeChange={handleVolumeChange}
          handleSeek={handleSeek}
          router={router}
          wrapperRef={wrapperRef}
        />
      )}
      {mapOpen?.value && (
        <Map t={t} dispatch={dispatch} filterValues={filters} />
      )}
      {filtersOpen?.value && (
        <Filters
          t={t}
          locale={locale}
          lensConnected={lensConnected}
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
          locale={locale}
          t={t}
          router={router}
          lensConnected={lensConnected}
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
          t={t}
          dispatch={dispatch}
          sortType={displaySearch?.type!}
          gallery={gallery}
          galleryLoading={galleryLoading}
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
          t={t}
          router={router}
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
          t={t}
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
          locale={locale}
          t={t}
          lensConnected={lensConnected}
          setCaretCoord={setCaretCoord}
          setMentionProfiles={setMentionProfiles}
          setProfilesOpen={setProfilesOpen}
          profilesOpen={profilesOpen}
          mentionProfiles={mentionProfiles}
          caretCoord={caretCoord}
          dispatch={dispatch}
          router={router}
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
          t={t}
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
      {insufficientBalance?.value && (
        <InsufficientBalance
          dispatch={dispatch}
          message={insufficientBalance?.message!}
        />
      )}
      {questGates?.gates && (
        <QuestGates t={t} gates={questGates?.gates} dispatch={dispatch} />
      )}
      {interactError?.value && <InteractError t={t} dispatch={dispatch} />}
      {questSuccess?.value && <QuestSuccess t={t} dispatch={dispatch} />}
      {successCheckout?.value && (
        <SuccessCheckout
          t={t}
          dispatch={dispatch}
          router={router}
          handle={
            lensConnected?.handle?.suggestedFormatted?.localName?.split("@")[1]!
          }
        />
      )}
      {postSuccess?.value && (
        <PostSuccess
          t={t}
          router={router}
          type={postSuccess?.value!}
          dispatch={dispatch}
          pubId={postSuccess?.pubId!}
          successType={postSuccess?.type!}
          handle={
            lensConnected?.handle?.suggestedFormatted?.localName?.split(
              "@"
            )?.[1]!
          }
        />
      )}
      {claimProfile?.value && <ClaimProfile t={t} dispatch={dispatch} />}
      {indexer?.open && <Index message={indexer?.message} />}
    </>
  );
};

export default Modals;
