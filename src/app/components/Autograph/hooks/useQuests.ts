import { Account } from "@lens-protocol/client";
import { useContext, useEffect, useState } from "react";
import { Quest } from "../../Common/types/common.types";
import {
  getPlayers,
  getQuestById,
  getQuestSample,
} from "../../../../../graphql/queries/getQuests";
import handleQuestData from "@/app/lib/helpers/handleQuestData";
import { ModalContext } from "@/app/providers";

const useQuests = (profile: Account | undefined) => {
  const context = useContext(ModalContext);
  const [questsLoading, setQuestsLoading] = useState<boolean>(false);
  const [questSample, setQuestSample] = useState<Quest[]>([]);

  const getQuests = async () => {
    setQuestsLoading(true);
    try {
      const quests = await getQuestSample(profile?.address);
      const players = await getPlayers(profile?.address);
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
        context?.lensConectado!,
        context?.clienteLens!,
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
