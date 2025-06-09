import { ModalContext } from "@/app/providers";
import { FunctionComponent, JSX, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Publication from "../../Tiles/modules/Publication";
import PostComment from "../../Tiles/modules/PostComment";
import useComment from "../../Tiles/hooks/useComment";
import useCommentItem from "../hooks/useCommentItem";
import { PubProps } from "../types/items.type";
import { TextOnlyMetadata } from "@lens-protocol/client";

const Pub: FunctionComponent<PubProps> = ({ dict, itemData }): JSX.Element => {
  const context = useContext(ModalContext);
  const {
    searchProfiles,
    setProfilesOpen,
    profilesFound,
    profilesOpen,
    commentLoading,
    setCommentDetails,
    commentDetails,
    textElement,
    caretCoord,
    comment,
    commentOpen,
  } = useComment();
  const { allComments, getMoreComments, commentInfo, allCommentsLoading } =
    useCommentItem(
      itemData?.post?.__typename == "Repost"
        ? itemData?.post?.repostOf
        : itemData?.post,
      commentOpen
    );
  return (
    <div
      className={`relative w-full min-h-[50rem] flex items-center justify-center flex-col xl:flex-row  pre:pt-60 tablet:pt-40 lg:pt-32 px-2 sm:px-12 gap-7 h-fit ${
        context?.header ? "pt-96" : "pt-0"
      }`}
    >
      <div className="relative w-full h-full flex items-start justify-center">
        <div className="relative flex flex-col gap-2 items-center justify-center w-[40rem] xl:w-[30rem] 2xl:w-[40rem] h-full">
          <Publication
            dict={dict}
            index={0}
            item={itemData?.post}
            key={0}
            main={true}
            top={"auto"}
            bottom={"2px"}
            left={"auto"}
            right={"2px"}
          />
        </div>
      </div>
      <div className="relative w-full h-full flex items-center 2xl:items-end justify-start 2xl:ml-auto flex-col gap-12">
        <div className="relative flex flex-col gap-2 items-center justify-center w-full md:w-[40rem] h-full">
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
              <div className="relative w-full md:w-5/6 h-[37rem] flex flex-col gap-10 justify-start items-center">
                <PostComment
                  dict={dict}
                  commentDetails={commentDetails}
                  searchProfiles={searchProfiles}
                  setCommentDetails={setCommentDetails}
                  mentionProfiles={profilesFound}
                  setProfilesOpen={setProfilesOpen}
                  id={itemData?.post?.id!}
                  comment={comment}
                  profilesOpen={profilesOpen}
                  commentLoading={commentLoading}
                  caretCoord={caretCoord}
                  textElement={textElement}
                  height="10rem"
                  imageHeight="1.25rem"
                  imageWidth="1.25rem"
                />
                {allComments?.length > 0 ? (
                  <div className="relative w-full h-fit flex items-start justify-center overflow-y-scroll">
                    <InfiniteScroll
                      next={getMoreComments}
                      hasMore={commentInfo?.hasMore}
                      dataLength={allComments?.length}
                      loader={<></>}
                      className="w-full sm:w-fit h-fit items-center justify-start flex flex-col gap-10"
                      height={"20rem"}
                    >
                      {allComments?.map((item, index: number) => {
                        return (
                          <Publication
                            dict={dict}
                            index={index}
                            item={item}
                            key={index}
                            data-post-id={item?.id}
                            top={
                              (item?.metadata as TextOnlyMetadata)?.content
                                ?.length < 100 &&
                              item?.metadata?.__typename !== "AudioMetadata" &&
                              item?.metadata?.__typename !== "ImageMetadata" &&
                              item?.metadata?.__typename !== "VideoMetadata"
                                ? "20px"
                                : "auto"
                            }
                            bottom={
                              (item?.metadata as TextOnlyMetadata)?.content
                                ?.length < 100 &&
                              item?.metadata?.__typename !== "AudioMetadata" &&
                              item?.metadata?.__typename !== "ImageMetadata" &&
                              item?.metadata?.__typename !== "VideoMetadata"
                                ? "auto"
                                : "2px"
                            }
                            left={"auto"}
                            right={"2px"}
                          />
                        );
                      })}
                    </InfiniteScroll>
                  </div>
                ) : (
                  <div className="relative w-fit h-fit items-center justify-center flex text-white font-bit break-words">
                    {dict?.coms}
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
