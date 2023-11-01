import { Dispatch } from "react";
import pollUntilIndexed from "../../../graphql/lens/queries/indexed";
import { setInteractError } from "../../../redux/reducers/interactErrorSlice";
import { AnyAction } from "redux";
import commentPost from "../../../graphql/lens/mutations/comment";
import { SimpleCollectOpenActionModuleInput } from "../../../graphql/generated";

const lensComment = async (
  id: string,
  contentURI: string,
  dispatch: Dispatch<AnyAction>,
  collectModuleInput: SimpleCollectOpenActionModuleInput | undefined
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

  if (data?.data?.commentOnchain.__typename === "RelaySuccess") {
    const result = await pollUntilIndexed({
      forTxId: data?.data?.commentOnchain?.txId,
    });

    if (!result) {
      dispatch(setInteractError(true));
      console.error(result);
    }
  }
};

export default lensComment;
