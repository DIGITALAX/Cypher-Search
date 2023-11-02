import { Dispatch } from "react";
import pollUntilIndexed from "../../../graphql/lens/queries/indexed";
import { setInteractError } from "../../../redux/reducers/interactErrorSlice";
import { AnyAction } from "redux";
import unfollow from "../../../graphql/lens/mutations/unfollow";

const lensUnfollow = async (
  id: string,
  dispatch: Dispatch<AnyAction>
): Promise<void> => {
  const data = await unfollow({
    unfollow: [
      {
        profileId: id,
      },
    ],
  });

  if (data?.data?.unfollow.__typename === "RelaySuccess") {
    const result = await pollUntilIndexed({
      forTxId: data?.data?.unfollow?.txId,
    });

    if (!result) {
      dispatch(setInteractError(true));
      console.error(result);
    }
  }
};

export default lensUnfollow;
