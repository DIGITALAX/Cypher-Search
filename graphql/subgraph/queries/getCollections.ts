import { FetchResult, gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/graph/client";

const COLLECTIONS = `
  query($owner: String!) {
    collectionCreateds(where: {owner: $owner}, first: 1000) {
      amount
      dropMetadata {
        dropCover
        dropTitle
      }
      collectionMetadata {
        access
        visibility
        video
        title
        tags
        sex
        onChromadin
        style
        prompt
        profileHandle
        sizes
        microbrand
        mediaTypes
        mediaCover
        id
        description
        audio
        extra
        colors
        communities
        images
        microbrandCover
      }
      pubId
      profileId
      acceptedTokens
      uri
      printType
      prices
      owner
      soldTokens
      fulfillerPercent
      fulfillerBase
      fulfiller
      designerPercent
      dropId
      dropCollectionIds
      collectionId
      unlimited
      origin
      blockTimestamp
    }
  }
`;

const COLLECTIONS_PAGINATED = `
  query($owner: String!, $first: Int, $skip: Int) {
    collectionCreateds(where: {owner: $owner}, first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
      amount
      dropMetadata {
        dropCover
        dropTitle
      }
      collectionMetadata {
        access
        visibility
        video
        sex
        style
        title
        tags
        prompt
        onChromadin
        profileHandle
        sizes
        microbrand
        mediaTypes
        mediaCover
        id
        extra
        description
        audio
        colors
        communities
        images
        microbrandCover
      }
      pubId
      profileId
      acceptedTokens
      uri
      printType
      prices
      owner
      soldTokens
      fulfillerPercent
      fulfillerBase
      fulfiller
      designerPercent
      dropId
      dropCollectionIds
      collectionId
      unlimited
      origin
      blockTimestamp
    }
  }
`;

const COLLECTIONS_QUICK = `
  query($owner: String!, $skip: Int!, $first: Int!) {
    collectionCreateds(where: {owner: $owner}, first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
      collectionId
      collectionMetadata {
        mediaCover
        title
        images
      }
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
  owner: string,
  skip: number,
  first: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(COLLECTIONS_QUICK),
    variables: {
      owner,
      skip,
      first,
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

export const getCollectionId = async (
  collectionId: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(`
    query($collectionId: String) {
      collectionCreateds(first: 1, where: { collectionId: $collectionId}, orderDirection: desc, orderBy: blockTimestamp) {
        collectionMetadata {
          title
          mediaCover
          images
        }
        uri
        origin
      }
    }
  `),
    variables: {
      collectionId,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000);
    return () => clearTimeout(timeoutId);
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);

  timeoutId && clearTimeout(timeoutId);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

export const getCollectionByUri = async (uri: string): Promise<any> => {
  const queryPromise = graphPrintClient.query({
    query: gql(`query($uri: String) {
      collectionCreateds(first: 1, where: { uri: $uri}, orderDirection: desc, orderBy: blockTimestamp) {
        collectionMetadata {
          title
          mediaCover
          images
        }
        uri
        origin
      }
    }`),
    variables: {
      uri,
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
