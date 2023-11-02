import { NextRouter } from "next/router";
import {
  Post,
  Profile,
  Comment,
  Quote,
  Mirror,
  ProfileMetadata,
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
  setScreenDisplay: (e: ScreenDisplay) => void;
  sortType: SortType;
  setSortType: (e: SortType) => void;
  mirror: (index: number, id: string) => Promise<void>;
  comment: (index: number, id: string) => Promise<void>;
  quote: (index: number, id: string) => Promise<void>;
  like: (index: number, id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    quote: boolean;
    comment: boolean;
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
};

export enum ScreenDisplay {
  Display,
  Gallery,
  Circuits,
  Settings,
}

export enum SortType {
  Community,
  Private,
  Public,
}

export type BioProps = {
  profile: Profile | undefined;
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
  dispatch: Dispatch<AnyAction>;
  owner: boolean;
  handleSetDisplay: () => void;
  displayLoading: boolean;
  mirror: (index: number, id: string) => Promise<void>;
  like: (index: number, id: string) => Promise<void>;
  comment: (index: number, id: string) => Promise<void>;
  quote: (index: number, id: string) => Promise<void>;
  setSettingsData: (e: ProfileMetadata) => void;
  settingsData: ProfileMetadata;
  handleSettingsUpdate: () => Promise<void>;
  settingsUpdateLoading: boolean;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    quote: boolean;
    comment: boolean;
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
};

export type SettingsProps = {
  setSettingsData: (e: ProfileMetadata) => void;
  settingsData: ProfileMetadata;
  handleSettingsUpdate: () => Promise<void>;
  settingsUpdateLoading: boolean;
  handleImage: (e: ChangeEvent<HTMLInputElement>, id: string) => Promise<void>;
  coverImage: string | undefined;
  pfpImage: string | undefined;
};

export type DisplayProps = {
  mirror: (index: number, id: string) => Promise<void>;
  like: (index: number, id: string) => Promise<void>;
  comment: (index: number, id: string) => Promise<void>;
  quote: (index: number, id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    quote: boolean;
    comment: boolean;
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
  item: Post | Quote | Mirror;
};

export type FeedProps = {
  profileFeed: (Post | Quote | Mirror)[];
  mirror: (index: number, id: string) => Promise<void>;
  like: (index: number, id: string) => Promise<void>;
  comment: (index: number, id: string) => Promise<void>;
  quote: (index: number, id: string) => Promise<void>;
  collect: (index: number, id: string, type: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    quote: boolean;
    comment: boolean;
  }[];
  setOpenMirrorChoice: (e: boolean[]) => void;
  openMirrorChoice: boolean[];
  getMoreFeed: () => Promise<void>;
};

export type GalleryProps = {
  gallery:
    | {
        collected: Creation[];
        created: Creation[];
      }
    | undefined;
    cartItems: CartItem[]
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
  }[];
  followLoading: boolean[];
  unfollowProfile: (id: string) => Promise<void>;
  followProfile: (id: string) => Promise<void>;
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
  cartItems: CartItem[]
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
    quote: boolean;
    comment: boolean;
  };
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  comment: (id: string) => Promise<void>;
  quote: (id: string) => Promise<void>;
};
