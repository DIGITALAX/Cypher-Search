import { FetchResult, gql } from "@apollo/client";
import { autographClient } from "../../../lib/graph/client";

const ARTICULO = gql`
  query ($first: Int, $skip: Int) {
    collections(first: $first, skip: $skip) {
      uri
      type
      price
      mintedTokens
      galleryId
      id
      designer
      collectionMetadata {
        title
        tipo
        tags
        npcs
        instructions
        locales
        image
        id
        gallery
        description
      }
      collectionId
      amount
      acceptedTokens
      profileIds
      pubIds
    }
  }
`;

const UN_ARTICULO = gql`
  query ($title: String) {
    collections(where: { collectionMetadata_: { title: $title } }) {
      uri
      type
      price
      mintedTokens
      galleryId
      id
      designer
      collectionMetadata {
        title
        tipo
        tags
        npcs
        instructions
        locales
        image
        id
        gallery
        description
      }
      collectionId
      amount
      acceptedTokens
      profileIds
      pubIds
    }
  }
`;

export const getArticulo = async (
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = autographClient.query({
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
  const queryPromise = autographClient.query({
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