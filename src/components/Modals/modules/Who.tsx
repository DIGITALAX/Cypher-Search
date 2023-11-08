import { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { AiOutlineLoading } from "react-icons/ai";
import { setReactBox } from "../../../../redux/reducers/reactBoxSlice";
import { WhoProps } from "../types/modals.types";
import WhoSwitch from "./WhoSwitch";

const Who: FunctionComponent<WhoProps> = ({
  dataLoading,
  reactors,
  quoters,
  hasMore,
  hasMoreQuote,
  showMore,
  mirrorQuote,
  setMirrorQuote,
  type,
  router,
  dispatch,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-full sm:w-[60vw] min-w-fit px-2 md:w-[40vw] lg:w-[25vw] h-fit col-start-1 place-self-center bg-offBlack border border-white rounded-lg">
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full h-full flex flex-col items-center justify-center gap-4 pb-8">
              <div className="relative w-fit h-fit items-end justify-end ml-auto pr-3 pt-3 cursor-pointer flex">
                <ImCross
                  color="white"
                  size={10}
                  onClick={() =>
                    dispatch(
                      setReactBox({
                        actionOpen: false,
                      })
                    )
                  }
                />
              </div>
              {type === "Mirrors" &&
                (reactors?.length > 0 || quoters?.length > 1) && (
                  <div className="relative w-fit h-fit flex items-center justify-center rounded-md font-bit text-white border border-white text-xs md:text-sm">
                    <div
                      className="relative w-16 md:w-20 h-fit flex items-center justify-center top-px px-2 py-1 hover:opacity-70 cursor-pointer"
                      onClick={() => setMirrorQuote(true)}
                    >
                      Quotes
                    </div>
                    <div className="w-px h-full bg-white"></div>
                    <div
                      className="relative w-20 h-fit flex items-center justify-center top-px px-2 py-1 hover:opacity-70 cursor-pointer"
                      onClick={() => setMirrorQuote(false)}
                    >
                      Mirrors
                    </div>
                  </div>
                )}
              <WhoSwitch
                router={router}
                type={type}
                reactors={reactors}
                quoters={quoters}
                hasMore={hasMore}
                hasMoreQuote={hasMoreQuote}
                showMore={showMore}
                mirrorQuote={mirrorQuote}
                dispatch={dispatch}
              />
              {!dataLoading ? (
                <></>
              ) : (
                <div className="relative w-[40vw] md:w-full h-60 grid grid-flow-col auto-cols-auto">
                  <div className="relative w-fit h-fit col-start-1 place-self-center animate-spin">
                    <AiOutlineLoading color="white" size={20} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Who;
