import { FunctionComponent } from "react";
import { Order, OrdersProps, Sub } from "../../types/autograph.types";
import Link from "next/link";
import { ACCEPTED_TOKENS, INFURA_GATEWAY } from "../../../../../lib/constants";
import Image from "next/legacy/image";
import SubOrder from "./SubOrder";
import handleImageError from "../../../../../lib/helpers/handleImageError";
import { AiOutlineLoading } from "react-icons/ai";

const Orders: FunctionComponent<OrdersProps> = ({
  allOrders,
  orderActions,
  decryptOrder,
  setOrderActions,
  ordersLoading,
  t,
  router,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative flex w-full tablet:w-4/5 h-fit items-start justify-center rounded-sm">
        <div
          className="relative w-full h-full flex flex-col items-center justify-start gap-5 p-px"
          id="pfp"
        >
          <div
            className={`relative w-full bg-blurs flex bg-cover rounded-sm p-3 items-start justify-center overflow-y-scroll h-[50rem] tablet:h-[35rem] ${
              ordersLoading || allOrders?.length > 0
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
            ) : allOrders?.length > 0 ? (
              <div className="relative w-full h-fit flex flex-col gap-5 items-center justify-start">
                {allOrders?.map((order: Order, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative w-full h-fit flex flex-col items-center justify-start border border-humor rounded-sm bg-offBlack"
                    >
                      <div className="relative w-full h-fit md:h-28 flex md:flex-nowrap flex-wrap flex-row justify-between items-center p-2 gap-6">
                        <div className="relative justify-center items-start flex flex-col font-ignite gap-2">
                          <div className="relative justify-center items-center flex w-fit h-fit text-white text-xl">
                            {t("od")} {allOrders?.length - index}
                          </div>
                          <div className="relative justify-center items-center flex flex-row gap-1 w-fit h-fit text-sol text-sm">
                            <div className="relative w-fit h-fit flex items-center justify-center text-white">
                              {t("block")}
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
                              href={`https://polygonscan.com/tx/${order?.transactionHash}`}
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
                          <div className="relative justify-center items-center flex flex-row gap-1 w-fit h-fit text-sol text-sm">
                            <div className="relative w-fit h-fit flex items-center justify-center">
                              {order?.subOrders?.reduce(
                                (sum, item) => sum + Number(item?.amount),
                                0
                              )}
                            </div>
                            <div className="relative w-fit h-fit flex items-center justify-center">
                              {t("items")}
                            </div>
                          </div>
                          <div className="relative w-fit h-fit flex flex-row flex items-center justify-center gap-3">
                            <div
                              className={`relative w-4 h-3 flex items-center justify-center cursor-pointer active:scale-95 ${
                                orderActions?.[index]?.orderOpen && "rotate-90"
                              }`}
                              key={index}
                              onClick={() =>
                                setOrderActions((prev) => {
                                  const updatedArray = [...prev];
                                  updatedArray[index] = {
                                    ...updatedArray[index],
                                    orderOpen: !updatedArray[index]?.orderOpen,
                                  };
                                  return updatedArray;
                                })
                              }
                            >
                              <Image
                                layout="fill"
                                draggable={false}
                                src={`${INFURA_GATEWAY}/ipfs/QmRKmMYJj7KAwf4BDGwrd51tKWoS8djnLGWT5XNdrJMztk`}
                              />
                            </div>
                            {order?.subOrders
                              ?.slice(0, 2)
                              ?.map((item) => item?.collection?.image)
                              ?.map((image: string, index: number) => {
                                return (
                                  <div
                                    className="relative w-10 h-10 rounded-md border border-white flex items-center justify-center"
                                    key={index}
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
                      {orderActions?.[index]?.orderOpen && (
                        <div className="relative w-full h-fit flex items-start justify-start flex-col p-2 gap-5">
                          <div className="relative w-full h-px bg-white"></div>
                          <div className="relative w-full h-fit flex flex-col items-start justify-start font-aust text-white gap-7">
                            {order?.details && (
                              <div className="relative w-full h-fit flex flex-col items-start justify-start font-aust text-white gap-4">
                                <div className="relative w-fit h-fit flex items-start justify-start">
                                 {t("ord")}
                                </div>
                                <div className="relative flex flex-row items-start justify-between w-full h-fit gap-6">
                                  <div className="relative w-fit h-fit flex items-start justify-start flex-row flex-wrap gap-4">
                                    {[
                                      t("nam"),
                                      t("coun"),
                                      t("addr"),
                                      t("zip"),
                                      t("city"),
                                      t("state"),
                                      t("country"),
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
                                      !orderActions?.[index]?.decryptLoading &&
                                      !order?.decrypted
                                        ? "cursor-pointer active:scale-95"
                                        : "opacity-70"
                                    }`}
                                    onClick={() =>
                                      !orderActions?.[index]?.decryptLoading &&
                                      !order?.decrypted &&
                                      decryptOrder(order?.orderId)
                                    }
                                  >
                                    <div
                                      className={`${
                                        orderActions?.[index]?.decryptLoading &&
                                        "animate-spin"
                                      } w-fit h-fit flex items-center justify-center`}
                                    >
                                      {" "}
                                      {orderActions?.[index]?.decryptLoading ? (
                                        <AiOutlineLoading
                                          color="white"
                                          size={12}
                                        />
                                      ) : !order?.decrypted ? (
                                        t("dec")
                                      ) : (
                                        t("decd")
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="relative w-full h-fit flex flex-col items-start justify-start font-aust text-white gap-4">
                              <div className="relative w-fit h-fit flex items-start justify-start">
                                {t("mes")}
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
                                        {t("mens")}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          {order?.subOrders?.map((item: Sub, index: number) => {
                            return (
                              <SubOrder
                                t={t}
                                router={router}
                                item={item}
                                key={index}
                                decrypted={order?.decrypted}
                                details={order?.details ? true : false}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="relative w-1/2 h-fit flex items-center justify-center font-ignite text-xl text-white text-center break-words">
                Your orderbook is quiet. Collect prints and apparel to catch up
                on fulfillment.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
