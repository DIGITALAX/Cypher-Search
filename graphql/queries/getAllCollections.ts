import serializeQuery from "@/app/lib/helpers/serializeQuery";
import { graphClient, tripleAClient } from "@/app/lib/subgraph/client";
import { FetchResult, gql } from "@apollo/client";

export const COLLECTION_RANDOM = `query($origin: String!) {
  collectionCreateds(where: {origin: $origin}, first: 1) {
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
    }`;

const COLLECTION = `
  query($collectionId: Int!) {
  collectionCreateds(where: {collectionId: $collectionId}, first: 1) {
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
    }
`;

const COLLECTION_QUICK_POSTID = `
  query($postId: String!) {
  collectionCreateds(where: {postId: $postId}, first: 1) {
      metadata {
        title
      }
      }
    }
`;

const COLLECTION_QUICK = `
  query($origin: Int!, $title: String!) {
  collectionCreateds(where: {origin: $origin, metadata_: {title_contains_nocase: $title}}, first: 1) {
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
    }
`;

const COLLECTIONS_PAGINATED_SITEMAP = `
query($first: Int, $skip: Int) {
  collectionCreateds(first: $first, skip: $skip) {
      metadata {
        title
        images
        mediaCover
      }
      uri
      origin
      }
    }`;

const COLLECTIONS_PAGINATED = `
  query($designer: String!, $first: Int, $skip: Int) {
  collectionCreateds(where: {designer: $designer}, first: $first, skip: $skip) {
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
    }
`;

const COLLECTIONS_PAGINATED_TRIPLEA = `
  query($artist: String!, $first: Int, $skip: Int) {
  collectionCreateds(where: {artist: $artist}, first: $first, skip: $skip) {
       id
      artist
      collectionId
      metadata {
        image
        title
        description
        format
        sizes
        colors
        model
        prompt
      }
      drop {
        cover
        title
      }
      dropId
      amountSold
      amount
      agentIds
      tokenIds
      active
      collectionType
      transactionHash
      uri
      prices {
        price
        token
      }
      blockTimestamp
      isAgent
      remixId
      remixable
      fulfillerId
      collectionType
    }
    }
`;

export const getAllCollections = async (
  where: Object,
  first: number,
  skip: number,
  orderDirection: string,
  orderBy: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphClient.query({
    query: gql(`
    query($first: Int, $skip: Int, $orderDirection: String, $orderBy: String) {
      collectionCreateds(where: {${serializeQuery(
        where
      )}}, first: $first, skip: $skip, orderDirection: ${orderDirection?.replaceAll(
      '"',
      ""
    )}, orderBy: ${orderBy?.replaceAll('"', "")}) {
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
    }
  `),
    variables: {
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

export const getAllCollectionsTripleA = async (
  where: Object,
  first: number,
  skip: number,
  orderDirection: string,
  orderBy: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;

  const queryPromise = tripleAClient.query({
    query: gql(`
    query($first: Int, $skip: Int, $orderDirection: String, $orderBy: String) {
      collectionCreateds(where: {${serializeQuery(
        where
      )}}, first: $first, skip: $skip, orderDirection: ${orderDirection?.replaceAll(
      '"',
      ""
    )}, orderBy: ${orderBy?.replaceAll('"', "")}) {
        id
      artist
      collectionId
      metadata {
        image
        title
        description
        format
        sizes
        colors
        model
        prompt
      }
      dropId
      amountSold
      amount
      agentIds
      tokenIds
      active
      collectionType
      transactionHash
      uri
      prices {
        price
        token
      }
      blockTimestamp
      isAgent
      remixId
      remixable
      fulfillerId
      collectionType
    }
    }
  `),
    variables: {
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

export const getOneRandomCollection = async (
  origin: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphClient.query({
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

export const getOneCollectionByPostId = async (
  postId: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphClient.query({
    query: gql(COLLECTION_QUICK_POSTID),
    variables: {
      postId,
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

export const getOneCollectionQuick = async (
  origin: number,
  title: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphClient.query({
    query: gql(COLLECTION_QUICK),
    variables: {
      origin,
      title,
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

export const getOneCollection = async (
  collectionId: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphClient.query({
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

export const getCollectionsSitemap = async (
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS_PAGINATED_SITEMAP),
    variables: { first, skip },
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

export const getCollectionsPaginated = async (
  designer: string,
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS_PAGINATED),
    variables: { designer, first, skip },
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

export const getCollectionsPaginatedTripleA = async (
  artist: string,
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = tripleAClient.query({
    query: gql(COLLECTIONS_PAGINATED_TRIPLEA),
    variables: { artist, first, skip },
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

const COLLECTIONS = `
  query($designer: String!) {
    collectionCreateds(where: {designer: $designer}, first: 1000) {
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
    }
`;

export const getCollections = async (
  designer: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS),
    variables: {
      designer,
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

const COLLECTION_TITLE = `
  query($title: String!, $origin: String!) {
    collectionCreateds(where:{ and: [{metadata_: { title_starts_with_nocase: $title }}, {metadata_: { title_ends_with_nocase: $title}}, {origin: $origin}]}, first: 1) {
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
    }
`;

export const getOneCollectionTitle = async (
  title: string,
  origin: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphClient.query({
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

const COLLECTION_TITLE_TRIPLEA = `
  query($title: String!) {
  collectionCreateds(where: {metadata_: {title_contains_nocase: $title}}, first: 1) {
       id
      artist
      collectionId
      metadata {
        image
        title
        description
        format
        sizes
        colors
        model
        prompt
      }
      dropId
      amountSold
      amount
      agentIds
      tokenIds
      active
      collectionType
      transactionHash
      uri
      prices {
        price
        token
      }
      blockTimestamp
      isAgent
      remixId
      remixable
      fulfillerId
      collectionType
    }
    }
`;

export const getOneCollectionTripleA = async (
  title: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = tripleAClient.query({
    query: gql(COLLECTION_TITLE_TRIPLEA),
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
