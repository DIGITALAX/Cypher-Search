import Image from "next/legacy/image";
import { FunctionComponent, useEffect, useRef } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { AiOutlineLoading } from "react-icons/ai";
import { ControlsProps } from "../types/tiles.types";
import numeral from "numeral";
import { setReactBox } from "../../../../redux/reducers/reactBoxSlice";
import { OpenActionModuleType } from "../../../../graphql/generated";
import formatDuration from "../../../../lib/helpers/formatDuration";

const Controls: FunctionComponent<ControlsProps> = ({
  dispatch,
  videoInfo,
  interactionsLoading,
  mirror,
  like,
  post,
  router,
  connected,
  collect,
  videoRef,
  setVideoInfo,
}): JSX.Element => {
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
            const progressRect = e.currentTarget.getBoundingClientRect();
            const seekFraction =
              (e.clientX - progressRect.left) / progressRect.width;

            const video = videoRef?.current;

            if (video && Number.isFinite(video.duration)) {
              const seekTime = seekFraction * video.duration;
              if (Number.isFinite(seekTime)) {
                video.currentTime = seekTime;
              }
            }
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
              connected && like(post?.id, post?.operations?.hasReacted);
            }}
          >
            {interactionsLoading?.like ? (
              <AiOutlineLoading size={12} color="white" />
            ) : (
              <div
                className={`relative w-3 h-3 flex items-center justify-center ${
                  post?.operations?.hasReacted && "mix-blend-hard-light"
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
              post?.stats?.reactions > 0 && "cursor-pointer active:scale-95"
            }`}
            onClick={() =>
              post?.stats?.reactions > 0 &&
              dispatch(
                setReactBox({
                  actionOpen: true,
                  actionId: post?.id,
                  actionType: "Likes",
                })
              )
            }
          >
            {numeral(post?.stats?.reactions).format("0a")}
          </div>
        </div>
        <div className="relative flex flex-row w-fit h-fit items-center justify-center gap-1">
          <div
            className={`${
              connected &&
              (post?.openActionModules?.[0]?.type ===
                OpenActionModuleType?.LegacyFeeCollectModule ||
                post?.openActionModules?.[0]?.type ===
                  OpenActionModuleType?.LegacySimpleCollectModule ||
                post?.openActionModules?.[0]?.type ===
                  OpenActionModuleType?.SimpleCollectOpenActionModule) &&
              "cursor-pointer"
            } relative w-fit ${
              interactionsLoading?.simpleCollect && "animate-spin"
            }`}
            onClick={() =>
              connected &&
              (post?.openActionModules?.[0]?.type ===
                OpenActionModuleType?.LegacyFeeCollectModule ||
                post?.openActionModules?.[0]?.type ===
                  OpenActionModuleType?.LegacySimpleCollectModule ||
                post?.openActionModules?.[0]?.type ===
                  OpenActionModuleType?.SimpleCollectOpenActionModule) &&
              collect(post?.id, post?.openActionModules?.[0]?.type)
            }
          >
            {interactionsLoading?.simpleCollect ? (
              <AiOutlineLoading size={12} color="white" />
            ) : (
              <div
                className={`relative w-3 h-3 flex items-center justify-center ${
                  post?.operations?.hasActed?.value && "mix-blend-hard-light"
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
            onClick={() => router.push(`/item/pub/${post?.id}`)}
          >
            {numeral(post?.stats?.comments).format("0a")}
          </div>
        </div>
        <div className="relative flex flex-row w-fit h-fit items-center justify-center gap-1">
          <div
            className={`${connected && "cursor-pointer"} relative w-fit ${
              interactionsLoading?.mirror && "animate-spin"
            }`}
            onClick={() => connected && mirror(post?.id)}
          >
            {interactionsLoading?.mirror ? (
              <AiOutlineLoading size={12} color="white" />
            ) : (
              <div
                className={`relative w-3 h-3 flex items-center justify-center ${
                  (post?.operations?.hasMirrored ||
                    post?.operations?.hasQuoted) &&
                  "mix-blend-hard-light"
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
              post?.stats?.mirrors > 0 && "cursor-pointer active:scale-95"
            }`}
            onClick={() =>
              post?.stats?.mirrors > 0 &&
              dispatch(
                setReactBox({
                  actionOpen: true,
                  actionId: post?.id,
                  actionType: "Mirrors",
                })
              )
            }
          >
            {numeral(post?.stats?.mirrors).format("0a")}
          </div>
        </div>
        <div
          className={`relative cursor-pointer w-3 h-3 flex items-center justify-center ${
            videoInfo?.loading && "animate-spin"
          }`}
          onClick={() => {
            const video = videoRef?.current;
            if (video && video.readyState >= 3) {
              const currentTime = videoRef.current?.currentTime || 0;
              video.pause();
              setVideoInfo((prev) => ({
                ...prev,
                isPlaying: false,
                currentTime,
                isActive: false,
              }));
            } else {
              setVideoInfo((prev) => ({
                ...prev,
                isActive: true,
                loading: true,
              }));
            }
          }}
        >
          {videoInfo?.loading ? (
            <AiOutlineLoading color={"white"} size={12} />
          ) : (
            <Image
              src={`${INFURA_GATEWAY}/ipfs/${
                videoInfo?.isActive || videoInfo?.isPlaying
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
            onChange={(e) => {
              const video = videoRef?.current;
              const newVolume = parseFloat(e.target.value);
              if (Number.isFinite(newVolume) && video) {
                video.volume = newVolume;
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Controls;
