import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext, useEffect, useRef } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import numeral from "numeral";
import formatDuration from "@/app/lib/helpers/formatDuration";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { useRouter } from "next/navigation";
import { ControlsProps } from "../types/tiles.types";
import { ModalContext } from "@/app/providers";

const Controls: FunctionComponent<ControlsProps> = ({
  videoInfo,
  setVideoInfo,
  post,
  interactionsLoading,
  interactions,
  collect,
  mirror,
  like,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`relative h-fit flex w-full gap-3 items-center galaxy:px-2 justify-center flex-col md:flex-row flex-wrap`}
    >
      <div className={`relative w-fit h-full flex justify-center items-center`}>
        <div className="relative w-fit h-full flex items-center font-digi text-sm text-white">
          <span className="text-rosa">
            {formatDuration(videoInfo?.currentTime || 0)}
          </span>
          /
          <span className="text-light">
            {formatDuration(videoInfo?.duration || 0)}
          </span>
        </div>
      </div>
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div
          className="relative w-full h-2 bg-white/40 rounded-sm cursor-pointer"
          // ref={progressRef}
          onClick={(e) => {
            const progressRect = (
              e as any
            ).currentTarget.getBoundingClientRect();
            const seekPosition =
              ((e as any).clientX - progressRect.left) / progressRect.width;
            setVideoInfo((prev) => ({
              ...prev,
              seeked: seekPosition * videoInfo?.duration,
              id: Math.random(),
            }));
          }}
        >
          <div
            className="absolute h-full bg-white/80 rounded-sm"
            style={{
              width: `${
                ((videoInfo?.currentTime || 0) / (videoInfo?.duration || 0)) *
                100
              }%`,
            }}
          />
        </div>
      </div>
      <div
        className={`relative w-fit flex flex-row gap-3 items-center justify-center md:justify-end`}
      >
        <div className="relative flex flex-row w-fit h-fit items-center justify-center gap-1">
          <div
            className={`cursor-pointer relative w-fit h-fit ${
              interactionsLoading?.like && "animate-spin"
            }`}
            onClick={() => {
              setVideoInfo((prev) => ({
                ...prev,
                heart: true,
              }));
              timeoutIdRef.current = setTimeout(() => {
                setVideoInfo((prev) => ({
                  ...prev,
                  heart: false,
                }));
              }, 3000);
              context?.lensConectado?.sessionClient && like();
            }}
          >
            {interactionsLoading?.like ? (
              <AiOutlineLoading size={12} color="white" />
            ) : (
              <div
                className={`relative w-3 h-3 flex items-center justify-center ${
                  interactions?.hasReacted &&
                  "mix-blend-hard-light hue-rotate-60"
                }`}
              >
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmSX1Y5cKp8p53jv2CnfQBuhu3dgLANjZMTyAMKtgFtvV6`}
                  layout="fill"
                  alt="heart"
                  draggable={false}
                />
              </div>
            )}
          </div>
          <div
            className={`relative w-fit h-fit font-earl text-white text-xs ${
              interactions?.reactions > 0 && "cursor-pointer active:scale-95"
            }`}
            onClick={() =>
              interactions?.reactions > 0 &&
              context?.setReactBox({
                id: post?.id,
                type: "Likes",
              })
            }
          >
            {numeral(interactions?.reactions).format("0a")}
          </div>
        </div>
        <div className="relative flex flex-row w-fit h-fit items-center justify-center gap-1">
          <div
            className={`${
              context?.lensConectado?.sessionClient &&
              post?.actions?.[0]?.__typename === "SimpleCollectAction" &&
              "cursor-pointer"
            } relative w-fit ${interactionsLoading?.collect && "animate-spin"}`}
            onClick={() =>
              context?.lensConectado?.sessionClient &&
              post?.actions?.[0]?.__typename === "SimpleCollectAction" &&
              collect()
            }
          >
            {interactionsLoading?.collect ? (
              <AiOutlineLoading size={12} color="white" />
            ) : (
              <div
                className={`relative w-3 h-3 flex items-center justify-center ${
                  interactions?.hasCollected &&
                  "mix-blend-hard-light hue-rotate-60"
                }`}
              >
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmRGf1cz8h9bdw9VKp9zYXZoDfy15nRA1fKc7ARhxnRPwr`}
                  layout="fill"
                  alt="collect"
                  draggable={false}
                />
              </div>
            )}
          </div>
          <div
            className={`relative w-fit h-fit font-earl text-white text-xs cursor-pointer active:scale-95`}
            onClick={() => {
              context?.setFiltersOpen({ value: false, allow: false });
              router.push(`/item/pub/${post?.id}`);
            }}
          >
            {numeral(interactions?.comments).format("0a")}
          </div>
        </div>
        <div className="relative flex flex-row w-fit h-fit items-center justify-center gap-1">
          <div
            className={`${
              context?.lensConectado?.sessionClient && "cursor-pointer"
            } relative w-fit ${interactionsLoading?.mirror && "animate-spin"}`}
            onClick={() => context?.lensConectado?.sessionClient && mirror()}
          >
            {interactionsLoading?.mirror ? (
              <AiOutlineLoading size={12} color="white" />
            ) : (
              <div
                className={`relative w-3 h-3 flex items-center justify-center ${
                  (interactions?.hasMirrored || interactions?.hasQuoted) &&
                  "mix-blend-hard-light hue-rotate-60"
                }`}
              >
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmXZi8e6UQaXm3BMMdsAUTnxoQSEr97nvuc19v7kBAgFsY`}
                  layout="fill"
                  alt="mirror"
                  draggable={false}
                />
              </div>
            )}
          </div>
          <div
            className={`relative w-fit h-fit font-earl text-white text-xs ${
              (interactions?.mirrors > 0 || interactions?.quotes > 0) &&
              "cursor-pointer active:scale-95"
            }`}
            onClick={() =>
              (interactions?.mirrors > 0 || interactions?.quotes > 0) &&
              context?.setReactBox({
                id: post?.id,
                type: "Mirrors",
              })
            }
          >
            {numeral(interactions?.mirrors + interactions?.quotes).format("0a")}
          </div>
        </div>
        <div
          className={`relative cursor-pointer w-3 h-3 flex items-center justify-center ${
            videoInfo?.loading && "animate-spin"
          }`}
          onClick={() => {
            setVideoInfo((prev) => ({
              ...prev,
              loading: !prev?.isPlaying,
              isPlaying: !prev?.isPlaying,
            }));
          }}
        >
          {videoInfo?.loading ? (
            <AiOutlineLoading color={"white"} size={12} />
          ) : (
            <Image
              src={`${INFURA_GATEWAY}/ipfs/${
                videoInfo?.isPlaying
                  ? "Qmbg8t4xoNywhtCexD5Ln5YWvcKMXGahfwyK6UHpR3nBip"
                  : "QmXw52mJFnzYXmoK8eExoHKv7YW9RBVEwSFtfvxXgy7sfp"
              }`}
              draggable={false}
              layout="fill"
            />
          )}
        </div>
        <div
          className="relative cursor-pointer w-3 h-3 flex items-center justify-center"
          onClick={() =>
            setVideoInfo((prev) => ({
              ...prev,
              volumeOpen: !prev.volumeOpen,
            }))
          }
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${
              videoInfo?.volume === 0
                ? "QmVVzvq68RwGZFi46yKEthuG6PXQf74BaMW4yCrZCkgtzK"
                : "Qme1i88Yd1x4SJfgrSCFyXp7GELCZRnnPQeFUt6jbfPbqL"
            }`}
            layout="fill"
            alt="volume"
            draggable={false}
          />
        </div>
        {videoInfo?.volumeOpen && (
          <input
            className="absolute w-40 h-fit bottom-10"
            type="range"
            max={1}
            min={0}
            step={0.01}
            value={videoInfo?.volume}
            onChange={(e) =>
              setVideoInfo((prev) => ({
                ...prev,
                volume: Number(e.target.value),
              }))
            }
          />
        )}
      </div>
    </div>
  );
};

export default Controls;
