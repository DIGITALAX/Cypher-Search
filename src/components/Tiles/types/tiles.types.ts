import { RefObject, SetStateAction } from "react";
import { AnyAction, Dispatch } from "redux";
import {
  Mirror,
  Post,
  Profile,
  Quote,
  Comment,
} from "../../../../graphql/generated";
import { NextRouter } from "next/router";
import { CartItem } from "@/components/Common/types/common.types";
import { AllSearchItemsState } from "../../../../redux/reducers/searchItemsSlice";
import { Origin } from "@/components/Search/types/search.types";

export interface Creation {
  amount: string;
  title: string;
  tags: string[];
  pubId: string;
  prompt: string;
  profileId: string;
  mediaTypes: string[];
  profileHandle: string;
  printType: string;
  prices: string[];
  acceptedTokens: string[];
  owner: string;
  microbrandCover: string;
  microbrand: string;
  images: string[];
  video: string;
  audio: string;
  soldTokens: string;
  fulfillerPercent: string;
  fulfillerBase: string;
  fulfiller: string;
  designerPercent: string;
  dropId: string;
  dropCover: string;
  dropCollectionIds: string[];
  dropTitle: string;
  description: string;
  communities: string[];
  collectionId: string;
  access: string[];
  visibility: string;
  unlimited: boolean;
  colors: string[];
  sizes: string[];
  origin: string;
  profile: Profile;
  publication:
    | (Post & {
        decrypted: any;
      })
    | undefined;
  blockTimestamp: string;
}

export interface Publication {
  post?:
    | ((Post | Comment | Quote | Mirror) & {
        decrypted: any;
      })
    | Profile
    | Creation
    | Community;
  type: string;
  publishedOn?: string;
}

export type TilesProps = {
  handleMoreSearch: () => Promise<void>;
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  searchLoading: boolean;
  moreSearchLoading: boolean;
  searchActive: boolean;
  filtersOpen: boolean;

  searchItems: AllSearchItemsState | undefined;
  layoutAmount: number;
  popUpOpen: boolean[];
  setPopUpOpen: (e: SetStateAction<boolean[]>) => void;
  apparel: boolean[];
  setApparel: (e: SetStateAction<boolean[]>) => void;
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  cartItems: CartItem[];
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

  lensConnected: Profile | undefined;
};

export type TileSwitchProps = {
  type: string;
  publication: Publication;
  profileHovers: boolean[];
  lensConnected: Profile | undefined;
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
  like: (id: string, hasReacted: boolean) => Promise<void>;
  simpleCollect?: (id: string, type: string) => Promise<void>;
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

export type ControlsProps = {
  router: NextRouter;
  connected: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  mirror: (id: string) => Promise<void>;
  like: (id: string, hasReacted: boolean) => Promise<void>;
  collect: (id: string, type: string) => Promise<void>;
  dispatch: Dispatch<AnyAction>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    simpleCollect: boolean;
  };
  post: Post | Quote;
  videoInfo: {
    volume: number;
    volumeOpen: boolean;
    heart: boolean;
    isPlaying: boolean;
    duration: number;
    currentTime: number;
    isActive: boolean;
    loading: boolean;
  };
  setVideoInfo: (
    e: SetStateAction<{
      volume: number;
      volumeOpen: boolean;
      heart: boolean;
      isPlaying: boolean;
      duration: number;
      currentTime: number;
      isActive: boolean;
      loading: boolean;
    }>
  ) => void;
};

export type VideoPostProps = {
  lensConnected: Profile | undefined;
  dispatch: Dispatch<AnyAction>;
  layoutAmount: number;

  router: NextRouter;
  publication: Publication;
  mirror: (id: string) => Promise<void>;
  collect: (id: string, type: string) => Promise<void>;
  like: (id: string, hasReacted: boolean) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    simpleCollect: boolean;
  };
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
  like: (id: string, hasReacted: boolean) => Promise<void>;
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
  like: (id: string, hasReacted: boolean) => Promise<void>;
  lensConnected: Profile | undefined;
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
  like: (id: string, hasReacted: boolean) => Promise<void>;
  lensConnected: Profile | undefined;
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
  like: (id: string, hasReacted: boolean) => Promise<void>;
  simpleCollect: (id: string, type: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
  };
  lensConnected: Profile | undefined;
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
  like: (id: string, hasReacted: boolean) => Promise<void>;
  lensConnected: Profile | undefined;
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
  like: (id: string, hasReacted: boolean) => Promise<void>;
  lensConnected: Profile | undefined;
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
  Sleeve = "4",
  Crop = "5",
  NFTOnly = "6",
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
  lensConnected: Profile | undefined;
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
  lensConnected: Profile | undefined;
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
};

export interface FilterInput {
  access_contains?: String;
  communities_contains?: String;
  description_contains?: String;
  dropTitle_contains?: String;
  microbrand_contains?: String;
  printType_contains?: String;
  prompt_contains?: String;
  tags_contains?: String;
  title_contains?: String;
  visibility_contains?: String;
  mediaTypes_contains?: String;
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
  subTopic: string;
  description: string;
  cover: string;
  sample: Creation[];
  steward: Profile;
  validPrintTypes: PrintType[];
  validCreators: Profile[];
  validOrigins: Origin[];
  valid20Tokens: string[];
  valid20Thresholds: string[];
  members: Profile[];
}

export type CommunityProps = {
  community: Community;
  router: NextRouter;
  index: number;
  followProfile: (id: string) => Promise<void>;
  unfollowProfile: (id: string) => Promise<void>;
  followLoading: boolean[];
  dispatch: Dispatch<AnyAction>;
  profileHovers: boolean[];
  lensConnected: Profile | undefined;
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
};

export type LoadTileProps = {
  index: number;
};
