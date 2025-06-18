import {
  LensConnected,
  Quest,
} from "@/app/components/Common/types/common.types";
import fetchIPFSJSON from "./fetchIpfsJson";
import { fetchPost } from "@lens-protocol/client/actions";
import { Post, PublicClient } from "@lens-protocol/client";

const handleQuestData = async (
  quests: Quest[],
  lensConnected: LensConnected | undefined,
  lensClient: PublicClient,
  all?: boolean,
  skipPub?: boolean
): Promise<Quest[]> => {
  const promises = (quests || [])?.map(async (item) => {
    let post;
    if (!skipPub) {
      const data = await fetchPost(lensConnected?.sessionClient ?? lensClient, {
        post: item?.postId,
      });

      if (data?.isOk()) {
        post = data?.value as Post;
      }
    }
    if (!item?.questMetadata) {
      let data = await fetchIPFSJSON(item?.uri);
      item = {
        ...item,
        questMetadata: data,
      };
    }

    if (all) {
      const milestonePromises = item?.milestones?.map(async (mil: any) => {
        if (!mil?.milestoneMetadata) {
          let data = await fetchIPFSJSON(mil?.uri);
          mil = {
            ...mil,
            milestoneMetadata: data,
          };
        }

        const rewardPromises = mil?.rewards?.map(async (reward: any) => {
          if (reward.type == "1") {
            if (!reward?.rewardMetadata) {
              const fetched = await fetchIPFSJSON(reward?.uri);
              return {
                ...reward,
                rewardMetadata: fetched,
              };
            } else {
              return reward;
            }
          } else {
            return reward;
          }
        });

        return {
          ...mil,
          rewards: await Promise.all(rewardPromises),
        };
      });

      return (item = {
        ...item,
        milestones: await Promise.all(milestonePromises),
        post,
      });
    }

    return {
      ...item,
      post,
    };
  });

  return await Promise.all(promises);
};

export default handleQuestData;
