import { FunctionComponent } from "react";
import { InteractErrorProps } from "../types/modals.types";
import { ImCross } from "react-icons/im";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";
import Image from "next/legacy/image";

const InteractError: FunctionComponent<InteractErrorProps> = ({
  dispatch,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[40vw] h-[40vh] place-self-center bg-offBlack rounded-lg border border-white rounded-sm">
        <div className="relative w-full h-full flex flex-col gap-5 p-2">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="#FBDB86"
              size={10}
              onClick={() => dispatch(setInteractError(false))}
            />
          </div>
          <div className="relative w-full h-fit items-center justify-center flex flex-col gap-3">
            <div className="relative w-2/3 h-fit items-center justify-center text-center break-words font-bit text-sol text-sm">
              Something Went Wrong Indexing Your Interaction. Try Again?
            </div>
            <div
              className="relative w-2/3 h-52 flex items-center justify-center rounded-sm p-px"
              id="smoke"
            >
              <div className="relative w-full h-full rounded-sm flex items-center justify-center">
                <Image
                  className="rounded-sm"
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmXgdgSRWVLkCQhY2a28PP9ch1d9UqUCis1ms3UZdbxELS`}
                  draggable={false}
                  objectFit="cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractError;
