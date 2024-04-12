import { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import {
  ACCEPTED_TOKENS,
  INFURA_GATEWAY,
  numberToItemTypeMap,
} from "../../../../lib/constants";
import Image from "next/legacy/image";
import { setQuestGates } from "../../../../redux/reducers/questGatesSlice";
import { QuestGatesProps } from "../types/modals.types";
import { Creation } from "@/components/Tiles/types/tiles.types";

const QuestGates: FunctionComponent<QuestGatesProps> = ({
  dispatch,
  gates,
  t,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] rounded-md sm:w-[70vw] tablet:w-[40vw] h-fit max-h-[90vh] place-self-center bg-offBlack rounded-lg border border-white rounded-sm overflow-y-scroll">
        <div className="relative w-full h-full flex flex-col gap-5 p-2">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="white"
              size={10}
              onClick={() => dispatch(setQuestGates(undefined))}
            />
          </div>
          <div className="relative w-full h-fit items-center justify-center flex flex-col gap-3 pb-4 text-white font-bit">
            <div className="relative w-2/3 h-fit items-center justify-center text-center break-words text-sm">
              {t("play")}
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center text-gray-500 text-xs">
              {gates?.oneof ? t("one") : t("all")}
            </div>
            <div className="relative w-full h-fit flex flex-col pt-4 gap-8">
              {gates?.erc20 && gates?.erc20?.length > 0 && (
                <div className="relative w-full h-fit flex flex-col items-center justify-center gap-2 break-words">
                  <div className="relative w-fit h-fit flex items-center justify-center text-sm">
                    {t("thr")}
                  </div>
                  <div className="relative w-fit h-fit justify-center items-center gap-4 flex flex-row flex-wrap">
                    {gates?.erc20?.map(
                      (
                        erc20: {
                          address: string;
                          amount: string;
                        },
                        index: number
                      ) => {
                        return (
                          <div
                            key={index}
                            className="relative w-fit h-fit flex items-center justify-center gap-1.5"
                          >
                            <div
                              className="relative w-5 h-6 flex items-center justify-center cursor-pointer"
                              onClick={() =>
                                window.open(
                                  `https://polygonscan.com/address/${erc20.address}`
                                )
                              }
                            >
                              <Image
                                draggable={false}
                                layout="fill"
                                src={`${INFURA_GATEWAY}/ipfs/${
                                  ACCEPTED_TOKENS?.filter(
                                    (token) =>
                                      erc20?.address?.toLowerCase() ==
                                      token[2]?.toLowerCase()
                                  )?.[0]?.[0]
                                }`}
                              />
                            </div>
                            <div className="relative w-fit h-fit flex items-center justify-center font-vcr text-acei text-sm">
                              {`${
                                Number(erc20?.amount) /
                                (erc20?.address?.toLowerCase() ==
                                ACCEPTED_TOKENS[2][2]?.toLowerCase()
                                  ? 10 ** 6
                                  : 10 ** 18)
                              } ${
                                ACCEPTED_TOKENS?.filter(
                                  (token) =>
                                    erc20?.address?.toLowerCase() ==
                                    token[2]?.toLowerCase()
                                )?.[0]?.[1]
                              }`}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
              {gates?.erc721 && gates?.erc721?.length > 0 && (
                <div className="relative w-full h-fit flex flex-col items-center justify-center gap-2 px-2 break-words">
                  <div className="relative w-fit h-fit flex items-center justify-center text-sm">
                    {t("cip")}
                  </div>
                  <div className="relative w-full h-fit justify-center items-center flex overflow-y-scroll">
                    <div className="relative w-fit h-fit justify-center items-center gap-3 flex flex-wrap">
                      {gates?.erc721?.map((erc721: Creation, index: number) => {
                        return (
                          <div
                            key={index}
                            className="relative w-32 h-32 flex items-center justify-center gap-1 cursor-pointer active:scale-95 border border-girasol rounded-sm"
                            onClick={() =>
                              window.open(
                                `https://cypher.digitalax.xyz/item/${
                                  numberToItemTypeMap[Number(erc721?.origin)]
                                }/${erc721?.collectionMetadata?.title?.replaceAll(
                                  " ",
                                  "_"
                                )}`
                              )
                            }
                            id="northern"
                          >
                            <div className="relative w-full h-full flex items-center justify-center rounded-sm">
                              <Image
                                draggable={false}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-sm"
                                src={`${INFURA_GATEWAY}/ipfs/${
                                  erc721?.collectionMetadata?.mediaCover
                                    ? erc721?.collectionMetadata?.mediaCover?.split(
                                        "ipfs://"
                                      )?.[1]
                                    : erc721?.collectionMetadata?.images?.[0].split(
                                        "ipfs://"
                                      )?.[1]
                                }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestGates;
