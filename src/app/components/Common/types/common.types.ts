import {
  Post,
  Account,
  SessionClient,
  MainContentFocus,
  EvmAddress,
  PostType,
  ContentWarning,
  PostId,
  BigDecimal,
  DateTime,
} from "@lens-protocol/client";
import { ChangeEvent, ReactNode, SetStateAction } from "react";
import { GeneralPub } from "../../Tiles/types/tiles.types";
import { Drop } from "../../Autograph/types/autograph.types";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

export interface LensConnected {
  profile?: Account;
  sessionClient?: SessionClient;
  apollo?: ApolloClient<NormalizedCacheObject>;
}

export interface FullScreenVideo {
  open: boolean;
  time?: number;
  duration?: number;
  isPlaying?: boolean;
  volume?: number;
  volumeOpen?: boolean;
  allVideos: Post[];
  cursor?: string | undefined;
  index: number;
}

export interface OracleData {
  currency: string;
  rate: string;
  wei: string;
}

export enum PrintType {
  Sticker = "0",
  Poster = "1",
  Shirt = "2",
  Hoodie = "3",
  Sleeve = "4",
  Crop = "5",
  NFTOnly = "6",
  Custom = "7",
  Other = "8",
}

export enum ItemType {
  Chromadin = "chromadin",
  CoinOp = "coinop",
  Listener = "listener",
  F3M = "f3m",
  Kinora = "kinora",
  Quest = "quest",
  TripleA = "triplea",
  Other = "other",
  TheDial = "dial",
}

export interface SearchItems {
  input: string;
  items: GeneralPub[];
  lensPubCursor?: string;
  lensProfileCursor?: string;
  pubProfileCursor?: string;
  videoCursor?: string;
  graphCursor?: number;
  tripleACursor?: number;
  kinoraCursor?: number;
  catalogoCursor?: number;
  awardCursor?: number;
  hasMore: boolean;
  searchLoading: boolean;
  moreSearchLoading: boolean;
  moreSearch: boolean;
}

export type HeaderProps = {
  dict: any;
  includeSearch?: boolean;
};

export type AccountsProps = {
  dict: any;
};

export type SearchBarProps = {
  dict: any;
};

export type CartItem = {
  item: Collection;
  color: string;
  size: string;
  price: number;
  level?: number;
  currency: string;
  buyAmount: number;
  type: ItemType;
};

export interface Collection {
  amount: string;
  postId: string;
  uri: string;
  printType: string;
  price: number;
  acceptedTokens: string[];
  designer: string;
  tokenIdsMinted: string[];
  collectionId: string;
  unlimited: boolean;
  origin: string;
  post?: Post;
  profile?: Account;
  blockTimestamp: string;
  drop: {
    dropId: string;
    metadata: {
      title: string;
      cover: string;
    };
    uri: string;
    collections: Collection[];
  };
  metadata: {
    access: string[];
    colors: string[];
    sizes: string[];
    mediaCover: string;
    description: string;
    title: string;
    tags: string[];
    prompt: string;
    mediaTypes: string;
    microbrandCover: string;
    microbrand: string;
    images: string[];
    video: string;
    audio: string;
    extra: string;
    onChromadin: string;
    sex: string;
    style: string;
  };
}

export type CartListProps = {
  dict: any;
  page?: boolean;
  setCartListOpen: (e: SetStateAction<boolean>) => void;
};

export type WaveFormProps = {
  keyValue: string;
  audio: string;
  video: string;
  type: string;
  upload?: boolean;
  handleMedia?: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handlePlayVideo?: () => void;
  handlePauseVideo?: () => void;
  handleSeekVideo?: (e: number) => void;
  videoInfo?: {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
  };
};

export type MediaSwitchProps = {
  type: string;
  srcUrl: string;
  srcCover?: string;
  classNameVideo?: React.CSSProperties;
  classNameImage?: string;
  classNameAudio?: string;
  objectFit?: string;
  hidden?: boolean;
};

export interface FilterValues {
  hashtags: string[];
  microbrands: string[][];
  access: string[][];
  format: MainContentFocus[];
  dropsSuggested: string[];
  origin: string[][];
  catalog: string[];
  colors: string[];
  sizes: {
    poster: string[];
    sticker: string[];
    apparel: string[];
  };
  token: string[];
  sexes: string[];
  styles: string[][];
  fulfiller: string[];
}

export interface DropDown {
  hashtag: boolean;
  microbrand: boolean;
  catalog: boolean;
  access: boolean;
  format: boolean;
  origin: boolean;
  size: boolean;
  price: boolean;
  token: boolean;
  fulfiller: boolean;
}

export interface Filter {
  hashtag: string;
  microbrand: string;
  catalog: string;
  access: string;
  format: string;
  origin: string;
  editions: number;
  available: boolean;
  fulfiller: string;
  drop: string;
  size: {
    apparel: string[];
    poster: string[];
    sticker: string[];
  };
  color: string[];
  price: {
    min: number;
    max: number;
  };
  token: string;
  printType: string[];
}

