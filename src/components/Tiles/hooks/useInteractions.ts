import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import whoReactedPublication from "../../../../graphql/lens/queries/whoReacted";
import getPublications from "../../../../graphql/lens/queries/publications";
import {
  CommentRankingFilterType,
  LimitType,
  Mirror,
  Post,
  Comment,
  PublicationType,
  Quote,
} from "../../../../graphql/generated";
import { setInteractionsCount } from "../../../../redux/reducers/interactionsCountSlice";
import { setReactBox } from "../../../../redux/reducers/reactBoxSlice";
import uploadCommentQuoteContent from "../../../../lib/helpers/uploadCommentQuote";
import lensCollect from "../../../../lib/helpers/api/collectPost";
import lensLike from "../../../../lib/helpers/api/likePost";
import lensMirror from "../../../../lib/helpers/api/mirrorPost";
import lensQuote from "../../../../lib/helpers/api/quotePost";
import lensComment from "../../../../lib/helpers/api/commentPost";

const useInteractions = () => {
  const dispatch = useDispatch();
  const reactBox = useSelector((state: RootState) => state.app.reactBoxReducer);
  const allSearchItems = useSelector(
    (state: RootState) => state.app.searchItemsReducer.items
  );
  const lastPostQuote = useSelector(
    (state: RootState) => state.app.lastPostQuoteReducer
  );
  const lastPostComment = useSelector(
    (state: RootState) => state.app.lastPostCommentReducer
  );
  const interactionsCount = useSelector(
    (state: RootState) => state.app.interactionsCountReducer
  );
  const [openMirrorChoice, setOpenMirrorChoice] = useState<boolean[]>([]);
  const [interactionsLoading, setInteractionsLoading] = useState<
    {
      like: boolean;
      mirror: boolean;
      quote: boolean;
      comment: boolean;
      collect: boolean;
    }[]
  >([]);

  const like = async (id: string) => {
    const index = allSearchItems.findIndex(
      (pub) => (pub.post as Post | Comment | Mirror | Quote)?.id === id
    );
    if (index === -1) {
      return;
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], like: true };
      return updatedArray;
    });

    try {
      await lensLike(id, dispatch);

      dispatch(
        setInteractionsCount({
          actionLikes: interactionsCount.likes.map((obj, ind) =>
            ind === index ? obj + 1 : obj
          ),
          actionMirrors: interactionsCount.mirrors,
          actionQuotes: interactionsCount.quotes,
          actionCollects: interactionsCount.collects,
          actionComments: interactionsCount.comments,
          actionHasLiked: interactionsCount.hasLiked.map((obj, ind) =>
            ind === index ? true : obj
          ),
          actionHasMirrored: interactionsCount.hasMirrored,
          actionHasCollected: interactionsCount.hasCollected,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], like: false };
      return updatedArray;
    });
  };

  const collect = async (id: string, type: string) => {
    const index = allSearchItems.findIndex(
      (pub) => (pub.post as Post | Comment | Mirror | Quote)?.id === id
    );
    if (index === -1) {
      return;
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], collect: true };
      return updatedArray;
    });

    try {
      await lensCollect(id, type, dispatch);

      dispatch(
        setInteractionsCount({
          actionLikes: interactionsCount.likes,
          actionMirrors: interactionsCount.mirrors,
          actionQuotes: interactionsCount.quotes,
          actionCollects: interactionsCount.collects.map((obj, ind) =>
            ind === index ? obj + 1 : obj
          ),
          actionComments: interactionsCount.comments,
          actionHasLiked: interactionsCount.hasLiked,
          actionHasMirrored: interactionsCount.hasMirrored,
          actionHasCollected: interactionsCount.hasCollected.map((obj, ind) =>
            ind === index ? true : obj
          ),
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], collect: false };
      return updatedArray;
    });
  };

  const mirror = async (id: string) => {
    const index = allSearchItems.findIndex(
      (pub) => (pub.post as Post | Comment | Mirror | Quote)?.id === id
    );
    if (index === -1) {
      return;
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], mirror: true };
      return updatedArray;
    });

    try {
      await lensMirror(id, dispatch);

      dispatch(
        setInteractionsCount({
          actionLikes: interactionsCount.likes,
          actionMirrors: interactionsCount.mirrors.map((obj, ind) =>
            ind === index ? obj + 1 : obj
          ),
          actionQuotes: interactionsCount.quotes,
          actionCollects: interactionsCount.collects,
          actionComments: interactionsCount.comments,
          actionHasLiked: interactionsCount.hasLiked,
          actionHasMirrored: interactionsCount.hasMirrored.map((obj, ind) =>
            ind === index ? true : obj
          ),
          actionHasCollected: interactionsCount.hasCollected,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], mirror: false };
      return updatedArray;
    });
  };

  const quote = async (id: string) => {
    const index = allSearchItems.findIndex(
      (pub) => (pub.post as Post | Comment | Mirror | Quote)?.id === id
    );
    if (index === -1) {
      return;
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], quote: true };
      return updatedArray;
    });

    try {
      const contentURI = await uploadCommentQuoteContent(
        lastPostComment.content,
        lastPostQuote.images,
        lastPostQuote.videos,
        lastPostQuote.gifs
      );

      await lensQuote(id, contentURI!, dispatch, lastPostQuote.collectType);

      dispatch(
        setInteractionsCount({
          actionLikes: interactionsCount.likes,
          actionMirrors: interactionsCount.mirrors,
          actionQuotes: interactionsCount.quotes.map((obj, ind) =>
            ind === index ? obj + 1 : obj
          ),
          actionCollects: interactionsCount.collects,
          actionComments: interactionsCount.comments,
          actionHasLiked: interactionsCount.hasLiked,
          actionHasMirrored: interactionsCount.hasMirrored.map((obj, ind) =>
            ind === index ? true : obj
          ),
          actionHasCollected: interactionsCount.hasCollected,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], quote: false };
      return updatedArray;
    });
  };

  const comment = async (id: string) => {
    const index = allSearchItems.findIndex(
      (pub) => (pub.post as Post | Comment | Mirror | Quote)?.id === id
    );
    if (index === -1) {
      return;
    }

    setInteractionsLoading((prev) => {
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

      dispatch(
        setInteractionsCount({
          actionLikes: interactionsCount.likes,
          actionMirrors: interactionsCount.mirrors,
          actionQuotes: interactionsCount.quotes,
          actionCollects: interactionsCount.collects,
          actionComments: interactionsCount.comments.map((obj, ind) =>
            ind === index ? obj + 1 : obj
          ),
          actionHasLiked: interactionsCount.hasLiked,
          actionHasMirrored: interactionsCount.hasMirrored,
          actionHasCollected: interactionsCount.hasCollected,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], comment: false };
      return updatedArray;
    });
  };

  const showLikes = async (id: string) => {
    if (id === reactBox.like?.id) {
      dispatch(
        setReactBox({
          actionMirror: reactBox.mirror,
          actionQuote: reactBox.quote,
          actionLike: {
            id: "",
            cursor: undefined,
            profiles: undefined,
          },
          actionComment: reactBox.comment,
        })
      );
      return;
    } else {
      try {
        const data = await whoReactedPublication({
          for: id,
          limit: LimitType.TwentyFive,
        });

        dispatch(
          setReactBox({
            actionMirror: reactBox.mirror,
            actionQuote: reactBox.quote,
            actionLike: {
              id: id,
              cursor: data.data?.whoReactedPublication.pageInfo.next,
              profiles: data?.data?.whoReactedPublication?.items,
            },
            actionComment: reactBox.comment,
          })
        );
      } catch (err: any) {
        console.error(err.message);
      }
    }
  };

  const showComments = async (id: string) => {
    if (id === reactBox.comment?.id) {
      dispatch(
        setReactBox({
          actionMirror: reactBox.mirror,
          actionQuote: reactBox.quote,
          actionLike: reactBox.like,
          actionComment: {
            id: "",
            cursor: undefined,
            profiles: undefined,
          },
        })
      );
      return;
    } else {
      try {
        const data = await getPublications({
          limit: LimitType.Fifty,

          where: {
            publicationTypes: [PublicationType.Comment],
            commentOn: {
              id: id,
              ranking: {
                filter: CommentRankingFilterType.Relevant,
              },
            },
          },
        });

        dispatch(
          setReactBox({
            actionMirror: reactBox.mirror,
            actionQuote: reactBox.quote,
            actionLike: reactBox.like,
            actionComment: {
              id: id,
              cursor: data.data?.publications.pageInfo.next,
              profiles: data?.data?.publications?.items,
            },
          })
        );
      } catch (err: any) {
        console.error(err.message);
      }
    }
  };

  const showMirrors = async (id: string) => {
    if (id === reactBox.mirror?.id) {
      dispatch(
        setReactBox({
          actionMirror: {
            id: "",
            cursor: undefined,
            profiles: undefined,
          },
          actionQuote: reactBox.quote,
          actionLike: reactBox.like,
          actionComment: reactBox.comment,
        })
      );
      return;
    } else {
      try {
        const data = await getPublications({
          limit: LimitType.Fifty,
          where: {
            publicationTypes: [PublicationType.Mirror],
            mirrorOn: id,
          },
        });

        dispatch(
          setReactBox({
            actionQuote: reactBox.quote,
            actionMirror: {
              id: id,
              cursor: data.data?.publications.pageInfo.next,
              profiles: data?.data?.publications?.items,
            },
            actionLike: reactBox.like,
            actionComment: reactBox.comment,
          })
        );
      } catch (err: any) {
        console.error(err.message);
      }
    }
  };

  const showQuotes = async (id: string) => {
    if (id === reactBox.quote?.id) {
      dispatch(
        setReactBox({
          actionQuote: {
            id: "",
            cursor: undefined,
            profiles: undefined,
          },
          actionMirror: reactBox.mirror,
          actionLike: reactBox.like,
          actionComment: reactBox.comment,
        })
      );
      return;
    } else {
      try {
        const data = await getPublications({
          limit: LimitType.Fifty,
          where: {
            publicationTypes: [PublicationType.Quote],
            quoteOn: id,
          },
        });

        dispatch(
          setReactBox({
            actionQuote: {
              id: id,
              cursor: data.data?.publications.pageInfo.next,
              profiles: data?.data?.publications?.items,
            },
            actionMirror: reactBox.mirror,
            actionLike: reactBox.like,
            actionComment: reactBox.comment,
          })
        );
      } catch (err: any) {
        console.error(err.message);
      }
    }
  };

  const showMoreLikes = async () => {
    if (!reactBox.like?.cursor) return;

    try {
      const data = await whoReactedPublication({
        for: reactBox.like.id,
        limit: LimitType.TwentyFive,
        cursor: reactBox.like?.cursor,
      });

      dispatch(
        setReactBox({
          actionMirror: reactBox.mirror,
          actionQuote: reactBox.quote,
          actionLike: {
            id: reactBox.like.id,
            cursor: data.data?.whoReactedPublication.pageInfo.next,
            profiles: [
              ...(reactBox.like.profiles || []),
              ...(data?.data?.whoReactedPublication?.items || []),
            ],
          },
          actionComment: reactBox.comment,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showMoreComments = async () => {
    if (!reactBox.comment?.cursor) return;

    try {
      const data = await getPublications({
        limit: LimitType.Fifty,
        cursor: reactBox?.comment?.cursor,
        where: {
          publicationTypes: [PublicationType.Comment],
          commentOn: {
            id: reactBox?.comment?.id,
            ranking: { filter: CommentRankingFilterType.Relevant },
          },
        },
      });

      dispatch(
        setReactBox({
          actionMirror: reactBox.mirror,
          actionLike: reactBox.like,
          actionQuote: reactBox.quote,
          actionComment: {
            id: reactBox?.comment?.id,
            cursor: data.data?.publications.pageInfo.next,
            profiles: [
              ...(reactBox?.comment?.profiles || []),
              ...(data?.data?.publications?.items || []),
            ],
          },
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showMoreMirrors = async () => {
    if (!reactBox.mirror?.cursor) return;

    try {
      const data = await getPublications({
        limit: LimitType.Fifty,
        where: {
          publicationTypes: [PublicationType.Mirror],
          mirrorOn: reactBox.mirror.id,
        },
        cursor: reactBox.mirror.cursor,
      });

      dispatch(
        setReactBox({
          actionQuote: reactBox.quote,
          actionMirror: {
            id: reactBox.mirror.id,
            cursor: data.data?.publications.pageInfo.next,
            profiles: [
              ...(reactBox.mirror.profiles || []),
              ...(data?.data?.publications?.items || []),
            ],
          },
          actionLike: reactBox.like,
          actionComment: reactBox.comment,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showMoreQuotes = async () => {
    if (!reactBox.quote?.cursor) return;

    try {
      const data = await getPublications({
        limit: LimitType.Fifty,
        where: {
          publicationTypes: [PublicationType.Mirror],
          quoteOn: reactBox.quote.id,
        },
        cursor: reactBox.quote.cursor,
      });

      dispatch(
        setReactBox({
          actionMirror: reactBox.mirror,
          actionQuote: {
            id: reactBox.quote.id,
            cursor: data.data?.publications.pageInfo.next,
            profiles: [
              ...(reactBox.quote.profiles || []),
              ...(data?.data?.publications?.items || []),
            ],
          },
          actionLike: reactBox.like,
          actionComment: reactBox.comment,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (allSearchItems.length > 0) {
      setOpenMirrorChoice(
        Array.from({ length: allSearchItems.length }, () => false)
      );
      setInteractionsLoading(
        Array.from({ length: allSearchItems.length }, () => ({
          like: false,
          mirror: false,
          comment: false,
          quote: false,
          collect: false,
        }))
      );
    }
  }, [allSearchItems.length]);

  return {
    mirror,
    like,
    comment,
    quote,
    collect,
    showMoreMirrors,
    showMoreQuotes,
    showMoreLikes,
    showMoreComments,
    showComments,
    showLikes,
    showQuotes,
    showMirrors,
    interactionsLoading,
    setOpenMirrorChoice,
    openMirrorChoice,
  };
};

export default useInteractions;
