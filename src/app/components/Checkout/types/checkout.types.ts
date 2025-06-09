import { SetStateAction } from "react";

export interface PurchaseDetailsCheckout {
  address: string;
  zip: string;
  city: string;
  state: string;
  country: string;
}

export type FulfillmentProps = {
  dict: any;
  openDropdown: boolean;
  setOpenDropdown: (e: SetStateAction<boolean>) => void;
  encrypted: string[];
  encryptFulfillment: () => Promise<void>;
  encryptionLoading: boolean;
  details: PurchaseDetailsCheckout;
  setDetails: (e: SetStateAction<PurchaseDetailsCheckout>) => void;
  chooseCartItem: number;
  approveLoading: { currency: string; loading: boolean }[];
  collectPostLoading: boolean;
  approveSpend: (currency: `0x${string}`) => Promise<void>;
  isApprovedSpend: { currency: string; approved: boolean }[];
  collectItems: () => Promise<void>;
};

export type CartProps = {
  setChooseCartItem: (e: SetStateAction<number>) => void;
  dict: any;
  details: PurchaseDetailsCheckout;
  setDetails: (e: SetStateAction<PurchaseDetailsCheckout>) => void;
  encrypted: string[];
  chooseCartItem: number;
  collectPostLoading: boolean;
};
