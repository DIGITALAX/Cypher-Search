import { FetchResult } from "@apollo/client";
import { authClient } from "../../../lib/lens/client";
import {
  PublicationsDocument,
  PublicationsQuery,
  PublicationsRequest,
} from "../../generated";

export const getPublications = async (
  request: PublicationsRequest
): Promise<FetchResult<PublicationsQuery>> => {
  return await authClient.query({
    query: PublicationsDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
export default getPublications;
