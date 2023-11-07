import { FetchResult } from "@apollo/client";
import { authClient } from "../../../lib/lens/client";
import {
  DefaultProfileRequest,
  GetDefaultProfileDocument,
  GetDefaultProfileQuery,
} from "../../generated";

const getDefaultProfile = async (
  request: DefaultProfileRequest
): Promise<FetchResult<GetDefaultProfileQuery>> => {
  return await authClient.query({
    query: GetDefaultProfileDocument,
    variables: {
      request,
    },
    fetchPolicy: "no-cache",
  });
};

export default getDefaultProfile;
