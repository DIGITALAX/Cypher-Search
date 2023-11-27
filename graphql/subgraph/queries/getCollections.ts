import { FetchResult, gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/graph/client";

const COLLECTIONS = `
  query($owner: String!) {
    collectionCreateds(where: {owner: $owner}) {
      amount
      title
      tags
      pubId
      uri
      prompt
      mediaCover
      profileId
      profileHandle
      printType
      prices
      video
      audio
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
      acceptedTokens
      unlimited
      colors
      sizes
      origin
      soldTokens
      blockTimestamp
      visibility
    }
  }
`;

const COLLECTIONS_PAGINATED = `
  query($owner: String!, $first: Int, $skip: Int) {
    collectionCreateds(where: {owner: $owner}, first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
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
      soldTokens
      microbrand
      images
      video
      audio
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
      uri
      collectionId
      access
      unlimited
      colors
      acceptedTokens
      sizes
      origin
      blockTimestamp
      visibility
    }
  }
`;

const COLLECTIONS_QUICK = `
  query($owner: String!, $first: Int, $skip: Int) {
    collectionCreateds(where: {owner: $owner}, first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
      title
      images
      collectionId
    }
  }
`;

export const getCollections = async (
  owner: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(COLLECTIONS),
    variables: {
      owner,
    },
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

export const getCollectionsPaginated = async (
  owner: string,
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(COLLECTIONS_PAGINATED),
    variables: {
      owner,
      first,
      skip,
    },
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

export const getCollectionsQuick = async (
  owner: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(COLLECTIONS_QUICK),
    variables: {
      owner,
    },
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
