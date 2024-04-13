import Head from "next/head";
import { FunctionComponent } from "react";
import { useSelector } from "react-redux";
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
import useOrders from "@/components/Autograph/hooks/useOrders";
import useSales from "@/components/Autograph/hooks/useSales";
import useCreate from "@/components/Autograph/hooks/useCreate";
import useConversations from "@/components/Autograph/hooks/useConversations";
import useDrop from "@/components/Autograph/hooks/useDrop";
import Image from "next/legacy/image";
import useQuests from "@/components/Autograph/hooks/useQuests";
import { useTranslation } from "next-i18next";
import { RootState } from "../../../../redux/store";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { AutoHydrateProps } from "../types/autograph.types";

const AutoHydrate: FunctionComponent<AutoHydrateProps> = ({
  router,
  tCom,
  dispatch,
  lensConnected,
  address,
  client,
  profile,
  cartItems,
  openConnectModal,
  handleLensConnect,
  walletConnected,
  handleLogout,
  filterConstants,
  handleShuffleSearch,
  publicClient,
}): JSX.Element => {
  const { t } = useTranslation("autograph");
  const postCollectGif = useSelector(
    (state: RootState) => state.app.postCollectGifReducer
  );
  const profileDisplay = useSelector(
    (state: RootState) => state.app.profileDisplayReducer?.value
  );
  const availableCurrencies = useSelector(
    (state: RootState) => state.app.availableCurrenciesReducer.currencies
  );
  const isDesigner = useSelector(
    (state: RootState) => state.app.isDesignerReducer.value
  );
  const screenDisplay = useSelector(
    (state: RootState) => state.app.screenDisplayReducer.value
  );
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
    profileFeed,
    handleDecrypt,
    decryptLoading,
    setCaretCoordFeed,
    setProfilesOpenFeed,
    setMentionProfilesFeed,
    mentionProfilesFeed,
    profilesOpenFeed,
    caretCoordFeed,
  } = useFeed(
    lensConnected,
    postCollectGif,
    profile,
    dispatch,
    publicClient,
    address,
    tCom
  );
  const { questsLoading, questSample } = useQuests(profile, lensConnected);
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
    sortType,
    setSortType,
    gallery,
    cursorInfo,
    moreGalleryLoading,
  } = useGallery(
    lensConnected,
    profileDisplay,
    dispatch,
    publicClient,
    address,
    profile,
    tCom
  );
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
    gallery,
    lensConnected,
    dispatch,
    publicClient,
    address,
    router,
    tCom
  );
  const {
    createDrop,
    dropDetails,
    setDropDetails,
    dropsLoading,
    allDrops,
    createDropLoading,
    searchCollection,
    setSearchCollection,
    editDrop,
    deleteDrop,
  } = useDrop(publicClient, dispatch, address, profile);
  const {
    setCollectionDetails,
    setCreateCase,
    createCase,
    collectionDetails,
    createCollection,
    creationLoading,
    setCollectionSettings,
    collectionSettings,
    handleMedia,
    deleteCollection,
    allCollections,
    collectionLoading,
  } = useCreate(
    publicClient,
    address,
    dispatch,
    lensConnected,
    setDropDetails,
    screenDisplay,
    profile,
    client,
    isDesigner,
    tCom
  );
  const {
    handleSendMessage,
    sendMessageLoading,
    setDigiMessage,
    digiMessage,
    digiMessageLoading,
    conversations,
    messages,
    handleConversations,
    conversationsLoading,
    client: xmtpClient,
    selectedUser,
    handleSearchUser,
    searchedProfiles,
    userSearch,
    setSelectedUser,
    currentMessage,
    setCurrentMessage,
    canMessage,
    handleSelected,
    handleMessageImage,
    messageImage,
  } = useConversations(address, screenDisplay, lensConnected, profile);
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
    address,
    screenDisplay,
    isDesigner,
    profile,
    tCom
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
    handleDecryptBookmark,
    decryptLoadingBookmark,
    setCaretCoordBookmark,
    setMentionProfilesBookmark,
    setProfilesOpenBookmark,
    mentionProfilesBookmark,
    profilesOpenBookmark,
    caretCoordBookmark,
  } = useBookmarks(
    lensConnected,
    postCollectGif,
    screenDisplay,
    dispatch,
    publicClient,
    address,
    profile,
    tCom
  );
  const {
    makePost,
    setMakePost,
    post,
    postLoading,
    postContentLoading,
    setPostContentLoading,
  } = usePost(dispatch, postCollectGif, publicClient, address, tCom);
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

  return (
    <div
      className="relative flex flex-col w-full h-full flex-grow"
      id="results"
    >
      <Head>
        <title>Cypher | {profile?.handle?.localName?.toUpperCase()}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="og:url"
          content={`https://cypher.digitalax.xyz/autograph/${
            profile?.handle?.suggestedFormatted?.localName?.split("@")[1]
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
            !gallery?.created[0]?.collectionMetadata?.images?.[0]
              ? "https://cypher.digitalax.xyz/card.png/"
              : `https://chromadin.infura-ipfs.io/ipfs/${gallery?.created[0]?.collectionMetadata?.images?.[0]?.split(
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
          content={`https://cypher.digitalax.xyz/autograph/${
            profile?.handle?.suggestedFormatted?.localName?.split("@")[1]
          }`}
        />
        <meta
          name="twitter:url"
          content={`https://cypher.digitalax.xyz/autograph/${
            profile?.handle?.suggestedFormatted?.localName?.split("@")[1]
          }`}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="canonical" href={"https://cypher.digitalax.xyz/card.png/"} />
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
      <Web
        t={t}
        tCom={tCom}
        cartItems={cartItems}
        address={address}
        handleMessageImage={handleMessageImage}
        messageImage={messageImage}
        setCaretCoord={setCaretCoordBookmark}
        setCaretCoordBookmark={setCaretCoordBookmark}
        setMentionProfiles={setMentionProfilesBookmark}
        setProfilesOpen={setProfilesOpenBookmark}
        profilesOpen={profilesOpenBookmark}
        mentionProfiles={mentionProfilesBookmark}
        caretCoord={caretCoordBookmark}
        setMentionProfilesBookmark={setMentionProfilesBookmark}
        setProfilesOpenBookmark={setProfilesOpenBookmark}
        profilesOpenBookmark={profilesOpenBookmark}
        mentionProfilesBookmark={mentionProfilesBookmark}
        caretCoordBookmark={caretCoordBookmark}
        decryptLoading={decryptLoadingBookmark}
        handleDecrypt={handleDecryptBookmark}
        allCollections={allCollections}
        searchCollection={searchCollection}
        setSearchCollection={setSearchCollection}
        sendMessageLoading={sendMessageLoading}
        router={router}
        handleSelected={handleSelected}
        canMessage={canMessage}
        deleteCollection={deleteCollection}
        conversationsLoading={conversationsLoading}
        client={xmtpClient}
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        handleConversations={handleConversations}
        conversations={conversations}
        messages={messages}
        selectedUser={selectedUser}
        handleSearchUser={handleSearchUser}
        searchedProfiles={searchedProfiles}
        userSearch={userSearch}
        setSelectedUser={setSelectedUser}
        dropDetails={dropDetails}
        setDropDetails={setDropDetails}
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
        digiMessage={digiMessage}
        setDigiMessage={setDigiMessage}
        digiMessageLoading={digiMessageLoading}
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
        handleLogout={handleLogout}
        screenDisplay={screenDisplay}
        sortType={sortType}
        setSortType={setSortType}
        setOpenMirrorChoice={setOpenMirrorDisplayChoice}
        openMirrorChoice={openMirrorDisplayChoice}
        mirror={displayMirror}
        like={displayLike}
        interactionsLoading={interactionsDisplayLoading}
        profile={profile}
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
        editDrop={editDrop}
        deleteDrop={deleteDrop}
        setCollectionSettings={setCollectionSettings}
        collectionSettings={collectionSettings}
        dropsLoading={dropsLoading}
        collectionLoading={collectionLoading}
        allDrops={allDrops}
        createDropLoading={createDropLoading}
      />
      <Bio
        t={t}
        profile={profile}
        dispatch={dispatch}
        router={router}
        questsLoading={questsLoading}
        questSample={questSample}
      />
      <div className="relative flex flex-row gap-12 otro:gap-3 items-start justify-between sm:px-4 w-full h-full otro:flex-nowrap flex-wrap">
        <Feed
          t={t}
          tCom={tCom}
          cartItems={cartItems}
          caretCoord={caretCoordFeed}
          setCaretCoord={setCaretCoordFeed}
          setMentionProfiles={setMentionProfilesFeed}
          setProfilesOpen={setProfilesOpenFeed}
          profilesOpen={profilesOpenFeed}
          mentionProfiles={mentionProfilesFeed}
          decryptLoading={decryptLoading}
          handleDecrypt={handleDecrypt}
          lensConnected={lensConnected}
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
          followLoading={feedFollowLoading}
          profileHovers={feedProfileHovers}
          setProfileHovers={setFeedProfileHovers}
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
          t={t}
          hasMoreGallery={cursorInfo?.hasMore}
          lensConnected={lensConnected}
          mirror={galleryMirror}
          like={galleryLike}
          profile={profile}
          moreGalleryLoading={moreGalleryLoading}
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
          followLoading={galleryFollowLoading}
          profileHovers={galleryProfileHovers}
          setProfileHovers={setGalleryProfileHovers}
          router={router}
          openInteractions={openInteractions}
          setOpenInteractions={setOpenInteractions}
          dispatch={dispatch}
          allDrops={allDrops}
        />
        <div
          className="absolute w-[60vw] h-[30rem] lg:h-[50rem] bottom-0 items-end justify-center opacity-20 hidden sm:flex mb-auto mr-auto right-0"
          draggable={false}
        >
          <Image
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/QmV4yM96Dt2ypLN9GMHkXPTkeCGfTQfJErJLfVjikxt52s`}
            draggable={false}
            objectFit="contain"
          />
        </div>
      </div>
    </div>
  );
};

export default AutoHydrate;
