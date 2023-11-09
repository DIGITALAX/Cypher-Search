import { NextRouter } from "next/router";
import {
  Post,
  Profile,
  Quote,
  Mirror,
  Comment,
  ProfileMetadata,
  Erc20,
  SimpleCollectOpenActionModuleInput,
  PrimaryPublication,
} from "../../../../graphql/generated";
import { Creation } from "@/components/Tiles/types/tiles.types";
import { ChangeEvent, SetStateAction } from "react";
import { AnyAction, Dispatch } from "redux";
import { CartItem } from "@/components/Common/types/common.types";

export type WebProps = {
  router: NextRouter;
  profile: Profile | undefined;
  dispatch: Dispatch<AnyAction>;
  availableCurrencies: Erc20[];
  setSettingsData: (e: SetStateAction<ProfileMetadata>) => void;
  settingsData: ProfileMetadata;
  setGifCollectOpen: (
    e: SetStateAction<{ gif: boolean; collect: boolean }[]>
  ) => void;
  gifCollectOpen: { gif: boolean; collect: boolean }[];
  setGifCollectOpenBookmarks: (
    e: SetStateAction<{ gif: boolean; collect: boolean }[]>
  ) => void;
  gifCollectOpenBookmarks: { gif: boolean; collect: boolean }[];
  handleSettingsUpdate: () => Promise<void>;
  settingsUpdateLoading: boolean;
  handleShuffleSearch: () => void;
  openConnectModal: (() => void) | undefined;
  openAccountModal: (() => void) | undefined;
  handleLensConnect: () => Promise<void>;
  lensConnected: Profile | undefined;
  walletConnected: boolean;
  screenDisplay: ScreenDisplay;
  sortType: SortType;
  setSortType: (e: SetStateAction<SortType>) => void;
  mirror: (index: number, id: string) => Promise<void>;
  like: (index: number, id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    bookmark: boolean;
    hide: boolean;
  }[];
  handleSetDisplay: () => void;
  displayLoading: boolean;
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  gallery:
    | {
        collected: Creation[];
        created: Creation[];
      }
    | undefined;
  display: Display | undefined;
  handleImage: (e: ChangeEvent<HTMLInputElement>, id: string) => Promise<void>;
  coverImage: string | undefined;
  pfpImage: string | undefined;
  followUpdateLoading: boolean;
  handleFollowUpdate: () => Promise<void>;
  followData: {
    type: "FreeFollowModule" | "FeeFollowModule" | "RevertFollowModule";
    value: string | undefined;
    currency: Erc20 | undefined;
  };
  setFollowData: (
    e: SetStateAction<{
      type: "FreeFollowModule" | "FeeFollowModule" | "RevertFollowModule";
      value: string | undefined;
      currency: Erc20 | undefined;
    }>
  ) => void;
  openType: boolean;
  setOpenType: (e: SetStateAction<boolean>) => void;
  currencies: Erc20[];
  setCurrencyOpen: (e: SetStateAction<boolean>) => void;
  currencyOpen: boolean;
  interactionsLoadingBookmark: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    bookmark: boolean;
    simpleCollect: boolean;
    hide: boolean;
  }[];
  hasMoreBookmarks: boolean;
  simpleCollect: (id: string, type: string) => Promise<void>;
  handleMoreBookmarks: () => Promise<void>;
  handleBookmark: (id: string, index: number) => Promise<void>;
  handleHidePost: (id: string, index: number) => Promise<void>;
  bookmarks: (Post | Mirror | Comment | Quote)[];
  bookmarksLoading: boolean;
  mirrorBookmark: (id: string) => Promise<void>;
  likeBookmark: (id: string) => Promise<void>;
  comment: (id: string) => Promise<void>;
  setOpenMirrorChoiceBookmark: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoiceBookmark: boolean[];
  unfollowProfile: (id: string) => Promise<void>;
  followProfile: (id: string) => Promise<void>;
  openMoreOptions: boolean[];
  profileHovers: boolean[];
  setOpenMoreOptions: (e: SetStateAction<boolean[]>) => void;
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  followLoading: boolean[];
  commentsOpen: boolean[];
  setCommentsOpen: (e: SetStateAction<boolean[]>) => void;
  makeComment: MakePostComment[];
  setMakeComment: (e: SetStateAction<MakePostComment[]>) => void;
  makePost: MakePostComment[];
  post: () => Promise<void>;
  setMakePost: (e: SetStateAction<MakePostComment[]>) => void;
  postLoading: boolean[];
  commentContentLoading: {
    image: boolean;
    video: boolean;
    gif: boolean;
  }[];
  postContentLoading: {
    image: boolean;
    video: boolean;
    gif: boolean;
  }[];
  setCommentContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
        gif: boolean;
      }[]
    >
  ) => void;
  setPostContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
        gif: boolean;
      }[]
    >
  ) => void;
};

