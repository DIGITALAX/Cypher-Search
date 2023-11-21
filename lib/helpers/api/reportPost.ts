import { AnyAction, Dispatch } from "redux";
import reportPost from "../../../graphql/lens/mutations/report";
import { ReportingReasonInput } from "../../../graphql/generated";
import handleIndexCheck from "../../../graphql/lens/queries/indexed";
import { setIndexer } from "../../../redux/reducers/indexerSlice";

const lensReport = async (
  id: string,
  reason: ReportingReasonInput,
  additionalComments: string,
  dispatch: Dispatch<AnyAction>
) => {
  try {
    const { data } = await reportPost({
      for: id,
      reason,
      additionalComments,
    });
    if (
      data?.reportPublication?.__typename === "RelaySuccess" ||
      !data?.reportPublication
    ) {
      if (data?.reportPublication?.txId) {
        await handleIndexCheck(
          {
            forTxId: data?.reportPublication?.txId,
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

export default lensReport;
