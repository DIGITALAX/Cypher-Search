import { Filter } from "@/components/Search/types/search.types";
import {
  ChangeEvent,
  MouseEvent,
  MutableRefObject,
  RefObject,
  SetStateAction,
} from "react";
import { AnyAction, Dispatch } from "redux";
import {
  Erc20,
  MultirecipientFeeCollectOpenActionSettings,
  PrimaryPublication,
  Profile,
  PublicationReportingFraudSubreason,
  PublicationReportingIllegalSubreason,
  PublicationReportingSensitiveSubreason,
  PublicationReportingSpamSubreason,
  Quote,
  SimpleCollectOpenActionModuleInput,
  SimpleCollectOpenActionSettings,
} from "../../../../graphql/generated";
import {
  MakePostComment,
  SortType,
} from "@/components/Autograph/types/autograph.types";
import { NextRouter } from "next/router";
import { PostCollectGifState } from "../../../../redux/reducers/postCollectGifSlice";
import { FullScreenVideoState } from "../../../../redux/reducers/fullScreenVideoSlice";
import Draggable from "react-draggable";

export type MapProps = {
  dispatch: Dispatch<AnyAction>;
  filterValues: Filter;
};

export type DisplaySearchProps = {
  dispatch: Dispatch<AnyAction>;
  galleryLoading: boolean;
  gallery:
    | {
        collected: {
          collectionId: string;
          collectionMetadata: {
            images: string[];
            mediaCover: string;
            title: string;
          };
        }[];
        created: {
          collectionId: string;
          collectionMetadata: {
            images: string[];
            mediaCover: string;
            title: string;
          };
        }[];
      }
    | undefined;
  sortType: SortType;
  itemSearch: string;
  setItemSearch: (e: SetStateAction<string>) => void;
  sortedGallery:
    | {
        collectionId: string;
        collectionMetadata: {
          images: string[];
          mediaCover: string;
          title: string;
        };
      }[]
    | undefined;
  selectedItem:
    | {
        collectionId: string;
        collectionMetadata: {
          images: string[];
          mediaCover: string;
          title: string;
        };
      }
    | undefined;
  handleItemSelect: (
    item: {
      collectionId: string;
      collectionMetadata: {
        images: string[];
        mediaCover: string;
        title: string;
      };
    },
    type: SortType,
    value: number
  ) => void;
  numberIndex: number;
};

export type InteractErrorProps = {
  dispatch: Dispatch<AnyAction>;
};

export type SuccessCheckoutProps = {
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  handle: string;
};

export type FullScreenVideoProps = {
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  fullScreenVideo: FullScreenVideoState;
  videoRef: RefObject<HTMLVideoElement>;
  handlePlayPause: () => Promise<void>;
  handleSeek: (e: MouseEvent<HTMLDivElement>) => void;
  handleVolumeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleNextVideo: (forward: boolean) => Promise<void>;
  loading: {
    play: boolean;
    next: boolean;
    videos: boolean;
  };
  wrapperRef: RefObject<Draggable>;
};

export type ImageLargeProps = {
  mainImage: string;
  dispatch: Dispatch<AnyAction>;
  type: string;
};

export type IndexProps = {
  message: string | undefined;
};

export type ReportPubProps = {
  dispatch: Dispatch<AnyAction>;
  id: string;
  handleReportPost: (id: string) => Promise<void>;
  reason: {
    main: "Fraud" | "Illegal" | "Sensitive" | "Spam";
    subreason:
      | PublicationReportingFraudSubreason
      | PublicationReportingIllegalSubreason
      | PublicationReportingSensitiveSubreason
      | PublicationReportingSpamSubreason;
    additionalComments: string;
  };
  setReason: (
    e: SetStateAction<{
      main: "Fraud" | "Illegal" | "Sensitive" | "Spam";
      subreason:
        | PublicationReportingFraudSubreason
        | PublicationReportingIllegalSubreason
        | PublicationReportingSensitiveSubreason
        | PublicationReportingSpamSubreason;
      additionalComments: string;
    }>
  ) => void;
  reportLoading: boolean;
};

