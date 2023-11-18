import { OracleData } from "@/components/Checkout/types/checkout.types";
import { CartItem } from "@/components/Common/types/common.types";
import { FilterValues } from "@/components/Search/types/search.types";
import { Creation, Publication } from "@/components/Tiles/types/tiles.types";
import { NextRouter } from "next/router";
import { SetStateAction } from "react";
import { AnyAction, Dispatch } from "redux";
import { Profile } from "../../../../graphql/generated";

export type SwitchTypeProps = {
  itemData: Publication;
  isApprovedSpend: boolean;
  type: string;
  filterConstants: FilterValues | undefined;
  router: NextRouter;
  instantLoading: boolean;
  cartItems: CartItem[];
  dispatch: Dispatch<AnyAction>;
  oracleData: OracleData[];
  purchaseDetails: PurchaseDetails;
  setPurchaseDetails: (e: SetStateAction<PurchaseDetails>) => void;
  approveSpend: () => Promise<void>;
  handleInstantPurchase: () => Promise<void>;
  relatedCollections: Creation[] | undefined;
  lensConnected: Profile | undefined;
};

export type ChromadinProps = {
  itemData: Creation;
  isApprovedSpend: boolean;
  type: string;
  filterConstants: FilterValues | undefined;
  router: NextRouter;
  instantLoading: boolean;
  cartItems: CartItem[];
  dispatch: Dispatch<AnyAction>;
  oracleData: OracleData[];
  purchaseDetails: PurchaseDetails;
  setPurchaseDetails: (e: SetStateAction<PurchaseDetails>) => void;
  approveSpend: () => Promise<void>;
  handleInstantPurchase: () => Promise<void>;
  lensConnected: Profile | undefined;
};

export interface PurchaseDetails {
  currency: string;
  price: string;
  size: string;
  color: string;
  imageIndex: number;
}
