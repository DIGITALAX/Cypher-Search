import { FunctionComponent, JSX, useContext } from "react";
import { ImCross } from "react-icons/im";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { useRouter } from "next/navigation";
import { ModalContext } from "@/app/providers";
import { ScreenDisplay } from "../../Autograph/types/autograph.types";

const SuccessCheckout: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] sm:w-[70vw] tablet:w-[40vw] h-fit max-h-[90vh] place-self-center bg-offBlack border border-white overflow-y-scroll">
        <div className="relative w-full h-full flex flex-col gap-5 p-2">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="#FBDB86"
              size={10}
              onClick={() => context?.setSuccessCheckout(false)}
            />
          </div>
          <div className="relative w-full h-fit items-center justify-center flex flex-col gap-3 pb-4">
            <div className="relative w-2/3 h-fit items-center justify-center text-center break-words font-bit text-sol text-sm">
              {dict?.your}
            </div>
            <div
              className="relative w-full sm:w-2/3 h-full min-h-[25vh] flex items-center justify-center rounded-sm p-px cursor-pointer active:scale-95"
              onClick={() => {
                context?.setSuccessCheckout(false);
                context?.setScreenDisplay(ScreenDisplay.Orders);
                router.push(
                  `/autograph/${context?.lensConectado?.profile?.username?.localName}`
                );
              }}
              id="success"
            >
              <Image
                className="rounded-sm"
                layout="fill"
                objectFit="cover"
                src={`${INFURA_GATEWAY}/ipfs/QmTsxHiaDsis5h17fy5THtR57gdK397QL5H4PbYe6xB8CQ`}
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessCheckout;
