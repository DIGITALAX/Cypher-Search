import { useEffect, useState } from "react";
import { createWalletClient, custom, PublicClient } from "viem";
import { polygonMumbai } from "viem/chains";
import uploadPostContent from "../../../../lib/helpers/uploadPostContent";
import lensComment from "../../../../lib/helpers/api/commentPost";
import lensLike from "../../../../lib/helpers/api/likePost";
import lensCollect from "../../../../lib/helpers/api/collectPost";
import lensBookmark from "../../../../lib/helpers/api/bookmarkPost";
import lensHide from "../../../../lib/helpers/api/hidePost";
import lensMirror from "../../../../lib/helpers/api/mirrorPost";
import {
  LimitType,
  Mirror,
  Post,
  Quote,
  Comment,
  Profile,
  PublicationStats,
} from "../../../../graphql/generated";
import bookmarks from "../../../../graphql/lens/queries/bookmarks";
import { MakePostComment, ScreenDisplay } from "../types/autograph.types";
import lensFollow from "../../../../lib/helpers/api/followProfile";
import refetchProfile from "../../../../lib/helpers/api/refetchProfile";
import lensUnfollow from "../../../../lib/helpers/api/unfollowProfile";
import { Dispatch } from "redux";
import {
  PostCollectGifState,
  setPostCollectGif,
} from "../../../../redux/reducers/postCollectGifSlice";
import { decryptPost } from "../../../../lib/helpers/decryptPost";
import errorChoice from "../../../../lib/helpers/errorChoice";

