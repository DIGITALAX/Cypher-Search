import { FunctionComponent, JSX } from "react";

const Circuits: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  return (
    <div className="relative flex flex-col tablet:flex-row gap-4 items-start justify-center w-full h-full">
      <div className="relative flex w-full tablet:w-4/5 h-fit items-start justify-center rounded-sm">
        <div
          className="relative w-full h-full flex flex-col items-center justify-start gap-5 p-px"
          id="pfp"
        >
          <div
            className={`relative w-full bg-blurs flex bg-cover rounded-sm p-3 justify-center h-[35rem] overflow-y-scroll items-center`}
          >
            <div className="relative w-1/2 h-fit flex items-center justify-center font-ignite text-xl text-white text-center break-words">
              {dict?.cir}
            </div>
          </div>
        </div>
      </div>
      <div
        className="relative flex w-full tablet:w-80 h-full p-px flex-col items-start justify-start"
        id="mar"
      >
        <div className="relative w-full h-fit tablet:h-[35rem] flex flex-col bg-piloto gap-6 items-center justify-start p-3">
          <div className="font-bit text-white text-xs text-center flex w-4/5 h-fit relative">
            {dict?.share}
          </div>
          <div className="relative flex flex-col gap-2 w-full h-fit items-start justify-center font-bit text-white text-xs">
            <div className="relative w-fit h-fit flex items-center justify-center text-sol">
              {dict?.grant}
            </div>
            <div className="relative w-full h-10 border border-trip flex text-left justify-start items-center p-1 bg-piloto flex-row gap-2 rounded-md">
              <div className="relative w-6 h-6 items-center justify-center cursor-pointer active:scale-95 border border-trip rounded-md"></div>
              <div className="relative w-fit h-fit flex items-center justify-center">
                {dict?.pub}
              </div>
            </div>
            <div className="relative w-full h-10 border border-trip flex text-left justify-start items-center p-1 bg-piloto flex-row gap-2 rounded-md">
              <div className="relative w-6 h-6 items-center justify-center cursor-pointer active:scale-95 border border-trip rounded-md"></div>
              <div className="relative w-fit h-fit flex items-center justify-center">
                {dict?.com}
              </div>
            </div>
            <div className="relative w-full h-10 border border-trip flex text-left justify-start items-center p-1 bg-piloto flex-row gap-2 rounded-md">
              <div className="relative w-6 h-6 items-center justify-center cursor-pointer active:scale-95 border border-trip rounded-md"></div>
              <div className="relative w-fit h-fit flex items-center justify-center">
                {dict?.priv}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Circuits;
