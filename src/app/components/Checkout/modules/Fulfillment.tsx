import { FunctionComponent, JSX, useContext } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/legacy/image";
import {
  ACCEPTED_TOKENS,
  COUNTRIES,
  INFURA_GATEWAY,
} from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { ModalContext } from "@/app/providers";
import { FulfillmentProps } from "../types/checkout.types";

const Fulfillment: FunctionComponent<FulfillmentProps> = ({
  dict,
  openDropdown,
  setOpenDropdown,
  encrypted,
  encryptFulfillment,
  encryptionLoading,
  details,
  setDetails,
  chooseCartItem,
  approveLoading,
  collectPostLoading,
  approveSpend,
  isApprovedSpend,
  collectItems,
}): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="relative w-fit h-fit relative flex items-start justify-start p-2 flex-col gap-6">
      <div className="relative w-fit h-fit flex items-center justify-center font-aust text-3xl text-white">
        {dict?.check}
      </div>
      <div className="relative w-fit md:w-96 h-fit flex items-center justify-center break-words font-bit text-white text-xs">
        {dict?.clam}
      </div>
      {Number(
        context?.cartItems?.filter((item) => item?.item?.origin !== "0")?.length
      ) > 0 && (
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
          <div className="relative w-fit h-fit flex text-white font-aust text-2xl">
            {dict?.ful}
          </div>
          <div className="relative w-fit h-fit flex text-sol font-aust text-xs opacity-90">
            {dict?.ext}
          </div>
          <div className="relative flex flex-row flex-wrap items-start justify-start gap-5 w-full h-fit">
            {[
              {
                title: dict?.nam,
                drop: false,
              },
              {
                title: dict?.addr,
                drop: false,
              },
              {
                title: dict?.zip,
                drop: false,
              },
              {
                title: dict?.city,
                drop: false,
              },
              {
                title: dict?.state,
                drop: false,
              },
              {
                title: dict?.country,
                drop: true,
              },
            ].map(
              (
                item: {
                  title: string;
                  drop: boolean;
                },
                index: number
              ) => {
                return (
                  <div
                    key={index}
                    className={`relative w-fit h-fit flex items-start justify-center flex-col gap-2 ${
                      encrypted?.length == context?.cartItems?.length &&
                      "opacity-20"
                    }`}
                  >
                    <div className="relative w-fit h-fit flex text-white font-aust text-base">
                      {item?.title}
                    </div>
                    {item?.drop ? (
                      <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1">
                        <div
                          className={`relative h-10 flex flex-row justify-between p-2 w-40 items-center justify-center border border-white rounded-md ${
                            encrypted?.length == context?.cartItems?.length
                              ? "opacity-70"
                              : "cursor-pointer"
                          }`}
                          onClick={() => setOpenDropdown(!openDropdown)}
                        >
                          <div className="relative w-full h-fit flex items-center justify-center font-aust text-white text-sm">
                            {details?.country}
                          </div>
                          <div className="relative w-4 h-3 flex items-center justify-center">
                            <Image
                              layout="fill"
                              draggable={false}
                              src={`${INFURA_GATEWAY}/ipfs/QmRKmMYJj7KAwf4BDGwrd51tKWoS8djnLGWT5XNdrJMztk`}
                            />
                          </div>
                        </div>
                        {openDropdown && (
                          <div className="absolute top-10 bg-offBlack z-10 w-40 h-60 flex border border-white rounded-md overflow-y-scroll">
                            <div className="relative w-full h-fit flex flex-col items-center justify-start">
                              {COUNTRIES?.map(
                                (country: string, index: number) => {
                                  return (
                                    <div
                                      key={index}
                                      className="relative w-full py-1 h-10 flex items-center justify-center text-white border-y border-white font-aust text-sm cursor-pointer hover:opacity-80"
                                      onClick={() => {
                                        // if (details?.country !== country) {
                                        //   setEncryptedStrings([]);
                                        // }
                                        setOpenDropdown(false);
                                        setDetails((prev) => ({
                                          ...prev,
                                          country,
                                        }));
                                      }}
                                    >
                                      {country}
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <input
                        className={`relative border border-white rounded-md flex bg-offBlack font-aust text-white text-sm p-2 h-10 w-40 `}
                        placeholder={
                          (details as any)?.[item?.title?.toLowerCase()] || ""
                        }
                        onChange={(e) => {
                          // if (
                          //   (details as any)?.[item?.title?.toLowerCase()] !==
                          //   e.target.value
                          // ) {
                          //   setEncryptedStrings([]);
                          // }
                          setDetails((prev) => ({
                            ...prev,
                            [item?.title?.toLowerCase()]: e.target.value,
                          }));
                        }}
                      />
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
      <div className="relative w-full h-fit flex items-start justify-start flex-col gap-6">
        <div className="relative w-full h-full flex flex-col items-start justify-start gap-3 text-white font-aust">
          <div className="relative w-fit h-fit flex text-lg">Cart Total</div>
          <div
            className={`relative w-fit h-fit rounded-full flex items-center text-xs`}
          >
            $
            {Number(
              context?.cartItems
                ?.flatMap((c) => ({ price: c?.price, amount: c?.buyAmount }))
                ?.reduce(
                  (sum, item) =>
                    sum + Number(item?.price) * Number(item?.amount),
                  0
                )
            )}
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
          <div className="relative w-fit h-fit flex text-white font-aust text-xl">
            {dict?.tokC}
          </div>
          <div className="relative flex flex-row flex-wrap items-start justify-start gap-5 w-full h-fit">
            {ACCEPTED_TOKENS?.filter((value) =>
              context?.cartItems
                ?.flatMap((cart) => cart?.currency?.toLowerCase())
                ?.includes(value?.[2]?.toLowerCase())
            )?.map((item: string[], indexTwo: number) => {
              const loader = approveLoading?.find(
                (val) => val?.currency?.toLowerCase() == item[2]?.toLowerCase()
              );
              const app = isApprovedSpend?.find(
                (val) => val?.currency?.toLowerCase() == item[2]?.toLowerCase()
              );
              return (
                <div
                  className={`relative w-fit h-fit justify-center rounded-full flex items-center ${
                    app?.approved
                      ? "opacity-50"
                      : "opacity-100 cursor-pointer active:scale-95"
                  } ${loader?.loading && "animate-spin"}`}
                  key={indexTwo}
                  onClick={() =>
                    !app?.approved &&
                    !loader?.loading &&
                    approveSpend(item[2] as `0x${string}`)
                  }
                >
                  <div className="relative w-10 h-10 flex">
                    {loader?.loading ? (
                      <AiOutlineLoading color="white" />
                    ) : (
                      <Image
                        src={`${INFURA_GATEWAY}/ipfs/${item[0]}`}
                        className="flex rounded-full"
                        draggable={false}
                        onError={(e) => handleImageError(e)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {Number(
        context?.cartItems?.filter(
          (item) =>
            Number(item?.item?.tokenIdsMinted?.length) ==
            Number(item?.item?.amount)
        )?.length
      ) > 0 && (
        <div className="relative w-3/4 h-fit flex items-center justify-center break-words text-white text-xs font-bit">
          {dict?.miss}
        </div>
      )}
      <div
        className={`relative w-48 px-2 h-12 text-center py-1 border border-white rounded-md flex items-center justify-center text-white font-aust text-sm ${
          !encryptionLoading &&
          !approveLoading?.every((v) => v?.loading == false) &&
          !collectPostLoading &&
          Number(context?.cartItems?.[chooseCartItem]?.item?.amount) !=
            Number(
              context?.cartItems?.[chooseCartItem]?.item?.tokenIdsMinted
                ?.length || 0
            ) &&
          "cursor-pointer active:scale-95"
        }`}
        onClick={() =>
          !encryptionLoading &&
          !approveLoading?.every((v) => v?.loading == false) &&
          !collectPostLoading &&
          context?.cartItems?.some(
            (item) =>
              Number(item?.item?.amount) ==
              Number(item?.item?.tokenIdsMinted?.length)
          ) &&
          (encrypted?.length !== context?.cartItems?.length &&
          Number(
            context?.cartItems?.filter((item) => item?.item?.origin !== "0")
              ?.length
          ) > 0
            ? encryptFulfillment()
            : !isApprovedSpend
            ? () => {}
            : collectItems())
        }
      >
        <div
          className={`${
            (encryptionLoading ||
              !approveLoading?.every((v) => v?.loading == false) ||
              collectPostLoading) &&
            "animate-spin"
          } flex items-center justify-center`}
        >
          {encryptionLoading ||
          !approveLoading?.every((v) => v?.loading == false) ||
          collectPostLoading ? (
            <AiOutlineLoading size={15} color="white" />
          ) : context?.cartItems?.some(
              (item) =>
                Number(item?.item?.amount) ==
                Number(item?.item?.tokenIdsMinted?.length)
            ) ? (
            dict?.sold
          ) : Number(
              context?.cartItems?.filter((item) => item?.item?.origin !== "0")
                ?.length
            ) > 0 && encrypted?.length !== context?.cartItems?.length ? (
            dict?.enc
          ) : !isApprovedSpend ? (
            dict?.apS
          ) : (
            dict?.colI
          )}
        </div>
      </div>
    </div>
  );
};

export default Fulfillment;
