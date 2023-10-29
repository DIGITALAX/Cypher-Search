import { FetchResult } from "@apollo/client";
import { authClient } from "../../../lib/lens/client";
import {
  SearchPublicationsDocument,
  SearchPublicationsQuery,
  PublicationSearchRequest,
} from "../../generated";

export const searchPubs = async (
  request: PublicationSearchRequest
): Promise<FetchResult<SearchPublicationsQuery>> => {
  return await authClient.query({
    query: SearchPublicationsDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
export default searchPubs;
