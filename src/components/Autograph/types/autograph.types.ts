import { NextRouter } from "next/router";
import {
  Post,
  Profile,
  Quote,
  Mirror,
  Comment,
  ProfileMetadata,
  Erc20,
  SimpleCollectOpenActionModuleInput,
  PrimaryPublication,
} from "../../../../graphql/generated";
import { AccessControlConditions } from "@lit-protocol/types";
import { Creation } from "@/components/Tiles/types/tiles.types";
import { ChangeEvent, MutableRefObject, SetStateAction } from "react";
import { AnyAction, Dispatch } from "redux";
import { CartItem } from "@/components/Common/types/common.types";
import { PostCollectGifState } from "../../../../redux/reducers/postCollectGifSlice";
import { FilterValues } from "@/components/Search/types/search.types";
import { Client, Conversation, DecodedMessage } from "@xmtp/react-sdk";
import WaveSurfer from "wavesurfer.js";

export type WebProps = {
  router: NextRouter;
  editDrop: () => Promise<void>;
  deleteDrop: () => Promise<void>;
  deleteCollection: () => Promise<void>;
  creationLoading: boolean;
  isDesigner: boolean;
  collectionLoading: boolean;
  allCollections: Creation[];
  filterConstants: FilterValues | undefined;
  setSearchedProfiles: (e: SetStateAction<Profile[]>) => void;
  dropDetails: {
    collectionIds: string[];
    title: string;
    cover: string;
    dropId: string;
  };
  sendMessageLoading: boolean;
  handleConversations: () => Promise<void>;
  client: Client | undefined;
  conversationsLoading: boolean;
  dropsLoading: boolean;
  allDrops: Drop[];
  createDropLoading: boolean;
  setDropDetails: (
    e: SetStateAction<{
      collectionIds: string[];
      title: string;
      cover: string;
      dropId: string;
    }>
  ) => void;
  searchCollection: string;
  setSearchCollection: (e: SetStateAction<string>) => void;
  handleMedia: (e: ChangeEvent<HTMLInputElement>, id: string) => Promise<void>;
  setCreateCase: (e: SetStateAction<string | undefined>) => void;
  createCase: string | undefined;
  collectionSettings: {
    origin: string;
    media: string;
    microOpen: boolean;
    communityOpen: boolean;
    accessOpen: boolean;
    visibilityOpen: boolean;
    videoAudio: boolean;
    dropOpen: boolean;
  };
  setCollectionSettings: (
    e: SetStateAction<{
      origin: string;
      media: string;
      microOpen: boolean;
      communityOpen: boolean;
      accessOpen: boolean;
      visibilityOpen: boolean;
      videoAudio: boolean;
      dropOpen: boolean;
    }>
  ) => void;
  handlePlayPause: (
    key: string,
    wavesurfer: MutableRefObject<WaveSurfer | null>,
    type: string
  ) => void;
  handleSendMessage: (digitalax?: boolean) => Promise<void>;
  digiMessageLoading: boolean;
  setDigiMessage: (e: string) => void;
  digiMessage: string;
  collectionDetails: CollectionDetails;
  setCollectionDetails: (e: SetStateAction<CollectionDetails>) => void;
  currentMessage: string;
  setCurrentMessage: (e: SetStateAction<string>) => void;
  conversations: (Conversation & {
    profileImage: string;
    profileHandle: string;
    preview: DecodedMessage;
  })[];
  messages: DecodedMessage[];
  selectedUser:
    | {
        address: string;
        handle: string;
        image: string;
      }
    | undefined;
  handleSearchUser: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  searchedProfiles: Profile[];
  userSearch: string;
  setUserSearch: (e: SetStateAction<string>) => void;
  setSelectedUser: (
    e: SetStateAction<
      | {
          address: string;
          handle: string;
          image: string;
        }
      | undefined
    >
  ) => void;
  createCollection: (edit?: boolean) => Promise<void>;
  createDrop: () => Promise<void>;
  profile: Profile | undefined;
  dispatch: Dispatch<AnyAction>;
  allOrders: Order[];
  ordersLoading: boolean;
  orderActions: {
    decryptLoading: boolean;
    decrypted: boolean;
    orderOpen: boolean;
  }[];
  allSales: Sale[];
  salesLoading: boolean;
  setOrderActions: (
    e: SetStateAction<
      {
        decryptLoading: boolean;
        decrypted: boolean;
        orderOpen: boolean;
      }[]
    >
  ) => void;
  decryptOrder: (orderId: string) => void;
  setSettingsData: (
    e: SetStateAction<
      ProfileMetadata & {
        microbrands: {
          microbrand: string;
          microbrandCover: string;
        }[];
        tempMicro: {
          microbrand: string | undefined;
          microbrandCover: string | undefined;
        };
      }
    >
  ) => void;
  settingsData: ProfileMetadata & {
    microbrands: {
      microbrand: string;
      microbrandCover: string;
    }[];
    tempMicro: {
      microbrand: string | undefined;
      microbrandCover: string | undefined;
    };
  };
  handleSettingsUpdate: () => Promise<void>;
  settingsUpdateLoading: boolean;
  postCollectGif: PostCollectGifState;
  handleShuffleSearch: () => void;
  openConnectModal: (() => void) | undefined;
  openAccountModal: (() => void) | undefined;
  handleLensConnect: () => Promise<void>;
  lensConnected: Profile | undefined;
  walletConnected: boolean;
  screenDisplay: ScreenDisplay;
  sortType: SortType;
  setSortType: (e: SetStateAction<SortType>) => void;
  mirror: (index: number, id: string) => Promise<void>;
  like: (index: number, id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    bookmark: boolean;
    hide: boolean;
  }[];
  handleSetDisplay: () => void;
  displayLoading: boolean;
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  display: Display | undefined;
  handleImage: (e: ChangeEvent<HTMLInputElement>, id: string) => Promise<void>;
  coverImage: string | undefined;
  pfpImage: string | undefined;
  followUpdateLoading: boolean;
  handleFollowUpdate: () => Promise<void>;
  followData: {
    type: "FreeFollowModule" | "FeeFollowModule" | "RevertFollowModule";
    value: string | undefined;
    currency: Erc20 | undefined;
  };
  setFollowData: (
    e: SetStateAction<{
      type: "FreeFollowModule" | "FeeFollowModule" | "RevertFollowModule";
      value: string | undefined;
      currency: Erc20 | undefined;
    }>
  ) => void;
  openType: boolean;
  setOpenType: (e: SetStateAction<boolean>) => void;
  currencies: Erc20[];
  setCurrencyOpen: (e: SetStateAction<boolean>) => void;
  currencyOpen: boolean;
  interactionsLoadingBookmark: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    bookmark: boolean;
    simpleCollect: boolean;
    hide: boolean;
  }[];
  hasMoreBookmarks: boolean;
  simpleCollect: (id: string, type: string) => Promise<void>;
  handleMoreBookmarks: () => Promise<void>;
  handleBookmark: (id: string, index: number) => Promise<void>;
  handleHidePost: (id: string, index: number) => Promise<void>;
  bookmarks: (Post | Mirror | Comment | Quote)[];
  bookmarksLoading: boolean;
  mirrorBookmark: (id: string) => Promise<void>;
  likeBookmark: (id: string) => Promise<void>;
  comment: (id: string) => Promise<void>;
  setOpenMirrorChoiceBookmark: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoiceBookmark: boolean[];
  unfollowProfile: (id: string) => Promise<void>;
  followProfile: (id: string) => Promise<void>;
  openMoreOptions: boolean[];
  profileHovers: boolean[];
  setOpenMoreOptions: (e: SetStateAction<boolean[]>) => void;
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  followLoading: boolean[];
  commentsOpen: boolean[];
  setCommentsOpen: (e: SetStateAction<boolean[]>) => void;
  makeComment: MakePostComment[];
  setMakeComment: (e: SetStateAction<MakePostComment[]>) => void;
  makePost: MakePostComment[];
  post: () => Promise<void>;
  setMakePost: (e: SetStateAction<MakePostComment[]>) => void;
  postLoading: boolean[];
  commentContentLoading: {
    image: boolean;
    video: boolean;
  }[];
  postContentLoading: {
    image: boolean;
    video: boolean;
  }[];
  setCommentContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
  setPostContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
};

