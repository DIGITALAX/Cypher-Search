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
  lensConnected,
  handleDecrypt,
  decryptLoading,
  mentionProfiles,
  setMentionProfiles,
  setProfilesOpen,
  caretCoord,
  profilesOpen,
  setCaretCoord,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative flex w-full tablet:w-4/5 h-fit items-start justify-center rounded-sm">
        <div
          className="relative w-full h-full flex flex-col items-center justify-start gap-5 p-px"
          id="pfp"
        >
          <div
            className={`relative w-full bg-blurs flex bg-cover rounded-sm p-3 justify-center overflow-y-scroll h-[55rem] sm:h-[40rem] min-h-[35rem] tablet:h-[35rem] ${
              !bookmarksLoading && bookmarks?.length == 0
                ? "items-center"
                : "items-start"
            }`}
          >
            {bookmarksLoading ? (
              <div className="relative flex flex-col gap-2 items-start justify-center animate-pulse">
                {Array.from({ length: 20 })?.map((_, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative bg-lirio rounded-sm h-96 w-110 p-2 flex flex-col gap-2 border-2 items-center justify-between border-cereza"
                      id="staticLoad"
                    ></div>
                  );
                })}
              </div>
            ) : bookmarks?.length > 0 ? (
              <InfiniteScroll
                next={handleMoreBookmarks}
                hasMore={hasMoreBookmarks}
                dataLength={bookmarksLoading ? 20 : bookmarks?.length}
                loader={<></>}
                className="w-full sm:w-fit h-fit items-center justify-start flex flex-col gap-10"
              >
                {bookmarks?.map(
                  (
                    item: (Post | Mirror | Quote | Comment) & {
                      decrypted: any;
                    },
                    index: number
                  ) => {
                    return (
                      <Publication
                        setCaretCoord={setCaretCoord}
                        mentionProfiles={mentionProfiles}
                        profilesOpen={profilesOpen}
                        setMentionProfiles={setMentionProfiles}
                        setProfilesOpen={setProfilesOpen}
                        caretCoord={caretCoord}
                        decryptLoading={decryptLoading?.[index]}
                        handleDecrypt={handleDecrypt}
                        index={index}
                        item={item}
                        lensConnected={lensConnected}
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
            ) : (
              <div className="relative w-1/2 h-fit flex items-center justify-center font-ignite text-xl text-white text-center break-words">
                {`Your bookmarked posts will appear here :)`}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
