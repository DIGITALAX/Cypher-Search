import { FunctionComponent, JSX, useContext } from "react";
import { ImCross } from "react-icons/im";
import { AiOutlineLoading } from "react-icons/ai";
import { ModalContext } from "@/app/providers";
import { PostReportReason } from "@lens-protocol/client";
import useReport from "../hooks/useReport";

const ReportPub: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const context = useContext(ModalContext);
  const { handleReportPost, reason, setReason, reportLoading } = useReport();
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] sm:w-[70vw] tablet:w-[40vw] h-fit max-h-[90vh] min-h-[40vh] place-self-center bg-offBlack border border-white overflow-y-scroll">
        <div className="relative w-full h-full flex flex-col gap-5 p-2">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="#FBDB86"
              size={10}
              onClick={() => context?.setReportPub(undefined)}
            />
          </div>
          <div className="relative w-full h-fit items-center justify-center flex flex-col gap-6 font-bit">
            <div className="relative w-2/3 h-fit items-center justify-center text-center break-words  text-sol text-sm">
              {dict?.rep} {context?.reportPub}
            </div>
            <div className="relative flex flex-col gap-2 items-center justify-center w-fit h-fit">
              <div className="relative w-full h-fit flex flex-col items-center justify-center text-white text-center">
                {dict?.rea}
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center gap-2 flex flex-wrap">
                {Object.values(PostReportReason).map(
                  (item: string, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`relative w-32 h-10 font-bit  flex items-center justify-center border border-white text-xs rounded-sm ${
                          !reportLoading && "cursor-pointer active:scale-95"
                        } ${
                          reason.reason === item
                            ? "bg-ballena text-black"
                            : "text-white bg-fuego"
                        }`}
                        onClick={() =>
                          !reportLoading &&
                          setReason((prev) => ({
                            ...prev,
                            reason: item as any,
                          }))
                        }
                      >
                        <div
                          className={`${
                            reportLoading ? "animate-spin" : "top-px"
                          } relative w-fit h-fit flex items-center justify-center text-center`}
                        >
                          {reportLoading ? (
                            <AiOutlineLoading size={15} color="white" />
                          ) : (
                            item?.replaceAll("_", " ")
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            <div className="relative flex flex-col gap-2 items-center justify-center w-2/3 h-fit">
              <div className="relative w-full h-fit flex flex-col items-center justify-center text-white text-center">
                {dict?.other}
              </div>
              <div className="relative w-full h-fit flex items-center justify-center gap-2 flex flex-wrap border border-white">
                <textarea
                  style={{ resize: "none" }}
                  onChange={(e) =>
                    setReason({
                      ...reason,
                      additionalComment: e.target.value,
                    })
                  }
                  className="relative flex w-full h-full bg-offBlack p-2 font-bit text-white text-sm"
                  value={reason.additionalComment}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="relative w-full h-fit flex justify-center items-center py-2">
            <div
              className={`relative w-32 h-10 font-bit text-white flex items-center justify-center bg-fuego border border-white text-xs rounded-sm ${
                !reason.reason || reportLoading
                  ? "opacity-70"
                  : "cursor-pointer active:scale-95"
              }`}
              onClick={() =>
                !reportLoading && reason.reason && handleReportPost()
              }
            >
              <div
                className={`${
                  reportLoading ? "animate-spin" : "top-px"
                } relative w-fit h-fit flex items-center justify-center text-center`}
              >
                {reportLoading ? (
                  <AiOutlineLoading size={15} color="white" />
                ) : (
                  dict?.sub
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPub;
