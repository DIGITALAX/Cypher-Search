import { omit } from "lodash";
import LensHubProxy from "./../../../abis/LensHubProxy.json";
import { AnyAction, Dispatch } from "redux";
import { SimpleCollectOpenActionModuleInput } from "../../../graphql/generated";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../../constants";
import { polygon } from "viem/chains";
import { PublicClient, WalletClient } from "viem";
import broadcast from "../../../graphql/lens/mutations/broadcast";
import { setIndexer } from "../../../redux/reducers/indexerSlice";
import handleIndexCheck from "../../../graphql/lens/queries/indexed";
import postOnChain from "../../../graphql/lens/mutations/post";

const lensPost = async (
  contentURI: string,
  dispatch: Dispatch<AnyAction>,
  collectModuleInput: SimpleCollectOpenActionModuleInput | undefined,
  address: `0x${string}`,
  clientWallet: WalletClient,
  publicClient: PublicClient
): Promise<void> => {
  const data = await postOnChain({
    contentURI,
    openActionModules: [
      {
        collectOpenAction: {
          simpleCollectOpenAction: collectModuleInput,
        },
      },
    ],
  });

  const typedData = data.data?.createOnchainPostTypedData?.typedData;

  const signature = await clientWallet.signTypedData({
    domain: omit(typedData?.domain, ["__typename"]),
    types: omit(typedData?.types, ["__typename"]),
    primaryType: "Post",
    message: omit(typedData?.value, ["__typename"]),
    account: address as `0x${string}`,
  });

  const broadcastResult = await broadcast({
    id: data.data?.createOnchainPostTypedData?.id,
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
      functionName: "post",
      chain: polygon,
      args: [
        {
          profileId: typedData?.value.profileId,
          contentURI: typedData?.value.contentURI,
          actionModules: typedData?.value?.actionModules,
          actionModulesInitDatas: typedData?.value?.actionModulesInitDatas,
          referenceModule: typedData?.value?.referenceModule,
          referenceModuleInitData: typedData?.value?.referenceModuleInitData,
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
    const tx = await publicClient.waitForTransactionReceipt({ hash: res });
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

export default lensPost;
