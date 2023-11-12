import { FetchResult, gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/graph/client";

const ORDERS = `
  query($buyer: String!) {
    orderCreateds(where: {buyer: $buyer}) {
        orderId
        totalPrice
        currency
        pubId
        profileId
        buyer
        blockTimestamp
        transactionHash
        images
        names
        messages
        details
        subOrderPrice
        subOrderStatus
        subOrderCollectionId
        subOrderIsFulfilled
        subOrderAmount
    }
  }
`;

export const getOrders = async (buyer: `0x${string}`): Promise<FetchResult | void> => {
  const queryPromise = graphPrintClient.query({
    query: gql(ORDERS),
    variables: {
      buyer,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};
