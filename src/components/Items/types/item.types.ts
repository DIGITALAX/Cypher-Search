import { OracleData } from "@/components/Checkout/types/checkout.types";
import { CartItem } from "@/components/Common/types/common.types";
import { FilterValues, Quest } from "@/components/Search/types/search.types";
import {
  Catalogo,
  Coleccion,
  Creation,
  Publication,
} from "@/components/Tiles/types/tiles.types";
import { NextRouter } from "next/router";
import { ChangeEvent, SetStateAction } from "react";
import { AnyAction, Dispatch } from "redux";
import {
  Profile,
  Comment,
  Post,
  Quote,
  Mirror,
} from "../../../../graphql/generated";
import {
  Details,
  MakePostComment,
} from "@/components/Autograph/types/autograph.types";
import { PostCollectGifState } from "../../../../redux/reducers/postCollectGifSlice";
import { AllSearchItemsState } from "../../../../redux/reducers/searchItemsSlice";

export type SwitchTypeProps = {
  itemData: Publication;
  address: `0x${string}` | undefined;
  isApprovedSpend: boolean;
  details: Details;
  aprobado: boolean;
  compraCargando: boolean;
  manejarCompra: () => Promise<void>;
  aprobarGastos: () => Promise<void>;
  setDetails: (e: SetStateAction<Details>) => void;
  openDropdown: boolean;
  header: boolean;
  setOpenDropdown: (e: SetStateAction<boolean>) => void;
  type: string;
  hoverPrompt: boolean;
  setHoverPrompt: (e: SetStateAction<boolean>) => void;
  decryptLoading: boolean;
  allSearchItems: AllSearchItemsState;
  handleDecrypt: (post: Post | Comment | Quote) => Promise<void>;
  filterConstants: FilterValues | undefined;
  router: NextRouter;
  galleryFollowLoading: boolean[];
  caretCoord: {
    x: number;
    y: number;
  };
  setCaretCoord: (
    e: SetStateAction<{
      x: number;
      y: number;
    }>
  ) => void;
  setCaretCoordMain: (
    e: SetStateAction<{
      x: number;
      y: number;
    }>
  ) => void;
  profilesOpen: boolean[];
  mentionProfiles: Profile[];
  setMentionProfiles: (e: SetStateAction<Profile[]>) => void;
  setProfilesOpen: (e: SetStateAction<boolean[]>) => void;
  caretCoordMain: {
    x: number;
    y: number;
  };
  profilesOpenMain: boolean[];
  mentionProfilesMain: Profile[];
  setMentionProfilesMain: (e: SetStateAction<Profile[]>) => void;
  setProfilesOpenMain: (e: SetStateAction<boolean[]>) => void;
  cartItems: CartItem[];
  oracleData: OracleData[];
  instantLoading: boolean;
  dispatch: Dispatch<AnyAction>;
  purchaseDetails: PurchaseDetails;
  setPurchaseDetails: (e: SetStateAction<PurchaseDetails>) => void;
  approveSpend: () => Promise<void>;
  handleInstantPurchase: () => Promise<void>;
  relatedData:
    | {
        collections: Creation[];
        microbrand: [
          {
            microbrand: string;
            microbrandCover: string;
          }
        ];
      }
    | undefined;
  lensConnected: Profile | undefined;
  mirror: (id: string, main?: boolean) => Promise<void>;
  like: (id: string, hasReacted: boolean, main?: boolean) => Promise<void>;
  mainInteractionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    bookmark: boolean;
    simpleCollect: boolean;
    hide: boolean;
  }[];
  joinLoading: boolean;
  locale: "en" | "es";
  handlePlayerJoin: () => Promise<void>;
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  t: (key: string | number) => string;
  openMirrorChoice: boolean[];
  commentSwitch: boolean;
  setCommentSwitch: (e: SetStateAction<boolean>) => void;
  allComments: (Comment & {
    decrypted: any;
  })[];
  comment: (id: string, main: boolean) => Promise<void>;
  handleMoreComments: () => Promise<void>;
  allCommentsLoading: boolean;
  hasMoreComments: boolean;
  openMoreOptions: boolean[];
  profileHovers: boolean[];
  setOpenMoreOptions: (e: SetStateAction<boolean[]>) => void;
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  simpleCollect: (id: string, type: string, main: boolean) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    bookmark: boolean;
    simpleCollect: boolean;
    hide: boolean;
  }[];
  followLoading: boolean[];
  unfollowProfile: (id: string, index: number) => Promise<void>;
  followProfile: (id: string, index: number) => Promise<void>;
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
  handleHidePost: (id: string, index: number, main?: boolean) => Promise<void>;
  handleBookmark: (id: string, index: number, main?: boolean) => Promise<void>;
  setMakeComment: (e: SetStateAction<MakePostComment[]>) => void;
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
  mainContentLoading: {
    image: boolean;
    video: boolean;
  }[];
  commentsOpen: boolean[];
  setCommentsOpen: (e: SetStateAction<boolean[]>) => void;
  mainProfileHovers: boolean[];
  setMainProfileHovers: (e: SetStateAction<boolean[]>) => void;
  followMainLoading: boolean[];
  setMainOpenMoreOptions: (e: SetStateAction<boolean[]>) => void;
  openMainMoreOptions: boolean[];
  setOpenInteractions: (e: SetStateAction<boolean[]>) => void;
  openInteractions: boolean[];
};

