import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { TextPostProps } from "../../types/tiles.types";
import InteractBar from "@/components/Common/modules/InteractBar";
import HoverProfile from "@/components/Common/modules/HoverProfile";
import { Post } from "../../../../../graphql/generated";
import moment from "moment";
import descriptionRegex from "../../../../../lib/helpers/descriptionRegex";
import createProfilePicture from "../../../../../lib/helpers/createProfilePicture";
import handleImageError from "../../../../../lib/helpers/handleImageError";

const TextPost: FunctionComponent<TextPostProps> = ({
  layoutAmount,
  router,
  publication,
  mirror,
  like,
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
      className="relative w-full h-fit flex items-end justify-center flex flex-row rounded-sm border border-sol p-4 gap-4"
      id={publication?.id}
    >
      <div
        className="relative w-100 h-100 rounded-sm border border-mosgu bg-fuego p-2 font-bit text-nuba text-sm text-left break-words flex justify-center items-start overflow-y-scroll whitespace-preline"
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
      <div className="relative w-fit h-fit flex flex-col gap-5 items-end justify-end">
        <div className="relative flex flex-col w-fit h-fit gap-2 items-end justify-center">
          <InteractBar
            mirror={mirror}
            router={router}
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
            simpleCollect={
              (
                publication?.__typename === "Mirror"
                  ? !publication?.mirrorOn.operations?.actedOn &&
                    (publication?.mirrorOn?.openActionModules?.[0]
                      ?.__typename === "SimpleCollectOpenActionSettings" ||
                      publication?.mirrorOn?.openActionModules?.[0]
                        ?.__typename ===
                        "MultirecipientFeeCollectOpenActionSettings")
                  : !(publication as Post)?.operations?.actedOn &&
                    ((publication as Post)?.openActionModules?.[0]
                      ?.__typename !== "SimpleCollectOpenActionSettings" ||
                      (publication as Post)?.openActionModules?.[0]
                        ?.__typename ===
                        "MultirecipientFeeCollectOpenActionSettings")
              )
                ? simpleCollect
                : undefined
            }
            type={
              publication?.__typename === "Mirror"
                ? publication?.mirrorOn?.openActionModules?.[0]?.__typename
                : (publication as Post)?.openActionModules?.[0]?.__typename
            }
          />
          <div className="relative w-full h-fit flex flex-col items-center justify-start justify-between p-1 gap-3">
            <div className="relative w-full h-fit items-end justify-start flex flex-col gap-3">
              <div className="relative w-full h-fit items-end justify-start flex flex-col">
                <div className="relative flex items-center justify-center text-right break-words text-white font-bit uppercase text-base">
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
                  posted
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
                onClick={() => router.push(`/item/pub/${publication?.id}`)}
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
