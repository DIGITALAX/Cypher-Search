import { Publication } from "@/components/Tiles/types/tiles.types";
import { useEffect, useState } from "react";

const useSuggested = () => {
  const [suggestedLoading, setSuggestedLoading] = useState<boolean>(false);
  const [suggestedFeed, setSuggestedFeed] = useState<Publication[]>([]);

  const getSuggestedItems = async () => {
    setSuggestedLoading(true)
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setSuggestedLoading(false)
  };

  const getMoreSuggested = async () => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (suggestedFeed?.length < 1) {
      getSuggestedItems();
    }
  }, []);

  return {
    getMoreSuggested,
    suggestedLoading,
    suggestedFeed,
  };
};

export default useSuggested;
