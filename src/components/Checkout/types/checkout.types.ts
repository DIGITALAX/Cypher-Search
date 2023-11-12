import { Details } from "@/components/Autograph/types/autograph.types";
import { NextRouter } from "next/router";
import { SetStateAction } from "react";
import { AnyAction, Dispatch } from "redux";

export type FulfillmentProps = {
  details: Details;
  dispatch: Dispatch<AnyAction>;
  encryptionLoading: boolean;
  encryptFulfillment: () => Promise<void>;
  setDetails: (e: SetStateAction<Details>) => void;
};

export type CartProps = {
  collectItem: (id: string) => Promise<void>;
  collectPostLoading: boolean[];
  router: NextRouter;
};
