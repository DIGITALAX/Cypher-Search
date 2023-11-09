import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LimitType, PublicationType } from "../../../../graphql/generated";
import lensQuote from "../../../../lib/helpers/api/quotePost";
import uploadCommentQuoteContent from "../../../../lib/helpers/uploadCommentQuote";
import { RootState } from "../../../../redux/store";
import lensComment from "../../../../lib/helpers/api/commentPost";
import lensLike from "../../../../lib/helpers/api/likePost";
import lensMirror from "../../../../lib/helpers/api/mirrorPost";
import lensCollect from "../../../../lib/helpers/api/collectPost";
import getPublications from "../../../../graphql/lens/queries/publications";
import { setAutographFeed } from "../../../../redux/reducers/autographFeedSlice";
import { polygon } from "viem/chains";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { useAccount } from "wagmi";
import lensBookmark from "../../../../lib/helpers/api/bookmarkPost";
import lensHide from "../../../../lib/helpers/api/hidePost";

const useFeed = () => {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile?.id
  );
  const lastPostComment = useSelector(
    (state: RootState) => state.app.lastPostCommentReducer
  );
  const lastPostQuote = useSelector(
    (state: RootState) => state.app.lastPostQuoteReducer
  );
  const profileFeed = useSelector(
    (state: RootState) => state.app.autographFeedReducer.feed
  );
  const profile = useSelector(
    (state: RootState) => state.app.autographProfileReducer.profile
  );
  const [openMirrorFeedChoice, setOpenMirrorFeedChoice] = useState<boolean[]>(
    []
  );
  const [openMoreOptions, setOpenMoreOptions] = useState<boolean[]>([]);
  const [hasMoreFeed, setHasMoreFeed] = useState<boolean>(false);
  const [feedLoading, setFeedLoading] = useState<boolean>(false);
  const [interactionsFeedLoading, setInteractionsFeedLoading] = useState<
    {
      like: boolean;
      mirror: boolean;
      quote: boolean;
      comment: boolean;
      simpleCollect: boolean;
      bookmark: boolean;
      hide: boolean;
    }[]
  >([]);
  const [feedCursor, setFeedCursor] = useState<string>();

  const getFeed = async () => {
    setFeedLoading(true);
    try {
      const { data } = await getPublications(
        {
          limit: LimitType.TwentyFive,
          cursor: feedCursor,
          where: {
            from: profile?.id,
            publicationTypes: [
              PublicationType.Post,
              PublicationType.Mirror,
              PublicationType.Quote,
            ],
          },
        },
        lensConnected
      );
      dispatch(setAutographFeed(data?.publications?.items as any));
      setFeedCursor(data?.publications?.pageInfo?.next);
      if (
        data?.publications?.items &&
        data?.publications?.items?.length === 25
      ) {
        setHasMoreFeed(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setFeedLoading(false);
  };

  const getMoreFeed = async () => {
    if (!feedCursor || !hasMoreFeed) return;

    try {
      const { data } = await getPublications(
        {
          limit: LimitType.TwentyFive,
          cursor: feedCursor,
          where: {
            from: profile?.id,
            publicationTypes: [
              PublicationType.Post,
              PublicationType.Mirror,
              PublicationType.Quote,
            ],
          },
        },
        lensConnected
      );
      dispatch(
        setAutographFeed([
          ...profileFeed,
          ...((data?.publications?.items || []) as any),
        ])
      );
      setFeedCursor(data?.publications?.pageInfo?.next);
      if (
        data?.publications?.items &&
        data?.publications?.items?.length === 25
      ) {
        setHasMoreFeed(true);
      } else {
        setHasMoreFeed(false);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const feedComment = async (id: string) => {
    const index = profileFeed?.findIndex((pub) => pub.id === id);
    if (index === -1) {
      return;
    }
    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], comment: true };
      return updatedArray;
    });

    try {
      const contentURI = await uploadCommentQuoteContent(
        lastPostComment.content,
        lastPostComment.images,
        lastPostComment.videos,
        lastPostComment.gifs
      );

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensComment(
        id,
        contentURI!,
        dispatch,
        lastPostComment.collectType,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], comment: false };
      return updatedArray;
    });
  };

  const feedQuote = async (id: string) => {
    const index = profileFeed?.findIndex((pub) => pub.id === id);
    if (index === -1) {
      return;
    }
    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], quote: true };
      return updatedArray;
    });

    try {
      const contentURI = await uploadCommentQuoteContent(
        lastPostQuote.content,
        lastPostQuote.images,
        lastPostQuote.videos,
        lastPostQuote.gifs
      );

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensQuote(
        id,
        contentURI!,
        dispatch,
        lastPostComment.collectType,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], quote: false };
      return updatedArray;
    });
  };

  const feedLike = async (id: string) => {
    const index = profileFeed?.findIndex((pub) => pub.id === id);
    if (index === -1) {
      return;
    }
    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], like: true };
      return updatedArray;
    });

    try {
      await lensLike(id, dispatch);
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], like: false };
      return updatedArray;
    });
  };

  const feedCollect = async (id: string, type: string) => {
    const index = profileFeed?.findIndex((pub) => pub.id === id);
    if (index === -1) {
      return;
    }

    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], simpleCollect: true };
      return updatedArray;
    });

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensCollect(
        id,
        type,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], simpleCollect: false };
      return updatedArray;
    });
  };

  const feedMirror = async (id: string) => {
    const index = profileFeed?.findIndex((pub) => pub.id === id);
    if (index === -1) {
      return;
    }
    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], mirror: true };
      return updatedArray;
    });

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });
      await lensMirror(
        id,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], mirror: false };
      return updatedArray;
    });
  };

  const handleHidePost = async (id: string, index: number) => {
    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], hide: true };
      return updatedArray;
    });
    try {
      await lensHide(id, dispatch);
    } catch (err: any) {
      console.error(err.message);
    }
    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], hide: false };
      return updatedArray;
    });
  };

  const handleBookmark = async (on: string, index: number) => {
    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], bookmark: true };
      return updatedArray;
    });
    try {
      await lensBookmark(on, dispatch);
    } catch (err: any) {
      console.error(err.message);
    }
    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], bookmark: false };
      return updatedArray;
    });
  };

  useEffect(() => {
    if (profileFeed?.length < 1) {
      getFeed();
    }
  }, []);

  useEffect(() => {
    if (profileFeed?.length > 0) {
      setInteractionsFeedLoading(
        Array.from({ length: profileFeed.length }, () => ({
          like: false,
          mirror: false,
          comment: false,
          quote: false,
          simpleCollect: false,
          bookmark: false,
          hide: false,
        }))
      );
      setOpenMirrorFeedChoice(
        Array.from({ length: profileFeed.length }, () => false)
      );
    }
  }, [profileFeed?.length]);

  return {
    interactionsFeedLoading,
    openMirrorFeedChoice,
    feedLoading,
    setOpenMirrorFeedChoice,
    feedComment,
    feedLike,
    feedMirror,
    feedQuote,
    feedCollect,
    getMoreFeed,
    openMoreOptions,
    setOpenMoreOptions,
    handleBookmark,
    handleHidePost,
    hasMoreFeed,
  };
};

export default useFeed;
