import { ModalContext } from "@/app/providers";
import { PostReportReason } from "@lens-protocol/client";
import { reportPost } from "@lens-protocol/client/actions";
import { useContext, useState } from "react";
import { Indexar } from "../../Search/types/search.types";

const useReport = () => {
  const context = useContext(ModalContext);
  const [reportLoading, setReportLoading] = useState<boolean>(false);
  const [reason, setReason] = useState<{
    reason: PostReportReason;
    additionalComment: string;
  }>({
    reason: PostReportReason?.DirectThreat,
    additionalComment: "",
  });

  const handleReportPost = async () => {
    if (!context?.lensConectado?.sessionClient || !context?.reactBox?.id)
      return;
    setReportLoading(true);
    context?.setIndexar(Indexar.Indexando);

    try {
      const res = await reportPost(context?.lensConectado?.sessionClient!, {
        ...reason,
        post: context?.reactBox?.id,
      });

      if (!res?.isOk()) {
        context?.setModalOpen((res as any).error);
        setReportLoading(false);
      } else if ((res.value as any)?.reason?.includes("Signless")) {
        context?.setSignless?.(true);
      } else {
        context?.setIndexar(Indexar.Success);
        context?.setReportPub(undefined);
      }
    } catch (err: any) {
      console.error(err?.message);
    }
    setTimeout(() => {
      context?.setIndexar(Indexar.Inactive);
    }, 3000);
    setReportLoading(false);
  };

  return {
    handleReportPost,
    reason,
    setReason,
    reportLoading,
  };
};

export default useReport;
