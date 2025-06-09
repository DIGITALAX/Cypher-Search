import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext, useState } from "react";
import { TripleAProps } from "../types/tiles.types";
import { ModalContext } from "@/app/providers";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import PrintType from "./PrintType";
import HoverProfile from "./HoverProfile";
import { useRouter } from "next/navigation";

const TripleA: FunctionComponent<TripleAProps> = ({
  dict,
  publication,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const router = useRouter();
  const [profileHover, setProfileHover] = useState<boolean>(false);
  return (
    <div
      className="relative w-full h-fit flex items-end justify-center flex rounded-sm border border-sol"
      id={`${publication?.id?.toString()}${publication?.profile?.address}`}
    >
      <div
        id="tripleBg"
        className="relative w-full h-full flex items-end justify-center flex-col gap-4 p-4"
      >
        <div className="absolute w-full h-full mix-blend-hard-light bg-tripleA opacity-60 bg-center bg-cover right-0 top-0 rounded-sm"></div>
        <div
          className="relative flex w-full h-100 items-center justify-center border border-white bg-amo/30 cursor-pointer"
          onClick={() =>
            context?.setImageViewer({
              type: "png",
              image: `${INFURA_GATEWAY}/ipfs/${
                publication?.metadata?.image?.split("ipfs://")?.[1]
              }`,
            })
          }
        >
          <Image
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/${
              publication?.metadata?.image?.split("ipfs://")?.[1]
            }`}
            objectFit="cover"
            draggable={false}
            onError={(e) => handleImageError(e)}
          />
          {publication?.printType && (
            <div className="absolute right-2 top-2 w-fit h-fit">
              <PrintType dict={dict} printType={publication?.printType!} />
            </div>
          )}
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
                parentId={`${publication?.id?.toString()}${
                  publication?.profile?.address
                }`}
                top={"auto"}
                bottom={"10px"}
                left={"2px"}
                right={"auto"}
              />
            )}
            <div className="relative flex flex-row justify-start items-center w-fit h-fit gap-2">
              <div
                className="relative w-10 h-10 flex items-center justify-center cursor-pointer active:scale-95"
                onClick={() => {
                  context?.setFiltersOpen({ value: false, allow: false });
                  router.push(
                    `/item/triplea/${publication?.metadata?.title?.replaceAll(
                      " ",
                      "_"
                    )}`
                  );
                }}
              >
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmZ4v5pzdnCBeyKnS9VrjZiEAbUpAVy8ECArNcpxBt6Tw4`}
                  draggable={false}
                />
              </div>

              <div
                className={`relative items-center justify-center uppercase break-words font-bit text-nuba w-fit h-fit ${
                  context?.layoutSwitch === 4 ? "text-xl" : "text-2xl"
                }`}
              >
                ${Number(publication?.prices?.[0]?.price)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripleA;
