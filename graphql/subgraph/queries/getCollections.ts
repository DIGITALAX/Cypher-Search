import { FetchResult, gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/graph/client";

const COLLECTIONS = `
  query($creator: String!) {
    collectionCreateds(where: {creator: $creator}) {
      amount
      title
      tags
      pubId
      prompt
      profileId
      profileHandle
      printType
      prices
      owner
      mediaTypes
      microbrandCover
      microbrand
      images
      fulfillerPercent
      fulfillerBase
      fulfiller
      designerPercent
      drop
      description
      communities
      collectionId
      access
      unlimited
      colors
      sizes
      origin
    }
  }
`;

export const getCollections = async (
  creator: string
): Promise<FetchResult | void> => {
  const queryPromise = graphPrintClient.query({
    query: gql(COLLECTIONS),
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
