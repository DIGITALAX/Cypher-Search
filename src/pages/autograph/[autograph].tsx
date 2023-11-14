import { NextPage } from "next";
import Head from "next/head";
import { NextRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import useAutograph from "@/components/Autograph/hooks/useAutograph";
import RouterChange from "@/components/Common/modules/RouterChange";
import NotFound from "@/components/Common/modules/NotFound";
import useSearch from "@/components/Search/hooks/useSearch";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import useSignIn from "@/components/Layout/hooks/useSignIn";
import Web from "@/components/Autograph/modules/Web";
import Bio from "@/components/Autograph/modules/Bio";
import Feed from "@/components/Autograph/modules/Feed";
import Gallery from "@/components/Autograph/modules/Gallery";
import useFeed from "@/components/Autograph/hooks/useFeed";
import useGallery from "@/components/Autograph/hooks/useGallery";
import useSettings from "@/components/Autograph/hooks/useSettings";
import useProfile from "@/components/Autograph/hooks/useProfile";
import useBookmarks from "@/components/Autograph/hooks/useBookmarks";
import usePost from "@/components/Autograph/hooks/usePost";
import { useAccount } from "wagmi";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import useOrders from "@/components/Autograph/hooks/useOrders";
import useSales from "@/components/Autograph/hooks/useSales";
import useCreate from "@/components/Autograph/hooks/useCreate";
import useConversations from "@/components/Autograph/hooks/useConversations";

const Autograph: NextPage<{ router: NextRouter }> = ({
  router,
}): JSX.Element => {
  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();
  const client = new LitNodeClient({ litNetwork: "cayenne", debug: false });
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const { autograph } = router.query;
  const [globalLoading, setGlobalLoading] = useState<boolean>(true);
  const profileFeed = useSelector(
    (state: RootState) => state.app.autographFeedReducer.feed
  );
  const postCollectGif = useSelector(
    (state: RootState) => state.app.postCollectGifReducer
  );
  const profile = useSelector(
    (state: RootState) => state.app.autographProfileReducer.profile
  );
  const galleryItems = useSelector(
    (state: RootState) => state.app.galleryItemsReducer.items
  );
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const searchActive = useSelector(
    (state: RootState) => state.app.searchActiveReducer.value
  );
  const availableCurrencies = useSelector(
    (state: RootState) => state.app.availableCurrenciesReducer.currencies
  );
  const postSuccess = useSelector(
    (state: RootState) => state.app.postSuccessReducer.value
  );
  const walletConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const filtersOpen = useSelector(
    (state: RootState) => state.app.filtersOpenReducer
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.items
  );
  const profileDisplay = useSelector(
    (state: RootState) => state.app.profileDisplayReducer.value
  );
  const isDesigner = useSelector(
    (state: RootState) => state.app.isDesignerReducer.value
  );
  const screenDisplay = useSelector(
    (state: RootState) => state.app.screenDisplayReducer.value
  );
  const filterConstants = useSelector(
    (state: RootState) => state.app.filterConstantsReducer.items
  );
  const filters = useSelector(
    (state: RootState) => state.app.filterReducer.filter
  );
  const allSearchItems = useSelector(
    (state: RootState) => state.app.searchItemsReducer
  );

  const { handleShuffleSearch } = useSearch(
    filtersOpen,
    lensConnected,
    searchActive,
    filterConstants,
    filters,
    allSearchItems,
    dispatch
  );
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const {
    followProfile,
    unfollowProfile,
    feedFollowLoading,
    galleryFollowLoading,
    feedProfileHovers,
    setFeedProfileHovers,
    galleryProfileHovers,
    setGalleryProfileHovers,
  } = useProfile(
    profileFeed,
    galleryItems,
    lensConnected,
    dispatch,
    publicClient,
    address
  );
  const {
    handleLensConnect,
    openAccount,
    setOpenAccount,
    signInLoading,
    cartListOpen,
    setCartListOpen,
  } = useSignIn(
    publicClient,
    address,
    isConnected,
    dispatch,
    oracleData,
    cartItems,
    lensConnected
  );
  const { profileLoading, getProfileData, sortType, setSortType } =
    useAutograph(dispatch);
  const {
    feedLoading,
    interactionsFeedLoading,
    openMirrorFeedChoice,
    setOpenMirrorFeedChoice,
    openMoreOptions,
    setOpenMoreOptions,
    feedComment,
    feedLike,
    feedMirror,
    feedCollect,
    getMoreFeed,
    handleBookmark,
    handleHidePost,
    hasMoreFeed,
    setCommentsFeedOpen,
    setMakeCommentFeed,
    commentsFeedOpen,
    makeCommentFeed,
    commentContentLoading,
    setCommentContentLoading,
  } = useFeed(
    lensConnected,
    postCollectGif,
    profileFeed,
    profile,
    dispatch,
    publicClient,
    address,
    postSuccess
  );
  const {
    galleryLike,
    galleryMirror,
    openMirrorGalleryChoice,
    setOpenMirrorGalleryChoice,
    interactionsGalleryLoading,
    interactionsDisplayLoading,
    openMirrorDisplayChoice,
    setOpenMirrorDisplayChoice,
    displayLike,
    displayMirror,
    handleSetDisplay,
    displayLoading,
    handleOptionSelect,
    selectedOption,
    setOptionsOpen,
    optionsOpen,
    galleryLoading,
    getMoreGallery,
    openInteractions,
    setOpenInteractions,
    activeGallery,
  } = useGallery(
    lensConnected,
    profileDisplay,
    galleryItems,
    dispatch,
    publicClient,
    address,
    postSuccess
  );
  const {
    setCollectionDetails,
    setCreateCase,
    createCase,
    collectionDetails,
    createDrop,
    createCollection,
    creationLoading,
    setCollectionSettings,
    collectionSettings,
    handleMedia,
    waveformRef,
    handlePlayPause,
  } = useCreate(publicClient, address, dispatch, lensConnected);
  const { message, setMessage, handleSendMessage, messageLoading } =
    useConversations(address, screenDisplay, lensConnected, profile);
  const {
    handleSettingsUpdate,
    settingsUpdateLoading,
    setSettingsData,
    settingsData,
    coverImage,
    handleImage,
    pfpImage,
    handleFollowUpdate,
    followData,
    setFollowData,
    followUpdateLoading,
    openType,
    setOpenType,
    currencyOpen,
    setCurrencyOpen,
  } = useSettings(
    lensConnected,
    availableCurrencies,
    dispatch,
    publicClient,
    address
  );
  const {
    handleMoreBookmarks,
    openMirrorChoiceBookmark,
    setOpenMirrorChoiceBookmark,
    setOpenMoreOptionsBookmark,
    interactionsLoadingBookmark,
    openMoreOptionsBookmark,
    bookmarksLoading,
    handleBookmarkForBookmark,
    handleHidePostForBookmark,
    bookmarkCollect,
    bookmarkComment,
    bookmarkLike,
    bookmarkMirror,
    hasMoreBookmarks,
    unfollowProfileBookmark,
    setProfileHovers,
    followProfileBookmark,
    profileHovers,
    followLoading,
    allBookmarks,
    setCommentsBookmarkOpen,
    commentsBookmarkOpen,
    makeCommentBookmark,
    setMakeCommentBookmark,
  } = useBookmarks(
    lensConnected,
    postCollectGif,
    profileFeed,
    screenDisplay,
    dispatch,
    publicClient,
    address,
    profile
  );
  const {
    makePost,
    setMakePost,
    post,
    postLoading,
    postContentLoading,
    setPostContentLoading,
  } = usePost(dispatch, postCollectGif, publicClient, address);
  const {
    allOrders,
    ordersLoading,
    decryptOrder,
    setOrderActions,
    orderActions,
  } = useOrders(address, client, lensConnected, profile, screenDisplay);
  const { salesLoading, allSales } = useSales(
    address,
    screenDisplay,
    isDesigner,
    lensConnected,
    profile
  );

  useEffect(() => {
    if (autograph && !profile) {
      getProfileData(autograph as string);
    }
  }, [autograph]);

  useEffect(() => {
    setTimeout(() => {
      if (!profileLoading && !feedLoading && !galleryLoading) {
        setGlobalLoading(false);
      }
    }, 1000);
  }, [profileLoading]);

  if (!profileLoading && !globalLoading && !feedLoading && !galleryLoading) {
    return (
      <>
        {!profile ? (
          <NotFound
            router={router}
            searchActive={searchActive}
            filtersOpen={filtersOpen.value}
            lensConnected={lensConnected}
            walletConnected={walletConnected}
            handleLensConnect={handleLensConnect}
            openConnectModal={openConnectModal}
            setOpenAccount={setOpenAccount}
            cartItems={cartItems}
            openAccount={openAccount}
            cartListOpen={cartListOpen}
            signInLoading={signInLoading}
            setCartListOpen={setCartListOpen}
            openAccountModal={openAccountModal}
            dispatch={dispatch}
            handleShuffleSearch={handleShuffleSearch}
          />
        ) : (
          profile && (
            <div
              className="relative flex flex-col w-full h-full flex-grow"
              id="results"
            >
              <Head>
                <title>
                  Chromadin | {profile?.handle?.localName?.toUpperCase()}
                </title>
                <meta
                  name="og:url"
                  content={`https://chromadin.xyz/autograph/${
                    profile?.handle?.suggestedFormatted?.localName?.split(
                      "@"
                    )[1]
                  }`}
                />
                <meta
                  name="og:title"
                  content={profile?.handle?.localName?.toUpperCase()}
                />
                <meta name="og:description" content={profile?.metadata?.bio} />
                <meta
                  name="og:image"
                  content={
                    !galleryItems?.created[0]?.images?.[0]
                      ? "https://chromadin.xyz/card.png/"
                      : `https://chromadin.infura-ipfs.io/ipfs/${galleryItems?.created[0]?.images?.[0]?.split(
                          "ipfs://"
                        )}`
                  }
                />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@digitalax" />
                <meta name="twitter:creator" content="@digitalax" />
                <meta
                  name="twitter:image"
                  content={`https://chromadin.xyz/autograph/${
                    profile?.handle?.suggestedFormatted?.localName?.split(
                      "@"
                    )[1]
                  }`}
                />
                <meta
                  name="twitter:url"
                  content={`https://chromadin.xyz/autograph/${
                    profile?.handle?.suggestedFormatted?.localName?.split(
                      "@"
                    )[1]
                  }`}
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                  rel="canonical"
                  href={"https://cypher.digitalax.xyz/card.png/"}
                />
                <link
                  rel="preconnect"
                  href="https://fonts.gstatic.com"
                  crossOrigin="anonymous"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/ArcadeClassic.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/DSDigi.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/EarlsRevenge.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/Geometria.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/ClashDisplay.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/DosisRegular.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/EconomicaBold.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/EconomicaRegular.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/Manaspc.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
              </Head>
              <Web
                router={router}
                waveformRef={waveformRef}
                handlePlayPause={handlePlayPause}
                filterConstants={filterConstants}
                handleMedia={handleMedia}
                isDesigner={isDesigner}
                allSales={allSales}
                salesLoading={salesLoading}
                orderActions={orderActions}
                ordersLoading={ordersLoading}
                allOrders={allOrders}
                decryptOrder={decryptOrder}
                setOrderActions={setOrderActions}
                openType={openType}
                handleSendMessage={handleSendMessage}
                message={message}
                setMessage={setMessage}
                messageLoading={messageLoading}
                setOpenType={setOpenType}
                setCurrencyOpen={setCurrencyOpen}
                currencyOpen={currencyOpen}
                dispatch={dispatch}
                displayLoading={displayLoading}
                handleSetDisplay={handleSetDisplay}
                handleShuffleSearch={handleShuffleSearch}
                openConnectModal={openConnectModal}
                handleLensConnect={handleLensConnect}
                walletConnected={walletConnected}
                lensConnected={lensConnected}
                openAccountModal={openAccountModal}
                screenDisplay={screenDisplay}
                sortType={sortType}
                setSortType={setSortType}
                setOpenMirrorChoice={setOpenMirrorDisplayChoice}
                openMirrorChoice={openMirrorDisplayChoice}
                mirror={displayMirror}
                like={displayLike}
                interactionsLoading={interactionsDisplayLoading}
                profile={profile}
                gallery={galleryItems}
                display={profileDisplay}
                handleSettingsUpdate={handleSettingsUpdate}
                settingsUpdateLoading={settingsUpdateLoading}
                setSettingsData={setSettingsData}
                settingsData={settingsData}
                handleImage={handleImage}
                pfpImage={pfpImage}
                coverImage={coverImage}
                handleFollowUpdate={handleFollowUpdate}
                followUpdateLoading={followUpdateLoading}
                followData={followData}
                setFollowData={setFollowData}
                currencies={availableCurrencies}
                handleBookmark={handleBookmarkForBookmark}
                handleHidePost={handleHidePostForBookmark}
                handleMoreBookmarks={handleMoreBookmarks}
                hasMoreBookmarks={hasMoreBookmarks}
                mirrorBookmark={bookmarkMirror}
                comment={bookmarkComment}
                openMirrorChoiceBookmark={openMirrorChoiceBookmark}
                setOpenMirrorChoiceBookmark={setOpenMirrorChoiceBookmark}
                setOpenMoreOptions={setOpenMoreOptionsBookmark}
                setProfileHovers={setProfileHovers}
                simpleCollect={bookmarkCollect}
                openMoreOptions={openMoreOptionsBookmark}
                profileHovers={profileHovers}
                likeBookmark={bookmarkLike}
                interactionsLoadingBookmark={interactionsLoadingBookmark}
                bookmarks={allBookmarks}
                bookmarksLoading={bookmarksLoading}
                unfollowProfile={unfollowProfileBookmark}
                followLoading={followLoading}
                followProfile={followProfileBookmark}
                setCommentsOpen={setCommentsBookmarkOpen}
                setMakeComment={setMakeCommentBookmark}
                commentsOpen={commentsBookmarkOpen}
                makeComment={makeCommentBookmark}
                makePost={makePost}
                setMakePost={setMakePost}
                post={post}
                postLoading={postLoading}
                setCommentContentLoading={setCommentContentLoading}
                setPostContentLoading={setPostContentLoading}
                postContentLoading={postContentLoading}
                commentContentLoading={commentContentLoading}
                postCollectGif={postCollectGif}
                creationLoading={creationLoading}
                createDrop={createDrop}
                createCollection={createCollection}
                setCollectionDetails={setCollectionDetails}
                setCreateCase={setCreateCase}
                createCase={createCase}
                collectionDetails={collectionDetails}
                activeGallery={activeGallery}
                setCollectionSettings={setCollectionSettings}
                collectionSettings={collectionSettings}
              />
              <Bio profile={profile} dispatch={dispatch} />
              <div className="relative flex flex-row gap-3 items-start justify-between px-4 w-full h-full">
                <Feed
                  comment={feedComment}
                  availableCurrencies={availableCurrencies}
                  mirror={feedMirror}
                  like={feedLike}
                  simpleCollect={feedCollect}
                  dispatch={dispatch}
                  openMirrorChoice={openMirrorFeedChoice}
                  setOpenMirrorChoice={setOpenMirrorFeedChoice}
                  interactionsLoading={interactionsFeedLoading}
                  profileFeed={profileFeed}
                  getMoreFeed={getMoreFeed}
                  router={router}
                  followProfile={followProfile}
                  unfollowProfile={unfollowProfile}
                  followLoading={galleryFollowLoading}
                  profileHovers={galleryProfileHovers}
                  setProfileHovers={setGalleryProfileHovers}
                  setOpenMoreOptions={setOpenMoreOptions}
                  openMoreOptions={openMoreOptions}
                  handleHidePost={handleHidePost}
                  handleBookmark={handleBookmark}
                  hasMoreFeed={hasMoreFeed}
                  setCommentsOpen={setCommentsFeedOpen}
                  setMakeComment={setMakeCommentFeed}
                  commentsOpen={commentsFeedOpen}
                  makeComment={makeCommentFeed}
                  contentLoading={postContentLoading}
                  setContentLoading={setPostContentLoading}
                  postCollectGif={postCollectGif}
                />
                <Gallery
                  mirror={galleryMirror}
                  like={galleryLike}
                  openMirrorChoice={openMirrorGalleryChoice}
                  setOpenMirrorChoice={setOpenMirrorGalleryChoice}
                  interactionsLoading={interactionsGalleryLoading}
                  gallery={galleryItems}
                  cartItems={cartItems}
                  optionsOpen={optionsOpen}
                  setOptionsOpen={setOptionsOpen}
                  selectedOption={selectedOption}
                  handleOptionSelect={handleOptionSelect}
                  getMoreGallery={getMoreGallery}
                  followProfile={followProfile}
                  unfollowProfile={unfollowProfile}
                  followLoading={feedFollowLoading}
                  profileHovers={feedProfileHovers}
                  setProfileHovers={setFeedProfileHovers}
                  router={router}
                  openInteractions={openInteractions}
                  setOpenInteractions={setOpenInteractions}
                  dispatch={dispatch}
                />
              </div>
            </div>
          )
        )}
      </>
    );
  }

  return <RouterChange />;
};

export default Autograph;
