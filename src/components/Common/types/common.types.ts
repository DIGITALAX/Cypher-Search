import { NextRouter } from "next/router";
import { AnyAction, Dispatch } from "redux";
import { Profile, PublicationStats } from "../../../../graphql/generated";
import { Creation } from "@/components/Tiles/types/tiles.types";

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
  mirror:
    | ((id: string) => Promise<void>)
    | ((index: number, id: string) => Promise<void>);
  like:
    | ((id: string) => Promise<void>)
    | ((index: number, id: string) => Promise<void>);
  comment:
    | ((id: string) => Promise<void>)
    | ((index: number, id: string) => Promise<void>);
  quote:
    | ((id: string) => Promise<void>)
    | ((index: number, id: string) => Promise<void>);
  collect:
    | ((id: string) => Promise<void>)
    | ((index: number, id: string) => Promise<void>)
    | undefined;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    quote: boolean;
    comment: boolean;
    collect?: boolean;
  };
  type: string | undefined;
  publication: PublicationStats | undefined;
  openMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: boolean[]) => void;
};

export type HoverProfileProps = {
  followLoading: boolean[];
  unfollowProfile: (id: string) => Promise<void>;
  followProfile: (id: string) => Promise<void>;
  publication: Profile;
  router: NextRouter;
  index: number;
  profileHovers: boolean[];
  setProfileHovers: (e: boolean[]) => void;
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
  setCartListOpen: (e: boolean) => void;
  lensConnected: Profile | undefined;
  walletConnected: boolean;
  setOpenAccount: (e: boolean) => void;
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
  setCartListOpen: (e: boolean) => void;
  lensConnected: Profile | undefined;
  walletConnected: boolean;
  setOpenAccount: (e: boolean) => void;
  openAccount: boolean;
  signInLoading: boolean;
  filtersOpen: boolean;
  cartItems: CartItem[];
  dispatch: Dispatch<AnyAction>;
  handleShuffleSearch: () => void;
};

export enum ItemType {
  Chromadin = "chromadin",
  CoinOp = "coinop",
  Legend = "legend",
  Listener = "listener",
}

export type CartItem = {
  item: Creation;
  color: string;
  size: string;
  price: number;
  level?: number;
  amount: number;
  type: ItemType;
};
