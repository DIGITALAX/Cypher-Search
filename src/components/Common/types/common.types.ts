import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { AnyAction, Dispatch } from "redux";
import { ItemType } from "../../../../redux/reducers/cartItemsSlice";

export type BarProps = {
  title: string;
};

export type PopUpProps = {
  router: AppRouterInstance;
  dispatch: Dispatch<AnyAction>;
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
  cartItems: {
    id: string;
    size: string | undefined;
    color: string | undefined;
    amount: number;
    level: number | undefined;
    type: ItemType;
  }[];
  index: number;
  id: string;
  level: number | undefined;
  type: ItemType;
};

export type PurchaseTokensProps = {
  currency: string;
  handleChangeCurrency: (
    levelIndex: number,
    itemIndex: number,
    priceIndex: number,
    checkoutCurrency: string
  ) => void;
  itemIndex: number;
  levelIndex: number;
  priceIndex: number;
};

export type InteractBarProps = {
  col?: boolean;
  layoutAmount?: number;
};
