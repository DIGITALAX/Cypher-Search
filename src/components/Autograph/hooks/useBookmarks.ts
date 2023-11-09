import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { polygon } from "viem/chains";
import { useAccount } from "wagmi";
import { RootState } from "../../../../redux/store";
import uploadCommentQuoteContent from "../../../../lib/helpers/uploadCommentQuote";
import lensComment from "../../../../lib/helpers/api/commentPost";
import lensQuote from "../../../../lib/helpers/api/quotePost";
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
} from "../../../../graphql/generated";
import bookmarks from "../../../../graphql/lens/queries/bookmarks";
import { ScreenDisplay } from "../types/autograph.types";
import lensFollow from "../../../../lib/helpers/api/followProfile";
import refetchProfile from "../../../../lib/helpers/api/refetchProfile";
import lensUnfollow from "../../../../lib/helpers/api/unfollowProfile";

const useBookmarks = () => {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
  const profileFeed = useSelector(
    (state: RootState) => state.app.autographFeedReducer.feed
  );
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const screenDisplay = useSelector(
    (state: RootState) => state.app.screenDisplayReducer.value
  );
  const lastPostComment = useSelector(
    (state: RootState) => state.app.lastPostCommentReducer
  );
  const lastPostQuote = useSelector(
    (state: RootState) => state.app.lastPostQuoteReducer
  );
  const [allBookmarks, setAllBookmarks] = useState<
    (Post | Comment | Quote | Mirror)[]
  >([]);
  const [openMirrorChoiceBookmark, setOpenMirrorChoiceBookmark] = useState<
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
        quote: boolean;
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
        data?.publicationBookmarks?.items as (Post | Comment | Mirror | Quote)[]
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
        ...(data?.publicationBookmarks?.items as (
          | Post
          | Comment
          | Mirror
          | Quote
        )[]),
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
    const index = profileFeed?.findIndex((pub) => pub.id === id);
    if (index === -1) {
      return;
    }
    setInteractionsLoadingBookmark((prev) => {
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

    setInteractionsLoadingBookmark((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], comment: false };
      return updatedArray;
    });
  };

  const bookmarkQuote = async (id: string) => {
    const index = profileFeed?.findIndex((pub) => pub.id === id);
    if (index === -1) {
      return;
    }
    setInteractionsLoadingBookmark((prev) => {
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

    setInteractionsLoadingBookmark((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], quote: false };
      return updatedArray;
    });
  };

  const bookmarkMirror = async (id: string) => {
    const index = profileFeed?.findIndex((pub) => pub.id === id);
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

    setInteractionsLoadingBookmark((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], mirror: false };
      return updatedArray;
    });
  };

  const bookmarkLike = async (id: string) => {
    const index = profileFeed?.findIndex((pub) => pub.id === id);
    if (index === -1) {
      return;
    }
    setInteractionsLoadingBookmark((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], like: true };
      return updatedArray;
    });

    try {
      await lensLike(id, dispatch);
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsLoadingBookmark((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], like: false };
      return updatedArray;
    });
  };

  const bookmarkCollect = async (id: string, type: string) => {
    const index = profileFeed?.findIndex((pub) => pub.id === id);
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
      console.error(err.message);
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
    } catch (err: any) {
      console.error(err.message);
    }
    setInteractionsLoadingBookmark((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], bookmark: false };
      return updatedArray;
    });
  };

  const followProfileBookmark = async (id: string) => {
    const index = allBookmarks?.findIndex((pub) =>
      (pub as Post | Quote | Mirror).__typename === "Mirror"
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
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensFollow(
        id,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      await refetchProfile(dispatch, lensConnected?.id);
    } catch (err: any) {
      console.error(err.message);
    }

    setFollowLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = false;
      return updatedArray;
    });
  };

  const unfollowProfileBookmark = async (id: string) => {
    const index = allBookmarks?.findIndex((pub) =>
      (pub as Post | Quote | Mirror).__typename === "Mirror"
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
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensUnfollow(
        id,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient,
        clearFollow
      );
      await refetchProfile(dispatch, lensConnected?.id);
    } catch (err: any) {
      console.error(err.message);
    }

    setFollowLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = false;
      return updatedArray;
    });
  };

  useEffect(() => {
    if (screenDisplay === ScreenDisplay.Bookmarks && allBookmarks.length < 1) {
      getBookmarks();
    }
  }, [screenDisplay]);

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
  };
};

export default useBookmarks;
