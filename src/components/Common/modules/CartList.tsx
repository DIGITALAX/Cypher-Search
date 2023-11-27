import { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { CartItem, CartListProps } from "../types/common.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import handleImageError from "../../../../lib/helpers/handleImageError";
import { setCypherStorageCart } from "../../../../lib/utils";
import { setCartItems } from "../../../../redux/reducers/cartItemsSlice";
import MediaSwitch from "./MediaSwitch";

const CartList: FunctionComponent<CartListProps> = ({
  cartItems,
  router,
  dispatch,
  setCartListOpen,
  page,
}): JSX.Element => {
  return (
    <div
      className={`absolute z-30 w-60 h-72 rounded-sm bg-black flex flex-col p-3 border border-sol items-between justify-start ${
        page ? "right-1 sm:right-3 bottom-16" : "right-3 top-14 tablet:top-16"
      }`}
      id="milestone"
    >
      <div className="relative flex items-start justify-start overflow-y-scroll w-full h-full pb-2">
        {cartItems?.length > 0 ? (
          <div className="relative flex flex-col gap-8 items-center justify-start w-full h-fit px-4 pt-2">
            {cartItems?.map((item, index: number) => {
              return (
                <div
                  key={index}
                  className="relative flex flex-col gap-1 w-full h-fit items-center justify-start"
                >
                  <div
                    className="relative w-full h-40 flex items-center justify-center rounded-sm"
                    id="pfp"
                  >
                    <MediaSwitch
                      hidden
                      type={
                        item?.item.mediaTypes?.[0] == "video"
                          ? "video"
                          : item?.item.mediaTypes?.[0] == "audio"
                          ? "audio"
                          : "image"
                      }
                      classNameImage={"rounded-sm w-full h-full flex relative"}
                      classNameVideo={
                        "object-cover w-full h-full flex items-center justify-center rounded-sm"
                      }
                      classNameAudio={"rounded-sm w-full h-full flex relative"}
                      srcUrl={
                        item?.item.mediaTypes?.[0] == "video"
                          ? `${INFURA_GATEWAY}/ipfs/${
                              item?.item?.video?.split("ipfs://")?.[1]
                            }`
                          : item?.item.mediaTypes?.[0] == "audio"
                          ? `${INFURA_GATEWAY}/ipfs/${
                              item?.item?.audio?.split("ipfs://")?.[1]
                            }`
                          : `${INFURA_GATEWAY}/ipfs/${
                              item?.item?.images?.[0]?.split("ipfs://")?.[1]
                            }`
                      }
                      srcCover={
                        item?.item?.mediaCover
                          ? `${INFURA_GATEWAY}/ipfs/${
                              item?.item?.mediaCover?.split("ipfs://")?.[1]
                            }`
                          : undefined
                      }
                    />

                    <div
                      className="absolute -right-1 border border-white -top-1 font-dog items-center justify-center w-fit h-fit text-center cursor-pointer p-1 rounded-full bg-black active:scale-95 text-white text-xs"
                      onClick={() => {
                        const newItems = cartItems.filter(
                          (value: CartItem) =>
                            value?.item?.collectionId !==
                            item?.item?.collectionId
                        );
                        dispatch(setCartItems(newItems));
                        setCypherStorageCart(JSON.stringify(newItems));
                      }}
                    >
                      <div className="relative w-fit h-fit flex items-center justify-center">
                        <ImCross size={8} color={"white"} />
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full h-fit flex items-center justify-between gap-2">
                    <div className="relative w-fit h-fit flex items-center justify-center text-sm text-sol">
                      <div
                        className="relative w-5 h-5 bg-offBlack flex items-center justify-center cursor-pointer active:scale-95 border border-white rounded-sm"
                        onClick={() => {
                          const allItems = [...cartItems];

                          const cartIndex = cartItems?.findIndex(
                            (value: CartItem) =>
                              value?.item?.collectionId ===
                              item?.item?.collectionId
                          );

                          allItems[cartIndex] = {
                            ...allItems[cartIndex],
                            amount: allItems[cartIndex]?.amount + 1,
                          };

                          dispatch(setCartItems(allItems));
                          setCypherStorageCart(JSON.stringify(allItems));
                        }}
                      >
                        <div className="relative w-fit h-fit flex items-center justify-center">
                          +
                        </div>
                      </div>
                      <div
                        className="relative w-5 h-5 bg-offBlack flex items-center justify-center cursor-pointer active:scale-95 border border-white rounded-sm"
                        onClick={() => {
                          let allItems = [...cartItems];

                          const cartIndex = cartItems.findIndex(
                            (value: CartItem) =>
                              value?.item?.collectionId ===
                              item?.item?.collectionId
                          );

                          if (allItems[cartIndex]?.amount - 1 == 0) {
                            allItems = allItems?.filter(
                              (value: CartItem) =>
                                value?.item?.collectionId !==
                                item?.item?.collectionId
                            );
                          } else {
                            allItems[cartIndex] = {
                              ...allItems[cartIndex],
                              amount: allItems[cartIndex]?.amount - 1,
                            };
                          }

                          dispatch(setCartItems(allItems));
                          setCypherStorageCart(JSON.stringify(allItems));
                        }}
                      >
                        <div className="relative w-fit h-fit flex items-center justify-center">
                          -
                        </div>
                      </div>
                    </div>
                    <div className="relative flex flex-row items-center justify-between gap-2 w-fit h-fit font-vcr text-sm">
                      <div className="relative w-fit h-fit items-center justify-center text-white break-words text-center">
                        {item.amount}
                      </div>
                      <div className="relative w-fit h-fit items-center justify-center text-sol break-words text-center">
                        x
                      </div>
                      <div className="relative w-fit h-fit items-center justify-center text-white break-words text-center">
                        ${item.price}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="relative flex items-center justify-center font-dog text-white text-xxs break-words w-full h-full text-center">
            No Items <br /> In Cart Yet.
          </div>
        )}
      </div>
      <div
        className={`relative w-full h-10 mb-0 rounded-sm bg-sol border border-black flex items-center justify-center font-bit text-black text-sm break-words text-center ${
          cartItems?.length > 0
            ? "cursor-pointer active:scale-95"
            : "opacity-70"
        }`}
        onClick={() => {
          if (cartItems?.length > 0) {
            setCartListOpen(false);
            router.push("/checkout");
          }
        }}
      >
        Checkout
      </div>
    </div>
  );
};

export default CartList;
