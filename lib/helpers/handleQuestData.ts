import { Quest } from "@/components/Search/types/search.types";
import toHexWithLeadingZero from "./leadingZero";
import getPublication from "../../graphql/lens/queries/publication";
import { Profile } from "../../graphql/generated";
import fetchIPFSJSON from "./fetchIpfsJson";

const handleQuestData = async (
  quests: Quest[],
  lensConnected: Profile | undefined,
  all?: boolean,
  skipPub?: boolean
): Promise<Quest[]> => {
  const promises = (quests || [])?.map(async (item: any) => {
    let publication;
    if (!skipPub) {
      publication = await getPublication(
        {
          forId: `${toHexWithLeadingZero(
            Number(item?.profileId)
          )}-${toHexWithLeadingZero(Number(item?.pubId))}`,
        },
        lensConnected?.id
      );
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
        publication: publication?.data?.publication,
      });
    }

    return {
      ...item,
      publication: publication?.data?.publication,
    };
  });

  return await Promise.all(promises);
};

export default handleQuestData;
