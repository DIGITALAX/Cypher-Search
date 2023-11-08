import { AnyAction, Dispatch } from "redux";
import pollUntilIndexed from "../../../graphql/lens/queries/indexed";
import { setInteractError } from "../../../redux/reducers/interactErrorSlice";
import hidePost from "../../../graphql/lens/mutations/hide";

const lensHide = async (id: string, dispatch: Dispatch<AnyAction>) => {
  try {
    const { data } = await hidePost({
      for: id,
    });
    if (data?.hidePublication.__typename === "RelaySuccess") {
      const result = await pollUntilIndexed({
        forTxId: data?.hidePublication?.txId,
      });

      if (!result) {
        dispatch(setInteractError(true));
        console.error(result);
      }
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default lensHide;