export type BookmarksProps = {
  bookmarks: (Post | Mirror | Comment | Quote)[];
  bookmarksLoading: boolean;
  hasMoreBookmarks: boolean;
  commentsOpen: boolean[];
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
  setCommentsOpen: (e: SetStateAction<boolean[]>) => void;
  makeComment: MakePostComment[];
  setMakeComment: (e: SetStateAction<MakePostComment[]>) => void;
  simpleCollect: (id: string, type: string) => Promise<void>;
  handleMoreBookmarks: () => Promise<void>;
  handleBookmark: (id: string, index: number) => Promise<void>;
  handleHidePost: (id: string, index: number) => Promise<void>;
  mirror: (id: string) => Promise<void>;
  comment: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    bookmark: boolean;
    comment: boolean;
    hide: boolean;
    simpleCollect: boolean;
  }[];
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  openMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  unfollowProfile: (id: string) => Promise<void>;
  followProfile: (id: string) => Promise<void>;
  followLoading: boolean[];
  setOpenMoreOptions: (e: SetStateAction<boolean[]>) => void;
  openMoreOptions: boolean[];
  postCollectGif: PostCollectGifState;
};

export enum ScreenDisplay {
  Display,
  Gallery,
  Circuits,
  Bookmarks,
  Post,
  Orders,
  Sales,
  Settings,
  Messages,
}

