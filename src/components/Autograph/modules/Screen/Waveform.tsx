import { FunctionComponent, useEffect, useRef } from "react";
import { BsCloudUpload } from "react-icons/bs";
import { HiOutlinePlayPause } from "react-icons/hi2";
import WaveSurfer from "wavesurfer.js";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { WaveFormProps } from "../../types/autograph.types";
import handlePlayPause from "../../../../../lib/helpers/handlePlayPause";

const Waveform: FunctionComponent<WaveFormProps> = ({
  keyValue,
  type,
  audio,
  video,
  upload,
  handleMedia,
}): JSX.Element => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef<null | WaveSurfer>(null);

  useEffect(() => {
    if (waveformRef.current) {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }

      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "violet",
        progressColor: "white",
        height: 16,
      });

      wavesurfer.current.on("seeking", function (seekProgress) {
        const videoElement = document.getElementById(
          keyValue
        ) as HTMLVideoElement;
        if (videoElement) {
          videoElement.currentTime = seekProgress;
        }
      });

      wavesurfer.current.on("play", function () {
        const videoElement = document.getElementById(
          keyValue
        ) as HTMLVideoElement;
        if (videoElement) {
          videoElement.play();
        }
      });

      wavesurfer.current.on("pause", function () {
        const videoElement = document.getElementById(
          keyValue
        ) as HTMLVideoElement;
        if (videoElement) {
          videoElement.pause();
        }
      });

      if (audio && audio !== "" && type === "audio") {
        wavesurfer.current.load(
          audio?.includes("ipfs://")
            ? `${INFURA_GATEWAY}/ipfs/${audio?.split("ipfs://")?.[1]}`
            : audio
        );
      } else if (video && video !== "" && type === "video") {
        wavesurfer.current.load(
          video?.includes("ipfs://")
            ? `${INFURA_GATEWAY}/ipfs/${video?.split("ipfs://")?.[1]}`
            : video
        );
      }
    }

    return () => {
      wavesurfer.current?.destroy();
    };
  }, [audio, wavesurfer, video, type, waveformRef]);

  return (
    <div className="absolute right-0 bottom-0 w-full h-10 flex flex-row gap-1.5 items-center justify-between bg-offBlack px-1 border border-white">
      <div
        className="relative flex w-fit h-fit items-center justify-center flex cursor-pointer active:scale-95"
        onClick={(e) => {
          e.stopPropagation();
          handlePlayPause(keyValue, wavesurfer, type);
        }}
      >
        <HiOutlinePlayPause color="white" size={15} />
      </div>
      <div
        className="relative w-full h-fit justify-center items-center cursor-pointer"
        ref={waveformRef}
      />
      {upload && (
        <label className="relative flex justify-end items-end cursor-pointer active:scale-95">
          <BsCloudUpload size={15} />
          <input
            hidden
            type="file"
            accept={"audio/mpeg"}
            multiple={false}
            onChange={(e) => handleMedia!(e)}
          />
        </label>
      )}
    </div>
  );
};

export default Waveform;
