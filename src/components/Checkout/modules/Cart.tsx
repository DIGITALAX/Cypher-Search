import { FunctionComponent } from "react";
import { CartProps } from "../types/checkout.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY, printTypeToString } from "../../../../lib/constants";
import { ImCross } from "react-icons/im";
import { setCartItems } from "../../../../redux/reducers/cartItemsSlice";
import lodash from "lodash";
import { setCypherStorageCart } from "../../../../lib/utils";
import { CartItem } from "@/components/Common/types/common.types";
import handleImageError from "../../../../lib/helpers/handleImageError";
import MediaSwitch from "@/components/Common/modules/MediaSwitch";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import { PrintType } from "@/components/Tiles/types/tiles.types";
import { setInsufficientBalance } from "../../../../redux/reducers/insufficientBalanceSlice";

const Cart: FunctionComponent<CartProps> = ({
  cartItems,
  chooseCartItem,
  setChooseCartItem,
  collectPostLoading,
  groupedByPubId,
  dispatch,
  chosenVariation,
  setChosenVariation,
  encryptedStrings,
}): JSX.Element => {
  return (
    <div className="relative w-full h-[95vh]  relative flex items-start justify-center flex-row gap-4 xl:flex-nowrap flex-wrap overflow-y-scroll">
      <div className="relative w-full h-fit max-h-[14rem] xl:max-h-full xl:h-full flex flex-col items-center justify-start overflow-y-scroll ">
        <div className="relative w-full flex h-fit items-start justify-start flex">
          <div className="relative items-center justify-start flex flex-col gap-3 h-fit w-full">
            {
              // chooseCartItem !==
              //   completedPurchases?.[
              //     Object.keys(groupedByPubId)?.indexOf(chooseCartItem)
              //   ]?.completed?.item?.pubId &&
              groupedByPubId[chooseCartItem?.item?.pubId!]?.collectionIds?.map(
                (_, index: number) => {
                  const mainIndex =
                    groupedByPubId[chooseCartItem?.item?.pubId!]
                      ?.originalIndices[index];
                  return (
                    <div
                      key={index}
                      className={`relative w-full h-12 flex flex-row gap-5 font-bit text-white text-xs justify-between items-center px-1.5 bg-sol/20 rounded-md`}
                    >
                      {groupedByPubId[chooseCartItem?.item?.pubId!]?.colors[
                        index
                      ] && (
                        <div
                          className="relative w-4 h-4 border border-ligero flex justify-start items-center rounded-full"
                          style={{
                            backgroundColor:
                              groupedByPubId[chooseCartItem?.item?.pubId!]
                                ?.colors[index],
                          }}
                        ></div>
                      )}
                      {groupedByPubId[chooseCartItem?.item?.pubId!]?.sizes[
                        index
                      ] && (
                        <div className="relative w-fit h-fit flex justify-start items-center uppercase">
                          {
                            groupedByPubId[chooseCartItem?.item?.pubId!]?.sizes[
                              index
                            ]
                          }
                        </div>
                      )}
                      <div className="relative w-fit h-fit text-ama flex whitespace-nowrap items-center justify-center">
                        USD{" "}
                        {
                          groupedByPubId[chooseCartItem?.item?.pubId!]?.prices[
                            index
                          ]
                        }
                      </div>
                      <div className="relative w-fit h-fit text-ama flex items-center justify-center">
                        Qty. x{" "}
                        {
                          groupedByPubId[chooseCartItem?.item?.pubId!]?.amounts[
                            index
                          ]
                        }
                      </div>
                      <div className="relative w-fit h-full flex items-center justify-center ml-auto gap-3">
                        <div className="relative w-fit h-full flex flex-row items-center justify-center gap-1.5">
                          <div
                            className="relative w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center rotate-90"
                            onClick={() => {
                              if (
                                collectPostLoading ||
                                (encryptedStrings?.find(
                                  (item) =>
                                    item?.pubId == chooseCartItem?.item?.pubId
                                ) &&
                                  chooseCartItem?.item?.origin !== "1")
                              )
                                return;

                              if (
                                Number(chooseCartItem?.item?.soldTokens || 0) +
                                  1 +
                                  groupedByPubId[
                                    chooseCartItem?.item?.pubId!
                                  ]?.amounts?.reduce(
                                    (sum, item) => sum + Number(item),
                                    0
                                  ) >
                                Number(chooseCartItem?.buyAmount)
                              ) {
                                dispatch(
                                  setInsufficientBalance({
                                    actionValue: true,
                                    actionMessage:
                                      "We know you're eager, but you've reached this creation's collect limit!",
                                  })
                                );
                                return;
                              }
                              dispatch(
                                setCartItems([
                                  ...cartItems.slice(0, mainIndex),
                                  {
                                    ...cartItems[mainIndex],
                                    buyAmount:
                                      cartItems[mainIndex]?.buyAmount + 1,
                                  },
                                  ...cartItems.slice(mainIndex + 1),
                                ])
                              );

                              setCypherStorageCart(
                                JSON.stringify([
                                  ...cartItems.slice(0, mainIndex),
                                  {
                                    ...cartItems[mainIndex],
                                    buyAmount:
                                      cartItems[mainIndex]?.buyAmount + 1,
                                  },
                                  ...cartItems.slice(mainIndex + 1),
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
                                (encryptedStrings?.find(
                                  (item) =>
                                    item?.pubId == chooseCartItem?.item?.pubId
                                ) &&
                                  chooseCartItem?.item?.origin !== "1")
                              )
                                return;
                              const newCart =
                                cartItems[mainIndex].buyAmount > 1
                                  ? [
                                      ...cartItems.slice(0, mainIndex),
                                      {
                                        ...cartItems[mainIndex],
                                        buyAmount:
                                          cartItems[mainIndex].buyAmount - 1,
                                      },
                                      ...cartItems.slice(mainIndex + 1),
                                    ]
                                  : [
                                      ...cartItems.slice(0, mainIndex),
                                      ...cartItems.slice(mainIndex + 1),
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
                          className="justify-end items-center w-fit h-fit flex cursor-pointer active:scale-95"
                          onClick={() => {
                            if (collectPostLoading) return;
                            const newCart = lodash.concat(
                              lodash.slice([...cartItems], 0, mainIndex),
                              lodash.slice([...cartItems], mainIndex + 1)
                            );
                            dispatch(setCartItems(newCart));
                            setCypherStorageCart(JSON.stringify(newCart));
                          }}
                        >
                          <ImCross color="white" size={10} />
                        </div>
                      </div>
                    </div>
                  );
                }
              )
            }
          </div>
        </div>
      </div>
      <div className="relative w-full h-full relative flex items-start justify-center overflow-y-scroll">
        <div className="relative w-full h-fit flex flex-col items-center justify-start gap-5">
          {Array.from(
            new Map(cartItems.map((item) => [item?.item?.pubId, item])).values()
          )?.map((currentItem: CartItem, index: number) => {
            const profilePicture = createProfilePicture(
              currentItem?.item?.profile?.metadata?.picture
            );
            return (
              <div
                key={index}
                className={`relative w-full h-fit flex flex-col items-center justify-center border border-sol rounded-md gap-3 p-4 cursor-pointer bg-black ${
                  currentItem?.item?.pubId !== chooseCartItem?.item?.pubId! &&
                  "opacity-50"
                } 
            
                `}
                onClick={() =>
                  // completedPurchases?.[index]?.completed
                  //   ? setCompletedPurchases((prev) => {
                  //       const arr = [...prev];
                  //       arr[index] = {
                  //         ...arr[index],
                  //         open: false,
                  //       };
                  //       return arr;
                  //     })
                  //   :
                  {
                    setChooseCartItem(currentItem);
                  }
                }
              >
                {
                  // completedPurchases?.[index]?.open ?
                  <>
                    {/* <div
                      className="ml-auto justify-end items-center w-fit h-fit flex cursor-pointer active:scale-95"
                      onClick={() => {
                        if (collectPostLoading[index]) return;
                        // if (completedPurchases[index]?.completed) {
                        //   setCompletedPurchases((prev) => {
                        //     const arr = [...prev];
                        //     arr[index] = {
                        //       ...arr[index],
                        //       open: !completedPurchases?.[index]?.open,
                        //     };
                        //     return arr;
                        //   });

                        //   return;
                        // } else {
                        const newCart = lodash.concat(
                          lodash.slice([...cartItems], 0, index),
                          lodash.slice([...cartItems], index + 1)
                        );
                        dispatch(setCartItems(newCart));
                        setCypherStorageCart(JSON.stringify(newCart));
                        // }
                      }}
                    >
                      {
                        // !completedPurchases?.[index]?.completed ?
                        // <ImCross color="white" size={10} />
                        // : (
                        //   <ImArrowUp color="white" size={10} />
                        // )
                      }
                    </div> */}
                    <div className="relative w-4/5 h-fit flex items-center flex-col sm:flex-row justify-center sm:justify-between gap-2">
                      {currentItem?.item?.profile?.handle?.suggestedFormatted
                        ?.localName && (
                        <div className="relative w-fit h-fit gap-2 flex items-center justify-start flex-row text-sm">
                          <div className="relative w-fit h-fit flex items-center">
                            <div
                              className="relative w-5 h-5 font-aust flex items-center rounded-full justify-center"
                              id="pfp"
                            >
                              {profilePicture && (
                                <Image
                                  layout="fill"
                                  src={profilePicture}
                                  draggable={false}
                                  objectFit="cover"
                                  className="rounded-full"
                                  onError={(e) => handleImageError(e)}
                                />
                              )}
                            </div>
                          </div>
                          <div className="relative w-fit h-fit text-white font-bit flex items-center justify-center">
                            {
                              currentItem?.item?.profile?.handle
                                ?.suggestedFormatted?.localName
                            }
                          </div>
                        </div>
                      )}
                      <div className="relative w-fit h-fit text-center items-center justify-end sm:ml-auto flex font-bit text-white top-px text-sm sm:text-base">
                        {currentItem?.item?.collectionMetadata?.title?.length >
                        20
                          ? currentItem?.item?.collectionMetadata?.title?.slice(
                              0,
                              20
                            ) + "..."
                          : currentItem?.item?.collectionMetadata?.title}
                      </div>
                    </div>
                    <div className="relative w-4/5 h-72 flex items-center justify-center border border-white rounded-md">
                      <MediaSwitch
                        type={
                          currentItem?.item?.collectionMetadata
                            ?.mediaTypes?.[0] == "video"
                            ? "video"
                            : currentItem?.item?.collectionMetadata
                                ?.mediaTypes?.[0] == "audio"
                            ? "audio"
                            : "image"
                        }
                        hidden
                        classNameImage={
                          "rounded-md w-full h-full flex relative"
                        }
                        classNameVideo={
                          "object-cover w-full h-[18rem] flex items-center justify-center rounded-md relative"
                        }
                        classNameAudio={
                          "rounded-md w-full h-full flex relative"
                        }
                        srcUrl={
                          currentItem?.item?.collectionMetadata
                            ?.mediaTypes?.[0] == "video"
                            ? `${INFURA_GATEWAY}/ipfs/${
                                currentItem?.item?.collectionMetadata?.video?.split(
                                  "ipfs://"
                                )?.[1]
                              }`
                            : currentItem?.item?.collectionMetadata
                                ?.mediaTypes?.[0] == "audio"
                            ? `${INFURA_GATEWAY}/ipfs/${
                                currentItem?.item?.collectionMetadata?.audio?.split(
                                  "ipfs://"
                                )?.[1]
                              }`
                            : `${INFURA_GATEWAY}/ipfs/${
                                currentItem?.item?.collectionMetadata?.images?.[0]?.split(
                                  "ipfs://"
                                )?.[1]
                              }`
                        }
                        srcCover={
                          currentItem?.item?.collectionMetadata?.mediaCover
                            ? `${INFURA_GATEWAY}/ipfs/${
                                currentItem?.item?.collectionMetadata?.mediaCover?.split(
                                  "ipfs://"
                                )?.[1]
                              }`
                            : undefined
                        }
                      />
                    </div>
                    {
                      // !completedPurchases?.[index]?.completed &&
                      (currentItem?.item?.collectionMetadata?.colors?.length >
                        0 ||
                        currentItem?.item?.collectionMetadata?.sizes?.length >
                          0) &&
                        !encryptedStrings?.find(
                          (item) => item?.pubId == currentItem?.item?.pubId
                        ) && (
                          <div className="relative flex flex-col gap-2 w-full h-fit items-center justify-center font-bit text-white z-1 pt-4">
                            <div className="relative flex flex-col items-center justify-center w-fit h-fit gap-3">
                              <div className="relative flex flex-row flex-wrap items-center justify-center gap-2 w-full h-fit">
                                {currentItem?.item?.collectionMetadata?.sizes?.map(
                                  (size: string, index: number) => {
                                    return (
                                      <div
                                        key={index}
                                        className={`relative h-6 border border-white p-px cursor-pointer flex items-center text-xxs justify-center active:scale-95 hover:opacity-70 ${
                                          chosenVariation[
                                            Object.keys(
                                              groupedByPubId
                                            ).findIndex(
                                              (key) =>
                                                key ===
                                                chooseCartItem?.item?.pubId
                                            )
                                          ]?.size == size
                                            ? "opacity-60"
                                            : "opacity-100"
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
                                          setChosenVariation((prev) => {
                                            const arr = [...prev];
                                            arr[
                                              Object.keys(
                                                groupedByPubId
                                              ).findIndex(
                                                (key) =>
                                                  key ===
                                                  chooseCartItem?.item?.pubId
                                              )
                                            ] = {
                                              ...arr[
                                                Object.keys(
                                                  groupedByPubId
                                                ).findIndex(
                                                  (key) =>
                                                    key ===
                                                    chooseCartItem?.item?.pubId
                                                )
                                              ],
                                              size,
                                            };
                                            return arr;
                                          })
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
                                {currentItem?.item?.collectionMetadata?.colors?.map(
                                  (color: string, index: number) => {
                                    return (
                                      <div
                                        key={index}
                                        className={`relative w-6 h-6 flex items-center justify-center border border-white rounded-full p-px cursor-pointer active:scale-95 hover:opacity-70 ${
                                          chosenVariation[
                                            Object.keys(
                                              groupedByPubId
                                            ).findIndex(
                                              (key) =>
                                                key ===
                                                chooseCartItem?.item?.pubId
                                            )
                                          ]?.color == color
                                            ? "opacity-60"
                                            : "opacity-100"
                                        }`}
                                        onClick={() =>
                                          setChosenVariation((prev) => {
                                            const arr = [...prev];
                                            arr[
                                              Object.keys(
                                                groupedByPubId
                                              ).findIndex(
                                                (key) =>
                                                  key ===
                                                  chooseCartItem?.item?.pubId
                                              )
                                            ] = {
                                              ...arr[
                                                Object.keys(
                                                  groupedByPubId
                                                ).findIndex(
                                                  (key) =>
                                                    key ===
                                                    chooseCartItem?.item?.pubId
                                                )
                                              ],
                                              color,
                                            };
                                            return arr;
                                          })
                                        }
                                        style={{
                                          backgroundColor: color,
                                        }}
                                      ></div>
                                    );
                                  }
                                )}
                              </div>
                              <div
                                className={`relative w-fit h-fit py-1 px-2 flex items-center justify-center font-bit text-white text-xxs border border-white rounded-sm cursor-pointer active:scale-95`}
                                onClick={() => {
                                  const newCartItems = [...cartItems];

                                  if (
                                    !chosenVariation[
                                      Object.keys(groupedByPubId).findIndex(
                                        (key) =>
                                          key === chooseCartItem?.item?.pubId
                                      )
                                    ]?.color ||
                                    !chosenVariation[
                                      Object.keys(groupedByPubId).findIndex(
                                        (key) =>
                                          key === chooseCartItem?.item?.pubId
                                      )
                                    ]?.size
                                  )
                                    return;

                                  const existingItemIndex = cartItems.findIndex(
                                    (item) =>
                                      item.item.pubId ===
                                        chooseCartItem?.item?.pubId &&
                                      item.color ===
                                        chosenVariation[
                                          Object.keys(groupedByPubId).findIndex(
                                            (key) =>
                                              key ===
                                              chooseCartItem?.item?.pubId
                                          )
                                        ]?.color &&
                                      item.size ===
                                        chosenVariation[
                                          Object.keys(groupedByPubId).findIndex(
                                            (key) =>
                                              key ===
                                              chooseCartItem?.item?.pubId
                                          )
                                        ]?.size
                                  );

                                  if (existingItemIndex != -1) {
                                    if (
                                      Number(
                                        currentItem?.item?.soldTokens || 0
                                      ) +
                                        groupedByPubId[
                                          chooseCartItem?.item?.pubId!
                                        ]?.amounts?.reduce(
                                          (sum, item) => sum + Number(item),
                                          0
                                        ) +
                                        1 <
                                      Number(currentItem?.buyAmount)
                                    ) {
                                      newCartItems[existingItemIndex] = {
                                        ...newCartItems[existingItemIndex],
                                        buyAmount:
                                          newCartItems[existingItemIndex]
                                            ?.buyAmount + 1,
                                      };
                                    } else {
                                      dispatch(
                                        setInsufficientBalance({
                                          actionValue: true,
                                          actionMessage:
                                            "We know you're eager, but you've reached this creation's collect limit!",
                                        })
                                      );
                                      return;
                                    }
                                  } else {
                                    const newIndex =
                                      currentItem?.item?.printType !== "0" &&
                                      currentItem?.item?.printType !== "1"
                                        ? 0
                                        : currentItem?.item?.collectionMetadata?.sizes?.findIndex(
                                            (item) =>
                                              item?.toLowerCase() ==
                                              chosenVariation[
                                                Object.keys(
                                                  groupedByPubId
                                                ).findIndex(
                                                  (key) =>
                                                    key ===
                                                    chooseCartItem?.item?.pubId
                                                )
                                              ]?.size?.toLowerCase()
                                          );

                                    const newItem = {
                                      ...currentItem,
                                      buyAmount: 1,
                                      chosenIndex: newIndex,
                                      price: Number(
                                        currentItem?.item?.prices[newIndex]
                                      ),
                                      color:
                                        chosenVariation[
                                          Object.keys(groupedByPubId).findIndex(
                                            (key) =>
                                              key ===
                                              chooseCartItem?.item?.pubId
                                          )
                                        ]?.color,
                                      size: chosenVariation[
                                        Object.keys(groupedByPubId).findIndex(
                                          (key) =>
                                            key === chooseCartItem?.item?.pubId
                                        )
                                      ]?.size,
                                    };

                                    if (
                                      Number(
                                        currentItem?.item?.soldTokens || 0
                                      ) +
                                        groupedByPubId[
                                          chooseCartItem?.item?.pubId!
                                        ]?.amounts?.reduce(
                                          (sum, item) => sum + Number(item),
                                          0
                                        ) +
                                        1 <
                                      Number(currentItem?.buyAmount)
                                    ) {
                                      newCartItems.push(newItem);
                                    } else {
                                      newCartItems[index] = newItem;
                                    }
                                  }

                                  dispatch(setCartItems(newCartItems));
                                  setCypherStorageCart(
                                    JSON.stringify(newCartItems)
                                  );
                                }}
                              >
                                <div className="relative w-fit h-fit flex items-center justify-center">
                                  Add Variation
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                    }
                  </>
                  // : (
                  //   <div
                  //     className="relative w-full h-12 bg-sol/70 flex items-center justify-between px-1.5 opacity-60 cursor-pointer"
                  //     onClick={() =>
                  //       setCompletedPurchases((prev) => {
                  //         const arr = [...prev];
                  //         arr[index] = {
                  //           ...arr[index],
                  //           open: !completedPurchases?.[index]?.open,
                  //         };
                  //         return arr;
                  //       })
                  //     }
                  //   >
                  //     <div className="relative w-full h-fit flex justify-between items-center gap-2">
                  //       <div className="relative w-fit h-fit font-bit text-white text-xs">
                  //         Purchase Completed
                  //       </div>
                  //       <div className="relative w-fit h-fit font-bit text-white text-xs">
                  //         Qty.{" "}
                  //         {
                  //           completedPurchases?.[index]?.completed?.item
                  //             ?.collectionMetadata?.title
                  //         }
                  //       </div>
                  //       <div className="relative w-fit h-fit font-bit text-white text-xs">
                  //         Qty. {completedPurchases?.[index]?.completed?.amount}
                  //       </div>
                  //       <div className="relative w-fit h-fit font-bit text-white text-xs">
                  //         USD {completedPurchases?.[index]?.completed?.price}
                  //       </div>
                  //     </div>
                  //   </div>
                  // )
                }
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Cart;
