import { MakePostComment } from "@/components/Autograph/types/autograph.types";
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import lensQuote from "../../../../lib/helpers/api/quotePost";
import uploadPostContent from "../../../../lib/helpers/uploadPostContent";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon, polygonMumbai } from "viem/chains";
import {
  PostBoxState,
  setPostBox,
} from "../../../../redux/reducers/postBoxSlice";
import getEnabledCurrencies from "../../../../graphql/lens/queries/enabledCurrencies";
import {
  Erc20,
  FeeFollowModuleSettings,
  LimitType,
  Post,
  Profile,
  PublicationMetadataMainFocusType,
  PublicationType,
  SimpleCollectOpenActionModuleInput,
  VideoMetadataV3,
} from "../../../../graphql/generated";
import { setAvailableCurrencies } from "../../../../redux/reducers/availableCurrenciesSlice";
import { Dispatch } from "redux";
import {
  PostCollectGifState,
  setPostCollectGif,
} from "../../../../redux/reducers/postCollectGifSlice";
import lensFollow from "../../../../lib/helpers/api/followProfile";
import {
  FollowCollectState,
  setFollowCollect,
} from "../../../../redux/reducers/followCollectSlice";
import refetchProfile from "../../../../lib/helpers/api/refetchProfile";
import lensCollect from "../../../../lib/helpers/api/collectPost";
import isApprovedData from "../../../../graphql/lens/mutations/isApproved";
import approveCurrency from "../../../../graphql/lens/mutations/approve";
import handleIndexCheck from "../../../../graphql/lens/queries/indexed";
import lensPost from "../../../../lib/helpers/api/postChain";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";
import { setIndexer } from "../../../../redux/reducers/indexerSlice";
import {
  FullScreenVideoState,
  setFullScreenVideo,
} from "../../../../redux/reducers/fullScreenVideoSlice";
import getPublications from "../../../../graphql/lens/queries/publications";
import { CHROMADIN_ID, INFURA_GATEWAY } from "../../../../lib/constants";
import Draggable from "react-draggable";

