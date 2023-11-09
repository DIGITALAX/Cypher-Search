import { MakePostComment } from "@/components/Autograph/types/autograph.types";
import { useEffect, useState } from "react";
import lensQuote from "../../../../lib/helpers/api/quotePost";
import uploadPostContent from "../../../../lib/helpers/uploadPostContent";
import {
  PublicClient,
  createWalletClient,
  custom,
} from "viem";
import { polygon } from "viem/chains";
import {
  PostBoxState,
  setPostBox,
} from "../../../../redux/reducers/postBoxSlice";
import getEnabledCurrencies from "../../../../graphql/lens/queries/enabledCurrencies";
import { Erc20, LimitType } from "../../../../graphql/generated";
import { setAvailableCurrencies } from "../../../../redux/reducers/availableCurrenciesSlice";
import { Dispatch } from "redux";

const useQuote = (
  availableCurrencies: Erc20[],
  postBox: PostBoxState,
  dispatch: Dispatch,
  publicClient: PublicClient,
  address: `0x${string}` | undefined
) => {
  const [quoteLoading, setQuoteLoading] = useState<boolean[]>([false]);
  const [makeQuote, setMakeQuote] = useState<MakePostComment[]>([
    {
      collectType: undefined,
      content: "",
      images: [],
      videos: [],
      gifs: [],
      searchedGifs: [],
      search: "",
      collectibleOpen: false,
      collectible: "",
      award: "",
      whoCollectsOpen: false,
      creatorAwardOpen: false,
      currencyOpen: false,
    },
  ]);
  const [gifCollectOpen, setGifCollectOpen] = useState<
    {
      gif: boolean;
      collect: boolean;
    }[]
  >([
    {
      gif: false,
      collect: false,
    },
  ]);
  const [quoteContentLoading, setQuoteContentLoading] = useState<
    {
      image: boolean;
      video: boolean;
      gif: boolean;
    }[]
  >([
    {
      image: false,
      video: false,
      gif: false,
    },
  ]);

  const quote = async () => {
    if (
      !makeQuote[0]?.content &&
      !makeQuote[0]?.images &&
      !makeQuote[0]?.videos &&
      !makeQuote[0]?.gifs
    )
      return;
    setQuoteLoading([true]);

    try {
      const contentURI = await uploadPostContent(
        makeQuote[0]?.content,
        makeQuote[0]?.images!,
        makeQuote[0]?.videos!,
        makeQuote[0]?.gifs!
      );

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensQuote(
        postBox?.quote?.id,
        contentURI!,
        dispatch,
        makeQuote[0]?.collectType,
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

  useEffect(() => {
    if (availableCurrencies?.length < 1) {
      getCurrencies;
    }
  }, []);

  return {
    quote,
    quoteLoading,
    setMakeQuote,
    makeQuote,
    quoteContentLoading,
    setQuoteContentLoading,
    gifCollectOpen,
    setGifCollectOpen,
  };
};

export default useQuote;
