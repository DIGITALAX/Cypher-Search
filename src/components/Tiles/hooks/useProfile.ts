import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { Post, Comment, Mirror, Quote } from "../../../../graphql/generated";
import lensFollow from "../../../../lib/helpers/api/followProfile";
import lensUnfollow from "../../../../lib/helpers/api/unfollowProfile";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { polygon } from "viem/chains";
import { useAccount } from "wagmi";
import refetchProfile from "../../../../lib/helpers/api/refetchProfile";

const useProfile = () => {
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
  const dispatch = useDispatch();
  const { address } = useAccount();
  const allSearchItems = useSelector(
    (state: RootState) => state.app.searchItemsReducer.items
  );
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
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
        clearComment
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
  };
};

export default useProfile;
