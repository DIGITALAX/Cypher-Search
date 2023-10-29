import { FetchResult, gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/graph/client";
import { FilterInput } from "@/components/Tiles/types/tiles.types";

const TEXT = `
  query($text: String, $first: Int, $skip: Int) {
    cyphersearch(text: $text, first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
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

const TEXT_WHERE = `
query($text: String, $where: FilterInput, $first: Int, $skip: Int) {
  cyphersearch(text: $text, where: $where, first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
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

export const getTextSearch = async (
  text: string,
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphPrintClient.query({
    query: gql(TEXT),
    variables: {
      text,
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

export const getTextFilterSearch = async (
  text: string,
  where: FilterInput,
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  const queryPromise = graphPrintClient.query({
    query: gql(TEXT_WHERE),
    variables: {
      text,
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
