import { FunctionComponent } from "react";
import { ChromadinProps } from "../types/item.types";
import Image from "next/legacy/image";
import {
  ACCEPTED_TOKENS_MUMBAI,
  INFURA_GATEWAY,
  itemStringToType,
} from "../../../../lib/constants";
import Waveform from "@/components/Autograph/modules/Screen/Waveform";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import { AiOutlineLoading } from "react-icons/ai";
import { setCartItems } from "../../../../redux/reducers/cartItemsSlice";
import { setCartAnim } from "../../../../redux/reducers/cartAnimSlice";
import { setCypherStorageCart } from "../../../../lib/utils";

const Chromadin: FunctionComponent<ChromadinProps> = ({
  itemData,
  type,
  filterConstants,
  router,
  cartItems,
  purchaseDetails,
  oracleData,
  setPurchaseDetails,
  instantLoading,
  isApprovedSpend,
  dispatch,
  approveSpend,
  handleInstantPurchase,
  lensConnected,
}): JSX.Element => {
  const profilePicture = createProfilePicture(
    itemData?.profile?.metadata?.picture
  );
  return (
    <div className="relative w-full min-h-[50rem] flex items-center justify-center flex-row pt-32 px-12 gap-7 h-fit">
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative p-3 bg-black flex items-center justify-center w-[40rem] h-[37rem]">
          <div className="flex items-center justify-center w-full h-full bg-amo/30">
            {itemData?.images?.length > 1 && (
              <div className="absolute left-5 top-5 w-fit h-fit flex flex-row items-center justify-center gap-1.5">
                <div
                  className="relative w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center rotate-90"
                  onClick={() =>
                    setPurchaseDetails((prev) => ({
                      ...prev,
                      imageIndex:
                        prev.imageIndex + 1 > itemData?.images?.length
                          ? 0
                          : prev.imageIndex + 1,
                    }))
                  }
                >
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/Qma3jm41B4zYQBxag5sJSmfZ45GNykVb8TX9cE3syLafz2`}
                    layout="fill"
                    draggable={false}
                  />
                </div>
                <div
                  className="relative w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center rotate-90"
                  onClick={() =>
                    setPurchaseDetails((prev) => ({
                      ...prev,
                      imageIndex:
                        prev.imageIndex - 1 == 0 ? prev.imageIndex - 1 : 0,
                    }))
                  }
                >
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/QmcBVNVZWGBDcAxF4i564uSNGZrUvzhu5DKkXESvhY45m6`}
                    layout="fill"
                    draggable={false}
                  />
                </div>
              </div>
            )}
            <div
              title={type}
              className="w-5 h-5 absolute right-5 top-5 rounded-full flex border border-white"
            >
              <Image
                src={`${INFURA_GATEWAY}/ipfs/${
                  filterConstants?.origin?.map(
                    (item) => item[0]?.toLowerCase()?.trim() === type
                  )?.[1]
                }`}
                layout="fill"
                draggable={false}
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            {itemData?.video ? (
              <video className="object-cover flex items-center justify-center">
                <source src={`${INFURA_GATEWAY}/ipfs/${itemData?.video}`} />{" "}
              </video>
            ) : (
              itemData?.images?.[0] && (
                <Image
                  layout="fill"
                  objectFit="contain"
                  draggable={false}
                  src={`${INFURA_GATEWAY}/ipfs/${itemData?.images?.[0]}`}
                />
              )
            )}
            {(itemData?.video || itemData?.audio) && (
              <Waveform
                audio={itemData?.audio}
                type={"audio"}
                keyValue={itemData?.audio || itemData?.video}
                video={itemData?.video}
              />
            )}
          </div>
        </div>
      </div>
      <div className="relative w-full h-full flex items-end justify-start ml-auto flex-col gap-12">
        <div className="relative w-full h-full flex items-end justify-start ml-auto flex-col gap-4">
          <div className="relative w-fit h-fit flex items-end justify-end font-aust text-white break-words text-5xl mt-0">
            {itemData?.title}
          </div>
          <div className="relative w-fit h-fit gap-4 flex-row flex flex-wrap items-center justify-center">
            <div className="relative w-fit h-fit flex flex-row gap-2 items-end justify-end font-aust text-white break-words text-sm cursor-pointer">
              <div
                className="relative flex flex-row gap-4 w-5 h-5 items-center justify-start rounded-full border border-offWhite"
                id="pfp"
                onClick={() =>
                  router.push(`/autograph/${itemData?.profileHandle}`)
                }
              >
                {profilePicture && (
                  <Image
                    layout="fill"
                    draggable={false}
                    src={profilePicture}
                    objectFit="cover"
                    className="rounded-full"
                  />
                )}
              </div>
              <div className="relative w-fit h-fit items-center justify-center flex">
                {itemData?.profileHandle}
              </div>
            </div>
            {itemData?.microbrandCover && (
              <div className="relative w-fit h-fit flex flex-row gap-2 items-end justify-end font-aust text-white break-words text-sm cursor-pointer">
                <div
                  className="relative flex flex-row gap-4 w-5 h-5 items-center justify-start rounded-full border border-offWhite"
                  id="pfp"
                  onClick={() =>
                    router.push(`/item/microbrand/${itemData?.microbrand}`)
                  }
                >
                  {itemData?.microbrandCover && (
                    <Image
                      layout="fill"
                      draggable={false}
                      src={`${INFURA_GATEWAY}/ipfs/${itemData?.microbrandCover}`}
                      objectFit="cover"
                      className="rounded-full"
                    />
                  )}
                </div>
                <div className="relative w-fit h-fit items-center justify-center flex">
                  {itemData?.microbrand}
                </div>
              </div>
            )}
          </div>
          <div className="relative flex items-end w-fit h-fit justify-end items-center text-sol font-bit justify-center flex-col gap-1.5 ml-auto">
            <div className="relative w-full h-fit items-end justify-end text-base ml-auto">
              {Number(itemData?.amount) - Number(itemData?.soldTokens) > 0
                ? `${Number(itemData?.amount)}/${Number(itemData?.soldTokens)}`
                : "SOLD OUT"}
            </div>
          </div>
          <div className="relative w-full h-fit flex font-bit text-xxs text-white">
            <div className="relative w-1/2 h-fit flex flex-wrap items-end justify-end ml-auto gap-3">
              {itemData?.tags?.map((tag: string, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative w-fit h-fit px-2 py-1 rounded-full flex items-center justify-center text-center"
                    style={{
                      backgroundColor:
                        index % 3 === 0
                          ? "#078fd6"
                          : index % 4 === 0
                          ? "#FFDCFF"
                          : "#81A8F8",
                    }}
                  >
                    <div className="relative w-fit h-fit flex top-px">
                      {tag}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative w-fit h-fit max-h-[7rem] flex items-start justify-end overflow-y-scroll">
            <div className="relative w-3/4 h-fit flex items-start justify-end mr-0 text-right font-aust text-white break-words text-xs">
              {itemData?.title}
            </div>
          </div>
          <div className="relative justify-end items-end flex w-1/2 h-fit flex flex-row ml-auto gap-3">
            {filterConstants?.access
              ?.filter((item: string[]) => itemData?.access?.includes(item[0]))
              ?.map((item: string[], index: number) => {
                return (
                  <div
                    key={index}
                    className="relative flex w-10 h-10 rounded-full items-center justify-center"
                    title={item?.[0]}
                  >
                    <Image
                      layout="fill"
                      objectFit="cover"
                      src={`${INFURA_GATEWAY}/ipfs/${item?.[1]}`}
                      className="rounded-full"
                      draggable={false}
                    />
                  </div>
                );
              })}
          </div>
        </div>
        <div className="relative w-full h-full flex items-end justify-start flex-col gap-3 mt-auto">
          <div className="flex flex-col gap-2 items-end justify-start relative">
            <div className="relative text-5xl font-bit w-fit h-fit text-sol font-bit">
              {`${Number(
                (
                  Number(itemData?.prices?.[0]) /
                  Number(
                    oracleData?.find(
                      (oracle) =>
                        oracle.currency ===
                        itemData?.acceptedTokens?.find(
                          (item) => item[2] === purchaseDetails?.currency
                        )?.[2]
                    )?.rate
                  )
                )?.toFixed(3)
              )} ${
                itemData?.acceptedTokens?.find(
                  (item) => item[2] === purchaseDetails?.currency
                )?.[1]
              }`}
            </div>
            <div className="relative flex flex-row gap-3 items-center justify-center">
              {itemData?.acceptedTokens?.map(
                (item: string, indexTwo: number) => {
                  return (
                    <div
                      className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95 ${
                        purchaseDetails?.currency === item
                          ? "opacity-50"
                          : "opacity-100"
                      }`}
                      key={indexTwo}
                      onClick={() =>
                        setPurchaseDetails((prev) => ({
                          ...prev,
                          currency: item,
                        }))
                      }
                    >
                      <Image
                        src={`${INFURA_GATEWAY}/ipfs/${
                          ACCEPTED_TOKENS_MUMBAI?.find(
                            (value) => value[2] == item
                          )?.[0]
                        }`}
                        className="flex"
                        draggable={false}
                        width={30}
                        height={35}
                      />
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {type === "coinop" && (
            <div className="relative w-fit h-fit flex flex-row gap-6 items-end justify-end text-white font-bit text-xxs pt-4">
              <div className="relative flex items-end w-fit h-fit justify-end items-center justify-center flex-col gap-1.5 ml-auto">
                <div className="relative w-full h-fit items-end justify-end text-base ml-auto">
                  Color
                </div>
                <div className="relative flex flex-row gap-2 items-center justify-center w-fit h-fit flex-wrap">
                  {itemData?.colors?.map((item: string, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`relative w-6 h-6 flex items-center justify-center rounded-full cursor-pointer active:scale-95 border ${
                          item === purchaseDetails?.color
                            ? "border-black opacity-100"
                            : "border-white opacity-70"
                        }`}
                        style={{
                          backgroundColor: item,
                        }}
                        onClick={() =>
                          setPurchaseDetails((prev) => ({
                            ...prev,
                            color: item,
                          }))
                        }
                      ></div>
                    );
                  })}
                </div>
              </div>
              <div className="relative flex items-end justify-end items-center justify-center h-fit w-fit flex-col gap-1.5 ml-auto">
                <div className="relative w-full h-fit items-end justify-end text-base ml-auto">
                  Size
                </div>
                <div className="relative flex flex-row gap-2 items-center justify-center w-fit h-fit flex-wrap">
                  {itemData?.sizes?.map((item: string, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`relative w-6 h-6 flex items-center justify-center rounded-full cursor-pointer text-white font-bit text-xxs active:scale-95 border ${
                          item === purchaseDetails?.color
                            ? "border-black opacity-100"
                            : "border-white opacity-70"
                        }`}
                        onClick={() =>
                          setPurchaseDetails((prev) => ({
                            ...prev,
                            size: item,
                          }))
                        }
                      >
                        <div className="relative w-fit h-fit flex items-center justify-center top-px">
                          {item}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="relative w-fit h-fit flex items-center justify-center flex-row gap-6 justify-end items-end">
          {type == "chromadin" && (
            <div
              className={`relative w-36 text-sm h-10 rounded-sm flex items-center justify-center border border-white text-black font-bit bg-sol px-2 py-1 ${
                !lensConnected?.id
                  ? "opacity-70"
                  : "cursor-pointer active:scale-95"
              }`}
              onClick={() =>
                lensConnected?.id &&
                !instantLoading &&
                (isApprovedSpend ? handleInstantPurchase() : approveSpend())
              }
              title="Instant Checkout"
            >
              <div
                className={`relative w-fit h-fit flex items-center justify-center ${
                  instantLoading && "animate-spin"
                }`}
              >
                {instantLoading ? (
                  <AiOutlineLoading size={15} color="white" />
                ) : !lensConnected?.id ? (
                  "Connect"
                ) : !isApprovedSpend ? (
                  "Approve Spend"
                ) : (
                  "Collect Item"
                )}
              </div>
            </div>
          )}
          <div
            className="relative w-10 h-10 justify-end flex items-center cursor-pointer active:scale-95"
            title="Add to Cart"
            onClick={() => {
              const newItem = {
                item: itemData,
                amount: 0,
                price: Number(purchaseDetails.price),
                type: itemStringToType[type.toLowerCase().trim()],
                color: purchaseDetails.color,
                size: purchaseDetails.size,
                purchased: false,
                chosenIndex: itemData?.prices?.findIndex(
                  (item) => item == purchaseDetails.price
                ),
              };

              const existingItem = cartItems?.find(
                (item) => item?.item?.pubId === itemData?.pubId
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
                setCypherStorageCart(JSON.stringify([...cartItems, newItem]));
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
};

export default Chromadin;