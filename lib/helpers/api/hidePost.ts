import { AnyAction, Dispatch } from "redux";
import pollUntilIndexed from "../../../graphql/lens/queries/indexed";
import { setInteractError } from "../../../redux/reducers/interactErrorSlice";
import hidePost from "../../../graphql/lens/mutations/hide";
import handleIndexCheck from "../../../graphql/lens/queries/indexed";

const lensHide = async (id: string, dispatch: Dispatch<AnyAction>) => {
  try {
    const { data } = await hidePost({
      for: id,
    });
    if (data?.hidePublication.__typename === "RelaySuccess") {
      await handleIndexCheck(
        {
          forTxId: data?.hidePublication?.txId,
        },
        dispatch
      );
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default lensHide;
