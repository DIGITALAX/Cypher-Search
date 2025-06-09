import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import ReactDOM from "react-dom";
import { HoverProfileProps } from "../types/tiles.types";
import { useRouter } from "next/navigation";
import { ModalContext } from "@/app/providers";
import useHover from "../hooks/useHover";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { INFURA_GATEWAY } from "@/app/lib/constants";

const HoverProfile: FunctionComponent<HoverProfileProps> = ({
  publication,
  setProfileHover,
  parentId,
  bottom,
  right,
  left,
  top,
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const router = useRouter();
  const {
    popper,
    setPopperElement,
    followLoading,
    handleFollow,
    handleUnfollow,
  } = useHover(dict, publication);

  return document.getElementById(parentId) ? (
    ReactDOM.createPortal(
      <div
        className="w-28 h-fit flex flex-col items-center justify-center p-2 z-20 border border-white rounded-sm bg-black"
        onMouseLeave={() => setProfileHover(false)}
        style={{
          ...popper?.styles.popper,
          top,
          left,
          bottom,
          right,
        }}
        {...popper?.attributes.popper}
        ref={(element) => setPopperElement(element)}
      >
        <div className="relative w-fit h-fit flex items-center justify-center">
          <div className="relative flex flex-col items-center justify-between gap-7">
            <div className="relative flex flex-col gap-2 flex items-center justify-center w-fit h-fit">
              <div
                className="relative flex flex-row w-10 h-10 items-center justify-start rounded-full border border-offWhite cursor-pointer"
                id="pfp"
                onClick={() => {
                  context?.setFiltersOpen({ value: false, allow: false });
                  router.push(`/autograph/${publication?.username?.localName}`);
                }}
              >
                <Image
                  layout="fill"
                  draggable={false}
                  src={handleProfilePicture(publication?.metadata?.picture)}
                  objectFit="cover"
                  key={publication?.metadata?.picture}
                  className="rounded-full"
                  onError={(e) => handleImageError(e)}
                />
              </div>
              <div className="relative w-fit h-fit flex flex-col items-center justify-center font-bit text-xxs">
                <div className="relative flex w-fit h-fit break-words items-center justify-center text-pez">
                  {publication?.username?.value}
                </div>
                <div className="relative flex w-fit h-fit break-words items-center justify-center text-tee text-white">
                  {publication?.username?.localName}
                </div>
              </div>
            </div>
            <div className="relative flex flex-row items-center justify-center gap-5">
              <div
                className={`relative w-7 h-7 flex items-center justify-center ${
                  followLoading &&
                  !publication?.operations?.isFollowedByMe &&
                  "animate-spin"
                } ${
                  !followLoading &&
                  publication?.rules?.anyOf?.length < 1 &&
                  !publication?.rules?.required &&
                  publication?.operations?.canFollow &&
                  !publication?.operations?.isFollowedByMe &&
                  context?.lensConectado?.profile?.address !==
                    publication?.address
                    ? "cursor-pointer active:scale-95"
                    : "opacity-70"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    !followLoading &&
                    publication?.rules?.anyOf?.length < 1 &&
                    !publication?.rules?.required &&
                    publication?.operations?.canFollow &&
                    !publication?.operations?.isFollowedByMe &&
                    context?.lensConectado?.profile?.address !==
                      publication?.address
                  ) {
                    handleFollow();
                  }
                }}
              >
                {followLoading && !publication?.operations?.isFollowedByMe ? (
                  <AiOutlineLoading color="white" size={15} />
                ) : (
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/QmadanZQr9dxDXQFG41d2gZrhbKgVvnVnG64qAzMhXyxmG`}
                    draggable={false}
                    priority
                  />
                )}
              </div>
              <div
                className={`relative w-7 h-7 flex items-center justify-center ${
                  publication?.operations?.isFollowedByMe && !followLoading
                    ? "cursor-pointer active:scale-95"
                    : "opacity-50"
                } ${
                  followLoading &&
                  publication?.operations?.isFollowedByMe &&
                  "animate-spin"
                }`}
                onClick={(e) => {
                  if (
                    followLoading ||
                    !publication?.operations?.isFollowedByMe ||
                    context?.lensConectado?.profile?.address !==
                      publication?.address
                  )
                    return;
                  e.stopPropagation();
                  publication?.operations?.isFollowedByMe && handleUnfollow();
                }}
              >
                {followLoading && publication?.operations?.isFollowedByMe ? (
                  <AiOutlineLoading color="white" size={15} />
                ) : (
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/QmSWjjhXh1VAEkNzhfzEojqg1dfSJ69Xf9ezxbKpwTRjZC`}
                    draggable={false}
                    priority
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.getElementById(parentId) as Element
    )
  ) : (
    <></>
  );
};

export default HoverProfile;
