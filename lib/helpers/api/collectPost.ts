import { Dispatch } from "react";
import collectPost from "../../../graphql/lens/mutations/collect";
import pollUntilIndexed from "../../../graphql/lens/queries/indexed";
import { setInteractError } from "../../../redux/reducers/interactErrorSlice";
import { AnyAction } from "redux";

const lensCollect = async (
  id: string,
  type: string,
  dispatch: Dispatch<AnyAction>
): Promise<void> => {
  const data = await collectPost({
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

  if (data?.data?.actOnOpenAction.__typename === "RelaySuccess") {
    const result = await pollUntilIndexed({
      forTxId: data?.data?.actOnOpenAction?.txId,
    });

    if (!result) {
      dispatch(setInteractError(true));
      console.error(result);
    }
  }
};

export default lensCollect;
