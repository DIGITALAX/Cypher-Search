import { ChangeEvent, KeyboardEvent, MouseEvent } from "react";
import { AnyAction, Dispatch } from "redux";
import { CartItem } from "@/components/Layout/types/footer.types";
import { NextRouter } from "next/router";
import {
  Profile,
  PublicationMetadataMainFocusType,
} from "../../../../graphql/generated";

export interface FilterValues {
  hashtags: string[];
  microbrands: string[][];
  community: string[];
  access: string[];
  format: PublicationMetadataMainFocusType[];
  dropsSuggested: string[],
  origin: string[][];
  catalog: string[];
  colors: string[];
  sizes: {
    poster: string[];
    sticker: string[];
    apparel: string[];
  };
  token: string[];
  fulfiller: string[];
}

export interface DropDown {
  hashtag: boolean;
  community: boolean;
  microbrand: boolean;
  catalog: boolean;
  access: boolean;
  format: boolean;
  origin: boolean;
  size: boolean;
  price: boolean;
  token: boolean;
  fulfiller: boolean;
}

export type SearchBarProps = {
  handleSearch: (
    e: KeyboardEvent | MouseEvent,
    click?: boolean
  ) => Promise<void>;
  searchActive: boolean;
  searchInput: string;
  setSearchInput: (e: string) => void;
  filtersOpen: boolean;
  handleShuffleSearch: () => void;
  placeholderText: string | undefined;
  dispatch: Dispatch<AnyAction>;
  layoutAmount: number;
};

export type HeaderProps = {
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  layoutAmount: number;
  handleSearch: (
    e: KeyboardEvent | MouseEvent,
    click?: boolean
  ) => Promise<void>;
  searchActive: boolean;
  searchInput: string;
  placeholderText: string | undefined;
  setSearchInput: (e: string) => void;
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
  handleShuffleSearch: () => void;
  cartItems: CartItem[];
};

export type DropDownProps = {
  title: string;
  hashtag?: boolean;
  reverse?: boolean;
  value: string;
  onChange: (e: ChangeEvent) => void;
  openDropDown: boolean;
  setOpenDropDown: () => void;
  dropDownValues: string[];
  onDropDownChoose: (e: string) => void;
};

export type ImageDropDownProps = {
  title: string;
  cover?: boolean;
  rounded?: boolean;
  reverse?: boolean;
  value: string;
  onChange: (e: ChangeEvent) => void;
  openDropDown: boolean;
  setOpenDropDown: () => void;
  dropDownValues: string[][];
  onDropDownChoose: (e: string) => void;
};

export type ContentSortProps = {
  handleResetFilters: () => void;
  filterConstants: FilterValues | undefined;
  dispatch: Dispatch<AnyAction>;
  filterValues: Filter;
  openDropDown: DropDown;
  setOpenDropDown: (e: DropDown) => void;
  setFilteredDropDownValues: (e: FilterValues) => void;
  filteredDropDownValues: FilterValues;
};

export type PrerollSortProps = {
  dispatch: Dispatch<AnyAction>;
  filterValues: Filter;
  openDropDown: DropDown;
  filterConstants: FilterValues | undefined;
  setOpenDropDown: (e: DropDown) => void;
  setFilteredDropDownValues: (e: FilterValues) => void;
  filteredDropDownValues: FilterValues;
};

export type FilterProps = {
  dispatch: Dispatch<AnyAction>;
  filterConstants: FilterValues | undefined;
  filterValues: Filter;
  openDropDown: DropDown;
  handleResetFilters: () => void;
  setOpenDropDown: (e: DropDown) => void;
  setFilteredDropDownValues: (e: FilterValues) => void;
  filteredDropDownValues: FilterValues;
};

export interface Filter {
  hashtag: string;
  community: string;
  microbrand: string;
  catalog: string;
  access: string;
  format: string;
  origin: string;
  editions: number;
  available: boolean;
  fulfiller: string;
  drop: string;
  size: {
    apparel: string[];
    poster: string[];
    sticker: string[];
  };
  color: string[];
  price: {
    min: number;
    max: number;
  };
  token: string;
  printType: string[];
}

export enum Origin {
  CoinOp,
  Chromadin,
  Legend,
  Listener,
  Other,
}
