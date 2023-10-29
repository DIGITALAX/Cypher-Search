import { FetchResult } from "@apollo/client";
import { apolloClient } from "../../../lib/lens/client";
import {
  LensTransactionStatusRequest,
  LensTransactionStatusQuery,
  LensTransactionStatusDocument,
  LensTransactionStatusType,
  LensTransactionFailureType,
} from "../../generated";

const getIndexed = async (
  request: LensTransactionStatusRequest
): Promise<FetchResult<LensTransactionStatusQuery>> => {
  return await apolloClient.query({
    query: LensTransactionStatusDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};

const pollUntilIndexed = async (
  request: LensTransactionStatusRequest
): Promise<boolean | LensTransactionFailureType> => {
  let count = 0;
  while (count < 100) {
    try {
      const { data } = await getIndexed(request);
      if (data && data.lensTransactionStatus) {
        switch (data.lensTransactionStatus.status) {
          case LensTransactionStatusType.Failed:
            return data.lensTransactionStatus.reason!;
          case LensTransactionStatusType.Complete:
            return true;
          case LensTransactionStatusType.Processing:
          case LensTransactionStatusType.OptimisticallyUpdated:
            count += 1;
            await new Promise((resolve) => setTimeout(resolve, 6000));
            break;
          default:
            throw new Error("Unexpected status");
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  }
  return false;
};

export default pollUntilIndexed;
