import { FunctionComponent } from "react";
import { DecryptProps } from "../types/autograph.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { AiOutlineLoading } from "react-icons/ai";

const Decrypt: FunctionComponent<DecryptProps> = ({
  handleDecrypt,
  decryptLoading,
  canDecrypt,
  toDecrypt,
}): JSX.Element => {
  return (
    <div
      className="relative w-full p-1.5 h-10 flex items-center justify-end"
      title={
        canDecrypt
          ? "Decrypt Post"
          : "You don't hold the keys to Decrypt this post yet."
      }
    >
      <div
        className={`relative w-5 h-5 flex items-center justify-end ml-auto cursor-pointer  ${
          canDecrypt ? "active:scale-95" : "opacity-60"
        }`}
        onClick={() =>
          canDecrypt && !decryptLoading && handleDecrypt(toDecrypt)
        }
      >
        {decryptLoading ? (
          <AiOutlineLoading size={10} color="white" />
        ) : (
          <Image
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/QmZafDwLMacZjtgbW2MeHBdcMGitjHvaZpr3aQAXMqBUpZ`}
            draggable={false}
          />
        )}
      </div>
    </div>
  );
};

export default Decrypt;
