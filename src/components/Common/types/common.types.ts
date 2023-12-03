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
import {
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  RefObject,
  SetStateAction,
} from "react";
import { FullScreenVideoState } from "../../../../redux/reducers/fullScreenVideoSlice";
import { AllSearchItemsState } from "../../../../redux/reducers/searchItemsSlice";
import { FilterValues } from "@/components/Search/types/search.types";

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
  creation?: boolean;
  hideComment?: boolean;
  display?: string;
  gallery?: boolean;
  comment?: () => void;
  hideCollect?: boolean;
  main?: boolean;
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  mirror:
    | ((id: string) => Promise<void>)
    | ((index: number, id: string) => Promise<void>)
    | ((id: string, main: boolean) => Promise<void>);
  like:
    | ((id: string, hasReacted: boolean) => Promise<void>)
    | ((id: string, hasReacted: boolean, main?: boolean) => Promise<void>)
    | ((index: number, id: string, hasReacted: boolean) => Promise<void>);
  simpleCollect:
    | ((id: string, type: string) => Promise<void>)
    | ((id: string, type: string, main?: boolean) => Promise<void>)
    | undefined;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    simpleCollect?: boolean;
    hide?: boolean;
    bookmark?: boolean;
  };
  publication: Post | Mirror | Quote | Comment | undefined;
  openMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  showOthers?: boolean;
  handleHidePost?: (id: string, index: number) => Promise<void>;
  handleBookmark?: (id: string, index: number) => Promise<void>;
};

export type HoverProfileProps = {
  followLoading: boolean[];
  unfollowProfile:
    | ((id: string, index?: number) => Promise<void>)
    | ((id: string, feed?: boolean, main?: boolean) => Promise<void>);
  followProfile:
    | ((id: string, index?: number) => Promise<void>)
    | ((id: string, feed?: boolean, main?: boolean) => Promise<void>);
  publication: Profile;
  parentId: string;
  router: NextRouter;
  index: number;
  dispatch: Dispatch<AnyAction>;
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  feed?: boolean;
  main?: boolean;
  lensConnected: Profile | undefined;
  bottom: string;
  top: string;
  left: string;
  right: string;
};

export type TileLoaderProps = {
  layoutAmount: number;
};

export type AccountsProps = {
  router: NextRouter;
  searchActive: boolean;
  cartAnim: boolean;
  openConnectModal: (() => void) | undefined;
  handleLogout: () => void;
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
  fullScreenVideo: FullScreenVideoState;
};

export type NotFoundProps = {
  router: NextRouter;
  searchActive: boolean;
  cartAnim: boolean;
  openConnectModal: (() => void) | undefined;
  handleLogout: () => void;
  handleLensConnect: () => Promise<void>;
  cartListOpen: boolean;
  fullScreenVideo: FullScreenVideoState;
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
  F3M = "f3m",
  Other = "other",
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

export type SuggestedProps = {
  dispatch: Dispatch<AnyAction>;
  includeSearch: boolean;
  moreSearchLoading: boolean;
  filterChange: boolean;
  searchItems: AllSearchItemsState | undefined;
  router: NextRouter;
  fullScreenVideo: FullScreenVideoState;
  cartAnim: boolean;
  filterConstants: FilterValues | undefined;
  layoutAmount?: number;
  handleSearch?: (
    e: KeyboardEvent | MouseEvent,
    click?: boolean
  ) => Promise<void>;
  allSearchItems: AllSearchItemsState | undefined;
  placeholderText?: string | undefined;
  openConnectModal: (() => void) | undefined;
  handleLogout: () => void;
  handleLensConnect: () => Promise<void>;
  cartListOpen: boolean;
  setCartListOpen: (e: SetStateAction<boolean>) => void;
  lensConnected: Profile | undefined;
  walletConnected: boolean;
  setOpenAccount: (e: SetStateAction<boolean>) => void;
  openAccount: boolean;
  signInLoading: boolean;
  filtersOpen: boolean;
  handleShuffleSearch?: () => void;
  cartItems: CartItem[];
  handleMoreSearch: () => Promise<void>;
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  searchLoading: boolean;
  popUpOpen: boolean[];
  setPopUpOpen: (e: SetStateAction<boolean[]>) => void;
  apparel: boolean[];
  setApparel: (e: SetStateAction<boolean[]>) => void;
  mirror: (id: string) => Promise<void>;
  like: (id: string, hasReacted: boolean) => Promise<void>;
  simpleCollect: (id: string, type: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    simpleCollect: boolean;
  }[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  followProfile: (id: string) => Promise<void>;
  unfollowProfile: (id: string) => Promise<void>;
  followLoading: boolean[];
  component: ReactNode;
};

export type StatsProps = {
  profile: Profile;
  dispatch: Dispatch<AnyAction>;
  layoutAmount: number;
};

export type MediaProps = {
  type: string;
  srcUrl: string;
  srcCover?: string;
  classNameVideo?: string;
  classNameImage?: string;
  classNameAudio?: string;
  objectFit?: string;
  hidden?: boolean;
};

export type CartListProps = {
  cartItems: CartItem[];
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  setCartListOpen: (e: SetStateAction<boolean>) => void;
  page?: boolean;
  searchActive: boolean;
};

export type PrintTypeProps = {
  printType: string;
};
