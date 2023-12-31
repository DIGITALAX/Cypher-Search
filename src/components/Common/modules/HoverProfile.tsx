import { FunctionComponent, useRef, useState } from "react";
import { HoverProfileProps } from "../types/common.types";
import { usePopper } from "react-popper";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { AiOutlineLoading } from "react-icons/ai";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import { setFollowCollect } from "../../../../redux/reducers/followCollectSlice";
import ReactDOM from "react-dom";
import handleImageError from "../../../../lib/helpers/handleImageError";

const HoverProfile: FunctionComponent<HoverProfileProps> = ({
  followLoading,
  unfollowProfile,
  followProfile,
  publication,
  router,
  index,
  setProfileHovers,
  feed,
  dispatch,
  main,
  lensConnected,
  parentId,
  bottom,
  right,
  left,
  top,
  gallery,
}): JSX.Element => {
  const [popperElement, setPopperElement] = useState<HTMLElement | null>();
  const popperRef = useRef<HTMLDivElement>(null);
  const popper = usePopper(popperRef?.current, popperElement, {
    placement: "right-end",
    strategy: "absolute",
    modifiers: [
      {
        name: "flip",
        enabled: true,
        options: {
          fallbackPlacements: ["top-start"],
          boundary: "clippingParents",
          rootBoundary: "viewport",
          padding: 8,
        },
      },
      {
        name: "preventOverflow",
        options: {
          boundary: "clippingParents",
          rootBoundary: "viewport",
          tether: true,
          padding: 8,
        },
      },
    ],
  });
  const profilePicture = createProfilePicture(publication?.metadata?.picture);
  return document.getElementById(parentId) ? (
    ReactDOM.createPortal(
      <div
        className="w-28 h-fit flex flex-col items-center justify-center p-2 z-20 border border-white rounded-sm bg-black"
        onMouseLeave={() =>
          setProfileHovers((prev) => {
            const arr = [...(prev || [])];
            arr[index] = false;
            return arr;
          })
        }
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
                onClick={() =>
                  router.push(
                    `/autograph/${
                      publication?.handle?.suggestedFormatted?.localName?.split(
                        "@"
                      )?.[1]
                    }`
                  )
                }
              >
                {profilePicture && (
                  <Image
                    layout="fill"
                    draggable={false}
                    src={profilePicture}
                    objectFit="cover"
                    className="rounded-full"
                    onError={(e) => handleImageError(e)}
                  />
                )}
              </div>
              <div className="relative w-fit h-fit flex flex-col items-center justify-center font-bit text-xxs">
                <div className="relative flex w-fit h-fit break-words items-center justify-center text-pez">
                  {publication?.handle?.localName}
                </div>
                <div className="relative flex w-fit h-fit break-words items-center justify-center text-tee text-white">
                  {publication?.handle?.suggestedFormatted?.localName}
                </div>
              </div>
            </div>
            <div className="relative flex flex-row items-center justify-center gap-5">
              <div
                className={`relative w-7 h-7 flex items-center justify-center ${
                  followLoading[index] &&
                  !publication?.operations?.isFollowedByMe?.value &&
                  "animate-spin"
                } ${
                  !followLoading[index] &&
                  publication?.followModule?.type !== "RevertFollowModule" &&
                  publication?.followModule?.type !== "UnknownFollowModule" &&
                  !publication?.operations?.isFollowedByMe?.value &&
                  lensConnected?.id !== publication?.id
                    ? "cursor-pointer active:scale-95"
                    : "opacity-70"
                }`}
                onClick={(e) => {
                  if (
                    followLoading[index] ||
                    publication?.operations?.isFollowedByMe?.value ||
                    lensConnected?.id === publication?.id
                  ) {
                    return;
                  }
                  e.stopPropagation();
                  publication?.followModule?.type !== "RevertFollowModule" &&
                  publication?.followModule?.type !== "UnknownFollowModule" &&
                  publication?.followModule?.type === "FeeFollowModule"
                    ? dispatch(
                        setFollowCollect({
                          actionType: "follow",
                          actionFollower: publication,
                        })
                      )
                    : feed || main || gallery
                    ? (
                        followProfile as (
                          id: string,
                          index: number,
                          feed?: boolean,
                          main?: boolean
                        ) => Promise<void>
                      )(publication?.id, index, feed, main)
                    : (
                        followProfile as (
                          id: string,
                          index?: number
                        ) => Promise<void>
                      )(publication?.id, index);
                }}
              >
                {followLoading[index] &&
                !publication?.operations?.isFollowedByMe?.value ? (
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
                  publication?.operations?.isFollowedByMe?.value &&
                  !followLoading[index]
                    ? "cursor-pointer active:scale-95"
                    : "opacity-50"
                } ${
                  followLoading[index] &&
                  publication?.operations?.isFollowedByMe?.value &&
                  "animate-spin"
                }`}
                onClick={(e) => {
                  if (
                    followLoading[index] ||
                    !publication?.operations?.isFollowedByMe?.value ||
                    lensConnected?.id === publication?.id
                  )
                    return;
                  e.stopPropagation();
                  publication?.operations?.isFollowedByMe?.value &&
                    (feed || main || gallery
                      ? (
                          unfollowProfile as (
                            id: string,
                            index: number,
                            feed?: boolean,
                            main?: boolean
                          ) => Promise<void>
                        )(publication?.id, index, feed, main)
                      : (
                          unfollowProfile as (
                            id: string,
                            index?: number
                          ) => Promise<void>
                        )(publication?.id, index));
                }}
              >
                {followLoading[index] &&
                publication?.operations?.isFollowedByMe?.value ? (
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
