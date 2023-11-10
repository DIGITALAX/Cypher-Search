import { FunctionComponent } from "react";
import PostSwitch from "./PostSwitch";
import PostBar from "./PostBar";
import PostQuote from "./PostQuote";
import moment from "moment";
import { PublicationProps } from "../types/autograph.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import {
  Comment,
  Mirror,
  Quote,
  TextOnlyMetadataV3,
} from "../../../../graphql/generated";
import PostComment from "./PostComment";

const Publication: FunctionComponent<PublicationProps> = ({
  item,
  index,
  router,
  dispatch,
  mirror,
  comment,
  like,
  interactionsLoading,
  profileHovers,
  setProfileHovers,
  openMirrorChoice,
  setOpenMirrorChoice,
  openMoreOptions,
  setOpenMoreOptions,
  handleBookmark,
  unfollowProfile,
  simpleCollect,
  followLoading,
  followProfile,
  handleHidePost,
  disabled,
  commentsOpen,
  setCommentsOpen,
  makeComment,
  setMakePostComment,
  setContentLoading,
  contentLoading,
  postCollectGif
}): JSX.Element => {
  return (
    <div className="relative bg-lirio rounded-sm h-fit w-110 p-2 flex flex-col gap-2 border-2 items-center justify-between border-cereza">
      <div className="relative w-full h-fit flex items-center justify-between flex-row">
        <div className="relative w-fit h-fit flex items-center justify-start font-bit text-white text-xxs">
          <div className={`relative w-fit h-fit flex`}>
            {item?.createdAt && moment(`${item?.createdAt}`).fromNow()}
          </div>
        </div>
        {(item?.__typename === "Comment" ||
          item?.__typename === "Quote" ||
          item?.__typename === "Mirror") && (
          <div
            className={`relative w-fit h-fit row-start-1 items-center justify-end flex flex-row gap-2 font-bit text-xxs`}
          >
            <div
              className={`relative w-fit h-fit col-start-1 place-self-center break-words font-dosis text-offWhite`}
            >
              {item?.__typename === "Comment"
                ? `Comment on ${
                    (
                      (item as Comment)?.commentOn
                        ?.metadata as TextOnlyMetadataV3
                    )?.content?.slice(0, 10) + "..."
                  }`
                : item?.__typename === "Mirror"
                ? `Mirror of ${
                    (
                      (item as Mirror)?.mirrorOn?.metadata as TextOnlyMetadataV3
                    )?.content?.slice(0, 10) + "..."
                  }`
                : `Quote on ${
                    (
                      (item as Quote)?.quoteOn?.metadata as TextOnlyMetadataV3
                    )?.content?.slice(0, 10) + "..."
                  }`}
            </div>
            <div className="relative w-5 h-5 col-start-2 place-self-center">
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/${
                  item?.__typename === "Comment"
                    ? "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n"
                    : item?.__typename === "Mirror"
                    ? "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3"
                    : "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM"
                }`}
                draggable={false}
              />
            </div>
          </div>
        )}
      </div>
      <PostSwitch item={item} />
      {item?.__typename === "Quote" && <PostQuote quote={item?.quoteOn} />}
      <PostBar
        index={index}
        item={item}
        dispatch={dispatch}
        router={router}
        mirror={mirror}
        like={like}
        interactionsLoading={interactionsLoading?.[index]}
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
        disabled={disabled}
        setCommentsOpen={setCommentsOpen!}
        commentsOpen={commentsOpen!}
      />
      {commentsOpen?.[index] && (
        <PostComment
          makePostComment={makeComment?.[index]!}
          setMakePostComment={setMakePostComment!}
          commentPost={comment!}
          id={item?.id}
          commentPostLoading={interactionsLoading?.[index].comment!}
          height="5rem"
          imageHeight="1.25rem"
          imageWidth="1.25rem"
          postCollectGif={postCollectGif}
          setContentLoading={setContentLoading!}
          contentLoading={contentLoading?.[index]!}
          index={index}
          dispatch={dispatch}
        />
      )}
    </div>
  );
};

export default Publication;
