import { FetchResult, gql } from "@apollo/client";
import { authClient } from "../../../lib/lens/client";
import {
  PublicationsQuery,
  PublicationsRequest,
} from "../../generated";

export const getStats = async (
  request: PublicationsRequest
): Promise<FetchResult<PublicationsQuery>> => {
  return await authClient.query({
    query: gql(`query Publications($request: PublicationsRequest!) {
        result: publications(request: $request) {
          items {
            ... on Post {
                stats: {
                    __typename?: "PublicationStats";
                    comments: number;
                    mirrors: number;
                    quotes: number;
                }
            }
          }
          pageInfo {
            ...PaginatedResultInfo
          }
        }
      }`),

    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
export default getStats;
