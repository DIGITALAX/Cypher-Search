import { autographClient, graphAutoServer } from "@/app/lib/subgraph/client";
import { FetchResult, gql } from "@apollo/client";

const ARTICULO = gql`
  query ($first: Int, $skip: Int) {
    collections(first: $first, skip: $skip) {
      uri
      type
      price
      mintedTokenIds
      galleryId
      id
      npcs
      designer
      metadata {
        title
        tags
        images
        description
      }
      collectionId
      amount
      acceptedTokens
      postIds
    }
  }
`;

const UN_ARTICULO = gql`
  query ($title: String) {
    collections(where: { metadata_: { title: $title } }) {
      uri
      type
      price
      mintedTokenIds
      galleryId
      id
      npcs
      designer
      metadata {
        title
        tags
        images
        description
      }
      collectionId
      amount
      acceptedTokens
      postIds
    }
  }
`;

export const getArticulo = async (
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const client = typeof window === "undefined" ? graphAutoServer : autographClient;

  const queryPromise = client.query({
    query: ARTICULO,
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
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);

  timeoutId && clearTimeout(timeoutId);

  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

export const getUnArticulo = async (
  title: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const client = typeof window === "undefined" ? graphAutoServer : autographClient;

  const queryPromise = client.query({
    query: UN_ARTICULO,
    variables: {
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
