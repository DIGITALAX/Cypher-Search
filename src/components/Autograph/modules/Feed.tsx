import { FunctionComponent } from "react";
import { FeedProps } from "../types/autograph.types";
import InfiniteScroll from "react-infinite-scroll-component";
import { Mirror, Post, Quote } from "../../../../graphql/generated";
import Publication from "./Publication";

const Feed: FunctionComponent<FeedProps> = ({
  profileFeed,
  getMoreFeed,
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
}): JSX.Element => {
  return (
    <div className="relative flex items-start justify-start w-full h-auto z-10">
      <div className="relative flex items-center justify-start flex-col gap-4 bg-olor rounded-sm p-4 w-96 h-fit">
        <div className="absolute flex items-center justify-center text-3xl font-bit text-[#00FFBA] top-3 w-fit h-fit blur-sm">
          Recent Updates
        </div>
        <div className="absolute flex items-center justify-center text-3xl font-bit text-white top-3.5 w-fit h-fit blur-sm">
          Recent Updates
        </div>
        <div className="relative flex items-center justify-center text-3xl font-bit text-saph w-fit h-fit">
          Recent Updates
        </div>
        <div
          className="relative flex items-start justify-center left-20"
          id="feedWrapper"
        >
          <div
            className="relative w-fit h-[200rem] flex items-start  justify-center overflow-y-scroll"
            id="feed"
          >
            <InfiniteScroll
              dataLength={profileFeed?.length}
              loader={<></>}
              hasMore={hasMoreFeed}
              next={getMoreFeed}
              className="w-fit h-fit items-start justify-start flex flex-col gap-10"
            >
              {profileFeed?.map(
                (item: Post | Quote | Mirror, index: number) => {
                  return (
                    <Publication
                      data-post-id={item?.id}
                      key={index}
                      index={index}
                      item={item}
                      mirror={mirror}
                      like={like}
                      comment={comment}
                      simpleCollect={simpleCollect}
                      dispatch={dispatch}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
