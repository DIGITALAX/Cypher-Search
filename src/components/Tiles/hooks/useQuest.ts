import { useState } from "react";
import { Dispatch as KinoraDispatch } from "kinora-sdk";
import checkGates from "../../../../lib/helpers/checkGates";
import { Quest } from "@/components/Search/types/search.types";
import { PublicClient } from "viem";
import { ethers } from "ethers-v5";
import { Dispatch } from "redux";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";
import { setQuestGates } from "../../../../redux/reducers/questGatesSlice";
import { setQuestSuccess } from "../../../../redux/reducers/questSuccessSlice";

const useQuest = (
  address: `0x${string}` | undefined,
  kinoraDispatch: KinoraDispatch,
  quest: Quest | undefined,
  publicClient: PublicClient,
  dispatch: Dispatch
) => {
  const [joinLoading, setJoinLoading] = useState<boolean>(false);

  const handlePlayerJoin = async () => {
    if (!address) return;
    setJoinLoading(true);
    try {
      const data = await checkGates(quest?.gate!, publicClient, address);

      if (
        (data?.erc20 && data?.erc20?.length > 0) ||
        (data?.erc721 && data?.erc721?.length > 0)
      ) {
        setJoinLoading(false);
        dispatch(
          setQuestGates({
            erc20: data?.erc20,
            erc721: data?.erc721,
            oneOf: quest?.gate?.oneOf,
          })
        );
        return;
      }

      await (window as any).ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        137
      );

      const signer = provider.getSigner();
      const { error, errorMessage } = await kinoraDispatch.playerJoinQuest(
        quest?.publication?.id as `0x${string}`,
        signer as any
      );

      if (error) {
        dispatch(setInteractError(true));
      } else {
        dispatch(setQuestSuccess(true));
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setJoinLoading(false);
  };

  return {
    joinLoading,
    handlePlayerJoin,
  };
};

export default useQuest;
