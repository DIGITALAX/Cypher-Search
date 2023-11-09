import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { TextPostProps } from "../../types/tiles.types";
import InteractBar from "@/components/Common/modules/InteractBar";
import HoverProfile from "@/components/Common/modules/HoverProfile";
import { Post } from "../../../../../graphql/generated";

const TextPost: FunctionComponent<TextPostProps> = ({
  layoutAmount,
  router,
  publication,
  mirror,
  like,
  interactionsLoading,
  setOpenMirrorChoice,
  openMirrorChoice,
  index,
  profileHovers,
  setProfileHovers,
  followLoading,
  followProfile,
  unfollowProfile,
  simpleCollect,
  dispatch
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex items-end justify-center flex flex-row rounded-sm border border-sol p-4 gap-4">
      <div className="relative w-full h-100 flex flex-row gap-5 items-center justify-center">
        <div className="relative w-full h-full rounded-sm border border-mosgu bg-fuego p-1 font-bit text-nuba text-sm text-left break-words flex justify-center items-center"></div>
      </div>
      <div className="relative w-fit h-fit flex flex-col gap-5 items-end justify-end">
        <div className="relative flex flex-col w-fit h-fit gap-2 items-end justify-center">
          <InteractBar
            mirror={mirror}
            router={router}
            like={like}
            dispatch={dispatch}
            interactionsLoading={interactionsLoading}
            layoutAmount={layoutAmount}
            openMirrorChoice={openMirrorChoice}
            setOpenMirrorChoice={setOpenMirrorChoice}
            index={index}
            publication={
              publication?.__typename === "Mirror" ? publication : publication
            }
            simpleCollect={
              (
                publication?.__typename === "Mirror"
                  ? !publication?.mirrorOn.operations?.actedOn &&
                    (publication?.mirrorOn?.openActionModules?.[0]
                      .__typename === "SimpleCollectOpenActionSettings" ||
                      publication?.mirrorOn?.openActionModules?.[0]
                        .__typename ===
                        "MultirecipientFeeCollectOpenActionSettings")
                  : !(publication as Post)?.operations?.actedOn &&
                    ((publication as Post)?.openActionModules?.[0]
                      .__typename !== "SimpleCollectOpenActionSettings" ||
                      (publication as Post)?.openActionModules?.[0]
                        .__typename ===
                        "MultirecipientFeeCollectOpenActionSettings")
              )
                ? simpleCollect
                : undefined
            }
            type={
              publication?.__typename === "Mirror"
                ? publication?.mirrorOn?.openActionModules?.[0].__typename
                : (publication as Post)?.openActionModules?.[0].__typename
            }
          />
          <div className="relative w-full h-fit flex flex-col items-center justify-start justify-between p-1 gap-3">
            <div className="relative w-full h-fit items-end justify-start flex flex-col gap-3">
              <div className="relative w-full h-fit items-end justify-start flex flex-col">
                <div className="relative flex items-center justify-center text-right break-words text-white font-bit uppercase text-base">
                  username
                </div>
                <div className="relative flex items-center justify-center text-right break-words text-white/70 font-bit uppercase text-xs">
                  @username.lens
                </div>
              </div>
              <div className="relative w-full h-fit items-end justify-start flex flex-col">
                <div className="relative flex items-center justify-center text-right break-words text-white font-bit uppercase text-sm">
                  posted
                </div>
                <div className="relative flex items-center justify-center text-right break-words text-white/70 font-bit uppercase text-sm">
                  4d ago
                </div>
              </div>
            </div>
            <div className="relative mb-0 flex flex-row items-center justify-between gap-2 w-full h-fit">
              <div className="relative w-6 h-6 items-center justify-center flex">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmeA7R3J8FrhZuMmiFFrVqNmWzKkJCbP51pajFrYdEGBVX`}
                  priority
                  draggable={false}
                  layout="fill"
                />
              </div>
              <div
                className="relative w-6 h-6 flex items-center justify-center cursor-pointer active:scale-95"
                onClick={() => router.push(`/item/pub/${publication?.id}`)}
              >
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmZ4v5pzdnCBeyKnS9VrjZiEAbUpAVy8ECArNcpxBt6Tw4`}
                  draggable={false}
                />
              </div>
              <div
                className="relative w-6 h-6 rounded-full flex items-center justify-center p-1 cursor-pointer"
                id="pfp"
                onMouseEnter={() =>   setProfileHovers((prev) => {
                  const updatedArray = [...prev];
                  updatedArray[index] = false;
                  return updatedArray;
                })}
                
              ></div>
              {profileHovers?.[index] && (
                <HoverProfile
                  followLoading={followLoading}
                  followProfile={followProfile}
                  unfollowProfile={unfollowProfile}
                  router={router}
                  publication={publication?.by}
                  index={index}
                  setProfileHovers={setProfileHovers}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextPost;
