import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { DisplayProps, SortType } from "../../types/autograph.types";
import InteractBar from "@/components/Common/modules/InteractBar";
import { setDisplaySearchBox } from "../../../../../redux/reducers/displaySearchBoxSlice";
import { AiOutlineLoading } from "react-icons/ai";
import handleImageError from "../../../../../lib/helpers/handleImageError";

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
  return (
    <div className="relative flex flex-col w-full h-full items-start justify-start gap-3">
      <div className="relative flex flex-row gap-5 w-full h-[35rem] items-start justify-center">
        <div
          className="relative w-full h-full p-px flex items-center justify-center"
          id="pfp"
        >
          <div className="relative w-full h-full bg-blurs flex items-center justify-center">
            {display && (
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/${
                  sortType === SortType.Community
                    ? display?.community?.main?.images?.[0]?.split(
                        "ipfs://"
                      )?.[1]
                    : sortType === SortType.Private
                    ? display?.private?.main?.images?.[0]?.split("ipfs://")?.[1]
                    : display?.public?.main?.images?.[0]?.split("ipfs://")?.[1]
                }`}
                objectFit="cover"
                draggable={false}
                onError={(e) => handleImageError(e)}
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
          {display && (
            <div className="absolute bottom-4 left-4 w-fit h-fit rounded-sm bg-black/70 flex flex-col items-start justify-center p-2 border gap-2 border-[#372B48]">
              <InteractBar
                router={router}
                dispatch={dispatch}
                mirror={mirror}
                like={like}
                display
                interactionsLoading={interactionsLoading?.[0]}
                openMirrorChoice={openMirrorChoice}
                setOpenMirrorChoice={setOpenMirrorChoice}
                index={0}
                publication={
                  display
                    ? sortType === SortType.Community
                      ? display?.community?.main?.publication!
                      : sortType === SortType.Public
                      ? display?.public?.main?.publication!
                      : display?.private?.main?.publication!
                    : undefined
                }
                type={undefined}
                simpleCollect={undefined}
              />
            </div>
          )}
        </div>
        <div className="relative flex flex-col w-fit h-full gap-5 items-center justify-between">
          {Array.from({ length: 3 }).map((_, index: number) => {
            return (
              <div
                key={index}
                className="relative w-72 rounded-lg h-52 flex items-center justify-center p-px"
                id="smoke"
              >
                <div className="relative w-full h-full rounded-lg bg-blurs flex items-center justify-center">
                  <Image
                    onError={(e) => handleImageError(e)}
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/${
                      display
                        ? sortType === SortType.Community
                          ? display?.community?.main?.images?.[0]?.split(
                              "ipfs://"
                            )[1]
                          : sortType === SortType.Public
                          ? display?.public?.main?.images?.[0]?.split(
                              "ipfs://"
                            )[1]
                          : display?.private?.main?.images?.[0]?.split(
                              "ipfs://"
                            )[1]
                        : "QmZh9CGujyhWtdfF2C1W1TxSUHP8zmaGbcuzLsi1LeEkXY"
                    }`}
                    objectFit="cover"
                    draggable={false}
                    className="rounded-lg"
                  />
                </div>
                {owner && (
                  <div
                    className="absolute w-7 h-10 top-2 right-2 flex cursor-pointer active:scale-95"
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
                {display && (
                  <div className="absolute bottom-2 left-2 flex items-center justify-center">
                    <InteractBar
                      router={router}
                      dispatch={dispatch}
                      mirror={mirror}
                      like={like}
                      interactionsLoading={interactionsLoading?.[index + 1]}
                      openMirrorChoice={openMirrorChoice}
                      setOpenMirrorChoice={setOpenMirrorChoice}
                      index={index + 1}
                      publication={
                        display
                          ? sortType === SortType.Community
                            ? display?.community?.side?.[index].publication!
                            : sortType === SortType.Public
                            ? display?.public?.side?.[index].publication!
                            : display?.private?.side?.[index].publication!
                          : undefined
                      }
                      type={undefined}
                      simpleCollect={undefined}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {owner && (
        <div className="relative w-full h-fit flex justify-end items-center">
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
