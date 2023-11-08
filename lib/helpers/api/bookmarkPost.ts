import bookmark from "../../../graphql/lens/mutations/bookmark";
import { AnyAction, Dispatch } from "redux";
import pollUntilIndexed from "../../../graphql/lens/queries/indexed";
import { setInteractError } from "../../../redux/reducers/interactErrorSlice";

const lensBookmark = async (on: string, dispatch: Dispatch<AnyAction>) => {
  try {
    const { data } = await bookmark({
      on,
    });
    if (data?.addPublicationBookmark.__typename === "RelaySuccess") {
      const result = await pollUntilIndexed({
        forTxId: data?.addPublicationBookmark?.txId,
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

export default lensBookmark;
