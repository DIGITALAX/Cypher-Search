import {
  Account,
  ArticleMetadata,
  AudioMetadata,
  ImageMetadata,
  Post,
  Repost,
  StoryMetadata,
  TextOnlyMetadata,
  VideoMetadata,
} from "@lens-protocol/client";
import {
  AutographCollection,
  Award,
  Catalogo,
  Collection,
  ItemType,
  Quest,
} from "../../Common/types/common.types";
import { RefObject, SetStateAction } from "react";
import { Format } from "@/app/lib/constants";

export interface GeneralPub {
  post?:
    | Post
    | Repost
    | Account
    | AutographCollection
    | Quest
    | Award
    | Catalogo
    | Collection
    | NFTData;
  type: string;
}

export type ImagePostProps = {
  dict: any;
  publication: Post | Repost;
};

export type TilesProps = {
  dict: any;
};

export type TileSwitchProps = {
  dict: any;
  publication: GeneralPub;
  type: string;
  index: number;
};

export type HoverProfileProps = {
  publication: Account;
  parentId: string;
  setProfileHover: (e: SetStateAction<boolean>) => void;
  bottom: string;
  top: string;
  left: string;
  right: string;
  dict: any;
};

export type InteractBarProps = {
  publication: Post;
  dict: any;
  col?: boolean;
  display?: string;
  item?: boolean;
  gallery?: boolean;
  hideCollect?: boolean;
  showOthers?: boolean;
  comment?: () => void;
};

export type PublicationProps = {
  item: Post | Repost;
  index: number;
  top: string;
  bottom: string;
  left: string;
  right: string;
  main?: boolean;
  dict: any;
  disabled?: boolean;
};

export type PostSwitchProps = {
  item: Post | Repost;
  disabled: boolean | undefined;
};

export type ImageProps = {
  disabled: boolean | undefined;
  metadata: ImageMetadata | VideoMetadata | AudioMetadata;
};

export type TextProps = {
  metadata: ArticleMetadata | StoryMetadata | TextOnlyMetadata;
};

export type PostQuoteProps = {
  quote: Post;
  pink?: boolean;
  disabled: boolean | undefined;
};

export type PostCommentProps = {
  dict: any;
  commentDetails: string;
  profilesOpen: boolean;
  searchProfiles: (e: any) => Promise<void>;
  caretCoord: {
    x: number;
    y: number;
  };
  comment: () => Promise<void>;
  commentLoading: boolean;
  setCommentDetails: (e: SetStateAction<string>) => void;
  setProfilesOpen: (e: SetStateAction<boolean>) => void;
  mentionProfiles: Account[];
  id: string;
  height: string;
  imageHeight: string;
  imageWidth: string;
  textElement: RefObject<HTMLTextAreaElement | null>;
};

export type PostBarProps = {
  index: number;
  item: Post | Repost;
  disabled?: boolean;
  setCommentOpen: (e: SetStateAction<boolean>) => void;
  main?: boolean;
  top: string;
  bottom: string;
  left: string;
  right: string;
  dict: any;
  commentInteraction: {
    comments: number;
    hasCommented: boolean;
  };
};

export type TextPostProps = {
  dict: any;
  publication: Post | Repost;
};

export type VideoPostProps = { dict: any; publication: Post | Repost };

export interface VideoControls {
  volume: number;
  volumeOpen: boolean;
  heart: boolean;
  seeked: number;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  loading: boolean;
}

export type ControlsProps = {
  post: Post;
  videoInfo: VideoControls;
  setVideoInfo: (e: SetStateAction<VideoControls>) => void;
  interactionsLoading: {
    like: boolean;
    collect: boolean;
    mirror: boolean;
  };
  interactions: {
    reactions: number;
    comments: number;
    mirrors: number;
    hasReacted: boolean;
    hasMirrored: boolean;
    hasCommented: boolean;
    hasQuoted: boolean;
    quotes: number;
    hasCollected: boolean;
    collects: number;
  };
  collect: () => Promise<void>;
  mirror: () => Promise<void>;
  like: () => Promise<void>;
};

export type ProfileProps = {
  dict: any;
  profile: Account;
  index: number;
};

export type StatsProps = {
  profile: Account;
  microbrand?: boolean;
  dict: any;
};

export type MicrobrandProps = {
  dict: any;
  profile: Account;
  index: number;
};

export type CatalogoProps = {
  publication: Catalogo;
  dict: any;
};

export type AutografoProps = {
  publication: AutographCollection;
  dict: any;
};

export type AwardProps = {
  publication: Award;
  dict: any;
};

export type CoinOpProps = {
  publication: Collection;
  dict: any;
};

export type ChromadinProps = {
  publication: Collection;
  dict: any;
};

export type ListenerProps = {
  publication: Collection;
  dict: any;
};

export type TripleAProps = {
  publication: NFTData;
  dict: any;
};

export type PrintTypeProps = {
  printType: string;
  dict: any;
};

export type PopUpProps = {
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
  cartItem: Collection;
  dict: any;
  level: number | undefined;
  type: ItemType;
};

export interface NFTData {
  id: number;
  collectionId: number;
  printType?: string;
  blockTimestamp: string;
  collectionType: CollectionType;
  metadata: {
    image: string;
    title: string;
    description: string;
    format?: Format;
    colors?: string[];
    sizes?: string[];
    prompt?: string;
    model?: string;
  };
  origin: string;
  prices: { price: number; token: string }[];
  agentIds: string[];
  artist: string;
  amountSold: number;
  tokenIdsMinted: string[];
  amount: number;
  uri: string;
  isAgent: boolean;
  profile: Account;
  active: boolean;
  fulfillerId: string;
}

export enum CollectionType {
  Digital = "Digital",
  IRL = "IRL",
}

export interface Collector {
  pfp?: string;
  name?: string;
  address: string;
  transactionHash: string;
  amount: number;
  blockTimestamp: string;
  localName?: string;
}
