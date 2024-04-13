import { ChangeEvent, KeyboardEvent, MouseEvent, SetStateAction } from "react";
import { AnyAction, Dispatch } from "redux";
import { NextRouter } from "next/router";
import {
  Post,
  Profile,
  PublicationMetadataMainFocusType,
} from "../../../../graphql/generated";
import { CartItem } from "@/components/Common/types/common.types";
import { Creation, Publication } from "@/components/Tiles/types/tiles.types";
import { AllSearchItemsState } from "../../../../redux/reducers/searchItemsSlice";
import { FullScreenVideoState } from "../../../../redux/reducers/fullScreenVideoSlice";
import { TFunction, i18n } from "i18next";

export interface FilterValues {
  hashtags: string[];
  microbrands: string[][];
  community: string[][];
  access: string[][];
  format: PublicationMetadataMainFocusType[];
  dropsSuggested: string[];
  origin: string[][];
  catalog: string[];
  colors: string[];
  sizes: {
    poster: string[];
    sticker: string[];
    apparel: string[];
  };
  token: string[];
  sexes: string[];
  styles: string[][];
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
  router: NextRouter;
  filtersOpen: boolean;
  filterChange: boolean;
  handleShuffleSearch: () => void;
  placeholderText: string | undefined;
  dispatch: Dispatch<AnyAction>;
  layoutAmount: number;
  searchItems: AllSearchItemsState | undefined;
  t: TFunction<"common", undefined>;
};

export type HeaderProps = {
  t: TFunction<"common", undefined>;
  dispatch: Dispatch<AnyAction>;
  includeSearch: boolean;
  i18n: i18n;
  router: NextRouter;
  layoutAmount?: number;
  filterChange: boolean;
  cartAnim: boolean;
  handleSearch?: (
    e: KeyboardEvent | MouseEvent,
    click?: boolean
  ) => Promise<void>;
  searchActive: boolean;
  placeholderText?: string | undefined;
  openConnectModal: (() => void) | undefined;
  handleLogout: () => void;
  searchItems: AllSearchItemsState | undefined;
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
  fullScreenVideo: FullScreenVideoState;
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
  t: TFunction<"common", undefined>;
  filterConstants: FilterValues | undefined;
  dispatch: Dispatch<AnyAction>;
  filterValues: Filter;
  openDropDown: DropDown;
  setOpenDropDown: (e: SetStateAction<DropDown>) => void;
  setFilteredDropDownValues: (
    e: SetStateAction<FilterValues | undefined>
  ) => void;
  filteredDropDownValues: FilterValues;
};

export type PrerollSortProps = {
  dispatch: Dispatch<AnyAction>;
  filterValues: Filter;
  openDropDown: DropDown;
  t: TFunction<"common", undefined>;
  router: NextRouter;
  filterConstants: FilterValues | undefined;
  setOpenDropDown: (e: SetStateAction<DropDown>) => void;
  setFilteredDropDownValues: (
    e: SetStateAction<FilterValues | undefined>
  ) => void;
  filteredDropDownValues: FilterValues;
};

export type FilterProps = {
  t: TFunction<"common", undefined>;
  dispatch: Dispatch<AnyAction>;
  filterConstants: FilterValues | undefined;
  filterValues: Filter;
  openDropDown: DropDown;
  lensConnected: Profile | undefined;
  handleResetFilters: () => void;
  setOpenDropDown: (e: SetStateAction<DropDown>) => void;
  setFilteredDropDownValues: (
    e: SetStateAction<FilterValues | undefined>
  ) => void;
  filteredDropDownValues: FilterValues;
  publication: Publication;
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  layoutAmount: number;
  popUpOpen: boolean[];
  setPopUpOpen: (e: SetStateAction<boolean[]>) => void;
  router: NextRouter;
  cartItems: CartItem[];
  mirror: (id: string, creation?: boolean) => Promise<void>;
  like: (id: string, hasReacted: boolean, creation?: boolean) => Promise<void>;
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

export interface Quest {
  publication: Post;
  gate: Gate;
  questMetadata: {
    title: string;
    description: string;
    cover: string;
    videoCovers: {
      title: string;
      description: string;
      cover: string;
    }[];
  };
  status: boolean;
  pubId: string;
  profileId: string;
  milestones: Milestone[];
  questId: string;
  transactionHash: string;
  uri: string;
  milestoneCount: string;
  players: Player[];
  maxPlayerCount: string;
  blockTimestamp: string;
}

export interface Reward {
  amount: string;
  tokenAddress: string;
  rewardMetadata: {
    mediaCover: string;
    images: string;
    video: string;
    mediaType: string;
    audio: string;
    title: string;
    description: string;
  };
  uri: string;
  type: string;
}

export interface Milestone {
  gated: Gate;
  milestoneMetadata: {
    title: string;
    description: string;
    cover: string;
  };
  milestoneId: string;
  rewards: Reward[];
  rewardsLength: string;
  videoLength: string;
}

export interface Player {
  milestonesCompleted: {
    questId: string;
    milestonesCompleted: String;
  }[];
  eligibile: {
    milestone: string;
    questId: string;
    status: boolean;
  }[];
  profileId: string;
  questsCompleted: string[];
  questsJoined: string[];
  profile: Profile;
}

export interface Gate {
  erc721Logic: Creation[];
  erc20Logic: {
    address: string;
    amount: string;
  }[];
  oneOf: boolean;
}
