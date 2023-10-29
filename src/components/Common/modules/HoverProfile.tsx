import { FunctionComponent, useRef, useState } from "react";
import { HoverProfileProps } from "../types/common.types";
import { usePopper } from "react-popper";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { ImageSet, NftImage } from "../../../../graphql/generated";
import { AiOutlineLoading } from "react-icons/ai";

const HoverProfile: FunctionComponent<HoverProfileProps> = ({
  followLoading,
  unfollowProfile,
  followProfile,
  publication,
  router,
  index,
}): JSX.Element => {
  const [popperElement, setPopperElement] = useState<HTMLElement | null>();
  const popperRef = useRef<HTMLDivElement>(null);
  const popper = usePopper(popperRef?.current, popperElement, {
    placement: "bottom-start",
  });
  return (
    <div className="absolute w-28 h-fit flex flex-col items-center justify-center p-2 z-20 border border-white rounded-sm bg-black -top-20">
      <div
        style={{
          ...popper?.styles.popper,
          zIndex: 1000,
          borderColor: "white",
          borderRadius: "0.375rem",
          display: "flex",
          position: "relative",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
        {...popper?.attributes.popper}
        ref={(element) => setPopperElement(element)}
        className="relative w-fit h-fit flex items-center justify-center"
      >
        <div className="relative flex flex-col items-center justify-between gap-7">
          <div className="relative flex flex-col gap-2 flex items-center justify-center w-fit h-fit">
            <div
              className="relative flex flex-row w-10 h-10 items-center justify-start rounded-full border border-offWhite cursor-pointer"
              onClick={() => router.push(`/item/quest/${publication?.handle}`)}
            >
              <Image
                layout="fill"
                draggable={false}
                src={`${INFURA_GATEWAY}/ipfs/${
                  publication?.metadata?.picture?.__typename === "ImageSet"
                    ? (
                        publication?.metadata?.picture as ImageSet
                      )?.raw?.uri?.split("ipfs://")[1]
                    : (
                        publication?.metadata?.picture as NftImage
                      )?.image?.raw?.uri?.split("ipfs://")[1]
                }`}
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <div className="relative w-fit h-fit flex flex-col items-center justify-center font-bit text-xxs">
              <div className="relative flex w-fit h-fit break-words items-center justify-center text-pez">
                Emma-Jane
              </div>
              <div className="relative flex w-fit h-fit break-words items-center justify-center text-tee text-white">
                @emmajane1313
              </div>
            </div>
          </div>
          <div className="relative flex flex-row items-center justify-center gap-5">
            <div
              className={`relative w-7 h-7 flex items-center justify-center cursor-pointer active:scale-95 ${
                followLoading[index] && "animate-spin"
              }`}
              onClick={() => followProfile(publication?.id)}
            >
              {followLoading[index] ? (
                <AiOutlineLoading color="white" size={15} />
              ) : (
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmadanZQr9dxDXQFG41d2gZrhbKgVvnVnG64qAzMhXyxmG`}
                  draggable={false}
                />
              )}
            </div>
            <div
              className={`relative w-7 h-7 flex items-center justify-center cursor-pointer active:scale-95`}
              onClick={() => unfollowProfile(publication?.id)}
            >
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/QmSWjjhXh1VAEkNzhfzEojqg1dfSJ69Xf9ezxbKpwTRjZC`}
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoverProfile;