export enum SortType {
  Community,
  Private,
  Public,
}

export type BioProps = {
  profile: Profile | undefined;
  dispatch: Dispatch<AnyAction>;
};

export type GalleryScreenProps = {
  handleMedia: (e: ChangeEvent<HTMLInputElement>, id: string) => Promise<void>;
  dropDetails: {
    collectionIds: string[];
    title: string;
    cover: string;
    dropId: string;
  };
  allCollections: Creation[];
  deleteCollection: () => Promise<void>;
  editDrop: () => Promise<void>;
  deleteDrop: () => Promise<void>;
  searchCollection: string;
  setSearchCollection: (e: SetStateAction<string>) => void;
  setDropDetails: (
    e: SetStateAction<{
      collectionIds: string[];
      title: string;
      cover: string;
      dropId: string;
    }>
  ) => void;
  dropsLoading: boolean;
  collectionLoading: boolean;
  allDrops: Drop[];
  createDropLoading: boolean;
  dispatch: Dispatch<AnyAction>;
  filterConstants: FilterValues | undefined;
  creationLoading: boolean;
  isDesigner: boolean;
  lensConnected: Profile | undefined;
  handleSendMessage: (digitalax?: boolean) => Promise<void>;
  digiMessageLoading: boolean;
  setDigiMessage: (e: string) => void;
  digiMessage: string;
  setCreateCase: (e: SetStateAction<string | undefined>) => void;
  createCase: string | undefined;
  collectionDetails: CollectionDetails;
  setCollectionDetails: (e: SetStateAction<CollectionDetails>) => void;
  createCollection: (edit?: boolean) => Promise<void>;
  createDrop: () => Promise<void>;
  router: NextRouter;
  collectionSettings: {
    origin: string;
    media: string;
    microOpen: boolean;
    communityOpen: boolean;
    accessOpen: boolean;
    visibilityOpen: boolean;
    videoAudio: boolean;
    dropOpen: boolean;
  };
  setCollectionSettings: (
    e: SetStateAction<{
      origin: string;
      media: string;
      microOpen: boolean;
      communityOpen: boolean;
      accessOpen: boolean;
      visibilityOpen: boolean;
      videoAudio: boolean;
      dropOpen: boolean;
    }>
  ) => void;
  handlePlayPause: (
    key: string,
    wavesurfer: MutableRefObject<WaveSurfer | null>,
    type: string
  ) => void;
};

