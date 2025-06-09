import { useState } from "react";

import { PublicClient } from "viem";

const useQuest = (
  
) => {
  const [joinLoading, setJoinLoading] = useState<boolean>(false);

  const handlePlayerJoin = async () => {
    // if (!address) return;
    // setJoinLoading(true);
    // try {
    //   const data = await checkGates(quest?.gate!, publicClient, address);

    //   if (
    //     (data?.erc20 && data?.erc20?.length > 0) ||
    //     (data?.erc721 && data?.erc721?.length > 0)
    //   ) {
    //     setJoinLoading(false);
    //     dispatch(
    //       setQuestGates({
    //         erc20: data?.erc20,
    //         erc721: data?.erc721,
    //         oneOf: quest?.gate?.oneOf,
    //       })
    //     );
    //     return;
    //   }

    //   await (window as any).ethereum.request({ method: "eth_requestAccounts" });

    //   const provider = new ethers.providers.Web3Provider(
    //     (window as any).ethereum,
    //     137
    //   );

    //   const signer = provider.getSigner();
    //   const { error, errorMessage } = await kinoraDispatch.playerJoinQuest(
    //     quest?.publication?.id as `0x${string}`,
    //     signer as any
    //   );

    //   if (error) {
    //     dispatch(setInteractError(true));
    //   } else {
    //     dispatch(setQuestSuccess(true));
    //   }
    // } catch (err: any) {
    //   console.error(err.message);
    // }
    // setJoinLoading(false);
  };

  return {
    joinLoading,
    handlePlayerJoin,
  };
};

export default useQuest;
