import { Dispatch } from "react";
import pollUntilIndexed from "../../../graphql/lens/queries/indexed";
import { setInteractError } from "../../../redux/reducers/interactErrorSlice";
import { omit } from "lodash";
import { splitSignature } from "ethers/lib/utils";
import LensHubProxy from "../../../abis/LensHubProxy.json";
import { AnyAction } from "redux";
import { SimpleCollectOpenActionModuleInput } from "../../../graphql/generated";
import { polygon } from "viem/chains";
import { setIndexer } from "../../../redux/reducers/indexerSlice";
import broadcast from "../../../graphql/lens/mutations/broadcast";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../../constants";
import { PublicClient, WalletClient } from "viem";
import profileMetadata from "../../../graphql/lens/mutations/metadata";

const setMeta = async (
  metadataURI: string,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}`,
  clientWallet: WalletClient,
  publicClient: PublicClient
): Promise<void> => {
  const { data } = await profileMetadata({
    metadataURI,
  });

  const typedData = data?.createOnchainSetProfileMetadataTypedData.typedData;

  const signature = await clientWallet.signTypedData({
    domain: omit(typedData?.domain, ["__typename"]),
    types: omit(typedData?.types, ["__typename"]),
    primaryType: "SetProfileMetadataURI",
    message: omit(typedData?.value, ["__typename"]),
    account: address as `0x${string}`,
  });

  const broadcastResult = await broadcast({
    id: data?.createOnchainSetProfileMetadataTypedData.id,
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
      functionName: "setProfileMetadataURIWithSig",
      chain: polygon,
      args: [
        typedData?.value.profileId,
        typedData?.value.metadataURI,
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
      console.error(result);
    }
  }

  dispatch(
    setIndexer({
      actionOpen: false,
      actionMessage: undefined,
    })
  );
};

export default setMeta;
