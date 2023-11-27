import Waveform from "@/components/Autograph/modules/Screen/Waveform";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { MediaProps } from "../types/common.types";
import handleImageError from "../../../../lib/helpers/handleImageError";

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
  switch (type?.toLowerCase()) {
    case "video":
      return (
        <>
          <video
            draggable={false}
            controls={false}
            playsInline
            id={srcUrl}
            className={classNameVideo}
            poster={srcCover}
            autoPlay={hidden}
            muted={hidden}
            loop={hidden}
          >
            <source src={srcUrl} />
          </video>
          {!hidden && (
            <Waveform
              audio={srcUrl}
              type={"video"}
              keyValue={srcUrl}
              video={srcUrl}
            />
          )}
        </>
      );

    case "audio":
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
              keyValue={srcUrl}
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
