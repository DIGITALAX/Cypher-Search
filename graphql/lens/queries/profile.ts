import { FetchResult } from "@apollo/client";
import { authClient } from "../../../lib/lens/client";
import { ProfileQuery, ProfileRequest, ProfileDocument } from "../../generated";

export const getProfile = (
  request: ProfileRequest
): Promise<FetchResult<ProfileQuery>> => {
  return authClient.query({
    query: ProfileDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
export default getProfile;
