import { Dispatch } from "react";
import pollUntilIndexed from "../../../graphql/lens/queries/indexed";
import { setInteractError } from "../../../redux/reducers/interactErrorSlice";
import { omit } from "lodash";
import { splitSignature } from "ethers/lib/utils";
import LensHubProxy from "./../../../abis/LensHubProxy.json";
import { AnyAction } from "redux";
import commentPost from "../../../graphql/lens/mutations/comment";
import { SimpleCollectOpenActionModuleInput } from "../../../graphql/generated";
import { polygon } from "viem/chains";
import { setIndexer } from "../../../redux/reducers/indexerSlice";
import broadcast from "../../../graphql/lens/mutations/broadcast";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../../constants";
import { PublicClient, WalletClient } from "viem";

const lensComment = async (
  id: string,
  contentURI: string,
  dispatch: Dispatch<AnyAction>,
  collectModuleInput: SimpleCollectOpenActionModuleInput | undefined,
  address: `0x${string}`,
  clientWallet: WalletClient,
  publicClient: PublicClient
): Promise<void> => {
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
      functionName: "commentWithSig",
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

export default lensComment;
