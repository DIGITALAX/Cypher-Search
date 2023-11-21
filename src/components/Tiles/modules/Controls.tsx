import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { AiOutlineLoading } from "react-icons/ai";
import { ControlsProps } from "../types/tiles.types";
import { setFullScreenVideo } from "../../../../redux/reducers/fullScreenVideoSlice";
import formatTime from "../../../../lib/helpers/formatTime";
import numeral from "numeral";
import { setReactBox } from "../../../../redux/reducers/reactBoxSlice";
import handleSeek from "../../../../lib/helpers/handleSeek";

const Controls: FunctionComponent<ControlsProps> = ({
  dispatch,
  fullScreenVideo,
  profileId,
  volumeOpen,
  setVolumeOpen,
  volume,
  setVolume,
  interactionsLoading,
  mirror,
  like,
  post,
  router,
  index,
  setHeart,
}): JSX.Element => {
  return (
    <div
      className={`relative h-fit flex w-full gap-3 items-center galaxy:px-2 justify-center flex-col md:flex-row flex-wrap`}
    >
      <div
        className={`relative w-fit h-full flex justify-center items-center gap-3`}
      >
        <div className="relative flex flex-row w-fit h-fit items-center">
          <div
            className="relative w-4 h-4 cursor-pointer flex"
            onClick={() =>
              dispatch(
                setFullScreenVideo({
                  actionOpen: true,
                  actionTime: fullScreenVideo?.currentTime,
                  actionDuration: fullScreenVideo?.duration,
                  actionIsPlaying: fullScreenVideo?.isPlaying,
                  actionVideo: post,
                })
              )
            }
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmVpncAteeF7voaGu1ZV5qP63UpZW2xmiCWVftL1QnL5ja`}
              layout="fill"
              className="flex items-center"
              draggable={false}
            />
          </div>
        </div>
        <div className="relative w-fit h-full flex items-center font-digi text-sm text-white">
          <span className="text-rosa">
            {formatTime(fullScreenVideo?.currentTime?.[post?.id]!)}
          </span>
          /
          <span className="text-light">
            {formatTime(fullScreenVideo?.duration?.[post?.id]!)}
          </span>
        </div>
      </div>
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div
          className="relative w-full h-2 bg-white/40 rounded-sm cursor-pointer"
          onClick={(e: any) => handleSeek(e, index, dispatch)}
        >
          <div
            className="absolute h-full bg-white/80 rounded-sm"
            style={{
              width: `${
                (fullScreenVideo?.currentTime?.[post?.id]! /
                  fullScreenVideo?.duration?.[post?.id]!) *
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
              setHeart((prev) => {
                const arr = [...prev];
                arr[index] = true;
                return arr;
              });
              setTimeout(() => {
                setHeart((prev) => {
                  const arr = [...prev];
                  arr[index] = false;
                  return arr;
                });
              }, 3000);
              profileId && like(post?.id, post?.operations?.hasReacted);
            }}
          >
            {interactionsLoading?.like ? (
              <AiOutlineLoading size={12} color="white" />
            ) : post?.operations?.hasReacted ? (
              <div
                className={`relative w-3 h-3 flex items-center justify-center ${
                  post?.operations?.hasReacted && "mix-blend-hard-light"
                }`}
              >
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/Qmc3KCKWRgN8iKwwAPM5pYkAYNeVwWu3moa5RDMDTBV6ZS`}
                  layout="fill"
                  alt="heart"
                  draggable={false}
                />
              </div>
            ) : (
              <div className="relative w-3 h-3 flex items-center justify-center">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmSX1Y5cKp8p53jv2CnfQBuhu3dgLANjZMTyAMKtgFtvV6`}
                  layout="fill"
                  alt="backward"
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
            className={`${profileId && "cursor-pointer"} relative w-fit`}
            onClick={() => router.push(`/item/pub/${post?.id}`)}
          >
            <div className="relative w-3 h-3 flex items-center justify-center">
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmRGf1cz8h9bdw9VKp9zYXZoDfy15nRA1fKc7ARhxnRPwr`}
                layout="fill"
                alt="collect"
                draggable={false}
              />
            </div>
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
            className={`${profileId && "cursor-pointer"} relative w-fit ${
              interactionsLoading?.mirror && "animate-spin"
            }`}
            onClick={() => mirror(post?.id)}
          >
            {interactionsLoading?.mirror ? (
              <AiOutlineLoading size={12} color="white" />
            ) : post?.operations?.hasMirrored ? (
              <div
                className={`relative w-3 h-3 flex items-center justify-center ${
                  (post?.operations?.hasMirrored ||
                    post?.operations?.hasQuoted) &&
                  "mix-blend-hard-light"
                }`}
              >
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmcMNSnbKvUfx3B3iHBd9deZCDf7E4J8W6UtyNer3xoMsB`}
                  layout="fill"
                  alt="mirror"
                  draggable={false}
                />
              </div>
            ) : (
              <div className="relative w-3 h-3 flex items-center justify-center">
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
          className="relative cursor-pointer w-3 h-3 flex items-center justify-center"
          onClick={() =>
            dispatch(
              setFullScreenVideo({
                actionOpen: true,
                actionTime: fullScreenVideo?.currentTime,
                actionDuration: fullScreenVideo?.duration,
                actionIsPlaying: !fullScreenVideo?.isPlaying,
                actionVideo: post,
              })
            )
          }
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${
              fullScreenVideo?.isPlaying
                ? "Qmbg8t4xoNywhtCexD5Ln5YWvcKMXGahfwyK6UHpR3nBip"
                : "QmXw52mJFnzYXmoK8eExoHKv7YW9RBVEwSFtfvxXgy7sfp"
            }`}
            draggable={false}
            layout="fill"
          />
        </div>
        <div
          className="relative cursor-pointer w-3 h-3 flex items-center justify-center"
          onClick={() =>
            setVolumeOpen((prev) => {
              const arr = [...prev];
              arr[index] = !arr[index];
              return arr;
            })
          }
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${
              volume[index] === 0
                ? "QmVVzvq68RwGZFi46yKEthuG6PXQf74BaMW4yCrZCkgtzK"
                : "Qme1i88Yd1x4SJfgrSCFyXp7GELCZRnnPQeFUt6jbfPbqL"
            }`}
            layout="fill"
            alt="volume"
            draggable={false}
          />
        </div>
        {volumeOpen?.[index] && (
          <input
            className="absolute w-40 h-fit bottom-10"
            type="range"
            value={volume[index]}
            max={1}
            min={0}
            step={0.1}
            onChange={(e) =>
              setVolume((prev) => {
                const newArr = [...prev];
                newArr[index] = parseFloat(e.target.value);
                return newArr;
              })
            }
          />
        )}
      </div>
    </div>
  );
};

export default Controls;