export type ScreenSwitchProps = {
  dropsLoading: boolean;
  collectionLoading: boolean;
  searchCollection: string;
  setSearchCollection: (e: SetStateAction<string>) => void;
  setSearchedProfiles: (e: SetStateAction<Profile[]>) => void;
  allDrops: Drop[];
  allCollections: Creation[];
  deleteCollection: () => Promise<void>;
  editDrop: () => Promise<void>;
  deleteDrop: () => Promise<void>;
  createDropLoading: boolean;
  sendMessageLoading: boolean;
  dropDetails: {
    collectionIds: string[];
    title: string;
    cover: string;
    dropId: string;
  };
  selectedUser:
    | {
        address: string;
        handle: string;
        image: string;
      }
    | undefined;
  handleSearchUser: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  searchedProfiles: Profile[];
  userSearch: string;
  setUserSearch: (e: SetStateAction<string>) => void;
  setSelectedUser: (
    e: SetStateAction<
      | {
          address: string;
          handle: string;
          image: string;
        }
      | undefined
    >
  ) => void;
  handleConversations: () => Promise<void>;
  client: Client | undefined;
  conversationsLoading: boolean;
  currentMessage: string;
  setCurrentMessage: (e: SetStateAction<string>) => void;
  conversations: (Conversation & {
    profileImage: string;
    profileHandle: string;
    preview: DecodedMessage;
  })[];
  messages: DecodedMessage[];
  setDropDetails: (
    e: SetStateAction<{
      collectionIds: string[];
      title: string;
      cover: string;
      dropId: string;
    }>
  ) => void;
  collectionSettings: {
    origin: string;
    media: string;
    microOpen: boolean;
    communityOpen: boolean;
    accessOpen: boolean;
    visibilityOpen: boolean;
    videoAudio: boolean;
    dropOpen: boolean;
  };
  lensConnected: Profile | undefined;
  setCollectionSettings: (
    e: SetStateAction<{
      origin: string;
      media: string;
      microOpen: boolean;
      communityOpen: boolean;
      accessOpen: boolean;
      visibilityOpen: boolean;
      videoAudio: boolean;
      dropOpen: boolean;
    }>
  ) => void;
  handlePlayPause: (
    key: string,
    wavesurfer: MutableRefObject<WaveSurfer | null>,
    type: string
  ) => void;
  filterConstants: FilterValues | undefined;
  handleMedia: (e: ChangeEvent<HTMLInputElement>, id: string) => Promise<void>;
  creationLoading: boolean;
  isDesigner: boolean;
  handleSendMessage: (digitalax?: boolean) => Promise<void>;
  digiMessageLoading: boolean;
  setDigiMessage: (e: string) => void;
  digiMessage: string;
  setCreateCase: (e: SetStateAction<string | undefined>) => void;
  createCase: string | undefined;
  collectionDetails: CollectionDetails;
  setCollectionDetails: (e: SetStateAction<CollectionDetails>) => void;
  createCollection: (edit?: boolean) => Promise<void>;
  createDrop: () => Promise<void>;
  screenDisplay: ScreenDisplay;
  bookmarks: (Post | Mirror | Comment | Quote)[];
  bookmarksLoading: boolean;
  allOrders: Order[];
  ordersLoading: boolean;
  orderActions: {
    decryptLoading: boolean;
    decrypted: boolean;
    orderOpen: boolean;
  }[];
  setOrderActions: (
    e: SetStateAction<
      {
        decryptLoading: boolean;
        decrypted: boolean;
        orderOpen: boolean;
      }[]
    >
  ) => void;
  allSales: Sale[];
  salesLoading: boolean;
  decryptOrder: (orderId: string) => void;
  postCollectGif: PostCollectGifState;
  simpleCollect: (id: string, type: string) => Promise<void>;
  handleBookmark: (id: string, index: number) => Promise<void>;
  handleHidePost: (id: string, index: number) => Promise<void>;
  handleMoreBookmarks: () => Promise<void>;
  commentsOpen: boolean[];
  setCommentsOpen: (e: SetStateAction<boolean[]>) => void;
  makeComment: MakePostComment[];
  setMakeComment: (e: SetStateAction<MakePostComment[]>) => void;
  dispatch: Dispatch<AnyAction>;
  owner: boolean;
  interactionsLoadingBookmark: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    bookmark: boolean;
    simpleCollect: boolean;
    hide: boolean;
  }[];
  hasMoreBookmarks: boolean;
  handleSetDisplay: () => void;
  displayLoading: boolean;
  mirror: (index: number, id: string) => Promise<void>;
  like: (index: number, id: string) => Promise<void>;
  setSettingsData: (
    e: SetStateAction<
      ProfileMetadata & {
        microbrands: {
          microbrand: string;
          microbrandCover: string;
        }[];
        tempMicro: {
          microbrand: string | undefined;
          microbrandCover: string | undefined;
        };
      }
    >
  ) => void;
  settingsData: ProfileMetadata & {
    microbrands: {
      microbrand: string;
      microbrandCover: string;
    }[];
    tempMicro: {
      microbrand: string | undefined;
      microbrandCover: string | undefined;
    };
  };
  handleSettingsUpdate: () => Promise<void>;
  settingsUpdateLoading: boolean;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    bookmark: boolean;
    hide: boolean;
  }[];
  makePost: MakePostComment[];
  post: () => Promise<void>;
  setMakePost: (e: SetStateAction<MakePostComment[]>) => void;
  postLoading: boolean[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  sortType: SortType;
  display: Display | undefined;
  handleImage: (e: ChangeEvent<HTMLInputElement>, id: string) => Promise<void>;
  coverImage: string | undefined;
  pfpImage: string | undefined;
  followUpdateLoading: boolean;
  handleFollowUpdate: () => Promise<void>;
  followData: {
    type: "FreeFollowModule" | "FeeFollowModule" | "RevertFollowModule";
    value: string | undefined;
    currency: Erc20 | undefined;
  };
  setFollowData: (
    e: SetStateAction<{
      type: "FreeFollowModule" | "FeeFollowModule" | "RevertFollowModule";
      value: string | undefined;
      currency: Erc20 | undefined;
    }>
  ) => void;
  openType: boolean;
  setOpenType: (e: SetStateAction<boolean>) => void;
  currencies: Erc20[];
  setCurrencyOpen: (e: SetStateAction<boolean>) => void;
  currencyOpen: boolean;
  mirrorBookmark: (id: string) => Promise<void>;
  likeBookmark: (id: string) => Promise<void>;
  comment: (id: string) => Promise<void>;
  setOpenMirrorChoiceBookmark: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoiceBookmark: boolean[];
  unfollowProfile: (id: string) => Promise<void>;
  followProfile: (id: string) => Promise<void>;
  openMoreOptions: boolean[];
  profileHovers: boolean[];
  setOpenMoreOptions: (e: SetStateAction<boolean[]>) => void;
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  followLoading: boolean[];
  router: NextRouter;
  setPostContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
  postContentLoading: {
    image: boolean;
    video: boolean;
  }[];
  setCommentContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
  commentContentLoading: {
    image: boolean;
    video: boolean;
  }[];
};

