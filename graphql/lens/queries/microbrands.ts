import { FetchResult } from "@apollo/client";
import { authClient } from "../../../lib/lens/client";
import {
  ProfilesRequest,
  ProfilesQuery,
  ProfilesDocument,
} from "../../generated";

export const getMicrobrands = async (
  request: ProfilesRequest
): Promise<FetchResult<ProfilesQuery>> => {
  return await authClient.query({
    query: ProfilesDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
export default getMicrobrands;
