import { FetchResult } from "@apollo/client";
import { authClient } from "../../../lib/lens/client";
import {
  ProfilesDocument,
  ProfilesQuery,
  ProfilesRequest,
} from "../../generated";

export const getProfiles = (
  request: ProfilesRequest
): Promise<FetchResult<ProfilesQuery>> => {
  return authClient.query({
    query: ProfilesDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
export default getProfiles;
