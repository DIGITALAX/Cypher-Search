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
import MediaSwitch from "@/components/Common/modules/MediaSwitch";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";

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
    <div className="relative w-full h-[70vh] relative flex items-start justify-center flex-row gap-4 lg:flex-nowrap flex-wrap">
      <div className="relative w-full h-fit flex flex-col items-center justify-start">
        <div className="relative w-full flex h-fit max-h-[14rem] items-start justify-start flex overflow-y-scroll">
          <div className="relative items-center justify-start flex flex-col gap-3 h-fit w-full">
            {
              // chooseCartItem !==
              //   completedPurchases?.[
              //     Object.keys(groupedByPubId)?.indexOf(chooseCartItem)
              //   ]?.completed?.item?.pubId &&
              groupedByPubId[chooseCartItem]?.collectionIds?.map(
                (_, index: number) => {
                  const mainIndex = cartItems?.findIndex(
                    (item) => item?.item?.pubId == chooseCartItem
                  );

                  return (
                    <div
                      key={index}
                      className={`relative w-full h-12 flex flex-row gap-5 font-bit text-white text-xs justify-between items-center px-1.5 bg-sol/20 rounded-md`}
                    >
                      {groupedByPubId[chooseCartItem]?.colors[index] && (
                        <div
                          className="relative w-4 h-4 border border-ligero flex justify-start items-center rounded-full"
                          style={{
                            backgroundColor:
                              groupedByPubId[chooseCartItem]?.colors[index],
                          }}
                        ></div>
                      )}
                      {groupedByPubId[chooseCartItem]?.sizes[index] && (
                        <div className="relative w-fit h-fit flex justify-start items-center uppercase">
                          {groupedByPubId[chooseCartItem]?.sizes[index]}
                        </div>
                      )}
                      <div className="relative w-fit h-fit text-ama flex whitespace-nowrap items-center justify-center">
                        USD {groupedByPubId[chooseCartItem]?.prices[index]}
                      </div>
                      <div className="relative w-fit h-fit text-ama flex items-center justify-center">
                        Qty. x {groupedByPubId[chooseCartItem]?.amounts[index]}
                      </div>
                      <div className="relative w-fit h-full flex items-center justify-center ml-auto gap-3">
                        <div className="relative w-fit h-full flex flex-row items-center justify-center gap-1.5">
                          <div
                            className="relative w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center rotate-90"
                            onClick={() => {
                              if (
                                collectPostLoading?.[mainIndex]
                                // ||
                                // completedPurchases?.[mainIndex]?.completed
                              )
                                return;
                              dispatch(
                                setCartItems([
                                  ...cartItems.slice(0, mainIndex),
                                  {
                                    ...cartItems[mainIndex],
                                    amount: cartItems[mainIndex]?.amount + 1,
                                  },
                                  ...cartItems.slice(mainIndex + 1),
                                ])
                              );

                              setCypherStorageCart(
                                JSON.stringify([
                                  ...cartItems.slice(0, mainIndex),
                                  {
                                    ...cartItems[mainIndex],
                                    amount: cartItems[mainIndex]?.amount + 1,
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
                                collectPostLoading?.[mainIndex]
                                // ||
                                // completedPurchases?.[mainIndex]?.completed
                              )
                                return;
                              const newCart =
                                cartItems[mainIndex].amount > 1
                                  ? [
                                      ...cartItems.slice(0, mainIndex),
                                      {
                                        ...cartItems[mainIndex],
                                        amount: cartItems[mainIndex].amount - 1,
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
                            if (
                              collectPostLoading?.[mainIndex]
                              //  ||
                              // completedPurchases?.[mainIndex]?.completed
                            )
                              return;
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
          {cartItems?.map((currentItem: CartItem, index: number) => {
            const profilePicture = createProfilePicture(
              currentItem?.item?.profile?.metadata?.picture
            );
            return (
              <div
                key={index}
                className={`relative w-full h-fit flex flex-col items-center justify-center border border-sol rounded-md gap-3 p-4 cursor-pointer bg-black ${
                  currentItem?.item?.pubId !== chooseCartItem && "opacity-50"
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
                  setChooseCartItem(currentItem?.item?.pubId!)
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
                    <div className="relative w-4/5 h-fit flex items-center justify-between gap-2">
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
                      <div className="relative w-fit h-fit text-center items-center justify-end ml-auto flex font-bit text-white top-px">
                        {currentItem?.item?.collectionMetadata?.title}
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
                          "object-cover w-full h-[252px] flex items-center justify-center rounded-md relative"
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
                          0) && (
                        <div className="relative flex flex-col gap-2 w-full h-fit items-center justify-center font-bit text-white z-1 pt-4">
                          <div className="relative flex items-center justify-center w-fit h-fit text-sm">
                            Add Variation
                          </div>
                          <div className="relative flex flex-col items-center justify-center w-fit h-fit">
                            <div className="relative flex flex-row flex-wrap items-start justify-start gap-5 w-full h-fit">
                              {currentItem?.item?.collectionMetadata?.sizes?.map(
                                (size: string, index: number) => {
                                  return (
                                    <div
                                      key={index}
                                      className="relative w-5 h-5 border border-white rounded-full p-px cursor-pointer active:scale-95 hover:opacity-70"
                                      onClick={(e) => {
                                        if (
                                          collectPostLoading[index]
                                          // ||
                                          // completedPurchases[index]?.completed
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
                              {currentItem?.item?.collectionMetadata?.colors?.map(
                                (color: string, index: number) => {
                                  return (
                                    <div
                                      key={index}
                                      className="relative w-5 h-5 border border-white rounded-full p-px cursor-pointer active:scale-95 hover:opacity-70"
                                      onClick={(e) => {
                                        if (
                                          collectPostLoading[index]
                                          // ||
                                          // completedPurchases[index]?.completed
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
