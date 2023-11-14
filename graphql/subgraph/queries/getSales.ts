import { FetchResult, gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/graph/client";

const HISTORY = `
  query($creator: String!) {
    OrderCreated(where: {creator: $creator} orderBy: blockTimestamp
      orderDirection: desc) {
      }
  }
`;

export const getSalesHistory = async (
  creator: string
): Promise<FetchResult<any>> => {
  return graphPrintClient.query({
    query: gql(HISTORY),
    variables: {
      creator,
    },
    fetchPolicy: "no-cache",
  });
};