export type BookmarksProps = {
  bookmarks: (Post | Mirror | Comment | Quote)[];
  bookmarksLoading: boolean;
  hasMoreBookmarks: boolean;
  availableCurrencies: Erc20[];
  setGifCollectOpen: (
    e: SetStateAction<{ gif: boolean; collect: boolean }[]>
  ) => void;
  gifCollectOpen: { gif: boolean; collect: boolean }[];
  commentsOpen: boolean[];
  setContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
        gif: boolean;
      }[]
    >
  ) => void;
  contentLoading: {
    image: boolean;
    video: boolean;
    gif: boolean;
  }[];
  setCommentsOpen: (e: SetStateAction<boolean[]>) => void;
  makeComment: MakePostComment[];
  setMakeComment: (e: SetStateAction<MakePostComment[]>) => void;
  simpleCollect: (id: string, type: string) => Promise<void>;
  handleMoreBookmarks: () => Promise<void>;
  handleBookmark: (id: string, index: number) => Promise<void>;
  handleHidePost: (id: string, index: number) => Promise<void>;
  mirror: (id: string) => Promise<void>;
  comment: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    bookmark: boolean;
    comment: boolean;
    hide: boolean;
    simpleCollect: boolean;
  }[];
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  openMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  unfollowProfile: (id: string) => Promise<void>;
  followProfile: (id: string) => Promise<void>;
  followLoading: boolean[];
  setOpenMoreOptions: (e: SetStateAction<boolean[]>) => void;
  openMoreOptions: boolean[];
};

export enum ScreenDisplay {
  Display,
  Gallery,
  Circuits,
  Bookmarks,
  Post,
  Orders,
  Settings,
}

export enum SortType {
  Community,
  Private,
  Public,
}

export type BioProps = {
  profile: Profile | undefined;
  dispatch: Dispatch<AnyAction>;
};

export type GalleryScreenProps = {
  activeGallery: Creation[] | undefined;
  gallery:
    | {
        collected: Creation[];
        created: Creation[];
      }
    | undefined;
};

