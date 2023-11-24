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
        subOrderCollectionIds
        subOrderIsFulfilled
        subOrderAmount
    }
    nFTOnlyOrderCreateds(where: {buyer: $buyer}) {
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
      subOrderCollectionIds
      subOrderIsFulfilled
      subOrderAmount
  }
  }
`;

const ORDERS_PAGINATED = `
  query($buyer: String!, $first: Int, $skip: Int) {
    orderCreateds(where: {buyer: $buyer}, first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
        subOrderCollectionIds
    }
    nFTOnlyOrderCreateds(where: {buyer: $buyer}, first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
      subOrderCollectionIds
  }
  }
`;

const ORDERS_QUICK = `
  query($buyer: String!) {
    orderCreateds(where: {buyer: $buyer}) {
        subOrderCollectionIds
    }
    nFTOnlyOrderCreateds(where: {buyer: $buyer}) {
      subOrderCollectionIds
  }
  }
`;

export const getOrders = async (
  buyer: `0x${string}`
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(ORDERS),
    variables: {
      buyer,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  timeoutId && clearTimeout(timeoutId);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

export const getOrdersPaginated = async (
  buyer: `0x${string}`,
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(ORDERS_PAGINATED),
    variables: {
      buyer,
      first,
      skip,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  timeoutId && clearTimeout(timeoutId);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

export const getOrdersQuick = async (
  buyer: `0x${string}`
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(ORDERS_QUICK),
    variables: {
      buyer,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  timeoutId && clearTimeout(timeoutId);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};
