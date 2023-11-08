import { Dispatch } from "react";
import pollUntilIndexed from "../../../graphql/lens/queries/indexed";
import { setInteractError } from "../../../redux/reducers/interactErrorSlice";
import { omit } from "lodash";
import { splitSignature } from "ethers/lib/utils";
import LensHubProxy from "./../../../abis/LensHubProxy.json";
import { AnyAction } from "redux";
import follow from "../../../graphql/lens/mutations/follow";
import { WalletClient } from "viem";
import { PublicClient } from "wagmi";
import broadcast from "../../../graphql/lens/mutations/broadcast";
import { setIndexer } from "../../../redux/reducers/indexerSlice";
import { polygon } from "viem/chains";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../../constants";

const lensFollow = async (
  id: string,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}`,
  clientWallet: WalletClient,
  publicClient: PublicClient
): Promise<void> => {
  const { data } = await follow({
    follow: [
      {
        profileId: id,
      },
    ],
  });

  const typedData = data?.createFollowTypedData?.typedData;

  const signature = await clientWallet.signTypedData({
    domain: omit(typedData?.domain, ["__typename"]),
    types: omit(typedData?.types, ["__typename"]),
    primaryType: "Follow",
    message: omit(typedData?.value, ["__typename"]),
    account: address as `0x${string}`,
  });

  const broadcastResult = await broadcast({
    id: data?.createFollowTypedData?.id,
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
      forTxId: broadcastResult?.data?.broadcastOnchain?.txId,
    });

    if (!result) {
      dispatch(setInteractError(true));
      console.error(result);
    }
  } else {
    const { v, r, s } = splitSignature(signature);
    const { request } = await publicClient.simulateContract({
      address: LENS_HUB_PROXY_ADDRESS_MATIC,
      abi: LensHubProxy,
      functionName: "followWithSig",
      chain: polygon,
      args: [
        typedData?.value?.followerProfileId,
        typedData?.value?.idsOfProfilesToFollow,
        typedData?.value?.followTokenIds,
        typedData?.value?.datas,
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
    await publicClient.waitForTransactionReceipt({ hash: res });
    dispatch(
      setIndexer({
        actionOpen: true,
        actionMessage: "Indexing Interaction",
      })
    );
    const result = await pollUntilIndexed({
      forTxHash: res,
    });
    if (!result) {
      dispatch(setInteractError(true));
    }
  }

  dispatch(
    setIndexer({
      actionValue: false,
      actionMessage: undefined,
    })
  );
};

export default lensFollow;
