import { useEffect, useState } from "react";
import { Mirror, Post, Comment, Quote } from "../../../../graphql/generated";
import {
  InteractionsCountState,
  setInteractionsCount,
} from "../../../../redux/reducers/interactionsCountSlice";
import lensCollect from "../../../../lib/helpers/api/collectPost";
import lensLike from "../../../../lib/helpers/api/likePost";
import lensMirror from "../../../../lib/helpers/api/mirrorPost";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon, polygonMumbai } from "viem/chains";
import { Publication } from "../types/tiles.types";
import { Dispatch } from "redux";

const useInteractions = (
  allSearchItems: Publication[],
  interactionsCount: InteractionsCountState | undefined,
  dispatch: Dispatch,
  publicClient: PublicClient,
  address: `0x${string}` | undefined
) => {
  const [openMirrorChoice, setOpenMirrorChoice] = useState<boolean[]>([]);
  const [interactionsLoading, setInteractionsLoading] = useState<
    {
      like: boolean;
      mirror: boolean;
      simpleCollect: boolean;
    }[]
  >([]);

  const like = async (id: string) => {
    const index = allSearchItems?.findIndex(
      (pub) => (pub?.post as Post | Comment | Mirror | Quote)?.id === id
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
          actionLikes: interactionsCount?.likes?.map((obj, ind) =>
            ind === index ? obj + 1 : obj
          ),
          actionMirrors: interactionsCount?.mirrors,
          actionQuotes: interactionsCount?.quotes,
          actionCollects: interactionsCount?.collects,
          actionComments: interactionsCount?.comments,
          actionHasLiked: interactionsCount?.hasLiked?.map((obj, ind) =>
            ind === index ? true : obj
          ),
          actionHasMirrored: interactionsCount?.hasMirrored,
          actionHasCollected: interactionsCount?.hasCollected,
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
    const index = allSearchItems?.findIndex(
      (pub) => (pub?.post as Post | Comment | Mirror | Quote)?.id === id
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

      dispatch(
        setInteractionsCount({
          actionLikes: interactionsCount?.likes,
          actionMirrors: interactionsCount?.mirrors,
          actionQuotes: interactionsCount?.quotes,
          actionCollects: interactionsCount?.collects?.map((obj, ind) =>
            ind === index ? obj + 1 : obj
          ),
          actionComments: interactionsCount?.comments,
          actionHasLiked: interactionsCount?.hasLiked,
          actionHasMirrored: interactionsCount?.hasMirrored,
          actionHasCollected: interactionsCount?.hasCollected?.map((obj, ind) =>
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
    const index = allSearchItems?.findIndex(
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

      dispatch(
        setInteractionsCount({
          actionLikes: interactionsCount?.likes,
          actionMirrors: interactionsCount?.mirrors?.map((obj, ind) =>
            ind === index ? obj + 1 : obj
          ),
          actionQuotes: interactionsCount?.quotes,
          actionCollects: interactionsCount?.collects,
          actionComments: interactionsCount?.comments,
          actionHasLiked: interactionsCount?.hasLiked,
          actionHasMirrored: interactionsCount?.hasMirrored?.map((obj, ind) =>
            ind === index ? true : obj
          ),
          actionHasCollected: interactionsCount?.hasCollected,
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

  useEffect(() => {
    if (allSearchItems?.length > 0) {
      setOpenMirrorChoice(
        Array.from({ length: allSearchItems?.length }, () => false)
      );
      setInteractionsLoading(
        Array.from({ length: allSearchItems?.length }, () => ({
          like: false,
          mirror: false,
          quote: false,
          simpleCollect: false,
        }))
      );
    }
  }, [allSearchItems?.length]);

  return {
    mirror,
    like,
    collect,
    interactionsLoading,
    setOpenMirrorChoice,
    openMirrorChoice,
  };
};

export default useInteractions;
