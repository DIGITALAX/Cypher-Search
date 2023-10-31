import { FetchResult } from "@apollo/client";
import { authClient } from "../../../lib/lens/client";
import {
  PublicationDocument,
  PublicationQuery,
  PublicationRequest,
} from "../../generated";

export const getPublication = async (
  request: PublicationRequest
): Promise<FetchResult<PublicationQuery>> => {
  return await authClient.query({
    query: PublicationDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
export default getPublication;
