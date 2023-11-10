import { FunctionComponent } from "react";
import { ScreenDisplay, ScreenSwitchProps } from "../types/autograph.types";
import Display from "./Screen/Display";
import Settings from "./Screen/Settings";
import Circuits from "./Screen/Circuits";
import Gallery from "./Screen/Gallery";
import Bookmarks from "./Screen/Bookmarks";
import Orders from "./Screen/Orders";
import ScreenPost from "./Screen/ScreenPost";

const ScreenSwitch: FunctionComponent<ScreenSwitchProps> = ({
  screenDisplay,
  mirror,
  like,
  openMirrorChoice,
  setOpenMirrorChoice,
  interactionsLoading,
  sortType,
  gallery,
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
}): JSX.Element => {
  switch (screenDisplay) {
    case ScreenDisplay.Circuits:
      return <Circuits gallery={gallery} />;

    case ScreenDisplay.Gallery:
      return <Gallery gallery={gallery} />;

    case ScreenDisplay.Post:
      return (
        <ScreenPost
          makePost={makePost}
          post={post}
          setMakePost={setMakePost}
          postLoading={postLoading}
          contentLoading={postContentLoading}
          dispatch={dispatch}
          postCollectGif={postCollectGif}
          setContentLoading={setPostContentLoading}
        />
      );

    case ScreenDisplay.Bookmarks:
      return (
        <Bookmarks
          bookmarks={bookmarks}
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

    case ScreenDisplay.Orders:
      return <Orders />;

    default:
      return (
        <Display
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
};

export default ScreenSwitch;
