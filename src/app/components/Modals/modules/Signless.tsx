import { FunctionComponent, JSX, useContext } from "react";
import { ImCross } from "react-icons/im";
import Image from "next/legacy/image";
import { ModalContext } from "@/app/providers";
import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import useSignless from "../hooks/useSignless";
import { AiOutlineLoading } from "react-icons/ai";

const Signless: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const context = useContext(ModalContext);
  const { signlessLoading, handleSignless } = useSignless();
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] sm:w-[50vw] tablet:w-[30vw] h-fit max-h-[90vh] place-self-center bg-offBlack rounded-lg border border-white rounded-sm overflow-y-scroll">
        <div className="relative w-full h-full flex flex-col gap-5 p-2">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="#FBDB86"
              size={10}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                context?.setSignless(false);
              }}
            />
          </div>
          <div
            className="relative w-full h-fit items-center justify-center flex flex-col gap-3 pb-4 font-bit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-2/3 h-fit items-center justify-center text-center break-words text-sol text-sm">
              {dict?.signless}
            </div>
            <div className="relative w-fit h-fit flex">
              <div
                className={`relative px-3 py-1 flex text-center items-center justify-center rounded-md bg-white text-black border border-white w-28 h-8 ${
                  !signlessLoading && "cursor-pointer active:scale-95"
                }`}
                onClick={() => !signlessLoading && handleSignless()}
              >
                {signlessLoading ? (
                  <AiOutlineLoading
                    size={15}
                    color="white"
                    className="animate-spin"
                  />
                ) : (
                  dict?.enable
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signless;