export type ChromadinProps = {
  itemData: Creation;
  isApprovedSpend: boolean;
  type: string;
  hoverPrompt: boolean;
  setHoverPrompt: (e: SetStateAction<boolean>) => void;
  caretCoord: {
    x: number;
    y: number;
  };
  locale: "en" | "es";
  header: boolean;
  allSearchItems: AllSearchItemsState;
  setCaretCoord: (
    e: SetStateAction<{
      x: number;
      y: number;
    }>
  ) => void;
  setCaretCoordMain: (
    e: SetStateAction<{
      x: number;
      y: number;
    }>
  ) => void;
  profilesOpen: boolean[];
  mentionProfiles: Profile[];
  setMentionProfiles: (e: SetStateAction<Profile[]>) => void;
  setProfilesOpen: (e: SetStateAction<boolean[]>) => void;
  caretCoordMain: {
    x: number;
    y: number;
  };
  profilesOpenMain: boolean[];
  mentionProfilesMain: Profile[];
  setMentionProfilesMain: (e: SetStateAction<Profile[]>) => void;
  setProfilesOpenMain: (e: SetStateAction<boolean[]>) => void;
  decryptLoading: boolean;
  handleDecrypt: (post: Post | Comment | Quote) => Promise<void>;
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
  like: (id: string, hasReacted: boolean, main?: boolean) => Promise<void>;
  mainInteractionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    bookmark: boolean;
    simpleCollect: boolean;
    hide: boolean;
  }[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  commentSwitch: boolean;
  setCommentSwitch: (e: SetStateAction<boolean>) => void;
  allComments: (Comment & {
    decrypted: any;
  })[];
  comment: (id: string, main: boolean) => Promise<void>;
  handleMoreComments: () => Promise<void>;
  allCommentsLoading: boolean;
  hasMoreComments: boolean;
  openMoreOptions: boolean[];
  profileHovers: boolean[];
  setOpenMoreOptions: (e: SetStateAction<boolean[]>) => void;
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  simpleCollect: (id: string, type: string, main: boolean) => Promise<void>;
  t: (key: string | number) => string;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    bookmark: boolean;
    simpleCollect: boolean;
    hide: boolean;
  }[];
  followLoading: boolean[];
  unfollowProfile: (id: string, index: number) => Promise<void>;
  followProfile: (id: string, index: number) => Promise<void>;
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
  handleHidePost: (id: string, index: number, main?: boolean) => Promise<void>;
  handleBookmark: (id: string, index: number, main?: boolean) => Promise<void>;
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
  priceIndex: number;
}

