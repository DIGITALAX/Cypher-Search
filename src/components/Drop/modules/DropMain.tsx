import { FunctionComponent } from "react";
import { DropMainProps } from "../types/drop.types";
import { Creation } from "@/components/Tiles/types/tiles.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY, numberToItemTypeMap } from "../../../../lib/constants";
import { setCartItems } from "../../../../redux/reducers/cartItemsSlice";
import { setCypherStorageCart } from "../../../../lib/utils";
import { setCartAnim } from "../../../../redux/reducers/cartAnimSlice";
import handleImageError from "../../../../lib/helpers/handleImageError";

const DropMain: FunctionComponent<DropMainProps> = ({
  collections,
  router,
  dispatch,
  cartItems,
}) => {
  return (
    <div className="relative w-full h-fit flex items-center justify-center flex-row pt-52 sm:pt-40 md:pt-32 px-2 sm:px-10">
      <div className="relative w-full h-fit flex items-center justify-start">
        <div className="relative w-fit h-fit flex items-center justify-start flex-wrap gap-5">
          {collections?.map((collection: Creation, index: number) => {
            return (
              <div
                key={index}
                className="relative w-96 h-96 flex items-center justify-center bg-offBlack p-3 rounded-sm"
              >
                <div
                  className="relative w-full h-full rounded-sm hover:opacity-70 cursor-pointer"
                  id="staticLoad"
                  onClick={() =>
                    router.push(
                      `/item/${
                        numberToItemTypeMap[Number(collection?.origin)]
                      }/${collection?.title?.replaceAll(" ", "_")}`
                    )
                  }
                >
                  {collection?.images && (
                    <Image
                      className="rounded-sm"
                      layout="fill"
                      objectFit="cover"
                      draggable={false}
                      src={`${INFURA_GATEWAY}/ipfs/${
                        collection?.images?.[0]?.split("ipfs://")?.[1]
                      }`}
                      onError={(e) => handleImageError(e)}
                    />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-full h-12 bg-offBlack flex items-center justify-between px-3">
                  <div className="relative w-fit h-fit flex items-center justify-start text-sm font-bit text-white top-px">
                    {collection?.title?.length > 20
                      ? collection?.title?.slice(0, 20) + "..."
                      : collection?.title}
                  </div>
                  <div className="relative flex flex-row gap-2 ml-auto items-center justify-center">
                    <div className="relative w-fit h-fit flex items-center justify-start text-sm font-bit text-white top-px">
                      ${Number(collection?.prices?.[0]) / 10 ** 18}
                    </div>
                    <div
                      className="relative w-6 h-6 justify-end flex items-center cursor-pointer active:scale-95"
                      title="Add to Cart"
                      onClick={() => {
                        const newItem = {
                          item: collection,
                          amount: 1,
                          price: Number(collection?.prices?.[0]),
                          type: numberToItemTypeMap[Number(collection?.origin)],
                          color: collection?.colors?.[0],
                          size: collection?.sizes?.[0],
                          purchased: false,
                          chosenIndex: 0,
                        };

                        const existingItem = cartItems?.find(
                          (item) => item?.item?.pubId === collection?.pubId
                        );

                        if (existingItem) {
                          const newCartItems = [...(cartItems || [])];
                          const itemIndex = newCartItems?.indexOf(existingItem);

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
                          setCypherStorageCart(JSON.stringify(newCartItems));
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

export default DropMain;
