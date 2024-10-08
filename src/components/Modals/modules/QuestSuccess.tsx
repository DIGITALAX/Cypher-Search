import { FunctionComponent } from "react";
import { QuestSuccessProps } from "../types/modals.types";
import { ImCross } from "react-icons/im";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Image from "next/legacy/image";
import { setQuestSuccess } from "../../../../redux/reducers/questSuccessSlice";

const QuestSuccess: FunctionComponent<QuestSuccessProps> = ({
  dispatch,
  t,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] rounded-md sm:w-[70vw] tablet:w-[40vw] h-fit max-h-[90vh] place-self-center bg-offBlack rounded-lg border border-white rounded-sm overflow-y-scroll">
        <div className="relative w-full h-full flex flex-col gap-5 p-2">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="white"
              size={10}
              onClick={() => dispatch(setQuestSuccess(false))}
            />
          </div>
          <div className="relative w-full h-fit items-center justify-center flex flex-col gap-3 pb-4">
            <div className="relative w-2/3 h-fit items-center justify-center text-center break-words font-bit text-white text-sm whitespace-preline">
              {t("acce")}
            </div>
            <div
              className="relative w-full sm:w-2/3 h-full min-h-[25vh] flex items-center justify-center rounded-sm p-px cursor-pointer"
              id="northern"
              onClick={() => window.open("https://kinora.irrevocable.dev/")}
            >
              <Image
                className="rounded-sm"
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/QmYTAxWEr9qm6p6R5GzRoRDJXBmC5bxMBpg3XZcPKqRNmp`}
                draggable={false}
                objectFit="cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestSuccess;
