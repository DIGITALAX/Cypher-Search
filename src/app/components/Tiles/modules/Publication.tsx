import moment from "moment";
import { FunctionComponent, JSX, useContext, useState } from "react";
import { PublicationProps } from "../types/tiles.types";
import {
  CHROMADIN_OPEN_ACTION,
  COIN_OP_OPEN_ACTION,
  F3M_OPEN_ACTION,
  INFURA_GATEWAY,
  KINORA_OPEN_ACTION,
  KINORA_OPEN_ACTION_PRINT,
  LISTENER_OPEN_ACTION,
} from "@/app/lib/constants";
import { useRouter } from "next/navigation";
import { Post, TextOnlyMetadata } from "@lens-protocol/client";
import Image from "next/legacy/image";
import PostSwitch from "./PostSwitch";
import PostQuote from "./PostQuote";
import useComment from "../hooks/useComment";
import PostBar from "./PostBar";
import PostComment from "./PostComment";
import checkActions from "@/app/lib/helpers/checkActions";
import { ModalContext } from "@/app/providers";

const Publication: FunctionComponent<PublicationProps> = ({
  item,
  index,
  dict,
  top,
  bottom,
  left,
  right,
  main,
  disabled,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  const {
    comment,
    searchProfiles,
    setCommentOpen,
    commentOpen,
    setProfilesOpen,
    profilesFound,
    profilesOpen,
    commentLoading,
    commentInteraction,
    setCommentDetails,
    commentDetails,
    textElement,
    caretCoord,
  } = useComment(item?.__typename === "Repost" ? item?.repostOf : item);
  return (
    <div
      className={`relative rounded-sm h-fit px-1 py-3 sm:py-2 sm:px-2 flex flex-col gap-4 sm:gap-2 border-2 items-center justify-between border-cereza  ${
        [
          CHROMADIN_OPEN_ACTION,
          LISTENER_OPEN_ACTION,
          COIN_OP_OPEN_ACTION,
          F3M_OPEN_ACTION,
          KINORA_OPEN_ACTION_PRINT
        ]?.some((value) =>
          (item?.__typename === "Repost"
            ? item?.repostOf
            : item
          )?.actions?.[0]?.address
            ?.toLowerCase()
            ?.includes(value?.toLowerCase())
        )
          ? "bg-[#3887c3]"
          : (item?.__typename === "Repost"
              ? item?.repostOf
              : item
            )?.actions?.[0]?.address
              ?.toLowerCase()
              ?.includes(KINORA_OPEN_ACTION?.toLowerCase())
          ? "bg-nave"
          : "bg-lirio"
      }`}
      id={item?.id}
      style={{
        width:
          typeof window !== "undefined" && window.innerWidth < 640
            ? "calc(100vw - 3px)"
            : "30rem",
      }}
    >
      <div className="relative w-full h-fit flex items-center justify-between flex-row">
        <div
          className={`relative w-fit h-fit flex items-center justify-start font-bit text-xxs text-white`}
        >
          <div className={`relative w-fit h-fit flex`}>
            {item?.timestamp && moment(`${item?.timestamp}`).fromNow()}
          </div>
        </div>
        {((item as Post)?.commentOn?.id ||
          (item as Post)?.quoteOf?.id ||
          item?.__typename === "Repost") && (
          <div
            className={`relative w-fit h-fit row-start-1 items-center justify-end flex flex-row gap-2 font-bit text-xxs`}
          >
            <div
              className={`relative w-fit h-fit col-start-1 place-self-center break-words font-dosis text-offWhite ${
                item?.__typename === "Repost" && "cursor-pointer"
              }`}
              onClick={() => {
                if (item?.__typename === "Repost") {
                  context?.setFiltersOpen({ value: false, allow: false });
                  checkActions(item?.repostOf, router);
                }
              }}
            >
              {(item as Post)?.commentOn?.id
                ? `${dict?.comOn} ${
                    (
                      (item as Post)?.commentOn?.metadata as TextOnlyMetadata
                    )?.content?.slice(0, 10) + "..."
                  }`
                : item?.__typename === "Repost"
                ? `${dict?.mirOn} ${
                    (
                      item?.repostOf?.metadata as TextOnlyMetadata
                    )?.content?.slice(0, 10) + "..."
                  }`
                : `${dict?.quoOn} ${
                    (
                      (item as Post)?.quoteOf?.metadata as TextOnlyMetadata
                    )?.content?.slice(0, 10) + "..."
                  }`}
            </div>
            <div className="relative w-3.5 h-3.5 col-start-2 place-self-center">
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/${
                  (item as Post)?.commentOn?.id
                    ? "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n"
                    : item?.__typename === "Repost"
                    ? "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3"
                    : "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM"
                }`}
                draggable={false}
              />
            </div>
          </div>
        )}
      </div>
      <PostSwitch disabled={disabled} item={item} />
      {(item as Post)?.quoteOf?.id && (
        <PostQuote disabled={true} quote={(item as Post)?.quoteOf as Post} />
      )}
      <PostBar
        dict={dict}
        index={index}
        item={item}
        top={top}
        bottom={bottom}
        left={left}
        right={right}
        disabled={disabled}
        main={main}
        commentInteraction={commentInteraction}
        setCommentOpen={setCommentOpen}
      />
      {commentOpen && (
        <PostComment
          dict={dict}
          commentDetails={commentDetails}
          profilesOpen={profilesOpen}
          comment={comment}
          commentLoading={commentLoading}
          caretCoord={caretCoord}
          searchProfiles={searchProfiles}
          setCommentDetails={setCommentDetails}
          setProfilesOpen={setProfilesOpen}
          mentionProfiles={profilesFound!}
          id={item?.id}
          textElement={textElement}
          height="5rem"
          imageHeight="1.25rem"
          imageWidth="1.25rem"
        />
      )}
    </div>
  );
};

export default Publication;
