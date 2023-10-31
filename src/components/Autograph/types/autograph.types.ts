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
};
