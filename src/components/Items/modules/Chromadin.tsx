import { FunctionComponent } from "react";
import { ChromadinProps } from "../types/item.types";
import Image from "next/legacy/image";
import {
  ACCEPTED_TOKENS,
  INFURA_GATEWAY,
  itemStringToType,
  printTypeToString,
} from "../../../../lib/constants";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import { AiOutlineLoading } from "react-icons/ai";
import { setCartItems } from "../../../../redux/reducers/cartItemsSlice";
import { setCartAnim } from "../../../../redux/reducers/cartAnimSlice";
import { setCypherStorageCart } from "../../../../lib/utils";
import InteractBar from "@/components/Common/modules/InteractBar";
import PostComment from "@/components/Autograph/modules/PostComment";
import InfiniteScroll from "react-infinite-scroll-component";
import { Comment } from "../../../../graphql/generated";
import Publication from "@/components/Autograph/modules/Publication";
import MediaSwitch from "@/components/Common/modules/MediaSwitch";
import handleImageError from "../../../../lib/helpers/handleImageError";
import { setImageViewer } from "../../../../redux/reducers/ImageLargeSlice";
import { setAllSearchItems } from "../../../../redux/reducers/searchItemsSlice";
import { PrintType as PrintTagType } from "@/components/Tiles/types/tiles.types";
import PrintType from "@/components/Common/modules/PrintType";

