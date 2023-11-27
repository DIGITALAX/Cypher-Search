import { useEffect, useState } from "react";
import {
  LimitType,
  Mirror,
  Post,
  Profile,
  PublicationType,
  Quote,
  Comment,
  PublicationStats,
} from "../../../../graphql/generated";
import uploadPostContent from "../../../../lib/helpers/uploadPostContent";
import lensComment from "../../../../lib/helpers/api/commentPost";
import lensLike from "../../../../lib/helpers/api/likePost";
import lensMirror from "../../../../lib/helpers/api/mirrorPost";
import lensCollect from "../../../../lib/helpers/api/collectPost";
import getPublications from "../../../../graphql/lens/queries/publications";
import { polygon, polygonMumbai } from "viem/chains";
import { createWalletClient, custom } from "viem";
import { PublicClient } from "wagmi";
import lensBookmark from "../../../../lib/helpers/api/bookmarkPost";
import lensHide from "../../../../lib/helpers/api/hidePost";
import { MakePostComment } from "../types/autograph.types";
import { Dispatch } from "redux";
import { PostCollectGifState } from "../../../../redux/reducers/postCollectGifSlice";
import { decryptPost } from "../../../../lib/helpers/decryptPost";
import errorChoice from "../../../../lib/helpers/errorChoice";

