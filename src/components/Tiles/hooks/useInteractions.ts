import { SetStateAction, useEffect, useState } from "react";
import {
  Mirror,
  Post,
  Comment,
  Quote,
  Profile,
  PublicationStats,
} from "../../../../graphql/generated";
import lensCollect from "../../../../lib/helpers/api/collectPost";
import lensLike from "../../../../lib/helpers/api/likePost";
import lensMirror from "../../../../lib/helpers/api/mirrorPost";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import { Dispatch } from "redux";
import {
  AllSearchItemsState,
  setAllSearchItems,
} from "../../../../redux/reducers/searchItemsSlice";
import errorChoice from "../../../../lib/helpers/errorChoice";
import { Creation } from "../types/tiles.types";

const useInteractions = (
  allSearchItems: AllSearchItemsState | undefined,
  dispatch: Dispatch,
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  lensConnected: Profile | undefined,
  setSuggestedFeed:
    | ((e: SetStateAction<AllSearchItemsState | undefined>) => void)
    | undefined
) => {
  const [openMirrorChoice, setOpenMirrorChoice] = useState<boolean[]>([]);
  const [interactionsLoading, setInteractionsLoading] = useState<
    {
      like: boolean;
      mirror: boolean;
      simpleCollect: boolean;
    }[]
  >([]);

  const like = async (id: string, hasReacted: boolean, creation?: boolean) => {
    if (!lensConnected?.id) return;
    const index = allSearchItems?.items?.findIndex(
      (pub) =>
        (!creation
          ? (pub?.post as Post | Comment | Mirror | Quote)?.id
          : (pub?.post as Creation)?.publication?.id) === id
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
      updateInteractions(
        index!,
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
            index!,
            {
              hasReacted: hasReacted ? false : true,
            },
            "reactions",
            hasReacted ? false : true
          ),
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

      updateInteractions(
        index!,
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
            index!,
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

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], simpleCollect: false };
      return updatedArray;
    });
  };

  const mirror = async (id: string, creation?: boolean) => {
    if (!lensConnected?.id) return;
    const index = allSearchItems?.items?.findIndex(
      (pub) =>
        (!creation
          ? (pub?.post as Post | Comment | Mirror | Quote)?.id
          : (pub?.post as Creation)?.publication?.id) === id
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
      updateInteractions(
        index!,
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
            index!,
            {
              hasMirrored: true,
            },
            "mirrors",
            true
          ),
        dispatch
      );
    }
    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], mirror: false };
      return updatedArray;
    });
  };

  const updateInteractions = (
    index: number,
    valueToUpdate: Object,
    statToUpdate: string,
    increase: boolean
  ) => {
    const newItems = [...(allSearchItems?.items || [])];
    newItems[index] = {
      ...newItems[index],
      post: newItems[index]?.type?.includes("V3")
        ? ({
            ...newItems[index]?.post,
            operations: {
              ...(newItems[index]?.post as Post)?.operations,
              ...valueToUpdate,
            },
            stats: {
              ...(newItems[index]?.post as Post)?.stats,
              [statToUpdate]:
                (newItems[index]?.post as Post)?.stats?.[
                  statToUpdate as keyof PublicationStats
                ] + (increase ? 1 : -1),
            },
          } as Post & { decrypted: any })
        : ({
            ...newItems[index]?.post,
            publication: {
              ...(newItems[index]?.post as Creation)?.publication,
              operations: {
                ...((newItems[index]?.post as Creation)?.publication as Post)
                  ?.operations,
                ...valueToUpdate,
              },
              stats: {
                ...((newItems[index]?.post as Creation)?.publication as Post)
                  ?.stats,
                [statToUpdate]:
                  ((newItems[index]?.post as Creation)?.publication as Post)
                    ?.stats?.[statToUpdate as keyof PublicationStats] +
                  (increase ? 1 : -1),
              },
            },
          } as Creation),
    };
    if (setSuggestedFeed) {
      setSuggestedFeed({
        items: newItems,
        graphCursor: allSearchItems?.graphCursor,
        lensProfileCursor: allSearchItems?.lensProfileCursor,
        lensPubCursor: allSearchItems?.lensPubCursor,
        pubProfileCursor: allSearchItems?.pubProfileCursor,
        hasMore: allSearchItems?.hasMore!,
        searchInput: allSearchItems?.searchInput!,
      });
    } else {
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
    }
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
