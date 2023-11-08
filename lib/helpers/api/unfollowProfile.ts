import { Dispatch } from "react";
import pollUntilIndexed from "../../../graphql/lens/queries/indexed";
import { setInteractError } from "../../../redux/reducers/interactErrorSlice";
import { omit } from "lodash";
import { splitSignature } from "ethers/lib/utils";
import LensHubProxy from "./../../../abis/LensHubProxy.json";
import { AnyAction } from "redux";
import unfollow from "../../../graphql/lens/mutations/unfollow";
import { WalletClient, PublicClient } from "viem";
import broadcast from "../../../graphql/lens/mutations/broadcast";
import { setIndexer } from "../../../redux/reducers/indexerSlice";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../../constants";
import { polygon } from "viem/chains";

const lensUnfollow = async (
  id: string,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}`,
  clientWallet: WalletClient,
  publicClient: PublicClient,
  clearFollow: () => void
): Promise<void> => {
  const { data } = await unfollow({
    unfollow: [id],
  });

  const typedData = data?.createUnfollowTypedData.typedData;

  const signature = await clientWallet.signTypedData({
    domain: omit(typedData?.domain, ["__typename"]),
    types: omit(typedData?.types, ["__typename"]),
    primaryType: "Unfollow",
    message: omit(typedData?.value, ["__typename"]),
    account: address as `0x${string}`,
  });

  const broadcastResult = await broadcast({
    id: data?.createUnfollowTypedData?.id,
    signature,
  });

  if (broadcastResult?.data?.broadcastOnchain.__typename === "RelaySuccess") {
    dispatch(
      setIndexer({
        actionOpen: true,
        actionMessage: "Indexing Interaction",
      })
    );
    const result = await pollUntilIndexed({
      forTxId: broadcastResult?.data?.broadcastOnchain.txId,
    });

    if (!result) {
      dispatch(setInteractError(true));
    }
  } else {
    const { v, r, s } = splitSignature(signature);
    const { request } = await publicClient.simulateContract({
      address: LENS_HUB_PROXY_ADDRESS_MATIC,
      abi: LensHubProxy,
      functionName: "unfollowWithSig",
      chain: polygon,
      args: [
        typedData?.value?.unfollowerProfileId,
        typedData?.value?.idsOfProfilesToUnfollow,
        {
          v,
          r,
          s,
          deadline: typedData?.value?.deadline,
          signer: address,
        },
      ],
      account: address,
    });
    const res = await clientWallet.writeContract(request);
    clearFollow();
    await publicClient.waitForTransactionReceipt({ hash: res });

    const result = await pollUntilIndexed({
      forTxHash: res,
    });

    if (!result) {
      dispatch(setInteractError(true));
    }
  }

  

  dispatch(
    setIndexer({
      actionOpen: false,
      actionMessage: undefined,
    })
  );
};

export default lensUnfollow;
