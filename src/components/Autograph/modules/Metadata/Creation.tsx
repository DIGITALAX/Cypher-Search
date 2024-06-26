import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import {
  INFURA_GATEWAY,
  numberToItemTypeMap,
} from "../../../../../lib/constants";
import { CreationProps } from "../../types/autograph.types";
import HoverProfile from "@/components/Common/modules/HoverProfile";
import InteractBar from "@/components/Common/modules/InteractBar";
import { setCartItems } from "../../../../../redux/reducers/cartItemsSlice";
import { setCartAnim } from "../../../../../redux/reducers/cartAnimSlice";
import createProfilePicture from "../../../../../lib/helpers/createProfilePicture";
import { setCypherStorageCart } from "../../../../../lib/utils";
import handleImageError from "../../../../../lib/helpers/handleImageError";
import MediaSwitch from "@/components/Common/modules/MediaSwitch";
import { setInsufficientBalance } from "../../../../../redux/reducers/insufficientBalanceSlice";
import { setFiltersOpen } from "../../../../../redux/reducers/filtersOpenSlice";

const Creation: FunctionComponent<CreationProps> = ({
  item,
  index,
  t,
  profileHovers,
  setProfileHovers,
  router,
  followLoading,
  followProfile,
  unfollowProfile,
  created,
  interactionsLoading,
  openMirrorChoice,
  setOpenMirrorChoice,
  openInteractions,
  setOpenInteractions,
  like,
  mirror,
  dispatch,
  locale,
  cartItems,
  lensConnected,
}): JSX.Element => {
  const profilePicture = createProfilePicture(item?.profile?.metadata?.picture);
  return (
    <div
      className="relative w-80 h-80 bg-piloto flex items-center justify-start flex-col p-2 gap-4"
      id={item?.pubId}
    >
      <div
        className={`relative w-full h-full flex items-center justify-center hover:opacity-90 rounded-md cursor-pointer border-2 ${
          created ? "border-lirio" : "border-olor"
        }`}
        onClick={() => {
          dispatch(
            setFiltersOpen({
              actionValue: false,
              actionAllow: false,
            })
          );
          router.push(
            `/item/${
              numberToItemTypeMap[Number(item?.origin)]
            }/${item?.collectionMetadata?.title?.replaceAll(" ", "_")}`
          );
        }}
        id="staticLoad"
      >
        <div className="relative w-full h-full flex">
          <MediaSwitch
            type={
              item?.collectionMetadata?.mediaTypes?.[0] == "video"
                ? "video"
                : item?.collectionMetadata?.mediaTypes?.[0] == "audio"
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
              item?.collectionMetadata?.mediaTypes?.[0] == "video"
                ? item?.collectionMetadata?.video
                : item?.collectionMetadata?.mediaTypes?.[0] == "audio"
                ? `${INFURA_GATEWAY}/ipfs/${
                    item?.collectionMetadata?.audio?.split("ipfs://")?.[1]
                  }`
                : `${INFURA_GATEWAY}/ipfs/${
                    item?.collectionMetadata?.images?.[0]?.split("ipfs://")?.[1]
                  }`
            }
            srcCover={
              item?.collectionMetadata?.mediaCover
                ? `${INFURA_GATEWAY}/ipfs/${
                    item?.collectionMetadata?.mediaCover?.split("ipfs://")?.[1]
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
            item?.soldTokens !== undefined &&
            item?.amount == item?.soldTokens
              ? t("sold")
              : `${item?.soldTokens ? item?.soldTokens : 0}/${item?.amount}`}
          </div>
        </div>
      </div>
      <div className="relative flex w-full h-fit flex flex-row justify-between gap-2">
        <div className="relative w-fit h-fit flex items-center justify-center bg-black p-1">
          <div
            className={`relative w-7 h-7 items-center justify-center flex ${
              item?.amount == item?.soldTokens ? "opacity-70" : "cursor-pointer"
            }`}
            onClick={() => {
              if (item?.amount == item?.soldTokens) return;

              if (
                Number(item?.soldTokens || 0) +
                  Number(
                    cartItems
                      ?.filter((value) => item?.pubId == value?.item?.pubId)
                      ?.map((item) => item?.buyAmount)
                      ?.reduce((sum, item) => sum + Number(item), 0)
                  ) +
                  1 >
                Number(item?.amount)
              ) {
                dispatch(
                  setInsufficientBalance({
                    actionValue: true,
                    actionMessage: t("lim"),
                  })
                );
                return;
              }
              const newItem = {
                item,
                buyAmount: 1,
                price: Number(item?.prices?.[0]),
                type: numberToItemTypeMap[Number(item?.origin)],
                color: item?.collectionMetadata?.colors?.[0],
                size: item?.collectionMetadata?.sizes?.[0],
                purchased: false,
                chosenIndex: 0,
              };

              const existingItem = cartItems?.find(
                (value) => Number(value?.item?.pubId) === Number(item?.pubId)
              );

              if (existingItem) {
                const newCartItems = [...cartItems];
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

                dispatch(setCartItems(newCartItems));
                setCypherStorageCart(JSON.stringify(newCartItems));
              } else {
                dispatch(setCartItems([...cartItems, newItem]));
                setCypherStorageCart(JSON.stringify([...cartItems, newItem]));
              }

              dispatch(setCartAnim(true));
            }}
            title={
              item?.amount == item?.soldTokens ? t("sol2") : t("carA")
            }
          >
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmUwGmmpAkBB6aVMq2s9oLcuJ4rsSUKjdyWepYVYGxVEKy`}
              draggable={false}
            />
          </div>
        </div>
        <div className="relative w-full h-full flex items-center justify-between flex flex-row gap-2 justify-between bg-black p-1 text-white font-bit">
          <div
            className="relative flex items-center justify-center w-7 h-7 rounded-full cursor-pointer"
            id="pfp"
            onMouseEnter={() =>
              setProfileHovers((prev) => {
                const arr = [...prev];
                arr[index] = true;
                return arr;
              })
            }
          >
            {profilePicture && (
              <Image
                layout="fill"
                src={profilePicture}
                draggable={false}
                className="rounded-full"
                objectFit="cover"
                onError={(e) => handleImageError(e)}
              />
            )}
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center font-bit top-px text-xs">
            {item?.collectionMetadata?.title?.length > 13
              ? item?.collectionMetadata?.title?.slice(0, 10) + "..."
              : item?.collectionMetadata?.title}
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center font-bit top-px text-xs">
            ${item?.prices?.[0]}
          </div>
        </div>
        {profileHovers?.[index] && (
          <HoverProfile
            followLoading={followLoading}
            followProfile={followProfile}
            unfollowProfile={unfollowProfile}
            router={router}
            publication={item?.profile}
            index={index}
            setProfileHovers={setProfileHovers}
            dispatch={dispatch}
            lensConnected={lensConnected}
            parentId={item?.pubId}
            top={"auto"}
            feed={false}
            bottom={"2px"}
            left={"2px"}
            right={"auto"}
            gallery
          />
        )}
        <div className="relative w-fit h-fit flex items-center justify-center bg-black p-1">
          <div
            className="relative w-7 h-7 items-center justify-center flex cursor-pointer"
            onClick={() =>
              setOpenInteractions((prev) => {
                const updatedArray = [...prev];
                updatedArray[index] = !updatedArray[index];
                return updatedArray;
              })
            }
          >
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmevzGLZkZJD7qk8DKSorHYVPJwyAJ14fHWEmcpsmHH5B7`}
              draggable={false}
            />
          </div>
        </div>
        {openInteractions?.[index] && (
          <div className="absolute flex items-center w-fit h-fit justify-center -top-12 right-0">
            <InteractBar
              simpleCollect={undefined}
              dispatch={dispatch}
              like={like}
              locale={locale}
              mirror={mirror}
              openMirrorChoice={openMirrorChoice}
              setOpenMirrorChoice={setOpenMirrorChoice}
              interactionsLoading={interactionsLoading}
              index={index}
              publication={item?.publication}
              hideCollect
              router={router}
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
