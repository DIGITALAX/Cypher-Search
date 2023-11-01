import { AnyAction, Dispatch } from "redux";
import mirrorPost from "../../../graphql/lens/mutations/mirror";
import pollUntilIndexed from "../../../graphql/lens/queries/indexed";
import { setInteractError } from "../../../redux/reducers/interactErrorSlice";

const lensMirror = async (
  id: string,
  dispatch: Dispatch<AnyAction>
): Promise<void> => {
  const data = await mirrorPost({
    mirrorOn: id,
  });

  if (data?.data?.mirrorOnchain.__typename === "RelaySuccess") {
    const result = await pollUntilIndexed({
      forTxId: data?.data?.mirrorOnchain?.txId,
    });

    if (!result) {
      dispatch(setInteractError(true));
      console.error(result);
    }
  }
};

export default lensMirror;
