import { FunctionComponent } from "react";
import { BookmarksProps } from "../../types/autograph.types";
import InfiniteScroll from "react-infinite-scroll-component";
import { Comment, Mirror, Post, Quote } from "../../../../../graphql/generated";
import PostBar from "../PostBar";
import PostSwitch from "../PostSwitch";

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
}): JSX.Element => {
  return (
    <div className="relative w-full h-full pt-4 flex items-center justify-center">
      <div className="relative flex w-4/5 h-fit items-start justify-center rounded-sm">
        <div
          className="relative w-full h-full flex flex-col items-center justify-start gap-5 p-px"
          id="pfp"
        >
          <div className="relative w-full h-full bg-blurs flex bg-cover rounded-sm p-3 items-start justify-center overflow-y-scroll max-h-[75vh]">
            <InfiniteScroll
              next={handleMoreBookmarks}
              hasMore={hasMoreBookmarks}
              dataLength={20}
              loader={<></>}
              className="w-fit h-fit items-center justify-start flex flex-col gap-10"
            >
              {Array.from({ length: 10 }).map(
                (item: Post | Mirror | Quote | Comment, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative bg-lirio rounded-sm h-fit w-110 p-2 flex flex-col gap-2 border-2 items-center justify-between border-cereza"
                    >
                      <PostSwitch item={item} />
                      <PostBar
                        index={index}
                        item={item}
                        dispatch={dispatch}
                        router={router}
                        mirror={mirror}
                        like={like}
                        comment={comment}
                        interactionsLoading={interactionsLoading[index]}
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
                      />
                    </div>
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