const useFeed = (
  lensConnected: Profile | undefined,
  postCollectGif: PostCollectGifState,
  profile: Profile | undefined,
  dispatch: Dispatch,
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  postSuccess: string | undefined
) => {
  const [openMirrorFeedChoice, setOpenMirrorFeedChoice] = useState<boolean[]>(
    []
  );
  const [openMoreOptions, setOpenMoreOptions] = useState<boolean[]>([]);
  const [profileFeed, setProfileFeed] = useState<
    ((Post | Quote | Mirror) & {
      decrypted: any;
    })[]
  >([]);
  const [mentionProfilesFeed, setMentionProfilesFeed] = useState<Profile[]>([]);
  const [profilesOpenFeed, setProfilesOpenFeed] = useState<boolean[]>([]);
  const [caretCoordFeed, setCaretCoordFeed] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [decryptLoading, setDecryptLoading] = useState<boolean[]>([]);
  const [hasMoreFeed, setHasMoreFeed] = useState<boolean>(false);
  const [feedLoading, setFeedLoading] = useState<boolean>(false);
  const [commentsFeedOpen, setCommentsFeedOpen] = useState<boolean[]>([]);
  const [commentContentLoading, setCommentContentLoading] = useState<
    {
      image: boolean;
      video: boolean;
    }[]
  >([]);
  const [makeCommentFeed, setMakeCommentFeed] = useState<MakePostComment[]>([]);
  const [interactionsFeedLoading, setInteractionsFeedLoading] = useState<
    {
      like: boolean;
      mirror: boolean;
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
        lensConnected?.id
      );

      setProfileFeed(
        data?.publications?.items as ((Post | Quote | Mirror) & {
          decrypted: any;
        })[]
      );
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
        lensConnected?.id
      );

      setProfileFeed([
        ...profileFeed,
        ...((data?.publications?.items || []) as any),
      ]);

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
    if (
      !makeCommentFeed[index]?.content &&
      !makeCommentFeed[index]?.images &&
      !makeCommentFeed[index]?.videos &&
      !postCollectGif?.gifs?.[id]
    )
      return;

    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], comment: true };
      return updatedArray;
    });

    try {
      const contentURI = await uploadPostContent(
        makeCommentFeed[index]?.content?.trim() == ""
          ? " "
          : makeCommentFeed[index]?.content,
        makeCommentFeed[index]?.images || [],
        makeCommentFeed[index]?.videos || [],
        [],
        postCollectGif?.gifs?.[id]!
      );

      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      await lensComment(
        id,
        contentURI?.string!,
        dispatch,
        postCollectGif?.collectTypes?.[id]
          ? [
              {
                collectOpenAction: {
                  simpleCollectOpenAction: postCollectGif?.collectTypes?.[id],
                },
              },
            ]
          : undefined,
        address as `0x${string}`,
        clientWallet,
        publicClient,
        () => clearComment(index)
      );
    } catch (err: any) {
      errorChoice(err, () => {}, dispatch);
    }

    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], comment: false };
      return updatedArray;
    });
  };

  const clearComment = (index: number) => {
    setMakeCommentFeed((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = {
        content: "",
        images: [],
        videos: [],
      };
      return updatedArray;
    });
    setCommentsFeedOpen((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = !updatedArray[index];
      return updatedArray;
    });
  };

  const feedLike = async (id: string, hasReacted: boolean) => {
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
      await lensLike(id, dispatch, hasReacted);
      updateInteractions(
        index,
        {
          hasReacted: hasReacted ? false : true,
        },
        "reactions",
        hasReacted ? false : true
      );
    } catch (err: any) {
      errorChoice(
        err,
        () =>
          updateInteractions(
            index,
            {
              hasReacted: hasReacted ? false : true,
            },
            "reactions",
            hasReacted ? false : true
          ),
        dispatch
      );
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
        chain: polygonMumbai,
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
      updateInteractions(
        index,
        {
          hasActed: {
            __typename: "OptimisticStatusResult",
            isFinalisedOnchain: true,
            value: true,
          },
        },
        "countOpenActions",
        true
      );
    } catch (err: any) {
      errorChoice(
        err,
        () =>
          updateInteractions(
            index,
            {
              hasActed: {
                __typename: "OptimisticStatusResult",
                isFinalisedOnchain: true,
                value: true,
              },
            },
            "countOpenActions",
            true
          ),
        dispatch
      );
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
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });
      await lensMirror(
        id,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      updateInteractions(
        index,
        {
          hasMirrored: true,
        },
        "mirrors",
        true
      );
    } catch (err: any) {
      errorChoice(
        err,
        () =>
          updateInteractions(
            index,
            {
              hasMirrored: true,
            },
            "mirrors",
            true
          ),
        dispatch
      );
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
      errorChoice(err, () => {}, dispatch);
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
      updateInteractions(
        index,
        {
          hasBookmarked: true,
        },
        "bookmarks",
        true
      );
    } catch (err: any) {
      errorChoice(
        err,
        () =>
          updateInteractions(
            index,
            {
              hasBookmarked: true,
            },
            "bookmarks",
            true
          ),
        dispatch
      );
    }
    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], bookmark: false };
      return updatedArray;
    });
  };

  const handleDecrypt = async (post: Post | Quote | Comment) => {
    const index = profileFeed?.findIndex((item) => (item.id = post.id));
    if (index == -1) {
      return;
    }
    setDecryptLoading((prev) => {
      const arr = [...prev];
      arr[index] = true;
      return arr;
    });
    try {
      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      await decryptPost(post, clientWallet, dispatch, setProfileFeed, false);
    } catch (err: any) {
      console.error(err.message);
    }
    setDecryptLoading((prev) => {
      const arr = [...prev];
      arr[index] = false;
      return arr;
    });
  };

  const updateInteractions = (
    index: number,
    valueToUpdate: Object,
    statToUpdate: string,
    increase: boolean
  ) => {
    const newItems = [...profileFeed];
    newItems[index] = (
      newItems[index]?.__typename === "Mirror"
        ? {
            ...(newItems[index] as Mirror),
            mirrorOn: {
              ...(newItems[index] as Mirror)?.mirrorOn,
              operations: {
                ...(newItems[index] as Mirror).mirrorOn?.operations,
                ...valueToUpdate,
              },
              stats: {
                ...(newItems[index] as Post).stats,
                [statToUpdate]:
                  (newItems[index] as Post).stats?.[
                    statToUpdate as keyof PublicationStats
                  ] + (increase ? 1 : -1),
              },
            },
          }
        : {
            ...newItems[index],
            operations: {
              ...(newItems[index] as Post).operations,
              ...valueToUpdate,
            },
            stats: {
              ...(newItems[index] as Post).stats,
              [statToUpdate]:
                (newItems[index] as Post).stats?.[
                  statToUpdate as keyof PublicationStats
                ] + (increase ? 1 : -1),
            },
          }
    ) as Post & {
      decrypted: any;
    };
    setProfileFeed(newItems);
  };

  useEffect(() => {
    if (profileFeed?.length < 1 && profile?.id) {
      getFeed();
    }
  }, [profile?.id, lensConnected?.id]);

  useEffect(() => {
    if (postSuccess) {
      getFeed();
    }
  }, [postSuccess]);

  useEffect(() => {
    if (profileFeed?.length > 0) {
      setInteractionsFeedLoading(
        Array.from({ length: profileFeed.length }, () => ({
          like: false,
          mirror: false,
          comment: false,
          simpleCollect: false,
          bookmark: false,
          hide: false,
        }))
      );
      setOpenMoreOptions(
        Array.from({ length: profileFeed.length }, () => false)
      );
      setDecryptLoading(
        Array.from({ length: profileFeed.length }, () => false)
      );
      setCommentsFeedOpen(
        Array.from({ length: profileFeed.length }, () => false)
      );
      setCommentContentLoading(
        Array.from({ length: profileFeed.length }, () => ({
          image: false,
          video: false,
          gif: false,
        }))
      );
      setOpenMirrorFeedChoice(
        Array.from({ length: profileFeed.length }, () => false)
      );
      setMakeCommentFeed(
        Array.from({ length: profileFeed.length }, () => ({
          content: "",
          images: [],
          videos: [],
        }))
      );
      setProfilesOpenFeed(
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
    feedCollect,
    getMoreFeed,
    openMoreOptions,
    setOpenMoreOptions,
    handleBookmark,
    handleHidePost,
    hasMoreFeed,
    makeCommentFeed,
    setMakeCommentFeed,
    commentsFeedOpen,
    setCommentsFeedOpen,
    commentContentLoading,
    setCommentContentLoading,
    profileFeed,
    handleDecrypt,
    decryptLoading,
    setCaretCoordFeed,
    setProfilesOpenFeed,
    setMentionProfilesFeed,
    mentionProfilesFeed,
    profilesOpenFeed,
    caretCoordFeed,
  };
};

export default useFeed;
