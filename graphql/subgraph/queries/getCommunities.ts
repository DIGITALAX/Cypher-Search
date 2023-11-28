import { gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/graph/client";

const FILTER = `
  query {
    communityCreateds {
        communityMetadata {
          name
          cover
        }
        communityId
      }
  }
`;

const COMMUNITY = `
  query($name: String!) {
    communityCreateds(where: { communityMetadata_: { name: $name }}) {
        validPrintTypes
        validOrigins
        validCreators
        valid20Tokens
        valid20Thresholds
        members
        steward
        blockTimestamp
        communityId
        communityMetadata {
          name
          cover
          description
          subTopic
        }
      }
  }
`;

export const getCommunityShort = async (): Promise<any> => {
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

export const getCommunityName = async (name: string): Promise<any> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(COMMUNITY),
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
