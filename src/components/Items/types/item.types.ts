import { OracleData } from "@/components/Checkout/types/checkout.types";
import { CartItem } from "@/components/Common/types/common.types";
import { FilterValues } from "@/components/Search/types/search.types";
import { Creation, Publication } from "@/components/Tiles/types/tiles.types";
import { NextRouter } from "next/router";
import { SetStateAction } from "react";
import { AnyAction, Dispatch } from "redux";
import { Profile, Comment } from "../../../../graphql/generated";
import { MakePostComment } from "@/components/Autograph/types/autograph.types";
import { PostCollectGifState } from "../../../../redux/reducers/postCollectGifSlice";

export type SwitchTypeProps = {
  itemData: Publication;
  isApprovedSpend: boolean;
  type: string;
  filterConstants: FilterValues | undefined;
  router: NextRouter;
  instantLoading: boolean;
  cartItems: CartItem[];
  dispatch: Dispatch<AnyAction>;
  oracleData: OracleData[];
  purchaseDetails: PurchaseDetails;
  setPurchaseDetails: (e: SetStateAction<PurchaseDetails>) => void;
  approveSpend: () => Promise<void>;
  handleInstantPurchase: () => Promise<void>;
  relatedCollections: Creation[] | undefined;
  lensConnected: Profile | undefined;
  mirror: (id: string, main: boolean) => Promise<void>;
  like: (id: string, main: boolean) => Promise<void>;
  mainInteractionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
  }[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  commentSwitch: boolean;
  setCommentSwitch: (e: SetStateAction<boolean>) => void;
  allComments: Comment[];
  comment: (id: string, main: boolean) => Promise<void>;
  handleMoreComments: () => Promise<void>;
  allCommentsLoading: boolean;
  hasMoreComments: boolean;
  openMoreOptions: boolean[];
  profileHovers: boolean[];
  setOpenMoreOptions: (e: SetStateAction<boolean[]>) => void;
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  simpleCollect: (id: string, type: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    bookmark: boolean;
    simpleCollect: boolean;
    hide: boolean;
  }[];
  followLoading: boolean[];
  unfollowProfile: (id: string) => Promise<void>;
  followProfile: (id: string) => Promise<void>;
  postCollectGif: PostCollectGifState;
  makeComment: MakePostComment[];
  setContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
  contentLoading: {
    image: boolean;
    video: boolean;
  }[];
  handleHidePost: (id: string, index: number) => Promise<void>;
  handleBookmark: (id: string, index: number) => Promise<void>;
  setMakeComment: (e: SetStateAction<MakePostComment[]>) => void;
  mainContentLoading: {
    image: boolean;
    video: boolean;
  }[];
  openMainMirrorChoice: boolean[];
  setMainOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  mainMakeComment: MakePostComment[];
  setMainMakeComment: (e: SetStateAction<MakePostComment[]>) => void;
  setMainContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
  commentsOpen: boolean[];
  setCommentsOpen: (e: SetStateAction<boolean[]>) => void;
};

export type ChromadinProps = {
  itemData: Creation;
  isApprovedSpend: boolean;
  type: string;
  filterConstants: FilterValues | undefined;
  router: NextRouter;
  instantLoading: boolean;
  cartItems: CartItem[];
  commentsOpen: boolean[];
  setCommentsOpen: (e: SetStateAction<boolean[]>) => void;
  makeComment: MakePostComment[];
  dispatch: Dispatch<AnyAction>;
  oracleData: OracleData[];
  purchaseDetails: PurchaseDetails;
  setPurchaseDetails: (e: SetStateAction<PurchaseDetails>) => void;
  approveSpend: () => Promise<void>;
  handleInstantPurchase: () => Promise<void>;
  lensConnected: Profile | undefined;
  mirror: (id: string, main: boolean) => Promise<void>;
  like: (id: string, main: boolean) => Promise<void>;
  mainInteractionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
  }[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  commentSwitch: boolean;
  setCommentSwitch: (e: SetStateAction<boolean>) => void;
  allComments: Comment[];
  comment: (id: string, main: boolean) => Promise<void>;
  handleMoreComments: () => Promise<void>;
  allCommentsLoading: boolean;
  hasMoreComments: boolean;
  openMoreOptions: boolean[];
  profileHovers: boolean[];
  setOpenMoreOptions: (e: SetStateAction<boolean[]>) => void;
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  simpleCollect: (id: string, type: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    bookmark: boolean;
    simpleCollect: boolean;
    hide: boolean;
  }[];
  followLoading: boolean[];
  unfollowProfile: (id: string) => Promise<void>;
  followProfile: (id: string) => Promise<void>;
  postCollectGif: PostCollectGifState;
  setContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
  contentLoading: {
    image: boolean;
    video: boolean;
  }[];
  handleHidePost: (id: string, index: number) => Promise<void>;
  handleBookmark: (id: string, index: number) => Promise<void>;
  setMakeComment: (e: SetStateAction<MakePostComment[]>) => void;
  mainContentLoading: {
    image: boolean;
    video: boolean;
  }[];
  openMainMirrorChoice: boolean[];
  setMainOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  mainMakeComment: MakePostComment[];
  setMainMakeComment: (e: SetStateAction<MakePostComment[]>) => void;
  setMainContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
};

export interface PurchaseDetails {
  currency: string;
  price: string;
  size: string;
  color: string;
  imageIndex: number;
}
