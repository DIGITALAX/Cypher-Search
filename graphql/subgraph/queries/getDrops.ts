import { FetchResult, gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/graph/client";
import { FilterInput } from "@/components/Tiles/types/tiles.types";

const DROPS = `
  query($creator: String!) {
    dropCreateds(where: { creator: $creator}) {
      creator
      title
      cover
      dropId
      collectionIds
    }
  }
`;

const DROP = `
  query($creator: String!, $title: String!) {
    dropCreateds(where: { creator: $creator, title: $title}, first: 1) {
      creator
      title
      cover
      dropId
      collectionIds
    }
  }
`;

export const getDrops = async (
  creator: string
): Promise<FetchResult | void> => {
  const queryPromise = graphPrintClient.query({
    query: gql(DROPS),
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

export const getOneDrop = async (
  creator: string,
  title: string
): Promise<FetchResult | void> => {
  const queryPromise = graphPrintClient.query({
    query: gql(DROP),
    variables: {
      creator,
      title,
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
