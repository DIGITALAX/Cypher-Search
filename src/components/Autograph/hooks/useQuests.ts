import { useEffect, useState } from "react";
import { Profile } from "../../../../graphql/generated";
import { Quest } from "@/components/Search/types/search.types";
import {
  getPlayers,
  getQuestById,
  getQuestSample,
} from "../../../../graphql/subgraph/queries/getQuests";
import handleQuestData from "../../../../lib/helpers/handleQuestData";

const useQuests = (
  profile: Profile | undefined,
  lensConnected: Profile | undefined
) => {
  const [questsLoading, setQuestsLoading] = useState<boolean>(false);
  const [questSample, setQuestSample] = useState<Quest[]>([]);

  const getQuests = async () => {
    setQuestsLoading(true);
    try {
      const quests = await getQuestSample(parseInt(profile?.id, 16));
      const players = await getPlayers(parseInt(profile?.id, 16));
      let questData: Quest[] = [];
      if (players?.data?.players?.length > 1) {
        const playerPromises = players?.data?.players?.[0]?.questsJoined?.map(
          async (quest: string) => {
            const data = await getQuestById(Number(quest));
            questData?.push(data?.data?.questInstantiateds?.[0]);
          }
        );
        await Promise.all(playerPromises);
      }

      const sample = await handleQuestData(
        [...(quests?.data?.questInstantiateds || []), ...questData],
        lensConnected?.id,
        false,
        true
      );
      setQuestSample(sample);
    } catch (err: any) {
      console.error(err.message);
    }
    setQuestsLoading(false);
  };

  useEffect(() => {
    if (profile?.id && questSample?.length < 1) {
      getQuests();
    }
  }, [profile]);

  return {
    questsLoading,
    questSample,
  };
};

export default useQuests;
