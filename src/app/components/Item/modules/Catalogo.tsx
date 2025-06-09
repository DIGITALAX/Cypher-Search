import {
  ACCEPTED_TOKENS,
  INFURA_GATEWAY,
} from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import usePagina from "../hooks/usePagina";
import { CatalogoProps } from "../types/items.type";
import { useAccount } from "wagmi";
import useCatalog from "../hooks/useCatalog";
import Fulfillment from "./Fulfillment";

const Catalogo: FunctionComponent<CatalogoProps> = ({
  itemData,
  dict,
}): JSX.Element => {
  const { bookRef } = usePagina(itemData?.post);
  const { address } = useAccount();
  const context = useContext(ModalContext);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const {
    purchaseDetails,
    setPurchaseDetails,
    instantLoading,
    isApprovedSpend,
    handleInstantPurchase,
    approveSpend,
  } = useCatalog(itemData, dict);

  return (
    <div
      className={`relative w-full h-fit xl:h-[50rem] flex items-center justify-center flex-row pre:pt-60 tablet:pt-40 lg:pt-32 px-2 sm:px-12 gap-12 xl:gap-7 flex-wrap xl:flex-nowrap ${
        context?.header ? "pt-96" : "pt-0"
      }`}
    >
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        id="padre"
      >
        <div
          className="relative flex items-center justify-center overflow-hidden"
          ref={bookRef}
          style={{
            height: window.innerWidth > 1200 ? 750 : window.innerWidth / 3,
          }}
        >
          {itemData?.post?.paginas?.map((pagina: string, indice: number) => (
            <div
              key={indice}
              className="pagina relative flex items-center justify-center"
            >
              <Image
                src={`${INFURA_GATEWAY}/ipfs/${pagina.split("ipfs://")[1]}`}
                layout="fill"
                objectFit="contain"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="relative w-full xl:w-fit h-fit flex items-center xl:items-end justify-start ml-auto flex-col gap-12">
        <div className="relative w-full xl:w-fit h-full flex items-center xl:items-end justify-start flex-col gap-3 mt-auto">
          <div className="flex flex-col gap-2 items-center xl:items-end justify-start relative">
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
                  itemData?.post?.tokenes?.includes(item?.[2]?.toLowerCase())
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
          <Fulfillment
            loading={instantLoading}
            dict={dict}
            purchaseDetails={purchaseDetails}
            setPurchaseDetails={setPurchaseDetails}
          />
        </div>
        <div className="relative w-fit h-fit flex items-center justify-center flex-row gap-6 justify-start xl:justify-end items-start xl:items-end">
          <div
            className={`relative w-32 text-sm h-8 rounded-sm flex items-center justify-center border border-white text-black font-bit text-xs bg-sol px-2 py-1 ${
              !address || itemData?.post?.cantidad == itemData?.post?.minteado
                ? "opacity-70"
                : !instantLoading && "cursor-pointer active:scale-95"
            }`}
            onClick={() =>
              address &&
              !instantLoading &&
              itemData?.post?.cantidad != itemData?.post?.minteado &&
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
                itemData?.post?.minteado !== undefined &&
                itemData?.post?.cantidad == itemData?.post?.minteado ? (
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

export default Catalogo;
