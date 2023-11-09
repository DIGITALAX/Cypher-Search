import { useEffect, useState } from "react";
import {
  Post,
  Comment,
  Mirror,
  Quote,
  Profile,
} from "../../../../graphql/generated";
import lensFollow from "../../../../lib/helpers/api/followProfile";
import lensUnfollow from "../../../../lib/helpers/api/unfollowProfile";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import refetchProfile from "../../../../lib/helpers/api/refetchProfile";
import { Publication } from "../types/tiles.types";
import { Dispatch } from "redux";

const useProfile = (
  allSearchItems: Publication[],
  lensConnected: Profile | undefined,
  dispatch: Dispatch,
  publicClient: PublicClient,
  address: `0x${string}` | undefined
) => {
  const [profileHovers, setProfileHovers] = useState<boolean[]>([]);
  const [followLoading, setFollowLoading] = useState<boolean[]>([]);

  const followProfile = async (id: string) => {
    const index = allSearchItems.findIndex(
      (pub) => (pub.post as Post | Comment | Mirror | Quote)?.id === id
    );
    if (index === -1) {
      return;
    }

    setFollowLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = true;
      return updatedArray;
    });

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensFollow(
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
    setFollowLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = false;
      return updatedArray;
    });
  };

  const unfollowProfile = async (id: string) => {
    const index = allSearchItems.findIndex(
      (pub) => (pub.post as Post | Comment | Mirror | Quote)?.id === id
    );
    if (index === -1) {
      return;
    }

    setFollowLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = true;
      return updatedArray;
    });
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
        clearFollow
      );
      await refetchProfile(dispatch, lensConnected?.id);
    } catch (err: any) {
      console.error(err.message);
    }
    setFollowLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = false;
      return updatedArray;
    });
  };

  useEffect(() => {
    if (allSearchItems.length > 0) {
      setFollowLoading(
        Array.from({ length: allSearchItems.length }, () => false)
      );
      setProfileHovers(
        Array.from({ length: allSearchItems.length }, () => false)
      );
    }
  }, [allSearchItems.length]);

  useEffect(() => {
    setProfileHovers(Array.from({ length: 10 }, () => false));
  }, []);

  return {
    followProfile,
    unfollowProfile,
    followLoading,
    profileHovers,
    setProfileHovers,
    lensConnected,
  };
};

export default useProfile;
