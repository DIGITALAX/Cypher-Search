import { Creation, Publication } from "@/components/Tiles/types/tiles.types";
import { useEffect, useState } from "react";
import { getOneRandomCollection } from "../../../../graphql/subgraph/queries/getOneCollection";
import getPublication from "../../../../graphql/lens/queries/publication";
import { FiltersOpenState } from "../../../../redux/reducers/filtersOpenSlice";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import lensFollow from "../../../../lib/helpers/api/followProfile";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";
import refetchProfile from "../../../../lib/helpers/api/refetchProfile";
import { AnyAction, Dispatch } from "redux";
import {
  Profile,
  PublicationOperations,
  PublicationStats,
} from "../../../../graphql/generated";
import lensUnfollow from "../../../../lib/helpers/api/unfollowProfile";
import { setIndexer } from "../../../../redux/reducers/indexerSlice";
import lensLike from "../../../../lib/helpers/api/likePost";
import errorChoice from "../../../../lib/helpers/errorChoice";
import lensMirror from "../../../../lib/helpers/api/mirrorPost";

const useFilterPost = (
  filtersOpen: FiltersOpenState,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}` | undefined,
  publicClient: PublicClient,
  lensConnected: Profile | undefined
) => {
  const [publication, setPublication] = useState<Publication>();
  const [popUpOpen, setPopUpOpen] = useState<boolean[]>(
    Array.from(
      {
        length: 1,
      },
      () => false
    )
  );
  const [apparel, setApparel] = useState<boolean[]>(
    Array.from(
      {
        length: 1,
      },
      () => false
    )
  );
  const [interactionsLoading, setInteractionsLoading] = useState<
    {
      like: boolean;
      mirror: boolean;
      simpleCollect: boolean;
    }[]
  >(
    Array.from(
      {
        length: 1,
      },
      () => ({
        like: false,
        mirror: false,
        simpleCollect: false,
      })
    )
  );
  const [profileHovers, setProfileHovers] = useState<boolean[]>([false]);
  const [openMirrorChoice, setOpenMirrorChoice] = useState<boolean[]>(
    Array.from(
      {
        length: 1,
      },
      () => false
    )
  );
  const [followLoading, setFollowLoading] = useState<boolean[]>(
    Array.from(
      {
        length: 1,
      },
      () => false
    )
  );

  const mirror = async (id: string, creation = true) => {
    setInteractionsLoading((prev) => {
      const arr = [...interactionsLoading];
      arr[0] = { ...arr[0], mirror: true };
      return arr;
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
      const arr = [...prev];
      arr[0] = { ...arr[0], mirror: false };
      return arr;
    });
  };

  const like = async (id: string, hasReacted: boolean, creation?: boolean) => {
    setInteractionsLoading((prev) => {
      const arr = [...prev];
      arr[0] = { ...arr[0], like: true };
      return arr;
    });
    try {
      await lensLike(id, dispatch, hasReacted);
      updateInteractions(
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
      const arr = [...prev];
      arr[0] = { ...arr[0], like: false };
      return arr;
    });
  };

  const unfollowProfile = async () => {
    setFollowLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[0] = true;
      return updatedArray;
    });

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensUnfollow(
        (publication?.post as Creation)?.publication?.by?.id,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      await refetchProfile(dispatch, lensConnected?.id, lensConnected?.id);
    } catch (err: any) {
      if (err?.message?.includes("User rejected the request")) return;
      if (
        !err?.messages?.includes("Block at number") &&
        !err?.message?.includes("could not be found")
      ) {
        dispatch(setInteractError(true));
        console.error(err.message);
      } else {
        dispatch(
          setIndexer({
            actionOpen: true,
            actionMessage: "Successfully Indexed",
          })
        );

        setTimeout(() => {
          dispatch(
            setIndexer({
              actionOpen: false,
              actionMessage: undefined,
            })
          );
        }, 3000);
      }
    }

    setFollowLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[0] = false;
      return updatedArray;
    });
  };

  const followProfile = async () => {
    setFollowLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[0] = true;
      return updatedArray;
    });

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensFollow(
        (publication?.post as Creation)?.publication?.by?.id,
        dispatch,
        undefined,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      await refetchProfile(dispatch, lensConnected?.id, lensConnected?.id);
    } catch (err: any) {
      if (err?.message?.includes("User rejected the request")) return;
      if (
        !err?.messages?.includes("Block at number") &&
        !err?.message?.includes("could not be found")
      ) {
        dispatch(setInteractError(true));
        console.error(err.message);
      } else {
        dispatch(
          setIndexer({
            actionOpen: true,
            actionMessage: "Successfully Indexed",
          })
        );

        setTimeout(() => {
          dispatch(
            setIndexer({
              actionOpen: false,
              actionMessage: undefined,
            })
          );
        }, 3000);
      }
    }

    setFollowLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[0] = false;
      return updatedArray;
    });
  };

  const getCollection = async () => {
    try {
      const origin = ["chromadin", "coinop", "listener", "f3m"][
        Math.floor(Math.random() * 3)
      ];
      const data = await getOneRandomCollection(
        origin,
        ["chromadin", "coinop", "listener", "f3m"][
          Math.floor(Math.random() * 3)
        ]
      );
      if (!data?.data?.collectionCreateds) return;
      const pubData = await getPublication(
        {
          forId: data?.data?.collectionCreateds?.[0]?.pubId,
        },
        lensConnected?.id
      );
      setPublication({
        publishedOn: origin,
        post: {
          ...data?.data?.collectionCreateds?.[0],
          publication: pubData?.data?.publication,
        },
        type: "Post",
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (filtersOpen?.value && !publication) {
      getCollection();
    } else {
      setPublication(undefined);
    }
  }, [filtersOpen?.value, lensConnected?.id]);

  const updateInteractions = (
    valueToUpdate: Object,
    statToUpdate: string,
    increase: boolean
  ) => {
    setPublication(
      (prev) =>
        ({
          ...prev,
          post: {
            ...(prev?.post as Creation),
            publication: {
              ...(prev?.post as Creation)?.publication,
              operations: {
                ...(prev?.post as Creation)?.publication?.operations,
                ...valueToUpdate,
              } as PublicationOperations,
              stats: {
                ...(prev?.post as Creation)?.publication?.stats,
                [statToUpdate]:
                  (prev?.post as Creation)?.publication?.stats?.[
                    statToUpdate as keyof PublicationStats
                  ] + (increase ? 1 : -1),
              },
            },
          } as Creation,
        } as Publication)
    );
  };

  return {
    popUpOpen,
    setApparel,
    apparel,
    mirror,
    like,
    setPopUpOpen,
    interactionsLoading,
    openMirrorChoice,
    setOpenMirrorChoice,
    unfollowProfile,
    followProfile,
    followLoading,
    profileHovers,
    setProfileHovers,
    publication,
  };
};

export default useFilterPost;
