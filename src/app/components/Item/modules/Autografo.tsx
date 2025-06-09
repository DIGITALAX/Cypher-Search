import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { AutographType } from "../../Common/types/common.types";
import {
  ACCEPTED_TOKENS,
  INFURA_GATEWAY,
  printTypeToString,
} from "@/app/lib/constants";
import MediaSwitch from "../../Common/modules/MediaSwitch";
import PrintType from "../../Tiles/modules/PrintType";
import { useRouter } from "next/navigation";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { AutografoProps } from "../types/items.type";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { useAccount } from "wagmi";
import useCatalog from "../hooks/useCatalog";
import Fulfillment from "./Fulfillment";

const Autografo: FunctionComponent<AutografoProps> = ({
  itemData,
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const router = useRouter();
  const { address } = useAccount();
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const {
    purchaseDetails,
    setPurchaseDetails,
    handleInstantPurchase,
    instantLoading,
    approveSpend,
    isApprovedSpend,
  } = useCatalog(itemData, dict);
  return (
    <div
      className={`relative w-full h-fit xl:h-[50rem] flex items-center justify-center flex-row pre:pt-60 tablet:pt-40 lg:pt-32 px-2 sm:px-12 gap-12 xl:gap-7 flex-wrap xl:flex-nowrap ${
        context?.header ? "pt-96" : "pt-0"
      }  ${
        itemData?.post?.tipo !== AutographType.NFT
          ? "items-start overflow-y-scroll"
          : "items-center"
      }`}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative flex flex-col gap-2 items-center justify-center w-full sm:w-[40rem] h-full">
          <div
            className={`relative p-3 bg-black flex justify-center w-full h-[25rem] pre:h-[30rem] items-center`}
          >
            <div className="flex items-center justify-center w-full h-full bg-amo/30 p-1">
              <div
                className={`relative w-full h-full flex items-center justify-centercursor-pointer`}
                onClick={() =>
                  context?.setImageViewer({
                    image: `${INFURA_GATEWAY}/ipfs/${
                      itemData?.post?.imagenes?.[0]?.split("ipfs://")?.[1]
                    }`,
                    type: "png",
                  })
                }
              >
                <MediaSwitch
                  type={"image"}
                  srcUrl={`${INFURA_GATEWAY}/ipfs/${
                    itemData?.post?.imagenes?.[0]?.split("ipfs://")?.[1]
                  }`}
                  classNameImage="flex items-center justify-center w-full h-full relative"
                  objectFit="contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full h-fit flex items-center sm:items-end justify-start ml-auto flex-col gap-12">
        <div className="relative w-full h-full flex items-center sm:items-end justify-start ml-auto flex-col gap-4">
          <div className="relative w-fit h-fit flex items-end justify-end font-aust text-white break-all text-5xl mt-0">
            {itemData?.post?.titulo}
          </div>

          {itemData?.post?.tipo !== AutographType.NFT && (
            <div className="relative w-fit h-fit flex items-end justify-end font-aust text-white break-all text-sm mt-0">
              <PrintType
                dict={dict}
                printType={
                  printTypeToString[
                    itemData?.post?.tipo == AutographType.Hoodie ? 3 : 2
                  ]
                }
              />
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
              {Number(itemData?.post?.cantidad) -
                Number(itemData?.post?.tokenesMinteados?.length || 0) >
                0 || !itemData?.post?.tokenesMinteados?.length
                ? `${
                    itemData?.post?.tokenesMinteados?.length
                      ? Number(itemData?.post?.tokenesMinteados?.length || 0)
                      : 0
                  }/${Number(itemData?.post?.cantidad)}`
                : dict?.sold}
            </div>
          </div>
          <div className="relative w-fit h-fit flex items-start justify-center sm:justify-end font-aust text-white break-words text-xs text-center sm:text-right mt-0 max-h-[6rem] overflow-y-scroll">
            <div className="relative w-5/6 h-fit flex items-start justiy-center sm:justify-end break-all">
              {itemData?.post?.descripcion}
            </div>
          </div>
          <div className="relative w-full h-fit flex font-bit text-xxs text-white justify-center items-center sm:justify-end">
            <div className="relative w-1/2 max-h-[6rem] overflow-y-scroll h-fit flex flex-wrap items-center sm:items-end justify-center sm:justify-end sm:ml-auto gap-3">
              {itemData?.post?.etiquetas
                ?.split(",")
                ?.map((tag: string, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative w-fit h-fit px-2 py-1 rounded-full flex items-center justify-center text-center cursor-pointer hover:opacity-80"
                      style={{
                        backgroundColor:
                          index % 3 === 0
                            ? "#078fd6"
                            : index % 4 === 0
                            ? "#e981ff"
                            : "#81A8F8",
                      }}
                      onClick={() =>
                        context?.setSearchItems((prev) => ({
                          ...prev,
                          input: prev?.input + " " + tag,
                        }))
                      }
                    >
                      <div className="relative w-fit h-fit flex top-px">
                        {tag}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="relative w-full h-full flex items-center sm:items-end justify-start flex-col gap-3 mt-auto">
          <div className="flex flex-col gap-2 items-center sm:items-end justify-start relative">
            <div className="relative text-2xl font-bit w-fit h-fit text-sol font-bit items-center justify-center">
              {`${Number(
                (
                  Number(itemData?.post?.precio) /
                  Number(
                    context?.oracleData?.find(
                      (oracle) =>
                        oracle.currency?.toLowerCase() ===
                        itemData?.post?.tokenes?.find(
                          (item) =>
                            item?.toLowerCase() ===
                            purchaseDetails?.currency?.toLowerCase()
                        )
                    )?.rate
                  )
                )?.toFixed(3)
              )} ${
                ACCEPTED_TOKENS?.filter((item) =>
                  itemData?.post?.tokenes?.includes(
                    item?.[2]?.toLowerCase() as any
                  )
                )?.find(
                  (item) =>
                    item?.[2]?.toLowerCase() ===
                    purchaseDetails?.currency?.toLowerCase()
                )?.[1]
              }`}
            </div>
            <div className="relative flex flex-row gap-3 items-center justify-center">
              {itemData?.post?.tokenes?.map(
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
                          ACCEPTED_TOKENS?.find(
                            (value) =>
                              value[2]?.toLowerCase() == item?.toLowerCase()
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
                }
              )}
            </div>
          </div>
          {itemData?.post?.tipo !== AutographType.NFT && (
            <>
              <div className="relative w-fit h-fit flex flex-row gap-6 items-end justify-end text-white font-bit text-xxs pt-4">
                <div className="relative flex items-end w-fit h-fit justify-end items-center justify-center flex-col gap-1.5 ml-auto">
                  <div className="relative w-full h-fit items-end justify-end text-base ml-auto">
                    Color
                  </div>
                  <div className="relative flex flex-row gap-2 items-center justify-center w-fit h-fit flex-wrap">
                    {["black", "white"]?.map((item: string, index: number) => {
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
                    })}
                  </div>
                </div>
                <div className="relative flex items-end justify-end items-center justify-center h-fit w-fit flex-col gap-1.5 ml-auto">
                  <div className="relative w-full h-fit items-end justify-end text-base ml-auto">
                    {dict?.siz}
                  </div>
                  <div className="relative flex flex-row gap-2 items-center justify-center w-fit h-fit flex-wrap">
                    {["xs", "s", "m", "l", "xl", "2xl"]?.map(
                      (item: string, index: number) => {
                        return (
                          <div
                            key={index}
                            className={`w-6 rounded-full relative flex h-6 items-center justify-center cursor-pointer text-white font-bit text-xxs active:scale-95 border ${
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
            </>
          )}
        </div>
        <div className="relative w-fit h-fit flex items-center justify-center flex-row gap-6 justify-end items-end">
          <div
            className={`relative w-32 text-sm h-8 rounded-sm flex items-center justify-center border border-white text-black font-bit text-xs bg-sol px-2 py-1 ${
              address ||
              itemData?.post?.cantidad ==
                itemData?.post?.tokenesMinteados?.length
                ? "opacity-70"
                : !instantLoading && "cursor-pointer active:scale-95"
            }`}
            onClick={() =>
              address &&
              !instantLoading &&
              itemData?.post?.cantidad !=
                itemData?.post?.tokenesMinteados?.length &&
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
              ) : itemData?.post?.cantidad !== undefined &&
                itemData?.post?.tokenesMinteados?.length !== undefined &&
                itemData?.post?.cantidad ==
                  itemData?.post?.tokenesMinteados?.length ? (
                dict?.sold
              ) : !address ? (
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

export default Autografo;
