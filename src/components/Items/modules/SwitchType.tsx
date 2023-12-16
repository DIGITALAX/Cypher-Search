import { FunctionComponent } from "react";
import Chromadin from "./Chromadin";
import { SwitchTypeProps } from "../types/item.types";
import { Creation } from "@/components/Tiles/types/tiles.types";
import Pub from "./Pub";
import Community from "./Community";
import Microbrand from "./Microbrand";
import {
  Mirror,
  Post,
  Comment,
  Quote,
  Profile,
} from "../../../../graphql/generated";

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
  relatedData,
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
  mainProfileHovers,
  setMainProfileHovers,
  followMainLoading,
  setMainOpenMoreOptions,
  openMainMoreOptions,
  setOpenInteractions,
  openInteractions,
  handleDecrypt,
  decryptLoading,
  setMentionProfiles,
  setMentionProfilesMain,
  profilesOpen,
  profilesOpenMain,
  caretCoord,
  caretCoordMain,
  setProfilesOpen,
  setProfilesOpenMain,
  mentionProfiles,
  mentionProfilesMain,
  setCaretCoord,
  setCaretCoordMain,
  hoverPrompt,
  setHoverPrompt,
  allSearchItems,
  galleryFollowLoading,
}) => {
  switch (type.toLowerCase()) {
    case "chromadin":
    case "coinop":
    case "listener":
    case "f3m":
      return (
        <Chromadin
          allSearchItems={allSearchItems}
          hoverPrompt={hoverPrompt}
          setHoverPrompt={setHoverPrompt}
          setCaretCoord={setCaretCoord}
          setCaretCoordMain={setCaretCoordMain}
          handleDecrypt={handleDecrypt}
          decryptLoading={decryptLoading}
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
      );

    case "pub":
      return (
        <Pub
          setCaretCoord={setCaretCoord}
          setCaretCoordMain={setCaretCoordMain}
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
          lensConnected={lensConnected}
          profileHovers={profileHovers}
          setProfileHovers={setProfileHovers}
          followLoading={followLoading}
          followProfile={followProfile}
          unfollowProfile={unfollowProfile}
          allComments={allComments}
          allCommentsLoading={allCommentsLoading}
          router={router}
          handleDecrypt={handleDecrypt}
          decryptLoading={decryptLoading}
          dispatch={dispatch}
          itemData={
            itemData?.post as (Post | Mirror | Quote | Comment) & {
              decrypted: any;
            }
          }
          setMainMakeComment={setMainMakeComment}
          mainMakeComment={mainMakeComment}
          postCollectGif={postCollectGif}
          mirror={mirror}
          like={like}
          comment={comment}
          handleMoreComments={handleMoreComments}
          hasMoreComments={hasMoreComments}
          mainInteractionsLoading={mainInteractionsLoading}
          mainProfileHovers={mainProfileHovers}
          setMainProfileHovers={setMainProfileHovers}
          openMainMirrorChoice={openMainMirrorChoice}
          setMainOpenMirrorChoice={setMainOpenMirrorChoice}
          simpleCollect={simpleCollect}
          followMainLoading={followMainLoading}
          setMainOpenMoreOptions={setMainOpenMoreOptions}
          openMainMoreOptions={openMainMoreOptions}
          handleBookmark={handleBookmark}
          handleHidePost={handleHidePost}
          setMainContentLoading={setMainContentLoading}
          mainContentLoading={mainContentLoading}
          openMirrorChoice={openMirrorChoice}
          setOpenMirrorChoice={setOpenMirrorChoice}
          setOpenMoreOptions={setOpenMoreOptions}
          openMoreOptions={openMoreOptions}
          contentLoading={contentLoading}
          setContentLoading={setContentLoading}
          setMakeComment={setMakeComment}
          makeComment={makeComment}
          setCommentsOpen={setCommentsOpen}
          commentsOpen={commentsOpen}
          interactionsLoading={interactionsLoading}
        />
      );

    case "community":
      return <Community />;

    case "microbrand":
      return (
        <Microbrand
          lensConnected={lensConnected}
          relatedData={relatedData}
          itemData={itemData?.post as Profile}
          router={router}
          dispatch={dispatch}
          cartItems={cartItems}
          mirror={mirror}
          like={like}
          followLoading={galleryFollowLoading}
          followProfile={followProfile}
          unfollowProfile={unfollowProfile}
          openMirrorChoice={openMirrorChoice}
          setOpenInteractions={setOpenInteractions}
          openInteractions={openInteractions}
          setOpenMirrorChoice={setOpenMirrorChoice}
          setProfileHovers={setProfileHovers}
          profileHovers={profileHovers}
          interactionsLoading={interactionsLoading}
        />
      );
  }
};

export default SwitchType;
