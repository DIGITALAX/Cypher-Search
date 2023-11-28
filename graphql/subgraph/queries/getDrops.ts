import { FetchResult, gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/graph/client";

const DROPS = `
  query($creator: String!) {
    dropCreateds(where: { creator: $creator}) {
      creator
      dropId
      collectionIds
      dropDetails {
        dropTitle
        dropCover
      }
    }
  }
`;

const DROP = `
  query($creator: String!, $dropTitle: String!) {
    dropCreateds(where: { creator: $creator, dropDetails_: { dropTitle: $dropTitle }}, first: 1) {
      creator
      dropDetails {
        dropTitle
        dropCover
      }
      dropId
      collectionIds
    }
  }
`;
export const getDrops = async (
  creator: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(DROPS),
    variables: { creator },
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

export const getOneDrop = async (
  creator: string,
  title: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
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
