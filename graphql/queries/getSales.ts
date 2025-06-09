import { graphClient } from "@/app/lib/subgraph/client";
import { FetchResult, gql } from "@apollo/client";

const HISTORY = `
query($designer: String!) {
  orderCreateds(where: {collection_: {designer: $designer}}, orderDirection: desc, orderBy: blockTimestamp) {
   amount
      messages
      orderId
      collection {
        designer
        collectionId
        metadata {
          images
          title
        }
        postId
      }
      isFulfilled
      buyer
      currency
      details
      status
      totalPrice
      blockTimestamp
      transactionHash
    }
}
`;

export const getSalesHistory = async (
  designer: string
): Promise<FetchResult<any>> => {
  return graphClient.query({
    query: gql(HISTORY),
    variables: {
      designer,
    },
    fetchPolicy: "no-cache",
  });
};
