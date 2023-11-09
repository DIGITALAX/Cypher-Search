import { FunctionComponent } from "react";
import { ReportPubProps } from "../types/modals.types";
import { setReportPub } from "../../../../redux/reducers/reportPubSlice";
import { ImCross } from "react-icons/im";
import { AiOutlineLoading } from "react-icons/ai";
import {
  PublicationReportingFraudSubreason,
  PublicationReportingIllegalSubreason,
  PublicationReportingSensitiveSubreason,
  PublicationReportingSpamSubreason,
} from "../../../../graphql/generated";

const ReportPub: FunctionComponent<ReportPubProps> = ({
  dispatch,
  id,
  handleReportPost,
  reason,
  setReason,
  reportLoading,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-full md:w-[40vw] h-fit min-h-[40vh] place-self-center bg-offBlack rounded-lg border border-white rounded-sm">
        <div className="relative w-full h-full flex flex-col gap-5 p-2">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="#FBDB86"
              size={10}
              onClick={() =>
                dispatch(
                  setReportPub({
                    actionOpen: false,
                    actionFor: undefined,
                  })
                )
              }
            />
          </div>
          <div className="relative w-full h-fit items-center justify-center flex flex-col gap-6 font-bit">
            <div className="relative w-2/3 h-fit items-center justify-center text-center break-words  text-sol text-sm">
              Report Publication {id}
            </div>
            <div className="relative flex flex-col gap-2 items-center justify-center w-fit h-fit">
              <div className="relative w-full h-fit flex flex-col items-center justify-center text-white text-center">
                What's the core reason for reporting?
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center gap-2 flex flex-wrap">
                {["Fraud", "Illegal", "Sensitive", "Spam"].map(
                  (item: string, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`relative w-32 h-10 font-bit  flex items-center justify-center border border-white text-xs rounded-sm ${
                          !reportLoading && "cursor-pointer active:scale-95"
                        } ${
                          reason.main === item
                            ? "bg-ballena text-black"
                            : "text-white bg-fuego"
                        }`}
                        onClick={() =>
                          !reportLoading &&
                          setReason({
                            ...reason,
                            main: item as any,
                          })
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
                            item
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
            <div className="relative flex flex-col gap-2 items-center justify-center w-fit h-fit">
              <div className="relative w-full h-fit flex flex-col items-center justify-center text-white text-center">
                And a little more specific...
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center gap-2 flex flex-wrap">
                {(reason.main === "Fraud"
                  ? Object.values(PublicationReportingFraudSubreason)
                  : reason.main === "Illegal"
                  ? Object.values(PublicationReportingIllegalSubreason)
                  : reason.main === "Sensitive"
                  ? Object.values(PublicationReportingSensitiveSubreason)
                  : Object.values(PublicationReportingSpamSubreason)
                ).map((item: string, index: number) => {
                  return (
                    <div
                      key={index}
                      className={`relative w-32 h-10 font-bit  flex items-center justify-center border border-white text-xs rounded-sm px-1 ${
                        !reportLoading && "cursor-pointer active:scale-95"
                      } ${
                        reason.subreason === item
                          ? "bg-ballena text-black"
                          : "text-white bg-fuego"
                      }`}
                      onClick={() =>
                        !reportLoading &&
                        setReason({
                          ...reason,
                          subreason: item as any,
                        })
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
                })}
              </div>
            </div>
            <div className="relative flex flex-col gap-2 items-center justify-center w-2/3 h-fit">
              <div className="relative w-full h-fit flex flex-col items-center justify-center text-white text-center">
                Anything else you can share?
              </div>
              <div className="relative w-full h-fit flex items-center justify-center gap-2 flex flex-wrap border border-white">
                <textarea
                  style={{ resize: "none" }}
                  onChange={(e) =>
                    setReason({
                      ...reason,
                      additionalComments: e.target.value,
                    })
                  }
                  className="relative flex w-full h-full bg-offBlack p-2 font-bit text-white text-sm"
                  value={reason.additionalComments}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="relative w-full h-fit flex justify-center items-center py-2">
            <div
              className={`relative w-32 h-10 font-bit text-white flex items-center justify-center bg-fuego border border-white text-xs rounded-sm ${
                !reason.main || !reason.subreason || reportLoading
                  ? "opacity-70"
                  : "cursor-pointer active:scale-95"
              }`}
              onClick={() =>
                !reportLoading &&
                reason.main &&
                reason.subreason &&
                handleReportPost(id)
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
                  "Submit Report"
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
