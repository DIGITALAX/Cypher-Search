import { FetchResult } from "@apollo/client";
import { authClient } from "../../../lib/lens/client";
import {
  WhoReactedPublicationDocument,
  WhoReactedPublicationQuery,
  WhoReactedPublicationRequest,
} from "../../generated";

export const whoReactedPublication = (
  request: WhoReactedPublicationRequest
): Promise<FetchResult<WhoReactedPublicationQuery>> => {
  return authClient.query({
    query: WhoReactedPublicationDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
export default whoReactedPublication;