const Chromadin: FunctionComponent<ChromadinProps> = ({
  itemData,
  type,
  filterConstants,
  router,
  cartItems,
  purchaseDetails,
  oracleData,
  setPurchaseDetails,
  instantLoading,
  isApprovedSpend,
  dispatch,
  approveSpend,
  handleInstantPurchase,
  lensConnected,
  mirror,
  like,
  interactionsLoading,
  openMirrorChoice,
  setOpenMirrorChoice,
  commentSwitch,
  setCommentSwitch,
  allComments,
  makeComment,
  setCommentsOpen,
  commentsOpen,
  comment,
  handleMoreComments,
  allCommentsLoading,
  hasMoreComments,
  profileHovers,
  setProfileHovers,
  simpleCollect,
  unfollowProfile,
  followProfile,
  postCollectGif,
  setOpenMoreOptions,
  setContentLoading,
  contentLoading,
  handleHidePost,
  openMoreOptions,
  setMakeComment,
  handleBookmark,
  followLoading,
  mainContentLoading,
  mainInteractionsLoading,
  openMainMirrorChoice,
  setMainOpenMirrorChoice,
  mainMakeComment,
  setMainMakeComment,
  setMainContentLoading,
  decryptLoading,
  handleDecrypt,
  setMentionProfiles,
  setMentionProfilesMain,
  setProfilesOpen,
  setProfilesOpenMain,
  profilesOpen,
  profilesOpenMain,
  mentionProfiles,
  mentionProfilesMain,
  caretCoordMain,
  caretCoord,
  setCaretCoord,
  setCaretCoordMain,
  hoverPrompt,
  setHoverPrompt,
  allSearchItems,
}): JSX.Element => {
  const profilePicture = createProfilePicture(
    itemData?.profile?.metadata?.picture
  );
  return (
    <div className="relative w-full h-fit xl:h-[50rem] flex items-center justify-center flex-row pt-52 sm:pt-40 tablet:pt-32 px-2 sm:px-12 gap-12 xl:gap-7 flex-wrap xl:flex-nowrap">
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative flex flex-col gap-2 items-center justify-center w-full sm:w-[40rem] h-full">
          <InteractBar
            mirror={mirror}
            like={like}
            interactionsLoading={mainInteractionsLoading?.[0]}
            publication={itemData?.publication}
            openMirrorChoice={openMainMirrorChoice}
            setOpenMirrorChoice={setMainOpenMirrorChoice}
            simpleCollect={undefined}
            index={0}
            hideCollect
            dispatch={dispatch}
            router={router}
            comment={() => setCommentSwitch(!commentSwitch)}
            main
            handleBookmark={handleBookmark}
            handleHidePost={handleHidePost}
            showOthers
          />
          <div
            className={`relative p-3 bg-black flex justify-center w-full h-[25rem] pre:h-[30rem] ${
              commentSwitch ? "items-start" : "items-center"
            } ${allCommentsLoading && "overflow-y-scroll"}`}
          >
            {commentSwitch ? (
              allCommentsLoading ? (
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
                <div className="relative w-5/6 h-full flex flex-col gap-10 justify-start items-center">
                  <PostComment
                    itemId={undefined}
                    router={router}
                    setCaretCoord={setCaretCoordMain}
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
                    id={itemData?.publication?.id}
                    commentPostLoading={mainInteractionsLoading[0]?.comment}
                    height="8rem"
                    imageHeight="1.25rem"
                    imageWidth="1.25rem"
                    postCollectGif={postCollectGif}
                    setContentLoading={setMainContentLoading}
                    contentLoading={mainContentLoading?.[0]}
                    dispatch={dispatch}
                    main={true}
                  />
                  {allComments?.length > 0 ? (
                    <div className="relative w-full h-[20rem] flex items-start justify-center overflow-y-scroll">
                      <InfiniteScroll
                        next={handleMoreComments}
                        hasMore={hasMoreComments}
                        dataLength={allComments?.length}
                        loader={<></>}
                        className="w-full sm:w-fit h-fit items-center justify-start flex flex-col gap-10"
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
                                setCaretCoord={setCaretCoord}
                                caretCoord={caretCoord}
                                profilesOpen={profilesOpen}
                                mentionProfiles={mentionProfiles}
                                setMentionProfiles={setMentionProfiles}
                                setProfilesOpen={setProfilesOpen}
                                decryptLoading={decryptLoading}
                                handleDecrypt={handleDecrypt}
                                index={index}
                                lensConnected={lensConnected}
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
                                top={
                                  item?.metadata?.content?.length < 100 &&
                                  item?.metadata?.__typename !==
                                    "AudioMetadataV3" &&
                                  item?.metadata?.__typename !==
                                    "ImageMetadataV3" &&
                                  item?.metadata?.__typename !==
                                    "VideoMetadataV3"
                                    ? "20px"
                                    : "auto"
                                }
                                bottom={
                                  item?.metadata?.content?.length < 100 &&
                                  item?.metadata?.__typename !==
                                    "AudioMetadataV3" &&
                                  item?.metadata?.__typename !==
                                    "ImageMetadataV3" &&
                                  item?.metadata?.__typename !==
                                    "VideoMetadataV3"
                                    ? "auto"
                                    : "2px"
                                }
                                left={"auto"}
                                right={"2px"}
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
              )
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-amo/30 p-1">
                {itemData?.collectionMetadata?.images?.length > 1 && (
                  <div className="absolute z-1 left-5 top-5 w-fit h-fit flex flex-row items-center justify-center gap-1.5">
                    <div
                      className="relative w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center rotate-90"
                      onClick={() =>
                        setPurchaseDetails((prev) => ({
                          ...prev,
                          imageIndex:
                            prev.imageIndex + 1 >
                            itemData?.collectionMetadata?.images?.length - 1
                              ? 0
                              : prev.imageIndex + 1,
                        }))
                      }
                    >
                      <Image
                        src={`${INFURA_GATEWAY}/ipfs/Qma3jm41B4zYQBxag5sJSmfZ45GNykVb8TX9cE3syLafz2`}
                        layout="fill"
                        draggable={false}
                      />
                    </div>
                    <div
                      className="relative  w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center rotate-90"
                      onClick={() =>
                        setPurchaseDetails((prev) => ({
                          ...prev,
                          imageIndex:
                            prev.imageIndex > 0
                              ? prev.imageIndex - 1
                              : itemData?.collectionMetadata?.images?.length -
                                1,
                        }))
                      }
                    >
                      <Image
                        src={`${INFURA_GATEWAY}/ipfs/QmcBVNVZWGBDcAxF4i564uSNGZrUvzhu5DKkXESvhY45m6`}
                        layout="fill"
                        draggable={false}
                      />
                    </div>
                  </div>
                )}
                <div
                  title={type}
                  className="w-5 h-5 z-1 absolute right-5 top-5 rounded-full flex border border-white bg-offBlack"
                  onMouseOver={() =>
                    itemData?.collectionMetadata?.prompt && setHoverPrompt(true)
                  }
                >
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${
                      filterConstants?.origin?.find(
                        (item) =>
                          item[0]?.toLowerCase()?.trim() ===
                            type?.toLowerCase() ||
                          (item[0]?.toLowerCase()?.trim() == "coin op" &&
                            type?.toLowerCase() == "coinop") ||
                          (item[0]?.toLowerCase()?.trim() == "lit listener" &&
                            type?.toLowerCase() == "listener") ||
                          (item[0]?.toLowerCase()?.trim() == "f3m" &&
                            type?.toLowerCase() == "f3m")
                      )?.[1]
                    }`}
                    onError={(e) => handleImageError(e)}
                    layout="fill"
                    draggable={false}
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                {hoverPrompt && (
                  <div
                    onMouseOut={() => setHoverPrompt(false)}
                    className="absolute top-5 right-5 w-60 h-60 rounded-sm border border-white bg-offBlack/90 overflow-y-scroll text-white font-bit text-xs p-2 items-start justify-start z-10"
                  >
                    {itemData?.collectionMetadata?.prompt}
                  </div>
                )}
                <div
                  className={`relative w-full h-full flex items-center justify-center ${
                    !itemData?.collectionMetadata?.video &&
                    !itemData.collectionMetadata?.audio &&
                    "cursor-pointer"
                  }`}
                  onClick={() =>
                    !itemData?.collectionMetadata?.video &&
                    !itemData.collectionMetadata?.audio &&
                    dispatch(
                      setImageViewer({
                        actionValue: true,
                        actionImage: `${INFURA_GATEWAY}/ipfs/${
                          itemData?.collectionMetadata?.images?.[
                            purchaseDetails?.imageIndex
                          ]?.split("ipfs://")?.[1]
                        }`,
                        actionType: "png",
                      })
                    )
                  }
                >
                  <MediaSwitch
                    type={
                      itemData?.collectionMetadata?.video
                        ? "video"
                        : itemData?.collectionMetadata?.audio
                        ? "audio"
                        : "image"
                    }
                    srcUrl={
                      itemData?.collectionMetadata?.video
                        ? `${INFURA_GATEWAY}/ipfs/${
                            itemData?.collectionMetadata?.video?.split(
                              "ipfs://"
                            )?.[1]
                          }`
                        : itemData?.collectionMetadata?.audio
                        ? itemData?.collectionMetadata?.audio?.split(
                            "ipfs://"
                          )?.[1]
                        : `${INFURA_GATEWAY}/ipfs/${
                            itemData?.collectionMetadata?.images?.[
                              purchaseDetails?.imageIndex
                            ]?.split("ipfs://")?.[1]
                          }`
                    }
                    srcCover={
                      itemData?.collectionMetadata?.mediaCover
                        ? `${INFURA_GATEWAY}/ipfs/${
                            itemData?.collectionMetadata?.mediaCover?.split(
                              "ipfs://"
                            )?.[1]
                          }`
                        : undefined
                    }
                    classNameVideo={
                      "flex items-center justify-center relative w-full h-full"
                    }
                    classNameAudio="flex items-center justify-center w-full h-full relative"
                    classNameImage="flex items-center justify-center w-full h-full relative"
                    objectFit="contain"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative w-full h-fit flex items-center sm:items-end justify-start ml-auto flex-col gap-12">
        <div className="relative w-full h-full flex items-center sm:items-end justify-start ml-auto flex-col gap-4">
          <div className="relative w-fit h-fit flex items-end justify-end font-aust text-white break-all text-5xl mt-0">
            {itemData?.collectionMetadata?.title}
          </div>
          {itemData?.collectionMetadata?.onChromadin === "yes" && (
            <div
              className="relative flex flex-row gap-2 justify-start items-center w-fit h-full mt-0 cursor-pointer active:scale-95"
              title="Go To Matching Chromadin Mint"
              onClick={() =>
                router.push(
                  `/item/chromadin/${itemData?.collectionMetadata?.title
                    ?.replaceAll(" ", "_")
                    ?.replaceAll("_(Print)", "")}`
                )
              }
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmcK1EJdp5HFuqPUds3WjgoSPmoomiWfiroRFa3bQUh5Xj`}
                  draggable={false}
                />
              </div>
              <div className="relative w-5 h-5 flex items-center justify-center">
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmYzbyMb3okS1RKhxogJZWT56kCFjVcXZWk1aJiA8Ch2xi`}
                  draggable={false}
                />
              </div>
            </div>
          )}
          {itemData?.origin !== "1" && (
            <div className="relative w-fit h-fit flex items-end justify-end font-aust text-white break-all text-sm mt-0">
              {itemData?.origin !== "4" ? (
                <PrintType
                  printType={
                    printTypeToString[
                      Number(itemData?.printType) as unknown as PrintTagType
                    ]
                  }
                />
              ) : (
                <div className="relative flex flex-row w-fit px-1.5 py-1 h-fit text-white font-aust gap-1 items-center justify-center">
                  <div className="relative text-xxs rounded-full flex items-center justify-center">
                    {
                      filterConstants?.styles?.filter(
                        (item) =>
                          item?.[0]?.toLowerCase() ==
                          itemData?.collectionMetadata?.style?.toLowerCase()
                      )?.[0]?.[0]
                    }
                  </div>
                  <div className="relative flex items-center justify-center w-5 h-5 hover:rotate-45">
                    <Image
                      layout="fill"
                      draggable={false}
                      src={`${INFURA_GATEWAY}/ipfs/${
                        filterConstants?.styles?.filter(
                          (item) =>
                            item?.[0]?.toLowerCase() ==
                            itemData?.collectionMetadata?.style?.toLowerCase()
                        )?.[0]?.[1]
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="relative w-fit h-fit gap-4 flex-row flex flex-wrap items-end justify-end">
            <div className="relative w-fit h-fit flex flex-row gap-2 items-end justify-end font-aust text-white break-words text-sm cursor-pointer">
              <div
                className="relative flex flex-row gap-4 w-5 h-5 items-center justify-start rounded-full border border-offWhite"
                id="pfp"
                onClick={() =>
                  router.push(
                    `/autograph/${itemData?.collectionMetadata?.profileHandle}`
                  )
                }
              >
                {profilePicture && (
                  <Image
                    layout="fill"
                    draggable={false}
                    src={profilePicture}
                    onError={(e) => handleImageError(e)}
                    objectFit="cover"
                    className="rounded-full"
                  />
                )}
              </div>
              <div className="relative w-fit h-fit items-center justify-center flex">
                {itemData?.collectionMetadata?.profileHandle}
              </div>
            </div>
            {itemData?.collectionMetadata?.microbrandCover && (
              <div className="relative w-fit h-fit flex flex-col gap-px items-end justify-end font-aust text-white break-words text-sm">
                <div className="relative w-fit h-fit items-center justify-center flex text-xxs">
                  Microbrand
                </div>
                <div
                  className="relative w-fit h-fit flex flex-row gap-2 items-end justify-end break-words text-sm cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/item/microbrand/${itemData?.collectionMetadata?.microbrand}`
                    )
                  }
                >
                  <div className="relative flex flex-row gap-4 w-5 h-5 items-center justify-start">
                    {itemData?.collectionMetadata?.microbrandCover && (
                      <Image
                        layout="fill"
                        draggable={false}
                        src={`${INFURA_GATEWAY}/ipfs/${
                          itemData?.collectionMetadata?.microbrandCover?.split(
                            "ipfs://"
                          )?.[1]
                        }`}
                        onError={(e) => handleImageError(e)}
                        objectFit="contain"
                      />
                    )}
                  </div>
                  <div className="relative w-fit h-fit items-center justify-center flex">
                    {itemData?.collectionMetadata?.microbrand}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="relative flex items-center sm:items-end w-fit h-fit justify-end text-sol font-bit justify-center flex-col gap-1.5 sm:ml-auto">
            <div className="relative w-full h-fit items-center sm:items-end justify-end text-base ml-auto">
              {Number(itemData?.amount) - Number(itemData?.soldTokens || 0) >
                0 || !itemData?.soldTokens
                ? `${
                    itemData?.soldTokens ? Number(itemData?.soldTokens || 0) : 0
                  }/${Number(itemData?.amount)}`
                : "SOLD OUT"}
            </div>
          </div>
          <div className="relative w-fit h-fit flex items-start justify-center sm:justify-end font-aust text-white break-words text-xs text-center sm:text-right mt-0 max-h-[6rem] overflow-y-scroll">
            <div className="relative w-5/6 h-fit flex items-start justiy-center sm:justify-end">
              {itemData?.collectionMetadata?.description}
            </div>
          </div>
          <div className="relative w-full h-fit flex font-bit text-xxs text-white justify-center items-center sm:justify-end">
            <div className="relative w-1/2 max-h-[6rem] overflow-y-scroll h-fit flex flex-wrap items-center sm:items-end justify-center sm:justify-end sm:ml-auto gap-3">
              {itemData?.collectionMetadata?.tags?.map(
                (tag: string, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative w-fit h-fit px-2 py-1 rounded-full flex items-center justify-center text-center cursor-pointer hover:opacity-80"
                      style={{
                        backgroundColor:
                          index % 3 === 0
                            ? "#078fd6"
                            : index % 4 === 0
                            ? "#e981ff"
                            : "#81A8F8",
                      }}
                      onClick={() =>
                        dispatch(
                          setAllSearchItems({
                            actionItems: allSearchItems?.items,
                            actionInput:
                              allSearchItems?.searchInput + " " + tag,
                            actionLensPubCursor: allSearchItems?.lensPubCursor,
                            actionGraphCursor: allSearchItems?.graphCursor,
                            actionLensProfileCursor:
                              allSearchItems?.lensProfileCursor,
                            actionHasMore: allSearchItems?.hasMore,
                          })
                        )
                      }
                    >
                      <div className="relative w-fit h-fit flex top-px">
                        {tag}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
          <div className="relative justify-center sm:justify-end items-end flex w-1/2 h-fit flex flex-row sm:ml-auto gap-3">
            {filterConstants?.access
              ?.filter((item: string[]) =>
                itemData?.collectionMetadata?.access?.includes(item[0])
              )
              ?.map((item: string[], index: number) => {
                return (
                  <div
                    key={index}
                    className="relative flex w-10 h-10 rounded-full items-center justify-center"
                    title={item?.[0]}
                  >
                    <Image
                      layout="fill"
                      objectFit="cover"
                      src={`${INFURA_GATEWAY}/ipfs/${item?.[1]}`}
                      onError={(e) => handleImageError(e)}
                      className="rounded-full"
                      draggable={false}
                    />
                  </div>
                );
              })}
          </div>
        </div>
        <div className="relative w-full h-full flex items-center sm:items-end justify-start flex-col gap-3 mt-auto">
          <div className="flex flex-col gap-2 items-center sm:items-end justify-start relative">
            <div className="relative text-2xl font-bit w-fit h-fit text-sol font-bit items-center justify-center">
              {`${Number(
                (
                  (Number(itemData?.prices?.[0]) * 10 ** 18) /
                  Number(
                    oracleData?.find(
                      (oracle) =>
                        oracle.currency?.toLowerCase() ===
                        itemData?.acceptedTokens?.find(
                          (item) =>
                            item?.toLowerCase() ===
                            purchaseDetails?.currency?.toLowerCase()
                        )
                    )?.rate
                  )
                )?.toFixed(3)
              )} ${
                ACCEPTED_TOKENS?.filter((item) =>
                  itemData?.acceptedTokens?.includes(item?.[2]?.toLowerCase())
                )?.find(
                  (item) =>
                    item?.[2]?.toLowerCase() ===
                    purchaseDetails?.currency?.toLowerCase()
                )?.[1]
              }`}
            </div>
            <div className="relative flex flex-row gap-3 items-center justify-center">
              {itemData?.acceptedTokens?.map(
                (item: string, indexTwo: number) => {
                  return (
                    <div
                      className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95 ${
                        purchaseDetails?.currency === item
                          ? "opacity-50"
                          : "opacity-100"
                      }`}
                      key={indexTwo}
                      onClick={() =>
                        setPurchaseDetails((prev) => ({
                          ...prev,
                          currency: item,
                        }))
                      }
                    >
                      <Image
                        src={`${INFURA_GATEWAY}/ipfs/${
                          ACCEPTED_TOKENS?.find(
                            (value) =>
                              value[2]?.toLowerCase() == item?.toLowerCase()
                          )?.[0]
                        }`}
                        onError={(e) => handleImageError(e)}
                        className="flex rounded-full"
                        draggable={false}
                        width={30}
                        height={35}
                      />
                    </div>
                  );
                }
              )}
            </div>
          </div>
          {(type === "coinop" || type === "listener") && (
            <div className="relative w-fit h-fit flex flex-row gap-6 items-end justify-end text-white font-bit text-xxs pt-4">
              <div className="relative flex items-end w-fit h-fit justify-end items-center justify-center flex-col gap-1.5 ml-auto">
                <div className="relative w-full h-fit items-end justify-end text-base ml-auto">
                  Color
                </div>
                <div className="relative flex flex-row gap-2 items-center justify-center w-fit h-fit flex-wrap">
                  {itemData?.collectionMetadata?.colors?.map(
                    (item: string, index: number) => {
                      return (
                        <div
                          key={index}
                          className={`relative w-6 h-6 flex items-center justify-center rounded-full cursor-pointer active:scale-95 border ${
                            item === purchaseDetails?.color
                              ? "border-sol opacity-70"
                              : "border-white opacity-100"
                          }`}
                          style={{
                            backgroundColor: item,
                          }}
                          onClick={() =>
                            setPurchaseDetails((prev) => ({
                              ...prev,
                              color: item,
                            }))
                          }
                        ></div>
                      );
                    }
                  )}
                </div>
              </div>
              <div className="relative flex items-end justify-end items-center justify-center h-fit w-fit flex-col gap-1.5 ml-auto">
                <div className="relative w-full h-fit items-end justify-end text-base ml-auto">
                  Size
                </div>
                <div className="relative flex flex-row gap-2 items-center justify-center w-fit h-fit flex-wrap">
                  {itemData?.collectionMetadata?.sizes?.map(
                    (item: string, index: number) => {
                      return (
                        <div
                          key={index}
                          className={`${
                            printTypeToString[
                              Number(
                                itemData?.printType
                              ) as unknown as PrintTagType
                            ] == "poster" ||
                            printTypeToString[
                              Number(
                                itemData?.printType
                              ) as unknown as PrintTagType
                            ] == "sticker"
                              ? "w-fit px-1.5 py-1 rounded-sm"
                              : "w-6 rounded-full"
                          }relative flex h-6 items-center justify-center cursor-pointer text-white font-bit text-xxs active:scale-95 border ${
                            item === purchaseDetails?.size
                              ? "border-sol opacity-70"
                              : "border-white opacity-100"
                          }`}
                          onClick={() =>
                            setPurchaseDetails((prev) => ({
                              ...prev,
                              size: item,
                            }))
                          }
                        >
                          <div className="relative w-fit h-fit flex items-center justify-center top-px">
                            {item}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="relative w-fit h-fit flex items-center justify-center flex-row gap-6 justify-end items-end">
          {type == "chromadin" && (
            <div
              className={`relative w-32 text-sm h-8 rounded-sm flex items-center justify-center border border-white text-black font-bit text-xs bg-sol px-2 py-1 ${
                !lensConnected?.id || itemData?.amount == itemData?.soldTokens
                  ? "opacity-70"
                  : !instantLoading && "cursor-pointer active:scale-95"
              }`}
              onClick={() =>
                lensConnected?.id &&
                !instantLoading &&
                itemData?.amount != itemData?.soldTokens &&
                (isApprovedSpend ? handleInstantPurchase() : approveSpend())
              }
              title="Instant Checkout"
            >
              <div
                className={`relative w-fit h-fit flex items-center justify-center ${
                  instantLoading && "animate-spin"
                }`}
              >
                {instantLoading ? (
                  <AiOutlineLoading size={15} color="white" />
                ) : itemData?.amount !== undefined &&
                  itemData?.soldTokens !== undefined &&
                  itemData?.amount == itemData?.soldTokens ? (
                  "SOLD OUT"
                ) : !lensConnected?.id ? (
                  "Connect"
                ) : !isApprovedSpend ? (
                  "Approve Spend"
                ) : (
                  "Collect Item"
                )}
              </div>
            </div>
          )}
          <div
            className={`relative w-10 h-10 justify-end flex items-center ${
              itemData?.amount == itemData?.soldTokens
                ? "opacity-70"
                : "cursor-pointer active:scale-95"
            }`}
            title={
              itemData?.amount == itemData?.soldTokens
                ? "Sold Out"
                : "Add to Cart"
            }
            onClick={() => {
              if (itemData?.amount == itemData?.soldTokens) return;

              const newItem = {
                item: itemData,
                buyAmount: 1,
                price: Number(purchaseDetails.price),
                type: itemStringToType[type.toLowerCase().trim()],
                color: purchaseDetails.color,
                size: purchaseDetails.size,
                purchased: false,
                chosenIndex: purchaseDetails?.priceIndex,
              };

              const existingItem = cartItems?.find(
                (item) => item?.item?.pubId === itemData?.pubId
              );

              if (existingItem) {
                const newCartItems = [...(cartItems || [])];
                const itemIndex = newCartItems?.indexOf(existingItem);

                if (
                  existingItem?.color === newItem?.color &&
                  existingItem?.size === newItem?.size
                ) {
                  newCartItems[itemIndex] = {
                    ...(existingItem || {}),
                    buyAmount: existingItem?.buyAmount + 1,
                  };
                } else {
                  // newCartItems?.splice(itemIndex, 1);
                  newCartItems?.push(newItem);
                }

                dispatch(setCartItems(newCartItems));
                setCypherStorageCart(JSON.stringify(newCartItems));
              } else {
                dispatch(setCartItems([...cartItems, newItem]));
                setCypherStorageCart(JSON.stringify([...cartItems, newItem]));
              }

              dispatch(setCartAnim(true));
            }}
          >
            <Image
              draggable={false}
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmZ4v5pzdnCBeyKnS9VrjZiEAbUpAVy8ECArNcpxBt6Tw4`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chromadin;