export type ScreenSwitchProps = {
  screenDisplay: ScreenDisplay;
  bookmarks: (Post | Mirror | Comment | Quote)[];
  bookmarksLoading: boolean;
  setGifCollectOpenBookmarks: (
    e: SetStateAction<{ gif: boolean; collect: boolean }[]>
  ) => void;
  availableCurrencies: Erc20[];
  gifCollectOpenBookmarks: { gif: boolean; collect: boolean }[];
  setGifCollectOpen: (
    e: SetStateAction<{ gif: boolean; collect: boolean }[]>
  ) => void;
  gifCollectOpen: { gif: boolean; collect: boolean }[];
  simpleCollect: (id: string, type: string) => Promise<void>;
  handleBookmark: (id: string, index: number) => Promise<void>;
  handleHidePost: (id: string, index: number) => Promise<void>;
  handleMoreBookmarks: () => Promise<void>;
  commentsOpen: boolean[];
  setCommentsOpen: (e: SetStateAction<boolean[]>) => void;
  makeComment: MakePostComment[];
  setMakeComment: (e: SetStateAction<MakePostComment[]>) => void;
  dispatch: Dispatch<AnyAction>;
  owner: boolean;
  interactionsLoadingBookmark: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    bookmark: boolean;
    simpleCollect: boolean;
    hide: boolean;
  }[];
  hasMoreBookmarks: boolean;
  handleSetDisplay: () => void;
  displayLoading: boolean;
  mirror: (index: number, id: string) => Promise<void>;
  like: (index: number, id: string) => Promise<void>;
  setSettingsData: (e: SetStateAction<ProfileMetadata>) => void;
  settingsData: ProfileMetadata;
  handleSettingsUpdate: () => Promise<void>;
  settingsUpdateLoading: boolean;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    bookmark: boolean;
    hide: boolean;
  }[];
  makePost: MakePostComment[];
  post: () => Promise<void>;
  setMakePost: (e: SetStateAction<MakePostComment[]>) => void;
  postLoading: boolean[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  sortType: SortType;
  gallery:
    | {
        collected: Creation[];
        created: Creation[];
      }
    | undefined;
  display: Display | undefined;
  handleImage: (e: ChangeEvent<HTMLInputElement>, id: string) => Promise<void>;
  coverImage: string | undefined;
  pfpImage: string | undefined;
  followUpdateLoading: boolean;
  handleFollowUpdate: () => Promise<void>;
  followData: {
    type: "FreeFollowModule" | "FeeFollowModule" | "RevertFollowModule";
    value: string | undefined;
    currency: Erc20 | undefined;
  };
  setFollowData: (
    e: SetStateAction<{
      type: "FreeFollowModule" | "FeeFollowModule" | "RevertFollowModule";
      value: string | undefined;
      currency: Erc20 | undefined;
    }>
  ) => void;
  openType: boolean;
  setOpenType: (e: SetStateAction<boolean>) => void;
  currencies: Erc20[];
  setCurrencyOpen: (e: SetStateAction<boolean>) => void;
  currencyOpen: boolean;
  mirrorBookmark: (id: string) => Promise<void>;
  likeBookmark: (id: string) => Promise<void>;
  comment: (id: string) => Promise<void>;
  setOpenMirrorChoiceBookmark: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoiceBookmark: boolean[];
  unfollowProfile: (id: string) => Promise<void>;
  followProfile: (id: string) => Promise<void>;
  openMoreOptions: boolean[];
  profileHovers: boolean[];
  setOpenMoreOptions: (e: SetStateAction<boolean[]>) => void;
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  followLoading: boolean[];
  router: NextRouter;
  setPostContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
        gif: boolean;
      }[]
    >
  ) => void;
  postContentLoading: {
    image: boolean;
    video: boolean;
    gif: boolean;
  }[];
  setCommentContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
        gif: boolean;
      }[]
    >
  ) => void;
  commentContentLoading: {
    image: boolean;
    video: boolean;
    gif: boolean;
  }[];
};

export type SettingsProps = {
  setSettingsData: (e: SetStateAction<ProfileMetadata>) => void;
  settingsData: ProfileMetadata;
  handleSettingsUpdate: () => Promise<void>;
  settingsUpdateLoading: boolean;
  handleImage: (e: ChangeEvent<HTMLInputElement>, id: string) => Promise<void>;
  coverImage: string | undefined;
  pfpImage: string | undefined;
  followUpdateLoading: boolean;
  handleFollowUpdate: () => Promise<void>;
  followData: {
    type: "FreeFollowModule" | "FeeFollowModule" | "RevertFollowModule";
    value: string | undefined;
    currency: Erc20 | undefined;
  };
  setFollowData: (
    e: SetStateAction<{
      type: "FreeFollowModule" | "FeeFollowModule" | "RevertFollowModule";
      value: string | undefined;
      currency: Erc20 | undefined;
    }>
  ) => void;
  openType: boolean;
  setOpenType: (e: SetStateAction<boolean>) => void;
  currencies: Erc20[];
  setCurrencyOpen: (e: SetStateAction<boolean>) => void;
  currencyOpen: boolean;
};

export type DisplayProps = {
  mirror: (index: number, id: string) => Promise<void>;
  like: (index: number, id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    bookmark: boolean;
    hide: boolean;
  }[];
  router: NextRouter;
  owner: boolean;
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  sortType: SortType;
  display: Display | undefined;
  dispatch: Dispatch<AnyAction>;
  handleSetDisplay: () => void;
  displayLoading: boolean;
};

export interface CypherProfileData {
  display: Display;
  gallery: {
    private: Creation[];
    community: Creation[];
    public: Creation[];
  };
}