export type SettingsProps = {
  isDesigner: boolean;
  setSettingsData: (
    e: SetStateAction<
      ProfileMetadata & {
        microbrands: {
          microbrand: string;
          microbrandCover: string;
        }[];
        tempMicro: {
          microbrand: string | undefined;
          microbrandCover: string | undefined;
        };
      }
    >
  ) => void;
  settingsData: ProfileMetadata & {
    microbrands: {
      microbrand: string;
      microbrandCover: string;
    }[];
    tempMicro: {
      microbrand: string | undefined;
      microbrandCover: string | undefined;
    };
  };
  handleSettingsUpdate: () => Promise<void>;
  settingsUpdateLoading: boolean;
  handleImage: (e: ChangeEvent<HTMLInputElement>, id: string) => Promise<void>;
  coverImage: string | undefined;
  pfpImage: string | undefined;
  followUpdateLoading: boolean;
  handleFollowUpdate: () => Promise<void>;
  followData: {
    type: "FreeFollowModule" | "FeeFollowModule" | "RevertFollowModule";
    value: string | undefined;
    currency: Erc20 | undefined;
  };
  setFollowData: (
    e: SetStateAction<{
      type: "FreeFollowModule" | "FeeFollowModule" | "RevertFollowModule";
      value: string | undefined;
      currency: Erc20 | undefined;
    }>
  ) => void;
  openType: boolean;
  setOpenType: (e: SetStateAction<boolean>) => void;
  currencies: Erc20[];
  setCurrencyOpen: (e: SetStateAction<boolean>) => void;
  currencyOpen: boolean;
};

export type DisplayProps = {
  mirror: (index: number, id: string) => Promise<void>;
  like: (index: number, id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    bookmark: boolean;
    hide: boolean;
  }[];
  router: NextRouter;
  owner: boolean;
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  sortType: SortType;
  display: Display | undefined;
  dispatch: Dispatch<AnyAction>;
  handleSetDisplay: () => void;
  displayLoading: boolean;
};

export interface CypherProfileData {
  display: Display;
  gallery: {
    private: Creation[];
    community: Creation[];
    public: Creation[];
  };
}

export interface Display {
  private?: {
    main?: Creation;
    side?: Creation[];
  };
  community?: {
    main?: Creation;
    side?: Creation[];
  };
  public?: {
    main?: Creation;
    side?: Creation[];
  };
}

export type PostProps = {
  item: Post | Quote | Mirror | Comment;
};

