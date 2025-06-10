import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import {
  ACCEPTED_TOKENS,
  INFURA_GATEWAY,
  printTypeToString,
} from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { useRouter } from "next/navigation";
import { ModalContext } from "@/app/providers";
import { AiOutlineLoading } from "react-icons/ai";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { TripleAProps } from "../types/items.type";
import { PrintType as PrintTypeTag } from "../../Common/types/common.types";
import PrintType from "../../Tiles/modules/PrintType";
import useTripleA from "../hooks/useTripleA";
import { CollectionType } from "../../Tiles/types/tiles.types";
import Fulfillment from "./Fulfillment";

const TripleA: FunctionComponent<TripleAProps> = ({
  itemData,
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const router = useRouter();
  const {
    purchaseDetails,
    setPurchaseDetails,
    handleInstantPurchase,
    instantLoading,
    approveSpend,
    isApprovedSpend,
    hoverPrompt,
    setHoverPrompt,
  } = useTripleA(dict, itemData);
  return (
    <div
      className={`relative w-full h-fit xl:h-[50rem] flex items-center justify-center flex-row pre:pt-60 tablet:pt-40 lg:pt-32 px-2 sm:px-12 gap-12 xl:gap-7 flex-wrap xl:flex-nowrap ${
        context?.header ? "pt-96" : "pt-0"
      }`}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative flex flex-col gap-2 items-center justify-center w-full sm:w-[40rem] h-full">
          <div
            className={`relative p-3 bg-black flex justify-center w-full h-[25rem] pre:h-[30rem] items-center`}
          >
            <div className="flex items-center justify-center w-full h-full bg-amo/30 p-1">
              <div
                title={itemData?.post?.isAgent ? dict?.maq : dict?.hum}
                className="w-5 h-5 z-1 absolute right-5 top-5 rounded-full flex border border-white bg-offBlack"
                onMouseOver={() =>
                  itemData?.post?.metadata?.prompt && setHoverPrompt(true)
                }
              >
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmNQ5fe9Ruyy8LDMgJbxCnM8upSus1eNriqnKda31Wcsut`}
                  onError={(e) => handleImageError(e)}
                  layout="fill"
                  draggable={false}
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              {hoverPrompt && (
                <div
                  onMouseOut={() => setHoverPrompt(false)}
                  className="absolute top-5 right-5 w-60 h-60 rounded-sm border border-white bg-offBlack/90 overflow-y-scroll text-white font-bit text-xs p-2 items-start justify-start z-10"
                >
                  {itemData?.post?.metadata?.prompt}
                </div>
              )}
              <div
                className={`relative w-full h-full flex items-center justify-center cursor-pointer`}
                onClick={() =>
                  context?.setImageViewer({
                    image: `${INFURA_GATEWAY}/ipfs/${
                      itemData?.post?.metadata?.image?.split("ipfs://")?.[1]
                    }`,
                    type: "png",
                  })
                }
              >
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/${
                    itemData?.post?.metadata?.image?.split("ipfs://")?.[1]
                  }`}
                  layout="fill"
                  objectFit={"contain"}
                  objectPosition={"center"}
                  className={
                    "flex items-center justify-center w-full h-full relative"
                  }
                  draggable={false}
                  onError={(e) => handleImageError(e)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full h-fit flex items-center sm:items-end justify-start ml-auto flex-col gap-12">
        <div className="relative w-full h-full flex items-center sm:items-end justify-start ml-auto flex-col gap-4">
          <div className="relative w-fit h-fit flex items-center sm:items-end justify-center sm:justify-end sm:text-right text-center font-aust text-white break-all text-5xl mt-0">
            {itemData?.post?.metadata?.title}
          </div>

          {itemData?.post?.printType && (
            <div className="relative w-fit h-fit flex items-end justify-end font-aust text-white break-all text-sm mt-0">
              <PrintType dict={dict} printType={itemData?.post?.printType!} />
            </div>
          )}
          <div className="relative w-fit h-fit gap-4 flex-row flex flex-wrap items-end justify-end">
            <div
              className="relative w-fit h-fit flex flex-row gap-2 items-end justify-end font-aust text-white break-words text-sm cursor-pointer"
              onClick={() => {
                context?.setFiltersOpen({ value: false, allow: false });
                router.push(
                  `/autograph/${itemData?.post?.profile?.username?.localName}`
                );
              }}
            >
              <div
                className="relative flex flex-row gap-4 w-5 h-5 items-center justify-start rounded-full border border-offWhite"
                id="pfp"
              >
                <Image
                  layout="fill"
                  draggable={false}
                  src={handleProfilePicture(
                    itemData?.post?.profile?.metadata?.picture
                  )}
                  key={itemData?.post?.profile?.metadata?.picture}
                  onError={(e) => handleImageError(e)}
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <div className="relative w-fit h-fit items-center justify-center flex">
                {itemData?.post?.profile?.username?.localName}
              </div>
            </div>
          </div>
          <div className="relative flex items-center sm:items-end w-fit h-fit justify-end text-sol font-bit justify-center flex-col gap-1.5 sm:ml-auto">
            <div className="relative w-full h-fit items-center sm:items-end justify-end text-base ml-auto">
              {Number(itemData?.post?.amount) -
                Number(itemData?.post?.tokenIdsMinted?.length || 0) >
                0 || !itemData?.post?.tokenIdsMinted?.length
                ? `${
                    Number(itemData?.post?.tokenIdsMinted?.length) > 0
                      ? Number(itemData?.post?.tokenIdsMinted?.length || 0)
                      : 0
                  }/${Number(itemData?.post?.amount)}`
                : dict?.sold}
            </div>
          </div>
          <div className="relative w-fit h-fit flex items-start justify-center sm:justify-end font-aust text-white break-words text-xs text-center sm:text-right mt-0 max-h-[6rem] overflow-y-scroll">
            <div className="relative w-5/6 h-fit flex items-start justiy-center sm:justify-end break-all">
              {itemData?.post?.metadata?.description}
            </div>
          </div>
        </div>
        <div className="relative w-full h-full flex items-center sm:items-end justify-start flex-col gap-3 mt-auto">
          <div className="flex flex-col gap-2 items-center sm:items-end justify-start relative">
            <div className="relative text-2xl font-bit w-fit h-fit text-sol font-bit items-center justify-center">
              {`${Number(
                (
                  (Number(
                    itemData?.post?.prices?.find(
                      (tok) =>
                        tok?.token?.toLowerCase() ==
                        purchaseDetails?.currency?.toLowerCase()
                    )?.price
                  ) *
                    10 ** 18) /
                  Number(
                    context?.oracleData?.find(
                      (oracle) =>
                        oracle.currency?.toLowerCase() ===
                        itemData?.post?.prices?.find(
                          (tok) =>
                            tok?.token?.toLowerCase() ==
                            purchaseDetails?.currency?.toLowerCase()
                        )?.token
                    )?.rate
                  )
                )?.toFixed(3)
              )} ${
                ACCEPTED_TOKENS?.filter((item) =>
                  itemData?.post?.prices
                    ?.map((tok) => tok?.token?.toLowerCase())
                    ?.includes(item[2]?.toLowerCase())
                )?.find(
                  (item) =>
                    item?.[2]?.toLowerCase() ===
                    purchaseDetails?.currency?.toLowerCase()
                )?.[1]
              }`}
            </div>
            <div className="relative flex flex-row gap-3 items-center justify-center">
              {itemData?.post?.prices
                ?.filter((item) =>
                  context?.oracleData
                    ?.map((it) => it?.currency?.toLowerCase())
                    ?.includes(item?.token?.toLowerCase())
                )
                ?.map((item, indexTwo: number) => {
                  return (
                    <div
                      className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95 ${
                        purchaseDetails?.currency?.toLowerCase() ===
                        item?.token?.toLowerCase()
                          ? "opacity-50"
                          : "opacity-100"
                      }`}
                      key={indexTwo}
                      onClick={() =>
                        setPurchaseDetails((prev) => ({
                          ...prev,
                          currency: item?.token,
                        }))
                      }
                    >
                      <Image
                        src={`${INFURA_GATEWAY}/ipfs/${
                          ACCEPTED_TOKENS?.find(
                            (value) =>
                              value[2]?.toLowerCase() ==
                              item?.token?.toLowerCase()
                          )?.[0]
                        }`}
                        onError={(e) => handleImageError(e)}
                        className="flex rounded-full"
                        draggable={false}
                        width={30}
                        height={30}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
          {itemData?.post?.collectionType == CollectionType.IRL && (
            <div className="relative w-fit h-fit flex flex-col gap-6 items-center sm:items-end justify-center sm:justify-end">
              <div className="relative w-fit h-fit flex flex-row gap-6 items-center justify-center sm:items-end sm:justify-end text-white font-bit text-xxs pt-4">
                <div className="relative flex items-end w-fit h-fit justify-end items-center justify-center flex-col gap-1.5 ml-auto">
                  <div className="relative w-full h-fit items-end justify-end text-base ml-auto">
                    Color
                  </div>
                  <div className="relative flex flex-row gap-2 items-center justify-center w-fit h-fit flex-wrap">
                    {itemData?.post?.metadata?.colors?.map(
                      (item: string, index: number) => {
                        return (
                          <div
                            key={index}
                            className={`relative w-6 h-6 flex items-center justify-center rounded-full cursor-pointer active:scale-95 border ${
                              item === purchaseDetails?.color
                                ? "border-sol opacity-70"
                                : "border-white opacity-100"
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
                      }
                    )}
                  </div>
                </div>
                <div className="relative flex items-end justify-end items-center justify-center h-fit w-fit flex-col gap-1.5 ml-auto">
                  <div className="relative w-full h-fit items-end justify-end text-base ml-auto">
                    {dict?.siz}
                  </div>
                  <div className="relative flex flex-row gap-2 items-center justify-center w-fit h-fit flex-wrap">
                    {itemData?.post?.metadata?.sizes?.map(
                      (item: string, index: number) => {
                        return (
                          <div
                            key={index}
                            className={`${
                              printTypeToString[
                                Number(
                                  itemData?.post?.printType
                                ) as unknown as PrintTypeTag
                              ] == "poster" ||
                              printTypeToString[
                                Number(
                                  itemData?.post?.printType
                                ) as unknown as PrintTypeTag
                              ] == "sticker"
                                ? "w-fit px-1.5 py-1 rounded-sm"
                                : "w-6 rounded-full"
                            }relative flex h-6 items-center justify-center cursor-pointer text-white font-bit text-xxs active:scale-95 border ${
                              item === purchaseDetails?.size
                                ? "border-sol opacity-70"
                                : "border-white opacity-100"
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
                      }
                    )}
                  </div>
                </div>
              </div>
              <Fulfillment
                loading={instantLoading}
                dict={dict}
                purchaseDetails={purchaseDetails}
                setPurchaseDetails={setPurchaseDetails}
              />
            </div>
          )}
        </div>
        <div className="relative w-fit h-fit flex items-center justify-center gap-6 justify-end items-end">
          <div
            className={`relative w-32 text-sm h-8 rounded-sm flex items-center justify-center border border-white text-black font-bit text-xs bg-sol px-2 py-1 ${
              !context?.lensConectado?.profile ||
              Number(itemData?.post?.amount) ==
                itemData?.post?.tokenIdsMinted?.length
                ? "opacity-70"
                : !instantLoading && "cursor-pointer active:scale-95"
            }`}
            onClick={() =>
              context?.lensConectado?.profile &&
              !instantLoading &&
              Number(itemData?.post?.amount) !=
                itemData?.post?.tokenIdsMinted?.length &&
              (isApprovedSpend ? handleInstantPurchase() : approveSpend())
            }
            title={dict?.checkI}
          >
            <div
              className={`relative w-fit h-fit flex items-center justify-center ${
                instantLoading && "animate-spin"
              }`}
            >
              {instantLoading ? (
                <AiOutlineLoading size={15} color="white" />
              ) : itemData?.post?.amount !== undefined &&
                itemData?.post?.tokenIdsMinted?.length !== undefined &&
                Number(itemData?.post?.amount) ==
                  itemData?.post?.tokenIdsMinted?.length ? (
                dict?.sold
              ) : !context?.lensConectado?.profile ? (
                dict?.con2
              ) : !isApprovedSpend ? (
                dict?.ap
              ) : (
                dict?.col2
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripleA;
