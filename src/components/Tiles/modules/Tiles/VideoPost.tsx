import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import Controls from "../Controls";
import { VideoPostProps } from "../../types/tiles.types";
import {
  Mirror,
  Post,
  Quote,
  VideoMetadataV3,
} from "../../../../../graphql/generated";

const VideoPost: FunctionComponent<VideoPostProps> = ({
  dispatch,
  fullScreenVideo,
  profileId,
  volumeOpen,
  setVolumeOpen,
  volume,
  setVolume,
  layoutAmount,
  router,
  publication,
  mirror,
  like,
  interactionsLoading,
  index,
  heart,
  setHeart,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex items-center justify-center flex rounded-sm border border-sol p-4">
      <div className="relative flex flex-col h-fit w-full border border-white">
        <div
          className={`relative w-full flex bg-amo/30 ${
            layoutAmount === 4 ? "h-60" : "h-100"
          }`}
        >
          {heart?.[index] && (
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmNPPsBttGAxvu6cX3gWT4cnFF8PMF9C55GgJUehGp3nCA`}
              layout="fill"
              objectFit="cover"
              className="absolute w-full h-full flex object-cover z-1"
              draggable={false}
            />
          )}
          <video
            draggable={false}
            controls={false}
            muted
            // autoPlay
            playsInline
            loop
          >
            <source src={``} />
          </video>
        </div>
        <div className="relative w-full h-fit flex flex-row justify-between p-2">
          <Controls
            dispatch={dispatch}
            fullScreenVideo={fullScreenVideo}
            profileId={profileId}
            volumeOpen={volumeOpen}
            setVolumeOpen={setVolumeOpen}
            volume={volume}
            setVolume={setVolume}
            mirror={mirror}
            index={index}
            like={like}
            setHeart={setHeart}
            interactionsLoading={interactionsLoading}
            post={
              (publication?.post as Mirror | Post | Quote)?.__typename ===
              "Mirror"
                ? (publication?.post as Mirror)?.mirrorOn
                : (publication?.post as any)
            }
            router={router}
          />
        </div>
        <div className="relative w-full h-fit p-2 bg-white flex flex-row justify-between gap-2">
          <div className="relative w-fit h-fit text-left font-bit text-mos flex items-center justify-center break-words">
            {(
              (publication?.post as Post)?.metadata as VideoMetadataV3
            )?.content?.slice(0, 20) + "..."}
          </div>
          <div className="relative w-fit h-fit text-left font-rain text-mos flex items-start justify-center text-black break-words">
            {((publication?.post as Post)?.metadata as VideoMetadataV3)?.title}
          </div>
          <div
            className="relative w-10 h-10 flex items-center justify-center ml-auto cursor-pointer active:scale-95"
            onClick={() =>
              router.push(`/item/pub/${(publication?.post as Post)?.id}`)
            }
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
