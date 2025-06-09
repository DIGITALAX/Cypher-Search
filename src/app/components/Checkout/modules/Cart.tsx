import { FunctionComponent, JSX, useContext, useEffect, useState } from "react";
import Image from "next/legacy/image";
import { ImCross } from "react-icons/im";
import lodash from "lodash";
import { ModalContext } from "@/app/providers";
import { setCypherStorageCart } from "@/app/lib/utils";
import {
  ACCEPTED_TOKENS,
  INFURA_GATEWAY,
  printTypeToString,
} from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import MediaSwitch from "../../Common/modules/MediaSwitch";
import { CartProps } from "../types/checkout.types";
import { PrintType } from "../../Common/types/common.types";

const Cart: FunctionComponent<CartProps> = ({
  dict,
  setChooseCartItem,
  chooseCartItem,
  collectPostLoading,
  encrypted,
  details,
  setDetails,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const [chosenItems, setChosenItems] = useState<{
    size: string;
    color: string;
    currency: string;
  }>({
    size: "",
    color: "",
    currency: "",
  });

  useEffect(() => {
    setChosenItems({ size: "", color: "", currency: "" });
  }, [chooseCartItem]);

  return (
    <div className="relative w-full h-[95vh] relative flex items-start justify-center flex-row gap-4 xl:flex-nowrap flex-wrap overflow-y-scroll">
      <div className="relative w-full h-fit max-h-[14rem] xl:max-h-full xl:h-full flex flex-col items-center justify-start overflow-y-scroll ">
        <div className="relative w-full flex h-fit items-start justify-start flex">
          <div className="relative items-center justify-start flex flex-col gap-3 h-fit w-full">
            {context?.cartItems?.map((item, index: number) => {
              return (
                <div
                  key={index}
                  className={`relative w-full h-12 flex flex-row gap-5 font-bit text-white text-xs justify-between items-center px-1.5 bg-sol/20 rounded-md`}
                >
                  {item?.item?.metadata?.colors && (
                    <div
                      className="relative w-4 h-4 border border-ligero flex justify-start items-center rounded-full"
                      style={{
                        backgroundColor: item?.color,
                      }}
                    ></div>
                  )}
                  {item?.item?.metadata?.sizes && (
                    <div className="relative w-fit h-fit flex justify-start items-center uppercase">
                      {item?.size}
                    </div>
                  )}
                  <div className="relative w-fit h-fit text-ama flex whitespace-nowrap items-center justify-center">
                    USD {item?.item?.price}
                  </div>
                  <div className="relative w-fit h-fit text-ama flex items-center justify-center">
                    {dict?.cant} x {item?.buyAmount}
                  </div>
                  <div className="relative w-fit h-full flex items-center justify-center ml-auto gap-3">
                    <div className="relative w-fit h-full flex flex-row items-center justify-center gap-1.5">
                      <div className="relative w-5 h-5 flex items-center justify-center">
                        <Image
                          src={`${INFURA_GATEWAY}/ipfs/${
                            ACCEPTED_TOKENS?.find(
                              (tok) =>
                                tok[2]?.toLowerCase() ==
                                item?.currency?.toLowerCase()
                            )?.[0]
                          }`}
                          layout="fill"
                          draggable={false}
                        />
                      </div>
                      <div
                        className="relative w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center rotate-90"
                        onClick={() => {
                          if (
                            collectPostLoading ||
                            (encrypted?.length == context?.cartItems?.length &&
                              Number(
                                context?.cartItems?.filter(
                                  (item) => item?.item?.origin == "0"
                                )?.length
                              ) > 0)
                          )
                            return;

                          if (
                            Number(item?.item?.tokenIdsMinted?.length || 0) +
                              1 +
                              Number(
                                context?.cartItems
                                  ?.filter(
                                    (value) =>
                                      item?.item?.postId == value?.item?.postId
                                  )
                                  ?.map((item) => item?.buyAmount)
                                  ?.reduce((sum, item) => sum + Number(item), 0)
                              ) >
                            Number(item?.item?.amount)
                          ) {
                            context?.setModalOpen(dict?.lim);
                            return;
                          }

                          context?.setCartItems([
                            ...context?.cartItems.slice(0, index),
                            {
                              ...item,
                              buyAmount: item?.buyAmount + 1,
                            },
                            ...context?.cartItems.slice(index + 1),
                          ]);

                          setCypherStorageCart(
                            JSON.stringify([
                              ...(context?.cartItems.slice(0, index) || []),
                              {
                                ...item,
                                buyAmount: Number(item?.buyAmount) + 1,
                              },
                              ...(context?.cartItems.slice(index + 1) || []),
                            ])
                          );
                        }}
                      >
                        <Image
                          src={`${INFURA_GATEWAY}/ipfs/Qma3jm41B4zYQBxag5sJSmfZ45GNykVb8TX9cE3syLafz2`}
                          layout="fill"
                          draggable={false}
                        />
                      </div>
                      <div
                        className="relative w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center rotate-90"
                        onClick={() => {
                          if (
                            collectPostLoading ||
                            (encrypted?.length == context?.cartItems?.length &&
                              Number(
                                context?.cartItems?.filter(
                                  (item) => item?.item?.origin == "0"
                                )?.length
                              ) > 0)
                          )
                            return;

                          const newCart =
                            Number(item?.buyAmount) > 1
                              ? [
                                  ...(context?.cartItems.slice(0, index) || []),
                                  {
                                    ...item,
                                    buyAmount: Number(item?.buyAmount) - 1,
                                  },
                                  ...(context?.cartItems.slice(index + 1) ||
                                    []),
                                ]
                              : [
                                  ...(context?.cartItems.slice(0, index) || []),
                                  ...(context?.cartItems.slice(index + 1) ||
                                    []),
                                ];
                          context?.setCartItems(newCart);
                          setCypherStorageCart(JSON.stringify(newCart));
                        }}
                      >
                        <Image
                          src={`${INFURA_GATEWAY}/ipfs/QmcBVNVZWGBDcAxF4i564uSNGZrUvzhu5DKkXESvhY45m6`}
                          layout="fill"
                          draggable={false}
                        />
                      </div>
                    </div>
                    <div
                      className="justify-end items-center w-fit h-fit flex cursor-pointer active:scale-95"
                      onClick={() => {
                        if (collectPostLoading) return;
                        const newCart = lodash.concat(
                          lodash.slice(
                            [...(context?.cartItems || [])],
                            0,
                            index
                          ),
                          lodash.slice(
                            [...(context?.cartItems || [])],
                            index + 1
                          )
                        );
                        context?.setCartItems(newCart);
                        setCypherStorageCart(JSON.stringify(newCart));
                      }}
                    >
                      <ImCross color="white" size={10} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="relative w-full h-full relative flex items-start justify-center overflow-y-scroll">
        <div className="relative w-full h-fit flex flex-col items-center justify-start gap-5">
          {context?.cartItems
            ?.filter(
              (item, index, self) =>
                index ===
                self.findIndex((t) => t.item?.postId === item.item?.postId)
            )
            ?.map((currentItem, index: number) => {
              return (
                <div
                  key={index}
                  className={`relative w-full h-fit flex flex-col items-center justify-center border border-sol rounded-md gap-3 p-4 cursor-pointer bg-black ${
                    currentItem?.item?.postId !==
                      context?.cartItems?.[chooseCartItem]?.item?.postId! &&
                    "opacity-50"
                  }`}
                  onClick={() => setChooseCartItem(index)}
                >
                  <div className="relative w-4/5 h-fit flex items-center flex-col sm:flex-row justify-center sm:justify-between gap-2">
                    {currentItem?.item?.profile?.username?.localName && (
                      <div className="relative w-fit h-fit gap-2 flex items-center justify-start flex-row text-sm">
                        <div className="relative w-fit h-fit flex items-center">
                          <div
                            className="relative w-5 h-5 font-aust flex items-center rounded-full justify-center"
                            id="pfp"
                          >
                            <Image
                              layout="fill"
                              src={handleProfilePicture(
                                currentItem?.item?.profile?.metadata?.picture
                              )}
                              key={
                                currentItem?.item?.profile?.metadata?.picture
                              }
                              draggable={false}
                              objectFit="cover"
                              className="rounded-full"
                              onError={(e) => handleImageError(e)}
                            />
                          </div>
                        </div>
                        <div className="relative w-fit h-fit text-white font-bit flex items-center justify-center">
                          {currentItem?.item?.profile?.username?.localName}
                        </div>
                      </div>
                    )}
                    <div className="relative w-fit h-fit text-center items-center justify-end sm:ml-auto flex font-bit text-white top-px text-sm sm:text-base">
                      {currentItem?.item?.metadata?.title?.length > 20
                        ? currentItem?.item?.metadata?.title?.slice(0, 20) +
                          "..."
                        : currentItem?.item?.metadata?.title}
                    </div>
                  </div>
                  <div className="relative w-4/5 h-72 flex items-center justify-center border border-white rounded-md">
                    <MediaSwitch
                      type={
                        currentItem?.item?.metadata?.mediaTypes?.[0] == "video"
                          ? "video"
                          : currentItem?.item?.metadata?.mediaTypes?.[0] ==
                            "audio"
                          ? "audio"
                          : "image"
                      }
                      hidden
                      classNameImage={"rounded-md w-full h-full flex relative"}
                      classNameVideo={{
                        objectFit: "cover",
                        display: "flex",
                        width: "100%",
                        height: "18rem",
                        alignItems: "center",
                        justifyItems: "center",
                        borderRadius: "0.375rem",
                        position: "relative",
                      }}
                      classNameAudio={"rounded-md w-full h-full flex relative"}
                      srcUrl={
                        currentItem?.item?.metadata?.mediaTypes?.[0] == "video"
                          ? currentItem?.item?.metadata?.video
                          : currentItem?.item?.metadata?.mediaTypes?.[0] ==
                            "audio"
                          ? `${INFURA_GATEWAY}/ipfs/${
                              currentItem?.item?.metadata?.audio?.split(
                                "ipfs://"
                              )?.[1]
                            }`
                          : `${INFURA_GATEWAY}/ipfs/${
                              currentItem?.item?.metadata?.images?.[0]?.split(
                                "ipfs://"
                              )?.[1]
                            }`
                      }
                      srcCover={
                        currentItem?.item?.metadata?.mediaCover
                          ? `${INFURA_GATEWAY}/ipfs/${
                              currentItem?.item?.metadata?.mediaCover?.split(
                                "ipfs://"
                              )?.[1]
                            }`
                          : undefined
                      }
                    />
                  </div>
                  <div className="relative flex flex-col gap-2 w-full h-fit items-center justify-center font-bit text-white z-1 pt-4">
                    <div className="relative flex w-full h-fit items-center justify-center font-bit text-white z-1 pt-4">
                      <div className="relative flex flex-row flex-wrap items-center justify-center gap-2 w-full h-fit">
                        {ACCEPTED_TOKENS?.filter((item) =>
                          currentItem?.item?.acceptedTokens
                            ?.map((item) => item?.toLowerCase())
                            ?.includes(item[2]?.toLowerCase())
                        )?.map((token, index: number) => {
                          return (
                            <div
                              key={index}
                              className={`relative w-fit h-fit border border-white p-px cursor-pointer flex items-center rounded-full text-xxs justify-center active:scale-95 hover:opacity-70 ${
                                token[2] == chosenItems?.currency
                                  ? "opacity-100"
                                  : "opacity-60"
                              } ${
                                printTypeToString[
                                  Number(
                                    currentItem?.item?.printType
                                  ) as unknown as PrintType
                                ] == "poster" ||
                                printTypeToString[
                                  Number(
                                    currentItem?.item?.printType
                                  ) as unknown as PrintType
                                ] == "sticker"
                                  ? "w-fit rounded-sm px-1.5 py-1"
                                  : "w-6 rounded-full"
                              }`}
                              onClick={() =>
                                setChosenItems((prev) => {
                                  return {
                                    ...prev,
                                    currency: token[2],
                                  };
                                })
                              }
                            >
                              <div className="relative w-fit h-fit flex items-center justify-center">
                                <Image
                                  src={`${INFURA_GATEWAY}/ipfs/${token[0]}`}
                                  className="flex rounded-full"
                                  draggable={false}
                                  width={20}
                                  height={20}
                                  onError={(e) => handleImageError(e)}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {(currentItem?.item?.metadata?.colors?.length > 0 ||
                      currentItem?.item?.metadata?.sizes?.length > 0) &&
                      encrypted?.length !== context?.cartItems?.length && (
                        <div className="relative flex flex-col items-center justify-center w-fit h-fit gap-3">
                          <div className="relative flex flex-row flex-wrap items-center justify-center gap-2 w-full h-fit">
                            {currentItem?.item?.metadata?.sizes?.map(
                              (size: string, index: number) => {
                                return (
                                  <div
                                    key={index}
                                    className={`relative h-6 border border-white p-px cursor-pointer flex items-center text-xxs justify-center active:scale-95 hover:opacity-70 ${
                                      chosenItems?.size == size
                                        ? "opacity-100"
                                        : "opacity-60"
                                    } ${
                                      printTypeToString[
                                        Number(
                                          currentItem?.item?.printType
                                        ) as unknown as PrintType
                                      ] == "poster" ||
                                      printTypeToString[
                                        Number(
                                          currentItem?.item?.printType
                                        ) as unknown as PrintType
                                      ] == "sticker"
                                        ? "w-fit rounded-sm px-1.5 py-1"
                                        : "w-6 rounded-full"
                                    }`}
                                    onClick={() =>
                                      setChosenItems((prev) => ({
                                        ...prev,
                                        size,
                                      }))
                                    }
                                  >
                                    <div className="relative w-fit h-fit flex items-center justify-center">
                                      {size}
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                          <div className="relative flex flex-row flex-wrap items-center justify-center gap-2 w-full h-fit">
                            {currentItem?.item?.metadata?.colors?.map(
                              (color: string, index: number) => {
                                return (
                                  <div
                                    key={index}
                                    className={`relative w-6 h-6 flex items-center justify-center border border-white rounded-full p-px cursor-pointer active:scale-95 hover:opacity-70 ${
                                      chosenItems?.color == color
                                        ? "opacity-100"
                                        : "opacity-60"
                                    }`}
                                    onClick={() =>
                                      setChosenItems((prev) => ({
                                        ...prev,
                                        color,
                                      }))
                                    }
                                    style={{
                                      backgroundColor: color,
                                    }}
                                  ></div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}
                    <div
                      className={`relative w-fit h-fit py-1 px-2 flex items-center justify-center font-bit text-white text-xxs border border-white rounded-sm ${
                        chosenItems?.currency == "" ||
                        (chosenItems?.color == "" &&
                          currentItem?.item?.metadata?.colors) ||
                        (chosenItems?.size == "" &&
                          currentItem?.item?.metadata?.sizes)
                          ? "opacity-60"
                          : "cursor-pointer active:scale-95"
                      }`}
                      onClick={() => {
                        const newCartItems = [...context?.cartItems!];

                        if (
                          chosenItems?.currency == "" ||
                          (chosenItems?.color == "" &&
                            currentItem?.item?.metadata?.colors) ||
                          (chosenItems?.size == "" &&
                            currentItem?.item?.metadata?.sizes)
                        )
                          return;

                        const existingItemIndex = context?.cartItems.findIndex(
                          (item) =>
                            item.item.postId ===
                              context?.cartItems?.[chooseCartItem]?.item
                                ?.postId &&
                            item.color === chosenItems?.color &&
                            item.size === chosenItems?.size &&
                            item?.currency?.toLowerCase() ==
                              chosenItems?.currency?.toLowerCase()
                        );


                        if (existingItemIndex != -1) {
                          if (
                            Number(
                              currentItem?.item?.tokenIdsMinted?.length || 0
                            ) +
                              Number(
                                context?.cartItems
                                  ?.filter(
                                    (value) =>
                                      value?.item?.postId ==
                                      currentItem?.item?.postId
                                  )
                                  ?.map((item) => item?.buyAmount)
                                  ?.reduce((sum, item) => sum + Number(item), 0)
                              ) +
                              1 <=
                            Number(currentItem?.item?.amount)
                          ) {
                            newCartItems[existingItemIndex] = {
                              ...newCartItems[existingItemIndex],
                              buyAmount:
                                newCartItems[existingItemIndex]?.buyAmount + 1,
                            };
                          } else {
                            context?.setModalOpen(dict?.lim);

                            return;
                          }
                        } else {
                          const newItem = {
                            ...currentItem,
                            buyAmount: 1,
                            price: Number(currentItem?.item?.price),
                            currency: chosenItems?.currency,
                            color: chosenItems.color,
                            size: chosenItems?.size,
                          };

                          if (
                            Number(
                              currentItem?.item?.tokenIdsMinted?.length || 0
                            ) +
                              Number(
                                context?.cartItems
                                  ?.filter(
                                    (value) =>
                                      value?.item?.postId ==
                                      currentItem?.item?.postId
                                  )
                                  ?.map((item) => item?.buyAmount)
                                  ?.reduce((sum, item) => sum + Number(item), 0)
                              ) +
                              1 <=
                            Number(currentItem?.item?.amount)
                          ) {
                            newCartItems.push(newItem);
                          } else {
                            newCartItems[index] = newItem;
                          }
                        }

                        context?.setCartItems(newCartItems);
                        setCypherStorageCart(JSON.stringify(newCartItems));
                      }}
                    >
                      <div className="relative w-fit h-fit flex items-center justify-center">
                        {dict?.var}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Cart;
