import { Award } from "@/app/components/Common/types/common.types";
import fetchIPFSJSON from "./fetchIpfsJson";

const handleAwardsData = async (
  awards: Award[]
): Promise<Award[] | undefined> => {
  try {
    const promises = awards?.map(async (reward: Award) => {
      if (!reward.questMetadata) {
        const data = await fetchIPFSJSON(reward?.questURI);
        reward = {
          ...reward,
          questMetadata: data,
        };
      }
      if (!reward?.rewardMetadata) {
        const data = await fetchIPFSJSON(reward?.uri);
        return {
          ...reward,
          rewardMetadata: data,
        };
      } else {
        return reward;
      }
    });
    return await Promise.all(promises);
  } catch (err: any) {
    console.error(err.message);
  }
};

export default handleAwardsData;
