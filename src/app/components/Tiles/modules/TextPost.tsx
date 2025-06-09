import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext, useState } from "react";
import moment from "moment";
import { ModalContext } from "@/app/providers";
import { TextPostProps } from "../types/tiles.types";
import descriptionRegex from "@/app/lib/helpers/descriptionRegex";
import { TextOnlyMetadata } from "@lens-protocol/client";
import InteractBar from "./InteractBar";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import checkActions from "@/app/lib/helpers/checkActions";
import { useRouter } from "next/navigation";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import HoverProfile from "./HoverProfile";

const TextPost: FunctionComponent<TextPostProps> = ({
  dict,
  publication,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const [profileHover, setProfileHover] = useState<boolean>(false);
  const router = useRouter();
  return (
    <div
      className={`relative w-full h-fit flex items-end justify-center flex rounded-sm border border-sol p-4 gap-4 ${
        context?.layoutSwitch == 4
          ? "flex-col xl:flex-row"
          : "flex-col md:flex-row"
      }`}
      id={publication?.id}
    >
      <div
        className={`relative rounded-sm border border-mosgu bg-fuego p-2 font-bit text-nuba text-sm text-left break-words flex justify-center break-words items-start overflow-y-scroll h-100 whitespace-preline ${
          context?.layoutSwitch === 2 ? "w-full" : "w-full xl:w-100"
        }`}
        dangerouslySetInnerHTML={{
          __html: descriptionRegex(
            (
              (publication?.__typename === "Repost"
                ? publication?.repostOf
                : publication
              )?.metadata as TextOnlyMetadata
            )?.content,
            false
          ),
        }}
      ></div>
      <div className="relative w-fit h-fit flex flex-col gap-5 items-end justify-end">
        <div className="relative flex flex-col w-fit h-fit gap-2 items-end justify-center">
          <InteractBar
            dict={dict}
            publication={
              publication?.__typename === "Repost"
                ? publication?.repostOf
                : publication
            }
          />
          <div className="relative w-full h-fit flex flex-col items-center justify-start justify-between p-1 gap-3">
            <div className="relative w-full h-fit items-end justify-start flex flex-col gap-3">
              <div className="relative w-full h-fit items-end justify-start flex flex-col">
                <div
                  className={`relative flex items-center justify-center text-right break-words text-white font-bit uppercase ${
                    Number(context?.layoutSwitch) < 4
                      ? "text-xs 2xl:text-sm"
                      : "text-sm 2xl:text-base"
                  }`}
                >
                  {
                    (publication?.__typename === "Repost"
                      ? publication?.repostOf
                      : publication
                    )?.author?.username?.value
                  }
                </div>
                <div className="relative flex items-center justify-center text-right break-words text-white/70 font-bit uppercase text-xs">
                  {
                    (publication?.__typename === "Repost"
                      ? publication?.repostOf
                      : publication
                    )?.author?.username?.localName
                  }
                </div>
              </div>
              <div className="relative w-full h-fit items-end justify-start flex flex-col">
                <div className="relative flex items-center justify-center text-right break-words text-white font-bit uppercase text-sm">
                  {dict?.pos}
                </div>
                <div className="relative flex items-center justify-center text-right break-words text-white/70 font-bit uppercase text-sm">
                  {(publication?.__typename === "Repost"
                    ? publication?.repostOf
                    : publication
                  )?.timestamp &&
                    moment(
                      `${
                        (publication?.__typename === "Repost"
                          ? publication?.repostOf
                          : publication
                        )?.timestamp
                      }`
                    ).fromNow()}
                </div>
              </div>
            </div>
            <div className="relative mb-0 flex flex-row items-center justify-between gap-2 w-full h-fit">
              <div className="relative w-6 h-6 items-center justify-center flex">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmeA7R3J8FrhZuMmiFFrVqNmWzKkJCbP51pajFrYdEGBVX`}
                  priority
                  draggable={false}
                  layout="fill"
                />
              </div>
              <div
                className="relative w-6 h-6 flex items-center justify-center cursor-pointer active:scale-95"
                onClick={(e) => {
                  e.stopPropagation();
                  context?.setFiltersOpen({ value: false, allow: false });
                  checkActions(publication, router);
                }}
              >
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmZ4v5pzdnCBeyKnS9VrjZiEAbUpAVy8ECArNcpxBt6Tw4`}
                  draggable={false}
                />
              </div>
              <div
                className="relative w-6 h-6 rounded-full flex items-center justify-center p-1 cursor-pointer"
                id="pfp"
                onMouseEnter={() => setProfileHover(true)}
              >
                <Image
                  layout="fill"
                  objectFit="cover"
                  src={handleProfilePicture(
                    publication?.author?.metadata?.picture
                  )}
                  key={publication?.author?.metadata?.picture}
                  draggable={false}
                  className="rounded-full"
                  onError={(e) => handleImageError(e)}
                />
              </div>
              {profileHover && (
                <HoverProfile
                  dict={dict}
                  publication={publication?.author}
                  setProfileHover={setProfileHover}
                  parentId={publication?.id}
                  top={"auto"}
                  bottom={"2px"}
                  left={"auto"}
                  right={"2px"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextPost;
