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

const Creation: FunctionComponent<CreationProps> = ({
  item,
  index,
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
  cartItems,
}): JSX.Element => {
  const profilePicture = createProfilePicture(item?.profile?.metadata?.picture);
  return (
    <div className="relative w-80 h-80 bg-piloto flex items-center justify-start flex-col p-2 gap-4">
      <div
        className={`relative w-full h-full flex items-center justify-center hover:opacity-90 rounded-md cursor-pointer border-2 ${
          created ? "border-lirio" : "border-olor"
        }`}
        onClick={() => {
          const newItem = {
            item,
            amount: 1,
            price: Number(item.prices?.[0]),
            type: numberToItemTypeMap[Number(item?.origin)],
            color: item?.colors?.[0],
            size: item?.sizes?.[0],
            purchased: false,
            chosenIndex: 0,
          };

          const existingItem = cartItems?.find(
            (value) => value?.item?.pubId === item?.pubId
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
                amount: existingItem?.amount + 1,
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
        id="staticLoad"
      >
        {item?.images?.[0] && (
          <Image
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/${item?.images?.[0]}`}
            draggable={false}
            className="rounded-md"
            objectFit="cover"
          />
        )}
      </div>
      <div className="relative flex w-full h-fit flex flex-row justify-between gap-2">
        <div className="relative w-fit h-fit flex items-center justify-center bg-black p-1">
          <div
            className="relative w-7 h-7 items-center justify-center flex cursor-pointer"
            onClick={() =>
              router.push(
                `/item/${numberToItemTypeMap[Number(item?.origin)]}/${
                  item?.pubId
                }`
              )
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
                const updatedArray = [...prev];
                updatedArray[index] = true;
                return updatedArray;
              })
            }
          >
            {profilePicture && (
              <Image layout="fill" src={profilePicture} draggable={false} />
            )}
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center font-bit top-px text-xs">
            {item?.title?.length > 13
              ? item?.title?.slice(0, 10) + "..."
              : item?.title}
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
              mirror={mirror}
              openMirrorChoice={openMirrorChoice}
              setOpenMirrorChoice={setOpenMirrorChoice}
              interactionsLoading={interactionsLoading}
              index={index}
              type={undefined}
              publication={item?.publication}
              hideCollect
              router={router}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Creation;
