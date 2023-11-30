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
  groupedByPubId:
    | {
        colors: string[];
        sizes: string[];
        amounts: number[];
        collectionIds: string[];
        types: string[];
        prices: number[];
        fulfillerAddress: string[];
        originalIndices: number[];
      }
    | undefined,
  encryptedFulfillment: string,
  currency: `0x${string}`
): UnknownOpenActionModuleInput | undefined => {
  let unknownOpenAction: UnknownOpenActionModuleInput | undefined;
  const coder = new ethers.AbiCoder();

  switch (cartItem?.type) {
    case "chromadin":
      unknownOpenAction = {
        address: CHROMADIN_OPEN_ACTION,
        data: coder.encode(["address", "uint256"], [currency, cartItem.amount]),
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
          ["uint256[]", "uint256[]", "string", "address", "bool"],
          [
            cartItem?.item?.printType !== "0" &&
            cartItem?.item?.printType! == "1"
              ? Array.from(
                  { length: groupedByPubId?.amounts?.length! },
                  () => 0
                )
              : groupedByPubId?.prices.map((item: number) =>
                  cartItem?.item?.prices.indexOf(String(item))
                ),
            groupedByPubId?.amounts,
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
