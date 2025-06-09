import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext, useState } from "react";
import { CoinOpProps } from "../types/tiles.types";
import { ModalContext } from "@/app/providers";
import InteractBar from "./InteractBar";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { INFURA_GATEWAY, printTypeToString } from "@/app/lib/constants";
import PrintType from "./PrintType";
import {
  ItemType,
  PrintType as PrintTagType,
} from "../../Common/types/common.types";
import { useRouter } from "next/navigation";
import HoverProfile from "./HoverProfile";
import PopUp from "./PopUp";

const CoinOp: FunctionComponent<CoinOpProps> = ({
  dict,
  publication,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const [profileHover, setProfileHover] = useState<boolean>(false);
  const [popup, setPopup] = useState<boolean>(false);
  const router = useRouter();
  return (
    <div
      className="relative w-full h-fit flex items-end justify-center flex flex-col rounded-sm border border-sol p-4 gap-4"
      id={publication?.postId}
    >
      {publication?.metadata?.tags?.includes("kinora") && (
        <div
          className="w-full h-full rounded-sm flex top-0 left-0 absolute bg-nave"
          id="game"
        ></div>
      )}
      <InteractBar publication={publication?.publication!} dict={dict} />
      <div
        className="relative flex w-full h-100 items-center justify-center border border-white bg-amo/30 cursor-pointer"
        onClick={() =>
          context?.setImageViewer({
            type: "png",
            image: `${INFURA_GATEWAY}/ipfs/${
              publication?.metadata?.images?.[0]?.split("ipfs://")?.[1]
            }`,
          })
        }
      >
        {publication?.metadata?.images?.[0] && (
          <Image
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/${
              publication?.metadata?.images?.[0]?.split("ipfs://")?.[1]
            }`}
            objectFit="cover"
            draggable={false}
            onError={(e) => handleImageError(e)}
          />
        )}
        <div className="absolute right-2 top-2 w-fit h-fit">
          {publication?.origin !== "3" ? (
            <>
              <PrintType
                dict={dict}
                printType={
                  printTypeToString[
                    Number(publication?.printType) as unknown as PrintTagType
                  ]
                }
              />
              {publication?.metadata?.onChromadin == "yes" && (
                <div
                  className="relative flex pt-3 flex-row gap-2 justify-start items-center w-fit h-full cursor-pointer active:scale-95"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    context?.setFiltersOpen({ value: false, allow: false });
                    router.push(
                      `/item/chromadin/${publication?.metadata?.title
                        ?.replaceAll(" ", "_")
                        ?.replaceAll("_(Print)", "")}`
                    );
                  }}
                >
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/QmcK1EJdp5HFuqPUds3WjgoSPmoomiWfiroRFa3bQUh5Xj`}
                      draggable={false}
                    />
                  </div>
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/QmYzbyMb3okS1RKhxogJZWT56kCFjVcXZWk1aJiA8Ch2xi`}
                      draggable={false}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="relative flex w-fit px-1.5 py-1 h-fit text-white font-aust gap-1 items-center justify-center">
              <div
                className="relative flex items-center justify-center w-7 h-7 hover:rotate-45"
                title={
                  context?.filterConstants?.styles?.filter(
                    (item) =>
                      item?.[0]?.toLowerCase() ==
                      publication?.metadata?.style?.toLowerCase()
                  )?.[0]?.[0]
                }
              >
                <Image
                  layout="fill"
                  draggable={false}
                  src={`${INFURA_GATEWAY}/ipfs/${
                    context?.filterConstants?.styles?.filter(
                      (item) =>
                        item?.[0]?.toLowerCase() ==
                        publication?.metadata?.style?.toLowerCase()
                    )?.[0]?.[1]
                  }`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="relative flex flex-row justify-between items-center w-full h-fit gap-1.5">
        <div className="relative flex flex-col items-start justify-center w-fit h-fit mr-auto gap-2">
          <div
            className={`relative items-start justify-center uppercase break-words font-bit text-nuba w-fit h-fit ${
              context?.layoutSwitch === 4 ? "text-lg" : "text-xl"
            }`}
          >
            {publication?.metadata?.title?.length > 20
              ? publication?.metadata?.title?.slice(0, 20) + "..."
              : publication?.metadata?.title}
          </div>
          <div
            className={`relative w-fit h-fit flex text-pez font-bit uppercase cursor-pointer ${
              context?.layoutSwitch === 4 ? "text-xs" : "text-sm"
            }`}
            onMouseEnter={() => setProfileHover(true)}
          >
            {publication?.profile?.username?.localName}
          </div>
          {profileHover && (
            <HoverProfile
              publication={publication?.profile!}
              setProfileHover={setProfileHover}
              dict={dict}
              parentId={publication?.postId}
              top={"auto"}
              bottom={"10px"}
              left={"2px"}
              right={"auto"}
            />
          )}
          <div className="relative flex flex-row justify-start items-center w-fit h-fit gap-2">
            <div
              className="relative w-10 h-10 flex items-center justify-center cursor-pointer active:scale-95"
              onClick={() => setPopup((prev) => !prev)}
            >
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/QmZ4v5pzdnCBeyKnS9VrjZiEAbUpAVy8ECArNcpxBt6Tw4`}
                draggable={false}
              />
            </div>
            {popup && (
              <PopUp
                dict={dict}
                cartItem={publication}
                level={undefined}
                bottom={"50px"}
                left={"-10px"}
                type={
                  publication?.origin == "3" ? ItemType.F3M : ItemType.CoinOp
                }
              />
            )}
            <div
              className={`relative items-center justify-center uppercase break-words font-bit text-nuba w-fit h-fit ${
                context?.layoutSwitch === 4 ? "text-xl" : "text-2xl"
              }`}
            >
              ${Number(publication?.price || 0)}
            </div>
          </div>
        </div>
        {publication?.metadata?.images?.slice(1)?.length > 0 && (
          <div className="relative ml-auto flex items-center justify-center w-20 h-20 rounded-sm border border-white bg-amo/30">
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/${
                publication?.metadata?.images?.[1]?.split("ipfs://")?.[1]
              }`}
              objectFit="cover"
              draggable={false}
              onError={(e) => handleImageError(e)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinOp;
