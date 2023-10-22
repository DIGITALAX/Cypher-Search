import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import Controls from "../Controls";
import { VideoPostProps } from "../../types/tiles.types";

const VideoPost: FunctionComponent<VideoPostProps> = ({
  dispatch,
  handleSeek,
  videoSync,
  handleHeart,
  profileId,
  progressRef,
  volumeOpen,
  setVolumeOpen,
  volume,
  handleVolumeChange,
  layoutAmount,
  router,
  publication,
  mirror,
  like,
  comment,
  quote,
  interactionsLoading,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex items-center justify-center flex rounded-sm border border-sol p-4">
      <div className="relative flex flex-col h-fit w-full border border-white">
        <div
          className={`relative w-full flex bg-amo/30 ${
            layoutAmount === 4 ? "h-60" : "h-100"
          }`}
        >
          {/** switch to livepeer and kinora wrapper */}
          <video>
            <source src={``} />
          </video>
        </div>
        <div className="relative w-full h-fit flex flex-row justify-between p-2">
          <Controls
            dispatch={dispatch}
            handleSeek={handleSeek}
            videoSync={videoSync}
            handleHeart={handleHeart}
            profileId={profileId}
            progressRef={progressRef}
            volumeOpen={volumeOpen}
            setVolumeOpen={setVolumeOpen}
            volume={volume}
            handleVolumeChange={handleVolumeChange}
            mirror={mirror}
            comment={comment}
            like={like}
            quote={quote}
            interactionsLoading={interactionsLoading}
            publication={publication}
          />
        </div>
        <div className="relative w-full h-fit p-2 bg-white flex flex-row justify-between gap-2">
          <div className="relative w-fit h-fit text-left font-bit text-mos flex items-center justify-center break-words"></div>
          <div className="relative w-fit h-fit text-left font-rain text-mos flex items-start justify-center text-black break-words"></div>
          <div
            className="relative w-10 h-10 flex items-center justify-center ml-auto cursor-pointer active:scale-95"
            onClick={() => router.push(`/item/pub/${publication?.id}`)}
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

export default VideoPost;
