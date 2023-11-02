import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Quote,
  Post,
  Mirror,
  LimitType,
  PublicationType,
} from "../../../../graphql/generated";
import lensQuote from "../../../../lib/helpers/api/quotePost";
import uploadCommentQuoteContent from "../../../../lib/helpers/uploadCommentQuote";
import { RootState } from "../../../../redux/store";
import lensComment from "../../../../lib/helpers/api/commentPost";
import lensLike from "../../../../lib/helpers/api/likePost";
import lensMirror from "../../../../lib/helpers/api/mirrorPost";
import lensCollect from "../../../../lib/helpers/api/collectPost";
import getPublications from "../../../../graphql/lens/queries/publications";

const useFeed = () => {
  const dispatch = useDispatch();
  const lastPostComment = useSelector(
    (state: RootState) => state.app.lastPostCommentReducer
  );
  const lastPostQuote = useSelector(
    (state: RootState) => state.app.lastPostCommentReducer
  );
  const profile = useSelector(
    (state: RootState) => state.app.autographProfileReducer.profile
  );
  const [openMirrorFeedChoice, setOpenMirrorFeedChoice] = useState<boolean[]>(
    []
  );
  const [feedLoading, setFeedLoading] = useState<boolean>(false);
  const [interactionsFeedLoading, setInteractionsFeedLoading] = useState<
    {
      like: boolean;
      mirror: boolean;
      quote: boolean;
      comment: boolean;
      collect: boolean;
    }[]
  >([]);
  const [profileFeed, setProfileFeed] = useState<(Post | Quote | Mirror)[]>([]);
  const [feedCursor, setFeedCursor] = useState<string>();

  const getFeed = async () => {
    setFeedLoading(true);
    try {
      const { data } = await getPublications({
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
      });
      setProfileFeed(data?.publications?.items as any);
      setFeedCursor(data?.publications?.pageInfo?.next);
    } catch (err: any) {
      console.error(err.message);
    }
    setFeedLoading(false);
  };

  const getMoreFeed = async () => {
    if (!feedCursor) return;

    try {
      const { data } = await getPublications({
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
      });
      setProfileFeed([
        ...profileFeed,
        ...((data?.publications?.items || []) as any),
      ]);
      setFeedCursor(data?.publications?.pageInfo?.next);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const feedComment = async (index: number, id: string) => {
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

      await lensComment(id, contentURI!, dispatch, lastPostComment.collectType);
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], comment: false };
      return updatedArray;
    });
  };

  const feedQuote = async (index: number, id: string) => {
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

      await lensQuote(id, contentURI!, dispatch, lastPostComment.collectType);
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], quote: false };
      return updatedArray;
    });
  };

  const feedLike = async (index: number, id: string) => {
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

  const feedCollect = async (index: number, id: string, type: string) => {
    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], like: false };
      return updatedArray;
    });

    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], collect: true };
      return updatedArray;
    });

    try {
      await lensCollect(id, type, dispatch);
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], collect: false };
      return updatedArray;
    });
  };

  const feedMirror = async (index: number, id: string) => {
    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], mirror: true };
      return updatedArray;
    });

    try {
      await lensMirror(id, dispatch);
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsFeedLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], mirror: false };
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
          collect: false,
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
    profileFeed,
    getMoreFeed
  };
};

export default useFeed;
