import { KINORA_QUEST_DATA } from "@/app/lib/constants";
import { graphKinoraClient, graphKinoraServer } from "@/app/lib/subgraph/client";
import { FetchResult, gql } from "@apollo/client";


export const getAllRewards = async (
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const client = typeof window === "undefined" ? graphKinoraServer : graphKinoraClient;

  const queryPromise = client.query({
    query: gql(`
    query($first: Int, $skip: Int, $contractAddress: String) { 
        rewards(where:{ contractAddress: $contractAddress, type: 1}, first: $first, skip: $skip) {
            rewardMetadata {
              videoCovers
              video
              title
              prompt
              mediaType
              mediaCover
              images
              description
              cover
              audio
            }
            amount
            tokenAddress
            type
            uri
            questId
            milestone
            questURI
            postId
            questMetadata {
              videoCovers
              video
              title
              prompt
              mediaType
              mediaCover
              images
              description
              cover
              audio
            }
        }
    }
  `),
    variables: {
      first,
      skip,
      contractAddress: KINORA_QUEST_DATA,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
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
