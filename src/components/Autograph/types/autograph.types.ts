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

export type WebProps = {
  router: NextRouter;
  profile: Profile | undefined;
  dispatch: Dispatch<AnyAction>
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
  gallery: {
    collected: Creation[];
    created: Creation[];
  } | undefined;
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

export type ScreenSwitchProps = {
  screenDisplay: ScreenDisplay;
  dispatch: Dispatch<AnyAction>
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
  gallery: {
    collected: Creation[];
    created: Creation[];
  } | undefined;
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

export type FeedProps = {
  profileFeed: (Post | Comment | Quote | Mirror)[];
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
};

export type GalleryProps = {
  gallery: {
    collected: Creation[];
    created: Creation[];
  } | undefined;
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

export type CircuitsProps = {
  gallery: {
    collected: Creation[];
    created: Creation[];
  } | undefined;

};
