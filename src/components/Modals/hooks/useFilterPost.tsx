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
  Post,
  Profile,
  PublicationOperations,
  PublicationStats,
} from "../../../../graphql/generated";
import lensUnfollow from "../../../../lib/helpers/api/unfollowProfile";
import { setIndexer } from "../../../../redux/reducers/indexerSlice";
import lensLike from "../../../../lib/helpers/api/likePost";
import errorChoice from "../../../../lib/helpers/errorChoice";
import lensMirror from "../../../../lib/helpers/api/mirrorPost";
import {
  itemStringToNumber,
  numberToItemTypeMap,
} from "../../../../lib/constants";
import toHexWithLeadingZero from "../../../../lib/helpers/leadingZero";
import collectionFixer from "../../../../lib/helpers/collectionFixer";

const useFilterPost = (
  filtersOpen: FiltersOpenState,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}` | undefined,
  publicClient: PublicClient,
  lensConnected: Profile | undefined,
  t: (key: string | number) => string
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
    if (!lensConnected?.id) return;
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
        publicClient,
        t
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
        dispatch,
        t
      );
    }
    setInteractionsLoading((prev) => {
      const arr = [...prev];
      arr[0] = { ...arr[0], mirror: false };
      return arr;
    });
  };

  const like = async (id: string, hasReacted: boolean) => {
    if (!lensConnected?.id) return;
    setInteractionsLoading((prev) => {
      const arr = [...prev];
      arr[0] = { ...arr[0], like: true };
      return arr;
    });
    try {
      await lensLike(id, dispatch, hasReacted, t);
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
        dispatch,
        t
      );
    }
    setInteractionsLoading((prev) => {
      const arr = [...prev];
      arr[0] = { ...arr[0], like: false };
      return arr;
    });
  };

  const unfollowProfile = async () => {
    if (!lensConnected?.id) return;
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
        publicClient,
        t
      );
      await refetchProfile(dispatch, lensConnected?.id, lensConnected?.id);
    } catch (err: any) {
      if (err?.message?.includes("User rejected the request")) {
        setFollowLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[0] = false;
          return updatedArray;
        });
        return;
      }
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
            actionMessage: t("suc"),
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
    if (!lensConnected?.id) return;
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
        publicClient,
        t
      );
      await refetchProfile(dispatch, lensConnected?.id, lensConnected?.id);
    } catch (err: any) {
      if (err?.message?.includes("User rejected the request")) {
        setFollowLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[0] = false;
          return updatedArray;
        });
        return;
      }
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
            actionMessage: t("suc"),
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
      const origin = ["Chromadin", "CoinOp", "Listener", "F3M"][
        Math.floor(Math.random() * 4)
      ];
      const data = await getOneRandomCollection(itemStringToNumber[origin]);
      if (!data?.data?.collectionCreateds) return;
      const pubData = await getPublication(
        {
          forId: `${toHexWithLeadingZero(
            Number(data?.data?.collectionCreateds?.[0]?.profileId)
          )}-${toHexWithLeadingZero(
            Number(data?.data?.collectionCreateds?.[0]?.pubId)
          )}`,
        },
        lensConnected?.id
      );
      const coll = await collectionFixer(data?.data?.collectionCreateds?.[0]);
      setPublication({
        publishedOn: origin,
        post: {
          ...coll,
          publication: pubData?.data?.publication as Post & {
            decrypted: any;
          },
          profile: pubData?.data?.publication?.by as Profile,
        },
        type: numberToItemTypeMap[Number(itemStringToNumber[origin])],
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
