import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { ScreenDisplay, SortType, WebProps } from "../types/autograph.types";
import ScreenSwitch from "./ScreenSwitch";
import { setScreenDisplay } from "../../../../redux/reducers/screenDisplaySlice";
import Link from "next/link";

const Web: FunctionComponent<WebProps> = ({
  router,
  handleShuffleSearch,
  openConnectModal,
  handleLensConnect,
  lensConnected,
  walletConnected,
  openAccountModal,
  screenDisplay,
  sortType,
  setSortType,
  mirror,
  comment,
  like,
  interactionsLoading,
  openMirrorChoice,
  setOpenMirrorChoice,
  profile,
  gallery,
  display,
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
  activeGallery,
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
  setMessage,
  message,
  messageLoading,
  handleMedia,
  filterConstants,
}): JSX.Element => {
  return (
    <div className="relative w-full h-[95vh] bg-web bg-cover flex flex-row p-10 items-start justify-between gap-20">
      <div className="relative w-full h-fit flex flex-col items-start justify-start gap-5">
        <div className="relative flex flex-col items-start justify-between w-full h-fit gap-1">
          <Link
            href={"/"}
            className="flex absolute items-center justify-start w-16 h-16 cursor-pointer active:scale-95 z-1"
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
                          className={`relative w-10 h-10 cursor-pointer flex active:scale-95 ${
                            item.type === sortType && "mix-blend-luminosity"
                          }`}
                          onClick={() => item.function()}
                        >
                          <Image
                            layout="fill"
                            src={`${INFURA_GATEWAY}/ipfs/${item.image}`}
                            draggable={false}
                          />
                        </div>
                        <div className="relative text-white font-bit text-white font-bit text-xs">
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
          handleMedia={handleMedia}
          currencies={currencies}
          filterConstants={filterConstants}
          lensConnected={lensConnected}
          setCurrencyOpen={setCurrencyOpen}
          currencyOpen={currencyOpen}
          mirror={mirror}
          handleSendMessage={handleSendMessage}
          message={message}
          setMessage={setMessage}
          messageLoading={messageLoading}
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
          gallery={gallery}
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
          bookmarksLoading={bookmarksLoading}
          router={router}
          unfollowProfile={unfollowProfile}
          followLoading={followLoading}
          followProfile={followProfile}
          makePost={makePost}
          setMakePost={setMakePost}
          post={post}
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
          activeGallery={activeGallery}
        />
      </div>
      {lensConnected?.handle?.fullHandle === profile?.handle?.fullHandle ? (
        <div className="relative w-fit h-fit items-center justify-center flex flex-col gap-5">
          {[
            {
              image: "QmRozkh6CWW9u3ATqcMKr4w4LUEd4h1vNN4Gon3zsrtCA4",
              text: "display",
              function: () => dispatch(setScreenDisplay(ScreenDisplay.Display)),
              width: "10",
              height: "10",
              type: ScreenDisplay.Display,
            },
            {
              image: "QmaGQyeUd1Upcei8b9UxiTC7TuDaQPP4Ps5mZpVB1w6Gto",
              text: "gallery",
              function: () => dispatch(setScreenDisplay(ScreenDisplay.Gallery)),
              width: "10",
              height: "8",
              type: ScreenDisplay.Gallery,
            },
            {
              image: "QmT4sotWefLeZzT772BQX4hoDJDTjhm3NUQh12nzuaYe53",
              text: "circuits",
              function: () =>
                dispatch(setScreenDisplay(ScreenDisplay.Circuits)),
              width: "10",
              height: "10",
              type: ScreenDisplay.Circuits,
            },
            {
              image: "QmPh734pzjY3evPPgY9tvXNMyg7EFah6cc4L2R6U9p2gff",
              text: "bookmarks",
              function: () =>
                dispatch(setScreenDisplay(ScreenDisplay.Bookmarks)),
              width: "12",
              height: "12",
              type: ScreenDisplay.Bookmarks,
            },
            {
              image: "QmeBzqFPc3nvegBtwpNjViVNtiEkWsPSWjJaTem9bysdBU",
              text: "post",
              function: () => dispatch(setScreenDisplay(ScreenDisplay.Post)),
              width: "10",
              height: "10",
              type: ScreenDisplay.Post,
            },
            {
              image: "Qmd7w4HyNrtWvSy48jGnidSx77mSqgAALTsVrbcVcSMeoG",
              text: "orders",
              function: () => dispatch(setScreenDisplay(ScreenDisplay.Orders)),
              width: "10",
              height: "10",
              type: ScreenDisplay.Orders,
            },
            {
              image: "QmQ8U7cmvoUizxS7tFeWGcUs7f54svfBdxE6aXfTgPbshw",
              text: "sales",
              function: () => dispatch(setScreenDisplay(ScreenDisplay.Sales)),
              width: "10",
              height: "10",
              type: ScreenDisplay.Sales,
            },
            {
              image: "QmevFbk17FCsk2hxS6UChLyMd2rJX1UsgbBThQZ32AKY4V",
              text: "settings",
              function: () =>
                dispatch(setScreenDisplay(ScreenDisplay.Settings)),
              width: "10",
              height: "10",
              type: ScreenDisplay.Settings,
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
                      className={`relative w-${item.width} h-${
                        item.height
                      } flex items-center justify-center cursor-pointer active:scale-95 ${
                        item.type === screenDisplay && "mix-blend-luminosity"
                      }`}
                      onClick={() => item.function()}
                    >
                      <Image
                        layout="fill"
                        draggable={false}
                        src={`${INFURA_GATEWAY}/ipfs/${item.image}`}
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
        <div className="relative w-fit h-fit items-center justify-center flex flex-col gap-5">
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
                : openAccountModal!,
              width: "10",
              height: "10",
            },
            {
              image: "QmP7ESx5WEVSxyvKvsWBCWYhpWJytVt2Eozr6wqMnyb3M5",
              text: "home",
              function: () => router.push("/"),
              width: "10",
              height: "8",
            },
            {
              image: "QmYbjMNQAVuQSWNNQ5AKbQtt4Dxw2ax4SvLNwKhCNDniL2",
              text: "discover",
              function: () => {
                handleShuffleSearch();
                router.push("/");
              },
              width: "10",
              height: "10",
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
