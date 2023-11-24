import { FetchResult, gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/graph/client";

const COLLECTION = `
  query($collectionId: String!) {
    collectionCreateds(where: {collectionId: $collectionId}, first: 1) {
      amount
      title
      tags
      pubId
      prompt
      profileId
      profileHandle
      printType
      prices
      owner
      microbrandCover
      microbrand
      images
      mediaTypes
      visibility
      soldTokens
      fulfillerPercent
      fulfillerBase
      fulfiller
      designerPercent
      dropId
      dropCollectionIds
      dropCover
      dropTitle
      description
      communities
      collectionId
      access
      unlimited
      colors
      sizes
      origin
      blockTimestamp
    }
  }
`;

export const COLLECTION_RANDOM = `query($origin: String!, $profileId: String!) {
  collectionCreateds(where: {origin: $origin, profileId: $profileId} first: 1) {
    amount
      title
      tags
      pubId
      prompt
      profileId
      profileHandle
      printType
      prices
      owner
      microbrandCover
      microbrand
      images
      mediaTypes
      visibility
      fulfillerPercent
      fulfillerBase
      fulfiller
      designerPercent
      dropId
      dropCollectionIds
      dropCover
      dropTitle
      description
      communities
      collectionId
      soldTokens
      access
      unlimited
      colors
      sizes
      origin
      blockTimestamp
  }
}`;

const COLLECTION_ORDER = `
  query($collectionId: String!) {
    collectionCreateds(where: {collectionId: $collectionId}, first: 1) {
      title
      images
      origin
      pubId
    }
  }
`;

const COLLECTION_QUICK = `
  query($collectionId: String!) {
    collectionCreateds(where: {collectionId: $collectionId}, first: 1) {
      title
      images
      collectionId
    }
  }
`;

const COLLECTION_TITLE = `
  query($title: String!) {
    collectionCreateds(where: {title: $title}, first: 1) {
      amount
      title
      tags
      pubId
      prompt
      profileId
      profileHandle
      printType
      prices
      soldTokens
      owner
      microbrandCover
      microbrand
      images
      mediaTypes
      visibility
      fulfillerPercent
      fulfillerBase
      fulfiller
      designerPercent
      dropId
      dropCollectionIds
      dropCover
      dropTitle
      description
      communities
      collectionId
      access
      unlimited
      colors
      sizes
      origin
      blockTimestamp
    }
  }
`;

export const getOneCollection = async (
  collectionId: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(COLLECTION),
    variables: {
      collectionId,
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

export const getOneRandomCollection = async (
  origin: string,
  profileId: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(COLLECTION_RANDOM),
    variables: {
      origin,
      profileId,
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

export const getCollectionOrder = async (
  collectionId: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(COLLECTION_ORDER),
    variables: {
      collectionId,
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

export const getOneCollectionQuick = async (
  collectionId: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(COLLECTION_QUICK),
    variables: {
      collectionId,
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

export const getOneCollectionTitle = async (
  title: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(COLLECTION_TITLE),
    variables: {
      title,
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
