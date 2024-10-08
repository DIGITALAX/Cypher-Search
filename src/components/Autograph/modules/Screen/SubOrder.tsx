import { FunctionComponent } from "react";
import { SubOrderProps } from "../../types/autograph.types";
import Image from "next/legacy/image";
import {
  INFURA_GATEWAY,
  numberToItemTypeMap,
} from "../../../../../lib/constants";
import handleImageError from "../../../../../lib/helpers/handleImageError";

const SubOrder: FunctionComponent<SubOrderProps> = ({
  item,
  router,
  decrypted,
  details,
  t
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex md:flex-nowrap flex-wrap flex-row items-center justify-between gap-3">
      <div className="relative w-fit h-fit flex items-center justify-center">
        <div
          className="relative flex w-20 h-20 rounded-sm border border-white cursor-pointer"
          onClick={() =>
            router.push(
              `/item/${
                numberToItemTypeMap[Number(item?.collection?.origin)]
              }/${item?.collection?.name?.replaceAll(" ", "_")}`
            )
          }
        >
          <Image
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/${
              item?.collection?.image?.split("ipfs://")?.[1]
            }`}
            onError={(e) => handleImageError(e)}
            className="rounded-md"
            objectFit="cover"
            draggable={false}
          />
        </div>
      </div>
      <div className="relative w-full h-fit flex items-center justify-between gap-3 flex-wrap md:flex-nowrap">
        <div className="relative flex w-fit h-fit items-center justify-center text-sm font-bit text-white">
          ${Number(item?.price) / Number(item?.amount)}
        </div>
        <div className="relative flex w-fit h-fit items-center justify-center text-sm font-bit text-white">
          {item?.isFulfilled || !details ? t("fuld") : t("fulg")}
        </div>
        <div className="relative flex w-fit h-fit items-center justify-center text-sm font-bit text-white">
          {t("cant")}
          {item?.amount}
        </div>
        {details && (
          <div
            className={`relative flex h-7 border border-white p-px items-center justify-center font-bit text-white ${
              ["xs", "s", "m", "l", "xl", "2xl"].includes(
                item?.size?.toLowerCase() || ""
              ) || !decrypted
                ? "rounded-full w-7 text-sm"
                : "w-fit px-1 rounded-sm text-xxs"
            }`}
          >
            {item?.size && decrypted ? item?.size : "??"}
          </div>
        )}
        {details && (
          <div
            className={`relative flex w-7 h-7 border border-white p-px rounded-full items-center justify-center text-sm font-bit text-white`}
            style={{
              backgroundColor:
                item?.color && decrypted ? `${item?.color}` : "#131313",
            }}
          >
            {(!item?.color || !decrypted) && "?"}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubOrder;
