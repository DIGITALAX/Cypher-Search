import { FunctionComponent } from "react";
import PostSwitch from "./PostSwitch";
import PostBar from "./PostBar";
import PostQuote from "./PostQuote";
import moment from "moment";
import { PublicationProps } from "../types/autograph.types";
import Image from "next/legacy/image";
import {
  CHROMADIN_OPEN_ACTION,
  COIN_OP_OPEN_ACTION,
  INFURA_GATEWAY,
  LISTENER_OPEN_ACTION,
} from "../../../../lib/constants";
import {
  Comment,
  ImageMetadataV3,
  Mirror,
  Post,
  Quote,
  TextOnlyMetadataV3,
} from "../../../../graphql/generated";
import PostComment from "./PostComment";
import Decrypt from "./Decrypt";

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
  postCollectGif,
  main,
  lensConnected,
  decryptLoading,
  handleDecrypt,
  setMentionProfiles,
  setProfilesOpen,
  mentionProfiles,
  profilesOpen,
  caretCoord,
  setCaretCoord,
  cartItems,
  top,
  bottom,
  left,
  right,
}): JSX.Element => {
  return (
    <div
      className={`relative rounded-sm h-fit w-full sm:w-110 px-1 py-3 sm:py-2 sm:px-2 flex flex-col gap-4 sm:gap-2 border-2 items-center justify-between border-cereza ${
        (item?.__typename === "Mirror" ? item?.mirrorOn : (item as Post))
          ?.isEncrypted
          ? "bg-nuba"
          : [
              CHROMADIN_OPEN_ACTION,
              LISTENER_OPEN_ACTION,
              COIN_OP_OPEN_ACTION,
            ]?.some((value) =>
              (item?.__typename === "Mirror"
                ? item?.mirrorOn
                : (item as Post)
              )?.openActionModules?.[0]?.contract?.address
                ?.toLowerCase()
                ?.includes(value?.toLowerCase())
            )
          ? "bg-[#3887c3]"
          : "bg-lirio"
      }`}
      id={item?.id}
    >
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
              className={`relative w-fit h-fit col-start-1 place-self-center break-words font-dosis text-offWhite ${
                item?.__typename === "Mirror" && "cursor-pointer"
              }`}
              onClick={() =>
                item?.__typename === "Mirror" &&
                (item?.mirrorOn?.openActionModules?.[0]?.contract?.address
                  ?.toLowerCase()
                  ?.includes(CHROMADIN_OPEN_ACTION?.toLowerCase())
                  ? router.push(
                      `/item/chromadin/${(
                        item?.mirrorOn?.metadata as ImageMetadataV3
                      )?.title?.replaceAll(" ", "_")}`
                    )
                  : item?.mirrorOn?.openActionModules?.[0]?.contract?.address
                      ?.toLowerCase()
                      ?.includes(COIN_OP_OPEN_ACTION?.toLowerCase())
                  ? router.push(
                      `/item/coinop/${(
                        item?.mirrorOn?.metadata as ImageMetadataV3
                      )?.title?.replaceAll(" ", "_")}`
                    )
                  : item?.mirrorOn?.openActionModules?.[0]?.contract?.address
                      ?.toLowerCase()
                      ?.includes(LISTENER_OPEN_ACTION?.toLowerCase())
                  ? router.push(
                      `/item/listener/${(
                        item?.mirrorOn?.metadata as ImageMetadataV3
                      )?.title?.replaceAll(" ", "_")}`
                    )
                  : router.push(`/item/pub/${item?.mirrorOn?.id}`))
              }
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
            <div className="relative w-3.5 h-3.5 col-start-2 place-self-center">
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
      {!disabled &&
        (item?.__typename === "Mirror" ? item?.mirrorOn : (item as Post))
          ?.isEncrypted &&
        !(
          (item?.__typename === "Mirror"
            ? item?.mirrorOn
            : (item as Post)) as any
        )?.decrypted && (
          <Decrypt
            toDecrypt={
              item?.__typename === "Mirror" ? item?.mirrorOn : (item as Post)
            }
            decryptLoading={decryptLoading!}
            handleDecrypt={handleDecrypt!}
            canDecrypt={
              (item?.__typename === "Mirror" ? item?.mirrorOn : (item as Post))
                ?.operations?.canDecrypt?.result
            }
          />
        )}
      <PostSwitch disabled={disabled} item={item} dispatch={dispatch} />
      {item?.__typename === "Quote" && (
        <PostQuote
          disabled={true}
          quote={{
            ...item?.quoteOn,
            decrypted: undefined,
          }}
          dispatch={dispatch}
          router={router}
        />
      )}
      <PostBar
        lensConnected={lensConnected}
        index={index}
        cartItems={cartItems!}
        item={item}
        top={top}
        bottom={bottom}
        left={left}
        right={right}
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
        main={main}
      />
      {commentsOpen?.[index] && (
        <PostComment
          caretCoord={caretCoord!}
          router={router}
          profilesOpen={profilesOpen?.[index]!}
          mentionProfiles={mentionProfiles!}
          setMentionProfiles={setMentionProfiles!}
          setCaretCoord={setCaretCoord!}
          setProfilesOpen={setProfilesOpen!}
          lensConnected={lensConnected}
          makePostComment={makeComment?.[index]!}
          setMakePostComment={setMakePostComment!}
          commentPost={comment!}
          id={item?.id}
          itemId={
            item?.__typename === "Mirror" ? item?.mirrorOn?.id : undefined
          }
          commentPostLoading={interactionsLoading?.[index]?.comment!}
          height="5rem"
          imageHeight="1.25rem"
          imageWidth="1.25rem"
          postCollectGif={postCollectGif!}
          setContentLoading={setContentLoading!}
          contentLoading={contentLoading?.[index]!}
          index={index}
          dispatch={dispatch}
          main={main}
        />
      )}
    </div>
  );
};

export default Publication;
