import { MakePostComment } from "@/components/Autograph/types/autograph.types";
import { useEffect, useRef, useState } from "react";
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
  FeeFollowModuleSettings,
  LimitType,
  Profile,
  SimpleCollectOpenActionModuleInput,
} from "../../../../graphql/generated";
import { setAvailableCurrencies } from "../../../../redux/reducers/availableCurrenciesSlice";
import { Dispatch } from "redux";
import {
  PostCollectGifState,
  setPostCollectGif,
} from "../../../../redux/reducers/postCollectGifSlice";
import lensFollow from "../../../../lib/helpers/api/followProfile";
import { FollowCollectState } from "../../../../redux/reducers/followCollectSlice";
import refetchProfile from "../../../../lib/helpers/api/refetchProfile";
import lensCollect from "../../../../lib/helpers/api/collectPost";
import isApprovedData from "../../../../graphql/lens/mutations/isApproved";
import approveCurrency from "../../../../graphql/lens/mutations/approve";
import handleIndexCheck from "../../../../graphql/lens/queries/indexed";

const useQuote = (
  availableCurrencies: Erc20[],
  lensConnected: Profile | undefined,
  postCollectGif: PostCollectGifState,
  followCollect: FollowCollectState,
  postBox: PostBoxState,
  dispatch: Dispatch,
  publicClient: PublicClient,
  address: `0x${string}` | undefined
) => {
  const videoRef = useRef<null | HTMLElement>(null);
  const [transactionLoading, setTransactionLoading] = useState<boolean>(false);
  const [informationLoading, setInformationLoading] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);
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
  >({
    followerOnly: false,
  });
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
    timeOpen: boolean;
    time: string;
  }>({
    searchedGifs: [],
    search: "",
    collectibleOpen: false,
    collectible: "Yes",
    award: "",
    whoCollectsOpen: false,
    creatorAwardOpen: false,
    currencyOpen: false,
    editionOpen: false,
    edition: "",
    timeOpen: false,
    time: "",
  });

  const quote = async () => {
    if (
      !makeQuote[0]?.content &&
      !makeQuote[0]?.images &&
      !makeQuote[0]?.videos &&
      postCollectGif.gifs?.[postBox?.quote?.id]
    )
      return;
    setQuoteLoading([true]);

    try {
      const contentURI = await uploadPostContent(
        makeQuote[0]?.content,
        makeQuote[0]?.images!,
        makeQuote[0]?.videos!,
        [],
        postCollectGif.gifs?.[postBox?.quote?.id]!
      );

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensQuote(
        postBox?.quote?.id,
        contentURI!,
        dispatch,
        [
          {
            collectOpenAction: {
              simpleCollectOpenAction:
                postCollectGif.collectTypes?.[postBox?.quote?.id]!,
            },
          },
        ],
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      const gifs = { ...postCollectGif.gifs };
      delete gifs[postBox?.quote?.id];
      const cts = { ...postCollectGif.collectTypes };
      delete cts[postBox?.quote?.id];
      dispatch(
        setPostCollectGif({
          actionCollectType: cts,
          actionGifs: gifs,
        })
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

  const checkCurrencyApproved = async () => {
    setInformationLoading(true);
    try {
      const { data } = await isApprovedData({
        currencies:
          followCollect?.type === "collect"
            ? followCollect?.collect?.item?.amount?.asset.contract.address
            : (followCollect?.follower?.followModule as FeeFollowModuleSettings)
                ?.amount.asset.contract.address,
      });

      if (data) {
        parseInt(data.approvedModuleAllowanceAmount[0].allowance.value) >
        (followCollect?.type === "collect"
          ? parseInt(followCollect?.collect?.item?.amount?.value || "")
          : parseInt(
              (followCollect?.follower?.followModule as FeeFollowModuleSettings)
                ?.amount.value || ""
            ))
          ? setApproved(true)
          : setApproved(false);
      } else {
        setApproved(false);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setInformationLoading(false);
  };

  const approveSpend = async () => {
    setTransactionLoading(true);
    try {
      const { data } = await approveCurrency({
        allowance: {
          currency:
            followCollect?.type === "collect"
              ? followCollect?.collect?.item?.amount?.asset.contract.address!
              : (
                  followCollect?.follower
                    ?.followModule as FeeFollowModuleSettings
                )?.amount.asset.contract.address!,
          value:
            followCollect?.type === "collect"
              ? followCollect?.collect?.item?.amount?.value!
              : (
                  followCollect?.follower
                    ?.followModule as FeeFollowModuleSettings
                )?.amount.value!,
        },
        module: {},
      });

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const res = await clientWallet.sendTransaction({
        to: data?.generateModuleCurrencyApprovalData?.to as `0x${string}`,
        account: data?.generateModuleCurrencyApprovalData
          ?.from as `0x${string}`,
        value: BigInt(data?.generateModuleCurrencyApprovalData?.data as string),
      });
      const tx = await publicClient.waitForTransactionReceipt({ hash: res });
      await handleIndexCheck(
        {
          forTxHash: tx.transactionHash,
        },
        dispatch
      );
      setApproved(true);
    } catch (err: any) {
      console.error(err.message);
    }
    setTransactionLoading(false);
  };

  const handleCollect = async () => {
    setTransactionLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensCollect(
        followCollect?.type === "collect"
          ? followCollect?.collect?.id
          : followCollect?.follower?.id,
        followCollect?.collect?.item?.__typename!,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setTransactionLoading(false);
  };

  const handleFollow = async () => {
    setTransactionLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensFollow(
        followCollect?.type === "collect"
          ? followCollect?.collect?.id
          : followCollect?.follower?.id,
        dispatch,
        (followCollect?.follower?.followModule as FeeFollowModuleSettings)
          ?.amount
          ? {
              feeFollowModule: {
                amount: {
                  currency: (
                    followCollect?.follower
                      ?.followModule as FeeFollowModuleSettings
                  )?.amount.asset.contract.address,
                  value: (
                    followCollect?.follower
                      ?.followModule as FeeFollowModuleSettings
                  )?.amount.value,
                },
              },
            }
          : undefined,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      await refetchProfile(dispatch, lensConnected?.id);
    } catch (err: any) {
      console.error(err.message);
    }
    setTransactionLoading(false);
  };

  useEffect(() => {
    if (availableCurrencies?.length < 1) {
      getCurrencies();
    }
  }, []);

  useEffect(() => {
    if (followCollect.type) {
      checkCurrencyApproved();
    }
  }, [followCollect.type]);

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
    informationLoading,
    transactionLoading,
    handleCollect,
    handleFollow,
    approveSpend,
    approved,
    videoRef,
  };
};

export default useQuote;
