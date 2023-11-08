import { NextRouter } from "next/router";
import {
  Post,
  Profile,
  Quote,
  Mirror,
  Comment,
  ProfileMetadata,
  Erc20,
} from "../../../../graphql/generated";
import { Creation } from "@/components/Tiles/types/tiles.types";
import { ChangeEvent } from "react";
import { AnyAction, Dispatch } from "redux";
import { CartItem } from "@/components/Common/types/common.types";

export type WebProps = {
  router: NextRouter;
  profile: Profile | undefined;
  dispatch: Dispatch<AnyAction>;
  setSettingsData: (e: ProfileMetadata) => void;
  settingsData: ProfileMetadata;
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
  setSortType: (e: SortType) => void;
  mirror: (index: number, id: string) => Promise<void>;
  comment: (index: number, id: string) => Promise<void>;
  like: (index: number, id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    bookmark: boolean;
    hide: boolean;
  }[];
  handleSetDisplay: () => void;
  displayLoading: boolean;
  setOpenMirrorChoice: (e: boolean[]) => void;
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
  setFollowData: (e: {
    type: "FreeFollowModule" | "FeeFollowModule" | "RevertFollowModule";
    value: string | undefined;
    currency: Erc20 | undefined;
  }) => void;
  openType: boolean;
  setOpenType: (e: boolean) => void;
  currencies: Erc20[];
  setCurrencyOpen: (e: boolean) => void;
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
  commentBookmark: (id: string) => Promise<void>;
  setOpenMirrorChoiceBookmark: (e: boolean[]) => void;
  openMirrorChoiceBookmark: boolean[];
  unfollowProfile: (id: string) => Promise<void>;
  followProfile: (id: string) => Promise<void>;
  openMoreOptions: boolean[];
  profileHovers: boolean[];
  setOpenMoreOptions: (e: boolean[]) => void;
  setProfileHovers: (e: boolean[]) => void;
  followLoading: boolean[];
};

export type BookmarksProps = {
  bookmarks: (Post | Mirror | Comment | Quote)[];
  bookmarksLoading: boolean;
  hasMoreBookmarks: boolean;
  simpleCollect: (id: string, type: string) => Promise<void>;
  handleMoreBookmarks: () => Promise<void>;
  handleBookmark: (id: string, index: number) => Promise<void>;
  handleHidePost: (id: string, index: number) => Promise<void>;
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  comment: (id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    bookmark: boolean;
    hide: boolean;
    simpleCollect: boolean;
  }[];
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  openMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: boolean[]) => void;
  profileHovers: boolean[];
  setProfileHovers: (e: boolean[]) => void;
  unfollowProfile: (id: string) => Promise<void>;
  followProfile: (id: string) => Promise<void>;
  followLoading: boolean[];
  setOpenMoreOptions: (e: boolean[]) => void;
  openMoreOptions: boolean[];
};

export enum ScreenDisplay {
  Display,
  Gallery,
  Circuits,
  Bookmarks,
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
  simpleCollect: (id: string, type: string) => Promise<void>;
  handleBookmark: (id: string, index: number) => Promise<void>;
  handleHidePost: (id: string, index: number) => Promise<void>;
  handleMoreBookmarks: () => Promise<void>;
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
  comment: (index: number, id: string) => Promise<void>;
  setSettingsData: (e: ProfileMetadata) => void;
  settingsData: ProfileMetadata;
  handleSettingsUpdate: () => Promise<void>;
  settingsUpdateLoading: boolean;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    bookmark: boolean;
    hide: boolean;
  }[];
  setOpenMirrorChoice: (e: boolean[]) => void;
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
  setFollowData: (e: {
    type: "FreeFollowModule" | "FeeFollowModule" | "RevertFollowModule";
    value: string | undefined;
    currency: Erc20 | undefined;
  }) => void;
  openType: boolean;
  setOpenType: (e: boolean) => void;
  currencies: Erc20[];
  setCurrencyOpen: (e: boolean) => void;
  currencyOpen: boolean;
  mirrorBookmark: (id: string) => Promise<void>;
  likeBookmark: (id: string) => Promise<void>;
  commentBookmark: (id: string) => Promise<void>;
  setOpenMirrorChoiceBookmark: (e: boolean[]) => void;
  openMirrorChoiceBookmark: boolean[];
  unfollowProfile: (id: string) => Promise<void>;
  followProfile: (id: string) => Promise<void>;
  openMoreOptions: boolean[];
  profileHovers: boolean[];
  setOpenMoreOptions: (e: boolean[]) => void;
  setProfileHovers: (e: boolean[]) => void;
  followLoading: boolean[];
  router: NextRouter;
};

