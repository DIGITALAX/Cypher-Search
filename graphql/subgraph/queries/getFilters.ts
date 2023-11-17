import { gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/graph/client";

const FILTER = `
  query {
    collectionCreateds {
        tags
        microbrandCover
        microbrand
        drop
        colors
        sizes
        printType
        profileId
      }
  }
`;

export const getFilters = async (): Promise<any> => {
  const queryPromise = graphPrintClient.query({
    query: gql(FILTER),
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
