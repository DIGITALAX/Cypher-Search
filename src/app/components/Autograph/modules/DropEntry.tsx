"use client";

import { FunctionComponent, JSX } from "react";
import { Drop } from "../types/autograph.types";
import Suggested from "../../Common/modules/Suggested";
import DropMain from "./DropMain";

const DropEntry: FunctionComponent<{
  dict: any;
  drop: Drop | undefined | void;
}> = ({ dict, drop }): JSX.Element => {
  return (
    <div
      className="relative flex flex-col w-full h-full flex-grow pre:pt-0 pt-24"
      id="results"
    >
      <Suggested
        loader={false}
        notFound={!drop}
        dict={dict}
        data={drop!}
        component={<DropMain drop={drop!} dict={dict} />}
        includeSearch
      />
    </div>
  );
};

export default DropEntry;
