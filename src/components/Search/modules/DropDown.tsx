import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { DropDownProps } from "../types/search.types";

const DropDown: FunctionComponent<DropDownProps> = ({
  title,
  hashtag,
  value,
  onChange,
  openDropDown,
  setOpenDropDown,
  dropDownValues,
  reverse,
  onDropDownChoose,
}): JSX.Element => {
  return (
    <div className="relative flex items-center justify-center flex-col w-full h-fit pb-1.5">
      <div
        className="relative w-full h-12 p-px rounded-sm flex flex-row items-center justify-center font-bit text-sol text-center"
        id="borderSearch"
      >
        <div className="relative bg-offBlack flex flex-row w-full h-full justify-start items-center rounded-sm p-2 gap-2">
          <div
            className={`relative flex items-center justify-center cursor-pointer w-4 h-3 ${
              reverse && "order-2"
            } ${openDropDown && (reverse ? "rotate-90" : "-rotate-90")}`}
            onClick={() => setOpenDropDown()}
          >
            {hashtag ? (
              <div className="relative w-fit h-fit text-xl">#</div>
            ) : (
              <Image
                layout="fill"
                draggable={false}
                src={`${INFURA_GATEWAY}/ipfs/QmRKmMYJj7KAwf4BDGwrd51tKWoS8djnLGWT5XNdrJMztk`}
              />
            )}
          </div>
          <input
            className={`relative w-full h-full p-1.5 bg-offBlack flex items-center justify-center ${
              reverse && "order-1"
            }`}
            id="searchBar"
            placeholder={title}
            value={value}
            onChange={(e) => onChange(e)}
          />
        </div>
      </div>
      {openDropDown && (
        <div
          className="absolute flex items-start justify-center w-full h-32 overflow-y-scroll z-10 bg-offBlack top-12 p-px border border-azul rounded-sm"
          id="dropDown"
        >
          <div className="relative flex flex-col items-center justify-start w-full h-fit gap-px">
            {dropDownValues?.map((value: string, index: number) => {
              return (
                <div
                  key={index}
                  className="relative w-full h-8 py-px bg-offBlack items-center justify-center flex text-sol text-sm uppercase font-bit hover:bg-skyBlue hover:text-black cursor-pointer"
                  onClick={() => onDropDownChoose(value)}
                >
                  {value.replaceAll("_", " ")}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDown;
