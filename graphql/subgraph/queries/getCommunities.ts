import { gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/graph/client";

const FILTER = `
  query {
    communityCreateds {
        name
        cover
        communityId
      }
  }
`;

const COMMUNITY = `
  query($name: String!) {
    communityCreateds(where: {name: $name}) {
        name
        cover
        description
        subTopic
        validPrintTypes
        validOrigins
        validCreators
        valid20Tokens
        valid20Thresholds
        members
        steward
        blockTimestamp
        communityId
      }
  }
`;

export const getCommunityShort = async (): Promise<any> => {
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

export const getCommunityName = async (name: string): Promise<any> => {
  const queryPromise = graphPrintClient.query({
    query: gql(COMMUNITY),
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
