import { useEffect, useState } from "react";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import { Publication } from "../types/tiles.types";
import { Profile } from "../../../../graphql/generated";
import { Dispatch } from "redux";
import refetchProfile from "../../../../lib/helpers/api/refetchProfile";
import lensUnfollow from "../../../../lib/helpers/api/unfollowProfile";
import lensFollow from "../../../../lib/helpers/api/followProfile";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";
import { setIndexer } from "../../../../redux/reducers/indexerSlice";

const useTiles = (
  allSearchItems: Publication[],
  lensConnected: Profile | undefined,
  dispatch: Dispatch,
  publicClient: PublicClient,
  address: `0x${string}` | undefined
) => {
  const [popUpOpen, setPopUpOpen] = useState<boolean[]>([]);
  const [profileHovers, setProfileHovers] = useState<boolean[]>([]);
  const [followLoading, setFollowLoading] = useState<boolean[]>([]);

  const followProfile = async (id: string, index?: number) => {
    if (index === -1) {
      return;
    }

    setFollowLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = true;
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
        undefined,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      await refetchProfile(dispatch, lensConnected?.id, lensConnected?.id);
    } catch (err: any) {
      if (err?.message?.includes("User rejected the request")) {
        setFollowLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index!] = false;
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
      updatedArray[index!] = false;
      return updatedArray;
    });
  };

  const unfollowProfile = async (id: string, index?: number) => {
    if (index === -1) {
      return;
    }

    setFollowLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = true;
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
        publicClient
      );
      await refetchProfile(dispatch, lensConnected?.id, lensConnected?.id);
    } catch (err: any) {
      if (err?.message?.includes("User rejected the request")) {
        setFollowLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index!] = false;
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
      updatedArray[index!] = false;
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
  }, [allSearchItems?.length]);

  return {
    popUpOpen,
    setPopUpOpen,
    followProfile,
    unfollowProfile,
    followLoading,
    profileHovers,
    setProfileHovers,
    lensConnected,
  };
};

export default useTiles;