export type PublicationProps = {
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  allComments: (Comment & {
    decrypted: any;
  })[];
  caretCoord: {
    x: number;
    y: number;
  };
  setCaretCoord: (
    e: SetStateAction<{
      x: number;
      y: number;
    }>
  ) => void;
  t: (key: string | number) => string;
  setCaretCoordMain: (
    e: SetStateAction<{
      x: number;
      y: number;
    }>
  ) => void;
  header: boolean;
  profilesOpen: boolean[];
  mentionProfiles: Profile[];
  setMentionProfiles: (e: SetStateAction<Profile[]>) => void;
  setProfilesOpen: (e: SetStateAction<boolean[]>) => void;
  caretCoordMain: {
    x: number;
    y: number;
  };
  profilesOpenMain: boolean[];
  mentionProfilesMain: Profile[];
  setMentionProfilesMain: (e: SetStateAction<Profile[]>) => void;
  setProfilesOpenMain: (e: SetStateAction<boolean[]>) => void;
  decryptLoading: boolean;
  handleDecrypt: (post: Post | Comment | Quote) => Promise<void>;
  allCommentsLoading: boolean;
  lensConnected: Profile | undefined;
  followLoading: boolean[];
  setMakeComment: (e: SetStateAction<MakePostComment[]>) => void;
  itemData: (Post | Comment | Quote | Mirror) & {
    decrypted: any;
  };
  mainMakeComment: MakePostComment[];
  postCollectGif: PostCollectGifState;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    simpleCollect: boolean;
    bookmark: boolean;
    hide: boolean;
  }[];
  locale: "en" | "es";
  setMainMakeComment: (e: SetStateAction<MakePostComment[]>) => void;
  setMainContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
  mainContentLoading: {
    image: boolean;
    video: boolean;
  }[];
  comment: (id: string, main: boolean) => Promise<void>;
  mirror: (id: string, main: boolean) => Promise<void>;
  like: (id: string, hasReacted: boolean, main?: boolean) => Promise<void>;
  handleMoreComments: () => Promise<void>;
  hasMoreComments: boolean;
  mainInteractionsLoading:
    | {
        like: boolean;
        mirror: boolean;
        comment: boolean;
        simpleCollect: boolean;
        bookmark: boolean;
        hide: boolean;
      }[]
    | undefined;
  mainProfileHovers: boolean[];
  setMainProfileHovers: (e: SetStateAction<boolean[]>) => void;
  openMainMirrorChoice: boolean[];
  setMainOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  simpleCollect: (id: string, type: string, main: boolean) => Promise<void>;
  followMainLoading: boolean[];
  followProfile: (id: string, index: number) => Promise<void>;
  unfollowProfile: (id: string, index: number) => Promise<void>;
  setMainOpenMoreOptions: (e: SetStateAction<boolean[]>) => void;
  openMainMoreOptions: boolean[];
  handleBookmark: (id: string, index: number, main: boolean) => Promise<void>;
  handleHidePost: (id: string, index: number, main: boolean) => Promise<void>;
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  setCommentsOpen: (e: SetStateAction<boolean[]>) => void;
  commentsOpen: boolean[];
  openMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  setOpenMoreOptions: (e: SetStateAction<boolean[]>) => void;
  openMoreOptions: boolean[];
  contentLoading: { image: boolean; video: boolean }[];
  setContentLoading: (
    e: SetStateAction<{ image: boolean; video: boolean }[]>
  ) => void;
  makeComment: MakePostComment[];
};

export type MicrobrandProps = {
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  itemData: Profile;
  header: boolean
  lensConnected: Profile | undefined;
  t: (key: string | number) => string;
  relatedData:
    | {
        collections: Creation[];
        microbrand: [
          {
            microbrand: string;
            microbrandCover: string;
          }
        ];
      }
    | undefined;
  cartItems: CartItem[];
  mirror: (id: string) => Promise<void>;
  like: (id: string, hasReacted: boolean, main?: boolean) => Promise<void>;
  openMirrorChoice: boolean[];
  locale: "en" | "es";
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    bookmark: boolean;
    hide: boolean;
  }[];
  openInteractions: boolean[];
  setOpenInteractions: (e: SetStateAction<boolean[]>) => void;
  followProfile: (id: string, index: number) => Promise<void>;
  unfollowProfile: (id: string, index: number) => Promise<void>;
  followLoading: boolean[];
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
};

