import { FunctionComponent } from "react";
import { BarProps } from "../types/common.types";

const Bar: FunctionComponent<BarProps> = ({ title }): JSX.Element => {
  return (
    <div
      className="relative w-full h-8 flex flex-row items-center justify-between p-1.5 font-dog gap-2"
      id="bar"
    >
      <div className="relative p-1 bg-virg/70 text-black items-center justify-start flex text-xxs w-fit h-fit">
        {title}
      </div>
      <div className="relative w-fit h-fit flex flex-row gap-1 items-center justify-end">
        <div className="relative w-5 h-5 rounded-sm bg-naran border border-black text-center items-center justify-center flex text-xxs">
          x
        </div>
        <div className="relative w-5 h-5 rounded-sm bg-amar border border-black text-center items-center justify-center flex text-xxs">
          -
        </div>
        <div className="relative w-5 h-5 rounded-sm bg-geren border border-black p-1 items-center justify-center flex">
          <div></div>
          <div className="relative border border-black items-center justify-center flex bg-white w-full h-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Bar;
