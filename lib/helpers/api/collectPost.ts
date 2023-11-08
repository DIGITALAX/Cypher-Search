import { Dispatch } from "react";
import collectPost from "../../../graphql/lens/mutations/collect";
import pollUntilIndexed from "../../../graphql/lens/queries/indexed";
import { setInteractError } from "../../../redux/reducers/interactErrorSlice";
import { omit } from "lodash";
import { splitSignature } from "ethers/lib/utils";
import LensHubProxy from "./../../../abis/LensHubProxy.json";
import { AnyAction } from "redux";
import { setIndexer } from "../../../redux/reducers/indexerSlice";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../../constants";
import { WalletClient, PublicClient } from "viem";
import broadcast from "../../../graphql/lens/mutations/broadcast";
import { polygon } from "viem/chains";

const lensCollect = async (
  id: string,
  type: string,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}`,
  clientWallet: WalletClient,
  publicClient: PublicClient
): Promise<void> => {
  const { data } = await collectPost({
    for: id,
    actOn: {
      simpleCollectOpenAction:
        type === "SimpleCollectOpenActionSettings" ? true : undefined,
      multirecipientCollectOpenAction:
        type === "MultirecipientFeeCollectOpenActionSettings"
          ? true
          : undefined,
    },
  });

  const typedData = data?.createActOnOpenActionTypedData.typedData;

  const signature = await clientWallet.signTypedData({
    domain: omit(typedData?.domain, ["__typename"]),
    types: omit(typedData?.types, ["__typename"]),
    primaryType: "Act",
    message: omit(typedData?.value, ["__typename"]),
    account: address as `0x${string}`,
  });

  const broadcastResult = await broadcast({
    id: data?.createActOnOpenActionTypedData?.id,
    signature,
  });

  if (broadcastResult?.data?.broadcastOnchain.__typename === "RelaySuccess") {
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
      functionName: "actWithSig",
      chain: polygon,
      args: [
        {
          publicationActedProfileId: typedData?.value.publicationActedProfileId,
          publicationActedId: typedData?.value.publicationActedId,
          actorProfileId: typedData?.value.actorProfileId,
          referrerProfileIds: typedData?.value.referrerProfileIds,
          referrerPubIds: typedData?.value.referrerPubIds,
          actionModuleAddress: typedData?.value.actionModuleAddress,
          actionModuleData: typedData?.value.actionModuleData,
        },
        {
          v,
          r,
          s,
          deadline: typedData?.value.deadline,
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
      actionOpen: false,
      actionMessage: undefined,
    })
  );
};

export default lensCollect;
