import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { MicrobrandProps } from "../../types/tiles.types";
import HoverProfile from "@/components/Common/modules/HoverProfile";
import Stats from "@/components/Common/modules/Stats";
import handleImageError from "../../../../../lib/helpers/handleImageError";

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
  dispatch,
  lensConnected,
}): JSX.Element => {
  return (
    <div
      className={`relative w-full h-fit flex items-center justify-center flex rounded-sm border border-sol p-4 gap-4 ${
        layoutAmount === 4 ? "flex-col" : "flex-col xl:flex-row"
      }`}
      id={publication?.txHash}
    >
      <div className="relative p-px rounded-sm border border-pez w-full h-20 flex-row gap-6 items-center justify-start flex bg-white">
        <div className="absolute top-0 left-0 w-full h-full opacity-70 flex rounded-sm">
          <Image
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/QmVaK6MVXPzdGb7XSBXqP4bXGzrsbtd1yECafztTT4dvjp`}
            objectFit="cover"
            className="rounded-sm"
            draggable={false}
          />
        </div>
        <div
          className="relative flex flex-row gap-4 w-10 h-10 items-center justify-start cursor-pointer"
          onClick={() =>
            router.push(
              `/item/microbrand/${
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
            onError={(e) => handleImageError(e)}
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
            lensConnected={lensConnected}
            parentId={publication?.txHash}
            top={"auto"}
            bottom={"2px"}
            left={"auto"}
            right={"2px"}
          />
        )}
        <div
          className={`absolute top-2 right-2 text-white font-ignite uppercase w-fit h-fit flex ${
            layoutAmount === 4 ? "text-xs" : "text-sm"
          }`}
        >
          {(publication as any)?.microbandName}
        </div>
      </div>
      <Stats
        layoutAmount={layoutAmount}
        dispatch={dispatch}
        profile={publication}
      />
    </div>
  );
};

export default Microbrand;
