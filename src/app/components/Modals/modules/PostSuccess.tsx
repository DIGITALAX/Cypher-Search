import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import { ImCross } from "react-icons/im";
import { ModalContext } from "@/app/providers";
import { useRouter } from "next/navigation";
import { INFURA_GATEWAY } from "@/app/lib/constants";

const PostSuccess: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const router = useRouter();
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] sm:w-[70vw] tablet:w-[40vw] h-fit max-h-[90vh] overflow-y-scroll place-self-center bg-offBlack border border-white overflow-y-scroll">
        <div className="relative w-full h-full flex flex-col gap-5 p-2">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="#FBDB86"
              size={10}
              onClick={() => context?.setPostSuccess(undefined)}
            />
          </div>
          <div className="relative w-full h-fit items-center justify-center flex flex-col gap-3 pb-4">
            <div className="relative w-2/3 h-fit items-center justify-center text-center break-words font-bit text-sol text-sm">
              {dict?.yo}{" "}
              {context?.postSuccess?.value === "collection"
                ? dict?.coP
                : dict?.coD}{" "}
              {dict?.is}{" "}
              {context?.postSuccess?.type === "created"
                ? dict?.live
                : context?.postSuccess?.type === "deleted"
                ? dict?.del
                : dict?.up}
              ! {dict?.mom}
            </div>
            <div
              className="relative w-full sm:w-2/3 h-full min-h-[25vh] lex items-center justify-center rounded-sm p-px cursor-pointer active:scale-95"
              onClick={() => {
                context?.setPostSuccess(undefined);
                context?.setFiltersOpen({ value: false, allow: false });
                router.push(
                  context?.postSuccess?.value === "collection"
                    ? `/item/chromadin/${context?.postSuccess?.id?.replaceAll(
                        " ",
                        "_"
                      )}`
                    : `/autograph/${
                        context?.lensConectado?.profile?.username?.localName
                      }/drop/${context?.postSuccess?.id?.replaceAll(" ", "_")}`
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
