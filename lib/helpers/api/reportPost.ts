import { AnyAction, Dispatch } from "redux";
import reportPost from "../../../graphql/lens/mutations/report";
import { ReportingReasonInput } from "../../../graphql/generated";
import handleIndexCheck from "../../../graphql/lens/queries/indexed";

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
      await handleIndexCheck(
        {
          forTxId: data?.reportPublication?.txId,
        },
        dispatch
      );
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default lensReport;
