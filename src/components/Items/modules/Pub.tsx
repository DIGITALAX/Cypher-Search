import { FunctionComponent } from "react";
import { PublicationProps } from "../types/item.types";
import Publication from "@/components/Autograph/modules/Publication";
import PostComment from "@/components/Autograph/modules/PostComment";
import InfiniteScroll from "react-infinite-scroll-component";
import { Comment } from "../../../../graphql/generated";

const Pub: FunctionComponent<PublicationProps> = ({
  router,
  dispatch,
  allComments,
  allCommentsLoading,
  itemData,
  setMainMakeComment,
  mainMakeComment,
  setMainContentLoading,
  mainContentLoading,
  comment,
  mirror,
  like,
  handleMoreComments,
  hasMoreComments,
  mainInteractionsLoading,
  postCollectGif,
  mainProfileHovers,
  setMainProfileHovers,
  openMainMirrorChoice,
  setMainOpenMirrorChoice,
  simpleCollect,
  followMainLoading,
  followProfile,
  unfollowProfile,
  setMainOpenMoreOptions,
  openMainMoreOptions,
  handleBookmark,
  handleHidePost,
  followLoading,
  profileHovers,
  setProfileHovers,
  setMakeComment,
  makeComment,
  setCommentsOpen,
  commentsOpen,
  interactionsLoading,
  openMirrorChoice,
  setOpenMirrorChoice,
  setOpenMoreOptions,
  openMoreOptions,
  contentLoading,
  setContentLoading,
  lensConnected,
  decryptLoading,
  handleDecrypt,
  setMentionProfiles,
  setProfilesOpen,
  profilesOpen,
  mentionProfiles,
  caretCoord,
  caretCoordMain,
  setMentionProfilesMain,
  setProfilesOpenMain,
  mentionProfilesMain,
  profilesOpenMain,
  setCaretCoord,
  setCaretCoordMain,
}): JSX.Element => {
  return (
    <div className="relative w-full min-h-[50rem] flex items-center justify-center flex-row pt-32 px-12 gap-7 h-fit">
      <div className="relative w-full h-full flex items-start justify-center">
        <div className="relative flex flex-col gap-2 items-center justify-center w-[40rem] h-full">
          <Publication
            setCaretCoord={setCaretCoord}
            caretCoord={caretCoordMain}
            profilesOpen={profilesOpenMain}
            mentionProfiles={mentionProfilesMain}
            setMentionProfiles={setMentionProfilesMain}
            setProfilesOpen={setProfilesOpenMain}
            decryptLoading={decryptLoading}
            handleDecrypt={handleDecrypt}
            lensConnected={lensConnected}
            index={0}
            item={itemData}
            key={0}
            dispatch={dispatch}
            router={router}
            mirror={mirror}
            like={like}
            comment={comment}
            main={true}
            setMakePostComment={setMainMakeComment}
            makeComment={mainMakeComment}
            interactionsLoading={mainInteractionsLoading}
            profileHovers={mainProfileHovers}
            setProfileHovers={setMainProfileHovers}
            openMirrorChoice={openMainMirrorChoice}
            setOpenMirrorChoice={setMainOpenMirrorChoice}
            simpleCollect={simpleCollect}
            followLoading={followMainLoading}
            followProfile={followProfile}
            unfollowProfile={unfollowProfile}
            setOpenMoreOptions={setMainOpenMoreOptions}
            openMoreOptions={openMainMoreOptions}
            handleBookmark={handleBookmark}
            handleHidePost={handleHidePost}
            data-post-id={itemData?.id}
            contentLoading={mainContentLoading}
            setContentLoading={setMainContentLoading}
            postCollectGif={postCollectGif}
          />
        </div>
      </div>
      <div className="relative w-full h-full flex items-end justify-start ml-auto flex-col gap-12">
        <div className="relative flex flex-col gap-2 items-center justify-center w-[40rem] h-full">
          <div
            className={`relative p-3 bg-black flex items-start justify-center w-full h-fit`}
          >
            {allCommentsLoading ? (
              <div className="relative w-full h-fit flex items-center justify-start gap-3 flex-col">
                {Array.from({ length: 10 }).map((_, index: number) => {
                  return (
                    <div
                      key={index}
                      className="w-3/4 h-40 border border-white rounded-sm flex"
                      id="staticLoad"
                    ></div>
                  );
                })}
              </div>
            ) : (
              <div className="relative w-5/6 h-[37rem] flex flex-col gap-10 justify-start items-center">
                <PostComment
                  caretCoord={caretCoordMain}
                  profilesOpen={profilesOpenMain?.[0]}
                  mentionProfiles={mentionProfilesMain}
                  setMentionProfiles={setMentionProfilesMain}
                  setProfilesOpen={setProfilesOpenMain}
                  lensConnected={lensConnected}
                  index={0}
                  makePostComment={mainMakeComment?.[0]}
                  setMakePostComment={setMainMakeComment}
                  commentPost={comment}
                  id={itemData?.id}
                  commentPostLoading={mainInteractionsLoading?.[0]?.comment!}
                  height="10rem"
                  imageHeight="1.25rem"
                  imageWidth="1.25rem"
                  postCollectGif={postCollectGif}
                  setContentLoading={setMainContentLoading}
                  contentLoading={mainContentLoading?.[0]}
                  dispatch={dispatch}
                  main={true}
                  setCaretCoord={setCaretCoordMain}
                />
                {allComments?.length > 0 ? (
                  <div className="relative w-full h-fit flex items-start justify-center overflow-y-scroll">
                    <InfiniteScroll
                      next={handleMoreComments}
                      hasMore={hasMoreComments}
                      dataLength={allComments?.length}
                      loader={<></>}
                      className="w-fit h-fit items-center justify-start flex flex-col gap-10"
                    >
                      {allComments?.map(
                        (
                          item: Comment & {
                            decrypted: any;
                          },
                          index: number
                        ) => {
                          return (
                            <Publication
                              caretCoord={caretCoord}
                              setCaretCoord={setCaretCoord}
                              profilesOpen={profilesOpen}
                              mentionProfiles={mentionProfiles}
                              setMentionProfiles={setMentionProfiles}
                              setProfilesOpen={setProfilesOpen}
                              handleDecrypt={handleDecrypt}
                              decryptLoading={decryptLoading}
                              lensConnected={lensConnected}
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
                              openMirrorChoice={openMirrorChoice}
                              setOpenMirrorChoice={setOpenMirrorChoice}
                              simpleCollect={simpleCollect}
                              setOpenMoreOptions={setOpenMoreOptions}
                              openMoreOptions={openMoreOptions}
                              contentLoading={contentLoading}
                              setContentLoading={setContentLoading}
                              profileHovers={profileHovers}
                              setProfileHovers={setProfileHovers}
                              followLoading={followLoading}
                              followProfile={followProfile}
                              unfollowProfile={unfollowProfile}
                              handleBookmark={handleBookmark}
                              handleHidePost={handleHidePost}
                              data-post-id={item?.id}
                              postCollectGif={postCollectGif}
                            />
                          );
                        }
                      )}
                    </InfiniteScroll>
                  </div>
                ) : (
                  <div className="relative w-fit h-fit items-center justify-center flex text-white font-bit break-words">
                    No comments yet. Make one?
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pub;