const useQuote = (
  availableCurrencies: Erc20[],
  lensConnected: Profile | undefined,
  postCollectGif: PostCollectGifState,
  followCollect: FollowCollectState,
  postBox: PostBoxState,
  dispatch: Dispatch,
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  fullScreenVideo: FullScreenVideoState
) => {
  const videoRef = useRef<null | HTMLVideoElement>(null);
  const wrapperRef = useRef<Draggable | null>(null);
  const [videoLoading, setVideoLoading] = useState<{
    play: boolean;
    next: boolean;
    videos: boolean;
  }>({
    play: false,
    next: false,
    videos: false,
  });
  const [transactionLoading, setTransactionLoading] = useState<boolean>(false);
  const [informationLoading, setInformationLoading] = useState<boolean>(false);
  const [mentionProfiles, setMentionProfiles] = useState<Profile[]>([]);
  const [profilesOpen, setProfilesOpen] = useState<boolean[]>([false]);
  const [caretCoord, setCaretCoord] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [approved, setApproved] = useState<boolean>(true);
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
      postCollectGif?.gifs?.[postBox?.quote?.id]
    )
      return;
    setQuoteLoading([true]);

    try {
      const contentURI = await uploadPostContent(
        makeQuote[0]?.content?.trim() == "" ? " " : makeQuote[0]?.content,
        makeQuote[0]?.images || [],
        makeQuote[0]?.videos || [],
        [],
        postCollectGif.gifs?.[postBox?.quote?.id] || []
      );

      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      if (postBox?.quote) {
        await lensQuote(
          postBox?.quote?.id,
          contentURI?.string!,
          dispatch,
          postCollectGif.collectTypes?.[postBox?.quote?.id]
            ? [
                {
                  collectOpenAction: {
                    simpleCollectOpenAction:
                      postCollectGif.collectTypes?.[postBox?.quote?.id]!,
                  },
                },
              ]
            : undefined,
          address as `0x${string}`,
          clientWallet,
          publicClient,
          () => clearBox()
        );
      } else {
        await lensPost(
          contentURI?.string!,
          dispatch,
          postCollectGif.collectTypes?.[postBox?.quote?.id]
            ? [
                {
                  collectOpenAction: {
                    simpleCollectOpenAction:
                      postCollectGif.collectTypes?.[postBox?.quote?.id]!,
                  },
                },
              ]
            : undefined,
          address as `0x${string}`,
          clientWallet,
          publicClient,
          () => clearBox()
        );
      }

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
      if (
        !err?.messages?.includes("Block at number") &&
        !err?.message?.includes("could not be found")
      ) {
        dispatch(setInteractError(true));
        console.error(err.message);
      } else {
        dispatch(
          setIndexer({
            actionOpen: true,
            actionMessage: "Successfully Indexed",
          })
        );

        setTimeout(() => {
          dispatch(
            setIndexer({
              actionOpen: false,
              actionMessage: undefined,
            })
          );
        }, 3000);
      }
    }

    setQuoteLoading([false]);
  };

  const handlePlayPause = async (): Promise<void> => {
    if (videoLoading?.play) return;
    setVideoLoading((prev) => ({
      ...prev,
      play: true,
    }));
    try {
      const video = videoRef?.current;
      if (video && video.readyState >= 3) {
        if (video?.paused) {
          await video.play();
          dispatch(
            setFullScreenVideo({
              actionOpen: fullScreenVideo?.open,
              actionTime: fullScreenVideo?.currentTime,
              actionDuration: fullScreenVideo?.duration,
              actionIsPlaying: true,
              actionVolume: fullScreenVideo?.volume,
              actionVolumeOpen: fullScreenVideo?.volumeOpen,
              actionAllVideos: fullScreenVideo?.allVideos,
              actionCursor: fullScreenVideo?.cursor,
              actionIndex: fullScreenVideo?.index,
            })
          );
        } else {
          video.pause();
          dispatch(
            setFullScreenVideo({
              actionOpen: fullScreenVideo?.open,
              actionTime: fullScreenVideo?.currentTime,
              actionDuration: fullScreenVideo?.duration,
              actionIsPlaying: false,
              actionVolume: fullScreenVideo?.volume,
              actionVolumeOpen: fullScreenVideo?.volumeOpen,
              actionAllVideos: fullScreenVideo?.allVideos,
              actionCursor: fullScreenVideo?.cursor,
              actionIndex: fullScreenVideo?.index,
            })
          );
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setVideoLoading((prev) => ({
      ...prev,
      play: false,
    }));
  };

  const handleSeek = (e: MouseEvent<HTMLDivElement>): void => {
    const progressRect = e.currentTarget.getBoundingClientRect();
    const seekFraction = (e.clientX - progressRect.left) / progressRect.width;

    const video = videoRef?.current;

    if (video && Number.isFinite(video.duration)) {
      const seekTime = seekFraction * video.duration;
      if (Number.isFinite(seekTime)) {
        video.currentTime = seekTime;
      }
    }
  };

  const handleNextVideo = async (forward: boolean): Promise<void> => {
    setVideoLoading((prev) => ({
      ...prev,
      next: true,
    }));
    try {
      if (
        forward &&
        fullScreenVideo?.index + 1 >= fullScreenVideo?.allVideos?.length
      ) {
        await getVideos(fullScreenVideo?.index + 1);
      } else {
        let index = fullScreenVideo?.index;

        if (forward) {
          index = index + 1;
        } else {
          if (index - 1 < 0) {
            index = fullScreenVideo?.allVideos?.length - 1;
          } else {
            index = index - 1;
          }
        }

        dispatch(
          setFullScreenVideo({
            actionOpen: fullScreenVideo?.open,
            actionTime: 0,
            actionDuration: fullScreenVideo?.duration,
            actionIsPlaying: fullScreenVideo?.isPlaying,
            actionVolume: fullScreenVideo?.volume,
            actionVolumeOpen: fullScreenVideo?.volumeOpen,
            actionAllVideos: fullScreenVideo?.allVideos,
            actionCursor: fullScreenVideo?.cursor,
            actionIndex: index,
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setVideoLoading((prev) => ({
      ...prev,
      next: false,
    }));
  };
  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const video = videoRef?.current;
    const newVolume = parseFloat(e.target.value);
    if (Number.isFinite(newVolume) && video) {
      video.volume = newVolume;
    }
  };

  const getVideos = async (newIndex?: number): Promise<void> => {
    setVideoLoading((prev) => ({
      ...prev,
      videos: true,
    }));
    try {
      const data = await getPublications(
        {
          cursor: fullScreenVideo?.cursor,
          limit: LimitType.Ten,
          where: {
            publicationTypes: [PublicationType.Post],
            from: [CHROMADIN_ID],
            metadata: {
              mainContentFocus: [PublicationMetadataMainFocusType.Video],
            },
          },
        },
        lensConnected?.id
      );

      dispatch(
        setFullScreenVideo({
          actionOpen: fullScreenVideo?.open,
          actionTime: 0,
          actionDuration: fullScreenVideo?.duration,
          actionIsPlaying: fullScreenVideo?.isPlaying,
          actionVolume: fullScreenVideo?.volume,
          actionVolumeOpen: fullScreenVideo?.volumeOpen,
          actionAllVideos: [
            ...fullScreenVideo?.allVideos,
            ...(data?.data?.publications?.items || []),
          ],
          actionCursor: data?.data?.publications?.pageInfo?.next,
          actionIndex: newIndex ? newIndex : 0,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setVideoLoading((prev) => ({
      ...prev,
      videos: false,
    }));
  };

  const getCurrencies = async (): Promise<void> => {
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

  const clearBox = () => {
    setMakeQuote([
      {
        content: "",
        images: [],
        videos: [],
      },
    ]);
    dispatch(
      setPostBox({
        actionOpen: false,
      })
    );
    setQuoteLoading([false]);
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

      if (data && data.approvedModuleAllowanceAmount[0]) {
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
        module: {
          openActionModule:
            (followCollect?.type === "collect" &&
              !followCollect?.collect?.item?.followerOnly) ||
            (followCollect?.type === "collect" &&
              followCollect?.collect?.item?.followerOnly &&
              followCollect?.follower?.operations?.isFollowedByMe?.value)
              ? followCollect?.collect?.item?.type
              : undefined,
          followModule:
            (followCollect?.type === "collect" &&
              followCollect?.collect?.item?.followerOnly &&
              !followCollect?.follower?.operations?.isFollowedByMe?.value) ||
            followCollect?.type === "follow"
              ? followCollect?.follower?.followModule?.type
              : undefined,
        },
      });

      const clientWallet = createWalletClient({
        chain: polygonMumbai,
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
        chain: polygonMumbai,
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

      dispatch(
        setFollowCollect({
          actionType: undefined,
        })
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
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      await lensFollow(
        (followCollect?.type === "collect" &&
          !followCollect?.collect?.item?.followerOnly) ||
          (followCollect?.type === "collect" &&
            followCollect?.collect?.item?.followerOnly &&
            followCollect?.follower?.operations?.isFollowedByMe?.value)
          ? followCollect?.collect?.id
          : followCollect?.follower?.id,
        dispatch,
        followCollect?.follower?.followModule?.__typename !==
          "FeeFollowModuleSettings"
          ? undefined
          : (followCollect?.follower?.followModule as FeeFollowModuleSettings)
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
      await refetchProfile(dispatch, lensConnected?.id, lensConnected?.id);
      if (
        followCollect?.type === "collect" &&
        followCollect?.collect?.item?.followerOnly
      ) {
        dispatch(
          setFollowCollect({
            actionType: "collect",
            actionCollect: {
              id: followCollect?.collect?.id,
              stats: followCollect?.collect?.stats,
              item: followCollect?.collect?.item,
            },
            actionFollower: {
              ...followCollect?.follower,
              operations: {
                ...followCollect?.follower?.operations,
                isFollowedByMe: {
                  ...followCollect?.follower?.operations?.isFollowedByMe,
                  value: true,
                },
              },
            },
          })
        );
      }
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
    if (
      (followCollect.type === "collect" &&
        followCollect?.follower?.followModule?.__typename ==
          "FeeFollowModuleSettings") ||
      (followCollect.type === "follow" &&
        followCollect?.follower?.followModule?.__typename ==
          "FeeFollowModuleSettings") ||
      (followCollect?.type === "collect" &&
        Number(followCollect?.collect?.item?.amount?.value) > 0)
    ) {
      checkCurrencyApproved();
    }
  }, [followCollect.type]);

  useEffect(() => {
    if (postCollectGif.type) {
      setOpenMeasure((prev) => ({
        ...prev,
        collectibleOpen: false,
        collectible:
          postCollectGif.collectTypes?.[postCollectGif?.id!]?.amount?.value ||
          Number(
            postCollectGif.collectTypes?.[postCollectGif?.id!]?.amount?.value
          ) > 0
            ? "Yes"
            : "No",
        award:
          postCollectGif.collectTypes?.[postCollectGif?.id!]?.amount?.value ||
          Number(
            postCollectGif.collectTypes?.[postCollectGif?.id!]?.amount?.value
          )
            ? "Yes"
            : "No",
        whoCollectsOpen: false,
        creatorAwardOpen: false,
        currencyOpen: false,
        editionOpen: false,
        edition: postCollectGif.collectTypes?.[postCollectGif?.id!]
          ?.collectLimit
          ? "Yes"
          : "No",
        timeOpen: false,
        time: postCollectGif.collectTypes?.[postCollectGif?.id!]?.endsAt
          ? "Yes"
          : "No",
      }));
    }
  }, [postCollectGif.type]);

  useEffect(() => {
    if (fullScreenVideo?.open && fullScreenVideo?.allVideos?.length < 1) {
      getVideos();
    }
  }, [fullScreenVideo?.open]);

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
    mentionProfiles,
    setMentionProfiles,
    caretCoord,
    setCaretCoord,
    setProfilesOpen,
    profilesOpen,
    videoLoading,
    handleNextVideo,
    handlePlayPause,
    handleSeek,
    handleVolumeChange,
    wrapperRef,
  };
};

export default useQuote;
