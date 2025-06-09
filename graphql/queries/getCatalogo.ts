import { autographClient } from "@/app/lib/subgraph/client";
import { FetchResult, gql } from "@apollo/client";

const CATALOGO = gql(
  `query {
   autographCreateds(first: 1) {
   id
    uri
    amount
    price
    minted
    pageCount
    postId
    designer
    acceptedTokens
    pages
    transactionHash
    blockTimestamp
    blockNumber
  }
  }`
);

export const getCatalogo = async (): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = autographClient.query({
    query: CATALOGO,
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000);
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);

  timeoutId && clearTimeout(timeoutId);

  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};
