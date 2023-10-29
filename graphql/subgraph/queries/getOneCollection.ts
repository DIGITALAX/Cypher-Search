import { FetchResult, gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/graph/client";

const COLLECTIONS = `
  query($collectionId: String!) {
    collectionCreateds(where: {collectionId: $collectionId}) {
      collectionId
      uri
      fulfiller
      prices
      printType
    }
  }
`;

export const getOneCollection = async (collectionId: string): Promise<FetchResult | void> => {
  const queryPromise = graphPrintClient.query({
    query: gql(COLLECTIONS),
    variables: {
      collectionId,
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
