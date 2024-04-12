import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import {
  INFURA_GATEWAY,
  numberToItemTypeMap,
} from "../../../../../lib/constants";
import { Creation, MicrobrandProps } from "../../types/tiles.types";
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
  collectionsRelated,
  t
}): JSX.Element => {
  return (
    <div
      className={`relative w-full h-fit flex items-center justify-center flex rounded-sm border border-sol p-4 gap-4 flex-col`}
      id={publication?.txHash}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-synth bg-center bg-repeat bg-contain bg-origin-border opacity-5"></div>
      <div className="relative flex w-full h-fit items-center justify-center">
        <div
          className="relative flex w-20 h-20 items-center justify-center cursor-pointer"
          onClick={() =>
            router.push(
              `/item/microbrand/${(
                publication as any
              )?.microbrandName?.replaceAll(" ", "_")}`
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
            top={"2px"}
            bottom={"auto"}
            left={"2px"}
            right={"auto"}
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
        microbrand
        t={t}
      />
      {collectionsRelated && collectionsRelated?.length > 0 && (
        <div className="relative w-full overflow-y-scroll max-h-[10rem] h-fit flex justify-center items-start">
          <div className="relative w-full h-fit flex flex-row gap-3 justify-center items-start flex-wrap">
            {collectionsRelated
              ?.slice(0, 10)
              ?.map((item: Creation, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative w-24 h-24 flex items-center justify-center cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/item/${
                          numberToItemTypeMap[Number(item?.origin)]
                        }/${item?.collectionMetadata?.title?.replaceAll(
                          " ",
                          "_"
                        )}`
                      )
                    }
                  >
                    <Image
                      layout="fill"
                      draggable={false}
                      src={`${INFURA_GATEWAY}/ipfs/${
                        item?.collectionMetadata?.mediaCover
                          ? item?.collectionMetadata?.mediaCover?.split(
                              "ipfs://"
                            )?.[1]
                          : item?.collectionMetadata?.images?.[0]?.split(
                              "ipfs://"
                            )?.[1]
                      }`}
                      objectFit="cover"
                    />
                  </div>
                );
              })}
            <div className="relative w-24 h-24 flex flex-row gap-2 justify-center items-center">
              <div
                className="relative w-10 h-10 cursor-pointer active:scale-95 flex items-center justify-center"
                onClick={() =>
                  router.push(
                    `/item/microbrand/${(
                      publication as any
                    )?.microbrandName?.replaceAll(" ", "_")}`
                  )
                }
              >
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/Qmen1nb9RXZBtWTgZ1wRbSuqACqxceU2D7sxx1sSSnQ5Tq`}
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Microbrand;
