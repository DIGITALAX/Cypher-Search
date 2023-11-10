import { FormEvent, MouseEvent, Ref, SetStateAction } from "react";
import { AnyAction, Dispatch } from "redux";
import { VideoSyncState } from "../../../../redux/reducers/videoSyncSlice";
import {
  Mirror,
  Post,
  Profile,
  Quote,
  Comment,
} from "../../../../graphql/generated";
import { NextRouter } from "next/router";
import { CartItem } from "@/components/Common/types/common.types";

export interface Creation {
  amount: string;
  title: string;
  tags: string[];
  pubId: string;
  prompt: string;
  profileId: string;
  profileHandle: string;
  printType: string;
  prices: string[];
  acceptedTokens: string[];
  owner: string;
  microbrandCover: string;
  microbrand: string;
  images: string[];
  fulfillerPercent: string;
  fulfillerBase: string;
  fulfiller: string;
  designerPercent: string;
  drop: string;
  description: string;
  communities: string[];
  collectionId: string;
  access: number;
  unlimited: boolean;
  colors: string[];
  sizes: string[];
  origin: string;
  profile: Profile;
  publication: Post | undefined;
}

export interface Publication {
  post?: Post | Comment | Quote | Mirror | Profile | Creation;
  type: string;
  publishedOn?: string;
}

export type TilesProps = {
  handleMoreSearch: () => Promise<void>;
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  searchLoading: boolean;
  searchActive: boolean;
  filtersOpen: boolean;
  layoutAmount: number;
  popUpOpen: boolean[];
  setPopUpOpen: (e: SetStateAction<boolean[]>) => void;
  apparel: boolean[];
  setApparel: (e: SetStateAction<boolean[]>) => void;
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  cartItems: CartItem[];
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;

  simpleCollect: (id: string, type: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
  }[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  followProfile: (id: string) => Promise<void>;
  unfollowProfile: (id: string) => Promise<void>;
  followLoading: boolean[];
};

export type TileSwitchProps = {
  type: string;
  publication: Publication;
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  layoutAmount: number;
  popUpOpen: boolean[];
  setPopUpOpen: (e: SetStateAction<boolean[]>) => void;
  apparel: boolean[];
  setApparel: (e: SetStateAction<boolean[]>) => void;
  index: number;
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  cartItems: CartItem[];
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  simpleCollect?: (id: string, type: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
  }[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  profileId?: string;
  volume?: number;
  volumeOpen?: boolean;
  setVolumeOpen?: (e: SetStateAction<boolean>) => void;
  videoSync?: VideoSyncState;
  handleVolumeChange?: (e: SetStateAction<FormEvent>) => void;
  handleHeart?: () => void;
  progressRef?: Ref<HTMLDivElement>;
  handleSeek?: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
  followProfile: (id: string) => Promise<void>;
  unfollowProfile: (id: string) => Promise<void>;
  followLoading: boolean[];
};

export type ControlsProps = {
  videoSync: VideoSyncState;
  volume: number;
  router: NextRouter;
  volumeOpen: boolean;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: SetStateAction<FormEvent>) => void;
  handleHeart: () => void;
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  profileId: string;
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
  dispatch: Dispatch<AnyAction>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
  };
  publication: Publication;
};

export type VideoPostProps = {
  videoSync: VideoSyncState;
  volume: number;
  volumeOpen: boolean;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: SetStateAction<FormEvent>) => void;
  handleHeart: () => void;
  profileId: string;
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
  dispatch: Dispatch<AnyAction>;
  layoutAmount: number;
  router: NextRouter;
  publication: Publication;
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
  };
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
};

export type LegendProps = {
  publication: Post;
  imageIndex: number[];
  milestoneCovers: string[];
  commentsOpen: boolean[];
  setCommentsOpen: (e: SetStateAction<boolean[]>) => void;
  setImageIndex: (e: SetStateAction<number[]>) => void;
  index: number;
  setCollectChoice: (
    e: SetStateAction<{ color: string; size: string }[]>
  ) => void;
  collectChoice: {
    color: string;
    size: string;
  }[];
  cartItems: CartItem[];
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  layoutAmount: number;
  popUpOpen: boolean[];
  setPopUpOpen: (e: SetStateAction<boolean[]>) => void;
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
  };
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
};

export type CollectItemProps = {
  index: number;
  router: NextRouter;
  setCollectChoice: (
    e: SetStateAction<{ color: string; size: string }[]>
  ) => void;
  collectChoice: {
    color: string;
    size: string;
  }[];
  cartItems: CartItem[];
  dispatch: Dispatch<AnyAction>;
  item: Creation;
};

