import bookmark from "../../../graphql/lens/mutations/bookmark";
import { AnyAction, Dispatch } from "redux";
import handleIndexCheck from "../../../graphql/lens/queries/indexed";

const lensBookmark = async (on: string, dispatch: Dispatch<AnyAction>) => {
  try {
    const { data } = await bookmark({
      on,
    });
    if (data?.addPublicationBookmark.__typename === "RelaySuccess") {
      await handleIndexCheck(
        {
          forTxId: data?.addPublicationBookmark?.txId,
        },
        dispatch
      );
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default lensBookmark;
