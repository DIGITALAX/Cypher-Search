import { FetchResult } from "@apollo/client";
import { authClient } from "../../../lib/lens/client";
import {
  WhoActedOnPublicationRequest,
  WhoActedOnPublicationDocument,
  WhoActedOnPublicationQuery,
} from "../../generated";

export const whoActedPublication = async (
  request: WhoActedOnPublicationRequest
): Promise<FetchResult<WhoActedOnPublicationQuery>> => {
  return await authClient.query({
    query: WhoActedOnPublicationDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
export default whoActedPublication;
