import { Details } from "@/components/Autograph/types/autograph.types";
import { CartItem } from "@/components/Common/types/common.types";
import { NextRouter } from "next/router";
import { SetStateAction } from "react";
import { AnyAction, Dispatch } from "redux";

export type FulfillmentProps = {
  details: Details;
  approveLoading: boolean;
  encryptionLoading: boolean;
  encryptFulfillment: () => Promise<void>;
  setDetails: (e: SetStateAction<Details>) => void;
  openDropdown: boolean;
  setOpenDropdown: (e: SetStateAction<boolean>) => void;
  encryptedStrings: {
    pubId: string;
    data: string;
  }[];
  total: number;
  checkoutCurrency: string;
  groupedByPubId: {
    [key: string]: {
      colors: string[];
      sizes: string[];
      amounts: number[];
      collectionIds: string[];
      types: string[];
      prices: number[];
      fulfillerAddress: string[];
      originalIndices: number[];
    };
  };
  setCheckoutCurrency: (e: SetStateAction<string>) => void;
  rate: number;
  cartItems: CartItem[];
  isApprovedSpend: boolean;
  approveSpend: () => Promise<void>;
  collectItem: () => Promise<void>;
  chooseCartItem: CartItem | undefined;
  collectPostLoading: boolean;
};

export type CartProps = {
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  encryptedStrings: {
    pubId: string;
    data: string;
  }[];
  groupedByPubId: {
    [key: string]: {
      colors: string[];
      sizes: string[];
      amounts: number[];
      collectionIds: string[];
      types: string[];
      prices: number[];
      fulfillerAddress: string[];
      originalIndices: number[];
    };
  };
  chosenVariation: {
    size: string;
    color: string;
  }[];
  setChosenVariation: (
    e: SetStateAction<
      {
        size: string;
        color: string;
      }[]
    >
  ) => void;
  cartItems: CartItem[];
  chooseCartItem: CartItem | undefined;
  collectPostLoading: boolean;
  setChooseCartItem: (e: SetStateAction<CartItem | undefined>) => void;
};

export interface OracleData {
  currency: string;
  rate: string;
  wei: string;
}
