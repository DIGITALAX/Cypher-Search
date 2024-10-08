import { useEffect, useState } from "react";
import {
  Post,
  Mirror,
  Quote,
  Profile,
  Comment,
} from "../../../../graphql/generated";
import { Creation } from "@/components/Tiles/types/tiles.types";
import lensFollow from "../../../../lib/helpers/api/followProfile";
import lensUnfollow from "../../../../lib/helpers/api/unfollowProfile";
import { polygon } from "viem/chains";
import refetchProfile from "../../../../lib/helpers/api/refetchProfile";
import { Dispatch } from "redux";
import { createWalletClient, custom, PublicClient } from "viem";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";
import { setIndexer } from "../../../../redux/reducers/indexerSlice";
import { NextRouter } from "next/router";

const useProfile = (
  profileFeed: (Post | Quote | Mirror | Comment)[] | Creation[],
  galleryItems:
    | {
        collected: Creation[];
        created: Creation[];
      }
    | undefined,
  lensConnected: Profile | undefined,
  dispatch: Dispatch,
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  router: NextRouter,
  t: (key: string | number) => string
) => {
  const [feedProfileHovers, setFeedProfileHovers] = useState<boolean[]>([]);
  const [feedFollowLoading, setFeedFollowLoading] = useState<boolean[]>([]);
  const [hoverPrompt, setHoverPrompt] = useState<boolean>(false);
  const [galleryProfileHovers, setGalleryProfileHovers] = useState<boolean[]>(
    []
  );
  const [galleryFollowLoading, setGalleryFollowLoading] = useState<boolean[]>(
    []
  );
  const [mainFollowLoading, setMainFollowLoading] = useState<boolean[]>([
    false,
  ]);
  const [mainProfileHovers, setMainProfileHovers] = useState<boolean[]>([
    false,
  ]);
  const [openMainMoreOptions, setMainOpenMoreOptions] = useState<boolean[]>([
    false,
  ]);

  const followProfile = async (
    id: string,
    index: number,
    feed?: boolean,
    main?: boolean
  ) => {
    if (!lensConnected?.id) return;
    handleLoaders(true, main!, feed!, index);

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensFollow(
        id,
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
        handleLoaders(false, main!, feed!, index);
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
    handleLoaders(false, main!, feed!, index);
  };

  const unfollowProfile = async (
    id: string,
    index: number,
    feed?: boolean,
    main?: boolean
  ) => {
    if (!lensConnected?.id) return;
    handleLoaders(true, main!, feed!, index);

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
        t
      );
      await refetchProfile(dispatch, lensConnected?.id, lensConnected?.id);
    } catch (err: any) {
      if (err?.message?.includes("User rejected the request")) {
        handleLoaders(false, main!, feed!, index);
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

    handleLoaders(false, main!, feed!, index);
  };

  const handleLoaders = (
    start: boolean,
    main: boolean,
    feed: boolean,
    index: number | undefined
  ) => {
    if (start) {
      if (main) {
        setMainFollowLoading([true]);
      } else if (feed) {
        setFeedFollowLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index!] = true;
          return updatedArray;
        });
      } else {
        setGalleryFollowLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index!] = true;
          return updatedArray;
        });
      }
    } else {
      if (main) {
        setMainFollowLoading([false]);
      } else if (feed) {
        setFeedFollowLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index!] = false;
          return updatedArray;
        });
      } else {
        setGalleryFollowLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index!] = false;
          return updatedArray;
        });
      }
    }
  };

  useEffect(() => {
    if (profileFeed?.length > 0) {
      setFeedFollowLoading(
        Array.from({ length: profileFeed?.length }, () => false)
      );
      setFeedProfileHovers(
        Array.from({ length: profileFeed?.length }, () => false)
      );
    }

    if (
      (galleryItems?.collected && galleryItems?.collected?.length > 0) ||
      (galleryItems?.created && galleryItems?.created?.length > 0)
    ) {
      setGalleryFollowLoading(
        Array.from(
          {
            length:
              galleryItems?.collected?.length ||
              0 + galleryItems?.created?.length ||
              0,
          },
          () => false
        )
      );
      setGalleryProfileHovers(
        Array.from(
          {
            length:
              galleryItems?.collected?.length ||
              0 + galleryItems?.created?.length ||
              0,
          },
          () => false
        )
      );
    } else if (router.asPath?.includes("/item/microbrand/")) {
      setGalleryFollowLoading(
        Array.from(
          {
            length: profileFeed?.length,
          },
          () => false
        )
      );
      setGalleryProfileHovers(
        Array.from(
          {
            length: profileFeed?.length,
          },
          () => false
        )
      );
    }
  }, [
    galleryItems?.collected?.length,
    galleryItems?.created?.length,
    profileFeed?.length,
    router.asPath,
  ]);

  return {
    followProfile,
    unfollowProfile,
    feedFollowLoading,
    galleryFollowLoading,
    feedProfileHovers,
    setFeedProfileHovers,
    galleryProfileHovers,
    setGalleryProfileHovers,
    dispatch,
    mainFollowLoading,
    mainProfileHovers,
    setMainProfileHovers,
    openMainMoreOptions,
    setMainOpenMoreOptions,
    hoverPrompt,
    setHoverPrompt,
  };
};

export default useProfile;
