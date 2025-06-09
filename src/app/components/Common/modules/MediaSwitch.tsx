import handleImageError from "@/app/lib/helpers/handleImageError";
import Image from "next/legacy/image";
import { FunctionComponent, JSX, useState } from "react";
import Waveform from "./Waveform";
import { MediaSwitchProps } from "../types/common.types";

const MediaSwitch: FunctionComponent<MediaSwitchProps> = ({
  type,
  srcUrl,
  srcCover,
  classNameVideo,
  classNameImage,
  classNameAudio,
  objectFit,
  hidden,
}): JSX.Element => {
  const [videoInfo, setVideoInfo] = useState<{
    loading: boolean;
    currentTime: number;
    duration: number;
    isPlaying: boolean;
  }>({
    loading: false,
    currentTime: 0,
    duration: 0,
    isPlaying: false,
  });
  switch (type?.toLowerCase()) {
    case "video":
      return (
        <>
          <div id={srcUrl} style={classNameVideo}>
            {/* <KinoraPlayerWrapper
              parentId={srcUrl}
              key={srcUrl}
              customControls={true}
              play={videoInfo?.isPlaying}
              styles={classNameVideo}
              fillWidthHeight
              seekTo={{
                id: Math.random() * 0.5,
                time: videoInfo?.currentTime,
              }}
              onTimeUpdate={(e) =>
                setVideoInfo((prev) => ({
                  ...prev,
                  currentTime: (e.target as any)?.currentTime || 0,
                }))
              }
              onCanPlay={(e) =>
                setVideoInfo((prev) => ({
                  ...prev,
                  isPlaying: true,
                  duration: (e.target as any)?.duration || 0,
                }))
              }
              volume={{
                id: Math.random() * 0.5,
                level: hidden ? 0 : 0.5,
              }}
            >
              {(setMediaElement: (node: HTMLVideoElement) => void) => (
                <Player
                  mediaElementRef={setMediaElement}
                  src={
                    srcUrl?.includes("https://")
                      ? srcUrl
                      : `${INFURA_GATEWAY}/ipfs/${
                          srcUrl?.includes("ipfs://")
                            ? srcUrl?.split("ipfs://")[1]
                            : srcUrl
                        }`
                  }
                  poster={srcCover}
                  objectFit="cover"
                  // autoUrlUpload={{
                  //   fallback: true,
                  //   ipfsGateway: INFURA_GATEWAY,
                  // }}
                  loop={hidden}
                  autoPlay={hidden}
                  muted={true}
                />
              )}
            </KinoraPlayerWrapper> */}
          </div>
          {!hidden && (
            <Waveform
              audio={srcUrl}
              type={"video"}
              keyValue={srcUrl}
              video={srcUrl}
              handlePauseVideo={() =>
                setVideoInfo((prev) => {
                  return {
                    ...prev,
                    isPlaying: false,
                  };
                })
              }
              handlePlayVideo={() =>
                setVideoInfo((prev) => {
                  return {
                    ...prev,
                    isPlaying: true,
                  };
                })
              }
              handleSeekVideo={(e) =>
                setVideoInfo((prev) => ({
                  ...prev,
                  currentTime: e,
                }))
              }
              videoInfo={videoInfo}
            />
          )}
        </>
      );

    case "audio":
      const keyValueAudio = srcUrl + Math.random().toString();
      return (
        <>
          <Image
            src={srcCover!}
            layout="fill"
            objectFit={objectFit ? "contain" : "cover"}
            className={classNameAudio}
            draggable={false}
            onError={(e) => handleImageError(e)}
          />
          {!hidden && (
            <Waveform
              audio={srcUrl}
              type={"audio"}
              keyValue={keyValueAudio}
              video={srcUrl}
            />
          )}
        </>
      );

    default:
      return (
        <Image
          src={srcUrl}
          layout="fill"
          objectFit={objectFit ? "contain" : "cover"}
          objectPosition={"center"}
          className={classNameImage}
          draggable={false}
          onError={(e) => handleImageError(e)}
        />
      );
  }
};

export default MediaSwitch;