export type KinoraProps = {
  itemData: Quest;
  caretCoord: {
    x: number;
    y: number;
  };
  setCaretCoord: (
    e: SetStateAction<{
      x: number;
      y: number;
    }>
  ) => void;
  setCaretCoordMain: (
    e: SetStateAction<{
      x: number;
      y: number;
    }>
  ) => void;
  profilesOpen: boolean[];
  mentionProfiles: Profile[];
  setMentionProfiles: (e: SetStateAction<Profile[]>) => void;
  setProfilesOpen: (e: SetStateAction<boolean[]>) => void;
  caretCoordMain: {
    x: number;
    y: number;
  };
  profilesOpenMain: boolean[];
  mentionProfilesMain: Profile[];
  setMentionProfilesMain: (e: SetStateAction<Profile[]>) => void;
  setProfilesOpenMain: (e: SetStateAction<boolean[]>) => void;
  router: NextRouter;
  commentsOpen: boolean[];
  locale: "en" | "es";
  setCommentsOpen: (e: SetStateAction<boolean[]>) => void;
  makeComment: MakePostComment[];
  dispatch: Dispatch<AnyAction>;
  lensConnected: Profile | undefined;
  mirror: (id: string, main: boolean) => Promise<void>;
  like: (id: string, hasReacted: boolean, main?: boolean) => Promise<void>;
  mainInteractionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    bookmark: boolean;
    simpleCollect: boolean;
    hide: boolean;
  }[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  commentSwitch: boolean;
  setCommentSwitch: (e: SetStateAction<boolean>) => void;
  allComments: (Comment & {
    decrypted: any;
  })[];
  comment: (id: string, main: boolean) => Promise<void>;
  handleMoreComments: () => Promise<void>;
  allCommentsLoading: boolean;
  hasMoreComments: boolean;
  openMoreOptions: boolean[];
  profileHovers: boolean[];
  setOpenMoreOptions: (e: SetStateAction<boolean[]>) => void;
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  simpleCollect: (id: string, type: string, main: boolean) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    bookmark: boolean;
    simpleCollect: boolean;
    hide: boolean;
  }[];
  followLoading: boolean[];
  unfollowProfile: (id: string, index: number) => Promise<void>;
  followProfile: (id: string, index: number) => Promise<void>;
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
  handleBookmark: (id: string, index: number, main?: boolean) => Promise<void>;
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
  handleHidePost: (id: string, index: number, main?: boolean) => Promise<void>;
  joinLoading: boolean;
  handlePlayerJoin: () => Promise<void>;
  purchaseDetails: PurchaseDetails;
  header: boolean;
  setPurchaseDetails: (e: SetStateAction<PurchaseDetails>) => void;
  t: (key: string | number) => string;
};

export type AutografoProps = {
  oracleData: OracleData[];
  router: NextRouter;
  instantLoading: boolean;
  isApprovedSpend: boolean;
  purchaseDetails: PurchaseDetails;
  setPurchaseDetails: (e: SetStateAction<PurchaseDetails>) => void;
  approveSpend: () => Promise<void>;
  itemData: Coleccion;
  handleInstantPurchase: () => Promise<void>;
  t: (key: string | number) => string;
  address: `0x${string}` | undefined;
  details: Details;
  setDetails: (e: SetStateAction<Details>) => void;
  openDropdown: boolean;
  setOpenDropdown: (e: SetStateAction<boolean>) => void;
  dispatch: Dispatch;
  header: boolean;
  allSearchItems: AllSearchItemsState;
};

export type CatalogoProps = {
  oracleData: OracleData[];
  instantLoading: boolean;
  isApprovedSpend: boolean;
  purchaseDetails: PurchaseDetails;
  setPurchaseDetails: (e: SetStateAction<PurchaseDetails>) => void;
  approveSpend: () => Promise<void>;
  itemData: Catalogo;
  handleInstantPurchase: () => Promise<void>;
  t: (key: string | number) => string;
  address: `0x${string}` | undefined;
  details: Details;
  setDetails: (e: SetStateAction<Details>) => void;
  openDropdown: boolean;
  header: boolean;
  setOpenDropdown: (e: SetStateAction<boolean>) => void;
};
