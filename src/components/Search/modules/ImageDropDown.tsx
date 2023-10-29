import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { ImageDropDownProps } from "../types/search.types";

const ImageDropDown: FunctionComponent<ImageDropDownProps> = ({
  title,
  value,
  onChange,
  openDropDown,
  setOpenDropDown,
  dropDownValues,
  reverse,
  onDropDownChoose,
  cover,
  rounded,
}): JSX.Element => {
  return (
    <div className="relative flex items-center justify-center flex-col w-full h-fit">
      <div
        className="relative w-full h-12 p-px rounded-sm flex flex-row items-center justify-center font-bit text-sol text-center"
        id="borderSearch"
      >
        <div className="relative bg-offBlack flex flex-row w-full h-full justify-start items-center rounded-sm p-2 gap-2">
          <div
            className={`relative flex items-center justify-center cursor-pointer w-4 h-3 ${
              reverse && "order-2"
            } ${openDropDown && (reverse ? "rotate-90" : "")}`}
            onClick={() => setOpenDropDown()}
          >
            <Image
              layout="fill"
              draggable={false}
              src={`${INFURA_GATEWAY}/ipfs/QmRKmMYJj7KAwf4BDGwrd51tKWoS8djnLGWT5XNdrJMztk`}
            />
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
          className="absolute flex items-center justify-start w-full h-32 overflow-y-scroll z-10 bg-offBlack top-12 py-px px-1 border border-azul rounded-sm"
          id="dropDown"
        >
          <div className="relative flex flex-row items-center justify-center w-fit h-fit gap-3">
            {dropDownValues?.map((value: string[], index: number) => {
              return (
                <div
                  key={index}
                  className={`relative w-20 h-20 py-px items-center justify-center flex hover:opacity-70 cursor-pointer  ${
                    rounded && "rounded-full border border-offWhite"
                  }`}
                  onClick={() => onDropDownChoose(value[0])}
                >
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/${value[1]}`}
                    title={value[0]}
                    objectFit={cover ? "cover" : "contain"}
                    className={`${rounded && "rounded-full"}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageDropDown;
