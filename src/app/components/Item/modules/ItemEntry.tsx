"use client";

import { FunctionComponent, JSX } from "react";
import Suggested from "../../Common/modules/Suggested";
import SwitchType from "./SwitchType";
import useData from "../hooks/useData";

const ItemEntry: FunctionComponent<{
  dict: any;
  type: string;
  id: string;
}> = ({ dict, type, id }): JSX.Element => {
  const { globalLoading, itemLoading, itemData, relatedData } = useData(
    type,
    id
  );

  return (
    <div
      className="relative flex flex-col w-full h-full flex-grow pre:pt-0 pt-24"
      id="results"
    >
      <Suggested
        data={itemData}
        dict={dict}
        loader={globalLoading || itemLoading || type == undefined}
        notFound={!itemData?.post}
        component={
          <SwitchType
            itemData={itemData!}
            dict={dict}
            type={type}
            relatedData={relatedData}
          />
        }
        includeSearch
      />
    </div>
  );
};

export default ItemEntry;
