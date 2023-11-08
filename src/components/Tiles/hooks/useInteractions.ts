import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { Mirror, Post, Comment, Quote } from "../../../../graphql/generated";
import { setInteractionsCount } from "../../../../redux/reducers/interactionsCountSlice";
import uploadCommentQuoteContent from "../../../../lib/helpers/uploadCommentQuote";
import lensCollect from "../../../../lib/helpers/api/collectPost";
import lensLike from "../../../../lib/helpers/api/likePost";
import lensMirror from "../../../../lib/helpers/api/mirrorPost";
import lensQuote from "../../../../lib/helpers/api/quotePost";
import lensComment from "../../../../lib/helpers/api/commentPost";
import { useAccount } from "wagmi";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { polygon } from "viem/chains";

const useInteractions = () => {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
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
      simpleCollect: boolean;
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
      updatedArray[index] = { ...updatedArray[index], simpleCollect: false };
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

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensQuote(
        id,
        contentURI!,
        dispatch,
        lastPostQuote.collectType,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );

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
          simpleCollect: false,
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
    interactionsLoading,
    setOpenMirrorChoice,
    openMirrorChoice,
  };
};

export default useInteractions;
