import { Dispatch } from "react";
import pollUntilIndexed from "../../../graphql/lens/queries/indexed";
import { setInteractError } from "../../../redux/reducers/interactErrorSlice";
import { AnyAction } from "redux";
import follow from "../../../graphql/lens/mutations/follow";

const lensFollow = async (
  id: string,
  dispatch: Dispatch<AnyAction>
): Promise<void> => {
  const data = await follow({
    follow: [
      {
        profileId: id,
      },
    ],
  });

  if (data?.data?.follow.__typename === "RelaySuccess") {
    const result = await pollUntilIndexed({
      forTxId: data?.data?.follow?.txId,
    });

    if (!result) {
      dispatch(setInteractError(true));
      console.error(result);
    }
  }
};

export default lensFollow;
