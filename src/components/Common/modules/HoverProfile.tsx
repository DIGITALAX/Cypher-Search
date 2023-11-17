import { FunctionComponent, useRef, useState } from "react";
import { HoverProfileProps } from "../types/common.types";
import { usePopper } from "react-popper";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { AiOutlineLoading } from "react-icons/ai";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import { setFollowCollect } from "../../../../redux/reducers/followCollectSlice";

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
}): JSX.Element => {
  const [popperElement, setPopperElement] = useState<HTMLElement | null>();
  const popperRef = useRef<HTMLDivElement>(null);
  const popper = usePopper(popperRef?.current, popperElement, {
    placement: "bottom-start",
  });
  const profilePicture = createProfilePicture(publication?.metadata?.picture);
  return (
    <div
      className="absolute w-28 h-fit flex flex-col items-center justify-center p-2 z-20 border border-white rounded-sm bg-black -top-32"
      onMouseLeave={() =>
        setProfileHovers((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = false;
          return updatedArray;
        })
      }
    >
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
              onClick={() =>
                router.push(
                  `/item/quest/${
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
                followLoading[index] && "animate-spin"
              } ${
                publication?.followModule?.type !== "RevertFollowModule" &&
                publication?.followModule?.type !== "UnknownFollowModule"
                  ? "cursor-pointer active:scale-95"
                  : "opacity-70"
              }`}
              onClick={() =>
                publication?.followModule?.type !== "RevertFollowModule" &&
                publication?.followModule?.type !== "UnknownFollowModule" &&
                followLoading[index] &&
                (publication?.followModule?.type === "FeeFollowModule"
                  ? dispatch(
                      setFollowCollect({
                        actionType: "follow",
                        actionFollower: publication,
                      })
                    )
                  : router.asPath.includes("autograph")
                  ? followProfile(publication?.id, feed)
                  : followProfile(publication?.id))
              }
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
              onClick={() =>
                router.asPath.includes("autograph")
                  ? unfollowProfile(publication?.id, feed)
                  : unfollowProfile(publication?.id)
              }
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
