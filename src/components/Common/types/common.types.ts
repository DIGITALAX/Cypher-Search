import { CartItem, ItemType } from "@/components/Layout/types/footer.types";
import { NextRouter } from "next/router";
import { AnyAction, Dispatch } from "redux";
import {
  Mirror,
  Post,
  Profile,
  Quote,
  Comment,
} from "../../../../graphql/generated";

export type BarProps = {
  title: string;
};

export type PopUpProps = {
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
  cartItems: CartItem[];
  index: number;
  id: string;
  level: number | undefined;
  type: ItemType;
};

export type PurchaseTokensProps = {
  currency: string;
  handleChangeCurrency: (
    levelIndex: number,
    itemIndex: number,
    priceIndex: number,
    checkoutCurrency: string
  ) => void;
  itemIndex: number;
  levelIndex: number;
  priceIndex: number;
};

export type InteractBarProps = {
  col?: boolean;
  layoutAmount?: number;
  index: number;
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  comment: (id: string) => Promise<void>;
  quote: (id: string) => Promise<void>;
  collect: (id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    quote: boolean;
    comment: boolean;
  };
  publication: Post | Comment | Mirror | Quote;
  openMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: boolean[]) => void;
};

export type HoverProfileProps = {
  followLoading: boolean[];
  unfollowProfile: (id: string) => Promise<void>;
  followProfile: (id: string) => Promise<void>;
  publication: Profile;
  router: NextRouter;
  index: number;
};

export type TileLoaderProps = {
  layoutAmount: number;
};