export type FeedProps = {
  profileFeed: (Post | Quote | Mirror)[];
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  comment: (id: string) => Promise<void>;
  availableCurrencies: Erc20[];
  commentsOpen: boolean[];
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
  setCommentsOpen: (e: SetStateAction<boolean[]>) => void;
  makeComment: MakePostComment[];
  setMakeComment: (e: SetStateAction<MakePostComment[]>) => void;
  openMoreOptions: boolean[];
  hasMoreFeed: boolean;
  setOpenMoreOptions: (e: SetStateAction<boolean[]>) => void;
  simpleCollect: (id: string, type: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    simpleCollect: boolean;
    bookmark: boolean;
    hide: boolean;
  }[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  getMoreFeed: () => Promise<void>;
  router: NextRouter;
  followLoading: boolean[];
  unfollowProfile: (id: string, feed?: boolean) => Promise<void>;
  followProfile: (id: string, feed?: boolean) => Promise<void>;
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  dispatch: Dispatch<AnyAction>;
  postCollectGif: PostCollectGifState;
  handleBookmark: (id: string, index: number) => Promise<void>;
  handleHidePost: (id: string, index: number) => Promise<void>;
};

export type GalleryProps = {
  gallery:
    | {
        collected: Creation[];
        created: Creation[];
      }
    | undefined;
  hasMoreGallery: boolean;
  allDrops: Drop[] | undefined;
  cartItems: CartItem[];
  lensConnected: Profile | undefined;
  dispatch: Dispatch<AnyAction>;
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    bookmark: boolean;
    hide: boolean;
  }[];
  followLoading: boolean[];
  unfollowProfile: (id: string, feed?: boolean) => Promise<void>;
  followProfile: (id: string, feed?: boolean) => Promise<void>;
  router: NextRouter;
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  optionsOpen: boolean;
  setOptionsOpen: (e: SetStateAction<boolean>) => void;
  selectedOption: string;
  handleOptionSelect: (e: string) => void;
  getMoreGallery: () => Promise<void>;
  openInteractions: boolean[];
  setOpenInteractions: (e: SetStateAction<boolean[]>) => void;
};

export type CreationProps = {
  item: Creation;
  index: number;
  dispatch: Dispatch<AnyAction>;
  followLoading: boolean[];
  unfollowProfile: (id: string) => Promise<void>;
  followProfile: (id: string) => Promise<void>;
  router: NextRouter;
  cartItems: CartItem[];
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  created: boolean;
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  openInteractions: boolean[];
  setOpenInteractions: (e: SetStateAction<boolean[]>) => void;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;

    bookmark: boolean;

    hide: boolean;
  };
  mirror: (id: string) => Promise<void>;
  like: (id: string) => Promise<void>;
};

export type PostBarProps = {
  index: number;
  mirror?: (id: string) => Promise<void>;
  like?: (id: string) => Promise<void>;
  simpleCollect?: (id: string, type: string) => Promise<void>;
  handleBookmark?: (id: string, index: number) => Promise<void>;
  handleHidePost?: (id: string, index: number) => Promise<void>;
  item: Post | Quote | Mirror | Comment;
  setOpenMirrorChoice?: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice?: boolean[];
  openMoreOptions?: boolean[];
  commentsOpen: boolean[];
  setCommentsOpen: (e: SetStateAction<boolean[]>) => void;
  disabled?: boolean;
  setOpenMoreOptions?: (e: SetStateAction<boolean[]>) => void;
  interactionsLoading?: {
    like: boolean;
    mirror: boolean;

    simpleCollect: boolean;
    bookmark: boolean;
    hide: boolean;
  };
  router: NextRouter;
  setProfileHovers?: (e: SetStateAction<boolean[]>) => void;
  profileHovers?: boolean[];
  followLoading?: boolean[];
  unfollowProfile?: (id: string) => Promise<void>;
  followProfile?: (id: string) => Promise<void>;
  dispatch: Dispatch<AnyAction>;
};

export type TextProps = {
  item: Post | Quote | Mirror | Comment;
};

export type PostQuoteProps = {
  quote: PrimaryPublication;
};

export type PublicationProps = {
  item: Post | Mirror | Quote | Comment;
  index: number;
  disabled?: boolean;
  postCollectGif?: PostCollectGifState;
  mirror?: (id: string) => Promise<void>;
  like?: (id: string) => Promise<void>;
  comment?: (id: string) => Promise<void>;
  commentsOpen?: boolean[];
  setCommentsOpen?: (e: SetStateAction<boolean[]>) => void;
  makeComment?: MakePostComment[];
  setMakePostComment?: (e: SetStateAction<MakePostComment[]>) => void;
  openMoreOptions?: boolean[];
  setOpenMoreOptions?: (e: SetStateAction<boolean[]>) => void;
  simpleCollect?: (id: string, type: string) => Promise<void>;
  interactionsLoading?: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    simpleCollect: boolean;
    bookmark: boolean;
    hide: boolean;
  }[];
  setOpenMirrorChoice?: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice?: boolean[];
  router: NextRouter;
  followLoading?: boolean[];
  unfollowProfile?: (id: string, feed?: boolean) => Promise<void>;
  followProfile?: (id: string, feed?: boolean) => Promise<void>;
  profileHovers?: boolean[];
  setProfileHovers?: (e: SetStateAction<boolean[]>) => void;
  dispatch: Dispatch<AnyAction>;
  handleBookmark?: (id: string, index: number) => Promise<void>;
  handleHidePost?: (id: string, index: number) => Promise<void>;
  setContentLoading?: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
  contentLoading?: {
    image: boolean;
    video: boolean;
  }[];
};

