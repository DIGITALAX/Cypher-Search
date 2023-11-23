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
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-row items-center justify-between gap-3">
      <div
        className="relative flex w-20 h-20 rounded-sm border border-white cursor-pointer"
        onClick={() =>
          router.push(
            `/${numberToItemTypeMap[Number(item?.collection?.origin)]}/${
              item?.collection?.pubId
            }`
          )
        }
      >
        <Image
          layout="fill"
          src={`${INFURA_GATEWAY}/${
            item?.collection?.image?.split("ipfs://")?.[0]
          }`}
          onError={(e) => handleImageError(e)}
          className="rounded-md"
          objectFit="cover"
        />
      </div>
      <div className="relative flex w-fit h-fit items-center justify-center text-sm font-bit text-white cursor-pointer">
        {item?.price}
      </div>
      <div className="relative flex w-fit h-fit items-center justify-center text-sm font-bit text-white cursor-pointer">
        {item?.isFulfilled ? "Fulfilled" : "Fulfilling"}
      </div>
      <div className="relative flex w-fit h-fit items-center justify-center text-sm font-bit text-white cursor-pointer">
        {item?.amount}
      </div>
      <div className="relative flex w-7 h-7 border border-white p-px rounded-full items-center justify-center text-sm font-bit text-white cursor-pointer">
        {item?.size && decrypted ? item?.size : "??"}
      </div>
      <div
        className={`relative flex w-7 h-7 border border-white p-px rounded-full items-center justify-center text-sm font-bit text-white cursor-pointer`}
        style={{
          backgroundColor:
            item?.color && decrypted ? `${item?.color}` : "#131313",
        }}
      >
        {(!item?.color || !decrypted) && "?"}
      </div>
    </div>
  );
};

export default SubOrder;
