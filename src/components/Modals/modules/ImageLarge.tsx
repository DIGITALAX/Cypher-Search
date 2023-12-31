import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY, IPFS_REGEX } from "../../../../lib/constants";
import { setImageViewer } from "../../../../redux/reducers/ImageLargeSlice";
import { ImageLargeProps } from "../types/modals.types";
import handleImageError from "../../../../lib/helpers/handleImageError";
import dynamic from "next/dynamic";


const ImageLarge: FunctionComponent<ImageLargeProps> = ({
  mainImage,
  dispatch,
  type,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-30 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div
        className="relative w-screen h-full col-start-1 justify-self-center grid grid-flow-col auto-cols-auto self-start cursor-pointer"
        onClick={() =>
          dispatch(
            setImageViewer({
              actionValue: false,
              actionImage: "",
              actionType: "",
            })
          )
        }
      >
        <div className="relative w-full h-full flex py-8 flex items-center justify-center">
          <div className="relative w-5/6 sm:w-4/5 h-4/5 justify-center flex items-center">
            <div className="relative w-full h-full row-start-1 grid grid-flow-col auto-cols-auto px-4">
              {!type?.includes("video") ? (
                <Image
                  src={
                    mainImage?.includes("ipfs://") &&
                    IPFS_REGEX.test(mainImage?.split("ipfs://")?.[1])
                      ? `${INFURA_GATEWAY}/ipfs/${
                          mainImage?.split("ipfs://")?.[1]
                        }`
                      : mainImage?.includes("ar://")
                      ? `https://arweave.net/${mainImage
                          ?.split("ar://")?.[1]
                          ?.replace(/"/g, "")
                          ?.trim()}`
                      : mainImage
                  }
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
                  <source
                    src={
                      mainImage?.includes("ipfs://")
                        ? `${INFURA_GATEWAY}/ipfs/${
                            mainImage?.split("ipfs://")?.[1]
                          }`
                        : mainImage?.includes("ar://")
                        ? `https://arweave.net/${mainImage
                            ?.split("ar://")?.[1]
                            ?.replace(/"/g, "")
                            ?.trim()}`
                        : mainImage
                    }
                    type="video/mp4"
                  />
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
