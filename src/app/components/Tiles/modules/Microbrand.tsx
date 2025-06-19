import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext, useState } from "react";
import { MicrobrandProps } from "../types/tiles.types";
import { useRouter } from "next/navigation";
import { ModalContext } from "@/app/providers";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { INFURA_GATEWAY, numberToItemTypeMap } from "@/app/lib/constants";
import HoverProfile from "./HoverProfile";
import Stats from "./Stats";
import { Collection } from "../../Common/types/common.types";

const Microbrand: FunctionComponent<MicrobrandProps> = ({
  profile,
  dict,
  index,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  const [profileHover, setProfileHover] = useState<boolean>(false);

  return (
    <div
      className={`relative w-full h-fit flex items-center justify-center flex rounded-sm border border-sol p-4 gap-4 flex-col`}
      id={`${profile?.address}${index}`}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-synth bg-center bg-repeat bg-contain bg-origin-border opacity-5"></div>
      <div className="relative flex w-full h-fit items-center justify-center">
        <div
          className="relative flex w-20 h-20 items-center justify-center cursor-pointer"
          onClick={() => {
            context?.setFiltersOpen({ value: false, allow: false });
            router.push(
              `/item/microbrand/${(profile as any)?.microbrandName?.replaceAll(
                " ",
                "_"
              )}`
            );
          }}
          onMouseEnter={() => setProfileHover(true)}
        >
          <Image
            layout="fill"
            draggable={false}
            src={`${INFURA_GATEWAY}/ipfs/${(profile as any)?.microbandCover}`}
            objectFit="contain"
            onError={(e) => handleImageError(e)}
          />
        </div>
        {profileHover && (
          <HoverProfile
            dict={dict}
            publication={profile}
            setProfileHover={setProfileHover}
            parentId={`${profile?.address}${index}`}
            top={"2px"}
            bottom={"auto"}
            left={"2px"}
            right={"auto"}
          />
        )}
        <div
          className={`absolute top-2 right-2 text-white font-ignite uppercase w-fit h-fit flex ${
            context?.layoutSwitch === 4 ? "text-xs" : "text-sm"
          }`}
        >
          {(profile as any)?.microbandName}
        </div>
      </div>
      <Stats profile={profile} dict={dict} microbrand />
      {(
        context?.searchItems?.items
          ?.filter(
            (value) =>
              (
                value?.post as Collection
              )?.metadata?.microbrand?.toLowerCase() ===
              (profile as any)?.microbrandName?.toLowerCase()
          )
          ?.map((item) => item?.post) || []
      )?.length > 0 && (
        <div className="relative w-full overflow-y-scroll max-h-[10rem] h-fit flex justify-center items-start">
          <div className="relative w-full h-fit flex flex-row gap-3 justify-center items-start flex-wrap">
            {(
              context?.searchItems?.items
                ?.filter(
                  (value) =>
                    (
                      value?.post as Collection
                    )?.metadata?.microbrand?.toLowerCase() ===
                    (profile as any)?.microbrandName?.toLowerCase()
                )
                ?.map((item) => item?.post as Collection) || []
            )
              ?.slice(0, 10)
              ?.map((item: Collection, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative w-24 h-24 flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      context?.setFiltersOpen({ value: false, allow: false });
                      router.push(
                        `/item/${
                          item?.origin == "4"
                            ? "coinop"
                            : numberToItemTypeMap[Number(item?.origin)]
                        }/${item?.metadata?.title?.replaceAll(" ", "_")}`
                      );
                    }}
                  >
                    <Image
                      layout="fill"
                      draggable={false}
                      src={`${INFURA_GATEWAY}/ipfs/${
                        item?.metadata?.mediaCover
                          ? item?.metadata?.mediaCover?.split("ipfs://")?.[1]
                          : item?.metadata?.images?.[0]?.split("ipfs://")?.[1]
                      }`}
                      objectFit="cover"
                    />
                  </div>
                );
              })}
            <div className="relative w-24 h-24 flex flex-row gap-2 justify-center items-center">
              <div
                className="relative w-10 h-10 cursor-pointer active:scale-95 flex items-center justify-center"
                onClick={() => {
                  context?.setFiltersOpen({ value: false, allow: false });
                  router.push(
                    `/item/microbrand/${(
                      profile as any
                    )?.microbrandName?.replaceAll(" ", "_")}`
                  );
                }}
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
