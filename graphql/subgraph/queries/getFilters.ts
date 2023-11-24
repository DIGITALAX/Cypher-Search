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
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(FILTER),
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
