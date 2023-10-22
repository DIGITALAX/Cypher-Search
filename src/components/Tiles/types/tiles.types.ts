import { FormEvent, MouseEvent, Ref } from "react";
import { AnyAction, Dispatch } from "redux";
import { VideoSyncState } from "../../../../redux/reducers/videoSyncSlice";
import { PublicationMetadata } from "../../../../graphql/generated";
import { NextRouter } from "next/router";
import { CartItem, ItemType } from "@/components/Layout/types/footer.types";

export type TilesProps = {
  handleMoreSearch: () => Promise<void>;
  searchActive: boolean;
  layoutAmount: number;
  popUpOpen: boolean[];
  setPopUpOpen: (e: boolean[]) => void;
  apparel: boolean[];
  setApparel: (e: boolean[]) => void;
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  cartItems: CartItem[];
};

export type TileSwitchProps = {
  type: string;
  publication: PublicationMetadata;
  layoutAmount: number;
  popUpOpen: boolean[];
  setPopUpOpen: (e: boolean[]) => void;
  apparel: boolean[];
  setApparel: (e: boolean[]) => void;
  index: number;
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  cartItems: CartItem[];
};

export type ControlsProps = {
  currentIndex: number;
  videoSync: VideoSyncState;
  volume: number;
  volumeOpen: boolean;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: FormEvent) => void;
  handleHeart: () => void;
  mirrored: boolean;
  liked: boolean;
  mirrorVideo: () => Promise<void>;
  likeVideo: () => Promise<void>;
  commentVideo: () => Promise<void>;
  mirrorLoading: boolean;
  commentLoading: boolean;
  likeLoading: boolean;
  authStatus: boolean;
  profileId: string;
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
  commentAmount: number[];
  mirrorAmount: number[];
  likeAmount: number[];
  dispatch: Dispatch<AnyAction>;
};

export type VideoPostProps = {
  currentIndex: number;
  videoSync: VideoSyncState;
  volume: number;
  volumeOpen: boolean;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: FormEvent) => void;
  handleHeart: () => void;
  mirrored: boolean;
  liked: boolean;
  mirrorVideo: () => Promise<void>;
  likeVideo: () => Promise<void>;
  commentVideo: () => Promise<void>;
  mirrorLoading: boolean;
  commentLoading: boolean;
  likeLoading: boolean;
  authStatus: boolean;
  profileId: string;
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
  commentAmount: number[];
  mirrorAmount: number[];
  likeAmount: number[];
  dispatch: Dispatch<AnyAction>;
  layoutAmount: number;
  router: NextRouter;
  publication: PublicationMetadata;
};

export type LegendProps = {
  publication: PublicationMetadata;
  imageIndex: number[];
  milestoneCovers: string[];
  setImageIndex: (e: number[]) => void;
  index: number;
  commentGrant: (id: string) => Promise<void>;
  likeGrant: (id: string) => Promise<void>;
  mirrorGrant: (id: string) => Promise<void>;
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
  item: PublicationMetadata;
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
  publication: PublicationMetadata;
};

export type CoinOpProps = {
  layoutAmount: number;
  popUpOpen: boolean[];
  setPopUpOpen: (e: boolean[]) => void;
  index: number;
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  publication: PublicationMetadata;
  cartItems: CartItem[];
};

export type TextPostProps = {
  layoutAmount: number;
  router: NextRouter;
  publication: PublicationMetadata;
};

export type QuestProps = {
  layoutAmount: number;
  router: NextRouter;
  publication: PublicationMetadata;
};

export type ImagePostProps = {
  layoutAmount: number;
  router: NextRouter;
  publication: PublicationMetadata;
  dispatch: Dispatch<AnyAction>;
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
  publication: PublicationMetadata;
};
