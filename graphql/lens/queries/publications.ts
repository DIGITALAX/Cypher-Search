import { FetchResult } from "@apollo/client";
import { authClient } from "../../../lib/lens/client";
import {
  PublicationsDocument,
  PublicationsQuery,
  PublicationsRequest,
} from "../../generated";

export const getPublications = (
  request: PublicationsRequest
): Promise<FetchResult<PublicationsQuery>> => {
  return authClient.query({
    query: PublicationsDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
export default getPublications;
