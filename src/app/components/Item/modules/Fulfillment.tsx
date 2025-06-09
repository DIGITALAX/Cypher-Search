import { FunctionComponent, JSX, useState } from "react";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { FulfillmentProps } from "../types/items.type";
import Image from "next/legacy/image";
import { COUNTRIES, INFURA_GATEWAY } from "@/app/lib/constants";

const Fulfillment: FunctionComponent<FulfillmentProps> = ({
  purchaseDetails,
  setPurchaseDetails,
  dict,
  loading,
}): JSX.Element => {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [openFulfillment, setOpenFulfillment] = useState<boolean>(false);

  return (
    <div className="relative w-fit h-fit flex flex-col gap-2 items-end justify-end">
      <div
        className="relative w-fit h-fit flex items-end justify-end cursor-pointer active:scale-95"
        onClick={() => setOpenFulfillment(!openFulfillment)}
      >
        {openFulfillment ? (
          <SlArrowUp color="white" size={15} />
        ) : (
          <SlArrowDown color="white" size={15} />
        )}
      </div>

      {openFulfillment && (
        <div className="relative flex flex-row flex-wrap items-end justify-end gap-5 w-full h-fit">
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
                    loading && "opacity-20"
                  }`}
                >
                  <div className="relative w-fit h-fit flex text-white font-aust text-base">
                    {item?.title}
                  </div>
                  {item?.drop ? (
                    <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1">
                      <div
                        className={`relative h-10 flex flex-row justify-between p-2 w-40 items-center justify-center border gap-3 border-white rounded-md ${
                          loading ? "opacity-70" : "cursor-pointer"
                        }`}
                        onClick={() =>
                          !loading && setOpenDropdown(!openDropdown)
                        }
                      >
                        <div className="relative w-full h-fit flex items-center justify-start font-aust text-white text-sm">
                          {purchaseDetails?.country}
                        </div>
                        <div className="relative w-4 h-3 flex items-center justify-end">
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
                                      setPurchaseDetails((prev) => ({
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
                        (purchaseDetails as any)?.[
                          item?.title?.toLowerCase()
                        ] || ""
                      }
                      onChange={(e) =>
                        !loading &&
                        setPurchaseDetails((prev) => ({
                          ...prev,
                          [item?.title?.toLowerCase()]: e.target.value,
                        }))
                      }
                    />
                  )}
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
};

export default Fulfillment;
