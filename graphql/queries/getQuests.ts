import { KINORA_QUEST_DATA } from "@/app/lib/constants";
import serializeQuery from "@/app/lib/helpers/serializeQuery";
import { graphKinoraClient, graphKinoraServer } from "@/app/lib/subgraph/client";
import { FetchResult, gql } from "@apollo/client";

export const getQuestsWhere = async (
  where: Object,
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const client = typeof window === "undefined" ? graphKinoraServer : graphKinoraClient;

  const queryPromise = client.query({
    query: gql(`
    query($first: Int, $skip: Int) {
      questInstantiateds(first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp, where: {${serializeQuery(
        where
      )}}){
        questMetadata {
          id
          title
          description
          cover
          videoCovers
        }
        milestones {
          uri
            milestoneMetadata {
              title
              description
              cover
            }
          rewards {
            type
          }
          rewardsLength
          videoLength
        }
        maxPlayerCount
        questId
        postId
        uri
        milestoneCount
        players {
          playerProfile
      }
    }
    }
  `),
    variables: {
      first,
      skip,
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

export const getQuests = async (
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const client = typeof window === "undefined" ? graphKinoraServer : graphKinoraClient;

  const queryPromise = client.query({
    query: gql(`
    query($first: Int, $skip: Int, $contractAddress: String) {
      questInstantiateds(first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp, where: {contractAddress: $contractAddress}) {
          questMetadata {
            id
            title
            description
            cover
            videoCovers
          }
          milestones {
            uri
              milestoneMetadata {
                title
                description
                cover
              }
            rewards {
              type
            }
            rewardsLength
            videoLength
          }
          maxPlayerCount
          questId
          postId
          uri
          milestoneCount
          players {
            playerProfile
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

export const getQuestByProfile = async (
  where: Object,
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const client = typeof window === "undefined" ? graphKinoraServer : graphKinoraClient;

  const queryPromise = client.query({
    query: gql(`
    query($first: Int, $skip: Int) {
      questInstantiateds(first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp, where: {${serializeQuery(
        where
      )}}) {
        questMetadata {
          id
          title
          description
          cover
          videoCovers
        }
        milestones {
          uri
            milestoneMetadata {
              title
              description
              cover
            }
          rewards {
            type
          }
          rewardsLength
          videoLength
        }
        maxPlayerCount
        questId
        postId
        uri
        milestoneCount
        players {
          playerProfile
      }
    }
    }
  `),
    variables: {
      first,
      skip,
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

export const getQuestSample = async (
  playerProfile: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const client = typeof window === "undefined" ? graphKinoraServer : graphKinoraClient;

  const queryPromise = client.query({
    query: gql(`
    query($playerProfile: String) {
      questInstantiateds(first: 4, orderDirection: desc, orderBy: blockTimestamp, where: {playerProfile: $playerProfile}) {
        gate {
          erc721Logic {
            uris
            tokenIds
            address
          }
          erc20Logic {
            address
            amount
          }
          oneOf
        }
        questMetadata {
          id
          title
          description
          cover
          videoCovers
        }
        milestones {
          gated {
            erc721Logic {
              uris
              tokenIds
              address
            }
            erc20Logic {
              address
              amount
              id
            }
            oneOf
          }
          uri
          milestoneMetadata {
            title
            description
            cover
          }
          milestoneId
          rewards {
            amount
            tokenAddress
            uri
            rewardMetadata {
              title
              description
              cover
              mediaCover
              images
              video
              mediaType
              audio
            }
            type
          }
          rewardsLength
          videoLength
        }
        maxPlayerCount
        questId
        status
        postId
        transactionHash
        blockTimestamp
        uri
        milestoneCount
        players {
          milestonesCompleted {
            questId
            milestonesCompleted
          }
          eligibile {
            milestone
            questId
            status
          }
          playerProfile
          questsCompleted
          questsJoined
        }
      }
    }
  `),
    variables: {
      playerProfile,
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

export const getPlayers = async (
  playerProfile: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const client = typeof window === "undefined" ? graphKinoraServer : graphKinoraClient;

  const queryPromise = client.query({
    query: gql(`
    query($playerProfile: String) {
      players(first: 4, where: {playerProfile: $playerProfile}) {
        playerProfile
        questsCompleted
        questsJoined
      }
    }
  `),
    variables: {
      playerProfile,
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

export const getQuest = async (postId: string): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const client = typeof window === "undefined" ? graphKinoraServer : graphKinoraClient;

  const queryPromise = client.query({
    query: gql(`
    query($postId: String, $contractAddress: String) {
      questInstantiateds(first: 1, orderDirection: desc, orderBy: blockTimestamp, where: {postId: $postId, contractAddress: $contractAddress}) {
        gate {
          erc721Logic {
            uris
            tokenIds
            address
          }
          erc20Logic {
            address
            amount
          }
          oneOf
        }
        questMetadata {
          id
          title
          description
          cover
          videoCovers
        }
        milestones {
          gated {
            erc721Logic {
              uris
              tokenIds
              address
            }
            erc20Logic {
              address
              amount
              id
            }
            oneOf
          }
          uri
          milestoneMetadata {
            title
            description
            cover
          }
          milestoneId
          rewards {
            amount
            tokenAddress
            uri
            rewardMetadata {
              title
              description
              cover
              mediaCover
              images
              video
              mediaType
              audio
            }
            type
          }
          rewardsLength
          videoLength
        }
        maxPlayerCount
        questId
        postId
        status
        transactionHash
        blockTimestamp
        uri
        milestoneCount
        players {
          milestonesCompleted {
            questId
            milestonesCompleted
          }
          eligibile {
            milestone
            questId
            status
          }
          playerProfile
          questsCompleted
          questsJoined
        }
      }
    }
  `),
    variables: {
      postId,
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

export const getQuestById = async (
  questId: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const client = typeof window === "undefined" ? graphKinoraServer : graphKinoraClient;

  const queryPromise = client.query({
    query: gql(`
    query($questId: Int, $contractAddress: String) {
      questInstantiateds(first: 1, orderDirection: desc, orderBy: blockTimestamp, where: {questId: $questId, contractAddress: $contractAddress}) {
        gate {
          erc721Logic {
            uris
            tokenIds
            address
          }
          erc20Logic {
            address
            amount
          }
          oneOf
        }
        questMetadata {
          id
          title
          description
          cover
          videoCovers
        }
        milestones {
          gated {
            erc721Logic {
              uris
              tokenIds
              address
            }
            erc20Logic {
              address
              amount
              id
            }
            oneOf
          }
          uri
          milestoneMetadata {
            title
            description
            cover
          }
          milestoneId
          rewards {
            amount
            tokenAddress
            uri
            rewardMetadata {
              title
              description
              cover
              mediaCover
              images
              video
              mediaType
              audio
            }
            type
          }
          rewardsLength
          videoLength
        }
        maxPlayerCount
        questId
        postId
        status
        transactionHash
        blockTimestamp
        uri
        milestoneCount
        players {
          milestonesCompleted {
            questId
            milestonesCompleted
          }
          eligibile {
            milestone
            questId
            status
          }
          playerProfile
          questsCompleted
          questsJoined
        }
      }
    }
  `),
    variables: {
      questId,
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
