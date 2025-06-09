import { Account } from "@lens-protocol/client";
import { useEffect, useState } from "react";
import { Quest } from "../../Common/types/common.types";

const useQuests = (profile: Account | undefined) => {
  const [questsLoading, setQuestsLoading] = useState<boolean>(false);
  const [questSample, setQuestSample] = useState<Quest[]>([]);

  const getQuests = async () => {
    setQuestsLoading(true);
    try {
      //   const quests = await getQuestSample(parseInt(profile?.id, 16));
      //   const players = await getPlayers(parseInt(profile?.id, 16));
      //   let questData: Quest[] = [];
      //   if (players?.data?.players?.length > 1) {
      //     const playerPromises = players?.data?.players?.[0]?.questsJoined?.map(
      //       async (quest: string) => {
      //         const data = await getQuestById(Number(quest));
      //         questData?.push(data?.data?.questInstantiateds?.[0]);
      //       }
      //     );
      //     await Promise.all(playerPromises);
      //   }
      //   const sample = await handleQuestData(
      //     [...(quests?.data?.questInstantiateds || []), ...questData],
      //     lensConnected?.id,
      //     false,
      //     true
      //   );
      //   setQuestSample(sample);
    } catch (err: any) {
      console.error(err.message);
    }
    setQuestsLoading(false);
  };

  useEffect(() => {
    if (profile?.address && questSample?.length < 1) {
      getQuests();
    }
  }, [profile]);

  return {
    questsLoading,
    questSample,
  };
};

export default useQuests;