const useBookmarks = (
  lensConnected: Profile | undefined,
  postCollectGif: PostCollectGifState,
  screenDisplay: ScreenDisplay,
  dispatch: Dispatch,
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  pageProfile: Profile | undefined
) => {
  const [allBookmarks, setAllBookmarks] = useState<
    ((Post | Comment | Quote | Mirror) & {
      decrypted: any;
    })[]
  >([]);
  const [mentionProfilesBookmark, setMentionProfilesBookmark] = useState<
    Profile[]
  >([]);
  const [profilesOpenBookmark, setProfilesOpenBookmark] = useState<boolean[]>(
    []
  );
  const [caretCoordBookmark, setCaretCoordBookmark] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [openMirrorChoiceBookmark, setOpenMirrorChoiceBookmark] = useState<
    boolean[]
  >([]);
  const [makeCommentBookmark, setMakeCommentBookmark] = useState<
    MakePostComment[]
  >([]);
  const [commentsBookmarkOpen, setCommentsBookmarkOpen] = useState<boolean[]>(
    []
  );
  const [decryptLoadingBookmark, setDecryptLoadingBookmark] = useState<
    boolean[]
  >([]);
  const [openMoreOptionsBookmark, setOpenMoreOptionsBookmark] = useState<
    boolean[]
  >([]);
  const [profileHovers, setProfileHovers] = useState<boolean[]>([]);
  const [followLoading, setFollowLoading] = useState<boolean[]>([]);
  const [interactionsLoadingBookmark, setInteractionsLoadingBookmark] =
    useState<
      {
        like: boolean;
        mirror: boolean;
        comment: boolean;
        simpleCollect: boolean;
        bookmark: boolean;
        hide: boolean;
      }[]
    >([]);
  const [bookmarkCursor, setBookmarkCursor] = useState<string>();
  const [hasMoreBookmarks, setHasMoreBookmarks] = useState<boolean>(false);
  const [bookmarksLoading, setBookmarksLoading] = useState<boolean>(false);

  const getBookmarks = async () => {
    setBookmarksLoading(true);
    try {
      const { data } = await bookmarks({
        limit: LimitType.Ten,
      });
      setBookmarkCursor(data?.publicationBookmarks?.pageInfo?.next);
      setAllBookmarks(
        data?.publicationBookmarks?.items as ((
          | Post
          | Comment
          | Mirror
          | Quote
        ) & {
          decrypted: any;
        })[]
      );
      if (
        data?.publicationBookmarks?.items &&
        data?.publicationBookmarks?.items?.length == 10
      ) {
        setHasMoreBookmarks(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setBookmarksLoading(false);
  };

  const handleMoreBookmarks = async () => {
    if (!hasMoreBookmarks) return;
    setBookmarksLoading(true);
    try {
      const { data } = await bookmarks({
        limit: LimitType.Ten,
        cursor: bookmarkCursor,
      });
      setBookmarkCursor(data?.publicationBookmarks?.pageInfo?.next);
      setAllBookmarks([
        ...allBookmarks,
        ...(data?.publicationBookmarks?.items as ((
          | Post
          | Comment
          | Mirror
          | Quote
        ) & {
          decrypted: any;
        })[]),
      ]);
      if (
        data?.publicationBookmarks?.items &&
        data?.publicationBookmarks?.items?.length === 10
      ) {
        setHasMoreBookmarks(true);
      } else {
        setHasMoreBookmarks(false);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setBookmarksLoading(false);
  };

  const bookmarkComment = async (id: string) => {
    const index = allBookmarks?.findIndex((pub) => pub.id === id);

    if (index === -1) {
      return;
    }
    if (
      !makeCommentBookmark[index]?.content &&
      !makeCommentBookmark[index]?.images &&
      !makeCommentBookmark[index]?.videos &&
      !postCollectGif.gifs?.[id]
    )
      return;

    setInteractionsLoadingBookmark((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], comment: true };
      return updatedArray;
    });

    try {
      const contentURI = await uploadPostContent(
        makeCommentBookmark[index]?.content?.trim() == ""
          ? " "
          : makeCommentBookmark[index]?.content,
        makeCommentBookmark[index]?.images || [],
        makeCommentBookmark[index]?.videos || [],
        [],
        postCollectGif.gifs?.[id] || []
      );

      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      await lensComment(
        id,
        contentURI?.string!,
        dispatch,
        postCollectGif.collectTypes?.[id]
          ? [
              {
                collectOpenAction: {
                  simpleCollectOpenAction: postCollectGif.collectTypes?.[id],
                },
              },
            ]
          : undefined,
        address as `0x${string}`,
        clientWallet,
        publicClient,
        () => clearComment(index)
      );
      const gifs = { ...postCollectGif.gifs };
      delete gifs[id];
      const cts = { ...postCollectGif.collectTypes };
      delete cts[id];
      dispatch(
        setPostCollectGif({
          actionCollectType: cts,
          actionGifs: gifs,
        })
      );
    } catch (err: any) {
      errorChoice(err, () => {}, dispatch);
    }

    setInteractionsLoadingBookmark((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], comment: false };
      return updatedArray;
    });
  };

  const clearComment = (index: number) => {
    setMakeCommentBookmark((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = {
        content: "",
        images: [],
        videos: [],
      };
      return updatedArray;
    });
    setCommentsBookmarkOpen((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = !updatedArray[index];
      return updatedArray;
    });
  };

  const bookmarkMirror = async (id: string) => {
    const index = allBookmarks?.findIndex((pub) => pub.id === id);
    if (index === -1) {
      return;
    }
    setInteractionsLoadingBookmark((prev) => {
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

    setInteractionsLoadingBookmark((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], mirror: false };
      return updatedArray;
    });
  };

  const bookmarkLike = async (id: string, hasReacted: boolean) => {
    const index = allBookmarks?.findIndex((pub) => pub.id === id);
    if (index === -1) {
      return;
    }
    setInteractionsLoadingBookmark((prev) => {
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

    setInteractionsLoadingBookmark((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], like: false };
      return updatedArray;
    });
  };

  const bookmarkCollect = async (id: string, type: string) => {
    const index = allBookmarks?.findIndex((pub) => pub.id === id);
    if (index === -1) {
      return;
    }

    setInteractionsLoadingBookmark((prev) => {
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

    setInteractionsLoadingBookmark((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], simpleCollect: false };
      return updatedArray;
    });
  };

  const handleHidePostForBookmark = async (id: string, index: number) => {
    setInteractionsLoadingBookmark((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], hide: true };
      return updatedArray;
    });
    try {
      await lensHide(id, dispatch);
    } catch (err: any) {
      errorChoice(err, () => {}, dispatch);
    }
    setInteractionsLoadingBookmark((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], hide: false };
      return updatedArray;
    });
  };

  const handleBookmarkForBookmark = async (on: string, index: number) => {
    setInteractionsLoadingBookmark((prev) => {
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
    setInteractionsLoadingBookmark((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], bookmark: false };
      return updatedArray;
    });
  };

  const followProfileBookmark = async (id: string) => {
    const index = allBookmarks?.findIndex((pub) =>
      (pub as Post | Quote | Mirror)?.__typename === "Mirror"
        ? (pub as Mirror).mirrorOn.id
        : (pub as Post | Quote).id
    );
    if (index === -1) {
      return;
    }

    setFollowLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = true;
      return updatedArray;
    });

    try {
      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      await lensFollow(
        id,
        dispatch,
        undefined,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      await refetchProfile(dispatch, lensConnected?.id, lensConnected?.id);
    } catch (err: any) {
      errorChoice(err, () => {}, dispatch);
    }

    setFollowLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = false;
      return updatedArray;
    });
  };

  const unfollowProfileBookmark = async (id: string) => {
    const index = allBookmarks?.findIndex((pub) =>
      (pub as Post | Quote | Mirror)?.__typename === "Mirror"
        ? (pub as Mirror).mirrorOn.id
        : (pub as Post | Quote).id
    );
    if (index === -1) {
      return;
    }

    setFollowLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = true;
      return updatedArray;
    });

    try {
      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      await lensUnfollow(
        id,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      await refetchProfile(dispatch, lensConnected?.id, lensConnected?.id);
    } catch (err: any) {
      errorChoice(err, () => {}, dispatch);
    }

    setFollowLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = false;
      return updatedArray;
    });
  };

  const handleDecryptBookmark = async (post: Post | Quote | Comment) => {
    const index = allBookmarks?.findIndex((item) => (item.id = post.id));
    if (index == -1) {
      return;
    }
    setDecryptLoadingBookmark((prev) => {
      const arr = [...prev];
      arr[index] = true;
      return arr;
    });
    try {
      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      await decryptPost(post, clientWallet, dispatch, setAllBookmarks, false);
    } catch (err: any) {
      console.error(err.message);
    }
    setDecryptLoadingBookmark((prev) => {
      const arr = [...prev];
      arr[index] = false;
      return arr;
    });
  };

  useEffect(() => {
    if (allBookmarks.length > 0) {
      setOpenMirrorChoiceBookmark(
        Array.from({ length: allBookmarks?.length }, () => false)
      );
      setMakeCommentBookmark(
        Array.from({ length: allBookmarks?.length }, () => ({
          content: "",
          images: [],
          videos: [],
        }))
      );
      setCommentsBookmarkOpen(
        Array.from({ length: allBookmarks?.length }, () => false)
      );
      setDecryptLoadingBookmark(
        Array.from({ length: allBookmarks?.length }, () => false)
      );
      setOpenMoreOptionsBookmark(
        Array.from({ length: allBookmarks?.length }, () => false)
      );
      setProfileHovers(
        Array.from({ length: allBookmarks?.length }, () => false)
      );
      setFollowLoading(
        Array.from({ length: allBookmarks?.length }, () => false)
      );
      setInteractionsLoadingBookmark(
        Array.from({ length: allBookmarks?.length }, () => ({
          like: false,
          mirror: false,
          comment: false,
          simpleCollect: false,
          bookmark: false,
          hide: false,
        }))
      );
      setProfilesOpenBookmark(
        Array.from({ length: allBookmarks?.length }, () => false)
      );
    }
  }, [allBookmarks?.length]);

  const updateInteractions = (
    index: number,
    valueToUpdate: Object,
    statToUpdate: string,
    increase: boolean
  ) => {
    const newItems = [...allBookmarks];
    newItems[index] = (
      newItems[index]?.__typename === "Mirror"
        ? {
            ...(newItems[index] as Mirror),
            mirrorOn: {
              ...(newItems[index] as Mirror)?.mirrorOn,
              operations: {
                ...(newItems[index] as Mirror)?.mirrorOn?.operations,
                ...valueToUpdate,
              },
              stats: {
                ...(newItems[index] as Mirror)?.mirrorOn?.stats,
                [statToUpdate]:
                  (newItems[index] as Mirror)?.mirrorOn?.stats?.[
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
    setAllBookmarks(newItems);
  };

  useEffect(() => {
    if (
      screenDisplay === ScreenDisplay.Bookmarks &&
      allBookmarks.length < 1 &&
      address &&
      lensConnected?.handle?.fullHandle === pageProfile?.handle?.fullHandle
    ) {
      getBookmarks();
    }
  }, [screenDisplay, lensConnected?.id]);

  return {
    handleMoreBookmarks,
    openMirrorChoiceBookmark,
    setOpenMirrorChoiceBookmark,
    setOpenMoreOptionsBookmark,
    interactionsLoadingBookmark,
    openMoreOptionsBookmark,
    bookmarksLoading,
    handleBookmarkForBookmark,
    handleHidePostForBookmark,
    bookmarkCollect,
    bookmarkComment,
    bookmarkLike,
    bookmarkMirror,
    hasMoreBookmarks,
    unfollowProfileBookmark,
    setProfileHovers,
    followProfileBookmark,
    profileHovers,
    followLoading,
    allBookmarks,
    setCommentsBookmarkOpen,
    commentsBookmarkOpen,
    makeCommentBookmark,
    setMakeCommentBookmark,
    handleDecryptBookmark,
    decryptLoadingBookmark,
    setCaretCoordBookmark,
    caretCoordBookmark,
    setProfilesOpenBookmark,
    profilesOpenBookmark,
    mentionProfilesBookmark,
    setMentionProfilesBookmark,
  };
};

export default useBookmarks;
