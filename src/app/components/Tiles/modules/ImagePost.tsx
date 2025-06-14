import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext, useState } from "react";
import moment from "moment";
import { ModalContext } from "@/app/providers";
import { ImagePostProps } from "../types/tiles.types";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import {
  ImageMetadata,
  MediaAudio,
  MediaImage,
  MediaVideo,
} from "@lens-protocol/client";
import { handleImage } from "@/app/lib/helpers/handleImage";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { useRouter } from "next/navigation";
import MediaSwitch from "../../Common/modules/MediaSwitch";
import descriptionRegex from "@/app/lib/helpers/descriptionRegex";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { handleMedia } from "@/app/lib/helpers/handleMedia";
import HoverProfile from "./HoverProfile";
import InteractBar from "./InteractBar";
import checkActions from "@/app/lib/helpers/checkActions";

const ImagePost: FunctionComponent<ImagePostProps> = ({
  publication,
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const router = useRouter();
  const [profileHover, setProfileHover] = useState<boolean>(false);

  return (
    <div
      className={`relative w-full h-fit flex items-center justify-center flex rounded-sm border border-sol p-4 gap-4 flex-col`}
      id={publication?.id}
    >
      {context?.layoutSwitch === 4 ? (
        <>
          <div
            className="relative flex w-full h-40 rounded-sm border border-white bg-amo/30 cursor-pointer items-center justify-center cursor-pointer"
            onClick={() =>
              context?.setImageViewer({
                type: (
                  (publication?.__typename === "Repost"
                    ? publication?.repostOf
                    : publication
                  )?.metadata as ImageMetadata
                )?.image?.type,
                image: handleImage(
                  (
                    (publication?.__typename === "Repost"
                      ? publication?.repostOf
                      : publication
                    )?.metadata as ImageMetadata
                  )?.image?.item
                ),
              })
            }
          >
            <Image
              layout="fill"
              onError={(e) => handleImageError(e)}
              src={handleImage(
                (
                  (publication?.__typename === "Repost"
                    ? publication?.repostOf
                    : publication
                  )?.metadata as ImageMetadata
                )?.image?.item
              )}
              className="rounded-sm"
              objectFit="cover"
              draggable={false}
            />
          </div>
          <div
            className={`flex flex-row w-full h-full justify-between gap-2 items-between xl:flex-row flex-col`}
          >
            <div
              className={`relative flex flex-wrap items-start justify-start gap-2 w-full h-full`}
            >
              {(
                (publication?.__typename === "Repost"
                  ? publication?.repostOf
                  : publication
                )?.metadata as ImageMetadata
              )?.attachments &&
              Number(
                (
                  (publication?.__typename === "Repost"
                    ? publication?.repostOf
                    : publication
                  )?.metadata as ImageMetadata
                )?.attachments?.length
              ) > 0
                ? (
                    (publication?.__typename === "Repost"
                      ? publication?.repostOf
                      : publication
                    )?.metadata as ImageMetadata
                  )?.attachments?.map(
                    (
                      item: MediaAudio | MediaImage | MediaVideo,
                      index: number
                    ) => {
                      const media = handleMedia(item);
                      return (
                        <div
                          className="relative w-24 h-24 flex border border-white rounded-sm cursor-pointer bg-amo/30"
                          onClick={() =>
                            context?.setImageViewer({
                              type: "png",
                              image: media?.url!,
                            })
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
                : (
                    (publication?.__typename === "Repost"
                      ? publication?.repostOf
                      : publication
                    )?.metadata as ImageMetadata
                  )?.content?.length > 0 && (
                    <div
                      className="relative w-full h-40 rounded-sm border border-mosgu bg-fuego p-2 font-bit text-nuba text-sm text-left break-words flex justify-center items-start overflow-y-scroll whitespace-preline"
                      dangerouslySetInnerHTML={{
                        __html: descriptionRegex(
                          (
                            (publication?.__typename === "Repost"
                              ? publication?.repostOf
                              : publication
                            )?.metadata as ImageMetadata
                          )?.content,
                          false
                        ),
                      }}
                    ></div>
                  )}
            </div>
            <div className="relative h-full w-fit items-center justify-between flex flex-col gap-4">
              <InteractBar
                dict={dict}
                publication={
                  publication?.__typename === "Repost"
                    ? publication?.repostOf
                    : publication
                }
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
                  onClick={() => {
                    context?.setFiltersOpen({ value: false, allow: false });
                    router.push(
                      `/autograph/${
                        (publication?.__typename === "Repost"
                          ? publication?.repostOf
                          : publication
                        )?.author?.username?.localName
                      }`
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
                  className="relative w-6 h-6 rounded-full flex items-center justify-center p-1 cursor-pointer"
                  id="pfp"
                  onMouseEnter={() => setProfileHover(true)}
                >
                  <Image
                    layout="fill"
                    objectFit="cover"
                    src={handleProfilePicture(
                      (publication?.__typename === "Repost"
                        ? publication?.repostOf
                        : publication
                      )?.author?.metadata?.picture
                    )}
                    key={
                      (publication?.__typename === "Repost"
                        ? publication?.repostOf
                        : publication
                      )?.author?.metadata?.picture
                    }
                    draggable={false}
                    className="rounded-full"
                    onError={(e) => handleImageError(e)}
                  />
                </div>
                {profileHover && (
                  <HoverProfile
                    dict={dict}
                    publication={
                      (publication?.__typename === "Repost"
                        ? publication?.repostOf
                        : publication
                      )?.author
                    }
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
        </>
      ) : (
        <>
          <div className="relative w-full h-full flex flex-col md:flex-row gap-5 items-end justify-end">
            <div
              className={`flex items-start justify-center w-full border border-white rounded-sm cursor-pointer bg-amo/30 relative ${
                Number(
                  (
                    (publication?.__typename === "Repost"
                      ? publication?.repostOf
                      : publication
                    )?.metadata as ImageMetadata
                  )?.attachments?.length
                ) > 3
                  ? "h-[38.5rem]"
                  : "h-[28rem]"
              }`}
              onClick={() =>
                context?.setImageViewer({
                  type: (
                    (publication?.__typename === "Repost"
                      ? publication?.repostOf
                      : publication
                    )?.metadata as ImageMetadata
                  )?.image?.type,
                  image: handleImage(
                    (
                      (publication?.__typename === "Repost"
                        ? publication?.repostOf
                        : publication
                      )?.metadata as ImageMetadata
                    )?.image?.item
                  ),
                })
              }
            >
              {(
                (publication?.__typename === "Repost"
                  ? publication?.repostOf
                  : publication
                )?.metadata as ImageMetadata
              )?.image && (
                <Image
                  layout="fill"
                  onError={(e) => handleImageError(e)}
                  src={handleImage(
                    (
                      (publication?.__typename === "Repost"
                        ? publication?.repostOf
                        : publication
                      )?.metadata as ImageMetadata
                    )?.image?.item
                  )}
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
                    (publication?.__typename === "Repost"
                      ? publication?.repostOf
                      : publication
                    )?.metadata as ImageMetadata
                  )?.attachments &&
                    Number(
                      (
                        (publication?.__typename === "Repost"
                          ? publication?.repostOf
                          : publication
                        )?.metadata as ImageMetadata
                      )?.attachments?.length
                    ) > 0 &&
                    (
                      (publication?.__typename === "Repost"
                        ? publication?.repostOf
                        : publication
                      )?.metadata as ImageMetadata
                    )?.attachments?.map(
                      (
                        item: MediaAudio | MediaImage | MediaVideo,
                        index: number
                      ) => {
                        const media = handleMedia(item);
                        return (
                          <div
                            className="relative w-full h-24 flex border border-white rounded-sm cursor-pointer bg-amo/30"
                            key={index}
                            onClick={() =>
                              context?.setImageViewer({
                                type: "png",
                                image: media?.url!,
                              })
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
                      }
                    )}
                </div>
              </div>
              <InteractBar
                dict={dict}
                publication={
                  publication?.__typename === "Repost"
                    ? publication?.repostOf
                    : publication
                }
              />
            </div>
          </div>
          <div className="relative w-full h-full flex flex-col md:flex-row gap-5 items-center justify-center">
            {(
              (publication?.__typename === "Repost"
                ? publication?.repostOf
                : publication
              )?.metadata as ImageMetadata
            )?.content?.length > 0 ? (
              <div
                className="relative w-full h-80 rounded-sm border border-mosgu bg-fuego p-1.5 font-bit text-nuba text-sm text-left break-words flex justify-start items-start overflow-y-scroll whitespace-preline"
                dangerouslySetInnerHTML={{
                  __html: descriptionRegex(
                    (
                      (publication?.__typename === "Repost"
                        ? publication?.repostOf
                        : publication
                      )?.metadata as ImageMetadata
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
                      {(publication?.__typename === "Repost"
                        ? publication?.repostOf
                        : publication
                      )?.author?.username?.value?.length > 10
                        ? (publication?.__typename === "Repost"
                            ? publication?.repostOf
                            : publication
                          )?.author?.username?.value?.slice(0, 7) + "..."
                        : (publication?.__typename === "Repost"
                            ? publication?.repostOf
                            : publication
                          )?.author?.username?.value}
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
                      {dict?.pos}
                    </div>
                    <div className="relative flex items-end justify-end text-right break-words text-white/70 font-bit uppercase text-sm">
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
                <div
                  className={`relative mb-0 flex flex-row items-center  gap-2 w-full h-fit justify-end`}
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
                      key={
                        (publication?.__typename === "Repost"
                          ? publication?.repostOf
                          : publication
                        )?.author?.metadata?.picture
                      }
                      src={handleProfilePicture(
                        (publication?.__typename === "Repost"
                          ? publication?.repostOf
                          : publication
                        )?.author?.metadata?.picture
                      )}
                      draggable={false}
                      className="rounded-full"
                      onError={(e) => handleImageError(e)}
                    />
                  </div>
                  {profileHover && (
                    <HoverProfile
                      dict={dict}
                      publication={
                        (publication?.__typename === "Repost"
                          ? publication?.repostOf
                          : publication
                        )?.author
                      }
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
        </>
      )}
    </div>
  );
};

export default ImagePost;
