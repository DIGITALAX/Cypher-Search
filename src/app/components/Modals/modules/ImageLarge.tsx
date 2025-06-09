import handleImageError from "@/app/lib/helpers/handleImageError";
import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";

const ImageLarge: FunctionComponent = (): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="inset-0 justify-center fixed z-30 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div
        className="relative w-screen h-full col-start-1 justify-self-center grid grid-flow-col auto-cols-auto self-start cursor-pointer"
        onClick={() => context?.setImageViewer(undefined)}
      >
        <div className="relative w-full h-full flex py-8 flex items-center justify-center">
          <div className="relative w-5/6 sm:w-4/5 h-4/5 justify-center flex items-center">
            <div className="relative w-full h-full row-start-1 grid grid-flow-col auto-cols-auto px-4">
              {!context?.imageViewer?.type?.includes("video") ? (
                <Image
                  src={context?.imageViewer?.image!}
                  onError={(e) => handleImageError(e)}
                  layout="fill"
                  objectFit="contain"
                  draggable={false}
                />
              ) : (
                <video
                  className="rounded-md absolute w-full h-full object-contain"
                  draggable={false}
                  controls={false}
                  playsInline
                  loop
                >
                  <source src={context?.imageViewer?.image!} type="video/mp4" />
                </video>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageLarge;
