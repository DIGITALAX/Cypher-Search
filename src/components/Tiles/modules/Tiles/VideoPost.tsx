import Image from "next/legacy/image";
import { FunctionComponent, RefObject, useRef, useState } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import Controls from "../Controls";
import { VideoPostProps } from "../../types/tiles.types";
import {
  AudioMetadataV3,
  Mirror,
  Post,
  Quote,
  VideoMetadataV3,
} from "../../../../../graphql/generated";
import { metadataMedia } from "../../../../../lib/helpers/postMetadata";
import handleImageError from "../../../../../lib/helpers/handleImageError";

const VideoPost: FunctionComponent<VideoPostProps> = ({
  dispatch,
  layoutAmount,
  router,
  publication,
  mirror,
  like,
  interactionsLoading,
  lensConnected,
  collect,
}): JSX.Element => {
  const videoRef = useRef<null | HTMLVideoElement>(null);
  const [videoInfo, setVideoInfo] = useState<{
    volume: number;
    volumeOpen: boolean;
    heart: boolean;
    isPlaying: boolean;
    duration: number;
    currentTime: number;
  }>({
    volume: 0.5,
    volumeOpen: false,
    heart: false,
    isPlaying: false,
    duration: 0,
    currentTime: 0,
  });

  const media = metadataMedia(
    (
      ((publication?.post as Mirror | Post | Quote)?.__typename === "Mirror"
        ? (publication?.post as Mirror)?.mirrorOn
        : (publication?.post as Post)
      ).metadata as AudioMetadataV3 | VideoMetadataV3
    )?.asset
  );

  const uniqueVideoKey =
    ((publication?.post as Mirror)?.__typename === "Mirror"
      ? (publication?.post as Mirror)?.mirrorOn
      : (publication?.post as Post)
    )?.txHash + (publication?.post as Post)?.by?.id;

  return (
    <div className="relative w-full h-fit flex items-center justify-center flex rounded-sm border border-sol p-4">
      <div className="relative flex flex-col h-fit w-full border border-white">
        <div
          className={`relative w-full flex bg-amo/30 ${
            layoutAmount === 4 ? "h-60" : "h-100"
          }`}
        >
          {videoInfo?.heart && (
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmNPPsBttGAxvu6cX3gWT4cnFF8PMF9C55GgJUehGp3nCA`}
              layout="fill"
              objectFit="cover"
              className="absolute w-full h-full flex object-cover z-1"
              draggable={false}
            />
          )}
          {media?.type == "Audio" ? (
            media?.cover && (
              <Image
                layout="fill"
                objectFit="cover"
                draggable={false}
                src={media?.cover!}
                onError={(e) => handleImageError(e)}
              />
            )
          ) : (
            <video
              key={uniqueVideoKey}
              draggable={false}
              controls={false}
              playsInline
              onPlay={() =>
                setVideoInfo((prev) => ({
                  ...prev,
                  isPlaying: true,
                }))
              }
              onPause={() =>
                setVideoInfo((prev) => ({
                  ...prev,
                  isPlaying: false,
                }))
              }
              onLoadedMetadata={() => {
                setVideoInfo((prev) => ({
                  ...prev,
                  duration: videoRef?.current?.duration || 0,
                }));

                if (videoInfo?.currentTime != 0 && videoRef.current) {
                  videoRef.current.currentTime = videoInfo?.currentTime;
                }
              }}
              onTimeUpdate={() =>
                setVideoInfo((prev) => ({
                  ...prev,
                  currentTime: videoRef?.current?.currentTime || 0,
                }))
              }
              onVolumeChange={() =>
                setVideoInfo((prev) => ({
                  ...prev,
                  volume: videoRef?.current?.volume || 0,
                }))
              }
              className="relative w-full h-full object-cover"
              poster={media?.cover}
              id={uniqueVideoKey}
              ref={videoRef as RefObject<HTMLVideoElement>}
            >
              <source src={media?.url} />
            </video>
          )}
        </div>
        <div className="relative w-full h-fit flex flex-row justify-between p-2">
          <Controls
            dispatch={dispatch}
            videoInfo={videoInfo}
            setVideoInfo={setVideoInfo}
            mirror={mirror}
            like={like}
            collect={collect}
            interactionsLoading={interactionsLoading}
            post={
              (publication?.post as Mirror | Post | Quote)?.__typename ===
              "Mirror"
                ? (publication?.post as Mirror)?.mirrorOn
                : (publication?.post as any)
            }
            router={router}
            connected={lensConnected?.id}
            videoRef={videoRef}
          />
        </div>
        <div className="relative w-full h-fit p-2 bg-white flex flex-row justify-between gap-2 items-center">
          <div className="relative w-20 h-fit text-left font-bit text-mos flex items-center text-xs justify-center break-words">
            {(
              (publication?.post as Post)?.metadata as VideoMetadataV3
            )?.content?.slice(0, 20) + "..."}
          </div>
          <div className="relative w-fit h-fit text-center font-rain text-mos text-sm flex items-start justify-center text-black break-words">
            {((publication?.post as Post)?.metadata as VideoMetadataV3)?.title}
          </div>
          <div className="relative w-fit h-fit items-center justify-center flex">
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
    </div>
  );
};

export default VideoPost;
