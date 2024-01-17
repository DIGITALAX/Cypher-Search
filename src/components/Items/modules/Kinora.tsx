import { FunctionComponent } from "react";
import { KinoraProps } from "../types/item.types";
import Image from "next/legacy/image";
import { ACCEPTED_TOKENS, INFURA_GATEWAY } from "../../../../lib/constants";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import { AiOutlineLoading } from "react-icons/ai";
import InteractBar from "@/components/Common/modules/InteractBar";
import PostComment from "@/components/Autograph/modules/PostComment";
import InfiniteScroll from "react-infinite-scroll-component";
import { Comment } from "../../../../graphql/generated";
import Publication from "@/components/Autograph/modules/Publication";
import MediaSwitch from "@/components/Common/modules/MediaSwitch";
import handleImageError from "../../../../lib/helpers/handleImageError";
import { setImageViewer } from "../../../../redux/reducers/ImageLargeSlice";
import { Milestone, Reward } from "@/components/Search/types/search.types";

const Kinora: FunctionComponent<KinoraProps> = ({
  itemData,
  router,
  dispatch,
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
  handleHidePost,
  joinLoading,
  handlePlayerJoin,
  purchaseDetails,
  setPurchaseDetails,
}): JSX.Element => {
  const profilePicture = createProfilePicture(
    itemData?.publication?.by?.metadata?.picture
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
                {itemData?.milestones?.length > 1 && (
                  <div className="absolute z-1 left-5 top-5 w-fit h-fit flex flex-row items-center justify-center gap-1.5">
                    <div
                      className="relative w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center rotate-90"
                      onClick={() =>
                        setPurchaseDetails((prev) => ({
                          ...prev,
                          imageIndex:
                            prev.imageIndex + 1 > itemData?.milestones?.length
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
                              : itemData?.milestones?.length,
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
                    dispatch(
                      setImageViewer({
                        actionValue: true,
                        actionImage: `${INFURA_GATEWAY}/ipfs/${
                          purchaseDetails?.imageIndex > 0
                            ? itemData?.milestones?.[
                                purchaseDetails?.imageIndex - 1
                              ]?.milestoneMetadata?.cover?.split("ipfs://")?.[1]
                            : itemData?.questMetadata?.cover?.split(
                                "ipfs://"
                              )?.[1]
                        }`,
                        actionType: "png",
                      })
                    )
                  }
                >
                  <MediaSwitch
                    type={"image"}
                    srcUrl={`${INFURA_GATEWAY}/ipfs/${
                      purchaseDetails?.imageIndex > 0
                        ? itemData?.milestones?.[
                            purchaseDetails?.imageIndex - 1
                          ]?.milestoneMetadata?.cover?.split("ipfs://")?.[1]
                        : itemData?.questMetadata?.cover?.split("ipfs://")?.[1]
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
              (purchaseDetails?.imageIndex == 0
                ? itemData?.questMetadata
                : itemData?.milestones[purchaseDetails?.imageIndex - 1]
                    ?.milestoneMetadata
              )?.title
            }
          </div>
          <div className="relative w-fit h-fit gap-4 flex-row flex flex-wrap items-end justify-end">
            <div className="relative w-fit h-fit flex flex-row gap-2 items-end justify-end font-vcr text-white break-words text-sm cursor-pointer">
              <div
                className="relative flex flex-row gap-4 w-5 h-5 items-center justify-start rounded-full border border-offWhite"
                id="pfp"
                onClick={() =>
                  router.push(
                    `/autograph/${
                      itemData?.publication?.by?.handle?.suggestedFormatted?.localName?.split(
                        "@"
                      )?.[1]
                    }`
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
                {
                  itemData?.publication?.by?.handle?.suggestedFormatted
                    ?.localName
                }
              </div>
            </div>
          </div>
          <div className="relative flex items-center sm:items-end w-fit h-fit justify-end text-sol font-bit justify-center flex-col gap-1.5 sm:ml-auto">
            <div className="relative w-fit h-fit flex items-center justify-center">{`Max Player Count: ${
              Number(itemData?.maxPlayerCount) ==
              Number(itemData?.players?.length)
                ? "Limit Reached"
                : `${Number(itemData?.players?.length)} / ${Number(
                    itemData?.maxPlayerCount
                  )}`
            }`}</div>
          </div>
          <div className="relative w-fit h-fit flex items-start justify-center sm:justify-end font-vcr text-white break-words text-xs text-center sm:text-right mt-0 max-h-[6rem] overflow-y-scroll">
            <div className="relative w-5/6 h-fit flex items-start justiy-center sm:justify-end">
              {
                (purchaseDetails?.imageIndex == 0
                  ? itemData?.questMetadata
                  : itemData?.milestones[purchaseDetails?.imageIndex - 1]
                      ?.milestoneMetadata
                )?.description
              }
            </div>
          </div>
          <div
            className="relative flex items-center sm:items-end w-fit h-fit justify-end text-cost font-bit justify-center flex-col text-xs sm:ml-auto cursor-pointer"
            onClick={() =>
              window.open(
                `https://kinora.irrevocable.dev/quest/${itemData?.publication?.id}`
              )
            }
          >
            <div className="relative w-fit h-fit flex items-center justify-center">
              {`See Quest >`}
            </div>
          </div>
          <div className="relative w-full h-fit flex items-center justify-center sm:justify-end">
            <div
              className="relative w-full h-20 flex overflow-x-scroll items-center justify-start max-w-none sm:max-w-[35rem]"
              id="xScroll"
            >
              <div className="relative flex w-fit h-full item-center justify-start sm:justify-end flex-row gap-3">
                {[itemData?.questMetadata?.cover, ...itemData?.milestones]?.map(
                  (item: Milestone | string, secondIndex: number) => {
                    return (
                      <div
                        key={secondIndex}
                        className={`relative w-40 h-full p-px flex items-center justify-center cursor-pointer hover:opacity-70 ${
                          purchaseDetails?.imageIndex == secondIndex &&
                          "opacity-30"
                        }`}
                        onClick={() =>
                          setPurchaseDetails((prev) => ({
                            ...prev,
                            imageIndex: secondIndex,
                          }))
                        }
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
                  }
                )}
              </div>
            </div>
          </div>
          {purchaseDetails?.imageIndex === 0 ? (
            <div className="relative w-full h-fit flex flex-col items-center sm:items-end justify-center sm:justify-end gap-2 font-vcr text-white text-xs">
              <div className="relative w-fit h-fit flex flex-row items-center justify-start gap-1 break-words">
                <div className="relative w-fit h-fit flex items-center justify-center">
                  Milestone Count:
                </div>
                <div className="relative w-fit h-fit flex items-center justify-center text-girasol break-words">
                  {itemData?.milestoneCount}
                </div>
              </div>
              <div className="relative w-fit h-fit flex flex-row items-center justify-start gap-1 break-words">
                <div className="relative w-fit h-fit flex items-center justify-center">
                  Video Count:
                </div>
                <div className="relative w-fit h-fit flex items-center justify-center text-girasol break-words">
                  {itemData?.milestones?.reduce(
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
                  Reward Mix:
                </div>
                <div className="relative w-fit h-fit flex items-center justify-center text-girasol break-words">
                  {(itemData?.milestones
                    ?.map(
                      (item) =>
                        item?.rewards?.filter((rew) => rew?.type == "0")?.length
                    )
                    ?.filter(Boolean)?.length! > 0
                    ? itemData?.milestones?.reduce(
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
                    (itemData?.milestones
                      ?.map(
                        (item) =>
                          item?.rewards?.filter((rew) => rew?.type == "1")
                            ?.length
                      )
                      ?.filter(Boolean)?.length! > 0
                      ? itemData?.milestones?.reduce(
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
                Milestone Rewards
              </div>

              <div className="relative w-fit h-fit justify-start items-center gap-4 flex flex-row flex-wrap">
                {itemData?.milestones[purchaseDetails?.imageIndex - 1]?.rewards
                  ?.flat()
                  ?.map((reward: Reward, index: number) => {
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
                              {`${Number(reward?.amount) / 10 ** 18} ${
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
                              dispatch(
                                setImageViewer({
                                  actionValue: true,
                                  actionImage: `${INFURA_GATEWAY}/ipfs/${
                                    reward?.rewardMetadata?.mediaCover &&
                                    reward?.rewardMetadata?.mediaCover !== ""
                                      ? reward?.rewardMetadata?.mediaCover?.split(
                                          "ipfs://"
                                        )?.[1]
                                      : reward?.rewardMetadata?.images?.[0]?.split(
                                          "ipfs://"
                                        )?.[1]
                                  }`,
                                  actionType: "png",
                                })
                              )
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
              itemData?.players?.some(
                (item) => item?.profile?.id == lensConnected?.id
              ) ||
              !itemData?.status
                ? "opacity-70"
                : "cursor-pointer active:scale-95"
            }`}
            onClick={() =>
              !joinLoading &&
              !itemData?.players?.some(
                (item) => item?.profile?.id == lensConnected?.id
              ) &&
              itemData?.status &&
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
              {itemData?.players
                ?.find((item) => item?.profile?.id == lensConnected?.id)
                ?.questsCompleted?.includes(itemData?.questId)
                ? "Quest Completed"
                : itemData?.players?.some(
                    (item) => item?.profile?.id == lensConnected?.id
                  )
                ? "Quest Joined"
                : !itemData?.status
                ? "Quest Closed"
                : "Join Quest"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kinora;
