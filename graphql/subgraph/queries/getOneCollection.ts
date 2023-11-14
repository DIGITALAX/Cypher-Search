import { FetchResult, gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/graph/client";

const COLLECTIONS = `
  query($collectionId: String!) {
    collectionCreateds(where: {collectionId: $collectionId}) {
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
      mediaType
      fulfillerPercent
      fulfillerBase
      fulfiller
      designerPercent
      drop
      description
      communities
      collectionId
      access
      unlimited
      colors
      sizes
      origin
    }
  }
`;

export const COLLECTIONS_RANDOM = `query($origin: String!, $profileId: String!) {
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
    fulfillerPercent
    fulfillerBase
    fulfiller
    designerPercent
    drop
    description
    communities
    collectionId
    access
    unlimited
    colors
    sizes
    origin
  }
}`;

const COLLECTION_ORDER = `
  query($collectionId: String!) {
    collectionCreateds(where: {collectionId: $collectionId}) {
      title
      images
      origin
      pubId
    }
  }
`;

export const getOneCollection = async (
  collectionId: string
): Promise<FetchResult | void> => {
  const queryPromise = graphPrintClient.query({
    query: gql(COLLECTIONS),
    variables: {
      collectionId,
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

export const getOneRandomCollection = async (
  origin: string,
  profileId: string
): Promise<FetchResult | void> => {
  const queryPromise = graphPrintClient.query({
    query: gql(COLLECTIONS_RANDOM),
    variables: {
      origin,
      profileId,
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

export const getCollectionOrder = async (
  collectionId: string
): Promise<FetchResult | void> => {
  const queryPromise = graphPrintClient.query({
    query: gql(COLLECTION_ORDER),
    variables: {
      collectionId,
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
