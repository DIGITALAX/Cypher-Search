import Bar from "@/components/Common/modules/Bar";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import PurchaseTokens from "@/components/Common/modules/PurchaseTokens";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { LevelOneProps } from "../types/tiles.types";

const LevelOne: FunctionComponent<LevelOneProps> = ({
  handleChangeCurrency,
  index,
}): JSX.Element => {
  return (
    <div className="relative w-72 h-full flex flex-col">
      <Bar title={`Collect Lvl.1`} />
      <div className="relative w-full h-110 flex flex-col bg-offWhite justify-between items-center p-2 border-b border-x rounded-b-sm border-black gap-4">
        <div className="relative w-52 h-52 rounded-sm border border-black flex items-center justify-center">
          <Image
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/QmcmJDNg69MwQMXRkYjz2zJcV8wfwnuSLRXgNAChR3mh7C`}
            draggable={false}
            className="rounded-sm"
          />
        </div>
        <div className="relative flex items-center text-center justify-center w-fit text-sm font-net break-words">
          {`Quick Collect (No Prints)`}
        </div>
        <PurchaseTokens
          handleChangeCurrency={handleChangeCurrency}
          currency={index?.currency}
          itemIndex={0}
          levelIndex={0} 
          priceIndex={0}
        />
        <div className="relative flex justify-center items-center font-dog text-black text-xxs">
          {`${Number(
            (index?.price[index?.priceIndex] / index?.rate)?.toFixed(3)
          )} ${index?.currency}`}
        </div>
      </div>
    </div>
  );
};

export default LevelOne;
