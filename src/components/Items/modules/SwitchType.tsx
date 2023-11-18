import { FunctionComponent } from "react";
import Chromadin from "./Chromadin";
import { SwitchTypeProps } from "../types/item.types";
import { Creation } from "@/components/Tiles/types/tiles.types";
import Publication from "./Publication";
import Community from "./Community";
import Microbrand from "./Microbrand";

const SwitchType: FunctionComponent<SwitchTypeProps> = ({
  type,
  itemData,
  dispatch,
  router,
  filterConstants,
  cartItems,
  setPurchaseDetails,
  purchaseDetails,
  oracleData,
  relatedCollections,
  handleInstantPurchase,
  instantLoading,
  approveSpend,
  isApprovedSpend,
  lensConnected,
  mirror,
  like,
  interactionsLoading,
  openMirrorChoice,
  setOpenMirrorChoice,
  commentSwitch,
  setCommentSwitch,
  allComments,
  comment,
  handleMoreComments,
  allCommentsLoading,
  hasMoreComments,
  profileHovers,
  setProfileHovers,
  simpleCollect,
  unfollowProfile,
  followProfile,
  postCollectGif,
  setOpenMoreOptions,
  setContentLoading,
  contentLoading,
  handleHidePost,
  openMoreOptions,
  setMakeComment,
  handleBookmark,
  followLoading,
  mainContentLoading,
  mainInteractionsLoading,
  openMainMirrorChoice,
  setMainOpenMirrorChoice,
  mainMakeComment,
  setMainMakeComment,
  setMainContentLoading,
  makeComment,
  setCommentsOpen,
  commentsOpen,
}) => {
  switch (type.toLowerCase()) {
    case "chromadin":
    case "coinop":
    case "listener":
      return (
        <Chromadin
          oracleData={oracleData}
          filterConstants={filterConstants}
          type={type}
          allCommentsLoading={allCommentsLoading}
          hasMoreComments={hasMoreComments}
          handleMoreComments={handleMoreComments}
          itemData={itemData?.post as Creation}
          dispatch={dispatch}
          router={router}
          cartItems={cartItems}
          purchaseDetails={purchaseDetails}
          setPurchaseDetails={setPurchaseDetails}
          handleInstantPurchase={handleInstantPurchase}
          instantLoading={instantLoading}
          approveSpend={approveSpend}
          isApprovedSpend={isApprovedSpend}
          lensConnected={lensConnected}
          mainInteractionsLoading={mainInteractionsLoading}
          openMainMirrorChoice={openMainMirrorChoice}
          setMainOpenMirrorChoice={setMainOpenMirrorChoice}
          mirror={mirror}
          like={like}
          allComments={allComments}
          commentSwitch={commentSwitch}
          setCommentSwitch={setCommentSwitch}
          mainMakeComment={mainMakeComment}
          setMainMakeComment={setMainMakeComment!}
          postCollectGif={postCollectGif!}
          setMainContentLoading={setMainContentLoading!}
          mainContentLoading={mainContentLoading!}
          comment={comment}
          setMakeComment={setMakeComment}
          makeComment={makeComment}
          setCommentsOpen={setCommentsOpen}
          commentsOpen={commentsOpen}
          interactionsLoading={interactionsLoading}
          profileHovers={profileHovers}
          setProfileHovers={setProfileHovers}
          openMirrorChoice={openMirrorChoice}
          setOpenMirrorChoice={setOpenMirrorChoice}
          simpleCollect={simpleCollect}
          followLoading={followLoading}
          followProfile={followProfile}
          unfollowProfile={unfollowProfile}
          setOpenMoreOptions={setOpenMoreOptions}
          openMoreOptions={openMoreOptions}
          handleBookmark={handleBookmark}
          handleHidePost={handleHidePost}
          contentLoading={contentLoading}
          setContentLoading={setContentLoading}
        />
      );

    case "pub":
      return <Publication />;

    case "community":
      return <Community />;

    case "microbrand":
      return <Microbrand />;
  }
};

export default SwitchType;
