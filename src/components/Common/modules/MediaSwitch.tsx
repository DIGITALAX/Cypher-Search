import Waveform from "@/components/Autograph/modules/Screen/Waveform";
import Image from "next/legacy/image";
import { FunctionComponent, useState } from "react";
import { MediaProps } from "../types/common.types";
import handleImageError from "../../../../lib/helpers/handleImageError";
import { Player } from "@livepeer/react";
import { INFURA_GATEWAY } from "kinora-sdk/src/constants";
import { KinoraPlayerWrapper } from "kinora-sdk";

const MediaSwitch: FunctionComponent<MediaProps> = ({
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
    play: boolean;
    currentTime: number;
    duration: number;
  }>({
    play: false,
    currentTime: 0,
    duration: 0,
  });
  switch (type?.toLowerCase()) {
    case "video":
      const keyValueVideo = srcUrl + Math.random().toString();
      return (
        <>
          <div id={keyValueVideo} className={classNameVideo}>
            <KinoraPlayerWrapper
              parentId={keyValueVideo}
              key={keyValueVideo}
              customControls={true}
              play={videoInfo?.play}
              fillWidthHeight
              seekTo={{
                id: Math.random() * 0.5,
                time: videoInfo?.currentTime,
              }}
              onTimeUpdate={(e) =>
                !hidden &&
                setVideoInfo((prev) => ({
                  ...prev,
                  currentTime: (e.target as any)?.currentTime || 0,
                }))
              }
              onError={(event) => {
                console.error("Error en la reproducción del video:", event);
              }}
            >
              {(setMediaElement: (node: HTMLVideoElement) => void) => (
                <Player
                  mediaElementRef={setMediaElement}
                  src={srcUrl}
                  poster={srcCover}
                  showLoadingSpinner
                  objectFit="cover"
                  autoUrlUpload={{
                    fallback: true,
                    ipfsGateway: INFURA_GATEWAY,
                  }}
                  loop={hidden}
                  autoPlay={hidden}
                  muted={hidden}
                />
              )}
            </KinoraPlayerWrapper>
          </div>
          {!hidden && (
            <Waveform
              audio={srcUrl}
              type={"video"}
              keyValue={keyValueVideo}
              video={srcUrl}
              handlePauseVideo={() =>
                setVideoInfo((prev) => ({
                  ...prev,
                  play: false,
                }))
              }
              handlePlayVideo={() => {
                setVideoInfo((prev) => ({
                  ...prev,
                  play: true,
                }));
              }}
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