export interface Display {
  private?: {
    main?: Creation;
    side?: Creation[];
  };
  community?: {
    main?: Creation;
    side?: Creation[];
  };
  public?: {
    main?: Creation;
    side?: Creation[];
  };
}

export type PostProps = {
  item: Post | Quote | Mirror | Comment;
};

export type FeedProps = {
  profileFeed: (Post | Quote | Mirror)[];
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  comment: (id: string) => Promise<void>;
  availableCurrencies: Erc20[];
  commentsOpen: boolean[];
  setGifCollectOpen: (
    e: SetStateAction<{ gif: boolean; collect: boolean }[]>
  ) => void;
  gifCollectOpen: { gif: boolean; collect: boolean }[];
  setContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
        gif: boolean;
      }[]
    >
  ) => void;
  contentLoading: {
    image: boolean;
    video: boolean;
    gif: boolean;
  }[];
  setCommentsOpen: (e: SetStateAction<boolean[]>) => void;
  makeComment: MakePostComment[];
  setMakeComment: (e: SetStateAction<MakePostComment[]>) => void;
  openMoreOptions: boolean[];
  hasMoreFeed: boolean;
  setOpenMoreOptions: (e: SetStateAction<boolean[]>) => void;
  simpleCollect: (id: string, type: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    simpleCollect: boolean;
    bookmark: boolean;
    hide: boolean;
  }[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  getMoreFeed: () => Promise<void>;
  router: NextRouter;
  followLoading: boolean[];
  unfollowProfile: (id: string, feed?: boolean) => Promise<void>;
  followProfile: (id: string, feed?: boolean) => Promise<void>;
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  dispatch: Dispatch<AnyAction>;
  handleBookmark: (id: string, index: number) => Promise<void>;
  handleHidePost: (id: string, index: number) => Promise<void>;
};

export type GalleryProps = {
  gallery:
    | {
        collected: Creation[];
        created: Creation[];
      }
    | undefined;
  cartItems: CartItem[];
  dispatch: Dispatch<AnyAction>;
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    bookmark: boolean;
    hide: boolean;
  }[];
  followLoading: boolean[];
  unfollowProfile: (id: string, feed?: boolean) => Promise<void>;
  followProfile: (id: string, feed?: boolean) => Promise<void>;
  router: NextRouter;
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  optionsOpen: boolean;
  setOptionsOpen: (e: SetStateAction<boolean>) => void;
  selectedOption: string;
  handleOptionSelect: (e: string) => void;
  getMoreGallery: () => Promise<void>;
  openInteractions: boolean[];
  setOpenInteractions: (e: SetStateAction<boolean[]>) => void;
};

export type CircuitsProps = {
  gallery:
    | {
        collected: Creation[];
        created: Creation[];
      }
    | undefined;
};

export type CreationProps = {
  item: Creation;
  index: number;
  dispatch: Dispatch<AnyAction>;
  followLoading: boolean[];
  unfollowProfile: (id: string) => Promise<void>;
  followProfile: (id: string) => Promise<void>;
  router: NextRouter;
  cartItems: CartItem[];
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  created: boolean;
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  openInteractions: boolean[];
  setOpenInteractions: (e: SetStateAction<boolean[]>) => void;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;

    bookmark: boolean;

    hide: boolean;
  };
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
};

export type PostBarProps = {
  index: number;
  mirror?: (id: string) => Promise<void>;
  like?: (id: string) => Promise<void>;
  simpleCollect?: (id: string, type: string) => Promise<void>;
  handleBookmark?: (id: string, index: number) => Promise<void>;
  handleHidePost?: (id: string, index: number) => Promise<void>;
  item: Post | Quote | Mirror | Comment;
  setOpenMirrorChoice?: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice?: boolean[];
  openMoreOptions?: boolean[];
  commentsOpen: boolean[];
  setCommentsOpen: (e: SetStateAction<boolean[]>) => void;
  disabled?: boolean;
  setOpenMoreOptions?: (e: SetStateAction<boolean[]>) => void;
  interactionsLoading?: {
    like: boolean;
    mirror: boolean;

    simpleCollect: boolean;
    bookmark: boolean;
    hide: boolean;
  };
  router: NextRouter;
  setProfileHovers?: (e: SetStateAction<boolean[]>) => void;
  profileHovers?: boolean[];
  followLoading?: boolean[];
  unfollowProfile?: (id: string) => Promise<void>;
  followProfile?: (id: string) => Promise<void>;
  dispatch: Dispatch<AnyAction>;
};

