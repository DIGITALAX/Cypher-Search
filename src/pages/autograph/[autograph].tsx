import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
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

const Autograph: NextPage = (): JSX.Element => {
  const router = useRouter();
  const { autograph } = router.query;
  const dispatch = useDispatch();
  const [globalLoading, setGlobalLoading] = useState<boolean>(true);
  const searchActive = useSelector(
    (state: RootState) => state.app.searchActiveReducer.value
  );
  const profileFeed = useSelector(
    (state: RootState) => state.app.autographFeedReducer.feed
  );
  const gallery = useSelector(
    (state: RootState) => state.app.galleryItemsReducer.items
  );
  const display = useSelector(
    (state: RootState) => state.app.profileDisplayReducer.value
  );
  const profile = useSelector(
    (state: RootState) => state.app.autographProfileReducer.profile
  );
  const walletConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const filtersOpen = useSelector(
    (state: RootState) => state.app.filtersOpenReducer.value
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.items
  );
  const screenDisplay = useSelector(
    (state: RootState) => state.app.screenDisplayReducer.value
  );
  const { handleShuffleSearch } = useSearch();
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
  } = useProfile();
  const {
    handleLensConnect,
    openAccount,
    setOpenAccount,
    signInLoading,
    cartListOpen,
    setCartListOpen,
  } = useSignIn();
  const {
    profileLoading,
    getProfileData,
    sortType,
    setSortType,
  } = useAutograph();
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
  } = useFeed();
  const {
    galleryComment,
    galleryLike,
    galleryMirror,
    openMirrorGalleryChoice,
    setOpenMirrorGalleryChoice,
    interactionsGalleryLoading,
    interactionsDisplayLoading,
    openMirrorDisplayChoice,
    setOpenMirrorDisplayChoice,
    displayComment,
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
  } = useGallery();
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
    currencies,
    currencyOpen,
    setCurrencyOpen,
  } = useSettings();
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
  } = useBookmarks();

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
            filtersOpen={filtersOpen}
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
                  content={`https://chromadin.xyz/autograph/${profile?.handle?.localName}`}
                />
                <meta
                  name="og:title"
                  content={profile?.handle?.localName?.toUpperCase()}
                />
                <meta name="og:description" content={profile?.metadata?.bio} />
                <meta
                  name="og:image"
                  content={
                    !gallery?.created[0]?.images?.[0]
                      ? "https://chromadin.xyz/card.png/"
                      : `https://chromadin.infura-ipfs.io/ipfs/${gallery?.created[0]?.images?.[0]?.split(
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
                  content={`https://chromadin.xyz/autograph/${profile?.handle?.localName}`}
                />
                <meta
                  name="twitter:url"
                  content={`https://chromadin.xyz/autograph/${profile?.handle?.localName}`}
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
                openType={openType}
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
                comment={displayComment}
                mirror={displayMirror}
                like={displayLike}
                interactionsLoading={interactionsDisplayLoading}
                profile={profile}
                gallery={gallery}
                display={display}
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
                currencies={currencies}
                handleBookmark={handleBookmarkForBookmark}
                handleHidePost={handleHidePostForBookmark}
                handleMoreBookmarks={handleMoreBookmarks}
                hasMoreBookmarks={hasMoreBookmarks}
                mirrorBookmark={bookmarkMirror}
                commentBookmark={bookmarkComment}
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
              />
              <Bio profile={profile} />
              <div className="relative flex flex-row gap-3 items-start justify-between px-4 w-full h-full">
                <Feed
                  comment={feedComment}
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
                />
                <Gallery
                  comment={galleryComment}
                  mirror={galleryMirror}
                  like={galleryLike}
                  openMirrorChoice={openMirrorGalleryChoice}
                  setOpenMirrorChoice={setOpenMirrorGalleryChoice}
                  interactionsLoading={interactionsGalleryLoading}
                  gallery={gallery}
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
