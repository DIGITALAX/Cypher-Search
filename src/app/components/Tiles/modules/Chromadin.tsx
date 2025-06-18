import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext, useState } from "react";
import { ChromadinProps } from "../types/tiles.types";
import InteractBar from "./InteractBar";
import { ModalContext } from "@/app/providers";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import MediaSwitch from "../../Common/modules/MediaSwitch";
import HoverProfile from "./HoverProfile";
import PopUp from "./PopUp";
import { ItemType } from "../../Common/types/common.types";

const Chromadin: FunctionComponent<ChromadinProps> = ({
  dict,
  publication,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const [profileHover, setProfileHover] = useState<boolean>(false);
  const [popup, setPopup] = useState<boolean>(false);

  return (
    <div
      className="relative w-full h-fit flex items-end justify-center flex flex-col rounded-sm border border-sol p-4 gap-4"
      id={publication?.postId}
    >
      <InteractBar dict={dict} publication={publication?.post!} />
      <div className="relative flex flex-col items-center justify-start w-full h-fit gap-5">
        <div className="relative flex flex-row w-full justifty-between items-start h-fit gap-4">
          <div
            className="w-full h-72 rounded-sm bg-amo/30 border border-white cursor-pointer relative"
            onClick={() =>
              context?.setImageViewer({
                type: publication?.metadata?.mediaTypes?.[0],
                image: `${INFURA_GATEWAY}/ipfs/${
                  publication?.metadata?.mediaTypes?.[0] == "video"
                    ? publication?.metadata?.video?.split("ipfs://")?.[1]
                    : publication?.metadata?.mediaTypes?.[0] == "audio"
                    ? publication?.metadata?.mediaCover?.split("ipfs://")?.[1]
                    : publication?.metadata?.images?.[0]?.split("ipfs://")?.[1]
                }`,
              })
            }
          >
            <MediaSwitch
              type={publication?.metadata?.mediaTypes?.[0]}
              srcUrl={
                publication?.metadata?.mediaTypes?.[0] == "video"
                  ? publication?.metadata?.video
                  : publication?.metadata?.mediaTypes?.[0] == "audio"
                  ? `${INFURA_GATEWAY}/ipfs/${
                      publication?.metadata?.audio?.split("ipfs://")?.[1]
                    }`
                  : `${INFURA_GATEWAY}/ipfs/${
                      publication?.metadata?.images?.[0]?.split("ipfs://")?.[1]
                    }`
              }
              classNameVideo={{
                objectFit: "cover",
                display: "flex",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyItems: "center",
                position: "relative",
              }}
              srcCover={
                publication?.metadata?.mediaTypes?.[0] == "video" ||
                publication?.metadata?.mediaTypes?.[0] == "audio"
                  ? `${INFURA_GATEWAY}/ipfs/${
                      publication?.metadata?.mediaCover?.split("ipfs://")?.[1]
                    }`
                  : undefined
              }
              hidden
            />
          </div>
        </div>
        <div className="relative flex flex-row justify-between gap-2 w-full h-fit items-center">
          <div className="relative gap-1 flex flex-col items-start justify-center">
            <div className="relative flex w-fit h-fit break-all text-nuba font-bit text-lg uppercase">
              {publication?.metadata?.title}
            </div>
            <div
              className="relative w-fit h-fit flex text-mos text-sm font-bit uppercase cursor-pointer"
              onMouseEnter={() => setProfileHover(true)}
            >
              {publication?.profile?.username?.localName}
            </div>
            {profileHover && (
              <HoverProfile
                dict={dict}
                publication={publication?.profile!}
                setProfileHover={setProfileHover}
                parentId={publication?.postId}
                top={"auto"}
                bottom={"2px"}
                left={"2px"}
                right={"auto"}
              />
            )}
          </div>
          <div className="relative w-fit h-fit flex items-end justify-center mb-0 cursor-pointer active:scale-95">
            <div
              className="relative w-10 h-10 flex"
              onClick={() => setPopup((prev) => !prev)}
            >
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/QmZ4v5pzdnCBeyKnS9VrjZiEAbUpAVy8ECArNcpxBt6Tw4`}
                draggable={false}
              />
            </div>
          </div>
          {popup && (
            <PopUp
              cartItem={publication}
              type={ItemType.Chromadin}
              level={undefined}
              right={"-5px"}
              bottom={"60px"}
              dict={dict}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chromadin;
