import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { InteractBarProps } from "../types/common.types";
import numeral from "numeral";
import { AiOutlineLoading } from "react-icons/ai";
import { Post } from "../../../../graphql/generated";

const InteractBar: FunctionComponent<InteractBarProps> = ({
  col,
  layoutAmount,
  mirror,
  like,
  comment,
  quote,
  interactionsLoading,
  publication,
  openMirrorChoice,
  setOpenMirrorChoice,
  index,
  collect,
  type
}): JSX.Element => {
  return (
    <div
      className={`relative w-full h-fit rounded-sm border border-frio text-base font-vcr text-mar flex gap-4 p-2 items-center justify-center bg-fuego ${
        col || layoutAmount ? "flex-col" : "flex-row"
      }`}
    >
      {[
        "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
        "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ",
        "QmNomDrWUNrcy2SAVzsKoqd5dPMogeohB8PSuHCg57nyzF",
        "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n",
      ].map((image: string, indexTwo: number) => {
        const functions: any = [like, collect, comment];
        const loaders = [
          interactionsLoading?.like,
          interactionsLoading?.comment,
        ];
        const stats = [
          publication?.mirrors + publication?.quotes,
          publication?.reactions,
          publication?.countOpenActions,
          publication?.comments,
        ];
        return (
          <div
            className="relative w-full h-full flex flex-row items-center justify-center gap-2"
            key={indexTwo}
          >
            <div
              className="relative w-fit h-fit flex cursor-pointer items-center justify-center active:scale-95"
              onClick={() => {
                if (indexTwo === 2) {
                  const choices = [...openMirrorChoice];
                  choices[index] = !choices[index];
                  setOpenMirrorChoice(choices);
                } else if (indexTwo === 3) {
                  !loaders[index] &&
                    functions[indexTwo] &&
                    functions[indexTwo]!(publication?.id, type);
                } else {
                  !loaders[index] &&
                    functions[indexTwo] &&
                    functions[indexTwo]!(publication?.id);
                }
              }}
            >
              {loaders[index] ? (
                <div className="relative w-fit h-fit animate-spin flex items-center justify-center">
                  <AiOutlineLoading size={15} color="white" />
                </div>
              ) : (
                <div
                  className={`relative w-4 h-4 flex items-center justify-center ${
                    functions[indexTwo]
                      ? "cursor-pointer active:scale-95"
                      : "opacity-70"
                  }`}
                >
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/${image}`}
                    draggable={false}
                  />
                </div>
              )}
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center text-center cursor-pointer active:scale-95">
              {numeral(stats[indexTwo]).format("0a")}
            </div>
          </div>
        );
      })}
      {!openMirrorChoice?.[index] && (
        <div className="absolute w-fit h-fit flex flex-row gap-4 p-2 items-center justify-center bg-black/80 rounded-sm left-2 -top-6">
          {[
            "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
            "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM",
          ].map((image: string, indexTwo: number) => {
            const functions = [mirror, quote];
            const loaders = [
              interactionsLoading?.mirror,
              interactionsLoading?.quote,
            ];
            return (
              <div
                key={indexTwo}
                className="relative w-fit h-fit flex cursor-pointer items-center justify-center active:scale-95 hover:opacity-70"
                onClick={() =>
                  !loaders[index] && functions[indexTwo](publication?.id)
                }
              >
                {loaders[index] ? (
                  <div className="relative w-fit h-fit animate-spin flex items-center justify-center">
                    <AiOutlineLoading size={15} color="white" />
                  </div>
                ) : (
                  <div
                    className={
                      "relative w-4 h-4 flex items-center justify-center cursor-pointer active:scale-95"
                    }
                  >
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/${image}`}
                      draggable={false}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InteractBar;
