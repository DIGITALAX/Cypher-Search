import { ethers } from "ethers";
import { UnknownOpenActionModuleInput } from "../../graphql/generated";
import {
  CHROMADIN_OPEN_ACTION,
  COIN_OP_OPEN_ACTION,
  LEGEND_OPEN_ACTION,
  LISTENER_OPEN_ACTION,
} from "../constants";
import { CartItem } from "@/components/Common/types/common.types";

const encodeActData = (
  cartItem: CartItem,
  encryptedFulfillment: string,
  address: `0x${string}`,
  currency: `0x${string}`
): UnknownOpenActionModuleInput | undefined => {
  let unknownOpenAction: UnknownOpenActionModuleInput | undefined;
  const coder = new ethers.AbiCoder();

  switch (cartItem?.type) {
    case "chromadin":
      unknownOpenAction = {
        address: CHROMADIN_OPEN_ACTION,
        data: coder.encode(["address", "uint256"], [address, cartItem.amount]),
      };
      break;

    case "listener":
    case "coinop":
      unknownOpenAction = {
        address:
          cartItem.type === "listener"
            ? LISTENER_OPEN_ACTION
            : COIN_OP_OPEN_ACTION,
        data: coder.encode(
          ["uint256", "uint256", "string", "address", "bool"],
          [
            cartItem.chosenIndex,
            cartItem.amount,
            encryptedFulfillment,
            currency,
            false,
          ]
        ),
      };
      break;

    case "legend":
      unknownOpenAction = {
        address: LEGEND_OPEN_ACTION,
        data: coder.encode(
          ["uint256[]", "address", "uint256", "string"],
          [
            cartItem.chosenIndexes,
            currency,
            cartItem.level,
            encryptedFulfillment,
          ]
        ),
      };
      break;
  }

  return unknownOpenAction;
};

export default encodeActData;
