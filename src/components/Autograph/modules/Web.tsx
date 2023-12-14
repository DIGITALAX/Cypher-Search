import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { ScreenDisplay, SortType, WebProps } from "../types/autograph.types";
import ScreenSwitch from "./ScreenSwitch";
import { setScreenDisplay } from "../../../../redux/reducers/screenDisplaySlice";
import Link from "next/link";
import handleImageError from "../../../../lib/helpers/handleImageError";

const Web: FunctionComponent<WebProps> = ({
  router,
  handleShuffleSearch,
  openConnectModal,
  sendMessageLoading,
  handleLensConnect,
  lensConnected,
  walletConnected,
  handleLogout,
  screenDisplay,
  sortType,
  address,
  setSortType,
  mirror,
  comment,
  like,
  interactionsLoading,
  openMirrorChoice,
  setOpenMirrorChoice,
  profile,
  display,
  cartItems,
  allCollections,
  handleSettingsUpdate,
  settingsUpdateLoading,
  settingsData,
  setSettingsData,
  coverImage,
  handleImage,
  pfpImage,
  dispatch,
  displayLoading,
  handleSetDisplay,
  handleFollowUpdate,
  followUpdateLoading,
  followData,
  setFollowData,
  openType,
  setOpenType,
  currencies,
  setCurrencyOpen,
  currencyOpen,
  bookmarks,
  bookmarksLoading,
  simpleCollect,
  handleBookmark,
  mirrorBookmark,
  likeBookmark,
  openMirrorChoiceBookmark,
  unfollowProfile,
  followProfile,
  openMoreOptions,
  profileHovers,
  setOpenMoreOptions,
  setProfileHovers,
  followLoading,
  setOpenMirrorChoiceBookmark,
  interactionsLoadingBookmark,
  handleHidePost,
  handleMoreBookmarks,
  hasMoreBookmarks,
  commentsOpen,
  setCommentsOpen,
  makeComment,
  setMakeComment,
  post,
  makePost,
  setMakePost,
  postLoading,
  commentContentLoading,
  postContentLoading,
  setCommentContentLoading,
  setPostContentLoading,
  postCollectGif,
  decryptOrder,
  orderActions,
  ordersLoading,
  setOrderActions,
  allOrders,
  allSales,
  salesLoading,
  setCollectionDetails,
  setCreateCase,
  createCase,
  collectionDetails,
  createDrop,
  createCollection,
  creationLoading,
  collectionSettings,
  setCollectionSettings,
  isDesigner,
  handleSendMessage,
  setDigiMessage,
  digiMessage,
  digiMessageLoading,
  handleMedia,
  filterConstants,
  dropDetails,
  setDropDetails,
  createDropLoading,
  dropsLoading,
  allDrops,
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
  editDrop,
  deleteDrop,
  deleteCollection,
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
  handleMessageImage,
  messageImage,
}): JSX.Element => {
  return (
    <div className="relative w-full min-h-[90rem] sm:min-h-[60rem] xl:min-h-[50rem] bg-web bg-cover flex flex-col xl:flex-row p-4 tablet:p-10 items-start xl:justify-between gap-12 sm:gap-10 xl:gap-20 h-fit">
      <div className="relative w-full h-fit flex flex-col items-start justify-start gap-5 xl:order-1 order-2">
        <div className="relative flex flex-col items-start justify-between w-full h-fit gap-1">
          <Link
            href={"/"}
            className="flex relative sm:absolute items-center justify-start w-10 h-10 sm:w-16 sm:h-16 cursor-pointer active:scale-95 z-1"
          >
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmfHsZ5w3oy2ENHek7prhM1XVVW8oPBGfEPcNy1jm7sWQq`}
              draggable={false}
            />
          </Link>
          {
            <div className="relative w-full h-16 gap-6 flex flex-row items-center justify-end">
              {screenDisplay === ScreenDisplay.Display &&
                [
                  {
                    image: "QmVnr2XT1hbkSNBWQNGC4GcTeWJx4cWRFxQjhe26JReQC1",
                    text: "private",
                    function: () => setSortType(SortType.Private),
                    type: SortType.Private,
                  },
                  {
                    image: "QmTwkfEqUXHAfY47BeMfQm7wGEtVwLxaRQzy5BrsgKyX8r",
                    text: "community",
                    function: () => setSortType(SortType.Community),
                    type: SortType.Community,
                  },
                  {
                    image: "QmNno9d9M82f21Z1633FBLtvA8ZNH8BSmy7BwSwHnuBEy8",
                    text: "public",
                    function: () => setSortType(SortType.Public),
                    type: SortType.Public,
                  },
                ].map(
                  (
                    item: {
                      image: string;
                      text: string;
                      function: () => void;
                      type: SortType;
                    },
                    index: number
                  ) => {
                    return (
                      <div
                        className="relative flex flex-col items-center justiy-center gap-1.5"
                        key={index}
                      >
                        <div
                          className={`relative w-8 h-8 sm:w-10 sm:h-10 cursor-pointer flex active:scale-95 ${
                            item.type === sortType && "mix-blend-luminosity"
                          }`}
                          onClick={() => item.function()}
                        >
                          <Image
                            layout="fill"
                            src={`${INFURA_GATEWAY}/ipfs/${item.image}`}
                            draggable={false}
                            onError={(e) => handleImageError(e)}
                          />
                        </div>
                        <div className="relative text-white font-bit text-white font-bit text-xxs sm:text-xs">
                          {item.text}
                        </div>
                      </div>
                    );
                  }
                )}
            </div>
          }
        </div>
        <ScreenSwitch
          address={address}
          handleMessageImage={handleMessageImage}
          messageImage={messageImage}
          setCaretCoord={setCaretCoord}
          setCaretCoordBookmark={setCaretCoordBookmark}
          editDrop={editDrop}
          deleteDrop={deleteDrop}
          handleMedia={handleMedia}
          searchCollection={searchCollection}
          setSearchCollection={setSearchCollection}
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          selectedUser={selectedUser}
          sendMessageLoading={sendMessageLoading}
          handleSearchUser={handleSearchUser}
          searchedProfiles={searchedProfiles}
          userSearch={userSearch}
          setSelectedUser={setSelectedUser}
          conversationsLoading={conversationsLoading}
          client={client}
          handleConversations={handleConversations}
          createDropLoading={createDropLoading}
          dropsLoading={dropsLoading}
          collectionLoading={collectionLoading}
          allDrops={allDrops}
          deleteCollection={deleteCollection}
          conversations={conversations}
          messages={messages}
          dropDetails={dropDetails}
          setDropDetails={setDropDetails}
          currencies={currencies}
          filterConstants={filterConstants}
          canMessage={canMessage}
          handleSelected={handleSelected}
          lensConnected={lensConnected}
          setCurrencyOpen={setCurrencyOpen}
          currencyOpen={currencyOpen}
          mirror={mirror}
          handleSendMessage={handleSendMessage}
          digiMessage={digiMessage}
          setDigiMessage={setDigiMessage}
          digiMessageLoading={digiMessageLoading}
          openType={openType}
          isDesigner={isDesigner}
          setOpenType={setOpenType}
          displayLoading={displayLoading}
          handleSetDisplay={handleSetDisplay}
          openMirrorChoice={openMirrorChoice}
          setOpenMirrorChoice={setOpenMirrorChoice}
          sortType={sortType}
          screenDisplay={screenDisplay}
          like={like}
          interactionsLoading={interactionsLoading}
          dispatch={dispatch}
          allCollections={allCollections}
          display={display}
          setCollectionSettings={setCollectionSettings}
          collectionSettings={collectionSettings}
          setSettingsData={setSettingsData}
          settingsData={settingsData}
          handleSettingsUpdate={handleSettingsUpdate}
          settingsUpdateLoading={settingsUpdateLoading}
          handleImage={handleImage}
          pfpImage={pfpImage}
          coverImage={coverImage}
          owner={
            lensConnected?.handle?.fullHandle === profile?.handle?.fullHandle
          }
          handleFollowUpdate={handleFollowUpdate}
          followUpdateLoading={followUpdateLoading}
          followData={followData}
          setFollowData={setFollowData}
          handleBookmark={handleBookmark}
          handleHidePost={handleHidePost}
          handleMoreBookmarks={handleMoreBookmarks}
          hasMoreBookmarks={hasMoreBookmarks}
          mirrorBookmark={mirrorBookmark}
          comment={comment}
          makeComment={makeComment}
          setCommentsOpen={setCommentsOpen}
          setMakeComment={setMakeComment}
          commentsOpen={commentsOpen}
          openMirrorChoiceBookmark={openMirrorChoiceBookmark}
          setOpenMirrorChoiceBookmark={setOpenMirrorChoiceBookmark}
          setOpenMoreOptions={setOpenMoreOptions}
          setProfileHovers={setProfileHovers}
          simpleCollect={simpleCollect}
          openMoreOptions={openMoreOptions}
          profileHovers={profileHovers}
          likeBookmark={likeBookmark}
          interactionsLoadingBookmark={interactionsLoadingBookmark}
          bookmarks={bookmarks}
          handleDecrypt={handleDecrypt}
          decryptLoading={decryptLoading}
          bookmarksLoading={bookmarksLoading}
          router={router}
          unfollowProfile={unfollowProfile}
          followLoading={followLoading}
          followProfile={followProfile}
          makePost={makePost}
          setMakePost={setMakePost}
          post={post}
          cartItems={cartItems}
          postLoading={postLoading}
          commentContentLoading={commentContentLoading}
          setCommentContentLoading={setCommentContentLoading}
          postContentLoading={postContentLoading}
          setPostContentLoading={setPostContentLoading}
          postCollectGif={postCollectGif}
          decryptOrder={decryptOrder}
          orderActions={orderActions}
          ordersLoading={ordersLoading}
          setOrderActions={setOrderActions}
          allOrders={allOrders}
          allSales={allSales}
          salesLoading={salesLoading}
          creationLoading={creationLoading}
          createDrop={createDrop}
          createCollection={createCollection}
          setCollectionDetails={setCollectionDetails}
          collectionDetails={collectionDetails}
          createCase={createCase}
          setCreateCase={setCreateCase}
          setMentionProfiles={setMentionProfiles}
          setProfilesOpen={setProfilesOpen}
          profilesOpen={profilesOpen}
          mentionProfiles={mentionProfiles}
          caretCoord={caretCoord}
          setMentionProfilesBookmark={setMentionProfilesBookmark}
          setProfilesOpenBookmark={setProfilesOpenBookmark}
          profilesOpenBookmark={profilesOpenBookmark}
          mentionProfilesBookmark={mentionProfilesBookmark}
          caretCoordBookmark={caretCoordBookmark}
        />
      </div>
      {lensConnected?.handle?.fullHandle === profile?.handle?.fullHandle ? (
        <div className="relative w-full xl:w-fit h-fit items-center justify-between xl:justify-center flex flex-row xl:flex-col gap-6 tablet:gap-4 xl:order-2 order-1 flex-wrap xl:flex-nowrap">
          {[
            {
              image: "QmRozkh6CWW9u3ATqcMKr4w4LUEd4h1vNN4Gon3zsrtCA4",
              text: "display",
              function: () => dispatch(setScreenDisplay(ScreenDisplay.Display)),
              width: "2.5rem",
              height: "2.25rem",
              type: ScreenDisplay.Display,
              sWidth: "1.75rem",
              sHeight: "1.5rem",
            },
            {
              image: "QmaGQyeUd1Upcei8b9UxiTC7TuDaQPP4Ps5mZpVB1w6Gto",
              text: "gallery",
              function: () => dispatch(setScreenDisplay(ScreenDisplay.Gallery)),
              width: "2.5rem",
              height: "2rem",
              type: ScreenDisplay.Gallery,
              sWidth: "1.75rem",
              sHeight: "1.4rem",
            },
            {
              image: "QmTTtDqqjwxYbz3rvfGuyB3fz8YQj27qEVdJLHRYkFg4D9",
              text: "circuits",
              function: () =>
                dispatch(setScreenDisplay(ScreenDisplay.Circuits)),
              width: "2.5rem",
              height: "2.5rem",
              type: ScreenDisplay.Circuits,
              sWidth: "1.75rem",
              sHeight: "1.75rem",
            },
            {
              image: "QmaRcPqtKii9T6FZzFekRvaPHMMLzZzQi37KxkMxLW72so",
              text: "bookmarks",
              function: () =>
                dispatch(setScreenDisplay(ScreenDisplay.Bookmarks)),
              width: "2rem",
              height: "2.5rem",
              type: ScreenDisplay.Bookmarks,
              sWidth: "1.5rem",
              sHeight: "1.75rem",
            },
            {
              image: "QmeBzqFPc3nvegBtwpNjViVNtiEkWsPSWjJaTem9bysdBU",
              text: "post",
              function: () => dispatch(setScreenDisplay(ScreenDisplay.Post)),
              width: "2.5rem",
              height: "2.5rem",
              type: ScreenDisplay.Post,
              sWidth: "1.75rem",
              sHeight: "1.75rem",
            },
            {
              image: "Qmd7w4HyNrtWvSy48jGnidSx77mSqgAALTsVrbcVcSMeoG",
              text: "orders",
              function: () => dispatch(setScreenDisplay(ScreenDisplay.Orders)),
              width: "2.5rem",
              height: "2.5rem",
              type: ScreenDisplay.Orders,
              sWidth: "1.75rem",
              sHeight: "1.75rem",
            },
            {
              image: "QmQ8U7cmvoUizxS7tFeWGcUs7f54svfBdxE6aXfTgPbshw",
              text: "sales",
              function: () => dispatch(setScreenDisplay(ScreenDisplay.Sales)),
              width: "2.5rem",
              height: "2.5rem",
              type: ScreenDisplay.Sales,
              sWidth: "1.75rem",
              sHeight: "1.75rem",
            },
            {
              image: "QmevFbk17FCsk2hxS6UChLyMd2rJX1UsgbBThQZ32AKY4V",
              text: "settings",
              function: () =>
                dispatch(setScreenDisplay(ScreenDisplay.Settings)),
              width: "2.5rem",
              height: "2.5rem",
              type: ScreenDisplay.Settings,
              sWidth: "1.75rem",
              sHeight: "1.75rem",
            },
            {
              image: "QmXm26YHs1k1cZuBBXsNB5ifuAdq2db7AmZHSoHYSY6x6c",
              text: "messages",
              function: () =>
                dispatch(setScreenDisplay(ScreenDisplay.Messages)),
              width: "2.5rem",
              height: "2.5rem",
              type: ScreenDisplay.Messages,
              sWidth: "1.75rem",
              sHeight: "1.75rem",
            },
          ].map(
            (
              item: {
                image: string;
                text: string;
                function: () => void;
                width: string;
                height: string;
                type: ScreenDisplay;
                sWidth: string;
                sHeight: string;
              },
              index: number
            ) => {
              return (
                <div
                  className={
                    "relative flex items-center justify-center w-fit h-fit text-center flex-col gap-1.5"
                  }
                  key={index}
                >
                  <div className="relative w-fit h-fit flex items-center justify-center">
                    <div
                      style={{
                        height:
                          window?.innerWidth < 648 ? item.sHeight : item.height,
                        width:
                          window?.innerWidth < 648 ? item.sWidth : item.width,
                      }}
                      className={`relative flex items-center justify-center cursor-pointer active:scale-95 ${
                        item.type === screenDisplay && "mix-blend-luminosity"
                      }`}
                      onClick={() => item.function()}
                    >
                      <Image
                        layout="fill"
                        draggable={false}
                        src={`${INFURA_GATEWAY}/ipfs/${item.image}`}
                        onError={(e) => handleImageError(e)}
                      />
                    </div>
                  </div>
                  <div className="relative text-white font-bit text-white font-bit text-xs">
                    {item.text}
                  </div>
                </div>
              );
            }
          )}
        </div>
      ) : (
        <div className="relative w-full xl:w-fit h-fit items-center justify-start flex flex-row xl:flex-col gap-6 tablet:gap-4 xl:order-2 order-1 flex-wrap xl:flex-nowrap">
          {[
            {
              image: !walletConnected
                ? "QmZKHPMFLzxngWNbik7TS9jSiHasYSbRPeJs9xXBUvHSwm"
                : "QmdvSykeWq4MphAA8CerK3VqEXMjJBNeVje3Ae2BkKgZxb",
              text: !walletConnected
                ? "connect"
                : walletConnected && !lensConnected?.id
                ? "lens"
                : "logout",
              function: !walletConnected
                ? openConnectModal!
                : walletConnected && !lensConnected?.id
                ? () => handleLensConnect()
                : () => handleLogout(),
              width: "7",
              height: "7",
            },
            {
              image: "QmP7ESx5WEVSxyvKvsWBCWYhpWJytVt2Eozr6wqMnyb3M5",
              text: "home",
              function: lensConnected?.handle?.suggestedFormatted?.localName
                ? () =>
                    router.push(
                      `/autograph/${
                        lensConnected?.handle?.suggestedFormatted?.localName?.split(
                          "@"
                        )?.[1]
                      }`
                    )
                : !walletConnected
                ? openConnectModal!
                : () => handleLensConnect(),
              width: "9",
              height: "7",
            },
            {
              image: "QmYbjMNQAVuQSWNNQ5AKbQtt4Dxw2ax4SvLNwKhCNDniL2",
              text: "discover",
              function: () => {
                handleShuffleSearch();
                router.push("/");
              },
              width: "8",
              height: "7",
            },
          ].map(
            (
              item: {
                image: string;
                text: string;
                function: () => void;
                width: string;
                height: string;
              },
              index: number
            ) => {
              return (
                <div
                  className={
                    "relative flex items-center justify-center w-fit h-fit text-center flex-col gap-1.5"
                  }
                  key={index}
                >
                  <div className="relative w-fit h-fit flex items-center justify-center">
                    <div
                      className={`relative w-${item.width} h-${item.height} flex items-center justify-center cursor-pointer active:scale-95`}
                      onClick={() => item.function()}
                    >
                      <Image
                        layout="fill"
                        draggable={false}
                        src={`${INFURA_GATEWAY}/ipfs/${item.image}`}
                        onError={(e) => handleImageError(e)}
                      />
                    </div>
                  </div>
                  <div className="relative text-white font-bit text-white font-bit text-xs">
                    {item.text}
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
};

export default Web;
