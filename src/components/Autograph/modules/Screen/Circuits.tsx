import { FunctionComponent } from "react";

const Circuits: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative flex flex-row gap-4 items-start justify-center w-full h-full">
      <div className="relative flex w-4/5 h-fit items-start justify-center rounded-sm">
        <div
          className="relative w-full h-full flex flex-col items-center justify-start gap-5 p-px"
          id="pfp"
        >
          <div
            className={`relative w-full h-full bg-blurs flex bg-cover rounded-sm p-3 justify-center min-h-[35rem] max-h-[35rem] overflow-y-scroll items-center`}
          >
            <div className="relative w-1/2 h-fit flex items-center justify-center font-ignite text-xl text-white text-center break-words">
              Circuits Coming Soon.
            </div>
          </div>
        </div>
      </div>
      <div
        className="relative flex w-80 h-full p-px flex-col items-start justify-start"
        id="mar"
      >
        <div className="relative w-full min-h-[35rem] max-h-[35rem] h-full flex flex-col bg-piloto gap-6 items-center justify-start p-3">
          <div className="font-bit text-white text-xs text-center flex w-4/5 h-fit relative">
            Share what you’ve collected or created. Keep each item open, super
            stealth mode, or find that cryptic balance in the force. The choice
            is yours — as long as the keys are too.
          </div>
          <div className="relative flex flex-col gap-2 w-full h-fit items-start justify-center font-bit text-white text-xs">
            <div className="relative w-fit h-fit flex items-center justify-center text-sol">
              Access Granted:
            </div>
            <div className="relative w-full h-10 border border-trip flex text-left justify-start items-center p-1 bg-piloto flex-row gap-2 rounded-md">
              <div className="relative w-6 h-6 items-center justify-center cursor-pointer active:scale-95 border border-trip rounded-md"></div>
              <div className="relative w-fit h-fit flex items-center justify-center">
                Public
              </div>
            </div>
            <div className="relative w-full h-10 border border-trip flex text-left justify-start items-center p-1 bg-piloto flex-row gap-2 rounded-md">
              <div className="relative w-6 h-6 items-center justify-center cursor-pointer active:scale-95 border border-trip rounded-md"></div>
              <div className="relative w-fit h-fit flex items-center justify-center">
                Community
              </div>
            </div>
            <div className="relative w-full h-10 border border-trip flex text-left justify-start items-center p-1 bg-piloto flex-row gap-2 rounded-md">
              <div className="relative w-6 h-6 items-center justify-center cursor-pointer active:scale-95 border border-trip rounded-md"></div>
              <div className="relative w-fit h-fit flex items-center justify-center">
                Private
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Circuits;
