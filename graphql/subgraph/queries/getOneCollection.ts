import { FetchResult, gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/graph/client";

const COLLECTION = `
  query($collectionId: String!) {
    collectionCreateds(where: {collectionId: $collectionId}, first: 1) {
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
        prompt
        profileHandle
        sizes
        microbrand
        mediaTypes
        sex
        extra
        onChromadin
        style
        mediaCover
        id
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

export const COLLECTION_RANDOM = `query($origin: String!) {
  collectionCreateds(where: {origin: $origin} first: 1) {
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
      onChromadin
      prompt
      profileHandle
      sizes
      microbrand
      mediaTypes
      mediaCover
      extra
      id
      description
      audio
      colors
      communities
      images
      sex
      style
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
}`;

const COLLECTION_ORDER = `
  query($collectionId: String!) {
    collectionCreateds(where: {collectionId: $collectionId}, first: 1) {
      origin
      pubId
      collectionMetadata {
        title
        images
      }
    }
  }
`;

const COLLECTION_QUICK = `
  query($collectionId: String!) {
    collectionCreateds(where: {collectionId: $collectionId}, first: 1) {
      collectionId
      collectionMetadata {
        title
        images
      }
    }
  }
`;

const COLLECTION_TITLE = `
  query($title: String!, $origin: String!) {
    collectionCreateds(where:{ and: [{collectionMetadata_: { title_starts_with_nocase: $title }}, {collectionMetadata_: { title_ends_with_nocase: $title}}, {origin: $origin}]}, first: 1) {
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
        sex
        style
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
  origin: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(COLLECTION_RANDOM),
    variables: {
      origin,
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
  title: string,
  origin: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(COLLECTION_TITLE),
    variables: {
      title,
      origin,
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
