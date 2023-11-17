import { FunctionComponent } from "react";
import Chromadin from "./Chromadin";
import CoinOp from "./CoinOp";
import { SwitchTypeProps } from "../types/item.types";
import { Creation } from "@/components/Tiles/types/tiles.types";

const SwitchType: FunctionComponent<SwitchTypeProps> = ({
  type,
  itemData,
  dispatch,
  router,
}) => {
  switch (type.toLowerCase()) {
    case "chromadin":
      return <Chromadin itemData={itemData.post as Creation} />;

    case "coinop":
      return <CoinOp itemData={itemData.post as Creation} />;

    case "pub":
      return <></>

    case "community":
      return <></>
  }
};

export default SwitchType;
