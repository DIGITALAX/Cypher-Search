import { useEffect, useState } from "react";
import lensReport from "../../../../lib/helpers/api/reportPost";
import { useDispatch } from "react-redux";
import {
  PublicationReportingFraudSubreason,
  PublicationReportingIllegalSubreason,
  PublicationReportingReason,
  PublicationReportingSensitiveSubreason,
  PublicationReportingSpamSubreason,
  ReportingReasonInput,
} from "../../../../graphql/generated";
import { setIndexer } from "../../../../redux/reducers/indexerSlice";
import { setReportPub } from "../../../../redux/reducers/reportPubSlice";
import { Dispatch } from "redux";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";

const useReport = (dispatch: Dispatch, t: (key: string | number) => string) => {
  const [reportLoading, setReportLoading] = useState<boolean>(false);
  const [reason, setReason] = useState<{
    main: "Fraud" | "Illegal" | "Sensitive" | "Spam";
    subreason:
      | PublicationReportingFraudSubreason
      | PublicationReportingIllegalSubreason
      | PublicationReportingSensitiveSubreason
      | PublicationReportingSpamSubreason;
    additionalComments: string;
  }>({
    main: "Fraud",
    subreason: PublicationReportingFraudSubreason.Impersonation,
    additionalComments: "",
  });
  const handleReportPost = async (id: string) => {
    setReportLoading(true);
    try {
      let reportReason: ReportingReasonInput = {};

      switch (reason?.main) {
        case "Fraud":
          reportReason = {
            fraudReason: {
              reason: PublicationReportingReason.Fraud,
              subreason: reason.subreason as PublicationReportingFraudSubreason,
            },
          };
          break;

        case "Illegal":
          reportReason = {
            illegalReason: {
              reason: PublicationReportingReason.Illegal,
              subreason:
                reason.subreason as PublicationReportingIllegalSubreason,
            },
          };
          break;

        case "Sensitive":
          reportReason = {
            sensitiveReason: {
              reason: PublicationReportingReason.Sensitive,
              subreason:
                reason.subreason as PublicationReportingSensitiveSubreason,
            },
          };
          break;

        case "Spam":
          reportReason = {
            spamReason: {
              reason: PublicationReportingReason.Spam,
              subreason: reason.subreason as PublicationReportingSpamSubreason,
            },
          };
          break;
      }

      await lensReport(
        id,
        reportReason,
        reason.additionalComments,
        dispatch,
        t
      );

      dispatch(
        setIndexer({
          actionOpen: true,
          actionMessage: t("repS"),
        })
      );
      dispatch(setReportPub(false));

      setTimeout(() => {
        dispatch(
          setIndexer({
            actionOpen: false,
            actionMessage: undefined,
          })
        );
      }, 4000);
    } catch (err: any) {
      if (
        !err?.messages?.includes("Block at number") &&
        !err?.message?.includes("could not be found")
      ) {
        dispatch(setInteractError(true));
        console.error(err.message);
      } else {
        dispatch(
          setIndexer({
            actionOpen: true,
            actionMessage: t("suc"),
          })
        );

        setTimeout(() => {
          dispatch(
            setIndexer({
              actionOpen: false,
              actionMessage: undefined,
            })
          );
        }, 3000);
      }
    }
    setReportLoading(false);
  };

  useEffect(() => {
    setReason({
      ...reason,
      subreason:
        reason.main === "Fraud"
          ? Object.values(PublicationReportingFraudSubreason)[0]
          : reason.main === "Illegal"
          ? Object.values(PublicationReportingIllegalSubreason)[0]
          : reason.main === "Sensitive"
          ? Object.values(PublicationReportingSensitiveSubreason)[0]
          : Object.values(PublicationReportingSpamSubreason)[0],
    });
  }, [reason.main]);

  return {
    handleReportPost,
    reason,
    setReason,
    reportLoading,
  };
};

export default useReport;
