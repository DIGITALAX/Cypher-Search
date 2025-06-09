import Image from "next/legacy/image";
import {
  FunctionComponent,
  JSX,
  RefObject,
  useContext,
  useRef,
  useState,
} from "react";
import { VideoPostProps } from "../types/tiles.types";
import { ModalContext } from "@/app/providers";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { useRouter } from "next/navigation";
import { VideoMetadata } from "@lens-protocol/client";
import useVideo from "../hooks/useVideo";
import Controls from "./Controls";

const VideoPost: FunctionComponent<VideoPostProps> = ({
  dict,
  publication,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const router = useRouter();
  const {
    mediaData,
    videoInfo,
    videoRef,
    setVideoInfo,
    interactionsLoading,
    interactions,
    collect,
    mirror,
    like,
  } = useVideo(
    dict,
    publication?.__typename == "Repost" ? publication?.repostOf : publication
  );

  return (
    <div className="relative w-full h-fit flex items-center justify-center flex rounded-sm border border-sol p-4">
      <div className="relative flex flex-col h-fit w-full border border-white">
        <div
          className={`relative w-full flex bg-amo/30 ${
            context?.layoutSwitch === 4 ? "h-60" : "h-100"
          } ${videoInfo?.isPlaying && "opacity-50"}`}
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
          {mediaData?.type == "Audio" ? (
            <>
              <Image
                layout="fill"
                objectFit="cover"
                draggable={false}
                src={mediaData?.cover!}
                onError={(e) => handleImageError(e)}
              />
              {videoInfo?.isPlaying && (
                <audio
                  key={publication?.id}
                  draggable={false}
                  controls={false}
                  playsInline
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
                  id={publication?.id}
                  ref={videoRef as RefObject<HTMLVideoElement>}
                >
                  <source src={mediaData?.url} />
                </audio>
              )}
            </>
          ) : mediaData?.type == "Video" ? (
            <div
              id={publication?.id}
              className="w-full h-full object-cover flex"
            >
              <video
                key={publication?.id}
                draggable={false}
                controls={false}
                playsInline
                className="object-cover w-full h-full flex"
                poster={mediaData?.cover}
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
                id={publication?.id}
                ref={videoRef as RefObject<HTMLVideoElement>}
              >
                <source src={mediaData?.url} />
              </video>
            </div>
          ) : (
            <Image
              layout="fill"
              objectFit="cover"
              className="relative w-full flex"
              draggable={false}
              src={mediaData?.cover!}
              onError={(e) => handleImageError(e)}
            />
          )}
        </div>
        <div className="relative w-full h-fit flex flex-row justify-between p-2">
          <Controls
            interactionsLoading={interactionsLoading}
            interactions={interactions}
            collect={collect}
            mirror={mirror}
            like={like}
            videoInfo={videoInfo}
            setVideoInfo={setVideoInfo}
            post={
              publication?.__typename == "Repost"
                ? publication?.repostOf
                : publication
            }
          />
        </div>
        <div className="relative w-full h-fit p-2 bg-white flex flex-row justify-between gap-2 items-center">
          <div className="relative w-20 h-fit text-left font-bit text-mos flex items-center text-xs justify-center break-all">
            {(
              (publication?.__typename == "Repost"
                ? publication?.repostOf
                : publication
              )?.metadata as VideoMetadata
            )?.content?.slice(0, 20) + "..."}
          </div>
          <div className="relative w-fit h-fit text-center font-rain text-mos text-sm flex items-start justify-center text-black break-all">
            {
              (
                (publication?.__typename == "Repost"
                  ? publication?.repostOf
                  : publication
                )?.metadata as VideoMetadata
              )?.title
            }
          </div>
          <div className="relative w-fit h-fit items-center justify-center flex">
            <div
              className="relative w-10 h-10 flex items-center justify-center ml-auto cursor-pointer active:scale-95"
              onClick={() => {
                context?.setFiltersOpen({ value: false, allow: false });
                router.push(
                  `/item/pub/${
                    (publication?.__typename == "Repost"
                      ? publication?.repostOf
                      : publication
                    )?.id
                  }`
                );
              }}
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
