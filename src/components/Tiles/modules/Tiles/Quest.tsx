import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { QuestProps } from "../../types/tiles.types";
import handleImageError from "../../../../../lib/helpers/handleImageError";
import createProfilePicture from "../../../../../lib/helpers/createProfilePicture";
import HoverProfile from "@/components/Common/modules/HoverProfile";
import InteractBar from "@/components/Common/modules/InteractBar";

const Quest: FunctionComponent<QuestProps> = ({
  layoutAmount,
  router,
  publication,
  profileHovers,
  setProfileHovers,
  followLoading,
  followProfile,
  unfollowProfile,
  lensConnected,
  dispatch,
  index,
  mirror,
  like,
  interactionsLoading,
  openMirrorChoice,
  setOpenMirrorChoice,
}): JSX.Element => {
  const profilePicture = createProfilePicture(
    publication?.publication?.by?.metadata?.picture
  );
  return (
    <div
      className="relative w-full h-fit flex items-center justify-center flex rounded-sm border border-cost bg-black"
      id={publication?.pubId}
    >
      <div
        className="relative w-full h-fit items-center justify-center flex flex-col p-4 gap-4"
        id="game"
      >
        <InteractBar
          mirror={mirror}
          like={like}
          interactionsLoading={interactionsLoading}
          openMirrorChoice={openMirrorChoice}
          setOpenMirrorChoice={setOpenMirrorChoice}
          index={index}
          publication={publication?.publication}
          simpleCollect={undefined}
          dispatch={dispatch}
          router={router}
          creation
        />
        <div className="relative flex flex-row gap-2 flex-wrap w-full h-fit justify-start">
          <div
            className="relative w-fit h-fit flex items-center justify-center cursor-pointer"
            onClick={() => window.open(`https://kinora.irrevocable.dev/`)}
          >
            <div className="w-4 h-4 relative flex items-center justify-center">
              <Image
                width={60}
                height={60}
                priority
                draggable={false}
                src={`${INFURA_GATEWAY}/ipfs/QmbkoC8UbWJS49X6sxyBNfro8guEokUoT74KvaC6DfdmNg`}
              />
            </div>
          </div>
          <div className="font-bit text-sm text-cost font-bit">
            Kinora Quest
          </div>
        </div>
        <div className="relative w-full h-fit items-center justify-center flex flex-row gap-4">
          <div className="relative p-2 rounded-sm border border-suave w-full h-20 items-center justify-center flex">
            <div className="absolute top-0 left-0 w-full h-full rounded-sm">
              <Image
                className="rounded-sm"
                layout="fill"
                draggable={false}
                src={`${INFURA_GATEWAY}/ipfs/${
                  publication?.questMetadata?.cover?.split("ipfs://")?.[1]
                }`}
                objectFit="cover"
              />
            </div>
          </div>
          <div className="relative flex flex-col w-fit h-fit items-center justify-center gap-4">
            <div
              className="relative flex items-center justify-center w-7 h-7 rounded-full cursor-pointer"
              id="pfp"
              onMouseEnter={() =>
                setProfileHovers((prev) => {
                  const arr = [...prev];
                  arr[index] = true;
                  return arr;
                })
              }
            >
              {profilePicture && (
                <Image
                  layout="fill"
                  src={profilePicture}
                  draggable={false}
                  className="rounded-full"
                  objectFit="cover"
                  onError={(e) => handleImageError(e)}
                />
              )}
            </div>
            <div className="relative flex flex-row gap-2 w-fit h-fit items-center justify-center">
              <div
                className="relative w-8 h-8 flex items-center justify-center cursor-pointer active:scale-95"
                onClick={() =>
                  router.push(`/item/kinora/${publication?.publication?.id}`)
                }
              >
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmZ4v5pzdnCBeyKnS9VrjZiEAbUpAVy8ECArNcpxBt6Tw4`}
                  draggable={false}
                />
              </div>
            </div>
            {profileHovers?.[index] && (
              <HoverProfile
                followLoading={followLoading}
                followProfile={followProfile}
                unfollowProfile={unfollowProfile}
                router={router}
                publication={publication?.publication?.by}
                index={index}
                setProfileHovers={setProfileHovers}
                dispatch={dispatch}
                lensConnected={lensConnected}
                parentId={publication?.pubId}
                feed={false}
                top={"2px"}
                bottom={"auto"}
                left={"auto"}
                right={"2px"}
              />
            )}
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-2 font-vcr text-white text-xxs">
          <div className="relative w-full h-fit flex items-start justify-start flex-col gap-3">
            <div
              className={`relative w-fit h-fit flex items-start justify-start font-vcr text-white text-xl break-words `}
            >
              {publication?.questMetadata?.title?.length > 25
                ? publication?.questMetadata?.title?.slice(0, 15) + "..."
                : publication?.questMetadata?.title}
            </div>
            <div
              className={`relative flex items-start justify-start gap-2 w-full h-fit`}
            >
              <div className="relative w-full flex-1 items-start justify-start font-vcr text-gray-400 text-sm break-words text-overflow-truncate h-[6rem] overflow-y-scroll">
                {publication?.questMetadata?.description?.length > 100
                  ? publication?.questMetadata?.description?.slice(0, 100) +
                    "..."
                  : publication?.questMetadata?.description}
              </div>
            </div>
          </div>
          <div className="relative w-fit h-fit flex">
            <div className="relative w-full h-fit flex flex-row items-center justify-start text-white font-bit text-xs gap-3">
              <div className="relative w-4 h-3.5 flex items-start justify-start ">
                <Image
                  draggable={false}
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmcopbBnP4dJgRKCHJ7TN7nHFt5wpe6w8VBhztaBXGYvft`}
                />
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center">{`Max Player Count: ${
                Number(publication?.maxPlayerCount) ==
                Number(publication?.players?.length)
                  ? "Limit Reached"
                  : `${Number(publication?.players?.length)} / ${Number(
                      publication?.maxPlayerCount
                    )}`
              }`}</div>
            </div>
          </div>
          <div className="relative w-full h-fit flex flex-row items-center justify-start gap-1 break-words">
            <div className="relative w-fit h-fit flex items-center justify-center">
              Milestone Count:
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center text-girasol break-words">
              {publication?.milestoneCount}
            </div>
          </div>
          <div className="relative w-full h-fit flex flex-row items-center justify-start gap-1 break-words">
            <div className="relative w-fit h-fit flex items-center justify-center">
              Video Count:
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center text-girasol break-words">
              {publication?.milestones?.reduce(
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
          <div className="relative w-full h-fit flex flex-row items-center justify-start gap-px break-words">
            <div className="relative w-fit h-fit flex items-center justify-center">
              Reward Mix:
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center text-girasol break-words">
              {(publication?.milestones
                ?.map(
                  (item) =>
                    item?.rewards?.filter((rew) => rew?.type == "0")?.length
                )
                ?.filter(Boolean)?.length! > 0
                ? publication?.milestones?.reduce(
                    (acumulador, valorActual) =>
                      acumulador +
                      Number(
                        valorActual?.rewards?.filter((rew) => rew?.type == "0")
                          ?.length
                      ),
                    0
                  ) + " x ERC20 + "
                : "") +
                (publication?.milestones
                  ?.map(
                    (item) =>
                      item?.rewards?.filter((rew) => rew?.type == "1")?.length
                  )
                  ?.filter(Boolean)?.length! > 0
                  ? publication?.milestones?.reduce(
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
      </div>
    </div>
  );
};

export default Quest;
