import { ChangeEvent, KeyboardEvent, MouseEvent } from "react";
import { FILTER_VALUES } from "../../../../lib/constants";
import { AnyAction, Dispatch } from "redux";
import { CartItem } from "@/components/Layout/types/footer.types";
import { NextRouter } from "next/router";

export type SearchBarProps = {
  handleSearch: (
    e: KeyboardEvent | MouseEvent,
    click?: boolean
  ) => Promise<void>;
  searchActive: boolean;
  searchInput: string;
  setSearchInput: (e: string) => void;
  filtersOpen: boolean;
  handleShuffleSearch: () => Promise<void>;
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
  handleLensConnect: () => Promise<void>;
  cartListOpen: boolean;
  setCartListOpen: (e: boolean) => void;
  lensConnected:
    | {
        appId?: string;
        attributes?: {
          key: string;
          type: any;
          value: any;
        }[];
        bio?: string;
        coverPicture?: string;
        id: string;
        name?: string;
        picture?: string;
      }
    | undefined;
  walletConnected: boolean;
  setOpenAccount: (e: boolean) => void;
  openAccount: boolean;
  signInLoading: boolean;
  filtersOpen: boolean;
  handleShuffleSearch: () => Promise<void>;
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

export type ContentSortProps = {
  dispatch: Dispatch<AnyAction>;
  filterValues: Filter;
  openDropDown: {
    hashtag: boolean;
    community: boolean;
    microbrand: boolean;
    publication: boolean;
    access: boolean;
    format: boolean;
    origin: boolean;
    size: boolean;
    price: boolean;
    token: boolean;
  };
  setOpenDropDown: (e: {
    hashtag: boolean;
    community: boolean;
    microbrand: boolean;
    publication: boolean;
    access: boolean;
    format: boolean;
    origin: boolean;
    size: boolean;
    price: boolean;
    token: boolean;
  }) => void;
  setFilteredDropDownValues: (e: typeof FILTER_VALUES) => void;
  filteredDropDownValues: typeof FILTER_VALUES;
};

export type PrerollSortProps = {
  dispatch: Dispatch<AnyAction>;
  filterValues: Filter;
  openDropDown: {
    hashtag: boolean;
    community: boolean;
    microbrand: boolean;
    publication: boolean;
    access: boolean;
    format: boolean;
    origin: boolean;
    size: boolean;
    price: boolean;
    token: boolean;
  };
  setOpenDropDown: (e: {
    hashtag: boolean;
    community: boolean;
    microbrand: boolean;
    publication: boolean;
    access: boolean;
    format: boolean;
    origin: boolean;
    size: boolean;
    price: boolean;
    token: boolean;
  }) => void;
  setFilteredDropDownValues: (e: typeof FILTER_VALUES) => void;
  filteredDropDownValues: typeof FILTER_VALUES;
};

export type FilterProps = {
  dispatch: Dispatch<AnyAction>;
  filterValues: Filter;
  openDropDown: {
    hashtag: boolean;
    community: boolean;
    microbrand: boolean;
    publication: boolean;
    access: boolean;
    format: boolean;
    origin: boolean;
    size: boolean;
    price: boolean;
    token: boolean;
  };
  setOpenDropDown: (e: {
    hashtag: boolean;
    community: boolean;
    microbrand: boolean;
    publication: boolean;
    access: boolean;
    format: boolean;
    origin: boolean;
    size: boolean;
    price: boolean;
    token: boolean;
  }) => void;
  setFilteredDropDownValues: (e: typeof FILTER_VALUES) => void;
  filteredDropDownValues: typeof FILTER_VALUES;
};

export interface Filter {
  hashtag: string;
  community: string;
  microbrand: string;
  publication: string;
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
