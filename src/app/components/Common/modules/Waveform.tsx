import { handleImage } from "@/app/lib/helpers/handleImage";
import handlePlayPause from "@/app/lib/helpers/handlePlayPause";
import { FunctionComponent, JSX, useEffect, useRef, useState } from "react";
import { BsCloudUpload } from "react-icons/bs";
import { HiOutlinePlayPause } from "react-icons/hi2";
import WaveSurfer from "wavesurfer.js";
import { WaveFormProps } from "../types/common.types";

const Waveform: FunctionComponent<WaveFormProps> = ({
  keyValue,
  type,
  audio,
  video,
  upload,
  handleMedia,
  handlePlayVideo,
  handlePauseVideo,
  handleSeekVideo,
  videoInfo,
}): JSX.Element => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef<null | WaveSurfer>(null);
  const [waveLoading, setWaveLoading] = useState<boolean>(false);

  useEffect(() => {
    const waver = async () => {
      setWaveLoading(true);
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

        if (!wavesurfer.current) return;

        wavesurfer.current.on("seeking", function (seekProgress) {
          if (type == "video") {
            handleSeekVideo!(seekProgress);
          } else {
            const audioElement = document.getElementById(
              keyValue
            ) as HTMLVideoElement;
            if (audioElement) {
              audioElement.currentTime = seekProgress;
            }
          }
        });

        wavesurfer.current.on("play", function () {
          if (type == "video") {
            handlePlayVideo!();
          } else {
            const audioElement = document.getElementById(
              keyValue
            ) as HTMLVideoElement;
            if (audioElement) {
              audioElement.play();
            }
          }
        });

        wavesurfer.current.on("pause", function () {
          if (type == "video") {
            handlePauseVideo!();
          } else {
            const audioElement = document.getElementById(
              keyValue
            ) as HTMLVideoElement;
            if (audioElement) {
              audioElement.pause();
            }
          }
        });

        try {
          const mediaUrl = handleImage(audio ?? video);
          if (mediaUrl) {
            await wavesurfer.current.load(mediaUrl);
          }
        } catch (error) {
          console.error("Error loading media:", error);
        }
      }
      setWaveLoading(false);
    };

    waver();

    return () => {
      wavesurfer.current?.destroy();
    };
  }, [audio, wavesurfer, video, type, waveformRef]);

  return (
    <div
      className={`absolute right-0 bottom-0 w-full h-10 flex flex-row gap-1.5 items-center justify-between bg-offBlack px-1 border border-white z-1 ${
        waveLoading && "animate-pulse opacity-90"
      }`}
    >
      {!waveLoading && (
        <div
          className={`relative flex w-fit h-fit items-center justify-center flex cursor-pointer active:scale-95 `}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();

            handlePlayPause(
              wavesurfer,
              type,
              videoInfo?.isPlaying!,
              handlePlayVideo!,
              handlePauseVideo!
            );
          }}
        >
          <HiOutlinePlayPause color="white" size={15} />
        </div>
      )}
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