export type ChromadinProps = {
  layoutAmount: number;
  apparel: boolean[];
  setApparel: (e: SetStateAction<boolean[]>) => void;
  index: number;
  popUpOpen: boolean[];
  setPopUpOpen: (e: SetStateAction<boolean[]>) => void;
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  cartItems: CartItem[];
  publication: Creation;
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;

  interactionsLoading: {
    like: boolean;
    mirror: boolean;
  };
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  followProfile: (id: string) => Promise<void>;
  unfollowProfile: (id: string) => Promise<void>;
  followLoading: boolean[];
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
};

export type CoinOpProps = {
  layoutAmount: number;
  popUpOpen: boolean[];
  setPopUpOpen: (e: SetStateAction<boolean[]>) => void;
  index: number;
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  publication: Creation;
  cartItems: CartItem[];
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;

  interactionsLoading: {
    like: boolean;
    mirror: boolean;
  };
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  followProfile: (id: string) => Promise<void>;
  unfollowProfile: (id: string) => Promise<void>;
  followLoading: boolean[];
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
};

export type TextPostProps = {
  layoutAmount: number;
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  publication: Post | Comment | Quote | Mirror;
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  simpleCollect: (id: string, type: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
  };
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  index: number;
  followProfile: (id: string) => Promise<void>;
  unfollowProfile: (id: string) => Promise<void>;
  followLoading: boolean[];
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
};

export type QuestProps = {
  layoutAmount: number;
  router: NextRouter;
  publication: Post | Comment | Quote | Mirror;
  followProfile: (id: string) => Promise<void>;
  unfollowProfile: (id: string) => Promise<void>;
  followLoading: boolean[];
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
};

export type ImagePostProps = {
  layoutAmount: number;
  router: NextRouter;
  publication: Post | Comment | Quote | Mirror;
  dispatch: Dispatch<AnyAction>;
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;

  simpleCollect: (id: string, type: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
  };
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  index: number;
  followProfile: (id: string) => Promise<void>;
  unfollowProfile: (id: string) => Promise<void>;
  followLoading: boolean[];
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
};

export type LevelOneProps = {
  index: {
    levelIndex: number;
    imageIndex: number;
    rate: number;
    currency: string;
    price: number[];
    priceIndex: number;
    itemIndex: number;
  };
  handleChangeCurrency: (
    levelIndex: number,
    itemIndex: number,
    priceIndex: number,
    checkoutCurrency: string
  ) => void;
};

export type ListenerProps = {
  layoutAmount: number;
  index: number;
  popUpOpen: boolean[];
  setPopUpOpen: (e: SetStateAction<boolean[]>) => void;
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  cartItems: CartItem[];
  publication: Creation;
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;

  interactionsLoading: {
    like: boolean;
    mirror: boolean;
  };
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  followProfile: (id: string) => Promise<void>;
  unfollowProfile: (id: string) => Promise<void>;
  followLoading: boolean[];
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
};

export enum PrintType {
  Sticker = "0",
  Poster = "1",
  Shirt = "2",
  Hoodie = "3",
}

export type ProfileProps = {
  layoutAmount: number;
  router: NextRouter;
  publication: Profile;
  index: number;
  followProfile: (id: string) => Promise<void>;
  unfollowProfile: (id: string) => Promise<void>;
  followLoading: boolean[];
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  dispatch: Dispatch<AnyAction>;
};

export type MicrobrandProps = {
  layoutAmount: number;
  router: NextRouter;
  publication: Profile;
  index: number;
  dispatch: Dispatch<AnyAction>;
  followProfile: (id: string) => Promise<void>;
  unfollowProfile: (id: string) => Promise<void>;
  followLoading: boolean[];
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
};

export interface FilterInput {
  access_contains?: String;
  communities_contains?: String;
  description_contains?: String;
  drop_contains?: String;
  microbrand_contains?: String;
  printType_contains?: String;
  prompt_contains?: String;
  tags_contains?: String;
  title_contains?: String;
  unlimited?: Boolean;
  amount_gte?: String;
  amount_lte?: String;
}

export enum ERC20Tokens {
  MONA = "MONA",
  USDT = "USDT",
  WETH = "WETH",
  WMATIC = "WMATIC",
}

export interface Community {
  name: string;
  subtopic: string;
  description: string;
  sample: Creation[];
  steward: Profile;
  validPrintTypes: PrintType[];
  validTokens: Creation[];
  tokens: {
    token: ERC20Tokens;
    amount: string;
  }[];
  members: Profile[];
}

export type CommunityProps = {
  community: Community;
  router: NextRouter;
  index: number;
  followProfile: (id: string) => Promise<void>;
  unfollowProfile: (id: string) => Promise<void>;
  followLoading: boolean[];
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
};
