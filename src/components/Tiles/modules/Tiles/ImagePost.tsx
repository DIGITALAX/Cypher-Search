import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import {
  CHROMADIN_OPEN_ACTION,
  COIN_OP_OPEN_ACTION,
  F3M_OPEN_ACTION,
  INFURA_GATEWAY,
  IPFS_REGEX,
  KINORA_OPEN_ACTION,
  LISTENER_OPEN_ACTION,
} from "../../../../../lib/constants";
import { ImagePostProps } from "../../types/tiles.types";
import InteractBar from "@/components/Common/modules/InteractBar";
import { setImageViewer } from "../../../../../redux/reducers/ImageLargeSlice";
import HoverProfile from "@/components/Common/modules/HoverProfile";
import {
  ImageMetadataV3,
  Post,
  PublicationMetadataMedia,
  PublicationMetadataMediaImage,
} from "../../../../../graphql/generated";
import MediaSwitch from "@/components/Common/modules/MediaSwitch";
import { metadataMedia } from "../../../../../lib/helpers/postMetadata";
import descriptionRegex from "../../../../../lib/helpers/descriptionRegex";
import createProfilePicture from "../../../../../lib/helpers/createProfilePicture";
import moment from "moment";
import handleImageError from "../../../../../lib/helpers/handleImageError";

