import { FunctionComponent, JSX, useCallback, useRef } from "react";
import { NativeVideoProps } from "../types/common.types";

const NativeVideo: FunctionComponent<NativeVideoProps> = ({
  setMediaElement,
  src,
  poster,
  styles,
  loop,
  autoPlay,
  muted,
}): JSX.Element => {
  const attachedElement = useRef<HTMLVideoElement | null>(null);
  const latestSetMediaElement = useRef<(node: HTMLVideoElement) => void>(
    setMediaElement
  );
  latestSetMediaElement.current = setMediaElement;

  const handleMediaElement = useCallback(
    (node: HTMLVideoElement | null): void => {
      if (node && attachedElement.current !== node) {
        attachedElement.current = node;
        latestSetMediaElement.current(node);
      }
    },
    []
  );

  return (
    <video
      ref={handleMediaElement}
      src={src}
      poster={poster}
      style={{
        objectFit: "cover",
        ...styles,
        width: "100%",
        height: "100%",
      }}
      loop={loop}
      autoPlay={autoPlay}
      muted={muted}
      playsInline
      controls={false}
      draggable={false}
    />
  );
};

export default NativeVideo;
