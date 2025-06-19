import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import handleImageError from "@/app/lib/helpers/handleImageError";
import {
  ACCEPTED_TOKENS,
  INFURA_GATEWAY,
  numberToItemTypeMap,
} from "@/app/lib/constants";
import { useRouter } from "next/navigation";
import { Account } from "@lens-protocol/client";
import useSales from "../hooks/useSales";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { ModalContext } from "@/app/providers";

const Sales: FunctionComponent<{ dict: any; profile: Account | undefined }> = ({
  dict,
  profile,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  const { salesLoading, sales } = useSales(profile);
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative flex w-full tablet:w-4/5 h-fit items-start justify-center rounded-sm">
        <div
          className="relative w-full h-full flex flex-col items-center justify-start gap-5 p-px"
          id="pfp"
        >
          <div
            className={`relative w-full bg-blurs flex bg-cover rounded-sm p-3 items-start justify-center overflow-y-scroll h-[50rem] tablet:h-[35rem] ${
              salesLoading || sales?.length > 0 ? "items-start" : "items-center"
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
            ) : sales?.length > 0 ? (
              <div className="relative w-full h-fit flex flex-col gap-5 items-center justify-start">
                {sales?.map((sale, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative w-full h-fit flex flex-col items-center justify-start border border-humor rounded-sm bg-offBlack"
                    >
                      <div className="relative w-full h-fit md:h-44 flex md:flex-nowrap flex-wrap flex-row justify-between items-center p-2  gap-6">
                        <div className="relative justify-center items-start flex flex-col font-ignite gap-2">
                          <div className="relative w-fit h-fit gap-2 flex items-center justify-center flex-row">
                            <div className="relative justify-center items-center flex w-fit h-fit text-white text-xl">
                              {dict?.od} {sales?.length - index}
                            </div>
                            <div className="relative w-fit h-fit flex items-center justify-center text-sol">
                              {dict?.cant} {sale?.amount}
                            </div>
                          </div>
                          <div className="relative justify-center items-center flex flex-row gap-1 w-fit h-fit text-sol text-sm">
                            <div className="relative w-fit h-fit flex items-center justify-center text-white">
                              {dict?.block}
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
                              href={`https://explorer.lens.xyz/tx/${sale?.transactionHash}`}
                              className="relative w-fit h-fit flex items-center justify-center cursor-pointer break-all"
                            >
                              {sale?.transactionHash?.slice(0, 30) + "..."}
                            </Link>
                          </div>
                          <div className="relative justify-center items-center flex flex-row gap-1 w-fit h-fit text-white text-sm">
                            <div
                              id="pfp"
                              className="relative flex flex-row w-6 h-6 items-center justify-start rounded-full border border-offWhite cursor-pointer"
                              onClick={() => {
                                context?.setFiltersOpen({
                                  value: false,
                                  allow: false,
                                });
                                router.push(
                                  `/autograph/${sale?.profile?.username?.localName}`
                                );
                              }}
                            >
                              <Image
                                layout="fill"
                                draggable={false}
                                src={handleProfilePicture(
                                  sale?.profile?.metadata?.picture
                                )}
                                key={sale?.profile?.metadata?.picture}
                                objectFit="cover"
                                className="rounded-full"
                                onError={(e) => handleImageError(e)}
                              />
                            </div>
                            <div className="relative w-fit h-fit flex items-center justify-center">
                              {sale?.profile?.username?.localName}
                            </div>
                          </div>
                          <div className="relative justify-center w-fit h-full items-end flex flex-col font-ignite gap-1">
                            <div className="relative justify-center items-center flex flex-row gap-1 w-fit h-fit text-white text-sm">
                              <div className="relative w-fit h-fit flex items-center justify-center">
                                ${Number(sale?.totalPrice) / 10 ** 18}
                              </div>
                              <div className="relative w-fit h-fit flex items-center justify-center">
                                {`Currency (${
                                  ACCEPTED_TOKENS.find(
                                    (item) => item[2] === sale?.currency
                                  )?.[1]
                                })`}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative w-full md:w-fit h-fit flex flex-row flex items-center justify-start gap-3">
                          {sale?.collection?.metadata?.images

                            ?.slice(0, 2)
                            ?.map((image: string, index: number) => {
                              return (
                                <div
                                  className="relative w-full sm:w-40 h-40 rounded-md border border-white flex items-center cursor-pointer justify-center"
                                  key={index}
                                  onClick={() => {
                                    context?.setFiltersOpen({
                                      value: false,
                                      allow: false,
                                    });
                                    router.push(
                                      `/item/${
                                        sale?.collection?.printType == "4"
                                          ? "coinop"
                                          : numberToItemTypeMap[
                                              Number(
                                                sale?.collection?.printType
                                              )
                                            ]
                                      }/${sale?.postId}`
                                    );
                                  }}
                                >
                                  <Image
                                    layout="fill"
                                    objectFit="cover"
                                    src={`${INFURA_GATEWAY}/ipfs/${
                                      image?.split("ipfs://")?.[1]
                                    }`}
                                    className="rounded-md"
                                    onError={(e) => handleImageError(e)}
                                    draggable={false}
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
              <div className="relative w-1/2  h-full flex items-center justify-center font-ignite text-xl text-white text-center break-words">
                {dict?.ledger}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
