import { FunctionComponent } from "react";
import { DropMainProps } from "../types/drop.types";
import { Creation } from "@/components/Tiles/types/tiles.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY, numberToItemTypeMap } from "../../../../lib/constants";
import { setCartItems } from "../../../../redux/reducers/cartItemsSlice";
import { setCypherStorageCart } from "../../../../lib/utils";
import { setCartAnim } from "../../../../redux/reducers/cartAnimSlice";

const DropMain: FunctionComponent<DropMainProps> = ({
  collections,
  router,
  handle,
  dispatch,
  cartItems,
}) => {
  return (
    <div className="relative w-full h-fit flex items-center justify-center flex-row pt-32">
      <div></div>
      <div className="relative w-full h-fit flex items-center justify-center">
        {
          <div className="relative w-fit h-fit flex items-center justify-center flex-wrap gap-5">
            {
              // collections
              Array.from({ length: 15 })?.map(
                (collection: Creation, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative w-80 h-80 flex items-center justify-center bg-offBlack p-3 rounded-sm"
                    >
                      <div
                        className="relative w-full h-full rounded-sm"
                        id="staticLoad"
                      >
                        <Image
                          className="rounded-sm"
                          layout="fill"
                          objectFit="cover"
                          src={`${INFURA_GATEWAY}/ipfs/`}
                        />
                      </div>
                      <div className="absolute bottom-0 right-0 w-full h-10 bg-offBlack flex items-center justify-between px-3">
                        <div className="relative w-fit h-fit flex items-center justify-start text-sm font-bit text-white top-px">
                          {collection?.title?.slice(0, 20) + "..."}
                        </div>
                        <div className="relative flex flex-row gap-2 ml-auto items-center justify-center">
                          <div className="relative w-fit h-fit flex items-center justify-start text-sm font-bit text-white top-px">
                            ${collection?.prices?.[0]}
                          </div>
                          <div
                            className="relative w-4 h-4 justify-end flex items-center cursor-pointer active:scale-95"
                            title="Add to Cart"
                            onClick={() => {
                              const newItem = {
                                item: collection,
                                amount: 1,
                                price: Number(collection?.prices?.[0]),
                                type: numberToItemTypeMap[
                                  Number(collection?.origin)
                                ],
                                color: collection?.colors?.[0],
                                size: collection?.sizes?.[0],
                                purchased: false,
                                chosenIndex: 0,
                              };

                              const existingItem = cartItems?.find(
                                (item) =>
                                  item?.item?.pubId === collection?.pubId
                              );

                              if (existingItem) {
                                const newCartItems = [...(cartItems || [])];
                                const itemIndex =
                                  newCartItems?.indexOf(existingItem);

                                if (
                                  existingItem?.color === newItem?.color &&
                                  existingItem?.size === newItem?.size
                                ) {
                                  newCartItems[itemIndex] = {
                                    ...(existingItem || {}),
                                    amount: existingItem?.amount + 1,
                                  };
                                } else {
                                  newCartItems?.splice(itemIndex, 1);
                                  newCartItems?.push(newItem);
                                }

                                dispatch(setCartItems(newCartItems));
                                setCypherStorageCart(
                                  JSON.stringify(newCartItems)
                                );
                              } else {
                                dispatch(setCartItems([...cartItems, newItem]));
                                setCypherStorageCart(
                                  JSON.stringify([...cartItems, newItem])
                                );
                              }

                              dispatch(setCartAnim(true));
                            }}
                          >
                            <Image
                              draggable={false}
                              layout="fill"
                              src={`${INFURA_GATEWAY}/ipfs/QmZ4v5pzdnCBeyKnS9VrjZiEAbUpAVy8ECArNcpxBt6Tw4`}
                            />
                          </div>
                          <div
                            className="relative w-4 h-4 justify-end flex items-center cursor-pointer active:scale-95"
                            title="Go to Drop"
                            onClick={() =>
                              router.push(
                                `/autograph/${handle}/drop/${collection?.title}`
                              )
                            }
                          >
                            <Image
                              draggable={false}
                              layout="fill"
                              src={`${INFURA_GATEWAY}/ipfs/QmRkAoLMAh2hxZfh5WvaxuxRUMhs285umdJWuvLa5wt6Ht`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )
            }
          </div>
        }
      </div>
    </div>
  );
};

export default DropMain;
