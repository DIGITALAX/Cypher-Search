import { AnyAction, Dispatch } from "redux";
import hidePost from "../../../graphql/lens/mutations/hide";
import handleIndexCheck from "../../../graphql/lens/queries/indexed";
import { setIndexer } from "../../../redux/reducers/indexerSlice";

const lensHide = async (id: string, dispatch: Dispatch<AnyAction>) => {
  try {
    const { data } = await hidePost({
      for: id,
    });
    if (
      data?.hidePublication?.__typename === "RelaySuccess" ||
      !data?.hidePublication
    ) {
      if (data?.hidePublication?.txId) {
        await handleIndexCheck(
          {
            forTxId: data?.hidePublication?.txId,
          },
          dispatch
        );
      } else {
        dispatch(
          setIndexer({
            actionOpen: true,
            actionMessage: "Successfully Indexed",
          })
        );
        setTimeout(() => {
          dispatch(
            setIndexer({
              actionOpen: false,
              actionMessage: undefined,
            })
          );
        }, 1000);
      }
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default lensHide;