export type TextProps = {
  item: Post | Quote | Mirror | Comment;
};

export type PostQuoteProps = {
  quote: PrimaryPublication;
};

export type PublicationProps = {
  item: Post | Mirror | Quote | Comment;
  index: number;
  disabled?: boolean;
  setGifCollectOpen?: (
    e: SetStateAction<{ gif: boolean; collect: boolean }[]>
  ) => void;
  availableCurrencies?: Erc20[];
  gifCollectOpen?: { gif: boolean; collect: boolean }[];
  mirror?: (id: string) => Promise<void>;
  like?: (id: string) => Promise<void>;
  comment?: (id: string) => Promise<void>;
  commentsOpen?: boolean[];
  setCommentsOpen?: (e: SetStateAction<boolean[]>) => void;
  makeComment?: MakePostComment[];
  setMakePostComment?: (e: SetStateAction<MakePostComment[]>) => void;
  openMoreOptions?: boolean[];
  setOpenMoreOptions?: (e: SetStateAction<boolean[]>) => void;
  simpleCollect?: (id: string, type: string) => Promise<void>;
  interactionsLoading?: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    simpleCollect: boolean;
    bookmark: boolean;
    hide: boolean;
  }[];
  setOpenMirrorChoice?: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice?: boolean[];
  router: NextRouter;
  followLoading?: boolean[];
  unfollowProfile?: (id: string, feed?: boolean) => Promise<void>;
  followProfile?: (id: string, feed?: boolean) => Promise<void>;
  profileHovers?: boolean[];
  setProfileHovers?: (e: SetStateAction<boolean[]>) => void;
  dispatch: Dispatch<AnyAction>;
  handleBookmark?: (id: string, index: number) => Promise<void>;
  handleHidePost?: (id: string, index: number) => Promise<void>;
  setContentLoading?: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
        gif: boolean;
      }[]
    >
  ) => void;
  contentLoading?: {
    image: boolean;
    video: boolean;
    gif: boolean;
  }[];
};

export interface MakePostComment {
  collectType: SimpleCollectOpenActionModuleInput | undefined;
  content: string | undefined;
  images: string[];
  videos: string[];
  gifs: string[];
  searchedGifs: string[];
  search: string;
  collectibleOpen: boolean;
  collectible: string;
  award: string;
  whoCollectsOpen: boolean;
  creatorAwardOpen: boolean;
  currencyOpen: boolean;
}

export type PostCommentProps = {
  makePostComment: MakePostComment;
  availableCurrencies: Erc20[];
  setMakePostComment: (e: SetStateAction<MakePostComment[]>) => void;
  commentPost: ((id: string) => Promise<void>) | (() => Promise<void>);
  commentPostLoading: boolean;
  id?: string;
  height: string;
  top: string;
  imageHeight: string;
  imageWidth: string;
  gifCollectOpen: { gif: boolean; collect: boolean };
  setGifCollectOpen: (
    e: SetStateAction<{ gif: boolean; collect: boolean }[]>
  ) => void;
  setContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
        gif: boolean;
      }[]
    >
  ) => void;
  contentLoading: {
    image: boolean;
    video: boolean;
    gif: boolean;
  };
  index: number;
};

export type ScreenPostProps = {
  makePost: MakePostComment[];
  post: () => Promise<void>;
  availableCurrencies: Erc20[];
  setMakePost: (e: SetStateAction<MakePostComment[]>) => void;
  postLoading: boolean[];
  setGifCollectOpen: (
    e: SetStateAction<{ gif: boolean; collect: boolean }[]>
  ) => void;
  gifCollectOpen: { gif: boolean; collect: boolean }[];
  setContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
        gif: boolean;
      }[]
    >
  ) => void;
  contentLoading: {
    image: boolean;
    video: boolean;
    gif: boolean;
  }[];
};

export type CollectOptionsProps = {
  top: string;
  makePostComent: MakePostComment;
  setMakePostComment: (e: SetStateAction<MakePostComment[]>) => void;
  index: number;
  availableCurrencies: Erc20[];
};
