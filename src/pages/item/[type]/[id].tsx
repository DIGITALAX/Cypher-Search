import RouterChange from "@/components/Common/modules/RouterChange";
import useSignIn from "@/components/Layout/hooks/useSignIn";
import useSearch from "@/components/Search/hooks/useSearch";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import Head from "next/head";
import { NextRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { createPublicClient, http } from "viem";
import { polygon, polygonMumbai } from "viem/chains";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import useSuggested from "@/components/Common/hooks/useSuggested";
import Suggested from "@/components/Common/modules/Suggested";
import useTiles from "@/components/Tiles/hooks/useTiles";
import useInteractions from "@/components/Tiles/hooks/useInteractions";
import NotFound from "@/components/Common/modules/NotFound";
import { RootState } from "../../../../redux/store";
import SwitchType from "@/components/Items/modules/SwitchType";
import useItem from "@/components/Items/hooks/useItem";
import { Creation } from "@/components/Tiles/types/tiles.types";
import {
  Mirror,
  Post,
  Profile,
  TextOnlyMetadataV3,
} from "../../../../graphql/generated";
import useComment from "@/components/Items/hooks/useComment";
import useProfile from "@/components/Autograph/hooks/useProfile";
import { itemTypeToString } from "../../../../lib/constants";
import { ItemType } from "@/components/Common/types/common.types";

const Item: NextPage<{ router: NextRouter }> = ({ router }): JSX.Element => {
  const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http(
      `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_MUMBAI}`
    ),
  });
  const { type, id } = router.query;
  const dispatch = useDispatch();
  const [globalLoading, setGlobalLoading] = useState<boolean>(true);
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const fullScreenVideo = useSelector(
    (state: RootState) => state.app.fullScreenVideoReducer
  );
  const allSearchItems = useSelector(
    (state: RootState) => state.app.searchItemsReducer
  );
  const filterConstants = useSelector(
    (state: RootState) => state.app.filterConstantsReducer.items
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.items
  );
  const filtersOpen = useSelector(
    (state: RootState) => state.app.filtersOpenReducer
  );
  const postCollectGif = useSelector(
    (state: RootState) => state.app.postCollectGifReducer
  );
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const walletConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const searchActive = useSelector(
    (state: RootState) => state.app.searchActiveReducer.value
  );
  const filterChange = useSelector(
    (state: RootState) => state.app.filterChangeReducer.change
  );
  const filters = useSelector(
    (state: RootState) => state.app.filterReducer.filter
  );
  const cartAnim = useSelector(
    (state: RootState) => state.app.cartAnimReducer.value
  );
  const layoutAmount = useSelector(
    (state: RootState) => state.app.layoutSwitchReducer.value
  );
  const { address, isConnected } = useAccount();
  const {
    itemLoading,
    itemData,
    purchaseDetails,
    setPurchaseDetails,
    handleInstantPurchase,
    instantLoading,
    approveSpend,
    isApprovedSpend,
    relatedData,
    handleDecrypt,
    decryptLoading,
    setItemData,
    setRelatedData,
  } = useItem(
    type as string,
    id as string,
    filterConstants,
    lensConnected,
    oracleData,
    address,
    publicClient,
    dispatch,
    router
  );
  const {
    handleMoreComments,
    allComments,
    allCommentsLoading,
    hasMoreComments,
    mainMakeComment,
    setMainMakeComment,
    setMainContentLoading,
    mainContentLoading,
    comment,
    makeComment,
    setMakeComment,
    setCommentsOpen,
    commentsOpen,
    interactionsItemsLoading,
    openItemMirrorChoice,
    setOpenItemMirrorChoice,
    simpleCollect,
    setOpenMoreOptions,
    openMoreOptions,
    handleBookmark,
    handleHidePost,
    contentLoading,
    setContentLoading,
    commentSwitch,
    setCommentSwitch,
    mainInteractionsLoading,
    setMainOpenMirrorChoice,
    openMainMirrorChoice,
    mirror: mirrorItem,
    like: likeItem,
    setOpenInteractions,
    openInteractions,
    setProfilesOpen,
    setMentionProfiles,
    setProfilesOpenMain,
    setMentionProfilesMain,
    setCaretCoord,
    setCaretCoordMain,
    caretCoord,
    caretCoordMain,
    mentionProfiles,
    mentionProfilesMain,
    profilesOpen,
    profilesOpenMain,
  } = useComment(
    address,
    publicClient,
    type === "chromadin" || type === "coinop"
      ? (itemData?.post as Creation)?.publication?.id
      : (itemData?.post as Mirror)?.__typename === "Mirror"
      ? (itemData?.post as Mirror)?.mirrorOn?.id
      : (itemData?.post as Post)?.id,
    lensConnected,
    dispatch,
    postCollectGif,
    router,
    relatedData?.collections,
    itemData,
    setItemData,
    type as string,
    setRelatedData
  );
  const { getMoreSuggested, suggestedFeed, loaders, setSuggestedFeed } =
    useSuggested(
      id as string,
      type === "chromadin" || type === "coinop" || type === "listener"
        ? (itemData?.post as Creation)?.profile
        : (itemData?.post as Mirror)?.__typename === "Mirror"
        ? (itemData?.post as Mirror)?.mirrorOn?.by
        : (itemData?.post as Profile),
      lensConnected
    );
  const { handleSearch, handleShuffleSearch, placeholderText } = useSearch(
    filtersOpen,
    lensConnected,
    searchActive,
    filterConstants,
    filters,
    suggestedFeed,
    dispatch,
    router
  );
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const {
    handleLensConnect,
    openAccount,
    setOpenAccount,
    signInLoading,
    cartListOpen,
    setCartListOpen,
    handleLogout,
  } = useSignIn(
    publicClient,
    address,
    isConnected,
    dispatch,
    oracleData,
    cartItems,
    lensConnected,
    cartAnim,
    openAccountModal
  );
  const {
    mirror,
    like,
    collect,
    interactionsLoading,
    setOpenMirrorChoice,
    openMirrorChoice,
  } = useInteractions(
    suggestedFeed,
    dispatch,
    publicClient,
    address,
    lensConnected,
    setSuggestedFeed,
  );
  const {
    followProfile: followItemProfile,
    unfollowProfile: unfollowItemProfile,
    feedFollowLoading: itemFollowLoading,
    feedProfileHovers: itemProfileHovers,
    setFeedProfileHovers: setItemProfileHovers,
    mainFollowLoading,
    mainProfileHovers,
    setMainProfileHovers,
    openMainMoreOptions,
    setMainOpenMoreOptions,
    hoverPrompt,
    setHoverPrompt,
  } = useProfile(
    relatedData?.collections ? relatedData?.collections : allComments,
    {
      collected: [],
      created: [],
    },
    lensConnected,
    dispatch,
    publicClient,
    address
  );
  const {
    setPopUpOpen,
    popUpOpen,
    apparel,
    setApparel,
    profileHovers,
    setProfileHovers,
    followLoading,
    followProfile,
    unfollowProfile,
  } = useTiles(
    suggestedFeed?.items || [],
    lensConnected,
    dispatch,
    publicClient,
    address
  );
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!itemLoading) {
        setGlobalLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [itemLoading]);

  if (!globalLoading && !itemLoading && type) {
    return (
      <>
        {!itemData?.post ||
        (Object.keys(itemData?.post).length === 1 &&
          (itemData?.post as any)?.decrypted === undefined) ? (
          <NotFound
            fullScreenVideo={fullScreenVideo}
            cartAnim={cartAnim}
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
            handleLogout={handleLogout}
            dispatch={dispatch}
            handleShuffleSearch={handleShuffleSearch}
          />
        ) : (
          itemData && (
            <div
              className="relative flex flex-col w-full h-full flex-grow"
              id="results"
            >
              <Head>
                <title>
                  {(type as string)?.toUpperCase()} |{" "}
                  {(id as string)?.replaceAll("_", " ")?.toUpperCase()}
                </title>
                <meta
                  name="og:url"
                  content={"https://cypher.digitalax.xyz/card.png/"}
                />
                <meta
                  name="og:title"
                  content={(id as string)?.replaceAll("_", " ")?.toUpperCase()}
                />
                <meta
                  name="og:description"
                  content={
                    itemData?.type === "chromadin" ||
                    itemData?.type === "coinop"
                      ? (itemData.post as Creation)?.collectionMetadata?.description
                      : (itemData?.post as Mirror)?.__typename === "Mirror"
                      ? (
                          (itemData?.post as Mirror)?.mirrorOn
                            ?.metadata as TextOnlyMetadataV3
                        )?.content
                      : (
                          (itemData?.post as Post)
                            ?.metadata as TextOnlyMetadataV3
                        )?.content
                  }
                />
                <meta
                  name="og:image"
                  content={"https://cypher.digitalax.xyz/card.png/"}
                />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@digitalax" />
                <meta name="twitter:creator" content="@digitalax" />
                <meta
                  name="twitter:image"
                  content={`https://cypher.digitalax.xyz/item/${
                    itemTypeToString[Number(type) as unknown as ItemType]
                  }/${(id as string)?.replaceAll("_", " ")}`}
                />
                <meta
                  name="twitter:url"
                  content={`https://cypher.digitalax.xyz/item/${
                    itemTypeToString[Number(type) as unknown as ItemType]
                  }/${(id as string)?.replaceAll("_", " ")}`}
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
                  href="https://cypher.digitalax.xyz/fonts/Bitblox.otf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/otf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/Austral.otf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/otf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/Ignite.otf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/otf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/BebasNeue.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/Vcr.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/InternalRainbows.otf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/otf"
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
                  href="https://cypher.digitalax.xyz/fonts/Gamer.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/Network.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/Dogica.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
              </Head>
              <Suggested
                filterChange={filterChange}
                fullScreenVideo={fullScreenVideo}
                moreSearchLoading={loaders?.moreSuggestedLoading}
                searchItems={suggestedFeed}
                cartAnim={cartAnim}
                component={
                  <SwitchType
                    allSearchItems={allSearchItems}
                    setCaretCoord={setCaretCoord}
                    hoverPrompt={hoverPrompt}
                    setHoverPrompt={setHoverPrompt}
                    setCaretCoordMain={setCaretCoordMain}
                    handleDecrypt={handleDecrypt}
                    decryptLoading={decryptLoading}
                    followMainLoading={mainFollowLoading}
                    mainProfileHovers={mainProfileHovers}
                    setMainProfileHovers={setMainProfileHovers}
                    openMainMoreOptions={openMainMoreOptions}
                    setMainOpenMoreOptions={setMainOpenMoreOptions}
                    handleMoreComments={handleMoreComments}
                    allCommentsLoading={allCommentsLoading}
                    hasMoreComments={hasMoreComments}
                    dispatch={dispatch}
                    router={router}
                    itemData={itemData!}
                    type={type as string}
                    filterConstants={filterConstants}
                    cartItems={cartItems}
                    purchaseDetails={purchaseDetails}
                    setPurchaseDetails={setPurchaseDetails}
                    oracleData={oracleData}
                    handleInstantPurchase={handleInstantPurchase}
                    instantLoading={instantLoading}
                    approveSpend={approveSpend}
                    isApprovedSpend={isApprovedSpend}
                    relatedData={relatedData}
                    lensConnected={lensConnected}
                    mirror={mirrorItem}
                    like={likeItem}
                    mainInteractionsLoading={mainInteractionsLoading}
                    openMainMirrorChoice={openMainMirrorChoice}
                    setMainOpenMirrorChoice={setMainOpenMirrorChoice}
                    allComments={allComments}
                    commentSwitch={commentSwitch}
                    setCommentSwitch={setCommentSwitch}
                    mainMakeComment={mainMakeComment!}
                    setMainMakeComment={setMainMakeComment}
                    postCollectGif={postCollectGif}
                    setMainContentLoading={setMainContentLoading}
                    mainContentLoading={mainContentLoading}
                    comment={comment}
                    setMakeComment={setMakeComment}
                    makeComment={makeComment}
                    setCommentsOpen={setCommentsOpen}
                    commentsOpen={commentsOpen}
                    interactionsLoading={interactionsItemsLoading}
                    profileHovers={itemProfileHovers}
                    setProfileHovers={setItemProfileHovers}
                    openMirrorChoice={openItemMirrorChoice}
                    setOpenMirrorChoice={setOpenItemMirrorChoice}
                    simpleCollect={simpleCollect}
                    followLoading={itemFollowLoading}
                    followProfile={followItemProfile}
                    unfollowProfile={unfollowItemProfile}
                    setOpenMoreOptions={setOpenMoreOptions}
                    openMoreOptions={openMoreOptions}
                    handleBookmark={handleBookmark}
                    handleHidePost={handleHidePost}
                    contentLoading={contentLoading}
                    setContentLoading={setContentLoading}
                    openInteractions={openInteractions}
                    setOpenInteractions={setOpenInteractions}
                    setMentionProfiles={setMentionProfiles}
                    setMentionProfilesMain={setMentionProfilesMain}
                    setProfilesOpen={setProfilesOpen}
                    setProfilesOpenMain={setProfilesOpenMain}
                    mentionProfiles={mentionProfiles}
                    mentionProfilesMain={mentionProfilesMain}
                    caretCoord={caretCoord}
                    caretCoordMain={caretCoordMain}
                    profilesOpen={profilesOpen}
                    profilesOpenMain={profilesOpenMain}
                  />
                }
                handleSearch={handleSearch}
                allSearchItems={allSearchItems}
                openConnectModal={openConnectModal}
                handleLensConnect={handleLensConnect}
                handleLogout={handleLogout}
                lensConnected={lensConnected}
                walletConnected={walletConnected}
                openAccount={openAccount}
                setOpenAccount={setOpenAccount}
                signInLoading={signInLoading}
                filtersOpen={filtersOpen?.value}
                handleShuffleSearch={handleShuffleSearch}
                placeholderText={placeholderText}
                dispatch={dispatch}
                layoutAmount={layoutAmount}
                cartItems={cartItems}
                cartListOpen={cartListOpen}
                setCartListOpen={setCartListOpen}
                router={router}
                includeSearch
                handleMoreSearch={getMoreSuggested}
                popUpOpen={popUpOpen}
                setPopUpOpen={setPopUpOpen}
                apparel={apparel}
                setApparel={setApparel}
                mirror={mirror}
                like={like}
                simpleCollect={collect}
                interactionsLoading={interactionsLoading}
                setOpenMirrorChoice={setOpenMirrorChoice}
                openMirrorChoice={openMirrorChoice}
                searchLoading={loaders?.suggestedLoading}
                followLoading={followLoading}
                followProfile={followProfile}
                unfollowProfile={unfollowProfile}
                profileHovers={profileHovers}
                setProfileHovers={setProfileHovers}
              />
            </div>
          )
        )}
      </>
    );
  }

  return <RouterChange />;
};

export default Item;
