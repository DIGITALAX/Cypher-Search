import { FetchResult, gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/graph/client";
import { FilterInput } from "@/components/Tiles/types/tiles.types";

const TEXT = `
  query($text: String, $first: Int, $skip: Int) {
    cyphersearch(text: $text, first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
      amount
      dropMetadata {
        dropCover
        dropTitle
      }
      collectionMetadata {
        access
        visibility
        video
        title
        tags
        prompt
        profileHandle
        sizes
        microbrand
        mediaTypes
        mediaCover
        id
        description
        audio
        colors
        communities
        images
        microbrandCover
      }
      pubId
      profileId
      acceptedTokens
      uri
      printType
      prices
      owner
      soldTokens
      fulfillerPercent
      fulfillerBase
      fulfiller
      designerPercent
      dropId
      dropCollectionIds
      collectionId
      unlimited
      origin
      blockTimestamp
    }
  }
`;

const TEXT_WHERE = `
query($text: String, $where: FilterInput, $first: Int, $skip: Int) {
  cyphersearch(text: $text, where: $where, first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
    amount
    dropMetadata {
      dropCover
      dropTitle
    }
    collectionMetadata {
      access
      visibility
      video
      title
      tags
      prompt
      profileHandle
      sizes
      microbrand
      mediaTypes
      mediaCover
      id
      description
      audio
      colors
      communities
      images
      microbrandCover
    }
    pubId
    profileId
    acceptedTokens
    uri
    printType
    prices
    owner
    soldTokens
    fulfillerPercent
    fulfillerBase
    fulfiller
    designerPercent
    dropId
    dropCollectionIds
    collectionId
    unlimited
    origin
    blockTimestamp
  }
}
`;

export const getTextSearch = async (
  text: string,
  first: number,
  skip: number
): Promise<any> => {
  let timeoutId: NodeJS.Timeout | undefined;
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

export const getTextFilterSearch = async (
  text: string,
  where: FilterInput,
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
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
