import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import {
  INFURA_GATEWAY,
  numberToItemTypeMap,
} from "../../../../../lib/constants";
import { DisplayProps, SortType } from "../../types/autograph.types";
import InteractBar from "@/components/Common/modules/InteractBar";
import { setDisplaySearchBox } from "../../../../../redux/reducers/displaySearchBoxSlice";
import { AiOutlineLoading } from "react-icons/ai";
import MediaSwitch from "@/components/Common/modules/MediaSwitch";

const Display: FunctionComponent<DisplayProps> = ({
  display,
  mirror,
  like,
  openMirrorChoice,
  sortType,
  setOpenMirrorChoice,
  interactionsLoading,
  dispatch,
  handleSetDisplay,
  displayLoading,
  owner,
  router,
}): JSX.Element => {
  const displayType =
    sortType === SortType.Community
      ? display?.community
      : sortType === SortType.Private
      ? display?.private
      : display?.public;
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
                  displayType?.main?.collectionMetadata?.mediaTypes?.[0] ==
                  "video"
                    ? "video"
                    : displayType?.main?.collectionMetadata?.mediaTypes?.[0] ==
                      "audio"
                    ? "audio"
                    : "image"
                }
                hidden
                classNameImage={"w-full h-full flex relative"}
                classNameVideo={
                  "object-cover w-full h-full flex items-center justify-center relative"
                }
                classNameAudio={"w-full h-full flex relative"}
                srcUrl={
                  displayType?.main?.collectionMetadata?.mediaTypes?.[0] ==
                  "video"
                    ? `${INFURA_GATEWAY}/ipfs/${
                        displayType?.main?.collectionMetadata?.video?.split(
                          "ipfs://"
                        )?.[1]
                      }`
                    : displayType?.main?.collectionMetadata?.mediaTypes?.[0] ==
                      "audio"
                    ? `${INFURA_GATEWAY}/ipfs/${
                        displayType?.main?.collectionMetadata?.audio?.split(
                          "ipfs://"
                        )?.[1]
                      }`
                    : `${INFURA_GATEWAY}/ipfs/${
                        displayType?.main?.collectionMetadata?.images?.[0]?.split(
                          "ipfs://"
                        )?.[1]
                      }`
                }
                srcCover={
                  displayType?.main?.collectionMetadata?.mediaCover
                    ? `${INFURA_GATEWAY}/ipfs/${
                        displayType?.main?.collectionMetadata?.mediaCover?.split(
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
              onClick={() =>
                dispatch(
                  setDisplaySearchBox({
                    actionValue: 0,
                    actionType: sortType,
                  })
                )
              }
            >
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/QmP9Yr4qocpbztubrebzLKC1NFuvEn955dCFP3HuZ39WFW`}
                draggable={false}
              />
            </div>
          )}
          {displayType?.main && (
            <div className="absolute bottom-4 left-4 w-fit h-fit rounded-sm bg-black/70 flex flex-col items-start justify-center p-2 border gap-2 border-[#372B48]">
              <InteractBar
                router={router}
                dispatch={dispatch}
                mirror={mirror}
                like={like}
                hideCollect
                display={numberToItemTypeMap[Number(displayType?.main?.origin)]}
                interactionsLoading={interactionsLoading?.[0]}
                openMirrorChoice={openMirrorChoice}
                setOpenMirrorChoice={setOpenMirrorChoice}
                index={0}
                publication={displayType?.main?.publication}
                simpleCollect={undefined}
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
                        displayType?.side?.[index]?.collectionMetadata
                          ?.mediaTypes?.[0] == "video"
                          ? "video"
                          : displayType?.side?.[index]?.collectionMetadata
                              ?.mediaTypes?.[0] == "audio"
                          ? "audio"
                          : "image"
                      }
                      hidden
                      classNameImage={"w-full h-full flex relative rounded-lg"}
                      classNameAudio={"w-full h-full flex relative rounded-lg"}
                      classNameVideo={
                        "object-cover w-full h-full flex items-center justify-center relative rounded-lg"
                      }
                      srcUrl={
                        displayType?.side?.[index]?.collectionMetadata
                          ?.mediaTypes?.[0] == "video"
                          ? `${INFURA_GATEWAY}/ipfs/${
                              displayType?.side?.[
                                index
                              ]?.collectionMetadata?.video?.split(
                                "ipfs://"
                              )?.[1]
                            }`
                          : displayType?.side?.[index]?.collectionMetadata
                              ?.mediaTypes?.[0] == "audio"
                          ? `${INFURA_GATEWAY}/ipfs/${
                              displayType?.side?.[
                                index
                              ]?.collectionMetadata?.audio?.split(
                                "ipfs://"
                              )?.[1]
                            }`
                          : `${INFURA_GATEWAY}/ipfs/${
                              displayType?.side?.[
                                index
                              ]?.collectionMetadata?.images?.[0]?.split(
                                "ipfs://"
                              )?.[1]
                            }`
                      }
                      srcCover={
                        displayType?.side?.[index]?.collectionMetadata
                          ?.mediaCover
                          ? `${INFURA_GATEWAY}/ipfs/${
                              displayType?.side?.[
                                index
                              ]?.collectionMetadata?.mediaCover?.split(
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
                    className="absolute w-5 h-8 tablet:w-7 tablet:h-10 top-2 right-2 flex cursor-pointer active:scale-95"
                    onClick={() =>
                      dispatch(
                        setDisplaySearchBox({
                          actionValue: index + 1,
                          actionType: sortType,
                        })
                      )
                    }
                  >
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/QmP9Yr4qocpbztubrebzLKC1NFuvEn955dCFP3HuZ39WFW`}
                      draggable={false}
                    />
                  </div>
                )}
                {displayType?.side?.[index] && (
                  <div className="absolute bottom-2 left-2 flex items-center justify-center sm:hidden tablet:flex">
                    <InteractBar
                      router={router}
                      dispatch={dispatch}
                      mirror={mirror}
                      like={like}
                      hideCollect
                      interactionsLoading={interactionsLoading?.[index + 1]}
                      openMirrorChoice={openMirrorChoice}
                      setOpenMirrorChoice={setOpenMirrorChoice}
                      index={index + 1}
                      publication={displayType?.side?.[index]?.publication!}
                      simpleCollect={undefined}
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
            className={`relative w-20 h-10 font-bit text-white flex items-center justify-center bg-fuego border border-white rounded-sm ${
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
                "Update"
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Display;
