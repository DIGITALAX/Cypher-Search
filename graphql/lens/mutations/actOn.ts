import { FetchResult } from "@apollo/client";
import { apolloClient } from "../../../lib/lens/client";
import {
  ActOnOpenActionDocument,
  ActOnOpenActionMutation,
  ActOnOpenActionRequest,
} from "../../generated";

const actOnGrant = async (
  request: ActOnOpenActionRequest
): Promise<FetchResult<ActOnOpenActionMutation>> => {
  return apolloClient.mutate({
    mutation: ActOnOpenActionDocument,
    variables: {
      request: request,
    },
  });
};

export default actOnGrant;
