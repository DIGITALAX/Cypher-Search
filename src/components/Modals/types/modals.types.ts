import { Filter } from "@/components/Search/types/search.types";
import { Ref } from "react";
import { AnyAction, Dispatch } from "redux";
import { VideoSyncState } from "../../../../redux/reducers/videoSyncSlice";
import { Post } from "../../../../graphql/generated";
import { MainVideoState } from "../../../../redux/reducers/mainVideoSlice";
import { Creation } from "@/components/Tiles/types/tiles.types";
import { SortType } from "@/components/Autograph/types/autograph.types";

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
