import Image from "next/legacy/image";
import { FunctionComponent, RefObject, useRef, useState } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import Controls from "../Controls";
import { VideoPostProps } from "../../types/tiles.types";
import dynamic from "next/dynamic";
import { Player } from "@livepeer/react";
import {
  AudioMetadataV3,
  Mirror,
  Post,
  Quote,
  VideoMetadataV3,
} from "../../../../../graphql/generated";
import { metadataMedia } from "../../../../../lib/helpers/postMetadata";
import handleImageError from "../../../../../lib/helpers/handleImageError";

const KinoraPlayerWrapper = dynamic(
  () => import("kinora-sdk").then((mod) => mod.KinoraPlayerWrapper),
  { ssr: false }
);

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
    isActive: boolean;
    loading: boolean;
  }>({
    volume: 0.5,
    volumeOpen: false,
    heart: false,
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    isActive: false,
    loading: false,
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
          } ${videoInfo?.loading && "opacity-50"}`}
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
            <>
              <Image
                layout="fill"
                objectFit="cover"
                draggable={false}
                src={media?.cover!}
                onError={(e) => handleImageError(e)}
              />
              {videoInfo?.isActive && (
                <audio
                  key={uniqueVideoKey}
                  draggable={false}
                  controls={false}
                  playsInline
                  autoPlay
                  onPlay={() =>
                    setVideoInfo((prev) => ({
                      ...prev,
                      isPlaying: true,
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
                      loading: false,
                    }))
                  }
                  onVolumeChange={() =>
                    setVideoInfo((prev) => ({
                      ...prev,
                      volume: videoRef?.current?.volume || 0,
                    }))
                  }
                  hidden
                  id={uniqueVideoKey}
                  ref={videoRef as RefObject<HTMLVideoElement>}
                >
                  <source
                    src={
                      media?.url?.includes("/ipfs/")
                        ? media?.url?.split("/ipfs/")?.[1]
                        : media?.url
                    }
                  />
                </audio>
              )}
            </>
          ) : videoInfo?.isActive ? (
            <div
              id={uniqueVideoKey}
              className="w-full h-full object-cover flex"
            >
              <KinoraPlayerWrapper
                parentId={uniqueVideoKey}
                key={uniqueVideoKey}
                customControls={true}
                // controls={false}
                // playsInline
                // autoPlay
                fillWidthHeight
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
                    isActive: false,
                  }))
                }
                onLoadedMetadata={(e) => {
                  setVideoInfo((prev) => ({
                    ...prev,
                    duration: (e.target as any)?.duration || 0,
                  }));

                  if (videoInfo?.currentTime != 0 && e.target) {
                    (e.target as any).currentTime = videoInfo?.currentTime;
                  }
                }}
                onTimeUpdate={(e) =>
                  setVideoInfo((prev) => ({
                    ...prev,
                    currentTime: (e.target as any)?.currentTime || 0,
                    loading: false,
                  }))
                }
                onVolumeChange={(e) =>
                  setVideoInfo((prev) => ({
                    ...prev,
                    volume: (e.target as any)?.volume || 0,
                  }))
                }

                // id={uniqueVideoKey}
                // ref={videoRef as RefObject<HTMLVideoElement>}
              >
                {(setMediaElement: (node: HTMLVideoElement) => void) => (
                  <Player
                    mediaElementRef={setMediaElement}
                    src={
                      "https://thedial.infura-ipfs.io/ipfs/bafybeigtrokn3qww2qjuuuu6l3wjy2uex3xs2wpq4uykn4ait5opn2n3cq"
                      // media?.url?.includes("/ipfs/")
                      //   ? 
                        // "ipfs://" + media?.url?.split("/ipfs/")?.[1]
                        // : media?.url
                    }
                    // poster={media?.cover}
                    objectFit="cover"
                    autoUrlUpload={{
                      fallback: true,
                      ipfsGateway: INFURA_GATEWAY,
                    }}
                  />
                )}
              </KinoraPlayerWrapper>
            </div>
          ) : (
            <Image
              layout="fill"
              objectFit="cover"
              draggable={false}
              src={media?.cover!}
              onError={(e) => handleImageError(e)}
            />
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
          <div className="relative w-20 h-fit text-left font-bit text-mos flex items-center text-xs justify-center break-all">
            {(
              (publication?.post as Post)?.metadata as VideoMetadataV3
            )?.content?.slice(0, 20) + "..."}
          </div>
          <div className="relative w-fit h-fit text-center font-rain text-mos text-sm flex items-start justify-center text-black break-all">
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
