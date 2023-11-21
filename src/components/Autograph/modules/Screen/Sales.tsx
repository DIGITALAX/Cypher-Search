import { FunctionComponent } from "react";
import { Sale, SalesProps } from "../../types/autograph.types";
import Image from "next/legacy/image";
import Link from "next/link";
import {
  ACCEPTED_TOKENS_MUMBAI,
  INFURA_GATEWAY,
  numberToItemTypeMap,
} from "../../../../../lib/constants";
import createProfilePicture from "../../../../../lib/helpers/createProfilePicture";

const Sales: FunctionComponent<SalesProps> = ({
  allSales,
  salesLoading,
  router,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative flex w-4/5 h-fit items-start justify-center rounded-sm">
        <div
          className="relative w-full h-full flex flex-col items-center justify-start gap-5 p-px"
          id="pfp"
        >
          <div
            className={`relative w-full h-full bg-blurs flex bg-cover rounded-sm p-3 items-start justify-center overflow-y-scroll min-h-[35rem] max-h-[35rem] ${
              (salesLoading || allSales?.length > 0) ? "items-start" : "items-center"
            }`}
          >
            {salesLoading ? (
              <div className="relative w-full h-fit flex flex-col gap-5 items-center justify-start animate-pulse">
                {Array.from({ length: 10 })?.map((_, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative w-1/2 h-44 flex flex-col items-center justify-start border border-humor rounded-sm  bg-offBlack gap-3"
                      id="staticLoad"
                    ></div>
                  );
                })}
              </div>
            ) : allSales?.length > 0 ? (
              <div className="relative w-full h-fit flex flex-col gap-5 items-center justify-start">
                {allSales?.map((sale: Sale, index: number) => {
                  const profilePicture = createProfilePicture(
                    sale?.buyer?.metadata?.picture
                  );
                  return (
                    <div
                      key={index}
                      className="relative w-full h-fit flex flex-col items-center justify-start border border-humor rounded-sm bg-offBlack gap-3"
                    >
                      <div className="relative w-full h-44 flex flex-row justify-between items-center p-2">
                        <div className="relative justify-center items-start flex flex-col font-ignite gap-2">
                          <div className="relative justify-center items-center flex w-fit h-fit text-white text-xl">
                            Order {sale?.orderId}
                          </div>
                          <div className="relative justify-center items-center flex flex-row gap-1 w-fit h-fit text-sol text-sm">
                            <div className="relative w-fit h-fit flex items-center justify-center text-white">
                              Block:
                            </div>
                            <div className="relative w-fit h-fit flex items-center justify-center">
                              {sale?.blockTimestamp}
                            </div>
                          </div>
                          <div className="relative justify-center items-center flex flex-row gap-1 w-fit h-fit text-sol text-sm">
                            <div className="relative w-fit h-fit flex items-center justify-center text-white">
                              Tx:
                            </div>
                            <Link
                              target="_blank"
                              rel="noreferrer"
                              href={`https://polygonscan.com/tx/${sale?.transactionHash}`}
                              className="relative w-fit h-fit flex items-center justify-center cursor-pointer"
                            >
                              {sale?.transactionHash?.slice(0, 10) + "..."}
                            </Link>
                          </div>
                          <div className="relative justify-center items-center flex flex-row gap-1 w-fit h-fit text-white text-sm">
                            <div
                              className="relative flex flex-row w-6 h-6 items-center justify-start rounded-full border border-offWhite cursor-pointer"
                              onClick={() =>
                                router.push(
                                  `/autograph/${sale?.buyer?.handle?.suggestedFormatted?.localName}`
                                )
                              }
                            >
                              {profilePicture && (
                                <Image
                                  layout="fill"
                                  draggable={false}
                                  src={profilePicture}
                                  objectFit="cover"
                                  className="rounded-full"
                                />
                              )}
                            </div>
                            <div className="relative w-fit h-fit flex items-center justify-center">
                              {
                                sale?.buyer?.handle?.suggestedFormatted
                                  ?.localName
                              }
                            </div>
                          </div>
                          <div className="relative justify-center w-fit h-full items-end flex flex-col font-ignite gap-1">
                            <div className="relative justify-center items-center flex flex-row gap-1 w-fit h-fit text-white text-sm">
                              <div className="relative w-fit h-fit flex items-center justify-center">
                                {sale?.price}
                              </div>
                              <div className="relative w-fit h-fit flex items-center justify-center">
                                {
                                  ACCEPTED_TOKENS_MUMBAI.find(
                                    (item) => item[2] === sale?.currency
                                  )?.[1]
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative w-fit h-fit flex flex-row flex items-center justify-center gap-3">
                          {sale?.images

                            ?.slice(0, 2)
                            ?.map((image: string, index: number) => {
                              return (
                                <div
                                  className="relative w-40 h-40 rounded-md border border-white flex items-center cursor-pointer justify-center"
                                  key={index}
                                  onClick={() =>
                                    router.push(
                                      `/item/${
                                        numberToItemTypeMap[Number(sale?.type)]
                                      }/${sale?.pubId}`
                                    )
                                  }
                                >
                                  <Image
                                    layout="fill"
                                    objectFit="cover"
                                    src={`${INFURA_GATEWAY}/ipfs/${
                                      image?.split("ipfs://")?.[1]
                                    }`}
                                    className="rounded-md"
                                  />
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="relative w-1/2 h-fit flex items-center justify-center font-ignite text-xl text-white text-center break-words">
                Your sales ledger remains untapped. Ready to fill more orders?
                Expand your collection by minting new prints and apparel.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
