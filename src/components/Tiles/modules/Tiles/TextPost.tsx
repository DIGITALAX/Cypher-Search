import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import {
  CHROMADIN_OPEN_ACTION,
  COIN_OP_OPEN_ACTION,
  F3M_OPEN_ACTION,
  INFURA_GATEWAY,
  LISTENER_OPEN_ACTION,
} from "../../../../../lib/constants";
import { TextPostProps } from "../../types/tiles.types";
import InteractBar from "@/components/Common/modules/InteractBar";
import HoverProfile from "@/components/Common/modules/HoverProfile";
import { ImageMetadataV3, Post } from "../../../../../graphql/generated";
import moment from "moment";
import descriptionRegex from "../../../../../lib/helpers/descriptionRegex";
import createProfilePicture from "../../../../../lib/helpers/createProfilePicture";
import handleImageError from "../../../../../lib/helpers/handleImageError";

const TextPost: FunctionComponent<TextPostProps> = ({
  layoutAmount,
  t,
  router,
  publication,
  mirror,
  like,
  locale,
  interactionsLoading,
  setOpenMirrorChoice,
  openMirrorChoice,
  index,
  profileHovers,
  setProfileHovers,
  followLoading,
  followProfile,
  unfollowProfile,
  simpleCollect,
  dispatch,
  lensConnected,
}): JSX.Element => {
  const pfp = createProfilePicture(
    (publication?.__typename === "Mirror"
      ? publication?.mirrorOn
      : (publication as Post)
    )?.by?.metadata?.picture
  );
  return (
    <div
      className={`relative w-full h-fit flex items-end justify-center flex rounded-sm border border-sol p-4 gap-4 ${
        layoutAmount == 4 ? "flex-col xl:flex-row" : "flex-col md:flex-row"
      }`}
      id={publication?.id}
    >
      <div
        className={`relative rounded-sm border border-mosgu bg-fuego p-2 font-bit text-nuba text-sm text-left break-words flex justify-center break-words items-start overflow-y-scroll h-100 whitespace-preline ${
          layoutAmount === 2 ? "w-full" : "w-full xl:w-100"
        }`}
        dangerouslySetInnerHTML={{
          __html: descriptionRegex(
            (publication?.__typename === "Mirror"
              ? publication?.mirrorOn
              : (publication as Post)
            )?.isEncrypted &&
              !(
                (publication?.__typename === "Mirror"
                  ? publication?.mirrorOn
                  : (publication as Post)
                )?.metadata as any
              )?.decrypted
              ? (
                  (publication?.__typename === "Mirror"
                    ? publication?.mirrorOn
                    : (publication as Post)
                  )?.metadata as any
                )?.title + t("poE")
              : (
                  (publication?.__typename === "Mirror"
                    ? publication?.mirrorOn
                    : (publication as Post)
                  )?.metadata as any
                )?.content,
            false
          ),
        }}
      ></div>
      <div className="relative w-fit h-fit flex flex-col gap-5 items-end justify-end">
        <div className="relative flex flex-col w-fit h-fit gap-2 items-end justify-center">
          <InteractBar
            mirror={mirror}
            router={router}
            locale={locale}
            like={like}
            dispatch={dispatch}
            interactionsLoading={interactionsLoading}
            layoutAmount={layoutAmount}
            openMirrorChoice={openMirrorChoice}
            setOpenMirrorChoice={setOpenMirrorChoice}
            index={index}
            publication={
              publication?.__typename === "Mirror" ? publication : publication
            }
            simpleCollect={simpleCollect}
          />
          <div className="relative w-full h-fit flex flex-col items-center justify-start justify-between p-1 gap-3">
            <div className="relative w-full h-fit items-end justify-start flex flex-col gap-3">
              <div className="relative w-full h-fit items-end justify-start flex flex-col">
                <div
                  className={`relative flex items-center justify-center text-right break-words text-white font-bit uppercase ${
                    layoutAmount < 4
                      ? "text-xs 2xl:text-sm"
                      : "text-sm 2xl:text-base"
                  }`}
                >
                  {
                    (publication?.__typename === "Mirror"
                      ? publication?.mirrorOn
                      : (publication as Post)
                    )?.by?.handle?.localName
                  }
                </div>
                <div className="relative flex items-center justify-center text-right break-words text-white/70 font-bit uppercase text-xs">
                  {
                    (publication?.__typename === "Mirror"
                      ? publication?.mirrorOn
                      : (publication as Post)
                    )?.by?.handle?.suggestedFormatted?.localName
                  }
                </div>
              </div>
              <div className="relative w-full h-fit items-end justify-start flex flex-col">
                <div className="relative flex items-center justify-center text-right break-words text-white font-bit uppercase text-sm">
                  {t("pos")}
                </div>
                <div className="relative flex items-center justify-center text-right break-words text-white/70 font-bit uppercase text-sm">
                  {(publication?.__typename === "Mirror"
                    ? publication?.mirrorOn
                    : (publication as Post)
                  )?.createdAt &&
                    moment(
                      `${
                        (publication?.__typename === "Mirror"
                          ? publication?.mirrorOn
                          : (publication as Post)
                        )?.createdAt
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

                  (publication?.__typename == "Mirror"
                    ? publication?.mirrorOn
                    : (publication as Post)
                  )?.openActionModules?.[0]?.contract?.address
                    ?.toLowerCase()
                    ?.includes(CHROMADIN_OPEN_ACTION?.toLowerCase())
                    ? router.push(
                        `/item/chromadin/${(
                          (publication?.__typename == "Mirror"
                            ? publication?.mirrorOn
                            : (publication as Post)
                          )?.metadata as ImageMetadataV3
                        )?.title?.replaceAll(" ", "_")}`
                      )
                    : (publication?.__typename == "Mirror"
                        ? publication?.mirrorOn
                        : (publication as Post)
                      )?.openActionModules?.[0]?.contract?.address
                        ?.toLowerCase()
                        ?.includes(COIN_OP_OPEN_ACTION?.toLowerCase())
                    ? router.push(
                        `/item/coinop/${(
                          (publication?.__typename == "Mirror"
                            ? publication?.mirrorOn
                            : (publication as Post)
                          )?.metadata as ImageMetadataV3
                        )?.title?.replaceAll(" ", "_")}`
                      )
                    : (publication?.__typename == "Mirror"
                        ? publication?.mirrorOn
                        : (publication as Post)
                      )?.openActionModules?.[0]?.contract?.address
                        ?.toLowerCase()
                        ?.includes(LISTENER_OPEN_ACTION?.toLowerCase())
                    ? router.push(
                        `/item/listener/${(
                          (publication?.__typename == "Mirror"
                            ? publication?.mirrorOn
                            : (publication as Post)
                          )?.metadata as ImageMetadataV3
                        )?.title?.replaceAll(" ", "_")}`
                      )
                    : (publication?.__typename == "Mirror"
                        ? publication?.mirrorOn
                        : (publication as Post)
                      )?.openActionModules?.[0]?.contract?.address
                        ?.toLowerCase()
                        ?.includes(F3M_OPEN_ACTION?.toLowerCase())
                    ? router.push(
                        `/item/f3m/${(
                          (publication?.__typename == "Mirror"
                            ? publication?.mirrorOn
                            : (publication as Post)
                          )?.metadata as ImageMetadataV3
                        )?.title?.replaceAll(" ", "_")}`
                      )
                    : router.push(`/item/pub/${publication?.id}`);
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
                onMouseEnter={() =>
                  setProfileHovers((prev) => {
                    const updatedArray = [...prev];
                    updatedArray[index] = true;
                    return updatedArray;
                  })
                }
              >
                {pfp && (
                  <Image
                    layout="fill"
                    objectFit="cover"
                    src={pfp}
                    draggable={false}
                    className="rounded-full"
                    onError={(e) => handleImageError(e)}
                  />
                )}
              </div>
              {profileHovers?.[index] && (
                <HoverProfile
                  followLoading={followLoading}
                  followProfile={followProfile}
                  unfollowProfile={unfollowProfile}
                  router={router}
                  publication={publication?.by}
                  index={index}
                  setProfileHovers={setProfileHovers}
                  dispatch={dispatch}
                  lensConnected={lensConnected}
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
