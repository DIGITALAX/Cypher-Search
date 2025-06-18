import checkGates from "@/app/lib/helpers/checkGates";
import { ModalContext } from "@/app/providers";
import { useContext, useState } from "react";
import { http, useAccount } from "wagmi";
import { Quest } from "../../Common/types/common.types";
import { Dispatch } from "kinora-sdk";
import { ethers } from "ethers-v5";
import { chains } from "@lens-chain/sdk/viem";
import { createPublicClient } from "viem";

const useQuest = (dict: any, quest: Quest) => {
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: chains.mainnet,
    transport: http("https://rpc.lens.xyz"),
  });
  const context = useContext(ModalContext);
  const [joinLoading, setJoinLoading] = useState<boolean>(false);
  const kinoraDispatch = new Dispatch({
    playerAuthedApolloClient: context?.lensConectado?.apollo as any,
  });

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
        context?.setGates({
          erc20: data?.erc20,
          erc721: data?.erc721,
          oneOf: quest?.gate?.oneOf,
        });
        return;
      }

      await (window as any).ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        137
      );

      const signer = provider.getSigner();
      const { error, errorMessage } = await kinoraDispatch.playerJoinQuest(
        quest?.post?.id as `0x${string}`,
        signer as any
      );

      if (error) {
        context?.setModalOpen(dict?.error);
      } else {
        context?.setQuestSuccess(true);
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
