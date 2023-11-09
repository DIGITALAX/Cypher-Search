import { omit } from "lodash";
import LensHubProxy from "../../../abis/LensHubProxy.json";
import { AnyAction, Dispatch } from "redux";
import { polygon } from "viem/chains";
import { setIndexer } from "../../../redux/reducers/indexerSlice";
import broadcast from "../../../graphql/lens/mutations/broadcast";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../../constants";
import { PublicClient, WalletClient } from "viem";
import profileMetadata from "../../../graphql/lens/mutations/metadata";
import handleIndexCheck from "../../../graphql/lens/queries/indexed";

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

    await handleIndexCheck(
      {
        forTxId: broadcastResult?.data?.broadcastOnchain?.txId,
      },
      dispatch
    );
  } else {
    const { request } = await publicClient.simulateContract({
      address: LENS_HUB_PROXY_ADDRESS_MATIC,
      abi: LensHubProxy,
      functionName: "setProfileMetadataURI",
      chain: polygon,
      args: [typedData?.value.profileId, typedData?.value.metadataURI],
      account: address,
    });
    const res = await clientWallet.writeContract(request);
   const tx = await publicClient.waitForTransactionReceipt({ hash: res });
    dispatch(
      setIndexer({
        actionOpen: true,
        actionMessage: "Indexing Interaction",
      })
    );
    await handleIndexCheck(
      {
        forTxHash: tx.transactionHash,
      },
      dispatch
    );
  }

  dispatch(
    setIndexer({
      actionOpen: false,
      actionMessage: undefined,
    })
  );
};

export default setMeta;
