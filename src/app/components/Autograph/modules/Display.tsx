import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { DisplayProps, SortType } from "../types/autograph.types";
import { ModalContext } from "@/app/providers";
import MediaSwitch from "../../Common/modules/MediaSwitch";
import { INFURA_GATEWAY, numberToItemTypeMap } from "@/app/lib/constants";
import InteractBar from "../../Tiles/modules/InteractBar";
import useDisplay from "../hooks/useDisplay";

const Display: FunctionComponent<DisplayProps> = ({
  dict,
  owner,
}): JSX.Element => {
  const { displayLoading, handleSetDisplay } = useDisplay(dict);

  const context = useContext(ModalContext);
  const displayType =
    context?.sortType === SortType.Community
      ? context?.profileDisplay?.community
      : context?.sortType === SortType.Private
      ? context?.profileDisplay?.private
      : context?.profileDisplay?.public;
  return (
    <div className="relative flex flex-col w-full h-full items-start justify-start gap-3">
      <div className="relative flex flex-col tablet:flex-row gap-5 w-full h-fit sm:h-[35rem] items-start justify-center">
        <div
          className="relative w-full h-[25rem] sm:h-full p-px flex items-center justify-center"
          id="pfp"
        >
          <div className="relative w-full h-full tablet:h-full bg-blurs flex items-center justify-center">
            {displayType?.main && (
              <MediaSwitch
                type={
                  displayType?.main?.metadata?.mediaTypes?.[0] == "video"
                    ? "video"
                    : displayType?.main?.metadata?.mediaTypes?.[0] == "audio"
                    ? "audio"
                    : "image"
                }
                hidden
                classNameImage={"w-full h-full flex relative"}
                classNameVideo={{
                  objectFit: "cover",
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyItems: "center",
                  position: "relative",
                }}
                classNameAudio={"w-full h-full flex relative"}
                srcUrl={
                  displayType?.main?.metadata?.mediaTypes?.[0] == "video"
                    ? displayType?.main?.metadata?.video
                    : displayType?.main?.metadata?.mediaTypes?.[0] == "audio"
                    ? `${INFURA_GATEWAY}/ipfs/${
                        displayType?.main?.metadata?.audio?.split(
                          "ipfs://"
                        )?.[1]
                      }`
                    : `${INFURA_GATEWAY}/ipfs/${
                        displayType?.main?.metadata?.images?.[0]?.split(
                          "ipfs://"
                        )?.[1]
                      }`
                }
                srcCover={
                  displayType?.main?.metadata?.mediaCover
                    ? `${INFURA_GATEWAY}/ipfs/${
                        displayType?.main?.metadata?.mediaCover?.split(
                          "ipfs://"
                        )?.[1]
                      }`
                    : undefined
                }
              />
            )}
          </div>
          {owner && (
            <div
              className="absolute w-7 h-10 top-2 right-2 flex cursor-pointer active:scale-95"
              onClick={() => context?.setDisplaySearch(0)}
            >
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/QmP9Yr4qocpbztubrebzLKC1NFuvEn955dCFP3HuZ39WFW`}
                draggable={false}
              />
            </div>
          )}
          {displayType?.main && displayType?.main?.publication && (
            <div className="absolute bottom-4 left-4 w-fit h-fit rounded-sm bg-black/70 flex flex-col items-start justify-center p-2 border gap-2 border-[#372B48]">
              <InteractBar
                dict={dict}
                hideCollect
                display={numberToItemTypeMap[Number(displayType?.main?.origin)]}
                publication={displayType?.main?.publication!}
              />
            </div>
          )}
        </div>
        <div className="relative flex tablet:flex-nowrap flex-wrap flex-row tablet:flex-col w-full sm:w-fit h-fit tablet:h-full gap-5 items-center tablet:justify-between">
          {Array.from({ length: 3 }).map((_, index: number) => {
            return (
              <div
                key={index}
                className="relative w-full sm:w-48 tablet:w-72 rounded-lg h-48 sm:h-24 tablet:h-52 flex items-center justify-center p-px"
                id="smoke"
              >
                <div className="relative w-full h-full rounded-lg bg-blurs flex items-center justify-center">
                  {displayType?.side?.[index] && (
                    <MediaSwitch
                      type={
                        displayType?.side?.[index]?.metadata?.mediaTypes?.[0] ==
                        "video"
                          ? "video"
                          : displayType?.side?.[index]?.metadata
                              ?.mediaTypes?.[0] == "audio"
                          ? "audio"
                          : "image"
                      }
                      hidden
                      classNameImage={"w-full h-full flex relative rounded-lg"}
                      classNameAudio={"w-full h-full flex relative rounded-lg"}
                      classNameVideo={{
                        objectFit: "cover",
                        display: "flex",
                        width: "100%",
                        height: "100%",
                        alignItems: "center",
                        justifyItems: "center",
                        borderRadius: "0.5rem",
                        position: "relative",
                      }}
                      srcUrl={
                        displayType?.side?.[index]?.metadata?.mediaTypes?.[0] ==
                        "video"
                          ? displayType?.side?.[index]?.metadata?.video
                          : displayType?.side?.[index]?.metadata
                              ?.mediaTypes?.[0] == "audio"
                          ? `${INFURA_GATEWAY}/ipfs/${
                              displayType?.side?.[
                                index
                              ]?.metadata?.audio?.split("ipfs://")?.[1]
                            }`
                          : `${INFURA_GATEWAY}/ipfs/${
                              displayType?.side?.[
                                index
                              ]?.metadata?.images?.[0]?.split("ipfs://")?.[1]
                            }`
                      }
                      srcCover={
                        displayType?.side?.[index]?.metadata?.mediaCover
                          ? `${INFURA_GATEWAY}/ipfs/${
                              displayType?.side?.[
                                index
                              ]?.metadata?.mediaCover?.split("ipfs://")?.[1]
                            }`
                          : undefined
                      }
                    />
                  )}
                </div>
                {owner && (
                  <div
                    className="absolute w-5 h-8 tablet:w-7 tablet:h-10 top-2 right-2 flex cursor-pointer active:scale-95"
                    onClick={() => context?.setDisplaySearch(index + 1)}
                  >
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/QmP9Yr4qocpbztubrebzLKC1NFuvEn955dCFP3HuZ39WFW`}
                      draggable={false}
                    />
                  </div>
                )}
                {displayType?.side?.[index] &&
                  displayType?.side?.[index]?.publication && (
                    <div className="absolute bottom-2 left-2 flex items-center justify-center sm:hidden tablet:flex">
                      <InteractBar
                        dict={dict}
                        hideCollect
                        publication={displayType?.side?.[index]?.publication!}
                        display={
                          numberToItemTypeMap[
                            Number(displayType?.side?.[index]?.origin)
                          ]
                        }
                      />
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      </div>
      {owner && (
        <div className="relative w-full h-fit flex justify-start tablet:justify-end items-center">
          <div
            className={`relative w-28 h-10 font-bit text-white flex items-center justify-center bg-fuego border border-white rounded-sm ${
              !displayLoading && "cursor-pointer active:scale-95"
            }`}
            onClick={() => !displayLoading && handleSetDisplay()}
          >
            <div
              className={`${
                displayLoading ? "animate-spin" : "top-px"
              } relative w-fit h-fit flex items-center justify-center text-center`}
            >
              {displayLoading ? (
                <AiOutlineLoading size={15} color="white" />
              ) : (
                dict?.update
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Display;