const ImagePost: FunctionComponent<ImagePostProps> = ({
  layoutAmount,
  publication,
  router,
  dispatch,
  mirror,
  like,
  locale,
  interactionsLoading,
  openMirrorChoice,
  setOpenMirrorChoice,
  index,
  profileHovers,
  setProfileHovers,
  followLoading,
  t,
  followProfile,
  unfollowProfile,
  simpleCollect,
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
      className={`relative w-full h-fit flex items-center justify-center flex rounded-sm border border-sol p-4 gap-4 flex-col`}
      id={publication?.id}
    >
      {layoutAmount === 4 ? (
        <>
          <div
            className="relative flex w-full h-40 rounded-sm border border-white bg-amo/30 cursor-pointer items-center justify-center cursor-pointer"
            onClick={() =>
              dispatch(
                setImageViewer({
                  actionValue: true,
                  actionType: (
                    (publication?.__typename === "Mirror"
                      ? publication?.mirrorOn
                      : (publication as Post)
                    )?.metadata as ImageMetadataV3
                  )?.asset?.image?.raw?.mimeType,
                  actionImage: (
                    (publication?.__typename === "Mirror"
                      ? publication?.mirrorOn
                      : (publication as Post)
                    )?.metadata as ImageMetadataV3
                  )?.asset.image?.raw?.uri?.includes("ipfs://")
                    ? `${INFURA_GATEWAY}/ipfs/${
                        (
                          (publication?.__typename === "Mirror"
                            ? publication?.mirrorOn
                            : (publication as Post)
                          )?.metadata as ImageMetadataV3
                        )?.asset.image?.raw?.uri?.split("ipfs://")?.[1]
                      }`
                    : (
                        (publication?.__typename === "Mirror"
                          ? publication?.mirrorOn
                          : (publication as Post)
                        )?.metadata as ImageMetadataV3
                      )?.asset.image?.raw?.uri?.includes("ar://")
                    ? `https://arweave.net/${(
                        (publication?.__typename === "Mirror"
                          ? publication?.mirrorOn
                          : (publication as Post)
                        )?.metadata as ImageMetadataV3
                      )?.asset.image?.raw?.uri
                        ?.split("ar://")?.[1]
                        ?.replace(/"/g, "")
                        ?.trim()}`
                    : (
                        (publication?.__typename === "Mirror"
                          ? publication?.mirrorOn
                          : (publication as Post)
                        )?.metadata as ImageMetadataV3
                      )?.asset.image?.raw?.uri,
                })
              )
            }
          >
            {(
              (publication?.__typename === "Mirror"
                ? publication?.mirrorOn
                : (publication as Post)
              )?.metadata as ImageMetadataV3
            )?.asset && (
              <Image
                layout="fill"
                onError={(e) => handleImageError(e)}
                src={
                  (
                    (publication?.__typename === "Mirror"
                      ? publication?.mirrorOn
                      : (publication as Post)
                    )?.metadata as ImageMetadataV3
                  )?.asset.image?.raw?.uri?.includes("ipfs://") &&
                  IPFS_REGEX.test(
                    (
                      (publication?.__typename === "Mirror"
                        ? publication?.mirrorOn
                        : (publication as Post)
                      )?.metadata as ImageMetadataV3
                    )?.asset.image?.raw?.uri?.split("ipfs://")?.[1]
                  )
                    ? `${INFURA_GATEWAY}/ipfs/${
                        (
                          (publication?.__typename === "Mirror"
                            ? publication?.mirrorOn
                            : (publication as Post)
                          )?.metadata as ImageMetadataV3
                        )?.asset.image?.raw?.uri?.split("ipfs://")?.[1]
                      }`
                    : (
                        (publication?.__typename === "Mirror"
                          ? publication?.mirrorOn
                          : (publication as Post)
                        )?.metadata as ImageMetadataV3
                      )?.asset.image?.raw?.uri?.includes("ar://")
                    ? `https://arweave.net/${(
                        (publication?.__typename === "Mirror"
                          ? publication?.mirrorOn
                          : (publication as Post)
                        )?.metadata as ImageMetadataV3
                      )?.asset.image?.raw?.uri
                        ?.split("ar://")?.[1]
                        ?.replace(/"/g, "")
                        ?.trim()}`
                    : (
                        (publication?.__typename === "Mirror"
                          ? publication?.mirrorOn
                          : (publication as Post)
                        )?.metadata as ImageMetadataV3
                      )?.asset.image?.raw?.uri
                }
                className="rounded-sm"
                objectFit="cover"
                draggable={false}
              />
            )}
          </div>
          <div
            className={`flex flex-row w-full h-full justify-between gap-2 items-between xl:flex-row flex-col`}
          >
            <div
              className={`relative flex flex-wrap items-start justify-start gap-2 w-full h-full`}
            >
              {(!(
                publication?.__typename === "Mirror"
                  ? publication?.mirrorOn
                  : (publication as Post)
              )?.isEncrypted ||
                ((publication?.__typename === "Mirror"
                  ? publication?.mirrorOn
                  : (publication as Post)
                )?.isEncrypted &&
                  (
                    (publication?.__typename === "Mirror"
                      ? publication?.mirrorOn
                      : (publication as Post)) as any
                  )?.decrypted)) &&
                ((
                  (publication?.__typename === "Mirror"
                    ? publication?.mirrorOn
                    : (publication as Post)
                  )?.metadata as ImageMetadataV3
                )?.attachments &&
                Number(
                  (
                    (publication?.__typename === "Mirror"
                      ? publication?.mirrorOn
                      : (publication as Post)
                    )?.metadata as ImageMetadataV3
                  )?.attachments?.length
                ) > 0
                  ? (
                      (publication?.__typename === "Mirror"
                        ? publication?.mirrorOn
                        : (publication as Post)
                      )?.metadata as ImageMetadataV3
                    )?.attachments?.map(
                      (item: PublicationMetadataMedia, index: number) => {
                        const media = metadataMedia(item);
                        return (
                          <div
                            className="relative w-24 h-24 flex border border-white rounded-sm cursor-pointer bg-amo/30"
                            onClick={() =>
                              dispatch(
                                setImageViewer({
                                  actionValue: true,
                                  actionType: "png",
                                  actionImage: media?.url,
                                })
                              )
                            }
                            key={index}
                          >
                            {media?.url && (
                              <MediaSwitch
                                type={media?.type}
                                srcUrl={media?.url}
                                srcCover={media?.cover}
                                classNameVideo={{
                                  objectFit: "cover",
                                  display: "flex",
                                  width: "100%",
                                  height: "100%",
                                  alignItems: "center",
                                  justifyItems: "center",
                                  borderRadius: "0.125rem",
                                  position: "absolute",
                                }}
                                classNameImage={"rounded-sm"}
                                classNameAudio={"rounded-md"}
                              />
                            )}
                          </div>
                        );
                      }
                    )
                  : (publication?.__typename === "Mirror"
                      ? publication?.mirrorOn
                      : (publication as Post)
                    )?.isEncrypted &&
                    !(
                      (publication?.__typename === "Mirror"
                        ? publication?.mirrorOn
                        : (publication as Post)) as any
                    )?.decrypted
                  ? (
                      (publication?.__typename === "Mirror"
                        ? publication?.mirrorOn
                        : (publication as Post)
                      )?.metadata as any
                    )?.title?.length > 0
                  : (
                      (publication?.__typename === "Mirror"
                        ? publication?.mirrorOn
                        : (publication as Post)
                      )?.metadata as any
                    )?.content?.length > 0 && (
                      <div
                        className="relative w-full h-40 rounded-sm border border-mosgu bg-fuego p-2 font-bit text-nuba text-sm text-left break-words flex justify-center items-start overflow-y-scroll whitespace-preline"
                        dangerouslySetInnerHTML={{
                          __html: descriptionRegex(
                            (publication?.__typename === "Mirror"
                              ? publication?.mirrorOn
                              : (publication as Post)
                            )?.isEncrypted &&
                              !(
                                (publication?.__typename === "Mirror"
                                  ? publication?.mirrorOn
                                  : (publication as Post)) as any
                              )?.decrypted
                              ? (
                                  (publication?.__typename === "Mirror"
                                    ? publication?.mirrorOn
                                    : (publication as Post)
                                  )?.metadata as any
                                )?.title
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
                    ))}
            </div>
            <div className="relative h-full w-fit items-center justify-between flex flex-col gap-4">
              <InteractBar
                mirror={mirror}
                like={like}
                locale={locale}
                interactionsLoading={interactionsLoading}
                layoutAmount={layoutAmount}
                openMirrorChoice={openMirrorChoice}
                setOpenMirrorChoice={setOpenMirrorChoice}
                index={index}
                publication={
                  publication?.__typename === "Mirror"
                    ? publication
                    : publication
                }
                router={router}
                dispatch={dispatch}
                simpleCollect={simpleCollect}
              />
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
                  onClick={() =>
                    router.push(
                      `/autograph/${publication?.by?.handle?.localName}`
                    )
                  }
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
        </>
      ) : (
        <>
          <div className="relative w-full h-full flex flex-col md:flex-row gap-5 items-end justify-end">
            <div
              className={`flex items-start justify-center w-full border border-white rounded-sm cursor-pointer bg-amo/30 relative ${
                Number(
                  (
                    (publication?.__typename === "Mirror"
                      ? publication?.mirrorOn
                      : (publication as Post)
                    )?.metadata as ImageMetadataV3
                  )?.attachments?.filter(
                    (item) =>
                      (
                        (publication?.__typename === "Mirror"
                          ? publication?.mirrorOn
                          : (publication as Post)
                        )?.metadata as ImageMetadataV3
                      )?.asset?.image?.raw?.uri !==
                      (item as PublicationMetadataMediaImage)?.image?.raw?.uri
                  )?.length
                ) > 3
                  ? "h-[38.5rem]"
                  : "h-[28rem]"
              }`}
              onClick={() =>
                dispatch(
                  setImageViewer({
                    actionValue: true,
                    actionType: (
                      (publication?.__typename === "Mirror"
                        ? publication?.mirrorOn
                        : (publication as Post)
                      )?.metadata as ImageMetadataV3
                    )?.asset?.image?.raw?.mimeType,
                    actionImage:
                      (publication?.__typename === "Mirror"
                        ? publication?.mirrorOn
                        : (publication as Post)
                      )?.isEncrypted &&
                      !(
                        (publication?.__typename === "Mirror"
                          ? publication?.mirrorOn
                          : (publication as Post)) as any
                      ).decrypted
                        ? `${INFURA_GATEWAY}/ipfs/QmPSiDStf42xy3WgLuz8zb9PEiJVg48NTV311jjd9Drs46`
                        : (
                            (publication?.__typename === "Mirror"
                              ? publication?.mirrorOn
                              : (publication as Post)
                            )?.metadata as ImageMetadataV3
                          )?.asset.image?.raw?.uri?.includes("ipfs://")
                        ? `${INFURA_GATEWAY}/ipfs/${
                            (
                              (publication?.__typename === "Mirror"
                                ? publication?.mirrorOn
                                : (publication as Post)
                              )?.metadata as ImageMetadataV3
                            )?.asset.image?.raw?.uri?.split("ipfs://")?.[1]
                          }`
                        : (
                            (publication?.__typename === "Mirror"
                              ? publication?.mirrorOn
                              : (publication as Post)
                            )?.metadata as ImageMetadataV3
                          )?.asset.image?.raw?.uri?.includes("ar://")
                        ? `https://arweave.net/${(
                            (publication?.__typename === "Mirror"
                              ? publication?.mirrorOn
                              : (publication as Post)
                            )?.metadata as ImageMetadataV3
                          )?.asset.image?.raw?.uri
                            ?.split("ar://")?.[1]
                            ?.replace(/"/g, "")
                            ?.trim()}`
                        : (
                            (publication?.__typename === "Mirror"
                              ? publication?.mirrorOn
                              : (publication as Post)
                            )?.metadata as ImageMetadataV3
                          )?.asset.image?.raw?.uri,
                  })
                )
              }
            >
              {(
                (publication?.__typename === "Mirror"
                  ? publication?.mirrorOn
                  : (publication as Post)
                )?.metadata as ImageMetadataV3
              )?.asset && (
                <Image
                  layout="fill"
                  onError={(e) => handleImageError(e)}
                  src={
                    (publication?.__typename === "Mirror"
                      ? publication?.mirrorOn
                      : (publication as Post)
                    )?.isEncrypted &&
                    !(
                      (publication?.__typename === "Mirror"
                        ? publication?.mirrorOn
                        : (publication as Post)) as any
                    ).decrypted
                      ? `${INFURA_GATEWAY}/ipfs/QmPSiDStf42xy3WgLuz8zb9PEiJVg48NTV311jjd9Drs46`
                      : (
                          (publication?.__typename === "Mirror"
                            ? publication?.mirrorOn
                            : (publication as Post)
                          )?.metadata as ImageMetadataV3
                        )?.asset.image?.raw?.uri?.includes("ipfs://")
                      ? `${INFURA_GATEWAY}/ipfs/${
                          (
                            (publication?.__typename === "Mirror"
                              ? publication?.mirrorOn
                              : (publication as Post)
                            )?.metadata as ImageMetadataV3
                          )?.asset.image?.raw?.uri?.split("ipfs://")?.[1]
                        }`
                      : (
                          (publication?.__typename === "Mirror"
                            ? publication?.mirrorOn
                            : (publication as Post)
                          )?.metadata as ImageMetadataV3
                        )?.asset.image?.raw?.uri?.includes("ar://")
                      ? `https://arweave.net/${(
                          (publication?.__typename === "Mirror"
                            ? publication?.mirrorOn
                            : (publication as Post)
                          )?.metadata as ImageMetadataV3
                        )?.asset.image?.raw?.uri
                          ?.split("ar://")?.[1]
                          ?.replace(/"/g, "")
                          ?.trim()}`
                      : (
                          (publication?.__typename === "Mirror"
                            ? publication?.mirrorOn
                            : (publication as Post)
                          )?.metadata as ImageMetadataV3
                        )?.asset.image?.raw?.uri
                  }
                  className="rounded-sm w-full h-full flex"
                  objectFit="cover"
                  draggable={false}
                />
              )}
            </div>
            <div className="relative flex flex-col w-36 h-full items-end justify-end gap-2">
              <div className="relative w-full max-h-[28rem] flex items-start justify-center overflow-y-scroll">
                <div className="relative w-full h-fit flex items-center justify-start flex-col gap-2">
                  {(
                    (publication?.__typename === "Mirror"
                      ? publication?.mirrorOn
                      : (publication as Post)
                    )?.metadata as ImageMetadataV3
                  )?.attachments &&
                    Number(
                      (
                        (publication?.__typename === "Mirror"
                          ? publication?.mirrorOn
                          : (publication as Post)
                        )?.metadata as ImageMetadataV3
                      )?.attachments?.length
                    ) > 0 &&
                    (
                      (publication?.__typename === "Mirror"
                        ? publication?.mirrorOn
                        : (publication as Post)
                      )?.metadata as ImageMetadataV3
                    )?.attachments
                      ?.filter(
                        (item) =>
                          (
                            (publication?.__typename === "Mirror"
                              ? publication?.mirrorOn
                              : (publication as Post)
                            )?.metadata as ImageMetadataV3
                          )?.asset?.image?.raw?.uri !==
                          (item as PublicationMetadataMediaImage)?.image?.raw
                            ?.uri
                      )
                      ?.map((item: PublicationMetadataMedia, index: number) => {
                        const media = metadataMedia(item);
                        return (
                          <div
                            className="relative w-full h-24 flex border border-white rounded-sm cursor-pointer bg-amo/30"
                            key={index}
                            onClick={() =>
                              dispatch(
                                setImageViewer({
                                  actionValue: true,
                                  actionType: "png",
                                  actionImage: media?.url,
                                })
                              )
                            }
                          >
                            {media?.url && (
                              <MediaSwitch
                                type={media?.type}
                                srcUrl={media?.url}
                                srcCover={media?.cover}
                                classNameVideo={{
                                  objectFit: "cover",
                                  display: "flex",
                                  width: "100%",
                                  height: "100%",
                                  alignItems: "center",
                                  justifyItems: "center",
                                  borderRadius: "0.125rem",
                                  position: "absolute",
                                }}
                                classNameImage={"rounded-sm"}
                                classNameAudio={"rounded-md"}
                              />
                            )}
                          </div>
                        );
                      })}
                </div>
              </div>

              <InteractBar
                mirror={mirror}
                router={router}
                like={like}
                locale={locale}
                interactionsLoading={interactionsLoading}
                col
                openMirrorChoice={openMirrorChoice}
                setOpenMirrorChoice={setOpenMirrorChoice}
                index={index}
                publication={
                  publication?.__typename === "Mirror"
                    ? publication
                    : publication
                }
                dispatch={dispatch}
                simpleCollect={simpleCollect}
              />
            </div>
          </div>
          <div className="relative w-full h-full flex flex-col md:flex-row gap-5 items-center justify-center">
            {((publication?.__typename === "Mirror"
              ? publication?.mirrorOn
              : (publication as Post)
            )?.isEncrypted &&
              !(
                (publication?.__typename === "Mirror"
                  ? publication?.mirrorOn
                  : (publication as Post)) as any
              )?.decrypted &&
              (
                (publication?.__typename === "Mirror"
                  ? publication?.mirrorOn
                  : (publication as Post)
                )?.metadata as any
              )?.title?.length > 0) ||
            (
              (publication?.__typename === "Mirror"
                ? publication?.mirrorOn
                : (publication as Post)
              )?.metadata as any
            )?.content?.length > 0 ||
            (!(
              publication?.__typename === "Mirror"
                ? publication?.mirrorOn
                : (publication as Post)
            )?.isEncrypted &&
              (
                (publication?.__typename === "Mirror"
                  ? publication?.mirrorOn
                  : (publication as Post)
                )?.metadata as any
              )?.title?.length > 0) ||
            (
              (publication?.__typename === "Mirror"
                ? publication?.mirrorOn
                : (publication as Post)
              )?.metadata as any
            )?.content?.length > 0 ? (
              <div
                className="relative w-full h-80 rounded-sm border border-mosgu bg-fuego p-1.5 font-bit text-nuba text-sm text-left break-words flex justify-start items-start overflow-y-scroll whitespace-preline"
                dangerouslySetInnerHTML={{
                  __html: descriptionRegex(
                    (publication?.__typename === "Mirror"
                      ? publication?.mirrorOn
                      : (publication as Post)
                    )?.isEncrypted &&
                      !(
                        (publication?.__typename === "Mirror"
                          ? publication?.mirrorOn
                          : (publication as Post)) as any
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
            ) : (
              <div className="relative w-full h-80 flex"></div>
            )}
            <div
              className={`relative h-full flex items-center justify-start gap-5 ${
                // (publication?.__typename === "Mirror"
                //   ? publication?.mirrorOn
                //   : (publication as Post)
                // )?.isEncrypted &&
                // !(
                //   (publication?.__typename === "Mirror"
                //     ? publication?.mirrorOn
                //     : (publication as Post)) as any
                // )?.decrypted
                //   ? (
                //       (publication?.__typename === "Mirror"
                //         ? publication?.mirrorOn
                //         : (publication as Post)
                //       )?.metadata as any
                //     )?.title?.length > 0
                //   : (
                //       (publication?.__typename === "Mirror"
                //         ? publication?.mirrorOn
                //         : (publication as Post)
                //       )?.metadata as any
                //     )?.content?.length > 0
                //   ?
                "w-full md:w-36"
                // : "w-full flex-row"
              }`}
            >
              <div
                className={`relative w-full flex p-1 ${
                  // (publication?.__typename === "Mirror"
                  //   ? publication?.mirrorOn
                  //   : (publication as Post)
                  // )?.isEncrypted &&
                  // !(
                  //   (publication?.__typename === "Mirror"
                  //     ? publication?.mirrorOn
                  //     : (publication as Post)) as any
                  // )?.decrypted &&
                  // ((
                  //   (publication?.__typename === "Mirror"
                  //     ? publication?.mirrorOn
                  //     : (publication as Post)
                  //   )?.metadata as any
                  // )?.title?.length > 0 ||
                  //   (
                  //     (publication?.__typename === "Mirror"
                  //       ? publication?.mirrorOn
                  //       : (publication as Post)
                  //     )?.metadata as any
                  //   )?.content?.length > 0)
                  //   ? "h-fit flex-row items-end justify-between w-full gap-4"
                  // :
                  "h-fit gap-1.5 md:gap-3 md:h-80 flex-col items-center justify-start"
                }`}
              >
                <div
                  className={`relative w-full h-full flex flex-row md:flex-col gap-3 ${
                    // (publication?.__typename === "Mirror"
                    //   ? publication?.mirrorOn
                    //   : (publication as Post)
                    // )?.isEncrypted &&
                    // !(
                    //   (publication?.__typename === "Mirror"
                    //     ? publication?.mirrorOn
                    //     : (publication as Post)) as any
                    // )?.decrypted &&
                    // ((
                    //   (publication?.__typename === "Mirror"
                    //     ? publication?.mirrorOn
                    //     : (publication as Post)
                    //   )?.metadata as any
                    // )?.title?.length > 0 ||
                    //   (
                    //     (publication?.__typename === "Mirror"
                    //       ? publication?.mirrorOn
                    //       : (publication as Post)
                    //     )?.metadata as any
                    //   )?.content?.length > 0)
                    //   ? "items-end justify-start"
                    //   :
                    "justify-between"
                  }`}
                >
                  <div
                    className={`relative w-full h-full flex flex-col ${
                      // (publication?.__typename === "Mirror"
                      //   ? publication?.mirrorOn
                      //   : (publication as Post)
                      // )?.isEncrypted &&
                      // !(
                      //   (publication?.__typename === "Mirror"
                      //     ? publication?.mirrorOn
                      //     : (publication as Post)) as any
                      // )?.decrypted &&
                      // ((
                      //   (publication?.__typename === "Mirror"
                      //     ? publication?.mirrorOn
                      //     : (publication as Post)
                      //   )?.metadata as any
                      // )?.title?.length > 0 ||
                      //   (
                      //     (publication?.__typename === "Mirror"
                      //       ? publication?.mirrorOn
                      //       : (publication as Post)
                      //     )?.metadata as any
                      //   )?.content?.length > 0)
                      //   ? "justify-start items-end"
                      //   :
                      "items-end justify-end"
                    }`}
                  >
                    <div className="relative flex items-center justify-center text-right break-words text-white font-bit uppercase text-sm 2xl:text-base">
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
                  <div
                    className={`relative w-full h-full flex flex-col ${
                      // (publication?.__typename === "Mirror"
                      //   ? publication?.mirrorOn
                      //   : (publication as Post)
                      // )?.isEncrypted &&
                      // !(
                      //   (publication?.__typename === "Mirror"
                      //     ? publication?.mirrorOn
                      //     : (publication as Post)) as any
                      // )?.decrypted &&
                      // ((
                      //   (publication?.__typename === "Mirror"
                      //     ? publication?.mirrorOn
                      //     : (publication as Post)
                      //   )?.metadata as any
                      // )?.title?.length > 0 ||
                      //   (
                      //     (publication?.__typename === "Mirror"
                      //       ? publication?.mirrorOn
                      //       : (publication as Post)
                      //     )?.metadata as any
                      //   )?.content?.length > 0)
                      //   ? "justify-start items-end"
                      //   :
                      "items-end justify-end"
                    }`}
                  >
                    <div className="relative flex items-end justify-end text-right break-words text-white font-bit uppercase text-sm">
                      {t("pos")}
                    </div>
                    <div className="relative flex items-end justify-end text-right break-words text-white/70 font-bit uppercase text-sm">
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
                <div
                  className={`relative mb-0 flex flex-row items-center  gap-2 w-full h-fit  ${
                    // (publication?.__typename === "Mirror"
                    //   ? publication?.mirrorOn
                    //   : (publication as Post)
                    // )?.isEncrypted &&
                    // !(
                    //   (publication?.__typename === "Mirror"
                    //     ? publication?.mirrorOn
                    //     : (publication as Post)) as any
                    // )?.decrypted &&
                    // ((
                    //   (publication?.__typename === "Mirror"
                    //     ? publication?.mirrorOn
                    //     : (publication as Post)
                    //   )?.metadata as any
                    // )?.title?.length > 0 ||
                    //   (
                    //     (publication?.__typename === "Mirror"
                    //       ? publication?.mirrorOn
                    //       : (publication as Post)
                    //     )?.metadata as any
                    //   )?.content?.length > 0)
                    //   ? "justify-end md:justify-between"
                    //   :
                    "justify-end"
                  }`}
                >
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
                        ?.includes(CHROMADIN_OPEN_ACTION.toLowerCase())
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
                        : (publication?.__typename == "Mirror"
                            ? publication?.mirrorOn
                            : (publication as Post)
                          )?.openActionModules?.[0]?.contract?.address
                            ?.toLowerCase()
                            ?.includes(KINORA_OPEN_ACTION?.toLowerCase())
                        ? router.push(
                            `/item/kinora/${
                              (publication?.__typename === "Mirror"
                                ? publication?.mirrorOn
                                : (publication as Post)
                              )?.id
                            }`
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
        </>
      )}
    </div>
  );
};

export default ImagePost;
