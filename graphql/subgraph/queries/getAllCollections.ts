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
      video
      audio
      prompt
      profileId
      acceptedTokens
      visibility
      uri
      profileHandle
      printType
      prices
      mediaTypes
      owner
      microbrandCover
      microbrand
      images
      soldTokens
      fulfillerPercent
      fulfillerBase
      fulfiller
      designerPercent
      dropId
      dropCollectionIds
      dropCover
      dropTitle
      description
      communities
      mediaCover
      collectionId
      access
      unlimited
      colors
      sizes
      origin
      blockTimestamp
    }
  }
`;

export const getAllCollections = async (
  where: FilterInput,
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
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
  timeoutId =  setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000);
    return () => clearTimeout(timeoutId);
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);

  timeoutId && clearTimeout(timeoutId);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};
