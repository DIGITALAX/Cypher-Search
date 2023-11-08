import { Filter } from "@/components/Search/types/search.types";
import { Ref } from "react";
import { AnyAction, Dispatch } from "redux";
import { VideoSyncState } from "../../../../redux/reducers/videoSyncSlice";
import {
  Post,
  PublicationReportingFraudSubreason,
  PublicationReportingIllegalSubreason,
  PublicationReportingSensitiveSubreason,
  PublicationReportingSpamSubreason,
} from "../../../../graphql/generated";
import { MainVideoState } from "../../../../redux/reducers/mainVideoSlice";
import { Creation } from "@/components/Tiles/types/tiles.types";
import { SortType } from "@/components/Autograph/types/autograph.types";
import { NextRouter } from "next/router";

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
  setItemSearch: (e: string) => void;
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
  setVideosLoading: (e: boolean) => void;
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
  setReason: (e: {
    main: "Fraud" | "Illegal" | "Sensitive" | "Spam";
    subreason:
      | PublicationReportingFraudSubreason
      | PublicationReportingIllegalSubreason
      | PublicationReportingSensitiveSubreason
      | PublicationReportingSpamSubreason;
    additionalComments: string;
  }) => void;
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
  setMirrorQuote: (e: boolean) => void;
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
