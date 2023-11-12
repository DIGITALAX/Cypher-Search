import { FunctionComponent } from "react";
import { FulfillmentProps } from "../types/checkout.types";
import { AiOutlineLoading } from "react-icons/ai";

const Fulfillment: FunctionComponent<FulfillmentProps> = ({
  details,
  dispatch,
  encryptionLoading,
  encryptFulfillment,
  setDetails,
}): JSX.Element => {
  return (
    <div className="relative w-full h-[80vh] relative flex items-center justify-start p-2 flex-col">
      <div className="relative w-full h-fit flex">
        <div></div>
      </div>
      <div
        className={`relative w-48 px-2 h-10 text-center py-1 border border-white rounded-md flex items-center justify-center text-white font-bit text-sm ${
          !encryptionLoading && "cursor-pointer active:scale-95"
        }`}
        onClick={() => !encryptionLoading && encryptFulfillment()}
      >
        <div
          className={`${
            encryptionLoading && "animate-spin"
          } flex items-center justify-center`}
        >
          {encryptionLoading ? (
            <AiOutlineLoading size={15} color="white" />
          ) : (
            "Encrypt Fulfillment"
          )}
        </div>
      </div>
    </div>
  );
};

export default Fulfillment;
