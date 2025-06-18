import { FunctionComponent, JSX, useContext, useState } from "react";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import { ModalContext } from "@/app/providers";
import InteractBar from "../../Tiles/modules/InteractBar";
import PostComment from "../../Tiles/modules/PostComment";
import useComment from "../../Tiles/hooks/useComment";
import useCommentItem from "../hooks/useCommentItem";
import { KinoraProps } from "../types/items.type";
import { TextOnlyMetadata } from "@lens-protocol/client";
import { ACCEPTED_TOKENS, INFURA_GATEWAY } from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import MediaSwitch from "../../Common/modules/MediaSwitch";
import { Milestone } from "../../Common/types/common.types";
import Publication from "../../Tiles/modules/Publication";
import { useRouter } from "next/navigation";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import useQuest from "../hooks/useQuest";

const Kinora: FunctionComponent<KinoraProps> = ({
  dict,
  itemData,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  const [imageIndex, setImageIndex] = useState<number>(0);
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
  const { allComments, getMoreComments, commentInfo, allCommentsLoading } =
    useCommentItem(itemData?.post?.post!, commentOpen);
  const { joinLoading, handlePlayerJoin } = useQuest(dict, itemData?.post);
  return (
    <div
      className={`relative w-full h-fit xl:h-[50rem] flex items-center justify-center flex-row pre:pt-60 tablet:pt-40 lg:pt-32 px-2 sm:px-12 gap-12 xl:gap-7 flex-wrap xl:flex-nowrap ${
        context?.header ? "pt-96" : "pt-0"
      }`}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative flex flex-col gap-2 items-center justify-center w-full sm:w-[40rem] h-full">
          <InteractBar
            item
            publication={itemData?.post?.post!}
            hideCollect
            comment={() => setCommentOpen((prev) => !prev)}
            showOthers
            dict={dict}
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
                    caretCoord={caretCoord}
                    comment={comment}
                    profilesOpen={profilesOpen}
                    commentLoading={commentLoading}
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
                {itemData?.post?.milestones?.length > 1 && (
                  <div className="absolute z-1 left-5 top-5 w-fit h-fit flex flex-row items-center justify-center gap-1.5">
                    <div
                      className="relative w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center rotate-90"
                      onClick={() =>
                        setImageIndex((prev) =>
                          prev + 1 > itemData?.post?.milestones?.length
                            ? 0
                            : prev + 1
                        )
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
                        setImageIndex((prev) =>
                          prev > 0
                            ? prev - 1
                            : itemData?.post?.milestones?.length
                        )
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
                  title={"kinora"}
                  className="w-5 h-5 z-1 absolute right-5 top-5 rounded-full flex border border-white bg-offBlack"
                >
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/QmQk9TqFivUqc6ktosoZVVih9o1uiY3r5Z7F3GCC1FpaJS`}
                    onError={(e) => handleImageError(e)}
                    layout="fill"
                    draggable={false}
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                <div
                  className={`relative w-full h-full flex items-center justify-center cursor-pointer`}
                  onClick={() =>
                    context?.setImageViewer({
                      image: `${INFURA_GATEWAY}/ipfs/${
                        imageIndex > 0
                          ? itemData?.post?.milestones?.[
                              imageIndex - 1
                            ]?.milestoneMetadata?.cover?.split("ipfs://")?.[1]
                          : itemData?.post?.questMetadata?.cover?.split(
                              "ipfs://"
                            )?.[1]
                      }`,
                      type: "png",
                    })
                  }
                >
                  <MediaSwitch
                    type={"image"}
                    srcUrl={`${INFURA_GATEWAY}/ipfs/${
                      imageIndex > 0
                        ? itemData?.post?.milestones?.[
                            imageIndex - 1
                          ]?.milestoneMetadata?.cover?.split("ipfs://")?.[1]
                        : itemData?.post?.questMetadata?.cover?.split(
                            "ipfs://"
                          )?.[1]
                    }`}
                    classNameImage="flex items-center justify-center w-full h-full relative"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative w-full h-fit flex items-center sm:items-end justify-start ml-auto flex-col gap-12">
        <div className="relative w-full h-full flex items-center sm:items-end justify-start ml-auto flex-col gap-4">
          <div className="relative w-fit h-fit flex items-end justify-end font-vcr text-white break-all text-3xl mt-0">
            {
              (imageIndex == 0
                ? itemData?.post?.questMetadata
                : itemData?.post?.milestones[imageIndex - 1]?.milestoneMetadata
              )?.title
            }
          </div>
          <div className="relative w-fit h-fit gap-4 flex-row flex flex-wrap items-end justify-end">
            <div
              className="relative w-fit h-fit flex flex-row gap-2 items-end justify-end font-vcr text-white break-words text-sm cursor-pointer"
              onClick={() => {
                context?.setFiltersOpen({ value: false, allow: false });
                router.push(
                  `/autograph/${itemData?.post?.post?.author?.username?.localName}`
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
                    itemData?.post?.post?.author?.metadata?.picture
                  )}
                  key={itemData?.post?.post?.author?.metadata?.picture}
                  onError={(e) => handleImageError(e)}
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <div className="relative w-fit h-fit items-center justify-center flex">
                {itemData?.post?.post?.author?.username?.localName}
              </div>
            </div>
          </div>
          <div className="relative flex items-center sm:items-end w-fit h-fit justify-end text-sol font-bit justify-center flex-col gap-1.5 sm:ml-auto">
            <div className="relative w-fit h-fit flex items-center justify-center">{`Max Player Count: ${
              Number(itemData?.post?.maxPlayerCount) ==
              Number(itemData?.post?.players?.length)
                ? "Limit Reached"
                : `${Number(itemData?.post?.players?.length)} / ${Number(
                    itemData?.post?.maxPlayerCount
                  )}`
            }`}</div>
          </div>
          <div className="relative w-fit h-fit flex items-start justify-center sm:justify-end font-vcr text-white break-words text-xs text-center sm:text-right mt-0 max-h-[6rem] overflow-y-scroll">
            <div className="relative w-5/6 h-fit flex items-start justiy-center sm:justify-end break-all">
              {
                (imageIndex == 0
                  ? itemData?.post?.questMetadata
                  : itemData?.post?.milestones[imageIndex - 1]
                      ?.milestoneMetadata
                )?.description
              }
            </div>
          </div>
          <div
            className="relative flex items-center sm:items-end w-fit h-fit justify-end text-cost font-bit justify-center flex-col text-xs sm:ml-auto cursor-pointer"
            onClick={() =>
              window.open(
                `https://kinora.irrevocable.dev/quest/${itemData?.post?.post?.id}`
              )
            }
          >
            <div className="relative w-fit h-fit flex items-center justify-center">
              {dict?.ques}
            </div>
          </div>
          <div className="relative w-full h-fit flex items-center justify-center sm:justify-end">
            <div
              className="relative w-full h-20 flex overflow-x-scroll items-center justify-start max-w-none sm:max-w-[35rem]"
              id="xScroll"
            >
              <div className="relative flex sm:ml-auto w-fit h-full item-center justify-start sm:justify-end flex-row gap-3">
                {[
                  itemData?.post?.questMetadata?.cover,
                  ...itemData?.post?.milestones,
                ]?.map((item: Milestone | string, secondIndex: number) => {
                  return (
                    <div
                      key={secondIndex}
                      className={`relative w-40 h-full p-px flex items-center justify-center cursor-pointer hover:opacity-70 ${
                        imageIndex == secondIndex && "opacity-30"
                      }`}
                      onClick={() => setImageIndex(secondIndex)}
                      id="northern"
                    >
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                          src={`${INFURA_GATEWAY}/ipfs/${
                            (secondIndex == 0
                              ? (item as string)
                              : (item as Milestone)?.milestoneMetadata?.cover
                            )?.split("ipfs://")?.[1]
                          }`}
                          draggable={false}
                          objectFit="cover"
                          layout="fill"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {imageIndex === 0 ? (
            <div className="relative w-full h-fit flex flex-col items-center sm:items-end justify-center sm:justify-end gap-2 font-vcr text-white text-xs">
              <div className="relative w-fit h-fit flex flex-row items-center justify-start gap-1 break-words">
                <div className="relative w-fit h-fit flex items-center justify-center">
                  {dict?.cont}
                </div>
                <div className="relative w-fit h-fit flex items-center justify-center text-girasol break-words">
                  {itemData?.post?.milestoneCount}
                </div>
              </div>
              <div className="relative w-fit h-fit flex flex-row items-center justify-start gap-1 break-words">
                <div className="relative w-fit h-fit flex items-center justify-center">
                  {dict?.contV}
                </div>
                <div className="relative w-fit h-fit flex items-center justify-center text-girasol break-words">
                  {itemData?.post?.milestones?.reduce(
                    (acumulador, valorActual) =>
                      acumulador + Number(valorActual.videoLength),
                    0
                  )}
                </div>
                <div
                  className="relative w-3.5 h-3.5 flex items-center justify-center cursor-pointer active:scale-95"
                  onClick={() => window.open("https://livepeer.studio/")}
                >
                  <Image
                    draggable={false}
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/QmVa8AWMYyAfcQAEpbqdUoRSxSkntpH1DEMpdyajZWz4AR`}
                  />
                </div>
              </div>
              <div className="relative w-fit h-fit flex flex-row items-center justify-start gap-px break-words">
                <div className="relative w-fit h-fit flex items-center justify-center">
                  {dict?.rew}
                </div>
                <div className="relative w-fit h-fit flex items-center justify-center text-girasol break-words">
                  {(itemData?.post?.milestones
                    ?.map(
                      (item) =>
                        item?.rewards?.filter((rew) => rew?.type == "0")?.length
                    )
                    ?.filter(Boolean)?.length! > 0
                    ? itemData?.post?.milestones?.reduce(
                        (acumulador, valorActual) =>
                          acumulador +
                          Number(
                            valorActual?.rewards?.filter(
                              (rew) => rew?.type == "0"
                            )?.length
                          ),
                        0
                      ) + " x ERC20 + "
                    : "") +
                    (itemData?.post?.milestones
                      ?.map(
                        (item) =>
                          item?.rewards?.filter((rew) => rew?.type == "1")
                            ?.length
                      )
                      ?.filter(Boolean)?.length! > 0
                      ? itemData?.post?.milestones?.reduce(
                          (acumulador, valorActual) =>
                            acumulador +
                            Number(
                              valorActual?.rewards?.filter(
                                (rew) => rew?.type == "1"
                              )?.length
                            ),
                          0
                        ) + " x ERC721"
                      : "")}
                </div>
              </div>
            </div>
          ) : (
            <div
              className="relative w-full h-fit flex flex-col items-center sm:items-end justify-start gap-2 font-vcr text-white text-xs overflow-x-scroll max-w-none sm:max-w-[35rem]"
              id="xScroll"
            >
              <div className="relative w-fit h-fit flex items-center justify-center text-white text-sm">
                {dict?.rewM}
              </div>
              <div className="relative w-fit h-fit justify-start items-center gap-4 flex flex-row flex-wrap">
                {itemData?.post?.milestones[imageIndex - 1]?.rewards
                  ?.flat()
                  ?.map((reward, index: number) => {
                    return (
                      <div
                        key={index}
                        className="relative w-fit h-fit flex items-center justify-center gap-1"
                      >
                        {reward?.type === "0" ? (
                          <>
                            <div className="relative w-5 h-6 flex items-center justify-center">
                              <Image
                                draggable={false}
                                layout="fill"
                                src={`${INFURA_GATEWAY}/ipfs/${
                                  ACCEPTED_TOKENS?.filter(
                                    (token) =>
                                      reward?.tokenAddress?.toLowerCase() ==
                                      token[2]?.toLowerCase()
                                  )?.[0]?.[0]
                                }`}
                              />
                            </div>
                            <div className="relative w-fit h-fit flex items-center justify-center font-vcr text-acei text-xxs">
                              {`${
                                Number(reward?.amount) /
                                (reward?.tokenAddress?.toLowerCase() ==
                                ACCEPTED_TOKENS[2][2]?.toLowerCase()
                                  ? 10 ** 6
                                  : 10 ** 18)
                              } ${
                                ACCEPTED_TOKENS?.filter(
                                  (token) =>
                                    reward?.tokenAddress?.toLowerCase() ==
                                    token[2]?.toLowerCase()
                                )?.[0]?.[1]
                              }`}
                            </div>
                          </>
                        ) : (
                          <div
                            className="relative w-14 h-14 flex items-center justify-center gap-1 rounded-sm p-px cursor-pointer active:scale-95"
                            id="northern"
                            onClick={() =>
                              context?.setImageViewer({
                                image: `${INFURA_GATEWAY}/ipfs/${
                                  reward?.rewardMetadata?.mediaCover &&
                                  reward?.rewardMetadata?.mediaCover !== ""
                                    ? reward?.rewardMetadata?.mediaCover?.split(
                                        "ipfs://"
                                      )?.[1]
                                    : reward?.rewardMetadata?.images?.[0]?.split(
                                        "ipfs://"
                                      )?.[1]
                                }`,
                                type: "png",
                              })
                            }
                          >
                            <div className="relative w-full h-full flex items-center justify-center rounded-sm">
                              <Image
                                draggable={false}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-sm"
                                src={`${INFURA_GATEWAY}/ipfs/${
                                  reward?.rewardMetadata?.mediaCover &&
                                  reward?.rewardMetadata?.mediaCover !== ""
                                    ? reward?.rewardMetadata?.mediaCover?.split(
                                        "ipfs://"
                                      )?.[1]
                                    : reward?.rewardMetadata?.images?.[0]?.split(
                                        "ipfs://"
                                      )?.[1]
                                }`}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
        <div className="relative w-fit h-fit flex items-center justify-center flex-row gap-6 justify-end items-end">
          <div
            className={`relative w-full h-9 px-1.5 py-1 flex flex-row items-center gap-3 justify-center border border-cost ${
              joinLoading ||
              itemData?.post?.players?.some(
                (item) =>
                  item?.profile?.address ==
                  context?.lensConectado?.profile?.address
              ) ||
              !itemData?.post?.status
                ? "opacity-70"
                : "cursor-pointer active:scale-95"
            }`}
            onClick={() =>
              !joinLoading &&
              !itemData?.post?.players?.some(
                (item) =>
                  item?.profile?.address ==
                  context?.lensConectado?.profile?.address
              ) &&
              itemData?.post?.status &&
              handlePlayerJoin()
            }
          >
            <div
              className={`relative w-4 h-4 flex items-center justify-center ${
                joinLoading && "animate-spin"
              }`}
            >
              {joinLoading ? (
                <AiOutlineLoading color={"FBD201"} size={15} />
              ) : (
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmNomDrWUNrcy2SAVzsKoqd5dPMogeohB8PSuHCg57nyzF`}
                  draggable={false}
                />
              )}
            </div>
            <div className="relative w-fit h-fit text-sm font-vcr text-gray-300">
              {itemData?.post?.players
                ?.find(
                  (item) =>
                    item?.profile?.address ==
                    context?.lensConectado?.profile?.address
                )
                ?.questsCompleted?.includes(itemData?.post?.questId)
                ? dict?.compQ
                : itemData?.post?.players?.some(
                    (item) =>
                      item?.profile?.address ==
                      context?.lensConectado?.profile?.address
                  )
                ? dict?.joinedQ
                : !itemData?.post?.status
                ? dict?.cloQ
                : dict?.joinQ}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kinora;
