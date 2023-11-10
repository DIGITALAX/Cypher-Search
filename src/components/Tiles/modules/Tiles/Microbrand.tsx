import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { MicrobrandProps } from "../../types/tiles.types";
import HoverProfile from "@/components/Common/modules/HoverProfile";
import Stats from "@/components/Common/modules/Stats";

const Microbrand: FunctionComponent<MicrobrandProps> = ({
  layoutAmount,
  router,
  publication,
  followProfile,
  unfollowProfile,
  index,
  followLoading,
  setProfileHovers,
  profileHovers,
  dispatch
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex items-center justify-center flex flex-row rounded-sm border border-sol p-4 gap-4">
      <div className="relative p-px rounded-sm border border-pez w-full h-20 flex-row gap-6 items-center justify-start flex bg-white">
        <div className="relative w-full h-full opacity-70 flex">
          <Image
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/QmVaK6MVXPzdGb7XSBXqP4bXGzrsbtd1yECafztTT4dvjp`}
            objectFit="cover"
            className="rounded-sm"
            draggable={false}
          />
        </div>
        <div
          className="absolute top-2 left-2 flex flex-row gap-4 w-10 h-10 items-center justify-start cursor-pointer"
          onClick={() =>
            router.push(
              `/autograph/${
                publication?.handle?.suggestedFormatted?.localName?.split(
                  "@"
                )[1]
              }`
            )
          }
          onMouseEnter={() =>
            setProfileHovers((prev) => {
              const updatedArray = [...prev];
              updatedArray[index] = true;
              return updatedArray;
            })
          }
        >
          <Image
            layout="fill"
            draggable={false}
            src={`${INFURA_GATEWAY}/ipfs/${
              (publication as any)?.microbandCover
            }`}
            objectFit="contain"
          />
        </div>
        {profileHovers?.[index] && (
          <HoverProfile
            router={router}
            index={index}
            dispatch={dispatch}
            publication={publication}
            followLoading={followLoading}
            followProfile={followProfile}
            unfollowProfile={unfollowProfile}
            setProfileHovers={setProfileHovers}
          />
        )}
        <div
          className={`absolute top-2 right-2 text-white font-ignite uppercase w-fit h-fit flex ${
            layoutAmount === 4 ? "text-xs" : "text-sm"
          }`}
        >
          {(publication as any)?.microbandName}
          yawp11
        </div>
      </div>
      <Stats />
    </div>
  );
};

export default Microbrand;
