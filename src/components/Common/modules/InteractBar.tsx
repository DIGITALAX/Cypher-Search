import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { InteractBarProps } from "../types/common.types";

const InteractBar: FunctionComponent<InteractBarProps> = ({
  col,
  layoutAmount
}): JSX.Element => {
  return (
    <div className={`relative w-full h-fit rounded-sm border border-frio text-base font-vcr text-mar flex gap-2 p-2 items-center justify-center bg-fuego ${
      (col || layoutAmount) ? "flex-col" : "flex-row"
    }`}>
      {[
        "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
        "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ",
        "QmNomDrWUNrcy2SAVzsKoqd5dPMogeohB8PSuHCg57nyzF",
        "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n",
      ].map((image: string, index: number) => {
        return (
          <div
            className="relative w-full h-full flex flex-row items-center justify-center gap-4"
            key={index}
          >
            <div className="relative w-4 h-4 flex cursor-pointer items-center justify-center active:scale-95">
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/${image}`}
                draggable={false}
              />
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center text-center cursor-pointer active:scale-95">
              77
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InteractBar;
