import { graphClient } from "@/app/lib/subgraph/client";
import { gql } from "@apollo/client";

const FILTER = `
  query {
    collectionCreateds(first: 1000, skip: 0) {
        metadata {
          tags
          microbrandCover
          microbrand
        }
        drop {
          metadata {
            title
          }
        }
        printType
        postId
        designer
      }
  }
`;

export const getFilters = async (): Promise<any> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphClient.query({
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
