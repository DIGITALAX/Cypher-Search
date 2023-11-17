import { FunctionComponent } from "react";
import { BookmarksProps } from "../../types/autograph.types";
import InfiniteScroll from "react-infinite-scroll-component";
import { Comment, Mirror, Post, Quote } from "../../../../../graphql/generated";
import Publication from "../Publication";

const Bookmarks: FunctionComponent<BookmarksProps> = ({
  bookmarks,
  handleMoreBookmarks,
  hasMoreBookmarks,
  router,
  mirror,
  comment,
  like,
  interactionsLoading,
  openMirrorChoice,
  setOpenMirrorChoice,
  profileHovers,
  setProfileHovers,
  unfollowProfile,
  followProfile,
  simpleCollect,
  followLoading,
  dispatch,
  openMoreOptions,
  setOpenMoreOptions,
  handleBookmark,
  handleHidePost,
  bookmarksLoading,
  setCommentsOpen,
  setMakeComment,
  makeComment,
  commentsOpen,
  contentLoading,
  setContentLoading,
  postCollectGif,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative flex w-4/5 h-fit items-start justify-center rounded-sm">
        <div
          className="relative w-full h-full flex flex-col items-center justify-start gap-5 p-px"
          id="pfp"
        >
          <div className="relative w-full h-full bg-blurs flex bg-cover rounded-sm p-3 items-start justify-center overflow-y-scroll min-h-[70vh] max-h-[70vh]">
            <InfiniteScroll
              next={handleMoreBookmarks}
              hasMore={hasMoreBookmarks}
              dataLength={bookmarksLoading ? 20 : bookmarks?.length}
              loader={<></>}
              className="w-fit h-fit items-center justify-start flex flex-col gap-10"
            >
              {bookmarksLoading
                ? Array.from({ length: 20 })?.map((_, index: number) => {
                    return (
                      <div
                        key={index}
                        className="relative bg-lirio rounded-sm h-96 w-110 p-2 flex flex-col gap-2 border-2 items-center justify-between border-cereza animate-pulse"
                        id="staticLoad"
                      ></div>
                    );
                  })
                : bookmarks?.map(
                    (item: Post | Mirror | Quote | Comment, index: number) => {
                      return (
                        <Publication
                          index={index}
                          item={item}
                          key={index}
                          dispatch={dispatch}
                          router={router}
                          mirror={mirror}
                          like={like}
                          comment={comment}
                          setMakePostComment={setMakeComment}
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
                          data-post-id={item?.id}
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

export default Bookmarks;
