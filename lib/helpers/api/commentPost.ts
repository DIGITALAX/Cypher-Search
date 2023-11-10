import { omit } from "lodash";
import LensHubProxy from "./../../../abis/LensHubProxy.json";
import { AnyAction, Dispatch } from "redux";
import commentPost from "../../../graphql/lens/mutations/comment";
import { SimpleCollectOpenActionModuleInput } from "../../../graphql/generated";
import { polygon } from "viem/chains";
import { setIndexer } from "../../../redux/reducers/indexerSlice";
import broadcast from "../../../graphql/lens/mutations/broadcast";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../../constants";
import { PublicClient, WalletClient } from "viem";
import handleIndexCheck from "../../../graphql/lens/queries/indexed";
import cleanCollect from "../cleanCollect";

const lensComment = async (
  id: string,
  contentURI: string,
  dispatch: Dispatch<AnyAction>,
  collectModuleInput: SimpleCollectOpenActionModuleInput | undefined,
  address: `0x${string}`,
  clientWallet: WalletClient,
  publicClient: PublicClient,
  clearComment: () => void
): Promise<void> => {
  if (collectModuleInput) {
    collectModuleInput = cleanCollect(collectModuleInput);
  }
  const data = await commentPost({
    commentOn: id,
    contentURI: contentURI,
    openActionModules: [
      {
        collectOpenAction: {
          simpleCollectOpenAction: collectModuleInput,
        },
      },
    ],
  });

  const typedData = data?.data?.createOnchainCommentTypedData.typedData;

  const signature = await clientWallet.signTypedData({
    domain: omit(typedData?.domain, ["__typename"]),
    types: omit(typedData?.types, ["__typename"]),
    primaryType: "Comment",
    message: omit(typedData?.value, ["__typename"]),
    account: address as `0x${string}`,
  });

  const broadcastResult = await broadcast({
    id: data?.data?.createOnchainCommentTypedData?.id,
    signature,
  });

  if (broadcastResult?.data?.broadcastOnchain.__typename === "RelaySuccess") {
    clearComment();
    await handleIndexCheck(
      {
        forTxId: broadcastResult?.data?.broadcastOnchain.txId,
      },
      dispatch
    );
  } else {
    const { request } = await publicClient.simulateContract({
      address: LENS_HUB_PROXY_ADDRESS_MATIC,
      abi: LensHubProxy,
      functionName: "comment",
      chain: polygon,
      args: [
        {
          profileId: typedData?.value.profileId,
          contentURI: typedData?.value.contentURI,
          pointedProfileId: typedData?.value.pointedProfileId,
          pointedPubId: typedData?.value.pointedPubId,
          referrerProfileIds: typedData?.value.referrerProfileIds,
          referrerPubIds: typedData?.value.referrerPubIds,
          referenceModuleData: typedData?.value.referenceModuleData,
          actionModules: typedData?.value.actionModules,
          actionModulesInitDatas: typedData?.value.actionModulesInitDatas,
          referenceModule: typedData?.value.referenceModule,
          referenceModuleInitData: typedData?.value.referenceModuleInitData,
        },
      ],
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
    clearComment();
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

export default lensComment;
