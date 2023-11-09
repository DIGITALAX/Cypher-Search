import { FetchResult, gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/graph/client";
import { FilterInput } from "@/components/Tiles/types/tiles.types";

const COLLECTIONS = `
  query($where: FilterInput, $first: Int, $skip: Int) {
    collectionCreateds(where: $where, first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
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

export const getAllCollections = async (
  where: FilterInput,
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  const queryPromise = graphPrintClient.query({
    query: gql(COLLECTIONS),
    variables: {
      where,
      first,
      skip,
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
