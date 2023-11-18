import { Details } from "@/components/Autograph/types/autograph.types";
import { CartItem } from "@/components/Common/types/common.types";
import { NextRouter } from "next/router";
import { SetStateAction } from "react";
import { AnyAction, Dispatch } from "redux";

export type FulfillmentProps = {
  details: Details;
  encryptionLoading: boolean;
  encryptFulfillment: () => Promise<void>;
  setDetails: (e: SetStateAction<Details>) => void;
  openDropdown: boolean;
  setOpenDropdown: (e: SetStateAction<boolean>) => void;
  encryptedStrings: string[];
  total: number;
  checkoutCurrency: string;
  setCheckoutCurrency: (e: SetStateAction<string>) => void;
  rate: number;
  cartItems: CartItem[];
  isApprovedSpend: boolean;
  approveSpend: () => Promise<void>;
  collectItem: () => Promise<void>;
  chooseCartItem: string;
  collectPostLoading: boolean[];
};

export type CartProps = {
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  groupedByPubId: {
    [key: string]: {
      colors: string[];
      sizes: string[];
      amounts: number[];
      collectionIds: string[];
      types: string[];
      prices: number[];
      fulfillerAddress: string[];
    };
  };
  cartItems: CartItem[];
  chooseCartItem: string;
  collectPostLoading: boolean[];
  setChooseCartItem: (e: SetStateAction<string>) => void;
  completedPurchases: {
    completed: boolean;
    open: boolean;
  }[];
  setCompletedPurchases: (
    e: SetStateAction<
      {
        completed: boolean;
        open: boolean;
      }[]
    >
  ) => void;
};

export interface OracleData {
  currency: string;
  rate: string;
  wei: string;
}
