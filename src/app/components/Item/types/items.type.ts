import { SetStateAction } from "react";
import { GeneralPub, NFTData } from "../../Tiles/types/tiles.types";
import {
  AutographCollection,
  Catalogo,
  Collection,
  Quest,
} from "../../Common/types/common.types";
import { Account, Post, Repost } from "@lens-protocol/client";

export interface PurchaseDetails {
  currency: string;
  size: string;
  color: string;
  imageIndex: number;
  address: string;
  zip: string;
  city: string;
  state: string;
  country: string;
}

export type SwitchTypeProps = {
  dict: any;
  itemData: GeneralPub;
  type: string;
  relatedData:
    | {
        collections: Collection[];
        microbrand: [
          {
            microbrand: string;
            microbrandCover: string;
          }
        ];
      }
    | undefined;
};

export type ChromadinProps = {
  dict: any;
  itemData: {
    post: Collection;
    type: string;
  };
  type: string;
};

export type TripleAProps = {
  dict: any;
  itemData: {
    post: NFTData;
    type: string;
  };
};

export type KinoraProps = {
  dict: any;
  itemData: {
    post: Quest;
    type: string;
  };
};

export type PubProps = {
  dict: any;
  itemData: {
    post: Post | Repost;
    type: string;
  };
};

export type MicrobrandProps = {
  dict: any;
  relatedData:
    | {
        collections: Collection[];
        microbrand: [
          {
            microbrand: string;
            microbrandCover: string;
          }
        ];
      }
    | undefined;
  itemData: {
    post: Account;
    type: string;
  };
};

export type AutografoProps = {
  itemData: {
    post: AutographCollection;
    type: string;
  };
  dict: any;
};

export type CatalogoProps = {
  itemData: {
    post: Catalogo;
    type: string;
  };
  dict: any;
};

export type FulfillmentProps = {
  dict: any;
  loading: boolean
  purchaseDetails: PurchaseDetails;
  setPurchaseDetails: (e: SetStateAction<PurchaseDetails>) => void;
};
