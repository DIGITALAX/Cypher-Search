import { Dispatch } from "react";
import pollUntilIndexed from "../../../graphql/lens/queries/indexed";
import { setInteractError } from "../../../redux/reducers/interactErrorSlice";
import { omit } from "lodash";
import { splitSignature } from "ethers/lib/utils";
import LensHubProxy from "./../../../abis/LensHubProxy.json";
import { AnyAction } from "redux";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../../constants";
import { polygon } from "viem/chains";
import { PublicClient, WalletClient } from "viem";
import broadcast from "../../../graphql/lens/mutations/broadcast";
import { setIndexer } from "../../../redux/reducers/indexerSlice";
import mirrorPost from "../../../graphql/lens/mutations/mirror";

const lensQuote = async (
  mirrorOn: string,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}`,
  clientWallet: WalletClient,
  publicClient: PublicClient
): Promise<void> => {
  const data = await mirrorPost({
    mirrorOn,
  });

  const typedData = data.data?.createOnchainMirrorTypedData?.typedData;

  const signature = await clientWallet.signTypedData({
    domain: omit(typedData?.domain, ["__typename"]),
    types: omit(typedData?.types, ["__typename"]),
    primaryType: "Mirror",
    message: omit(typedData?.value, ["__typename"]),
    account: address as `0x${string}`,
  });

  const broadcastResult = await broadcast({
    id: data.data?.createOnchainMirrorTypedData?.id,
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
    }
  } else {
    const { v, r, s } = splitSignature(signature);
    const { request } = await publicClient.simulateContract({
      address: LENS_HUB_PROXY_ADDRESS_MATIC,
      abi: LensHubProxy,
      functionName: "mirrorWithSig",
      chain: polygon,
      args: [
        {
          profileId: typedData?.value.profileId,
          metadataURI: typedData?.value.metadataURI,
          pointedProfileId: typedData?.value.pointedProfileId,
          pointedPubId: typedData?.value.pointedPubId,
          referrerProfileIds: typedData?.value.referrerProfileIds,
          referrerPubIds: typedData?.value.referrerPubIds,
          referenceModuleData: typedData?.value.referenceModuleData,
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
    dispatch(
      setIndexer({
        actionOpen: true,
        actionMessage: "Indexing Interaction",
      })
    );
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

export default lensQuote;
