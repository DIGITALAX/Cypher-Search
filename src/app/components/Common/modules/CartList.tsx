import { INFURA_GATEWAY, LANGS } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { usePathname, useRouter } from "next/navigation";
import { FunctionComponent, JSX, useContext } from "react";
import { ImCross } from "react-icons/im";
import { CartItem, CartListProps } from "../types/common.types";
import { setCypherStorageCart } from "@/app/lib/utils";
import MediaSwitch from "./MediaSwitch";

const CartList: FunctionComponent<CartListProps> = ({
  dict,
  setCartListOpen,
  page,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const path = usePathname();
  const router = useRouter();
  return (
    <div
      className={`absolute z-50 w-60 h-72 rounded-sm bg-black flex flex-col p-3 border border-sol items-between justify-start ${
        page
          ? "right-1 sm:right-3 bottom-16"
          : `right-3 top-14 tablet:top-20 ${
              path?.includes("/checkout") ||
              (!context?.searchActive && LANGS.some((lang) => path === lang))
                ? "sm:top-16"
                : "sm:top-24"
            }`
      }`}
      id="milestone"
    >
      <div className="relative flex items-start justify-start overflow-y-scroll w-full h-full pb-2">
        {Number(context?.cartItems?.length) > 0 ? (
          <div className="relative flex flex-col gap-8 items-center justify-start w-full h-fit px-4 pt-2">
            {context?.cartItems?.map((item, index: number) => {
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
                        item?.item?.metadata?.mediaTypes?.[0] == "video"
                          ? "video"
                          : item?.item?.metadata?.mediaTypes?.[0] == "audio"
                          ? "audio"
                          : "image"
                      }
                      classNameImage={"rounded-sm w-full h-full flex relative"}
                      classNameVideo={{
                        objectFit: "cover",
                        display: "flex",
                        width: "100%",
                        height: "100%",
                        alignItems: "center",
                        justifyItems: "center",
                        borderRadius: "0.125rem",
                        position: "relative",
                      }}
                      classNameAudio={"rounded-sm w-full h-full flex relative"}
                      srcUrl={
                        item?.item?.metadata?.mediaTypes?.[0] == "video"
                          ? item?.item?.metadata?.video
                          : item?.item?.metadata?.mediaTypes?.[0] == "audio"
                          ? `${INFURA_GATEWAY}/ipfs/${
                              item?.item?.metadata?.audio?.split("ipfs://")?.[1]
                            }`
                          : `${INFURA_GATEWAY}/ipfs/${
                              item?.item?.metadata?.images?.[0]?.split(
                                "ipfs://"
                              )?.[1]
                            }`
                      }
                      srcCover={
                        item?.item?.metadata?.mediaCover
                          ? `${INFURA_GATEWAY}/ipfs/${
                              item?.item?.metadata?.mediaCover?.split(
                                "ipfs://"
                              )?.[1]
                            }`
                          : undefined
                      }
                    />

                    <div
                      className="absolute -right-1 border border-white -top-1 font-dog items-center justify-center w-fit h-fit text-center cursor-pointer p-1 rounded-full bg-black active:scale-95 text-white text-xs"
                      onClick={() => {
                        const newItems = context?.cartItems.filter(
                          (value: CartItem) =>
                            value?.item?.collectionId !==
                            item?.item?.collectionId
                        );
                        context?.setCartItems(newItems);
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
                          let allItems = [...context?.cartItems];

                          const cartIndex = allItems?.findIndex(
                            (value: CartItem) =>
                              value?.item?.postId === item?.item?.postId &&
                              value?.color == item?.color &&
                              value?.size == item?.size
                          );

                          if (
                            Number(
                              allItems[cartIndex]?.item?.tokenIdsMinted
                                ?.length || 0
                            ) +
                              1 +
                              Number(
                                allItems
                                  ?.filter(
                                    (item) =>
                                      item?.item?.postId ==
                                      allItems[cartIndex]?.item?.postId
                                  )
                                  ?.map((item) => item?.buyAmount)
                                  ?.reduce((sum, item) => sum + Number(item), 0)
                              ) >
                            Number(allItems[cartIndex]?.item?.amount)
                          ) {
                            context?.setModalOpen(dict?.lim);
                            return;
                          }

                          allItems[cartIndex] = {
                            ...allItems[cartIndex],
                            buyAmount: allItems[cartIndex]?.buyAmount + 1,
                          };

                          context?.setCartItems(allItems);
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
                          let allItems = [...context?.cartItems];

                          const cartIndex = allItems.findIndex(
                            (value: CartItem) =>
                              value?.item?.collectionId ===
                              item?.item?.collectionId
                          );

                          if (allItems[cartIndex]?.buyAmount - 1 == 0) {
                            allItems = allItems?.filter(
                              (value: CartItem) =>
                                value?.item?.collectionId !==
                                item?.item?.collectionId
                            );
                          } else {
                            allItems[cartIndex] = {
                              ...allItems[cartIndex],
                              buyAmount: allItems[cartIndex]?.buyAmount - 1,
                            };
                          }

                          context?.setCartItems(allItems);
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
                        {item?.buyAmount}
                      </div>
                      <div className="relative w-fit h-fit items-center justify-center text-sol break-words text-center">
                        x
                      </div>
                      <div className="relative w-fit h-fit items-center justify-center text-white break-words text-center">
                        ${item?.price}
                      </div>
                    </div>
                  </div>
                  {item?.size && item?.color && (
                    <div className="relative flex flex-row items-center justify-center gap-2 w-fit h-fit font-vcr text-xxs ml-auto">
                      <div className="relative w-fit h-fit items-center justify-center text-white break-words text-center">
                        {item?.size}
                      </div>
                      <div
                        className="relative w-3 h-3 items-center justify-center flex rounded-full border border-white"
                        style={{
                          backgroundColor: item?.color,
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="relative flex items-center justify-center font-dog text-white text-xxs break-words w-full h-full text-center whitespace-preline">
            {dict?.noitems}
          </div>
        )}
      </div>
      <div
        className={`relative w-full h-10 mb-0 rounded-sm bg-sol border border-black flex items-center justify-center font-bit text-black text-sm break-words text-center ${
          Number(context?.cartItems?.length) > 0
            ? "cursor-pointer active:scale-95"
            : "opacity-70"
        }`}
        onClick={() => {
          if (Number(context?.cartItems?.length) > 0) {
            setCartListOpen(false);
            router.push("/checkout");
          }
        }}
      >
        {dict?.check}
      </div>
    </div>
  );
};

export default CartList;
