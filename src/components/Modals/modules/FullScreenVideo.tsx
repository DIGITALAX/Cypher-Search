import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import Draggable from "react-draggable";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { setFullScreenVideo } from "../../../../redux/reducers/fullScreenVideoSlice";
import { FullScreenVideoProps } from "../types/modals.types";

const FullScreenVideo: FunctionComponent<FullScreenVideoProps> = ({
  dispatch,
  fullScreenVideo,
  videoRef,
}): JSX.Element => {
  return (
    <Draggable
      cancel=".close"
      enableUserSelectHack={false}
      nodeRef={videoRef as any}
    >
      <div
        className={
          "fixed z-20 w-3/5 xl:w-1/3 preG:w-1/2 w-40 h-52 preG:h-60 sm:h-72 md:h-96 p-2 sm:px-8 sm:pb-8 sm:pt-4 cursor-grab active:cursor-grabbing items-center justify-center border-4 border-black rounded-lg top-40 left-0 sm:left-10 flex flex-col"
        }
        ref={videoRef as any}
        id="videoplayer"
      >
        <div className="relative w-full h-fit flex flex-row items-center">
          <div className="relative w-fit h-fit justify-start row-start-1 col-start-1 pb-2">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/Qmf6evtDntW5NPNp5vcGRpyG2LgK6qg5ndJ3kw7cNy4BuK`}
              width={25}
              height={25}
              draggable={false}
            />
          </div>
          <div
            className="close"
            onClick={() =>
              dispatch(
                setFullScreenVideo({
                  actionTime: fullScreenVideo?.currentTime,
                  actionDuration: fullScreenVideo?.duration,
                  actionIsPlaying: fullScreenVideo?.isPlaying,
                })
              )
            }
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmRtXzfqbJXXZ6fReUihpauh9nz6pmjUv5CKGm3oXquzh4`}
              // layout="fill"
              width={25}
              height={25}
              draggable={false}
            />
          </div>
        </div>
        <div className="relative w-full h-full justify-self-end row-start-2 border border-offBlue col-start-1 rounded-md bg-black"></div>
      </div>
    </Draggable>
  );
};

export default FullScreenVideo;
