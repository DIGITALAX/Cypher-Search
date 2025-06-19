import { FunctionComponent, useContext } from "react";
import Image from "next/legacy/image";
import { Collection, DropMainProps } from "../../Common/types/common.types";
import { INFURA_GATEWAY, numberToItemTypeMap } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import MediaSwitch from "../../Common/modules/MediaSwitch";
import { useRouter } from "next/navigation";
import { setCypherStorageCart } from "@/app/lib/utils";
import { NFTData } from "../../Tiles/types/tiles.types";

const DropMain: FunctionComponent<DropMainProps> = ({ drop, dict }) => {
  const context = useContext(ModalContext);
  const router = useRouter();
  return (
    <div className="relative w-full h-fit flex items-center justify-center flex-row pt-52 sm:pt-40 md:pt-36 px-2 sm:px-10">
      <div className="relative w-full h-fit flex items-center justify-start">
        <div className="relative w-full pre:w-fit h-fit flex items-center justify-center flex-wrap gap-5">
          {drop?.collections?.map((collection, index: number) => {
            return (
              <div
                key={index}
                className="relative w-full h-72 pre:w-96 sm:h-96 flex items-center justify-center bg-offBlack p-3 rounded-sm"
              >
                <div
                  className="relative w-full h-full rounded-sm hover:opacity-70 cursor-pointer"
                  id="staticLoad"
                  onClick={() => {
                    context?.setFiltersOpen({ value: false, allow: false });
                    router.push(
                      `/item/${
                        collection?.origin == "4"
                          ? "coinop"
                          : numberToItemTypeMap[Number(collection?.origin)]
                      }/${collection?.metadata?.title?.replaceAll(" ", "_")}`
                    );
                  }}
                >
                  <MediaSwitch
                    hidden
                    type={
                      (collection as Collection).metadata?.mediaTypes?.[0] ==
                      "video"
                        ? "video"
                        : (collection as Collection).metadata
                            ?.mediaTypes?.[0] == "audio"
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
                      zIndex: "0",
                    }}
                    classNameAudio={"rounded-sm w-full h-full flex relative"}
                    srcUrl={
                      (collection as Collection).metadata?.mediaTypes?.[0] ==
                      "video"
                        ? (collection as Collection)?.metadata?.video
                        : (collection as Collection).metadata
                            ?.mediaTypes?.[0] == "audio"
                        ? `${INFURA_GATEWAY}/ipfs/${
                            (collection as Collection)?.metadata?.audio?.split(
                              "ipfs://"
                            )?.[1]
                          }`
                        : `${INFURA_GATEWAY}/ipfs/${
                            ((collection as Collection)?.postId
                              ? (collection as Collection)?.metadata
                                  ?.images?.[0]
                              : (collection as NFTData)?.metadata?.image
                            )?.split("ipfs://")?.[1]
                          }`
                    }
                    srcCover={
                      (collection as Collection)?.metadata?.mediaCover
                        ? `${INFURA_GATEWAY}/ipfs/${
                            (
                              collection as Collection
                            )?.metadata?.mediaCover?.split("ipfs://")?.[1]
                          }`
                        : undefined
                    }
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-full h-12 bg-offBlack flex items-center justify-between px-3 z-2">
                  <div className="relative w-fit h-fit flex items-center justify-start text-sm font-bit text-white top-px">
                    {collection?.metadata?.title?.length > 20
                      ? collection?.metadata?.title?.slice(0, 20) + "..."
                      : collection?.metadata?.title}
                  </div>
                  <div className="relative flex flex-row gap-2 ml-auto items-center justify-center">
                    <div className="relative w-fit h-fit flex items-center justify-start text-sm font-bit text-white top-px">
                      $
                      {Number(
                        (collection as Collection)?.price ??
                          (collection as NFTData)?.prices?.[0]?.price
                      ) /
                        10 ** 18}
                    </div>
                    <div
                      className={`relative w-6 h-6 justify-end flex items-center ${
                        collection?.amount == collection?.tokenIdsMinted?.length
                          ? "opacity-70"
                          : "cursor-pointer active:scale-95"
                      }`}
                      title={dict?.cart}
                      onClick={() => {
                        if (
                          collection?.amount ==
                            collection?.tokenIdsMinted?.length ||
                          !(collection as Collection)?.postId
                        )
                          return;

                        if (
                          Number(collection?.tokenIdsMinted?.length || 0) +
                            Number(
                              context?.cartItems
                                ?.filter(
                                  (value) =>
                                    (collection as Collection)?.postId ==
                                    value?.item?.postId
                                )
                                ?.map((item) => item?.buyAmount)
                                ?.reduce((sum, item) => sum + Number(item), 0)
                            ) +
                            1 >
                          Number(collection?.amount)
                        ) {
                          context?.setModalOpen(dict?.lim);
                          return;
                        }

                        const newItem = {
                          item: collection as Collection,
                          buyAmount: 1,
                          price:
                            Number((collection as Collection)?.price) /
                            10 ** 18,
                          type: numberToItemTypeMap[Number(collection?.origin)],
                          color: collection?.metadata?.colors?.[0]!,
                          size: collection?.metadata?.sizes?.[0]!,
                          currency: (collection as Collection)
                            ?.acceptedTokens?.[0],
                        };

                        const existingItem = context?.cartItems?.find(
                          (item) =>
                            item?.item?.postId ===
                            (collection as Collection)?.postId
                        );

                        if (existingItem) {
                          const newCartItems = [...(context?.cartItems || [])];
                          const itemIndex = newCartItems?.indexOf(existingItem);

                          if (
                            existingItem?.color === newItem?.color &&
                            existingItem?.size === newItem?.size
                          ) {
                            newCartItems[itemIndex] = {
                              ...(existingItem || {}),
                              buyAmount: existingItem?.buyAmount + 1,
                            };
                          } else {
                            newCartItems?.splice(itemIndex, 1);
                            newCartItems?.push(newItem);
                          }

                          context?.setCartItems(newCartItems);
                          setCypherStorageCart(JSON.stringify(newCartItems));
                        } else {
                          context?.setCartItems([
                            ...(context?.cartItems || []),
                            newItem,
                          ]);
                          setCypherStorageCart(
                            JSON.stringify([
                              ...(context?.cartItems || []),
                              newItem,
                            ])
                          );
                        }

                        context?.setCartAnim(true);
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
