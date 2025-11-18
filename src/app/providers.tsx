"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import {
  createContext,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Context, Post, PublicClient, mainnet } from "@lens-protocol/client";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { StorageClient } from "@lens-chain/storage-client";
import { chains } from "@lens-chain/sdk/viem";
import {
  CartItem,
  Collection,
  DropDown,
  Filter,
  FilterValues,
  FullScreenVideo,
  LensConnected,
  OracleData,
  SearchItems,
  SimpleCollect,
} from "./components/Common/types/common.types";
import { usePathname } from "next/navigation";
import { Indexar } from "./components/Search/types/search.types";
import {
  MediaImageMimeType,
  MediaVideoMimeType,
} from "@lens-protocol/metadata";
import {
  Display,
  ScreenDisplay,
  SortType,
} from "./components/Autograph/types/autograph.types";
import {
  createReactClient,
  studioProvider,
  LivepeerConfig,
} from "@livepeer/react";
import { KinoraProvider } from "kinora-sdk";
import { getApolloLens } from "./lib/lens/client";
import { INFURA_GATEWAY } from "./lib/constants";

export const config = createConfig(
  getDefaultConfig({
    appName: "Cypher Search",
    walletConnectProjectId: process.env
      .NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
    appUrl: "https://cypher.digitalax.xyz",
    appIcon: "https://cypher.digitalax.xyz/favicon.ico",
    chains: [chains.mainnet],
    connectors: [],
    transports: {
      [chains.mainnet.id]: http("https://rpc.lens.xyz"),
    },
    ssr: true,
  })
);

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_STUDIO_KEY!,
  }),
});

const queryClient = new QueryClient();

export const ModalContext = createContext<
  | {
      isDesigner: boolean;
      setIsDesigner: (e: SetStateAction<boolean>) => void;
      displaySearch: number | undefined;
      setDisplaySearch: (e: SetStateAction<number | undefined>) => void;
      sortType: SortType;
      setSortType: (e: SetStateAction<SortType>) => void;
      screenDisplay: ScreenDisplay;
      setScreenDisplay: (e: SetStateAction<ScreenDisplay>) => void;
      setSuccessCheckout: (e: SetStateAction<boolean>) => void;
      successCheckout: boolean;
      gif: {
        open: boolean;
        id?: string;
      };
      setGif: (
        e: SetStateAction<{
          open: boolean;
          id?: string;
        }>
      ) => void;
      collectOptions: {
        open: boolean;
        id?: string;
      };
      setCollectOptions: (
        e: SetStateAction<{
          open: boolean;
          id?: string;
        }>
      ) => void;
      reactBox:
        | {
            id: string;
            type: string;
          }
        | undefined;
      setReactBox: (
        e: SetStateAction<
          | {
              id: string;
              type: string;
            }
          | undefined
        >
      ) => void;
      reportPub: string | undefined;
      setReportPub: (e: SetStateAction<string | undefined>) => void;
      filters: Filter;
      setFilters: (e: SetStateAction<Filter>) => void;
      indexar: Indexar;
      setIndexar: (e: SetStateAction<Indexar>) => void;
      imageViewer:
        | {
            image: string;
            type: string;
          }
        | undefined;
      setImageViewer: (
        e: SetStateAction<
          | {
              image: string;
              type: string;
            }
          | undefined
        >
      ) => void;
      map: boolean;
      setMap: (e: SetStateAction<boolean>) => void;
      filterDropDown: {
        values?: FilterValues;
        state: DropDown;
      };
      setFilterDropDown: (
        e: SetStateAction<{
          values?: FilterValues;
          state: DropDown;
        }>
      ) => void;
      filterConstants: FilterValues | undefined;
      setFilterConstants: (e: SetStateAction<FilterValues | undefined>) => void;
      filterChange: boolean;
      setFilterChange: (e: SetStateAction<boolean>) => void;
      layoutSwitch: number;
      setLayoutSwitch: (e: SetStateAction<number>) => void;
      postBox: {
        open: boolean;
        quote?: Post;
      };
      setPostBox: (
        e: SetStateAction<{
          open: boolean;
          quote?: Post;
        }>
      ) => void;
      cartItems: CartItem[];
      setCartItems: (e: SetStateAction<CartItem[]>) => void;
      signless: boolean;
      postSuccess: { type: string; value: string; id: string } | undefined;
      setPostSuccess: (
        e: SetStateAction<
          { type: string; value: string; id: string } | undefined
        >
      ) => void;
      setSignless: (e: SetStateAction<boolean>) => void;
      oracleData: OracleData[];
      setOracleData: (e: SetStateAction<OracleData[]>) => void;
      setFullScreenVideo: (e: SetStateAction<FullScreenVideo>) => void;
      fullScreenVideo: FullScreenVideo;
      setCrearCuenta: (e: SetStateAction<boolean>) => void;
      crearCuenta: boolean;
      setCartAnim: (e: SetStateAction<boolean>) => void;
      cartAnim: boolean;
      clienteLens: PublicClient<Context> | undefined;
      lensConectado: LensConnected | undefined;
      setLensConectado: (e: SetStateAction<LensConnected | undefined>) => void;
      clienteAlmacenamiento: StorageClient | undefined;
      header: boolean;
      setHeader: (e: SetStateAction<boolean>) => void;
      searchActive: boolean;
      setSearchActive: (e: SetStateAction<boolean>) => void;
      filtersOpen: {
        value: boolean;
        allow: boolean;
      };
      setFiltersOpen: (
        e: SetStateAction<{
          value: boolean;
          allow: boolean;
        }>
      ) => void;
      searchItems: SearchItems;
      setSearchItems: (e: SetStateAction<SearchItems>) => void;
      gates:
        | {
            erc20?: {
              address: string;
              amount: string;
            }[];
            erc721?: Collection[];
            oneOf?: boolean;
          }
        | undefined;
      setGates: (
        e: SetStateAction<
          | {
              erc20?: {
                address: string;
                amount: string;
              }[];
              erc721?: Collection[];
              oneOf?: boolean;
            }
          | undefined
        >
      ) => void;
      questSuccess: boolean;
      setQuestSuccess: (e: SetStateAction<boolean>) => void;
      modalOpen: string | undefined;
      setModalOpen: (e: SetStateAction<string | undefined>) => void;
      postInfo: {
        collectTypes?: {
          [key: string]: SimpleCollect | undefined;
        };
        media?: {
          [key: string]: {
            item: string;
            type: MediaImageMimeType | MediaVideoMimeType;
          }[];
        };
      };
      setPostInfo: (
        e: SetStateAction<{
          collectTypes?: {
            [key: string]: SimpleCollect | undefined;
          };
          media?: {
            [key: string]: {
              item: string;
              type: MediaImageMimeType | MediaVideoMimeType;
            }[];
          };
        }>
      ) => void;
      profileDisplay: Display | undefined;
      setProfileDisplay: (e: SetStateAction<Display | undefined>) => void;
    }
  | undefined
