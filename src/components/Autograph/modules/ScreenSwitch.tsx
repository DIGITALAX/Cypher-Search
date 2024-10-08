import { FunctionComponent } from "react";
import { ScreenDisplay, ScreenSwitchProps } from "../types/autograph.types";
import Display from "./Screen/Display";
import Settings from "./Screen/Settings";
import Circuits from "./Screen/Circuits";
import Gallery from "./Screen/Gallery";
import Bookmarks from "./Screen/Bookmarks";
import Orders from "./Screen/Orders";
import ScreenPost from "./Screen/ScreenPost";
import Sales from "./Screen/Sales";
import Messages from "./Screen/Messages";

const ScreenSwitch: FunctionComponent<ScreenSwitchProps> = ({
  screenDisplay,
  mirror,
  like,
  sendMessageLoading,
  openMirrorChoice,
  setOpenMirrorChoice,
  interactionsLoading,
  sortType,
  display,
  settingsData,
  setSettingsData,
  handleSettingsUpdate,
  settingsUpdateLoading,
  coverImage,
  dispatch,
  pfpImage,
  handleImage,
  handleSetDisplay,
  displayLoading,
  owner,
  handleFollowUpdate,
  followUpdateLoading,
  followData,
  setFollowData,
  openType,
  setOpenType,
  setCurrencyOpen,
  currencyOpen,
  currencies,
  bookmarks,
  bookmarksLoading,
  simpleCollect,
  handleBookmark,
  mirrorBookmark,
  likeBookmark,
  comment,
  openMirrorChoiceBookmark,
  unfollowProfile,
  t,
  followProfile,
  openMoreOptions,
  profileHovers,
  setOpenMoreOptions,
  setProfileHovers,
  followLoading,
  router,
  setOpenMirrorChoiceBookmark,
  interactionsLoadingBookmark,
  handleHidePost,
  handleMoreBookmarks,
  hasMoreBookmarks,
  setMakeComment,
  makeComment,
  setCommentsOpen,
  commentsOpen,
  makePost,
  setMakePost,
  postLoading,
  post,
  commentContentLoading,
  setCommentContentLoading,
  postContentLoading,
  setPostContentLoading,
  postCollectGif,
  allOrders,
  setOrderActions,
  orderActions,
  ordersLoading,
  decryptOrder,
  allSales,
  salesLoading,
  creationLoading,
  createDrop,
  createCollection,
  setCollectionDetails,
  setCreateCase,
  createCase,
  collectionDetails,
  collectionSettings,
  setCollectionSettings,
  isDesigner,
  handleSendMessage,
  digiMessage,
  setDigiMessage,
  digiMessageLoading,
  handleMedia,
  lensConnected,
  filterConstants,
  dropDetails,
  setDropDetails,
  createDropLoading,
  allDrops,
  dropsLoading,
  conversations,
  messages,
  client,
  conversationsLoading,
  handleConversations,
  searchedProfiles,
  selectedUser,
  setSelectedUser,
  handleSearchUser,
  userSearch,
  currentMessage,
  setCurrentMessage,
  searchCollection,
  setSearchCollection,
  deleteDrop,
  editDrop,
  deleteCollection,
  allCollections,
  collectionLoading,
  handleDecrypt,
  decryptLoading,
  handleSelected,
  canMessage,
  setMentionProfiles,
  setProfilesOpen,
  profilesOpen,
  mentionProfiles,
  caretCoord,
  setMentionProfilesBookmark,
  setProfilesOpenBookmark,
  profilesOpenBookmark,
  mentionProfilesBookmark,
  caretCoordBookmark,
  setCaretCoord,
  setCaretCoordBookmark,
  messageImage,
  handleMessageImage,
  cartItems,
  locale,
  address,
}): JSX.Element => {
  if (!owner) {
    return (
      <Display
        locale={locale}
        dispatch={dispatch}
        mirror={mirror}
        t={t}
        like={like}
        openMirrorChoice={openMirrorChoice}
        setOpenMirrorChoice={setOpenMirrorChoice}
        interactionsLoading={interactionsLoading}
        sortType={sortType}
        display={display}
        handleSetDisplay={handleSetDisplay}
        displayLoading={displayLoading}
        owner={owner}
        router={router}
      />
    );
  } else {
    switch (screenDisplay) {
      case ScreenDisplay.Circuits:
        return <Circuits t={t} />;

      case ScreenDisplay.Gallery:
        return (
          <Gallery
            t={t}
            locale={locale}
            address={address}
            allCollections={allCollections}
            editDrop={editDrop}
            deleteDrop={deleteDrop}
            dispatch={dispatch}
            deleteCollection={deleteCollection}
            searchCollection={searchCollection}
            setSearchCollection={setSearchCollection}
            dropsLoading={dropsLoading}
            collectionLoading={collectionLoading}
            allDrops={allDrops}
            createDropLoading={createDropLoading}
            dropDetails={dropDetails}
            setDropDetails={setDropDetails}
            handleMedia={handleMedia}
            handleSendMessage={handleSendMessage}
            digiMessage={digiMessage}
            setDigiMessage={setDigiMessage}
            filterConstants={filterConstants}
            digiMessageLoading={digiMessageLoading}
            setCollectionDetails={setCollectionDetails}
            collectionDetails={collectionDetails}
            createCollection={createCollection}
            createDrop={createDrop}
            creationLoading={creationLoading}
            createCase={createCase}
            setCreateCase={setCreateCase}
            router={router}
            setCollectionSettings={setCollectionSettings}
            collectionSettings={collectionSettings}
            isDesigner={isDesigner}
            lensConnected={lensConnected}
          />
        );

      case ScreenDisplay.Post:
        return (
          <ScreenPost
            t={t}
            locale={locale}
            makePost={makePost}
            post={post}
            router={router}
            setMakePost={setMakePost}
            postLoading={postLoading}
            contentLoading={postContentLoading}
            dispatch={dispatch}
            postCollectGif={postCollectGif}
            setContentLoading={setPostContentLoading}
            setMentionProfiles={setMentionProfiles}
            setProfilesOpen={setProfilesOpen}
            profilesOpen={profilesOpen}
            mentionProfiles={mentionProfiles}
            lensConnected={lensConnected}
            caretCoord={caretCoord}
            setCaretCoord={setCaretCoord}
          />
        );

      case ScreenDisplay.Bookmarks:
        return (
          <Bookmarks
            t={t}
            cartItems={cartItems}
            setCaretCoord={setCaretCoordBookmark}
            caretCoord={caretCoordBookmark}
            locale={locale}
            setMentionProfiles={setMentionProfilesBookmark}
            setProfilesOpen={setProfilesOpenBookmark}
            mentionProfiles={mentionProfilesBookmark}
            profilesOpen={profilesOpenBookmark}
            handleDecrypt={handleDecrypt}
            decryptLoading={decryptLoading}
            bookmarks={bookmarks}
            lensConnected={lensConnected}
            bookmarksLoading={bookmarksLoading}
            simpleCollect={simpleCollect}
            mirror={mirrorBookmark}
            like={likeBookmark}
            comment={comment}
            handleBookmark={handleBookmark}
            interactionsLoading={interactionsLoadingBookmark}
            openMirrorChoice={openMirrorChoiceBookmark}
            setOpenMirrorChoice={setOpenMirrorChoiceBookmark}
            setProfileHovers={setProfileHovers}
            profileHovers={profileHovers}
            openMoreOptions={openMoreOptions}
            setOpenMoreOptions={setOpenMoreOptions}
            dispatch={dispatch}
            router={router}
            followLoading={followLoading}
            unfollowProfile={unfollowProfile}
            followProfile={followProfile}
            handleHidePost={handleHidePost}
            handleMoreBookmarks={handleMoreBookmarks}
            hasMoreBookmarks={hasMoreBookmarks}
            setMakeComment={setMakeComment}
            makeComment={makeComment}
            setCommentsOpen={setCommentsOpen}
            commentsOpen={commentsOpen}
            contentLoading={commentContentLoading}
            setContentLoading={setCommentContentLoading}
            postCollectGif={postCollectGif}
          />
        );

      case ScreenDisplay.Settings:
        return (
          <Settings
            t={t}
            isDesigner={isDesigner}
            settingsData={settingsData}
            setSettingsData={setSettingsData}
            handleSettingsUpdate={handleSettingsUpdate}
            settingsUpdateLoading={settingsUpdateLoading}
            handleImage={handleImage}
            pfpImage={pfpImage}
            coverImage={coverImage}
            handleFollowUpdate={handleFollowUpdate}
            followUpdateLoading={followUpdateLoading}
            followData={followData}
            setFollowData={setFollowData}
            openType={openType}
            setOpenType={setOpenType}
            setCurrencyOpen={setCurrencyOpen}
            currencyOpen={currencyOpen}
            currencies={currencies}
          />
        );

      case ScreenDisplay.Messages:
        return (
          <Messages
            messageImage={messageImage}
            t={t}
            handleMessageImage={handleMessageImage}
            dispatch={dispatch}
            sendMessageLoading={sendMessageLoading}
            selectedUser={selectedUser}
            handleSearchUser={handleSearchUser}
            searchedProfiles={searchedProfiles}
            userSearch={userSearch}
            setSelectedUser={setSelectedUser}
            conversations={conversations}
            messages={messages}
            handleConversations={handleConversations}
            client={client}
            conversationsLoading={conversationsLoading}
            currentMessage={currentMessage}
            setCurrentMessage={setCurrentMessage}
            handleSendMessage={handleSendMessage}
            handleSelected={handleSelected}
            canMessage={canMessage}
          />
        );

      case ScreenDisplay.Orders:
        return (
          <Orders
            t={t}
            allOrders={allOrders}
            decryptOrder={decryptOrder}
            orderActions={orderActions}
            ordersLoading={ordersLoading}
            setOrderActions={setOrderActions}
            router={router}
          />
        );

      case ScreenDisplay.Sales:
        return (
          <Sales
            t={t}
            allSales={allSales}
            salesLoading={salesLoading}
            router={router}
          />
        );

      default:
        return (
          <Display
            t={t}
            locale={locale}
            dispatch={dispatch}
            mirror={mirror}
            like={like}
            openMirrorChoice={openMirrorChoice}
            setOpenMirrorChoice={setOpenMirrorChoice}
            interactionsLoading={interactionsLoading}
            sortType={sortType}
            display={display}
            handleSetDisplay={handleSetDisplay}
            displayLoading={displayLoading}
            owner={owner}
            router={router}
          />
        );
    }
  }
};

export default ScreenSwitch;
