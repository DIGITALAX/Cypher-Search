import { useEffect, useState } from "react";
import {
  Mirror,
  Post,
  Comment,
  Quote,
  Profile,
} from "../../../../graphql/generated";
import lensCollect from "../../../../lib/helpers/api/collectPost";
import lensLike from "../../../../lib/helpers/api/likePost";
import lensMirror from "../../../../lib/helpers/api/mirrorPost";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon, polygonMumbai } from "viem/chains";
import { Dispatch } from "redux";
import {
  AllSearchItemsState,
  setAllSearchItems,
} from "../../../../redux/reducers/searchItemsSlice";
import errorChoice from "../../../../lib/helpers/errorChoice";

const useInteractions = (
  allSearchItems: AllSearchItemsState | undefined,
  dispatch: Dispatch,
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  lensConnected: Profile | undefined
) => {
  const [openMirrorChoice, setOpenMirrorChoice] = useState<boolean[]>([]);
  const [interactionsLoading, setInteractionsLoading] = useState<
    {
      like: boolean;
      mirror: boolean;
      simpleCollect: boolean;
    }[]
  >([]);

  const like = async (id: string, hasReacted: boolean) => {
    if (!lensConnected?.id) return;
    const index = allSearchItems?.items?.findIndex(
      (pub) => (pub?.post as Post | Comment | Mirror | Quote)?.id === id
    );
    if (index === -1) {
      return;
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], like: true };
      return updatedArray;
    });

    try {
      await lensLike(id, dispatch, hasReacted);
      updateInteractions(index!, {
        hasReacted: hasReacted ? false : true,
      });
    } catch (err: any) {
      errorChoice(
        err,
        () =>
          updateInteractions(index!, {
            hasReacted: hasReacted ? false : true,
          }),
        dispatch
      );
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], like: false };
      return updatedArray;
    });
  };

  const collect = async (id: string, type: string) => {
    if (!lensConnected?.id) return;
    const index = allSearchItems?.items?.findIndex(
      (pub) => (pub?.post as Post | Comment | Mirror | Quote)?.id === id
    );
    if (index === -1) {
      return;
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], simpleCollect: true };
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

      updateInteractions(index!, {
        hasActed: {
          __typename: "OptimisticStatusResult",
          isFinalisedOnchain: true,
          value: true,
        },
      });
    } catch (err: any) {
      errorChoice(
        err,
        () =>
          updateInteractions(index!, {
            hasActed: {
              __typename: "OptimisticStatusResult",
              isFinalisedOnchain: true,
              value: true,
            },
          }),
        dispatch
      );
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], simpleCollect: false };
      return updatedArray;
    });
  };

  const mirror = async (id: string) => {
    if (!lensConnected?.id) return;
    const index = allSearchItems?.items?.findIndex(
      (pub) => (pub.post as Post | Comment | Mirror | Quote)?.id === id
    );
    if (index === -1) {
      return;
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], mirror: true };
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
      updateInteractions(index!, {
        hasMirrored: true,
      });
    } catch (err: any) {
      errorChoice(
        err,
        () =>
          updateInteractions(index!, {
            hasMirrored: true,
          }),
        dispatch
      );
    }
    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], mirror: false };
      return updatedArray;
    });
  };

  const updateInteractions = (index: number, valueToUpdate: Object) => {
    const newItems = [...(allSearchItems?.items || [])];
    newItems[index] = {
      ...newItems[index],
      post: {
        ...newItems[index].post,
        operations: {
          ...(newItems[index].post as Post).operations,
          ...valueToUpdate,
        },
      } as Post & { decrypted: any },
    };
    dispatch(
      setAllSearchItems({
        actionItems: newItems,
        actionGraphCursor: allSearchItems?.graphCursor,
        actionLensProfileCursor: allSearchItems?.lensProfileCursor,
        actionLensPubCursor: allSearchItems?.lensPubCursor,
        actionPubProfileCursor: allSearchItems?.pubProfileCursor,
        actionHasMore: allSearchItems?.hasMore,
        actionInput: allSearchItems?.searchInput,
      })
    );
  };

  useEffect(() => {
    if (allSearchItems?.items && allSearchItems?.items?.length > 0) {
      setOpenMirrorChoice(
        Array.from({ length: allSearchItems?.items?.length }, () => false)
      );
      setInteractionsLoading(
        Array.from({ length: allSearchItems?.items?.length }, () => ({
          like: false,
          mirror: false,
          quote: false,
          simpleCollect: false,
        }))
      );
    }
  }, [allSearchItems?.items?.length]);

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
