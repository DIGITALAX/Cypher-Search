import { NextRouter } from "next/router";
import { AnyAction, Dispatch } from "redux";
import {
  Comment,
  Mirror,
  Post,
  Profile,
  Quote,
} from "../../../../graphql/generated";
import { Creation } from "@/components/Tiles/types/tiles.types";
import { SetStateAction } from "react";

export type BarProps = {
  title: string;
};

export type PopUpProps = {
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
  cartItems: CartItem[];
  index: number;
  cartItem: Creation;
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
  index: number;
  hideCollect?: boolean;
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  mirror:
    | ((id: string) => Promise<void>)
    | ((index: number, id: string) => Promise<void>);
  like:
    | ((id: string) => Promise<void>)
    | ((index: number, id: string) => Promise<void>);
  simpleCollect:
    | ((id: string) => Promise<void>)
    | ((index: number, id: string) => Promise<void>)
    | undefined;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    simpleCollect?: boolean;
  };
  type: string | undefined;
  publication: Post | Mirror | Quote | Comment | undefined;
  openMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
};

export type HoverProfileProps = {
  followLoading: boolean[];
  unfollowProfile:
    | ((id: string) => Promise<void>)
    | ((id: string, feed?: boolean) => Promise<void>);
  followProfile:
    | ((id: string) => Promise<void>)
    | ((id: string, feed?: boolean) => Promise<void>);
  publication: Profile;
  router: NextRouter;
  index: number;
  dispatch: Dispatch<AnyAction>;
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  feed?: boolean;
};

export type TileLoaderProps = {
  layoutAmount: number;
};

export type AccountsProps = {
  router: NextRouter;
  searchActive: boolean;
  openConnectModal: (() => void) | undefined;
  openAccountModal: (() => void) | undefined;
  handleLensConnect: () => Promise<void>;
  cartListOpen: boolean;
  setCartListOpen: (e: SetStateAction<boolean>) => void;
  lensConnected: Profile | undefined;
  walletConnected: boolean;
  setOpenAccount: (e: SetStateAction<boolean>) => void;
  openAccount: boolean;
  signInLoading: boolean;
  filtersOpen: boolean;
  cartItems: CartItem[];
  dispatch: Dispatch<AnyAction>;
  auto?: boolean;
};

export type NotFoundProps = {
  router: NextRouter;
  searchActive: boolean;
  openConnectModal: (() => void) | undefined;
  openAccountModal: (() => void) | undefined;
  handleLensConnect: () => Promise<void>;
  cartListOpen: boolean;
  setCartListOpen: (e: SetStateAction<boolean>) => void;
  lensConnected: Profile | undefined;
  walletConnected: boolean;
  setOpenAccount: (e: SetStateAction<boolean>) => void;
  openAccount: boolean;
  signInLoading: boolean;
  filtersOpen: boolean;
  cartItems: CartItem[];
  dispatch: Dispatch<AnyAction>;
  handleShuffleSearch: () => void;
};

export enum ItemType {
  CoinOp = "coinop",
  Chromadin = "chromadin",
  Legend = "legend",
  Listener = "listener",
}

export type CartItem = {
  item: Creation;
  color: string;
  size: string;
  price: number;
  chosenIndex?: number;
  chosenIndexes?: number[];
  level?: number;
  amount: number;
  type: ItemType;
  purchased: boolean;
};
