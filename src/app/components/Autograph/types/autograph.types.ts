import { Account } from "@lens-protocol/client";
import { Collection } from "../../Common/types/common.types";
import { NFTData } from "../../Tiles/types/tiles.types";
import { ChangeEvent, SetStateAction } from "react";
import { MediaImageMimeType } from "@lens-protocol/metadata";

export interface Drop {
  designer: string;
  metadata: {
    title: string;
    cover: string;
  };
  dropId: string;
  collections: (Collection | NFTData)[];
}

export interface EncryptedData {
  [address: string]: {
    ephemPublicKey: string;
    iv: string;
    ciphertext: string;
  };
}

export interface DropCreate {
  designer: string;
  metadata: {
    title: string;
    cover: string;
  };
  id: string;
  collections: Collection[];
}

export enum ScreenDisplay {
  Display,
  Gallery,
  Circuits,
  Bookmarks,
  Post,
  Orders,
  Sales,
  Settings,
}

export enum SortType {
  Community,
  Private,
  Public,
}

export type ScreenSwitchProps = {
  dict: any;
  profile: Account | undefined;
};

export type WebProps = {
  dict: any;
  profile: Account;
};

export type BioProps = {
  dict: any;
  profile: Account & {
    following: number;
    followers: number;
  };
};

export type FeedProps = {
  dict: any;
  profile: Account;
};

export type GalleryProps = {
  dict: any;
  profile: Account;
};

export interface Display {
  private?: {
    main?: Collection;
    side?: Collection[];
  };
  community?: {
    main?: Collection;
    side?: Collection[];
  };
  public?: {
    main?: Collection;
    side?: Collection[];
  };
}

export type CreationProps = {
  item: Collection | NFTData;
  dict: any;
  created: boolean;
};

export type DisplayProps = {
  dict: any;
  owner: boolean;
};

export interface Order {
  messages: string[];
  tokenIds: string[];
  details: string;
  blockTimestamp: string;
  fulfillment?: {
    address: string;
    zip: string;
    city: string;
    state: string;
    country: string;
    checkoutCurrency: string;
    tamano: string;
    color: string;
  };
  decrypted: boolean;
  buyer: string;
  currency: string;
  orderId: string;
  timestamp: string;
  totalPrice: string;
  collectionId: string;
  postId: string;
  amount: string;
  status: Status;
  isFulfilled: boolean;
  collection: Collection;
  transactionHash: string;
  profile?: Account;
}

export enum Status {
  Fulfilled = "Fulfilled",
  Shipped = "Shipped",
  Shipping = "Shipping",
  Designing = "Designing",
}

export interface CollectionDetails {
  title: string;
  description: string;
  collectionId: string;
  price: string;
  amount: string;
  postId: string;
  cover: string;
  printType: string;
  acceptedTokens: string[];
  images: { media: string; type: MediaImageMimeType }[];
  video: string;
  onChromadin: string;
  audio: string;
  tags: string;
  prompt: string;
  sizes: string;
  sex: string;
  style: string;
  colors: string;
  microbrand: {
    microbrand: string;
    microbrandCover: string;
  };
  access: string;
  dropTitle: string;
  dropCover: string;
  dropId: string;
  dropCollectionIds: string[];
  extra: string;
}

export type SwitchCreateProps = {
  collectionDetails: CollectionDetails;
  setCollectionDetails: (e: SetStateAction<CollectionDetails>) => void;
  allDrops: Drop[];
  dict: any;
  dropDetails: {
    collectionIds: string[];
    title: string;
    cover: string;
    dropId: string;
  };
  setDropDetails: (
    e: SetStateAction<{
      collectionIds: string[];
      title: string;
      cover: string;
      dropId: string;
    }>
  ) => void;
  dropsLoading: boolean;
  edit: boolean;
  handleMedia: (e: ChangeEvent<HTMLInputElement>, id: string) => Promise<void>;
  setCreateCase: (e: SetStateAction<string | undefined>) => void;
  collectionSettings: CollectionSettings;
  setCollectionSettings: (e: SetStateAction<CollectionSettings>) => void;
  createCase: string | undefined;
  collectionLoading: boolean;
  allCollections: Collection[];
};

export type DispatchProps = {
  collectionDetails: CollectionDetails;
  setCollectionDetails: (e: SetStateAction<CollectionDetails>) => void;
  allDrops: Drop[];
  dict: any;
  edit: boolean;
  handleMedia: (e: ChangeEvent<HTMLInputElement>, id: string) => Promise<void>;
  setCreateCase: (e: SetStateAction<string | undefined>) => void;
  collectionSettings: CollectionSettings;
  setCollectionSettings: (e: SetStateAction<CollectionSettings>) => void;
};

export interface CollectionSettings {
  media: string;
  origin: string;
  microOpen: boolean;
  communityOpen: boolean;
  accessOpen: boolean;
  dropOpen: boolean;
  printOpen: boolean;
  colorOpen: boolean;
  sizeOpen: boolean;
  sexOpen: boolean;
  styleOpen: boolean;
  imageIndex: number;
  chromadinOpen: boolean;
}

export type DropProps = {
  allDrops: Drop[];
  dict: any;
  dropDetails: {
    collectionIds: string[];
    title: string;
    cover: string;
    dropId: string;
  };
  setDropDetails: (
    e: SetStateAction<{
      collectionIds: string[];
      title: string;
      cover: string;
      dropId: string;
    }>
  ) => void;
  dropsLoading: boolean;
};
