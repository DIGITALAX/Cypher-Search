import { NextRouter } from "next/router";
import { AutographState } from "../../../../redux/reducers/autographSlice";
import { Profile } from "../../../../graphql/generated";

export type WebProps = {
  router: NextRouter;
  handleShuffleSearch: () => void;
  autograph: AutographState;
  openConnectModal: (() => void) | undefined;
  openAccountModal: (() => void) | undefined;
  handleLensConnect: () => Promise<void>;
  lensConnected: Profile | undefined;
  walletConnected: boolean;
  screenDisplay: ScreenDisplay;
  setScreenDisplay: (e: ScreenDisplay) => void;
  sortType: SortType;
  setSortType: (e: SortType) => void;
  mirror: () => Promise<void>;
  comment: () => Promise<void>;
  quote: () => Promise<void>;
  like: () => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    quote: boolean;
    comment: boolean;
  };
  setOpenMirrorChoice: (e: boolean[]) => void;
  openMirrorChoice: boolean[];
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
  setScreenDisplay: (e: ScreenDisplay) => void;
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
  sortType: SortType;
  autograph: AutographState;
};

export interface CypherProfileData {
  display: {
    private: {
      main: string;
      side: string[];
    };
    community: {
      main: string;
      side: string[];
    };
    public: {
      main: string;
      side: string[];
    };
  };
  gallery: {
    private: string[];
    community: string[];
    public: string[];
  };
}
