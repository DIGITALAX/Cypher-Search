import { FetchResult } from "@apollo/client";
import { apolloClient } from "../../../lib/lens/client";
import {
  ActOnOpenActionRequest,
  CreateActOnOpenActionTypedDataDocument,
  CreateActOnOpenActionTypedDataMutation,
} from "../../generated";

const collectPost = async (
  request: ActOnOpenActionRequest
): Promise<FetchResult<CreateActOnOpenActionTypedDataMutation>> => {
  return await apolloClient.mutate({
    mutation: CreateActOnOpenActionTypedDataDocument,
    variables: {
      request: request,
    },
  });
};

export default collectPost;
