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
import { polygon, polygonMumbai } from "viem/chains";
import refetchProfile from "../../../../lib/helpers/api/refetchProfile";
import { Dispatch } from "redux";
import { createWalletClient, custom, PublicClient } from "viem";

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
  address: `0x${string}` | undefined
) => {
  const [feedProfileHovers, setFeedProfileHovers] = useState<boolean[]>([]);
  const [feedFollowLoading, setFeedFollowLoading] = useState<boolean[]>([]);
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

  const followProfile = async (id: string, feed?: boolean, main?: boolean) => {
    const index = main
      ? undefined
      : (feed
          ? profileFeed
          : [
              ...(galleryItems?.collected || []),
              ...(galleryItems?.created || []),
            ]
        )?.findIndex(
          (pub) =>
            (feed
              ? (pub as Post | Quote | Mirror).__typename === "Mirror"
                ? (pub as Mirror).mirrorOn.id
                : (pub as Post | Quote).id
              : (pub as Creation)?.pubId) === id
        );
    handleLoaders(true, main!, feed!, index);

    try {
      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      await lensFollow(
        id,
        dispatch,
        undefined,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      await refetchProfile(dispatch, lensConnected?.id);
    } catch (err: any) {
      console.error(err.message);
    }
    handleLoaders(false, main!, feed!, index);
  };

  const unfollowProfile = async (
    id: string,
    feed?: boolean,
    main?: boolean
  ) => {
    const index = (
      feed
        ? profileFeed
        : [...(galleryItems?.collected || []), ...(galleryItems?.created || [])]
    )?.findIndex(
      (pub) =>
        (feed
          ? (pub as Post | Quote | Mirror).__typename === "Mirror"
            ? (pub as Mirror).mirrorOn.id
            : (pub as Post | Quote).id
          : (pub as Creation)?.pubId) === id
    );
    handleLoaders(true, main!, feed!, index);

    try {
      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      await lensUnfollow(
        id,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      await refetchProfile(dispatch, lensConnected?.id);
    } catch (err: any) {
      console.error(err.message);
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
      setFeedFollowLoading(
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
      setFeedProfileHovers(
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
    }
  }, [
    galleryItems?.collected?.length,
    galleryItems?.created?.length,
    profileFeed?.length,
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
  };
};

export default useProfile;
