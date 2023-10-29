import { FetchResult } from "@apollo/client";
import { apolloClient } from "../../../lib/lens/client";
import {
  UnfollowDocument,
  UnfollowMutation,
  UnfollowRequest,
} from "../../generated";

const unfollow = async (
  request: UnfollowRequest
): Promise<FetchResult<UnfollowMutation>> => {
  return await apolloClient.mutate({
    mutation: UnfollowDocument,
    variables: {
      request: request,
    },
  });
};

export default unfollow;
