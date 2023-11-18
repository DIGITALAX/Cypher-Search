import { FunctionComponent } from "react";
import Chromadin from "./Chromadin";
import { SwitchTypeProps } from "../types/item.types";
import { Creation } from "@/components/Tiles/types/tiles.types";
import Publication from "./Publication";
import Community from "./Community";
import Microbrand from "./Microbrand";

const SwitchType: FunctionComponent<SwitchTypeProps> = ({
  type,
  itemData,
  dispatch,
  router,
  filterConstants,
  cartItems,
  setPurchaseDetails,
  purchaseDetails,
  oracleData,
  relatedCollections,
  handleInstantPurchase,
  instantLoading,
  approveSpend,
  isApprovedSpend,
  lensConnected,
}) => {
  switch (type.toLowerCase()) {
    case "chromadin":
    case "coinop":
    case "listener":
      return (
        <Chromadin
          oracleData={oracleData}
          filterConstants={filterConstants}
          type={type}
          itemData={itemData?.post as Creation}
          dispatch={dispatch}
          router={router}
          cartItems={cartItems}
          purchaseDetails={purchaseDetails}
          setPurchaseDetails={setPurchaseDetails}
          handleInstantPurchase={handleInstantPurchase}
          instantLoading={instantLoading}
          approveSpend={approveSpend}
          isApprovedSpend={isApprovedSpend}
          lensConnected={lensConnected}
        />
      );

    case "pub":
      return <Publication />;

    case "community":
      return <Community />;

    case "microbrand":
      return <Microbrand />;
  }
};

export default SwitchType;