export interface MakePostComment {
  content: string | undefined;
  images: {
    media: string;
    type: string;
  }[];
  videos: string[];
}

export type PostCommentProps = {
  makePostComment: MakePostComment;
  postCollectGif: PostCollectGifState;
  setMakePostComment: (e: SetStateAction<MakePostComment[]>) => void;
  commentPost: ((id: string) => Promise<void>) | (() => Promise<void>);
  commentPostLoading: boolean;
  id: string;
  height: string;
  dispatch: Dispatch<AnyAction>;
  imageHeight: string;
  imageWidth: string;
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
  };
  index: number;
};

export type ScreenPostProps = {
  makePost: MakePostComment[];
  post: () => Promise<void>;
  dispatch: Dispatch<AnyAction>;
  postCollectGif: PostCollectGifState;
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

export type CollectOptionsProps = {
  id: string;
  type: string;
  dispatch: Dispatch<AnyAction>;
  collectTypes:
    | {
        [key: string]: SimpleCollectOpenActionModuleInput | undefined;
      }
    | undefined;
  gifs:
    | {
        [key: string]: string[] | undefined;
      }
    | undefined;
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
};

export interface EncryptedDetails {
  ciphertext: string;
  dataToEncryptHash: string;
  accessControlConditions: AccessControlConditions | undefined;
}

export interface Details {
  name: string;
  contact: string;
  address: string;
  zip: string;
  city: string;
  state: string;
  country: string;
  colors: string[];
  sizes: string[];
}

export interface Order {
  orderId: string;
  totalPrice: string;
  currency: string;
  pubId: string;
  profileId: string;
  buyer: string;
  blockTimestamp: string;
  transactionHash: string;
  images: string[];
  names: string[];
  messages: string[];
  details: Details | EncryptedDetails | string;
  subOrders: Sub[];
  decrypted: boolean;
}

export type OrdersProps = {
  allOrders: Order[];
  ordersLoading: boolean;
  orderActions: {
    decryptLoading: boolean;
    decrypted: boolean;
    orderOpen: boolean;
  }[];
  router: NextRouter;
  setOrderActions: (
    e: SetStateAction<
      {
        decryptLoading: boolean;
        decrypted: boolean;
        orderOpen: boolean;
      }[]
    >
  ) => void;
  decryptOrder: (orderId: string) => void;
};

export type SubOrderProps = {
  item: Sub;
  router: NextRouter;
  decrypted: boolean;
};

export interface Sub {
  price: string;
  status: string;
  collection: {
    name: string;
    image: string;
    origin: string;
    pubId: string;
  };
  isFulfilled: boolean;
  fulfillerAddress: string;
  amount: string;
  color?: string;
  size?: string;
}

export type SalesProps = {
  allSales: Sale[];
  salesLoading: boolean;
  router: NextRouter;
};

export interface Sale {
  orderId: string;
  pubId: string;
  profileId: string;
  type: string;
  transactionHash: string;
  currency: string;
  buyer: Profile;
  price: string;
  images: string[];
  blockTimestamp: string;
}

export type DispatchProps = {
  collectionDetails: CollectionDetails;
  setCollectionDetails: (e: SetStateAction<CollectionDetails>) => void;
  allDrops: Drop[];
  dispatch: Dispatch<AnyAction>;
  filterConstants: FilterValues | undefined;
  handleMedia: (e: ChangeEvent<HTMLInputElement>, id: string) => Promise<void>;
  setCreateCase: (e: SetStateAction<string | undefined>) => void;
  lensConnected: Profile | undefined;
  collectionSettings: {
    origin: string;
    media: string;
    microOpen: boolean;
    communityOpen: boolean;
    accessOpen: boolean;
    visibilityOpen: boolean;
    videoAudio: boolean;
    dropOpen: boolean;
  };
  setCollectionSettings: (
    e: SetStateAction<{
      origin: string;
      media: string;
      microOpen: boolean;
      communityOpen: boolean;
      accessOpen: boolean;
      visibilityOpen: boolean;
      videoAudio: boolean;
      dropOpen: boolean;
    }>
  ) => void;
  handlePlayPause: (
    key: string,
    wavesurfer: MutableRefObject<WaveSurfer | null>,
    type: string
  ) => void;
};

export interface CollectionDetails {
  title: string;
  description: string;
  collectionId: string;
  price: string;
  amount: string;
  profileId: string;
  pubId: string;
  acceptedTokens: string[];
  images: { media: string; type: string }[];
  video: string;
  audio: string;
  tags: string;
  prompt: string;
  sizes: string[];
  colors: string[];
  profileHandle: string;
  microbrand: {
    microbrand: string;
    microbrandCover: string;
  };
  access: string;
  drop: string;
  visibility: string;
  communities: string;
}

export type MessagesProps = {
  conversations: (Conversation & {
    profileImage: string;
    profileHandle: string;
    preview: DecodedMessage;
  })[];
  sendMessageLoading: boolean;
  handleSendMessage: () => Promise<void>;
  setUserSearch: (e: SetStateAction<string>) => void;
  setSearchedProfiles: (e: SetStateAction<Profile[]>) => void;
  currentMessage: string;
  setCurrentMessage: (e: SetStateAction<string>) => void;
  selectedUser:
    | {
        address: string;
        handle: string;
        image: string;
      }
    | undefined;
  handleSearchUser: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  searchedProfiles: Profile[];
  userSearch: string;
  setSelectedUser: (
    e: SetStateAction<
      | {
          address: string;
          handle: string;
          image: string;
        }
      | undefined
    >
  ) => void;
  messages: DecodedMessage[];
  handleConversations: () => Promise<void>;
  client: Client | undefined;
  conversationsLoading: boolean;
};

export type SwitchCreateProps = {
  type: string | undefined;
  dispatch: Dispatch<AnyAction>;
  collectionDetails: CollectionDetails;
  setCreateCase: (e: SetStateAction<string | undefined>) => void;
  dropDetails: {
    collectionIds: string[];
    title: string;
    cover: string;
    dropId: string;
  };
  setCollectionDetails: (e: SetStateAction<CollectionDetails>) => void;
  dropsLoading: boolean;
  collectionLoading: boolean;
  allDrops: Drop[];
  allCollections: Creation[];
  setDropDetails: (
    e: SetStateAction<{
      collectionIds: string[];
      title: string;
      cover: string;
      dropId: string;
    }>
  ) => void;
  router: NextRouter;
  filterConstants: FilterValues | undefined;
  handleMedia: (e: ChangeEvent<HTMLInputElement>, id: string) => Promise<void>;
  collectionSettings: {
    origin: string;
    media: string;
    microOpen: boolean;
    communityOpen: boolean;
    accessOpen: boolean;
    visibilityOpen: boolean;
    videoAudio: boolean;
    dropOpen: boolean;
  };
  setCollectionSettings: (
    e: SetStateAction<{
      origin: string;
      media: string;
      microOpen: boolean;
      communityOpen: boolean;
      accessOpen: boolean;
      visibilityOpen: boolean;
      videoAudio: boolean;
      dropOpen: boolean;
    }>
  ) => void;
  handlePlayPause: (
    key: string,
    wavesurfer: MutableRefObject<WaveSurfer | null>,
    type: string
  ) => void;
  lensConnected: Profile | undefined;
};

export type MediaSwitchProps = {
  type: string;
};

export type DropProps = {
  router: NextRouter;
  allDrops: Drop[];
  handle: string;
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

export interface Drop {
  creator: string;
  title: string;
  cover: string;
  dropId: string;
  collectionIds: string[];
}

export type NewConversationProps = {
  messages: DecodedMessage[];
  currentMessage: string;
  setCurrentMessage: (e: SetStateAction<string>) => void;
  handleSendMessage: () => Promise<void>;
  sendMessageLoading: boolean;
  selectedUser:
    | {
        address: string;
        handle: string;
        image: string;
      }
    | undefined;
};

export type WaveFormProps = {
  keyValue: string;
  audio: string;
  video: string;
  type: string;
  handlePlayPause: (
    key: string,
    wavesurfer: MutableRefObject<WaveSurfer | null>,
    type: string
  ) => void;
  upload?: boolean;
  handleMedia?: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
};
