import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import {
  ACCEPTED_TOKENS_MUMBAI,
  INFURA_GATEWAY,
} from "../../../../lib/constants";
import { PurchaseTokensProps } from "../types/common.types";
import handleImageError from "../../../../lib/helpers/handleImageError";

const PurchaseTokens: FunctionComponent<PurchaseTokensProps> = ({
  currency,
  handleChangeCurrency,
  itemIndex,
  levelIndex,
  priceIndex,
}): JSX.Element => {
  return (
    <div className="relative w-3/4 justify-center items-center flex flex-row gap-1">
      {ACCEPTED_TOKENS_MUMBAI?.map((item: string[], indexTwo: number) => {
        return (
          <div
            className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95 ${
              currency === item[1] ? "opacity-50" : "opacity-100"
            }`}
            key={indexTwo}
            onClick={() =>
              handleChangeCurrency(levelIndex, itemIndex, priceIndex, item[1])
            }
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
  );
};

export default PurchaseTokens;
