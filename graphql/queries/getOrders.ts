import {
  graphClient,
  tripleAClient,
  graphPrintServer,
  graphTripleServer,
} from "@/app/lib/subgraph/client";
import { FetchResult, gql } from "@apollo/client";

const ORDERS = `
  query($buyer: String!) {
    orderCreateds(where: { buyer: $buyer }) {
      amount
      messages
      orderId
      collection {
        collectionId
        metadata {
          images
          title
          mediaCover
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

const ORDERS_PAGINATED = `
  query($buyer: String!, $first: Int, $skip: Int) {
    orderCreateds(where: { buyer: $buyer }, first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
      amount
      messages
      orderId
      collection {
        amount
      drop {
        metadata {
          cover
          title
        }
        collections {
          collectionId
        }
        uri
      }
      metadata {
        access
        visibility
        video
        title
        onChromadin
        sex
        style
        tags
        prompt
        sizes
        microbrand
        mediaTypes
        mediaCover
        id
        description
        audio
        colors
        images
        microbrandCover
      }
      postId
      acceptedTokens
      uri
      printType
      price
      designer
      tokenIdsMinted
      dropId
      collectionId
      unlimited
      origin
      blockTimestamp
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

const ORDERS_PAGINATED_TRIPLEA = `
  query($buyer: String!, $first: Int, $skip: Int) {
    collectionPurchaseds(where: { buyer: $buyer }, first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
     id
      totalPrice
      paymentToken
      mintedTokens
      transactionHash
      collectionId
      collection {
        metadata {
          image
          title
          format
        }
        id
        collectionType
        artist
        drop {
        cover
        title
      }
      }
      buyer
      amount
      blockTimestamp
      fulfilled
      fulfillment
      fulfiller
    }
  }
`;

export const getOrders = async (buyer: string): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const client = typeof window === "undefined" ? graphPrintServer : graphClient;

  const queryPromise = client.query({
    query: gql(ORDERS),
    variables: { buyer },
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
  buyer: string,
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const client = typeof window === "undefined" ? graphPrintServer : graphClient;

  const queryPromise = client.query({
    query: gql(ORDERS_PAGINATED),
    variables: { buyer, first, skip },
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

export const getOrdersPaginatedTripleA = async (
  buyer: string,
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const client = typeof window === "undefined" ? graphTripleServer : tripleAClient;

  const queryPromise = client.query({
    query: gql(ORDERS_PAGINATED_TRIPLEA),
    variables: { buyer, first, skip },
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

const ORDERS_QUICK = `
  query($buyer: String!) {
    orderCreateds(where: {buyer: $buyer}) {
      collection {
       uri
       
      }
    }
  }
`;

export const getOrdersQuick = async (
  buyer: `0x${string}`
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const client = typeof window === "undefined" ? graphPrintServer : graphClient;

  const queryPromise = client.query({
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
