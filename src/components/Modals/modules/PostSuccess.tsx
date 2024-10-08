import { FunctionComponent } from "react";
import { PostSuccessProps } from "../types/modals.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { ImCross } from "react-icons/im";
import { setPostSuccess } from "../../../../redux/reducers/postSuccessSlice";

const PostSuccess: FunctionComponent<PostSuccessProps> = ({
  dispatch,
  type,
  router,
  pubId,
  handle,
  successType,
  t,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] sm:w-[70vw] tablet:w-[40vw] h-fit max-h-[90vh] overflow-y-scroll place-self-center bg-offBlack border border-white overflow-y-scroll">
        <div className="relative w-full h-full flex flex-col gap-5 p-2">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="#FBDB86"
              size={10}
              onClick={() =>
                dispatch(
                  setPostSuccess({
                    actionValue: undefined,
                    actionPubId: undefined,
                    actionType: undefined,
                  })
                )
              }
            />
          </div>
          <div className="relative w-full h-fit items-center justify-center flex flex-col gap-3 pb-4">
            <div className="relative w-2/3 h-fit items-center justify-center text-center break-words font-bit text-sol text-sm">
              {t("yo")} {type === "collection" ? t("coP") : t("coD")} {t("is")}{" "}
              {successType === "created"
                ? t("live")
                : successType === "deleted"
                ? t("del")
                : t("up")}
              ! {t("mom")}
            </div>
            <div
              className="relative w-full sm:w-2/3 h-full min-h-[25vh] lex items-center justify-center rounded-sm p-px cursor-pointer active:scale-95"
              onClick={() => {
                dispatch(
                  setPostSuccess({
                    actionValue: undefined,
                    actionPubId: undefined,
                    actionType: undefined,
                  })
                );
                router.push(
                  type === "collection"
                    ? `/item/chromadin/${pubId?.replaceAll(" ", "_")}`
                    : `/autograph/${handle}/drop/${pubId?.replaceAll(" ", "_")}`
                );
              }}
              id="success"
            >
              <Image
                className="rounded-sm"
                layout="fill"
                objectFit="cover"
                src={`${INFURA_GATEWAY}/ipfs/QmdnSk6P3DobsEbAjaTGgGkDD3HkwYrtFWAkts6RjTtZw9`}
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSuccess;
