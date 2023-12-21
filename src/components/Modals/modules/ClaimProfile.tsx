import { FunctionComponent } from "react";
import { ClaimProfileProps } from "../types/modals.types";
import { ImCross } from "react-icons/im";
import { setClaimProfile } from "../../../../redux/reducers/claimProfileSlice";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";

const ClaimProfile: FunctionComponent<ClaimProfileProps> = ({
  dispatch,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] sm:w-[70vw] tablet:w-[40vw] h-fit max-h-[90vh] place-self-center bg-offBlack rounded-lg border border-white rounded-sm overflow-y-scroll">
        <div className="relative w-full h-full flex flex-col gap-5 p-2">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="#FBDB86"
              size={10}
              onClick={() => dispatch(setClaimProfile(false))}
            />
          </div>
          <div className="relative w-full h-fit items-center justify-center flex flex-col gap-3 pb-4">
            <div className="relative w-2/3 h-fit items-center justify-center text-center break-words font-bit text-sol text-sm">
              Haven&apos;t claimed your Lens profile yet? Try here.
            </div>
            <div
              className="relative w-full sm:w-2/3 h-full min-h-[25vh] flex items-center justify-center rounded-sm p-px"
              id="smoke"
            >
              <Image
                className="rounded-sm"
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/QmNceKihkEktmp9sTutC9ixf2UV1RsE1sCfsQyDxpPiuSr`}
                draggable={false}
                objectFit="cover"
              />
            </div>
            <div
              onClick={() => window.open(`https://claim.lens.xyz/`)}
              className="relative border border-white w-32 h-8 cursor-pointer flex items-center justify-center active:scale-95 py-1 rounded-md text-xs font-bit text-white"
            >
              <div className="relative w-fit h-fit flex items-center justify-center">
                Claim Profile
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimProfile;
