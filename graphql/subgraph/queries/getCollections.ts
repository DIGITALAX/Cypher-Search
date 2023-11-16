import { FetchResult, gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/graph/client";

const COLLECTIONS = `
  query($creator: String!) {
    collectionCreateds(where: {creator: $creator}) {
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
      mediaTypes
      microbrandCover
      microbrand
      images
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

const COLLECTIONS_PAGINATED = `
  query($creator: String!, $first: Int, $skip: Int) {
    collectionCreateds(where: {creator: $creator}, first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
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
      mediaTypes
      microbrandCover
      microbrand
      images
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

const COLLECTIONS_QUICK = `
  query($creator: String!, $first: Int, $skip: Int) {
    collectionCreateds(where: {creator: $creator}, first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
      title
      images
      collectionId
    }
  }
`;

export const getCollections = async (
  creator: string
): Promise<FetchResult | void> => {
  const queryPromise = graphPrintClient.query({
    query: gql(COLLECTIONS),
    variables: {
      creator,
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

export const getCollectionsPaginated = async (
  creator: string,
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  const queryPromise = graphPrintClient.query({
    query: gql(COLLECTIONS_PAGINATED),
    variables: {
      creator,
      first,
      skip,
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

export const getCollectionsQuick = async (
  creator: string
): Promise<FetchResult | void> => {
  const queryPromise = graphPrintClient.query({
    query: gql(COLLECTIONS_QUICK),
    variables: {
      creator,
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
