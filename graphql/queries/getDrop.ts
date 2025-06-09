import { graphClient, tripleAClient } from "@/app/lib/subgraph/client";
import { FetchResult, gql } from "@apollo/client";

export const DROP_TRIPLEA = `query($title: String!) {
  dropCreateds(where: {metadata_: {title_contains_nocase: $title}}) {
    artist
    collections {
      active
      agentIds
      amountSold
      amount
      transactionHash
      tokenIds
      remixable
      remixId
      prices {
        price
        token
      }
      metadata {
        title
        prompt
        model
        image
        sizes
        format
        description
        colors
        id
      }
      isAgent
      fulfillerId
      dropUri
      dropId
      collectionType
      collectionId
      artist
    }
    collectionIds
    dropId
    id
    uri
    metadata {
      cover
      title
    }
  }
}`;

export const getTripleADrop = async (
  title: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = tripleAClient.query({
    query: gql(DROP_TRIPLEA),
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

export const DROP_PRINT = `query($title: String!) {
  dropCreateds(where: {metadata_: {title_contains_nocase: $title}}) {
    dropId
    designer
    uri
    transactionHash
    metadata {
      title
      cover
    }
    blockTimestamp
    blockNumber
    collections {
      blockNumber
      acceptedTokens
      unlimited
      uri
      transactionHash
      tokenIdsMinted
      printType
      postId
      price
      id
      fulfiller
      frozen
      dropId
      blockTimestamp
      collectionId
      amount
      origin
      metadata {
        video
        visibility
        title
        tags
        sex
        style
        sizes
        onChromadin
        microbrandCover
        prompt
        microbrand
        mediaTypes
        mediaCover
        images
        description
        extra
        id
        audio
        colors
        access
      }
    }
  }
}`;


export const DROPS_ALL_PRINT = `query($designer: String!) {
  dropCreateds(where: {designer: $designer}) {
    dropId
    uri
    transactionHash
    metadata {
      title
      cover
    }
    blockTimestamp
    blockNumber
    collections {
      blockNumber
      acceptedTokens
      unlimited
      uri
      transactionHash
      tokenIdsMinted
      printType
      postId
      price
      id
      fulfiller
      frozen
      dropId
      designer
      blockTimestamp
      collectionId
      amount
      origin
      metadata {
        video
        visibility
        title
        tags
        sex
        style
        sizes
        onChromadin
        microbrandCover
        prompt
        microbrand
        mediaTypes
        mediaCover
        images
        description
        extra
        id
        audio
        colors
        access
      }
    }
  }
}`;

export const getPrintDrop = async (
  title: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphClient.query({
    query: gql(DROP_PRINT),
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

export const getDropsPrint = async (
  designer: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphClient.query({
    query: gql(DROPS_ALL_PRINT),
    variables: {
      designer,
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


export const DROPS_ALL_TRIPLEA = `query($artist: String!) {
  dropCreateds(where: {artist: $artist}) {
    artist
    collections {
      active
      agentIds
      amountSold
      amount
      transactionHash
      tokenIds
      remixable
      remixId
      prices {
        price
        token
      }
      metadata {
        title
        prompt
        model
        image
        sizes
        format
        description
        colors
        id
      }
      isAgent
      fulfillerId
      dropUri
      dropId
      collectionType
      collectionId
      artist
    }
    collectionIds
    dropId
    id
    uri
    metadata {
      cover
      title
    }
  }
}`;


export const getDropsTripleA = async (
  artist: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = tripleAClient.query({
    query: gql(DROPS_ALL_TRIPLEA),
    variables: {
      artist,
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
