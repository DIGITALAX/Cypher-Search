import { FetchResult } from "@apollo/client";
import { authClient } from "../../../lib/lens/client";
import {
  FollowersQuery,
  FollowersRequest,
  FollowersDocument,
} from "../../generated";

export const followers = async (
  request: FollowersRequest
): Promise<FetchResult<FollowersQuery>> => {
  return await authClient.query({
    query: FollowersDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
export default followers;
