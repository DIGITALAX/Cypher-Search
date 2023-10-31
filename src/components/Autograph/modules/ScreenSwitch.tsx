import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Image from "next/legacy/image";
import {
  ScreenDisplay,
  ScreenSwitchProps,
  SortType,
} from "../types/autograph.types";
import InteractBar from "@/components/Common/modules/InteractBar";

const ScreenSwitch: FunctionComponent<ScreenSwitchProps> = ({
  screenDisplay,
  setScreenDisplay,
  mirror,
  like,
  comment,
  quote,
  openMirrorChoice,
  setOpenMirrorChoice,
  interactionsLoading,
  autograph,
  sortType,
}): JSX.Element => {
  switch (screenDisplay) {
    case ScreenDisplay.Circuits:
      return <></>;

    case ScreenDisplay.Gallery:
      return <></>;

    case ScreenDisplay.Settings:
      return <></>;

    default:
      return (
        <div className="relative flex flex-row gap-5 w-full h-[60vh] items-start justify-center">
          <div
            className="relative w-full h-full p-px flex items-center justify-center"
            id="pfp"
          >
            <div className="relative w-full h-full bg-blurs flex items-center justify-center">
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs`}
                objectFit="cover"
                draggable={false}
              />
            </div>
            <div
              className="absolute w-7 h-10 top-2 right-2 flex cursor-pointer active:scale-95"
              onClick={() => setScreenDisplay(ScreenDisplay.Circuits)}
            >
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/QmP9Yr4qocpbztubrebzLKC1NFuvEn955dCFP3HuZ39WFW`}
                draggable={false}
              />
            </div>
            <div className="absolute bottom-4 left-4 w-fit h-fit rounded-sm bg-black/70 flex flex-col items-start justify-center p-2 border gap-2 border-[#372B48]">
              <div className="relative flex flex-col gap-px justify-center items-start font-bit text-white text-left w-fit h-fit whitespace-nowrap">
                <div className="relative w-fit h-fit flex text-sm justify-center items-start">
                  CONTENT TITLE
                </div>
                <div className="relative w-fit h-fit flex text-xxs justify-center items-start">
                  METADATA
                </div>
              </div>
              <InteractBar
                mirror={mirror}
                like={like}
                comment={comment}
                quote={quote}
                interactionsLoading={interactionsLoading}
                openMirrorChoice={openMirrorChoice}
                setOpenMirrorChoice={setOpenMirrorChoice}
                index={0}
                publication={
                  sortType === SortType.Community
                    ? autograph?.display?.main?.community?.stats!
                    : sortType == SortType.Private
                    ? autograph?.display?.main?.private?.stats!
                    : autograph?.display?.main?.public?.stats!
                }
                type={undefined}
                collect={undefined}
              />
            </div>
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
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/${
                        sortType === SortType.Community
                          ? autograph?.display?.side?.community?.[index]
                              ?.images?.[0]
                          : sortType == SortType.Private
                          ? autograph?.display?.side?.private?.[index]
                              ?.images?.[0]
                          : autograph?.display?.side?.public?.[index]
                              ?.images?.[0]
                      }`}
                      objectFit="cover"
                      draggable={false}
                    />
                  </div>
                  <div
                    className="absolute w-7 h-10 top-2 right-2 flex cursor-pointer active:scale-95"
                    onClick={() => setScreenDisplay(ScreenDisplay.Circuits)}
                  >
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/QmP9Yr4qocpbztubrebzLKC1NFuvEn955dCFP3HuZ39WFW`}
                      draggable={false}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
  }
};

export default ScreenSwitch;
