import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import Publication from "../../Tiles/modules/Publication";
import InteractBar from "../../Tiles/modules/InteractBar";
import PostComment from "../../Tiles/modules/PostComment";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  ACCEPTED_TOKENS,
  INFURA_GATEWAY,
  itemStringToType,
  printTypeToString,
} from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import MediaSwitch from "../../Common/modules/MediaSwitch";
import { useRouter } from "next/navigation";
import { ModalContext } from "@/app/providers";
import { setCypherStorageCart } from "@/app/lib/utils";
import { AiOutlineLoading } from "react-icons/ai";
import useComment from "../../Tiles/hooks/useComment";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { ChromadinProps } from "../types/items.type";
import { PrintType as PrintTypeTag } from "../../Common/types/common.types";
import { Post, TextOnlyMetadata } from "@lens-protocol/client";
import PrintType from "../../Tiles/modules/PrintType";
import useCommentItem from "../hooks/useCommentItem";
import useItem from "../hooks/useItem";
import Fulfillment from "./Fulfillment";

const Chromadin: FunctionComponent<ChromadinProps> = ({
  type,
  itemData,
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const router = useRouter();
  const {
    purchaseDetails,
    setPurchaseDetails,
    handleInstantPurchase,
    instantLoading,
    approveSpend,
    isApprovedSpend,
  } = useItem(itemData, dict);
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
    setCommentOpen,
  } = useComment();
  const {
    allComments,
    hoverPrompt,
    setHoverPrompt,
    getMoreComments,
    commentInfo,
    allCommentsLoading,
  } = useCommentItem(itemData?.post?.post!, commentOpen);

  return (
    <div
      className={`relative w-full h-fit xl:h-[50rem] flex items-center justify-center flex-row pre:pt-60 tablet:pt-40 lg:pt-32 px-2 sm:px-12 gap-12 xl:gap-7 flex-wrap xl:flex-nowrap ${
        context?.header ? "pt-96" : "pt-0"
      }`}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative flex flex-col gap-2 items-center justify-center w-full sm:w-[40rem] h-full">
          <InteractBar
            dict={dict}
            publication={itemData?.post?.post!}
            showOthers
            item
            comment={() => setCommentOpen((prev) => !prev)}
          />
          <div
            className={`relative p-3 bg-black flex justify-center w-full h-[25rem] pre:h-[30rem] ${
              commentOpen ? "items-start" : "items-center"
            } ${allCommentsLoading && "overflow-y-scroll"}`}
          >
            {commentOpen ? (
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
                    dict={dict}
                    commentDetails={commentDetails}
                    searchProfiles={searchProfiles}
                    setCommentDetails={setCommentDetails}
                    mentionProfiles={profilesFound}
                    setProfilesOpen={setProfilesOpen}
                    id={itemData?.post?.post?.id!}
                    comment={comment}
                    profilesOpen={profilesOpen}
                    commentLoading={commentLoading}
                    caretCoord={caretCoord}
                    textElement={textElement}
                    height="8rem"
                    imageHeight="1.25rem"
                    imageWidth="1.25rem"
                  />
                  {allComments?.length > 0 ? (
                    <div className="relative w-full h-[20rem] flex items-start justify-center overflow-y-scroll">
                      <InfiniteScroll
                        next={getMoreComments}
                        hasMore={commentInfo?.hasMore}
                        dataLength={allComments?.length}
                        loader={<></>}
                        className="w-full sm:w-fit h-fit items-center justify-start flex flex-col gap-10"
                      >
                        {allComments?.map((item: Post, index: number) => {
                          return (
                            <Publication
                              dict={dict}
                              index={index}
                              item={item}
                              key={index}
                              top={
                                (item?.metadata as TextOnlyMetadata)?.content
                                  ?.length < 100 &&
                                item?.metadata?.__typename !==
                                  "AudioMetadata" &&
                                item?.metadata?.__typename !==
                                  "ImageMetadata" &&
                                item?.metadata?.__typename !== "VideoMetadata"
                                  ? "20px"
                                  : "auto"
                              }
                              bottom={
                                (item?.metadata as TextOnlyMetadata)?.content
                                  ?.length < 100 &&
                                item?.metadata?.__typename !==
                                  "AudioMetadata" &&
                                item?.metadata?.__typename !==
                                  "ImageMetadata" &&
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
              )
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-amo/30 p-1">
                {itemData?.post?.metadata?.images?.length > 1 && (
                  <div className="absolute z-1 left-5 top-5 w-fit h-fit flex flex-row items-center justify-center gap-1.5">
                    <div
                      className="relative w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center rotate-90"
                      onClick={() =>
                        setPurchaseDetails((prev) => ({
                          ...prev,
                          imageIndex:
                            prev.imageIndex + 1 >
                            itemData?.post?.metadata?.images?.length - 1
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
                              : Number(
                                  itemData?.post?.metadata?.images?.length
                                ) - 1,
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
                    itemData?.post?.metadata?.prompt && setHoverPrompt(true)
                  }
                >
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${
                      context?.filterConstants?.origin?.find(
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
                    {itemData?.post?.metadata?.prompt}
                  </div>
                )}
                <div
                  className={`relative w-full h-full flex items-center justify-center ${
                    !itemData?.post?.metadata?.video &&
                    !itemData.post?.metadata?.audio &&
                    "cursor-pointer"
                  }`}
                  onClick={() =>
                    !itemData?.post?.metadata?.video &&
                    !itemData.post?.metadata?.audio &&
                    context?.setImageViewer({
                      image: `${INFURA_GATEWAY}/ipfs/${
                        itemData?.post?.metadata?.images?.[
                          purchaseDetails?.imageIndex
                        ]?.split("ipfs://")?.[1]
                      }`,
                      type: "png",
                    })
                  }
                >
                  <MediaSwitch
                    type={
                      itemData?.post?.metadata?.video
                        ? "video"
                        : itemData?.post?.metadata?.audio
                        ? "audio"
                        : "image"
                    }
                    srcUrl={
                      itemData?.post?.metadata?.video
                        ? itemData?.post?.metadata?.video
                        : itemData?.post?.metadata?.audio
                        ? itemData?.post?.metadata?.audio?.split("ipfs://")?.[1]
                        : `${INFURA_GATEWAY}/ipfs/${
                            itemData?.post?.metadata?.images?.[
                              purchaseDetails?.imageIndex
                            ]?.split("ipfs://")?.[1]
                          }`
                    }
                    srcCover={
                      itemData?.post?.metadata?.mediaCover
                        ? `${INFURA_GATEWAY}/ipfs/${
                            itemData?.post?.metadata?.mediaCover?.split(
                              "ipfs://"
                            )?.[1]
                          }`
                        : undefined
                    }
                    classNameVideo={{
                      display: "flex",
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                      justifyItems: "center",
                      position: "relative",
                    }}
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
          <div className="relative w-fit h-fit flex items-center sm:items-end justify-center sm:justify-end sm:text-right text-center font-aust text-white break-all text-5xl mt-0">
            {itemData?.post?.metadata?.title}
          </div>
          {itemData?.post?.metadata?.onChromadin === "yes" && (
            <div
              className="relative flex flex-row gap-2 justify-start items-center w-fit h-full mt-0 cursor-pointer active:scale-95"
              title="Go To Matching Chromadin Mint"
              onClick={() => {
                context?.setFiltersOpen({ value: false, allow: false });
                router.push(
                  `/item/chromadin/${itemData?.post?.metadata?.title
                    ?.replaceAll(" ", "_")
                    ?.replaceAll("_(Print)", "")}`
                );
              }}
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
          {itemData?.post?.origin !== "0" && (
            <div className="relative w-fit h-fit flex items-end justify-end font-aust text-white break-all text-sm mt-0">
              {itemData?.post?.origin !== "3" ? (
                <PrintType
                  dict={dict}
                  printType={
                    printTypeToString[
                      Number(
                        itemData?.post?.printType
                      ) as unknown as PrintTypeTag
                    ]
                  }
                />
              ) : (
                <div className="relative flex flex-row w-fit px-1.5 py-1 h-fit text-white font-aust gap-1 items-center justify-center">
                  <div className="relative text-xxs rounded-full flex items-center justify-center">
                    {
                      context?.filterConstants?.styles?.filter(
                        (item) =>
                          item?.[0]?.toLowerCase() ==
                          itemData?.post?.metadata?.style?.toLowerCase()
                      )?.[0]?.[0]
                    }
                  </div>
                  <div className="relative flex items-center justify-center w-5 h-5 hover:rotate-45">
                    <Image
                      layout="fill"
                      draggable={false}
                      src={`${INFURA_GATEWAY}/ipfs/${
                        context?.filterConstants?.styles?.filter(
                          (item) =>
                            item?.[0]?.toLowerCase() ==
                            itemData?.post?.metadata?.style?.toLowerCase()
                        )?.[0]?.[1]
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="relative w-fit h-fit gap-4 flex-row flex flex-wrap items-end justify-end">
            <div
              className="relative w-fit h-fit flex flex-row gap-2 items-end justify-end font-aust text-white break-words text-sm cursor-pointer"
              onClick={() => {
                context?.setFiltersOpen({ value: false, allow: false });
                router.push(
                  `/autograph/${itemData?.post?.profile?.username?.localName}`
                );
              }}
            >
              <div
                className="relative flex flex-row gap-4 w-5 h-5 items-center justify-start rounded-full border border-offWhite"
                id="pfp"
              >
                <Image
                  layout="fill"
                  draggable={false}
                  src={handleProfilePicture(
                    itemData?.post?.profile?.metadata?.picture
                  )}
                  key={itemData?.post?.profile?.metadata?.picture}
                  onError={(e) => handleImageError(e)}
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <div className="relative w-fit h-fit items-center justify-center flex">
                {itemData?.post?.profile?.username?.localName}
              </div>
            </div>
            {itemData?.post?.metadata?.microbrandCover && (
              <div className="relative w-fit h-fit flex flex-col gap-px items-end justify-end font-aust text-white break-words text-sm">
                <div className="relative w-fit h-fit items-center justify-center flex text-xxs">
                  {dict?.marc}
                </div>
                <div
                  className="relative w-fit h-fit flex flex-row gap-2 items-end justify-end break-words text-sm cursor-pointer"
                  onClick={() => {
                    context?.setFiltersOpen({ value: false, allow: false });
                    router.push(
                      `/item/microbrand/${itemData?.post?.metadata?.microbrand?.replaceAll(
                        " ",
                        "_"
                      )}`
                    );
                  }}
                >
                  <div className="relative flex flex-row gap-4 w-5 h-5 items-center justify-start">
                    {itemData?.post?.metadata?.microbrandCover && (
                      <Image
                        layout="fill"
                        draggable={false}
                        src={`${INFURA_GATEWAY}/ipfs/${
                          itemData?.post?.metadata?.microbrandCover?.split(
                            "ipfs://"
                          )?.[1]
                        }`}
                        onError={(e) => handleImageError(e)}
                        objectFit="contain"
                      />
                    )}
                  </div>
                  <div className="relative w-fit h-fit items-center justify-center flex">
                    {itemData?.post?.metadata?.microbrand}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="relative flex items-center sm:items-end w-fit h-fit justify-end text-sol font-bit justify-center flex-col gap-1.5 sm:ml-auto">
            <div className="relative w-full h-fit items-center sm:items-end justify-end text-base ml-auto">
              {Number(itemData?.post?.amount) -
                Number(itemData?.post?.tokenIdsMinted?.length || 0) >
                0 || !itemData?.post?.tokenIdsMinted?.length
                ? `${
                    Number(itemData?.post?.tokenIdsMinted?.length) > 0
                      ? Number(itemData?.post?.tokenIdsMinted?.length || 0)
                      : 0
                  }/${Number(itemData?.post?.amount)}`
                : dict?.sold}
            </div>
          </div>
          <div className="relative w-fit h-fit flex items-start justify-center sm:justify-end font-aust text-white break-words text-xs text-center sm:text-right mt-0 max-h-[6rem] overflow-y-scroll">
            <div className="relative w-5/6 h-fit flex items-start justiy-center sm:justify-end break-all">
              {itemData?.post?.metadata?.description}
            </div>
          </div>
          <div className="relative w-full h-fit flex font-bit text-xxs text-white justify-center items-center sm:justify-end">
            <div className="relative w-1/2 max-h-[6rem] overflow-y-scroll h-fit flex flex-wrap items-center sm:items-end justify-center sm:justify-end sm:ml-auto gap-3">
              {itemData?.post?.metadata?.tags?.map(
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
                        context?.setSearchItems((prev) => ({
                          ...prev,
                          input: prev?.input + " " + tag,
                        }))
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
            {context?.filterConstants?.access
              ?.filter((item: string[]) =>
                itemData?.post?.metadata?.access?.includes(item[0])
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
                  (Number(itemData?.post?.price) * 10 ** 18) /
                  Number(
                    context?.oracleData?.find(
                      (oracle) =>
                        oracle.currency?.toLowerCase() ===
                        itemData?.post?.acceptedTokens?.find(
                          (item) =>
                            item?.toLowerCase() ===
                            purchaseDetails?.currency?.toLowerCase()
                        )
                    )?.rate
                  )
                )?.toFixed(3)
              )} ${
                ACCEPTED_TOKENS?.filter((item) =>
                  itemData?.post?.acceptedTokens?.includes(
                    item?.[2]?.toLowerCase()
                  )
                )?.find(
                  (item) =>
                    item?.[2]?.toLowerCase() ===
                    purchaseDetails?.currency?.toLowerCase()
                )?.[1]
              }`}
            </div>
            <div className="relative flex flex-row gap-3 items-center justify-center">
              {itemData?.post?.acceptedTokens?.map(
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
                        height={30}
                      />
                    </div>
                  );
                }
              )}
            </div>
          </div>
          {type !== "chromadin" && (
            <div className="relative w-fit h-fit flex flex-col gap-6 items-center sm:items-end justify-center sm:justify-end">
              {type !== "f3m" && (
                <div className="relative w-fit h-fit flex flex-row gap-6 items-center justify-center sm:items-end sm:justify-end text-white font-bit text-xxs pt-4">
                  <div className="relative flex items-end w-fit h-fit justify-end items-center justify-center flex-col gap-1.5 ml-auto">
                    <div className="relative w-full h-fit items-end justify-end text-base ml-auto">
                      Color
                    </div>
                    <div className="relative flex flex-row gap-2 items-center justify-center w-fit h-fit flex-wrap">
                      {itemData?.post?.metadata?.colors?.map(
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
                      {dict?.siz}
                    </div>
                    <div className="relative flex flex-row gap-2 items-center justify-center w-fit h-fit flex-wrap">
                      {itemData?.post?.metadata?.sizes?.map(
                        (item: string, index: number) => {
                          return (
                            <div
                              key={index}
                              className={`${
                                printTypeToString[
                                  Number(
                                    itemData?.post?.printType
                                  ) as unknown as PrintTypeTag
                                ] == "poster" ||
                                printTypeToString[
                                  Number(
                                    itemData?.post?.printType
                                  ) as unknown as PrintTypeTag
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
              <Fulfillment
                loading={instantLoading}
                dict={dict}
                purchaseDetails={purchaseDetails}
                setPurchaseDetails={setPurchaseDetails}
              />
            </div>
          )}
        </div>
        <div className="relative w-fit h-fit flex items-center justify-center flex-row gap-6 justify-end items-end">
          <div
            className={`relative w-32 text-sm h-8 rounded-sm flex items-center justify-center border border-white text-black font-bit text-xs bg-sol px-2 py-1 ${
              !context?.lensConectado?.profile ||
              Number(itemData?.post?.amount) ==
                itemData?.post?.tokenIdsMinted?.length
                ? "opacity-70"
                : !instantLoading && "cursor-pointer active:scale-95"
            }`}
            onClick={() =>
              context?.lensConectado?.profile &&
              !instantLoading &&
              Number(itemData?.post?.amount) !=
                itemData?.post?.tokenIdsMinted?.length &&
              (isApprovedSpend ? handleInstantPurchase() : approveSpend())
            }
            title={dict?.checkI}
          >
            <div
              className={`relative w-fit h-fit flex items-center justify-center ${
                instantLoading && "animate-spin"
              }`}
            >
              {instantLoading ? (
                <AiOutlineLoading size={15} color="white" />
              ) : itemData?.post?.amount !== undefined &&
                itemData?.post?.tokenIdsMinted?.length !== undefined &&
                Number(itemData?.post?.amount) ==
                  itemData?.post?.tokenIdsMinted?.length ? (
                dict?.sold
              ) : !context?.lensConectado?.profile ? (
                dict?.con2
              ) : !isApprovedSpend ? (
                dict?.ap
              ) : (
                dict?.col2
              )}
            </div>
          </div>
          <div
            className={`relative w-10 h-10 justify-end flex items-center ${
              Number(itemData?.post?.amount) ==
              itemData?.post?.tokenIdsMinted?.length
                ? "opacity-70"
                : "cursor-pointer active:scale-95"
            }`}
            title={
              Number(itemData?.post?.amount) ==
              itemData?.post?.tokenIdsMinted?.length
                ? dict?.sod
                : dict?.cart
            }
            onClick={() => {
              if (
                Number(itemData?.post?.amount) ==
                itemData?.post?.tokenIdsMinted?.length
              )
                return;

              const newItem = {
                item: itemData?.post,
                buyAmount: 1,
                price: Number(itemData?.post?.price),
                type: itemStringToType[type.toLowerCase().trim()],
                color: purchaseDetails.color!,
                size: purchaseDetails.size!,
                currency: itemData?.post?.acceptedTokens?.[0],
              };

              const existingItem = context?.cartItems?.find(
                (item) => item?.item?.postId === itemData?.post?.post?.id
              );

              if (existingItem) {
                const newCartItems = [...(context?.cartItems || [])];
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

                context?.setCartItems(newCartItems);
                setCypherStorageCart(JSON.stringify(newCartItems));
              } else {
                context?.setCartItems([...(context?.cartItems || []), newItem]);
                setCypherStorageCart(
                  JSON.stringify([...(context?.cartItems || []), newItem])
                );
              }

              context?.setCartAnim(true);
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