>(undefined);

export default function Providers({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [profileDisplay, setProfileDisplay] = useState<Display>();
  const [map, setMap] = useState<boolean>(false);
  const [questSuccess, setQuestSuccess] = useState<boolean>(false);
  const [gates, setGates] = useState<
    | {
        erc20?: {
          address: string;
          amount: string;
        }[];
        erc721?: Collection[];
        oneOf?: boolean;
      }
    | undefined
  >();
  const [isDesigner, setIsDesigner] = useState<boolean>(false);
  const [reportPub, setReportPub] = useState<string | undefined>();
  const [clienteLens, setClienteLens] = useState<PublicClient>();
  const [oracleData, setOracleData] = useState<OracleData[]>([]);
  const [screenDisplay, setScreenDisplay] = useState<ScreenDisplay>(
    ScreenDisplay.Display
  );
  const [sortType, setSortType] = useState<SortType>(SortType.Public);
  const [postInfo, setPostInfo] = useState<{
    collectTypes?: {
      [key: string]: SimpleCollect | undefined;
    };
    media?: {
      [key: string]: {
        item: string;
        type: MediaImageMimeType | MediaVideoMimeType;
      }[];
    };
  }>({});
  const [filters, setFilters] = useState<Filter>({
    hashtag: "",
    microbrand: "",
    catalog: "",
    access: "",
    format: "",
    origin: "",
    editions: 1,
    available: true,
    fulfiller: "",
    drop: "",
    size: {
      apparel: [],
      poster: [],
      sticker: [],
    },
    color: [],
    price: {
      min: 0,
      max: 500,
    },
    token: "",
    printType: [],
  });
  const [successCheckout, setSuccessCheckout] = useState<boolean>(false);
  const [crearCuenta, setCrearCuenta] = useState<boolean>(false);
  const [filterConstants, setFilterConstants] = useState<FilterValues>();
  const clienteAlmacenamiento = StorageClient.create();
  const [lensConectado, setLensConectado] = useState<LensConnected>();
  const [signless, setSignless] = useState<boolean>(false);
  const [header, setHeader] = useState<boolean>(false);
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<string>();
  const [gif, setGif] = useState<{
    open: boolean;
    id?: string;
  }>({
    open: false,
  });
  const [collectOptions, setCollectOptions] = useState<{
    open: boolean;
    id?: string;
  }>({
    open: false,
  });
  const [imageViewer, setImageViewer] = useState<
    | {
        image: string;
        type: string;
      }
    | undefined
  >();
  const [postSuccess, setPostSuccess] = useState<
    { type: string; value: string; id: string } | undefined
  >();
  const [postBox, setPostBox] = useState<{
    open: boolean;
    quote?: Post;
  }>({
    open: false,
  });
  const [displaySearch, setDisplaySearch] = useState<number | undefined>();
  const [filterDropDown, setFilterDropDown] = useState<{
    values?: FilterValues;
    state: DropDown;
  }>({
    state: {
      hashtag: false,
      microbrand: false,
      catalog: false,
      access: false,
      format: false,
      origin: false,
      size: false,
      price: false,
      token: false,
      fulfiller: false,
    },
  });
  const [indexar, setIndexar] = useState<Indexar>(Indexar.Inactive);
  const [fullScreenVideo, setFullScreenVideo] = useState<FullScreenVideo>({
    open: false,
    allVideos: [],
    index: 0,
  });
  const [searchItems, setSearchItems] = useState<SearchItems>({
    items: [],
    hasMore: true,
    input: "",
    searchLoading: false,
    moreSearchLoading: false,
    moreSearch: false,
  });
  const [reactBox, setReactBox] = useState<
    | {
        id: string;
        type: string;
      }
    | undefined
  >();
  const [cartAnim, setCartAnim] = useState<boolean>(false);
  const [filtersOpen, setFiltersOpen] = useState<{
    value: boolean;
    allow: boolean;
  }>({
    value: false,
    allow: true,
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [filterChange, setFilterChange] = useState<boolean>(false);
  const [layoutSwitch, setLayoutSwitch] = useState<number>(3);

  const apolloClient = useMemo(() => {
    return getApolloLens(
      lensConectado?.sessionClient?.getCredentials()!
    ) as any;
  }, [lensConectado?.sessionClient]);

  useEffect(() => {
    if (!clienteLens) {
      setClienteLens(
        PublicClient.create({
          environment: mainnet,
          storage: window.localStorage,
        })
      );
    }
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            "--ck-font-family": '"Manaspace", cursive',
          }}
        >
          <LivepeerConfig client={livepeerClient}>
            <KinoraProvider
              playerAuthedApolloClient={apolloClient}
              ipfsConfig={{
                uploadEndpoint: `${window.location.origin}/api/ipfs`,
                gateway: INFURA_GATEWAY,
                headers: {},
              }}
            >
              <ModalContext.Provider
                value={{
                  questSuccess,
                  setQuestSuccess,
                  gates,
                  setGates,
                  successCheckout,
                  setSuccessCheckout,
                  profileDisplay,
                  setProfileDisplay,
                  displaySearch,
                  setDisplaySearch,
                  sortType,
                  setSortType,
                  screenDisplay,
                  postSuccess,
                  setPostSuccess,
                  setScreenDisplay,
                  postInfo,
                  setPostInfo,
                  reactBox,
                  setReactBox,
                  reportPub,
                  setReportPub,
                  imageViewer,
                  setImageViewer,
                  indexar,
                  setIndexar,
                  map,
                  setMap,
                  filters,
                  setFilters,
                  filterDropDown,
                  setFilterDropDown,
                  filterConstants,
                  setFilterConstants,
                  postBox,
                  setPostBox,
                  cartAnim,
                  setCartAnim,
                  cartItems,
                  setCartItems,
                  searchItems,
                  setSearchItems,
                  searchActive,
                  setSearchActive,
                  oracleData,
                  setOracleData,
                  fullScreenVideo,
                  setFullScreenVideo,
                  crearCuenta,
                  setCrearCuenta,
                  clienteLens,
                  clienteAlmacenamiento,
                  lensConectado,
                  setLensConectado,
                  signless,
                  setSignless,
                  header,
                  setHeader,
                  filtersOpen,
                  setFiltersOpen,
                  modalOpen,
                  setModalOpen,
                  filterChange,
                  setFilterChange,
                  layoutSwitch,
                  setLayoutSwitch,
                  gif,
                  setGif,
                  collectOptions,
                  setCollectOptions,
                  isDesigner,
                  setIsDesigner,
                }}
              >
                <div
                  className={`relative w-full h-auto flex flex-col ${
                    path?.includes("autograph") ? "bg-black" : "bg-offBlack"
                  }`}
                >
                  {children}
                </div>
              </ModalContext.Provider>
            </KinoraProvider>
          </LivepeerConfig>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