export type SettingsProps = {
  setSettingsData: (e: ProfileMetadata) => void;
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
  setFollowData: (e: {
    type: "FreeFollowModule" | "FeeFollowModule" | "RevertFollowModule";
    value: string | undefined;
    currency: Erc20 | undefined;
  }) => void;
  openType: boolean;
  setOpenType: (e: boolean) => void;
  currencies: Erc20[];
  setCurrencyOpen: (e: boolean) => void;
  currencyOpen: boolean;
};

export type DisplayProps = {
  mirror: (index: number, id: string) => Promise<void>;
  like: (index: number, id: string) => Promise<void>;
  comment: (index: number, id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    bookmark: boolean;

    hide: boolean;
  }[];
  owner: boolean;
  setOpenMirrorChoice: (e: boolean[]) => void;
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
  openMoreOptions: boolean[];
  hasMoreFeed: boolean;
  setOpenMoreOptions: (e: boolean[]) => void;
  simpleCollect: (id: string, type: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    simpleCollect: boolean;
    bookmark: boolean;

    hide: boolean;
  }[];
  setOpenMirrorChoice: (e: boolean[]) => void;
  openMirrorChoice: boolean[];
  getMoreFeed: () => Promise<void>;
  router: NextRouter;
  followLoading: boolean[];
  unfollowProfile: (id: string, feed?: boolean) => Promise<void>;
  followProfile: (id: string, feed?: boolean) => Promise<void>;
  profileHovers: boolean[];
  setProfileHovers: (e: boolean[]) => void;
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
  comment: (id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    bookmark: boolean;

    hide: boolean;
  }[];
  followLoading: boolean[];
  unfollowProfile: (id: string, feed?: boolean) => Promise<void>;
  followProfile: (id: string, feed?: boolean) => Promise<void>;
  router: NextRouter;
  profileHovers: boolean[];
  setProfileHovers: (e: boolean[]) => void;
  setOpenMirrorChoice: (e: boolean[]) => void;
  openMirrorChoice: boolean[];
  optionsOpen: boolean;
  setOptionsOpen: (e: boolean) => void;
  selectedOption: string;
  handleOptionSelect: (e: string) => void;
  getMoreGallery: () => Promise<void>;
  openInteractions: boolean[];
  setOpenInteractions: (e: boolean[]) => void;
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
  setProfileHovers: (e: boolean[]) => void;
  created: boolean;
  setOpenMirrorChoice: (e: boolean[]) => void;
  openMirrorChoice: boolean[];
  openInteractions: boolean[];
  setOpenInteractions: (e: boolean[]) => void;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    bookmark: boolean;

    hide: boolean;
  };
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  comment: (id: string) => Promise<void>;
};

export type PostBarProps = {
  index: number;
  mirror?: (id: string) => Promise<void>;
  like?: (id: string) => Promise<void>;
  comment?: (id: string) => Promise<void>;
  simpleCollect?: (id: string, type: string) => Promise<void>;
  handleBookmark?: (id: string, index: number) => Promise<void>;
  handleHidePost?: (id: string, index: number) => Promise<void>;
  item: Post | Quote | Mirror | Comment;
  setOpenMirrorChoice?: (e: boolean[]) => void;
  openMirrorChoice?: boolean[];
  openMoreOptions?: boolean[];
  disabled?: boolean;
  setOpenMoreOptions?: (e: boolean[]) => void;
  interactionsLoading?: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    simpleCollect: boolean;
    bookmark: boolean;
    hide: boolean;
  };
  router: NextRouter;
  setProfileHovers?: (e: boolean[]) => void;
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
  quote: Comment | Post | Quote;
};

export type PublicationProps = {
  item: Post | Mirror | Quote | Comment;
  index: number;
  disabled?: boolean;
  mirror?: (id: string) => Promise<void>;
  like?: (id: string) => Promise<void>;
  comment?: (id: string) => Promise<void>;
  openMoreOptions?: boolean[];
  setOpenMoreOptions?: (e: boolean[]) => void;
  simpleCollect?: (id: string, type: string) => Promise<void>;
  interactionsLoading?: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    simpleCollect: boolean;
    bookmark: boolean;
    hide: boolean;
  }[];
  setOpenMirrorChoice?: (e: boolean[]) => void;
  openMirrorChoice?: boolean[];
  router: NextRouter;
  followLoading?: boolean[];
  unfollowProfile?: (id: string, feed?: boolean) => Promise<void>;
  followProfile?: (id: string, feed?: boolean) => Promise<void>;
  profileHovers?: boolean[];
  setProfileHovers?: (e: boolean[]) => void;
  dispatch: Dispatch<AnyAction>;
  handleBookmark?: (id: string, index: number) => Promise<void>;
  handleHidePost?: (id: string, index: number) => Promise<void>;
};
