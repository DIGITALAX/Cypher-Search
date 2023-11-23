import { FunctionComponent } from "react";
import { CartProps } from "../types/checkout.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { ImArrowUp, ImCross } from "react-icons/im";
import { setCartItems } from "../../../../redux/reducers/cartItemsSlice";
import lodash from "lodash";
import { setCypherStorageCart } from "../../../../lib/utils";
import { CartItem } from "@/components/Common/types/common.types";
import handleImageError from "../../../../lib/helpers/handleImageError";

const Cart: FunctionComponent<CartProps> = ({
  cartItems,
  chooseCartItem,
  setChooseCartItem,
  collectPostLoading,
  completedPurchases,
  groupedByPubId,
  dispatch,
  setCompletedPurchases,
}): JSX.Element => {
  return (
    <div className="relative w-full h-[70vh] relative flex items-start justify-center flex-row gap-4">
      <div className="relative w-fit h-full flex flex-col items-center justify-start">
        <div className="relative w-96 flex h-full items-start justify-start flex overflow-y-scroll">
          <div className="relative items-center justify-start flex flex-col gap-3 h-fit w-full">
            {!completedPurchases?.[
              Object.keys(groupedByPubId)?.indexOf(chooseCartItem)
            ]?.completed &&
              groupedByPubId[chooseCartItem]?.collectionIds?.map(
                (_, index: number) => {
                  const mainIndex =
                    Object.keys(groupedByPubId)?.indexOf(chooseCartItem);
                  return (
                    <div
                      key={index}
                      className={`relative w-full h-12 flex flex-row gap-5 font-mana text-white text-xs justify-between items-center px-1.5 bg-sol/20 rounded-md 
                    }`}
                    >
                      <div
                        className="relative w-4 h-4 border border-ligero flex justify-start items-center rounded-full"
                        style={{
                          backgroundColor:
                            groupedByPubId[chooseCartItem]?.colors[index],
                        }}
                      ></div>
                      <div className="relative w-fit h-fit flex justify-start items-center uppercase">
                        {groupedByPubId[chooseCartItem]?.sizes[index]}
                      </div>
                      <div className="relative w-fit h-fit text-ama flex whitespace-nowrap">
                        {groupedByPubId[chooseCartItem]?.prices[index]}
                      </div>
                      <div className="relative w-fit h-fit text-ama flex">
                        {groupedByPubId[chooseCartItem]?.amounts[index]}
                      </div>
                      <div className="relative w-fit h-full flex flex-row items-center justify-center gap-1.5">
                        <div
                          className="relative w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center rotate-90"
                          onClick={() => {
                            if (
                              collectPostLoading?.[mainIndex] ||
                              completedPurchases?.[mainIndex]?.completed
                            )
                              return;
                            dispatch(
                              setCartItems([
                                ...cartItems.slice(0, index),
                                {
                                  ...cartItems[index],
                                  amount: cartItems[index].amount + 1,
                                },
                                ...cartItems.slice(index + 1),
                              ])
                            );
                            setCypherStorageCart(
                              JSON.stringify([
                                ...cartItems.slice(0, index),
                                {
                                  ...cartItems[index],
                                  amount: cartItems[index].amount + 1,
                                },
                                ...cartItems.slice(index + 1),
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
                              collectPostLoading?.[mainIndex] ||
                              completedPurchases?.[mainIndex]?.completed
                            )
                              return;
                            const newCart =
                              cartItems[index].amount > 1
                                ? [
                                    ...cartItems.slice(0, index),
                                    {
                                      ...cartItems[index],
                                      amount: cartItems[index].amount - 1,
                                    },
                                    ...cartItems.slice(index + 1),
                                  ]
                                : [
                                    ...cartItems.slice(0, index),
                                    ...cartItems.slice(index + 1),
                                  ];
                            dispatch(setCartItems(newCart));
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
                        className="ml-auto justify-end items-center w-fit h-fit flex cursor-pointer active:scale-95"
                        onClick={() => {
                          if (
                            collectPostLoading?.[mainIndex] ||
                            completedPurchases?.[mainIndex]?.completed
                          )
                            return;
                          const newCart = lodash.concat(
                            lodash.slice([...cartItems], 0, index),
                            lodash.slice([...cartItems], index + 1)
                          );
                          dispatch(setCartItems(newCart));
                          setCypherStorageCart(JSON.stringify(newCart));
                        }}
                      >
                        <ImCross color="white" size={10} />
                      </div>
                    </div>
                  );
                }
              )}
          </div>
        </div>
      </div>
      <div className="relative w-fit h-full relative flex items-start justify-center overflow-y-scroll">
        <div className="relative w-full h-fit flex flex-col items-center justify-start gap-5">
          {cartItems?.map((currentItem: CartItem, index: number) => {
            return (
              <div
                key={index}
                className={`relative w-96 h-fit flex flex-col items-center justify-center border border-sol rounded-md gap-3 cursor-pointer  ${
                  currentItem?.item?.pubId !== chooseCartItem && "opacity-50"
                } ${completedPurchases?.[index]?.open && "px-2 py-4"}`}
                onClick={() =>
                  completedPurchases?.[index].completed
                    ? setCompletedPurchases((prev) => {
                        const arr = [...prev];
                        arr[index] = {
                          ...arr[index],
                          open: false,
                        };
                        return arr;
                      })
                    : setChooseCartItem(currentItem?.item?.pubId!)
                }
              >
                {completedPurchases?.[index]?.open ? (
                  <>
                    <div
                      className="ml-auto justify-end items-center w-fit h-fit flex cursor-pointer active:scale-95"
                      onClick={() => {
                        if (collectPostLoading[index]) return;
                        if (completedPurchases[index]?.completed) {
                          setCompletedPurchases((prev) => {
                            const arr = [...prev];
                            arr[index] = {
                              ...arr[index],
                              open: !completedPurchases?.[index]?.open,
                            };
                            return arr;
                          });

                          return;
                        }

                        const newCart = lodash.concat(
                          lodash.slice([...cartItems], 0, index),
                          lodash.slice([...cartItems], index + 1)
                        );
                        dispatch(setCartItems(newCart));
                        setCypherStorageCart(JSON.stringify(newCart));
                      }}
                    >
                      {completedPurchases?.[index].completed ? (
                        <ImCross color="white" size={10} />
                      ) : (
                        <ImArrowUp color="white" size={10} />
                      )}
                    </div>
                    <div className="relative w-full h-fit text-center items-center justify-center flex font-bit text-white">
                      {currentItem?.item?.title}
                    </div>
                    <div className="relative w-2/3 h-72 flex items-center justify-center border border-white rounded-md">
                      <Image
                        layout="fill"
                        draggable={false}
                        src={`${INFURA_GATEWAY}/ipfs/${currentItem?.item?.images?.[0]}`}
                        objectFit="cover"
                        className="rounded-md"
                        onError={(e) => handleImageError(e)}
                      />
                    </div>
                    {!completedPurchases?.[index].completed && (
                      <div className="relative flex flex-col gap-2 w-full h-fit items-center justify-center font-bit text-white z-1 pt-4">
                        <div className="relative flex items-center justify-center w-fit h-fit text-sm">
                          Add Variation
                        </div>
                        <div className="relative flex flex-col items-center justify-center w-fit h-fit">
                          <div className="relative flex flex-row flex-wrap items-start justify-start gap-5 w-full h-fit">
                            {currentItem?.item?.sizes?.map(
                              (size: string, index: number) => {
                                return (
                                  <div
                                    key={index}
                                    className="relative w-5 h-5 border border-white rounded-full p-px cursor-pointer active:scale-95 hover:opacity-70"
                                    onClick={(e) => {
                                      if (
                                        collectPostLoading[index] ||
                                        completedPurchases[index]?.completed
                                      )
                                        return;
                                      e.stopPropagation();

                                      const newCartItems = [...cartItems];
                                      const itemIndex =
                                        newCartItems.indexOf(currentItem);

                                      if (
                                        currentItem.color ===
                                          currentItem.color &&
                                        currentItem.size === currentItem.size
                                      ) {
                                        newCartItems[itemIndex] = {
                                          ...currentItem,
                                          amount: currentItem.amount + 1,
                                        };
                                      } else {
                                        newCartItems.splice(itemIndex, 1);
                                        newCartItems.push(currentItem);
                                      }

                                      dispatch(setCartItems(newCartItems));
                                      setCypherStorageCart(
                                        JSON.stringify(newCartItems)
                                      );
                                    }}
                                  >
                                    {size}
                                  </div>
                                );
                              }
                            )}
                          </div>
                          <div className="relative flex flex-row flex-wrap items-start justify-start gap-5 w-full h-fit">
                            {currentItem?.item?.colors?.map(
                              (color: string, index: number) => {
                                return (
                                  <div
                                    key={index}
                                    className="relative w-5 h-5 border border-white rounded-full p-px cursor-pointer active:scale-95 hover:opacity-70"
                                    onClick={(e) => {
                                      if (
                                        collectPostLoading[index] ||
                                        completedPurchases[index]?.completed
                                      )
                                        return;
                                      e.stopPropagation();

                                      const newCartItems = [...cartItems];
                                      const itemIndex =
                                        newCartItems.indexOf(currentItem);

                                      if (
                                        currentItem.color ===
                                          currentItem.color &&
                                        currentItem.size === currentItem.size
                                      ) {
                                        newCartItems[itemIndex] = {
                                          ...currentItem,
                                          amount: currentItem.amount + 1,
                                        };
                                      } else {
                                        newCartItems.splice(itemIndex, 1);
                                        newCartItems.push(currentItem);
                                      }

                                      dispatch(setCartItems(newCartItems));
                                      setCypherStorageCart(
                                        JSON.stringify(newCartItems)
                                      );
                                    }}
                                    style={{
                                      backgroundColor: color,
                                    }}
                                  ></div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className="relative w-full h-12 bg-sol/70 flex items-center justify-between px-1.5 opacity-60 cursor-pointer"
                    onClick={() =>
                      setCompletedPurchases((prev) => {
                        const arr = [...prev];
                        arr[index] = {
                          ...arr[index],
                          open: !completedPurchases?.[index]?.open,
                        };
                        return arr;
                      })
                    }
                  >
                    <div className="relative w-fit h-fit font-bit text-white text-xs">
                      Purchase Completed
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Cart;
