import { FetchResult, gql } from "@apollo/client";
import { graphKinoraClient } from "../../../lib/graph/client";
import { KINORA_QUEST_DATA } from "../../../lib/constants";
import serializeQuery from "../../../lib/helpers/serializeQuery";

export const getQuestsWhere = async (
  where: Object,
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
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
        pubId
        profileId
        uri
        milestoneCount
        players {
          profileId
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
  const queryPromise = graphKinoraClient.query({
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
          pubId
          profileId
          uri
          milestoneCount
          players {
            profileId
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
  const queryPromise = graphKinoraClient.query({
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
        pubId
        profileId
        uri
        milestoneCount
        players {
          profileId
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
  profileId: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
    query: gql(`
    query($profileId: Int) {
      questInstantiateds(first: 4, orderDirection: desc, orderBy: blockTimestamp, where: {profileId: $profileId}) {
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
        pubId
        status
        profileId
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
          profileId
          questsCompleted
          questsJoined
        }
      }
    }
  `),
    variables: {
      profileId,
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
  profileId: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
    query: gql(`
    query($profileId: Int) {
      players(first: 4, where: {profileId: $profileId}) {
        profileId
        questsCompleted
        questsJoined
      }
    }
  `),
    variables: {
      profileId,
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

export const getQuest = async (
  profileId: number,
  pubId: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
    query: gql(`
    query($profileId: Int, $pubId: Int, $contractAddress: String) {
      questInstantiateds(first: 1, orderDirection: desc, orderBy: blockTimestamp, where: {profileId: $profileId, pubId: $pubId, contractAddress: $contractAddress}) {
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
        pubId
        status
        profileId
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
          profileId
          questsCompleted
          questsJoined
        }
      }
    }
  `),
    variables: {
      pubId,
      profileId,
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
  questId: number,
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
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
        pubId
        status
        profileId
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
          profileId
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
