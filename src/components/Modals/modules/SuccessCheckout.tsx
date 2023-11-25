import { FunctionComponent } from "react";
import { SuccessCheckoutProps } from "../types/modals.types";
import { ImCross } from "react-icons/im";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Image from "next/legacy/image";
import { setSuccessCheckout } from "../../../../redux/reducers/successCheckoutSlice";
import { setScreenDisplay } from "../../../../redux/reducers/screenDisplaySlice";
import { ScreenDisplay } from "@/components/Autograph/types/autograph.types";

const SuccessCheckout: FunctionComponent<SuccessCheckoutProps> = ({
  dispatch,
  router,
  handle,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] sm:w-[70vw] tablet:w-[40vw] h-fit max-h-[90vh] place-self-center bg-offBlack border border-white overflow-y-scroll">
        <div className="relative w-full h-full flex flex-col gap-5 p-2">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="#FBDB86"
              size={10}
              onClick={() => dispatch(setSuccessCheckout(false))}
            />
          </div>
          <div className="relative w-full h-fit items-center justify-center flex flex-col gap-3">
            <div className="relative w-2/3 h-fit items-center justify-center text-center break-words font-bit text-sol text-sm">
              They&quot;re all yours, now. Return like a blast from the past for
              order and fulfillment updates.
            </div>
            <div
              className="relative w-full sm:w-2/3 h-full min-h-[25vh] flex items-center justify-center rounded-sm p-px cursor-pointer active:scale-95"
              onClick={() => {
                dispatch(setSuccessCheckout(false));
                dispatch(setScreenDisplay(ScreenDisplay.Orders));
                router.push(`/autograph/${handle}`);
              }}
              id="success"
            >
              <div className="relative w-full h-full rounded-sm flex items-center justify-center">
                <Image
                  className="rounded-sm"
                  layout="fill"
                  objectFit="cover"
                  src={`${INFURA_GATEWAY}/ipfs/QmPFrktu3pFVVwQnQjPziSbBLyKHvvyww49VV5YwerbhG9`}
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessCheckout;
