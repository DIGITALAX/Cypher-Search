import { Filter } from "@/components/Search/types/search.types";
import { Ref, SetStateAction } from "react";
import { AnyAction, Dispatch } from "redux";
import { VideoSyncState } from "../../../../redux/reducers/videoSyncSlice";
import {
  Erc20,
  Post,
  PrimaryPublication,
  PublicationReportingFraudSubreason,
  PublicationReportingIllegalSubreason,
  PublicationReportingSensitiveSubreason,
  PublicationReportingSpamSubreason,
  SimpleCollectOpenActionModuleInput,
} from "../../../../graphql/generated";
import { MainVideoState } from "../../../../redux/reducers/mainVideoSlice";
import { Creation } from "@/components/Tiles/types/tiles.types";
import {
  MakePostComment,
  SortType,
} from "@/components/Autograph/types/autograph.types";
import { NextRouter } from "next/router";
import { PostCollectGifState } from "../../../../redux/reducers/postCollectGifSlice";

export type MapProps = {
  dispatch: Dispatch<AnyAction>;
  filterValues: Filter;
};

export type DisplaySearchProps = {
  dispatch: Dispatch<AnyAction>;
  gallery:
    | {
        collected: Creation[];
        created: Creation[];
      }
    | undefined;
  sortType: SortType;
  itemSearch: string;
  setItemSearch: (e: SetStateAction<string>) => void;
  sortedGallery: Creation[];
  selectedItem: Creation | undefined;
  handleItemSelect: (item: Creation, type: SortType, value: number) => void;
  numberIndex: number;
};

export type InteractErrorProps = {
  dispatch: Dispatch<AnyAction>;
};

export type FullScreenVideoProps = {
  dispatch: Dispatch<AnyAction>;
  mainVideo: MainVideoState;
  videoRef: Ref<HTMLDivElement>;
  streamRef: Ref<HTMLVideoElement>;
  wrapperRef: Ref<HTMLDivElement>;
  dispatchVideos: Post[];
  videoSync: VideoSyncState;
  viewer: string;
  hasMore: boolean;
  fetchMoreVideos: () => Promise<
    | { videos: any[]; mirrors: any[]; collects: boolean[]; likes: any[] }
    | undefined
  >;
  videosLoading: boolean;
  setVideosLoading: (e: SetStateAction<boolean>) => void;
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
  quoters: any[];
  hasMore: boolean;
  hasMoreQuote: boolean;
  showMore: () => void;
  mirrorQuote: boolean;
  setMirrorQuote: (e: SetStateAction<boolean>) => void;
  type: string;
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
};

export type WhoSwitchProps = {
  type: string;
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  reactors: any[];
  quoters: any[];
  hasMore: boolean;
  hasMoreQuote: boolean;
  mirrorQuote: boolean;
  showMore: () => void;
};

export type PostBoxProps = {
  dispatch: Dispatch<AnyAction>;
  postCollectGif: PostCollectGifState;
  quote: PrimaryPublication | undefined;
  makePost: MakePostComment[];
  post: () => Promise<void>;
  setMakePost: (e: SetStateAction<MakePostComment[]>) => void;
  postLoading: boolean[];
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
