import Image from "next/legacy/image";
import { FormEvent, FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { AiOutlineLoading } from "react-icons/ai";
import { formatTime } from "../../../../lib/helpers/formatTime";
import { setVideoSync } from "../../../../redux/reducers/videoSyncSlice";
import { ControlsProps } from "../types/tiles.types";
import { setFullScreenVideo } from "../../../../redux/reducers/fullScreenVideoSlice";

const Controls: FunctionComponent<ControlsProps> = ({
  dispatch,
  handleSeek,
  videoSync,
  handleHeart,
  likeVideo,
  likeLoading,
  liked,
  authStatus,
  profileId,
  commentLoading,
  commentVideo,
  likeAmount,
  progressRef,
  commentAmount,
  mirrored,
  mirrorVideo,
  mirrorLoading,
  volumeOpen,
  setVolumeOpen,
  volume,
  mirrorAmount,
  handleVolumeChange,
  currentIndex,
}): JSX.Element => {
  return (
    <div
      className={`relative h-fit flex w-full gap-3 items-center galaxy:px-2 justify-center flex-col md:flex-row`}
    >
      <div
        className={`relative w-fit h-full flex justify-center items-center gap-3`}
      >
        <div className="relative flex flex-row w-fit h-fit items-center">
          <div
            className="relative w-4 h-4 cursor-pointer flex"
            onClick={() => dispatch(setFullScreenVideo(true))}
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
            {formatTime(videoSync?.currentTime)}
          </span>
          /<span className="text-light">{formatTime(videoSync?.duration)}</span>
        </div>
      </div>
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div
          className="relative w-full h-2 bg-white/40 rounded-sm cursor-pointer"
          ref={progressRef}
          onClick={(e: any) => handleSeek(e)}
        >
          <div
            className="absolute h-full bg-white/80 rounded-sm"
            style={{
              width: `${(videoSync?.currentTime / videoSync?.duration) * 100}%`,
            }}
          />
        </div>
      </div>
      <div
        className={`relative w-fit flex flex-row gap-2 items-center justify-center md:justify-end`}
      >
        <div className="relative flex flex-row w-fit h-fit items-center justify-center">
          <div
            className={`cursor-pointer relative w-fit h-fit ${
              likeLoading && "animate-spin"
            }`}
            onClick={
              profileId && authStatus
                ? () => {
                    handleHeart();
                    likeVideo();
                  }
                : () => handleHeart()
            }
          >
            {likeLoading ? (
              <AiOutlineLoading size={12} color="white" />
            ) : liked ? (
              <div className="relative w-3 h-3 flex items-center justify-center">
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
          <div className="relative w-fit h-fit font-earl text-white text-xs">
            {likeAmount?.[currentIndex]}
          </div>
        </div>
        <div className="relative flex flex-row w-fit h-fit items-center justify-center">
          <div
            className={`${
              profileId && authStatus && "cursor-pointer"
            } relative w-fit ${commentLoading && "animate-spin"}`}
            onClick={() => commentVideo()}
          >
            {commentLoading ? (
              <AiOutlineLoading size={12} color="white" />
            ) : (
              <div className="relative w-3 h-3 flex items-center justify-center">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmRGf1cz8h9bdw9VKp9zYXZoDfy15nRA1fKc7ARhxnRPwr`}
                  layout="fill"
                  alt="collect"
                  draggable={false}
                />
              </div>
            )}
          </div>
          <div className="relative w-fit h-fit font-earl text-white text-xs">
            {commentAmount?.[currentIndex]}
          </div>
        </div>
        <div className="relative flex flex-row w-fit h-fit items-center justify-center">
          <div
            className={`${
              profileId && authStatus && "cursor-pointer"
            } relative w-fit ${mirrorLoading && "animate-spin"}`}
            onClick={() => mirrorVideo()}
          >
            {mirrorLoading ? (
              <AiOutlineLoading size={12} color="white" />
            ) : mirrored ? (
              <div className="relative w-3 h-3 flex items-center justify-center">
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
          <div className="relative w-fit h-fit font-earl text-white text-xs">
            {mirrorAmount?.[currentIndex]}
          </div>
        </div>
        <div
          className="relative cursor-pointer w-3 h-3 flex items-center justify-center"
          onClick={() =>
            dispatch(
              setVideoSync({
                actionHeart: videoSync?.heart,
                actionDuration: videoSync?.duration,
                actionCurrentTime: videoSync?.currentTime,
                actionIsPlaying: videoSync?.isPlaying ? false : true,
                actionLikedArray: videoSync?.likedArray,
                actionMirroredArray: videoSync?.mirroredArray,
                actionCollectedArray: videoSync?.collectedArray,
                actionVideosLoading: videoSync?.videosLoading,
              })
            )
          }
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${
              videoSync?.isPlaying
                ? "Qmbg8t4xoNywhtCexD5Ln5YWvcKMXGahfwyK6UHpR3nBip"
                : "QmXw52mJFnzYXmoK8eExoHKv7YW9RBVEwSFtfvxXgy7sfp"
            }`}
            draggable={false}
            layout="fill"
          />
        </div>

        <div
          className="relative cursor-pointer w-3 h-3 flex items-center justify-center"
          onClick={() => setVolumeOpen(!volumeOpen)}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${
              volume === 0
                ? "QmVVzvq68RwGZFi46yKEthuG6PXQf74BaMW4yCrZCkgtzK"
                : "Qme1i88Yd1x4SJfgrSCFyXp7GELCZRnnPQeFUt6jbfPbqL"
            }`}
            layout="fill"
            alt="volume"
            draggable={false}
          />
        </div>
        {volumeOpen && (
          <input
            className="absolute w-40 h-fit bottom-10"
            type="range"
            value={volume}
            max={1}
            min={0}
            step={0.1}
            onChange={(e: FormEvent) => handleVolumeChange(e)}
          />
        )}
      </div>
    </div>
  );
};

export default Controls;
