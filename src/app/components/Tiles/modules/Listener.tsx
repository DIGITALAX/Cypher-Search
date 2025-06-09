import { INFURA_GATEWAY, printTypeToString } from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext, useState } from "react";
import HoverProfile from "./HoverProfile";
import { ListenerProps } from "../types/tiles.types";
import InteractBar from "./InteractBar";
import PrintType from "./PrintType";
import {
  ItemType,
  PrintType as PrintTagType,
} from "../../Common/types/common.types";
import PopUp from "./PopUp";

const Listener: FunctionComponent<ListenerProps> = ({
  dict,
  publication,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const [profileHover, setProfileHover] = useState<boolean>(false);
  const [popup, setPopup] = useState<boolean>(false);

  return (
    <div
      className="relative w-full h-fit flex items-end justify-center flex rounded-sm border border-sol"
      id={publication?.postId}
    >
      <div
        id="explainerBg"
        className="relative w-full h-full flex items-end justify-center flex-col gap-4 p-4"
      >
        <div className="absolute w-full h-full mix-blend-hard-light bg-listener opacity-60 bg-center bg-cover right-0 top-0"></div>
        <InteractBar dict={dict} publication={publication?.publication!} />
        <div
          className="relative flex w-full h-100 items-center justify-center border border-white bg-amo/30 cursor-pointer"
          onClick={() =>
            context?.setImageViewer({
              type: publication?.metadata?.mediaTypes?.[0],
              image: `${INFURA_GATEWAY}/ipfs/${
                publication?.metadata?.images?.[0]?.split("ipfs://")?.[1]
              }`,
            })
          }
        >
          {publication?.metadata?.images && (
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
            <PrintType
              dict={dict}
              printType={
                printTypeToString[
                  Number(publication?.printType) as unknown as PrintTagType
                ]
              }
            />
          </div>
        </div>
        <div className="relative flex flex-row justify-between items-center w-full h-fit gap-1.5">
          <div className="relative flex flex-col items-start justify-center w-fit h-fit mr-auto gap-2">
            <div
              className={`relative items-start justify-center uppercase break-words font-ignite w-fit h-fit ${
                context?.layoutSwitch === 4 ? "text-lg" : "text-xl"
              }`}
              id="noCode"
            >
              {publication?.metadata?.title?.length > 20
                ? publication?.metadata?.title?.slice(0, 20) + "..."
                : publication?.metadata?.title}
            </div>
            <div
              className={`relative w-fit h-fit flex text-white font-vcr uppercase ${
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
                  type={ItemType.Listener}
                />
              )}
              <div
                className={`relative items-center justify-center uppercase break-words font-vcr text-ballena w-fit h-fit ${
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
    </div>
  );
};

export default Listener;
