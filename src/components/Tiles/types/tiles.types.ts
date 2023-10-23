import { FormEvent, MouseEvent, Ref } from "react";
import { AnyAction, Dispatch } from "redux";
import { VideoSyncState } from "../../../../redux/reducers/videoSyncSlice";
import { Post } from "../../../../graphql/generated";
import { NextRouter } from "next/router";
import { CartItem } from "@/components/Layout/types/footer.types";

export type TilesProps = {
  handleMoreSearch: () => Promise<void>;
  searchActive: boolean;
  filtersOpen: boolean;
  layoutAmount: number;
  popUpOpen: boolean[];
  setPopUpOpen: (e: boolean[]) => void;
  apparel: boolean[];
  setApparel: (e: boolean[]) => void;
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  cartItems: CartItem[];
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  comment: (id: string) => Promise<void>;
  quote: (id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    quote: boolean;
    comment: boolean;
  }[];
  setOpenMirrorChoice: (e: boolean[]) => void;
  openMirrorChoice: boolean[];
};

export type TileSwitchProps = {
  type: string;
  publication: Post;
  layoutAmount: number;
  popUpOpen: boolean[];
  setPopUpOpen: (e: boolean[]) => void;
  apparel: boolean[];
  setApparel: (e: boolean[]) => void;
  index: number;
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  cartItems: CartItem[];
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  comment: (id: string) => Promise<void>;
  quote: (id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    quote: boolean;
    comment: boolean;
  }[];
  setOpenMirrorChoice: (e: boolean[]) => void;
  openMirrorChoice: boolean[];
  profileId: string;
  volume: number;
  volumeOpen: boolean;
  setVolumeOpen: (e: boolean) => void;
  videoSync: VideoSyncState;
  handleVolumeChange: (e: FormEvent) => void;
  handleHeart: () => void;
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
};

export type ControlsProps = {
  videoSync: VideoSyncState;
  volume: number;
  volumeOpen: boolean;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: FormEvent) => void;
  handleHeart: () => void;
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  comment: (id: string) => Promise<void>;
  quote: (id: string) => Promise<void>;
  profileId: string;
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
  dispatch: Dispatch<AnyAction>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    quote: boolean;
    comment: boolean;
  };
  publication: Post;
};

export type VideoPostProps = {
  videoSync: VideoSyncState;
  volume: number;
  volumeOpen: boolean;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: FormEvent) => void;
  handleHeart: () => void;
  profileId: string;
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
  dispatch: Dispatch<AnyAction>;
  layoutAmount: number;
  router: NextRouter;
  publication: Post;
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  comment: (id: string) => Promise<void>;
  quote: (id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    quote: boolean;
    comment: boolean;
  };
  setOpenMirrorChoice: (e: boolean[]) => void;
  openMirrorChoice: boolean[];
};

export type LegendProps = {
  publication: Post;
  imageIndex: number[];
  milestoneCovers: string[];
  setImageIndex: (e: number[]) => void;
  index: number;
  setCollectChoice: (e: { color: string; size: string }[]) => void;
  collectChoice: {
    color: string;
    size: string;
  }[];
  cartItems: CartItem[];
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  showComments: (id: string) => Promise<void>;
  showLikes: (id: string) => Promise<void>;
  showMirrors: (id: string) => Promise<void>;
  layoutAmount: number;
  popUpOpen: boolean[];
  setPopUpOpen: (e: boolean[]) => void;
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  comment: (id: string) => Promise<void>;
  quote: (id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    quote: boolean;
    comment: boolean;
  };
  setOpenMirrorChoice: (e: boolean[]) => void;
  openMirrorChoice: boolean[];
};

export type CollectItemProps = {
  index: number;
  router: NextRouter;
  setCollectChoice: (e: { color: string; size: string }[]) => void;
  collectChoice: {
    color: string;
    size: string;
  }[];
  cartItems: CartItem[];
  dispatch: Dispatch<AnyAction>;
  item: Post;
};

export type ChromadinProps = {
  layoutAmount: number;
  apparel: boolean[];
  setApparel: (e: boolean[]) => void;
  index: number;
  popUpOpen: boolean[];
  setPopUpOpen: (e: boolean[]) => void;
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  cartItems: CartItem[];
  publication: Post;
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  comment: (id: string) => Promise<void>;
  quote: (id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    quote: boolean;
    comment: boolean;
  };
  setOpenMirrorChoice: (e: boolean[]) => void;
  openMirrorChoice: boolean[];
};

export type CoinOpProps = {
  layoutAmount: number;
  popUpOpen: boolean[];
  setPopUpOpen: (e: boolean[]) => void;
  index: number;
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  publication: Post;
  cartItems: CartItem[];
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  comment: (id: string) => Promise<void>;
  quote: (id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    quote: boolean;
    comment: boolean;
  };
  setOpenMirrorChoice: (e: boolean[]) => void;
  openMirrorChoice: boolean[];
};

export type TextPostProps = {
  layoutAmount: number;
  router: NextRouter;
  publication: Post;
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  comment: (id: string) => Promise<void>;
  quote: (id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    quote: boolean;
    comment: boolean;
  };
  setOpenMirrorChoice: (e: boolean[]) => void;
  openMirrorChoice: boolean[];
  index: number;
};

export type QuestProps = {
  layoutAmount: number;
  router: NextRouter;
  publication: Post;
};

export type ImagePostProps = {
  layoutAmount: number;
  router: NextRouter;
  publication: Post;
  dispatch: Dispatch<AnyAction>;
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  comment: (id: string) => Promise<void>;
  quote: (id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    quote: boolean;
    comment: boolean;
  };
  setOpenMirrorChoice: (e: boolean[]) => void;
  openMirrorChoice: boolean[];
  index: number;
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
  apparel: boolean[];
  setApparel: (e: boolean[]) => void;
  index: number;
  popUpOpen: boolean[];
  setPopUpOpen: (e: boolean[]) => void;
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  cartItems: CartItem[];
  publication: Post;
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  comment: (id: string) => Promise<void>;
  quote: (id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    quote: boolean;
    comment: boolean;
  };
  setOpenMirrorChoice: (e: boolean[]) => void;
  openMirrorChoice: boolean[];
};
