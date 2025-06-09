import { Post, Account } from "@lens-protocol/client";

export type WhoSwitchProps = {
  reactors: Account[];
  quoters: Post[];
  hasMore: boolean;
  hasMoreQuote: boolean;
  showMore: () => void;
  mirrorQuote: boolean;
  dict: any;
};
