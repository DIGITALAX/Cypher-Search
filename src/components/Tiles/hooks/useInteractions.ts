import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import likePost from "../../../../graphql/lens/mutations/like";
import mirrorPost from "../../../../graphql/lens/mutations/mirror";
import quotePost from "../../../../graphql/lens/mutations/quote";
import commentPost from "../../../../graphql/lens/mutations/comment";
import whoReactedPublication from "../../../../graphql/lens/queries/whoReacted";
import getPublications from "../../../../graphql/lens/queries/publications";
import {
  CommentRankingFilterType,
  LimitType,
  Mirror,
  Post,
  Comment,
  PublicationReactionType,
  PublicationType,
  Quote,
} from "../../../../graphql/generated";
import { setInteractionsCount } from "../../../../redux/reducers/interactionsCountSlice";
import { setReactBox } from "../../../../redux/reducers/reactBoxSlice";
import uploadCommentQuoteContent from "../../../../lib/helpers/uploadCommentQuote";
import pollUntilIndexed from "../../../../graphql/lens/queries/indexed";
import collectPost from "../../../../graphql/lens/mutations/collect";

const useInteractions = () => {
  const dispatch = useDispatch();
  const reactBox = useSelector((state: RootState) => state.app.reactBoxReducer);
  const allSearchItems = useSelector(
    (state: RootState) => state.app.searchItemsReducer.items
  );
  const interactionsCount = useSelector(
    (state: RootState) => state.app.interactionsCountReducer
  );
  const [postComment, setPostComment] = useState<string>("");
  const [postQuote, setPostQuote] = useState<string>("");
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
      const data = await likePost({
        for: id,
        reaction: PublicationReactionType.Upvote,
      });

      if (data?.data?.addReaction.__typename === "RelaySuccess") {
        const result = await pollUntilIndexed({
          forTxId: data?.data?.addReaction?.txId,
        });

        if (result === true) {
        } else {
          console.error(result);
        }
      }

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
      updatedArray[index] = { ...updatedArray[index], like: true };
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
      const data = await collectPost({
        for: id,
        actOn: {
          simpleCollectOpenAction:
            type === "SimpleCollectOpenActionSettings" ? true : undefined,
          multirecipientCollectOpenAction:
            type === "MultirecipientFeeCollectOpenActionSettings"
              ? true
              : undefined,
        },
      });

      if (data?.data?.actOnOpenAction.__typename === "RelaySuccess") {
        const result = await pollUntilIndexed({
          forTxId: data?.data?.actOnOpenAction?.txId,
        });

        if (result === true) {
        } else {
          console.error(result);
        }
      }

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
      updatedArray[index] = { ...updatedArray[index], collect: true };
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
      const data = await mirrorPost({
        mirrorOn: id,
      });

      if (data?.data?.mirrorOnchain.__typename === "RelaySuccess") {
        const result = await pollUntilIndexed({
          forTxId: data?.data?.mirrorOnchain?.txId,
        });

        if (result === true) {
        } else {
          console.error(result);
        }
      }

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
      const contentURI = await uploadCommentQuoteContent(postQuote);

      const data = await quotePost({
        contentURI,
        quoteOn: id,
      });

      if (data?.data?.quoteOnchain.__typename === "RelaySuccess") {
        const result = await pollUntilIndexed({
          forTxId: data?.data?.quoteOnchain?.txId,
        });

        if (result === true) {
        } else {
          console.error(result);
        }
      }

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
      const contentURI = await uploadCommentQuoteContent(postComment);

      const data = await commentPost({
        contentURI,
        commentOn: id,
      });

      if (data?.data?.commentOnchain.__typename === "RelaySuccess") {
        const result = await pollUntilIndexed({
          forTxId: data?.data?.commentOnchain?.txId,
        });

        if (result === true) {
        } else {
          console.error(result);
        }
      }

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
    setPostQuote,
    setPostComment,
    setOpenMirrorChoice,
    openMirrorChoice,
  };
};

export default useInteractions;
