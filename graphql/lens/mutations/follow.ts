import { FetchResult } from "@apollo/client";
import { apolloClient } from "../../../lib/lens/client";
import { FollowDocument, FollowMutation, FollowRequest } from "../../generated";

const follow = async (
  request: FollowRequest
): Promise<FetchResult<FollowMutation>> => {
  return await apolloClient.mutate({
    mutation: FollowDocument,
    variables: {
      request: request,
    },
  });
};

export default follow;
