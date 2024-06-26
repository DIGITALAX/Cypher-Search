import { FunctionComponent } from "react";
import { FeedProps } from "../types/autograph.types";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  ImageMetadataV3,
  Mirror,
  Post,
  Quote,
} from "../../../../graphql/generated";
import Publication from "./Publication";

const Feed: FunctionComponent<FeedProps> = ({
  profileFeed,
  getMoreFeed,
  locale,
  interactionsLoading,
  mirror,
  openMirrorChoice,
  setOpenMirrorChoice,
  like,
  simpleCollect,
  comment,
  router,
  unfollowProfile,
  followProfile,
  followLoading,
  profileHovers,
  setProfileHovers,
  dispatch,
  openMoreOptions,
  setOpenMoreOptions,
  handleBookmark,
  handleHidePost,
  hasMoreFeed,
  setMakeComment,
  setCommentsOpen,
  makeComment,
  commentsOpen,
  contentLoading,
  setContentLoading,
  postCollectGif,
  lensConnected,
  handleDecrypt,
  decryptLoading,
  mentionProfiles,
  setMentionProfiles,
  setProfilesOpen,
  caretCoord,
  profilesOpen,
  setCaretCoord,
  cartItems,
  t,
}): JSX.Element => {
  return (
    <div className="relative flex items-start justify-start w-full h-auto z-10 otro:order-1 order-2">
      <div className="relative flex items-center justify-start flex-col gap-4 bg-olor rounded-sm px-px sm:px-4 py-4 w-full sm:w-96 h-fit">
        <div className="absolute flex items-center justify-center text-xl sm:text-3xl font-bit text-[#00FFBA] top-3 w-fit h-fit blur-sm break-words">
          {t("upd")}
        </div>
        <div className="absolute flex items-center justify-center text-xl sm:text-3xl font-bit text-white top-3.5 w-fit h-fit blur-sm break-words">
          {t("upd")}
        </div>
        <div className="relative flex items-center justify-center text-xl sm:text-3xl font-bit text-saph w-fit h-fit break-words">
          {t("upd")}
        </div>
        <div
          className={`relative flex items-start justify-center w-fit h-full ${
            profileFeed?.length < 1 ? "left-auto" : "left-auto sm:left-20"
          }`}
          id={profileFeed?.length < 1 ? "" : "feedWrapper"}
        >
          <div
            className={`relative h-[80rem] otro:h-[200rem] flex items-start  justify-center overflow-y-scroll max-w-full ${
              profileFeed?.length < 1 ? "w-full" : "w-fit"
            }`}
            id={profileFeed?.length < 1 ? "" : "feed"}
          >
            {profileFeed?.length < 1 ? (
              <div className="relative w-fit h-fit flex items-start justify-center text-center font-bit text-lirio text-xs">
                {t("nada")}
              </div>
            ) : (
              <InfiniteScroll
                dataLength={profileFeed?.length}
                loader={<></>}
                hasMore={hasMoreFeed}
                next={getMoreFeed}
                className="w-fit h-fit items-start justify-start flex flex-col gap-10"
              >
                {profileFeed?.map(
                  (
                    item: (Post | Quote | Mirror) & {
                      decrypted: any;
                    },
                    index: number
                  ) => {
                    const type =
                      item?.__typename === "Mirror"
                        ? item.mirrorOn
                        : (item as Post);
                    return (
                      <Publication
                        t={t}
                        locale={locale}
                        top={
                          type?.metadata?.content?.length < 100 &&
                          type?.metadata?.__typename !== "AudioMetadataV3" &&
                          type?.metadata?.__typename !== "ImageMetadataV3" &&
                          type?.metadata?.__typename !== "VideoMetadataV3"
                            ? "20px"
                            : "auto"
                        }
                        bottom={
                          type?.metadata?.content?.length < 100 &&
                          type?.metadata?.__typename !== "AudioMetadataV3" &&
                          type?.metadata?.__typename !== "ImageMetadataV3" &&
                          type?.metadata?.__typename !== "VideoMetadataV3"
                            ? "auto"
                            : "2px"
                        }
                        left={"auto"}
                        right={"2px"}
                        setCaretCoord={setCaretCoord}
                        mentionProfiles={mentionProfiles}
                        profilesOpen={profilesOpen}
                        setMentionProfiles={setMentionProfiles}
                        setProfilesOpen={setProfilesOpen}
                        caretCoord={caretCoord}
                        decryptLoading={decryptLoading?.[index]}
                        handleDecrypt={handleDecrypt}
                        data-post-id={item?.id}
                        key={index}
                        lensConnected={lensConnected}
                        index={index}
                        item={item}
                        mirror={mirror}
                        like={like}
                        comment={comment}
                        simpleCollect={simpleCollect}
                        dispatch={dispatch}
                        cartItems={cartItems}
                        openMirrorChoice={openMirrorChoice}
                        setOpenMirrorChoice={setOpenMirrorChoice}
                        interactionsLoading={interactionsLoading}
                        router={router}
                        followProfile={followProfile}
                        unfollowProfile={unfollowProfile}
                        followLoading={followLoading}
                        profileHovers={profileHovers}
                        setProfileHovers={setProfileHovers}
                        setOpenMoreOptions={setOpenMoreOptions}
                        openMoreOptions={openMoreOptions}
                        handleHidePost={handleHidePost}
                        handleBookmark={handleBookmark}
                        setMakePostComment={setMakeComment}
                        makeComment={makeComment}
                        setCommentsOpen={setCommentsOpen}
                        commentsOpen={commentsOpen}
                        contentLoading={contentLoading}
                        setContentLoading={setContentLoading}
                        postCollectGif={postCollectGif}
                      />
                    );
                  }
                )}
              </InfiniteScroll>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
