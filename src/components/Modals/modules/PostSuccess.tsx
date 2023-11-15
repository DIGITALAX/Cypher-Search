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
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[30vw] h-[40vh] place-self-center bg-offBlack rounded-lg border border-white rounded-sm">
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
          <div className="relative w-full h-fit items-center justify-center flex flex-col gap-3">
            <div className="relative w-2/3 h-fit items-center justify-center text-center break-words font-bit text-sol text-sm">
              Your {type === "collection" ? "Collection" : "Drop"} is{" "}
              {successType === "created"
                ? "Live"
                : successType === "deleted"
                ? "Deleted"
                : "Updated"}
              !
            </div>
            <div
              className="relative w-2/3 h-52 flex items-center justify-center rounded-sm p-px cursor-pointer active:scale-95"
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
                    ? `/autograph/item/${pubId}`
                    : `/autograph/${handle}/drop/${pubId}`
                );
              }}
              id="success"
            >
              <div className="relative w-full h-full rounded-sm flex items-center justify-center">
                <Image
                  className="rounded-sm"
                  layout="fill"
                  objectFit="cover"
                  src={`${INFURA_GATEWAY}/ipfs/QmYyXPbudbytpn8jfd4qXJpzKhtgnCKnLj7FLdYYQT1Mur`}
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSuccess;
