import { MakePostComment } from "@/components/Autograph/types/autograph.types";
import { useEffect, useState } from "react";
import lensQuote from "../../../../lib/helpers/api/quotePost";
import uploadPostContent from "../../../../lib/helpers/uploadPostContent";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import {
  PostBoxState,
  setPostBox,
} from "../../../../redux/reducers/postBoxSlice";
import getEnabledCurrencies from "../../../../graphql/lens/queries/enabledCurrencies";
import {
  Erc20,
  LimitType,
  SimpleCollectOpenActionModuleInput,
} from "../../../../graphql/generated";
import { setAvailableCurrencies } from "../../../../redux/reducers/availableCurrenciesSlice";
import { Dispatch } from "redux";
import { PostCollectGifState } from "../../../../redux/reducers/postCollectGifSlice";

const useQuote = (
  availableCurrencies: Erc20[],
  postCollectGif: PostCollectGifState,
  postBox: PostBoxState,
  dispatch: Dispatch,
  publicClient: PublicClient,
  address: `0x${string}` | undefined
) => {
  const [quoteLoading, setQuoteLoading] = useState<boolean[]>([false]);
  const [makeQuote, setMakeQuote] = useState<MakePostComment[]>([
    {
      content: "",
      images: [],
      videos: [],
    },
  ]);
  const [quoteContentLoading, setQuoteContentLoading] = useState<
    {
      image: boolean;
      video: boolean;
    }[]
  >([
    {
      image: false,
      video: false,
    },
  ]);
  const [collects, setCollects] = useState<
    SimpleCollectOpenActionModuleInput | undefined
  >();
  const [searchGifLoading, setSearchGifLoading] = useState<boolean>(false);
  const [openMeasure, setOpenMeasure] = useState<{
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
  }>({
    searchedGifs: [],
    search: "",
    collectibleOpen: false,
    collectible: "",
    award: "",
    whoCollectsOpen: false,
    creatorAwardOpen: false,
    currencyOpen: false,
    editionOpen: false,
    edition: "",
  });

  const quote = async () => {
    if (
      !makeQuote[0]?.content &&
      !makeQuote[0]?.images &&
      !makeQuote[0]?.videos &&
      postCollectGif.gifs?.[postCollectGif.id!]
    )
      return;
    setQuoteLoading([true]);

    try {
      const contentURI = await uploadPostContent(
        makeQuote[0]?.content,
        makeQuote[0]?.images!,
        makeQuote[0]?.videos!,
        postCollectGif.gifs?.[postCollectGif.id!]!
      );

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensQuote(
        postBox?.quote?.id,
        contentURI!,
        dispatch,
        postCollectGif.collectTypes?.[postCollectGif.id!]!,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
    } catch (err: any) {
      console.error(err.message);
    }

    setQuoteLoading([false]);
    dispatch(
      setPostBox({
        actionOpen: false,
      })
    );
  };

  const getCurrencies = async () => {
    try {
      const response = await getEnabledCurrencies({
        limit: LimitType.TwentyFive,
      });
      if (response && response.data) {
        dispatch(setAvailableCurrencies(response.data.currencies.items));
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleGif = async (search: string) => {
    try {
      setSearchGifLoading(true);
      const response = await fetch("/api/giphy", {
        method: "POST",
        body: search,
      });
      const allGifs = await response.json();
      setOpenMeasure((prev) => ({
        ...prev,
        searchedGifs: allGifs?.json?.results,
      }));
      setSearchGifLoading(false);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (availableCurrencies?.length < 1) {
      getCurrencies();
    }
  }, []);

  return {
    quote,
    quoteLoading,
    setMakeQuote,
    makeQuote,
    quoteContentLoading,
    setQuoteContentLoading,
    collects,
    setCollects,
    openMeasure,
    setOpenMeasure,
    searchGifLoading,
    handleGif,
  };
};

export default useQuote;
