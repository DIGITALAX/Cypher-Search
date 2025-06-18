import Image from "next/legacy/image";
import { FunctionComponent, JSX, useState } from "react";
import { QuestProps } from "../types/tiles.types";
import InteractBar from "./InteractBar";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { useRouter } from "next/navigation";
import HoverProfile from "./HoverProfile";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";

const Quest: FunctionComponent<QuestProps> = ({
  dict,
  publication,
}): JSX.Element => {
  const [profileHover, setProfileHover] = useState<boolean>(false);
  const router = useRouter();
  return (
    <div
      className="relative w-full h-fit flex items-center justify-center flex rounded-sm border border-cost bg-black"
      id={publication?.postId}
    >
      <div
        className="relative w-full h-fit items-center justify-center flex flex-col p-4 gap-4"
        id="game"
      >
        <InteractBar dict={dict} publication={publication?.post!} />
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
          <div className="font-bit text-sm text-cost font-bit">{dict?.kin}</div>
        </div>
        <div className="relative w-full h-fit items-center justify-center flex flex-row gap-4">
          <div className="relative p-2 rounded-sm border border-suave w-full h-20 items-center justify-center flex bg-amo/30">
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
              onMouseEnter={() => setProfileHover(true)}
            >
              <Image
                layout="fill"
                src={handleProfilePicture(
                  publication?.post?.author?.metadata?.picture
                )}
                draggable={false}
                className="rounded-full"
                objectFit="cover"
                onError={(e) => handleImageError(e)}
              />
            </div>
            <div className="relative flex flex-row gap-2 w-fit h-fit items-center justify-center">
              <div
                className="relative w-8 h-8 flex items-center justify-center cursor-pointer active:scale-95"
                onClick={() =>
                  router.push(`/item/kinora/${publication?.post?.id}`)
                }
              >
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmZ4v5pzdnCBeyKnS9VrjZiEAbUpAVy8ECArNcpxBt6Tw4`}
                  draggable={false}
                />
              </div>
            </div>
            {profileHover && (
              <HoverProfile
                dict={dict}
                publication={publication?.post?.author!}
                parentId={publication?.postId}
                top={"2px"}
                bottom={"auto"}
                left={"auto"}
                right={"2px"}
                setProfileHover={setProfileHover}
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
              <div className="relative w-full flex-1 items-start justify-start font-vcr text-gray-400 text-sm break-all text-overflow-truncate h-[6rem] overflow-y-scroll">
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
              {dict?.cont}
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center text-girasol break-words">
              {publication?.milestoneCount}
            </div>
          </div>
          <div className="relative w-full h-fit flex flex-row items-center justify-start gap-1 break-words">
            <div className="relative w-fit h-fit flex items-center justify-center">
              {dict?.contV}
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
              {dict?.rew}
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