export type WhoProps = {
  dataLoading: boolean;
  reactors: any[];
  quoters: (Quote & {
    decrypted: any;
  })[];
  hasMore: boolean;
  hasMoreQuote: boolean;
  showMore: () => void;
  mirrorQuote: boolean;
  setMirrorQuote: (e: SetStateAction<boolean>) => void;
  type: string;
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  lensConnected: Profile | undefined;
};

export type WhoSwitchProps = {
  type: string;
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  reactors: any[];
  quoters: (Quote & {
    decrypted: any;
  })[];
  hasMore: boolean;
  hasMoreQuote: boolean;
  mirrorQuote: boolean;
  showMore: () => void;
  lensConnected: Profile | undefined;
};

export type PostBoxProps = {
  dispatch: Dispatch<AnyAction>;
  postCollectGif: PostCollectGifState;
  quote: PrimaryPublication | undefined;
  makePost: MakePostComment[];
  post: () => Promise<void>;
  lensConnected: Profile | undefined;
  caretCoord: {
    x: number;
    y: number;
  };
  setCaretCoord: (
    e: SetStateAction<{
      x: number;
      y: number;
    }>
  ) => void;
  profilesOpen: boolean[];
  mentionProfiles: Profile[];
  setMentionProfiles: (e: SetStateAction<Profile[]>) => void;
  setProfilesOpen: (e: SetStateAction<boolean[]>) => void;
  setMakePost: (e: SetStateAction<MakePostComment[]>) => void;
  postLoading: boolean[];
  router: NextRouter;
  setContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
  contentLoading: {
    image: boolean;
    video: boolean;
  }[];
};

export type PostCollectGifProps = {
  dispatch: Dispatch<AnyAction>;
  type: string | undefined;
  id: string;
  handleGif: (e: string) => Promise<void>;
  setCollects: (
    e: SetStateAction<SimpleCollectOpenActionModuleInput | undefined>
  ) => void;
  collects: SimpleCollectOpenActionModuleInput | undefined;
  openMeasure: {
    searchedGifs: string[];
    search: string;
    collectibleOpen: boolean;
    collectible: string;
    award: string;
    whoCollectsOpen: boolean;
    creatorAwardOpen: boolean;
    currencyOpen: boolean;
    editionOpen: boolean;
    edition: string;
    timeOpen: boolean;
    time: string;
  };
  setOpenMeasure: (
    e: SetStateAction<{
      searchedGifs: string[];
      search: string;
      collectibleOpen: boolean;
      collectible: string;
      award: string;
      whoCollectsOpen: boolean;
      creatorAwardOpen: boolean;
      currencyOpen: boolean;
      editionOpen: boolean;
      edition: string;
      timeOpen: boolean;
      time: string;
    }>
  ) => void;
  availableCurrencies: Erc20[];
  gifs:
    | {
        [key: string]: string[];
      }
    | undefined;
  collectTypes:
    | {
        [key: string]: SimpleCollectOpenActionModuleInput | undefined;
      }
    | undefined;
  searchGifLoading: boolean;
};

export type FollowCollectProps = {
  dispatch: Dispatch<AnyAction>;
  type: string;
  collect:
    | {
        item:
          | SimpleCollectOpenActionSettings
          | MultirecipientFeeCollectOpenActionSettings
          | undefined;
        stats: number | undefined;
        id: string;
      }
    | undefined;
  follower: Profile | undefined;
  handleFollow: () => Promise<void>;
  handleCollect: () => Promise<void>;
  approveSpend: () => Promise<void>;
  transactionLoading: boolean;
  informationLoading: boolean;
  approved: boolean;
};

export type PostSuccessProps = {
  dispatch: Dispatch<AnyAction>;
  type: string;
  router: NextRouter;
  pubId: string;
  handle: string;
  successType: string;
};

export type InsufficientBalanceProps = {
  dispatch: Dispatch<AnyAction>;
  message: string;
};
