import { FetchResult } from "@apollo/client";
import { authClient } from "../../../lib/lens/client";
import {
  FollowingQuery,
  FollowingRequest,
  FollowingDocument,
} from "../../generated";

export const following = async (
  request: FollowingRequest
): Promise<FetchResult<FollowingQuery>> => {
  return await authClient.query({
    query: FollowingDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
export default following;