export interface Quest {
  post?: Post;
  gate: Gate;
  questMetadata: {
    title: string;
    description: string;
    cover: string;
    videoCovers: {
      title: string;
      description: string;
      cover: string;
    }[];
  };
  status: boolean;
  postId: string;
  milestones: Milestone[];
  questId: string;
  transactionHash: string;
  uri: string;
  milestoneCount: string;
  players: Player[];
  maxPlayerCount: string;
  blockTimestamp: string;
}

export interface Reward {
  amount: string;
  tokenAddress: string;
  rewardMetadata: {
    mediaCover: string;
    images: string;
    video: string;
    mediaType: string;
    audio: string;
    title: string;
    description: string;
  };
  uri: string;
  type: string;
}

export interface Milestone {
  gated: Gate;
  milestoneMetadata: {
    title: string;
    description: string;
    cover: string;
  };
  milestoneId: string;
  rewards: Reward[];
  rewardsLength: string;
  videoLength: string;
}

export interface Player {
  milestonesCompleted: {
    questId: string;
    milestonesCompleted: String;
  }[];
  eligibile: {
    milestone: string;
    questId: string;
    status: boolean;
  }[];
  profileId: string;
  questsCompleted: string[];
  questsJoined: string[];
  profile: Account;
}

export interface Gate {
  erc721Logic: Collection[];
  erc20Logic: {
    address: string;
    amount: string;
  }[];
  oneOf: boolean;
}

export interface Award {
  amount: string;
  tokenAddress: string;
  rewardMetadata: {
    mediaCover: string;
    images: string;
    video: string;
    mediaType: string;
    audio: string;
    title: string;
    description: string;
    prompt: string;
  };
  uri: string;
  type: string;
  questId: string;
  postId: string;
  milestone: string;
  questURI: string;
  questMetadata: {
    title: string;
    description: string;
    cover: string;
    videoCovers: {
      title: string;
      description: string;
      cover: string;
    }[];
  };
}

export interface Catalogo {
  paginas: string[];
  tokenes: string[];
  uri: string;
  disenador: string;
  precio: number;
  postId: number;
  cantidad: number;
  minteado: number;
  paginasContadas: number;
  profile: Account | undefined;
  tipo: AutographType;
}

export enum AutographType {
  NFT = "NFT",
  Hoodie = "Hoodie",
  Shirt = "Shirt",
  Catalog = "Catalog",
  Mix = "Mix",
  All = "All",
}

export interface AutographCollection {
  imagenes: string[];
  id?: number;
  cantidad: number;
  tokenes: `0x${string}`[];
  precio: number;
  tipo: AutographType;
  profile: Account | undefined;
  titulo: string;
  descripcion: string;
  etiquetas: string;
  npcs: string;
  tokenesMinteados: number[];
  galeriaId?: number;
  coleccionId?: number;
  postIds: string[];
}

export interface PostFilter {
  accountScore?:
    | {
        atLeast: number;
      }
    | {
        lessThan: number;
      }
    | null
    | undefined;
  collectedBy?:
    | {
        account: EvmAddress;
      }
    | null
    | undefined;
  searchQuery?: string | null | undefined;
  apps?: EvmAddress[] | null | undefined;
  metadata?:
    | {
        contentWarning?:
          | {
              oneOf: ContentWarning[];
            }
          | null
          | undefined;
        tags?:
          | {
              all?: string[] | null | undefined;
              oneOf?: string[] | null | undefined;
            }
          | null
          | undefined;
        mainContentFocus?: MainContentFocus[] | null | undefined;
      }
    | null
    | undefined;
  postTypes?: PostType[] | null | undefined;
  posts?: PostId[] | null | undefined;
  authors?: EvmAddress[] | null | undefined;
  feeds?:
    | (
        | {
            globalFeed: true;
          }
        | {
            feed: EvmAddress;
          }
        | {
            app: EvmAddress;
          }
      )[]
    | null
    | undefined;
}

export interface SimpleCollect {
  isImmutable?: boolean | null | undefined;
  endsAt?: DateTime | null | undefined;
  followerOnGraph?:
    | {
        globalGraph: true;
      }
    | {
        graph: EvmAddress;
      }
    | null
    | undefined;
  collectLimit?: number | null | undefined;
  payToCollect?:
    | {
        referralShare?: number | null | undefined;
        recipients: {
          percent: number;
          address: EvmAddress;
        }[];
        amount: {
          value: BigDecimal;
          currency: EvmAddress;
        };
      }
    | null
    | undefined;
}

export type SuggestedProps = {
  includeSearch: boolean;
  component: ReactNode;
  dict: any;
  loader: boolean;
  notFound: boolean;
  data: Drop | GeneralPub | undefined;
};

export type DropMainProps = {
  drop: Drop;
  dict: any;
};
