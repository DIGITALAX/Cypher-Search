import { FetchResult } from "@apollo/client";
import { authClient } from "../../../lib/lens/client";
import {
  ProfileSearchRequest,
  SearchProfilesQuery,
  SearchProfilesDocument,
} from "../../generated";

export const searchProfiles = async (
  request: ProfileSearchRequest
): Promise<FetchResult<SearchProfilesQuery>> => {
  return await authClient.query({
    query: SearchProfilesDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
export default searchProfiles;
