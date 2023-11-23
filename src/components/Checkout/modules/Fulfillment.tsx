import { FunctionComponent } from "react";
import { FulfillmentProps } from "../types/checkout.types";
import { AiOutlineLoading } from "react-icons/ai";
import {
  ACCEPTED_TOKENS_MUMBAI,
  COUNTRIES,
  INFURA_GATEWAY,
} from "../../../../lib/constants";
import Image from "next/legacy/image";
import handleImageError from "../../../../lib/helpers/handleImageError";

const Fulfillment: FunctionComponent<FulfillmentProps> = ({
  details,
  encryptionLoading,
  encryptFulfillment,
  setDetails,
  openDropdown,
  setOpenDropdown,
  encryptedStrings,
  total,
  checkoutCurrency,
  rate,
  setCheckoutCurrency,
  cartItems,
  isApprovedSpend,
  approveSpend,
  collectItem,
  chooseCartItem,
}): JSX.Element => {
  return (
    <div className="relative w-fit h-fit relative flex items-start justify-start p-2 flex-col gap-6">
      <div className="relative w-fit h-fit flex items-center justify-center font-aust text-3xl text-white">
        Checkout
      </div>
      <div className="relative w-96 h-fit flex items-center justify-center break-words font-bit text-white text-xs">
        Claim your cart. Each Lens collect is unique like you—one by one
        checkouts give them that personal touch. No batch buys at this time.
      </div>
      {cartItems?.find((item) => item?.item?.origin !== "1") && (
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
          <div className="relative w-fit h-fit flex text-white font-aust text-2xl">
            Fulfillment Details
          </div>
          <div className="relative flex flex-row flex-wrap items-start justify-start gap-5 w-full h-fit">
            {[
              {
                title: "Name",
                drop: false,
              },
              {
                title: "Address",
                drop: false,
              },
              {
                title: "Zip",
                drop: false,
              },
              {
                title: "City",
                drop: false,
              },
              {
                title: "State",
                drop: false,
              },
              {
                title: "Country",
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
                      encryptedStrings?.length > 0 && "opacity-20"
                    }`}
                  >
                    <div className="relative w-fit h-fit flex text-white font-aust text-base">
                      {item?.title}
                    </div>
                    {item?.drop ? (
                      <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1">
                        <div
                          className={`relative h-10 flex flex-row justify-between p-2 w-40 items-center justify-center border border-white rounded-md ${
                            encryptedStrings?.length < 1
                              ? "cursor-pointer"
                              : "opacity-70"
                          }`}
                          onClick={() => setOpenDropdown(!openDropdown)}
                        >
                          <div className="relative w-fit h-fit flex items-center justify-center font-aust text-white text-sm">
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
            {`${Number((total / rate)?.toFixed(3))} ${
              ACCEPTED_TOKENS_MUMBAI?.find(
                (item) => item[2] === checkoutCurrency
              )?.[1]
            }`}
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
          <div className="relative w-fit h-fit flex text-white font-aust text-xl">
            Checkout Token
          </div>
          <div className="relative flex flex-row flex-wrap items-start justify-start gap-5 w-full h-fit">
            {ACCEPTED_TOKENS_MUMBAI?.map((item: string[], indexTwo: number) => {
              return (
                <div
                  className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95 ${
                    checkoutCurrency === item[2] ? "opacity-50" : "opacity-100"
                  }`}
                  key={indexTwo}
                  onClick={() => setCheckoutCurrency(item[2])}
                >
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${item[0]}`}
                    className="flex rounded-full"
                    draggable={false}
                    width={30}
                    height={35}
                    onError={(e) => handleImageError(e)}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3 font-aust">
          <div className="relative w-fit h-fit flex text-xl text-white">
            Selected Item
          </div>
          <div className="relative flex flex-row flex-wrap items-start justify-start gap-5 w-full h-fit text-sol">
            {`${Number(
              (
                (cartItems?.find((item) => item?.item?.pubId === chooseCartItem)
                  ?.price || 0) / rate
              )?.toFixed(3)
            )} ${
              ACCEPTED_TOKENS_MUMBAI?.find(
                (item) => item[2] === checkoutCurrency
              )?.[1]
            }`}
          </div>
        </div>
      </div>
      <div
        className={`relative w-48 px-2 h-12 text-center py-1 border border-white rounded-md flex items-center justify-center text-white font-aust text-sm ${
          !encryptionLoading && "cursor-pointer active:scale-95"
        }`}
        onClick={() =>
          !encryptionLoading &&
          (cartItems?.find((item) => item?.item?.origin !== "1") &&
          encryptedStrings?.length < 1
            ? encryptFulfillment()
            : !isApprovedSpend
            ? approveSpend()
            : collectItem())
        }
      >
        <div
          className={`${
            encryptionLoading && "animate-spin"
          } flex items-center justify-center`}
        >
          {encryptionLoading ? (
            <AiOutlineLoading size={15} color="white" />
          ) : cartItems?.find((item) => item?.item?.origin !== "1") &&
            encryptedStrings?.length < 1 ? (
            "Encrypt Fulfillment"
          ) : !isApprovedSpend ? (
            "Approve Spend"
          ) : (
            "Collect Item"
          )}
        </div>
      </div>
    </div>
  );
};

export default Fulfillment;
