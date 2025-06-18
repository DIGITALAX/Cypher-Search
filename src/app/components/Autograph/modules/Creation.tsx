import { INFURA_GATEWAY, numberToItemTypeMap } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { FunctionComponent, JSX, useContext, useState } from "react";
import { CreationProps } from "../types/autograph.types";
import MediaSwitch from "../../Common/modules/MediaSwitch";
import { Collection } from "../../Common/types/common.types";
import { setCypherStorageCart } from "@/app/lib/utils";
import { NFTData } from "../../Tiles/types/tiles.types";
import InteractBar from "../../Tiles/modules/InteractBar";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import handleImageError from "@/app/lib/helpers/handleImageError";
import HoverProfile from "../../Tiles/modules/HoverProfile";

const Creation: FunctionComponent<CreationProps> = ({
  dict,
  item,
  created,
}): JSX.Element => {
  const [profileHover, setProfileHover] = useState<boolean>(false);
  const [openInteractions, setOpenInteractions] = useState<boolean>(false);
  const context = useContext(ModalContext);
  const router = useRouter();

  return (
    <div
      className="relative w-80 h-80 bg-piloto flex items-center justify-start flex-col p-2 gap-4"
      id={(
        (item as Collection)?.postId ?? (item as NFTData)?.collectionId
      )?.toString()}
    >
      <div
        className={`relative w-full h-full flex items-center justify-center hover:opacity-90 rounded-md cursor-pointer border-2 ${
          created ? "border-lirio" : "border-olor"
        }`}
        onClick={() => {
          context?.setFiltersOpen({
            value: false,
            allow: false,
          });

          router.push(
            `/item/${
              numberToItemTypeMap[Number(item?.origin)]
            }/${item?.metadata?.title?.replaceAll(" ", "_")}`
          );
        }}
        id="staticLoad"
      >
        <div className="relative w-full h-full flex rounded-md">
          <MediaSwitch
            type={
              (item as Collection)?.metadata?.mediaTypes?.[0] == "video"
                ? "video"
                : (item as Collection)?.metadata?.mediaTypes?.[0] == "audio"
                ? "audio"
                : "image"
            }
            hidden
            classNameImage={"rounded-md w-full h-full flex relative"}
            classNameVideo={{
              objectFit: "cover",
              display: "flex",
              width: "100%",
              height: "252px",
              alignItems: "center",
              justifyItems: "center",
              borderRadius: "0.375rem",
              position: "relative",
              zIndex: "0",
            }}
            classNameAudio={"rounded-md w-full h-full flex relative"}
            srcUrl={
              (item as Collection)?.metadata?.mediaTypes?.[0] == "video"
                ? (item as Collection)?.metadata?.video
                : (item as Collection)?.metadata?.mediaTypes?.[0] == "audio"
                ? `${INFURA_GATEWAY}/ipfs/${
                    (item as Collection)?.metadata?.audio?.split("ipfs://")?.[1]
                  }`
                : `${INFURA_GATEWAY}/ipfs/${
                    (item as Collection)?.metadata?.images?.[0]?.split(
                      "ipfs://"
                    )?.[1] ??
                    (item as NFTData)?.metadata?.image?.split("ipfs://")?.[1]
                  }`
            }
            srcCover={
              (item as Collection)?.metadata?.mediaCover
                ? `${INFURA_GATEWAY}/ipfs/${
                    (item as Collection)?.metadata?.mediaCover?.split(
                      "ipfs://"
                    )?.[1]
                  }`
                : undefined
            }
          />
        </div>
        <div
          className={`absolute right-2 top-2 text-xxs text-white font-bit bg-offBlack flex items-center justify-center border border-white px-1 py-px  w-fit h-fit`}
        >
          <div className="relative w-fit h-fit flex items-center justify-center top-px">
            {item?.amount !== undefined &&
            item?.tokenIdsMinted?.length > 0 &&
            item?.amount == item?.tokenIdsMinted?.length
              ? dict?.sold
              : `${
                  item?.tokenIdsMinted?.length > 0
                    ? item?.tokenIdsMinted?.length
                    : 0
                }/${item?.amount}`}
          </div>
        </div>
      </div>
      <div className="relative flex w-full h-fit flex flex-row justify-between gap-2">
        {(item as Collection)?.post?.id && (
          <div className="relative w-fit h-fit flex items-center justify-center bg-black p-1">
            <div
              className={`relative w-7 h-7 items-center justify-center flex ${
                item?.amount == item?.tokenIdsMinted?.length
                  ? "opacity-70"
                  : "cursor-pointer"
              }`}
              onClick={() => {
                if (
                  item?.amount == item?.tokenIdsMinted?.length ||
                  !(item as Collection)?.postId
                )
                  return;

                if (
                  Number(item?.tokenIdsMinted?.length || 0) +
                    Number(
                      context?.cartItems
                        ?.filter(
                          (value) =>
                            (item as Collection)?.postId == value?.item?.postId
                        )
                        ?.map((item) => item?.buyAmount)
                        ?.reduce((sum, item) => sum + Number(item), 0)
                    ) +
                    1 >
                  Number(item?.amount)
                ) {
                  context?.setModalOpen(dict?.lim);
                  return;
                }
                const newItem = {
                  item: item as Collection,
                  buyAmount: 1,
                  price: Number((item as Collection)?.price),
                  type: numberToItemTypeMap[Number(item?.origin)],
                  color: item?.metadata?.colors?.[0]!,
                  size: item?.metadata?.sizes?.[0]!,
                  currency: (item as Collection)?.acceptedTokens?.[0],
                };

                const existingItem = context?.cartItems?.find(
                  (value) =>
                    value?.item?.postId === (item as Collection)?.postId
                );

                if (existingItem) {
                  const newCartItems = [...(context?.cartItems || [])];
                  const itemIndex = newCartItems?.indexOf(existingItem);

                  if (
                    existingItem?.color === newItem?.color &&
                    existingItem?.size === newItem?.size
                  ) {
                    newCartItems[itemIndex] = {
                      ...existingItem,
                      buyAmount: existingItem?.buyAmount + 1,
                    };
                  } else {
                    newCartItems.splice(itemIndex, 1);
                    newCartItems.push(newItem);
                  }

                  context?.setCartItems(newCartItems);
                  setCypherStorageCart(JSON.stringify(newCartItems));
                } else {
                  context?.setCartItems([
                    ...(context?.cartItems || []),
                    newItem,
                  ]);
                  setCypherStorageCart(
                    JSON.stringify([...(context?.cartItems || []), newItem])
                  );
                }

                context?.setCartAnim(true);
              }}
              title={
                item?.amount == item?.tokenIdsMinted?.length
                  ? dict?.sol2
                  : dict?.carA
              }
            >
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/QmUwGmmpAkBB6aVMq2s9oLcuJ4rsSUKjdyWepYVYGxVEKy`}
                draggable={false}
              />
            </div>
          </div>
        )}
        <div className="relative w-full h-full flex items-center justify-between flex flex-row gap-2 justify-between bg-black p-1 text-white font-bit">
          <div
            className="relative flex items-center justify-center w-7 h-7 rounded-full cursor-pointer"
            id="pfp"
            onMouseEnter={() => setProfileHover(true)}
          >
            <Image
              layout="fill"
              src={handleProfilePicture(item?.profile?.metadata?.picture)}
              draggable={false}
              key={item?.profile?.metadata?.picture}
              className="rounded-full"
              objectFit="cover"
              onError={(e) => handleImageError(e)}
            />
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center font-bit top-px text-xs">
            {item?.metadata?.title?.length > 13
              ? item?.metadata?.title?.slice(0, 10) + "..."
              : item?.metadata?.title}
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center font-bit top-px text-xs">
            $
            {(item as Collection)?.price ??
              (item as NFTData)?.prices?.[0]?.price}
          </div>
        </div>
        {profileHover && (
          <HoverProfile
            dict={dict}
            publication={item?.profile!}
            setProfileHover={setProfileHover}
            parentId={(
              (item as Collection)?.postId ?? (item as NFTData)?.collectionId
            )?.toString()}
            top={"auto"}
            bottom={"2px"}
            left={"2px"}
            right={"auto"}
          />
        )}
        {(item as Collection)?.post?.id && (
          <div className="relative w-fit h-fit flex items-center justify-center bg-black p-1">
            <div
              className={
                "relative w-7 h-7 items-center justify-center flex cursor-pointer"
              }
              onClick={() => setOpenInteractions((prev) => !prev)}
            >
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/QmevzGLZkZJD7qk8DKSorHYVPJwyAJ14fHWEmcpsmHH5B7`}
                draggable={false}
              />
            </div>
          </div>
        )}
        {openInteractions && (item as Collection)?.post?.id && (
          <div className="absolute flex items-center w-fit h-fit justify-center -top-24 right-0">
            <InteractBar
              publication={(item as Collection)?.post!}
              dict={dict}
              hideCollect
              display={numberToItemTypeMap[Number(item?.origin)]}
              gallery
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Creation;
