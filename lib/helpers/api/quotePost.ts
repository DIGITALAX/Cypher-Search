import { Dispatch } from "react";
import quotePost from "../../../graphql/lens/mutations/quote";
import pollUntilIndexed from "../../../graphql/lens/queries/indexed";
import { setInteractError } from "../../../redux/reducers/interactErrorSlice";
import { AnyAction } from "redux";
import { SimpleCollectOpenActionModuleInput } from "../../../graphql/generated";

const lensQuote = async (
  id: string,
  contentURI: string,
  dispatch: Dispatch<AnyAction>,
  collectModuleInput: SimpleCollectOpenActionModuleInput | undefined
): Promise<void> => {
  const data = await quotePost({
    contentURI,
    quoteOn: id,
    openActionModules: [
      {
        collectOpenAction: {
          simpleCollectOpenAction: collectModuleInput,
        },
      },
    ],
  });

  if (data?.data?.quoteOnchain.__typename === "RelaySuccess") {
    const result = await pollUntilIndexed({
      forTxId: data?.data?.quoteOnchain?.txId,
    });

    if (!result) {
      dispatch(setInteractError(true));
      console.error(result);
    }
  }
};

export default lensQuote;
