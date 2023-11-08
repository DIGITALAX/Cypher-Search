import { AnyAction, Dispatch } from "redux";
import pollUntilIndexed from "../../../graphql/lens/queries/indexed";
import { setInteractError } from "../../../redux/reducers/interactErrorSlice";
import reportPost from "../../../graphql/lens/mutations/report";
import { ReportingReasonInput } from "../../../graphql/generated";

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
    if (data?.reportPublication.__typename === "RelaySuccess") {
      const result = await pollUntilIndexed({
        forTxId: data?.reportPublication?.txId,
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

export default lensReport;
