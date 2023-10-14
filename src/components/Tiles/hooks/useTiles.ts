import { useState } from "react";

const useTiles = () => {
  const [popUpOpen, setPopUpOpen] = useState<boolean[]>([]);
  const [apparel, setApparel] = useState<boolean[]>([]);

  return {
    popUpOpen,
    setPopUpOpen,
    apparel,
    setApparel,
  };
};

export default useTiles;
