import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { QuestProps } from "../../types/tiles.types";

const Quest: FunctionComponent<QuestProps> = ({
  layoutAmount,
  router,
  publication,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex items-center justify-center flex flex-row rounded-sm border border-sol p-4 gap-4">
      <div className="relative p-2 rounded-sm border border-pez w-full h-20 items-center justify-center flex">
        <div className="relative w-fit h-fit text-center font-bit text-nuba text-base items-center justify-center flex break-words"></div>
      </div>
      <div className="relative flex flex-col w-fit h-fit items-center justify-center gap-4">
        <div className="relative flex flex-row gap-4 w-fit h-fit items-center justify-center">
          <div className="relative w-fit h-fit flex flex-row gap-1 items-center justify-center">
            {["#11F313", "#62EEFF", "#F3FA5F", "#D62ADA"].map(
              (color: string, index: number) => {
                return (
                  <div
                    key={index}
                    className="w-1.5 h-7 rounded-md flex relative"
                    style={{
                      backgroundColor: color,
                    }}
                  ></div>
                );
              }
            )}
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center text-center font-bit text-nuba text-xl">
            13
          </div>
        </div>
        <div className="relative flex flex-row gap-2 w-fit h-fit items-center justify-center">
          <div
            className="relative w-8 h-8 flex items-center justify-center cursor-pointer active:scale-95"
            onClick={() => router.push(`/item/quest/${publication?.id}`)}
          >
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmZ4v5pzdnCBeyKnS9VrjZiEAbUpAVy8ECArNcpxBt6Tw4`}
              draggable={false}
            />
          </div>
          <div className="relative w-10 h-10 flex items-center justify-center">
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmeaFyTTeh22BW3pRdX9B4nEi9WAyQsy1ULTG8R6HDn9cA`}
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quest;
