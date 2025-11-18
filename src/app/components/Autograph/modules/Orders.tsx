import { FunctionComponent, JSX, useContext } from "react";
import Link from "next/link";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import {
  ACCEPTED_TOKENS,
  INFURA_GATEWAY,
  numberToItemTypeMap,
} from "@/app/lib/constants";
import { Account } from "@lens-protocol/client";
import useOrders from "../hooks/useOrders";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { useRouter } from "next/navigation";
import { ModalContext } from "@/app/providers";

const Orders: FunctionComponent<{
  dict: any;
  profile: Account | undefined;
}> = ({ dict, profile }): JSX.Element => {
  const {
    ordersLoading,
    orders,
    decryptLoading,
    handleDecrypt,
    orderOpen,
    setOrderOpen,
  } = useOrders(profile, dict);
  const router = useRouter();
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative flex w-full tablet:w-4/5 h-fit items-start justify-center rounded-sm">
        <div
          className="relative w-full h-full flex flex-col items-center justify-start gap-5 p-px"
          id="pfp"
        >
          <div
            className={`relative w-full bg-blurs flex bg-cover rounded-sm p-3 items-start justify-center overflow-y-scroll h-[50rem] tablet:h-[35rem] ${
              ordersLoading || orders?.length > 0
                ? "items-start"
                : "items-center"
            }`}
          >
            {ordersLoading ? (
              <div className="relative w-full h-fit flex flex-col gap-5 items-center justify-start animate-pulse overflow-y-scroll">
                {Array.from({ length: 10 })?.map((_, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative w-1/2 h-40 flex flex-col items-center justify-start border border-humor rounded-sm bg-offBlack gap-3"
                      id="staticLoad"
                    ></div>
                  );
                })}
              </div>
            ) : orders?.length > 0 ? (
              <div className="relative w-full h-fit flex flex-col gap-5 items-center justify-start">
                {orders?.map((order, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative w-full h-fit flex flex-col items-center justify-start border border-humor rounded-sm bg-offBlack"
                    >
                      <div className="relative w-full h-fit md:h-28 flex md:flex-nowrap flex-wrap flex-row justify-between items-center p-2 gap-6">
                        <div className="relative justify-center items-start flex flex-col font-ignite gap-2">
                          <div className="relative justify-center items-center flex w-fit h-fit text-white text-xl">
                            {dict?.od} {orders?.length - index}
                          </div>
                          <div className="relative justify-center items-center flex flex-row gap-1 w-fit h-fit text-sol text-sm">
                            <div className="relative w-fit h-fit flex items-center justify-center text-white">
                              {dict?.block}
                            </div>
                            <div className="relative w-fit h-fit flex items-center justify-center">
                              {order?.blockTimestamp}
                            </div>
                          </div>
                          <div className="relative justify-center items-center flex flex-row gap-1 w-fit h-fit text-sol text-sm">
                            <div className="relative w-fit h-fit flex items-center justify-center text-white">
                              Tx:
                            </div>
                            <Link
                              target="_blank"
                              rel="noreferrer"
                              href={`https://explorer.lens.xyz/tx/${order?.transactionHash}`}
                              className="relative w-fit h-fit flex items-center justify-center cursor-pointer break-all"
                            >
                              {order?.transactionHash?.slice(0, 30) + "..."}
                            </Link>
                          </div>
                        </div>
                        <div className="relative justify-between w-fit h-full items-start md:items-end flex flex-col font-ignite gap-1">
                          <div className="relative justify-center items-center flex flex-row gap-1 w-fit h-fit text-white text-sm">
                            <div className="relative w-fit h-fit flex items-center justify-center">
                              ${order?.totalPrice}
                            </div>
                            <div className="relative w-fit h-fit flex items-center justify-center">
                              ||
                            </div>
                            <div className="relative w-fit h-fit flex items-center justify-center">
                              {`Currency ( ${
                                ACCEPTED_TOKENS.find(
                                  (item) => item[2] === order?.currency
                                )?.[1]
                              } )`}
                            </div>
                          </div>
                          <div className="relative w-fit h-fit flex flex-row flex items-center justify-center gap-3">
                            <div
                              className={`relative w-4 h-3 flex items-center justify-center cursor-pointer active:scale-95 ${
                                orderOpen && "rotate-90"
                              }`}
                              key={index}
                              onClick={() =>
                                setOrderOpen((prev) => {
                                  let arr = [...prev];
                                  arr[index] = !arr[index];

                                  return arr;
                                })
                              }
                            >
                              <Image
                                layout="fill"
                                draggable={false}
                                src={`${INFURA_GATEWAY}/ipfs/QmRKmMYJj7KAwf4BDGwrd51tKWoS8djnLGWT5XNdrJMztk`}
                              />
                            </div>
                            <div
                              className="relative w-10 h-10 rounded-md border border-white flex items-center justify-center"
                              key={index}
                            >
                              <Image
                                layout="fill"
                                objectFit="cover"
                                src={`${INFURA_GATEWAY}/ipfs/${
                                  order?.collection?.metadata?.images?.[0]?.split(
                                    "ipfs://"
                                  )?.[1]
                                }`}
                                className="rounded-md"
                                onError={(e) => handleImageError(e)}
                                draggable={false}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {orderOpen && (
                        <div className="relative w-full h-fit flex items-start justify-start flex-col p-2 gap-5">
                          <div className="relative w-full h-px bg-white"></div>
                          <div className="relative w-full h-fit flex flex-col items-start justify-start font-aust text-white gap-7">
                            {order?.details && (
                              <div className="relative w-full h-fit flex flex-col items-start justify-start font-aust text-white gap-4">
                                <div className="relative w-fit h-fit flex items-start justify-start">
                                  {dict?.ord}
                                </div>
                                <div className="relative flex flex-row items-start justify-between w-full h-fit gap-6">
                                  <div className="relative w-fit h-fit flex items-start justify-start flex-row flex-wrap gap-4">
                                    {[
                                      dict?.nam,
                                      dict?.coun,
                                      dict?.addr,
                                      dict?.zip,
                                      dict?.city,
                                      dict?.state,
                                      dict?.country,
                                    ].map((item: string, indexTwo: number) => {
                                      return (
                                        <div
                                          key={indexTwo}
                                          className="relative w-fit h-fit flex flex-col items-start justify-start gap-1"
                                        >
                                          <div className="relative w-fit h-fit flex text-sol text-xs break-words">
                                            {item}
                                          </div>
                                          <div className="relative w-fit h-fit flex text-xxs">
                                            {order?.decrypted
                                              ? (order?.details as any)?.[
                                                  item?.toLowerCase()
                                                ]
                                              : "%$70hg$LeeTdf"}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div
                                    className={`relative h-8 w-20 border border-white bg-sol/50 text-white font-aust flex items-center justify-center text-sm ${
                                      !decryptLoading && !order?.decrypted
                                        ? "cursor-pointer active:scale-95"
                                        : "opacity-70"
                                    }`}
                                    onClick={() =>
                                      !decryptLoading &&
                                      !order?.decrypted &&
                                      handleDecrypt(index)
                                    }
                                  >
                                    <div
                                      className={`${
                                        decryptLoading && "animate-spin"
                                      } w-fit h-fit flex items-center justify-center`}
                                    >
                                      {" "}
                                      {decryptLoading ? (
                                        <AiOutlineLoading
                                          color="white"
                                          size={12}
                                        />
                                      ) : !order?.decrypted ? (
                                        dict?.dec
                                      ) : (
                                        dict?.decd
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="relative w-full h-fit flex flex-col items-start justify-start font-aust text-white gap-4">
                              <div className="relative w-fit h-fit flex items-start justify-start">
                                {dict?.mes}
                              </div>
                              <div className="relative flex flex-row items-start justify-between w-full h-fit gap-6">
                                <div className="relative w-fit h-fit flex items-start justify-start flex-col flex-wrap gap-4">
                                  {order?.messages?.length > 0 ? (
                                    order?.messages?.map(
                                      (item: string, indexTwo: number) => {
                                        return (
                                          <div
                                            key={indexTwo}
                                            className="relative w-fit h-fit flex flex-col items-start justify-start gap-1 break-words"
                                          >
                                            <div className="relative w-fit h-fit flex text-sol text-xs">
                                              {item}
                                            </div>
                                          </div>
                                        );
                                      }
                                    )
                                  ) : (
                                    <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1 break-words">
                                      <div className="relative w-fit h-fit flex text-sol text-xs">
                                        {dict?.mens}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="relative w-full h-fit flex md:flex-nowrap flex-wrap flex-row items-center justify-between gap-3">
                            <div className="relative w-fit h-fit flex items-center justify-center">
                              <div
                                className="relative flex w-20 h-20 rounded-sm border border-white cursor-pointer"
                                onClick={() => {
                                  context?.setFiltersOpen({
                                    value: false,
                                    allow: false,
                                  });
                                  router.push(
                                    `/item/${
                                      numberToItemTypeMap[
                                        Number(order?.collection?.origin)
                                      ]
                                    }/${order?.collection?.metadata?.title?.replaceAll(
                                      " ",
                                      "_"
                                    )}`
                                  );
                                }}
                              >
                                <Image
                                  layout="fill"
                                  src={`${INFURA_GATEWAY}/ipfs/${
                                    order?.collection?.metadata?.images?.[0]?.split(
                                      "ipfs://"
                                    )?.[1]
                                  }`}
                                  onError={(e) => handleImageError(e)}
                                  className="rounded-md"
                                  objectFit="cover"
                                  draggable={false}
                                />
                              </div>
                            </div>
                            <div className="relative w-full h-fit flex items-center justify-between gap-3 flex-wrap md:flex-nowrap">
                              <div className="relative flex w-fit h-fit items-center justify-center text-sm font-bit text-white">
                                $
                                {Number(order?.collection?.price) /
                                  Number(order?.collection?.amount)}
                              </div>
                              <div className="relative flex w-fit h-fit items-center justify-center text-sm font-bit text-white">
                                {order?.isFulfilled || !order?.fulfillment
                                  ? dict?.fuld
                                  : dict?.fulg}
                              </div>
                              <div className="relative flex w-fit h-fit items-center justify-center text-sm font-bit text-white">
                                {dict?.cant}
                                {order?.collection?.amount}
                              </div>
                              {order?.fulfillment && (
                                <div
                                  className={`relative flex h-7 border border-white p-px items-center justify-center font-bit text-white ${
                                    ["xs", "s", "m", "l", "xl", "2xl"].includes(
                                      order?.fulfillment?.tamano?.toLowerCase() ||
                                        ""
                                    ) || !order?.decrypted
                                      ? "rounded-full w-7 text-sm"
                                      : "w-fit px-1 rounded-sm text-xxs"
                                  }`}
                                >
                                  {order?.fulfillment?.tamano &&
                                  order?.decrypted
                                    ? order?.fulfillment?.tamano
                                    : "??"}
                                </div>
                              )}
                              {order?.details && (
                                <div
                                  className={`relative flex w-7 h-7 border border-white p-px rounded-full items-center justify-center text-sm font-bit text-white`}
                                  style={{
                                    backgroundColor:
                                      order?.fulfillment?.color &&
                                      order?.decrypted
                                        ? `${order?.fulfillment?.color}`
                                        : "#131313",
                                  }}
                                >
                                  {(!order?.fulfillment?.color ||
                                    !order?.decrypted) &&
                                    "?"}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="relative w-1/2  h-full flex items-center justify-center font-ignite text-xl text-white text-center break-words">
                {dict?.orderBook}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
