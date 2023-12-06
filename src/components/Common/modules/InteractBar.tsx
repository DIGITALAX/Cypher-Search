import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import {
  CHROMADIN_OPEN_ACTION,
  COIN_OP_OPEN_ACTION,
  F3M_OPEN_ACTION,
  INFURA_GATEWAY,
  LISTENER_OPEN_ACTION,
} from "../../../../lib/constants";
import { InteractBarProps } from "../types/common.types";
import numeral from "numeral";
import { AiOutlineLoading } from "react-icons/ai";
import { setPostBox } from "../../../../redux/reducers/postBoxSlice";
import { ImageMetadataV3, Post } from "../../../../graphql/generated";
import { setReactBox } from "../../../../redux/reducers/reactBoxSlice";
import { setReportPub } from "../../../../redux/reducers/reportPubSlice";
import collectLogic from "../../../../lib/helpers/collectLogic";
import handleImageError from "../../../../lib/helpers/handleImageError";

type SingleArgFunction = (id: string) => Promise<void>;
type DualArgFunction =
  | ((index: number, id: string) => Promise<void>)
  | ((id: string, main: boolean) => Promise<void>);

function isSingleArgFunction(
  func: SingleArgFunction | DualArgFunction
): func is SingleArgFunction {
  return (func as SingleArgFunction).length === 1;
}
const InteractBar: FunctionComponent<InteractBarProps> = ({
  col,
  layoutAmount,
  mirror,
  like,
  interactionsLoading,
  publication,
  openMirrorChoice,
  setOpenMirrorChoice,
  index,
  simpleCollect,
  hideCollect,
  dispatch,
  router,
  comment,
  main,
  showOthers,
  handleHidePost,
  handleBookmark,
  display,
  gallery,
  creation,
}): JSX.Element => {
  return (
    <div
      className={`relative w-full h-fit rounded-sm border border-frio font-vcr text-mar flex gap-4 p-2 items-center justify-center bg-fuego tablet:flex-nowrap flex-wrap z-10 ${
        col || layoutAmount ? "flex-col" : "flex-row"
      } ${gallery || display ? "text-xxs" : "text-base"}`}
    >
      {(
        [
          ["QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3", "Mirrors"],
          ["QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ", "Likes"],
          hideCollect
            ? null
            : ["QmNomDrWUNrcy2SAVzsKoqd5dPMogeohB8PSuHCg57nyzF", "Acts"],
          ["QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n", "Comments"],
          showOthers
            ? ["QmVqEuvsEfvkEDjg3Mv65nFnM2Dos4dr1M6iC2U1zwrwdC", "Hide Post"]
            : null,
          showOthers
            ? ["QmVXkRB4HCd6gkXmj1cweEh4nVV6oBuKCAWfsKUEJae433", "Bookmark"]
            : null,
          showOthers
            ? ["QmeygnP3UsDZqoUwA9x2aMBAcw6amiWxSPePm5jdsx28D1", "Report Post"]
            : null,
        ].filter(Boolean) as string[][]
      ).map((image: string[], indexTwo: number) => {
        const functions = [
          () =>
            setOpenMirrorChoice((prev) => {
              const choices = [...prev];
              choices[index] = !choices[index];
              return choices;
            }),
          () =>
            display && !gallery
              ? (
                  like as (
                    index: number,
                    id: string,
                    hasReacted: boolean
                  ) => Promise<void>
                )(
                  index,
                  publication?.__typename === "Mirror"
                    ? publication?.mirrorOn?.id
                    : publication?.id,
                  (publication?.__typename === "Mirror"
                    ? publication?.mirrorOn
                    : (publication as Post)
                  )?.operations?.hasReacted
                )
              : main
              ? (
                  like as (
                    id: string,
                    hasReacted: boolean,
                    main?: boolean
                  ) => Promise<void>
                )(
                  publication?.__typename === "Mirror"
                    ? publication?.mirrorOn?.id
                    : publication?.id,
                  (publication?.__typename === "Mirror"
                    ? publication?.mirrorOn
                    : (publication as Post)
                  )?.operations?.hasReacted,
                  main
                )
              : creation
              ? (
                  like as (
                    id: string,
                    hasReacted: boolean,
                    creation?: boolean
                  ) => Promise<void>
                )(
                  publication?.__typename === "Mirror"
                    ? publication?.mirrorOn?.id
                    : publication?.id,
                  (publication?.__typename === "Mirror"
                    ? publication?.mirrorOn
                    : (publication as Post)
                  )?.operations?.hasReacted,
                  creation
                )
              : (like as (id: string, hasReacted: boolean) => Promise<void>)(
                  publication?.__typename === "Mirror"
                    ? publication?.mirrorOn?.id
                    : publication?.id,
                  (publication?.__typename === "Mirror"
                    ? publication?.mirrorOn
                    : (publication as Post)
                  )?.operations?.hasReacted
                ),
          hideCollect
            ? null
            : () =>
                collectLogic(
                  (publication?.__typename === "Mirror"
                    ? publication?.mirrorOn
                    : (publication as Post)) as Post,
                  false,
                  interactionsLoading?.simpleCollect!,
                  dispatch,
                  main!,
                  simpleCollect
                ),
          comment
            ? () => comment()
            : display
            ? () =>
                router.push(
                  `/item/${display}/${(
                    (publication?.__typename === "Mirror"
                      ? publication?.mirrorOn
                      : (publication as Post)
                    )?.metadata as ImageMetadataV3
                  )?.title?.replaceAll(" ", "_")}`
                )
            : (publication?.__typename === "Mirror"
                ? publication?.mirrorOn
                : (publication as Post)
              )?.openActionModules?.[0]?.contract?.address
                ?.toLowerCase()
                ?.includes(CHROMADIN_OPEN_ACTION?.toLowerCase())
            ? () =>
                router.push(
                  `/item/chromadin/${(
                    (publication?.__typename === "Mirror"
                      ? publication?.mirrorOn
                      : (publication as Post)
                    )?.metadata as ImageMetadataV3
                  )?.title?.replaceAll(" ", "_")}`
                )
            : (publication?.__typename === "Mirror"
                ? publication?.mirrorOn
                : (publication as Post)
              )?.openActionModules?.[0]?.contract?.address
                ?.toLowerCase()
                ?.includes(COIN_OP_OPEN_ACTION?.toLowerCase())
            ? () =>
                router.push(
                  `/item/coinop/${(
                    (publication?.__typename === "Mirror"
                      ? publication?.mirrorOn
                      : (publication as Post)
                    )?.metadata as ImageMetadataV3
                  )?.title?.replaceAll(" ", "_")}`
                )
            : (publication?.__typename === "Mirror"
                ? publication?.mirrorOn
                : (publication as Post)
              )?.openActionModules?.[0]?.contract?.address
                ?.toLowerCase()
                ?.includes(LISTENER_OPEN_ACTION?.toLowerCase())
            ? () =>
                router.push(
                  `/item/listener/${(
                    (publication?.__typename === "Mirror"
                      ? publication?.mirrorOn
                      : (publication as Post)
                    )?.metadata as ImageMetadataV3
                  )?.title?.replaceAll(" ", "_")}`
                )
            : (publication?.__typename === "Mirror"
                ? publication?.mirrorOn
                : (publication as Post)
              )?.openActionModules?.[0]?.contract?.address
                ?.toLowerCase()
                ?.includes(F3M_OPEN_ACTION?.toLowerCase())
            ? () =>
                router.push(
                  `/item/f3m/${(
                    (publication?.__typename === "Mirror"
                      ? publication?.mirrorOn
                      : (publication as Post)
                    )?.metadata as ImageMetadataV3
                  )?.title?.replaceAll(" ", "_")}`
                )
            : () => router.push(`/item/pub/${publication?.id}`),
          showOthers
            ? () =>
                handleHidePost!(
                  publication?.__typename === "Mirror"
                    ? publication?.mirrorOn?.id
                    : publication?.id,
                  index
                )
            : null,
          showOthers
            ? () =>
                handleBookmark!(
                  publication?.__typename === "Mirror"
                    ? publication?.mirrorOn?.id
                    : publication?.id,
                  index
                )
            : null,
          showOthers
            ? () =>
                dispatch(
                  setReportPub({
                    actionOpen: true,
                    actionFor: publication?.id,
                  })
                )
            : null,
        ].filter(Boolean);

        const responded = [
          (publication?.__typename === "Mirror"
            ? publication?.mirrorOn
            : (publication as Post)
          )?.operations?.hasMirrored ||
            (publication?.__typename === "Mirror"
              ? publication?.mirrorOn
              : (publication as Post)
            )?.operations?.hasQuoted,
          (publication?.__typename === "Mirror"
            ? publication?.mirrorOn
            : (publication as Post)
          )?.operations?.hasReacted,
          hideCollect
            ? null
            : (publication?.__typename === "Mirror"
                ? publication?.mirrorOn
                : (publication as Post)
              )?.operations?.hasActed?.value,
          false,
          false,
          (publication?.__typename === "Mirror"
            ? publication?.mirrorOn
            : (publication as Post)
          )?.operations?.hasBookmarked,
          (publication?.__typename === "Mirror"
            ? publication?.mirrorOn
            : (publication as Post)
          )?.operations?.hasReported,
        ]?.filter((item) => item !== null && item !== undefined);

        const loaders = [
          false,
          interactionsLoading?.like,
          hideCollect ? null : interactionsLoading?.simpleCollect,
          showOthers ? interactionsLoading?.hide : null,
          showOthers ? interactionsLoading?.bookmark : null,
        ]?.filter((item) => item !== null && item !== undefined);
        const stats = [
          (publication?.__typename === "Mirror"
            ? publication.mirrorOn
            : (publication as Post)
          )?.stats?.mirrors! +
            (publication?.__typename === "Mirror"
              ? publication.mirrorOn
              : (publication as Post)
            )?.stats?.quotes!,
          (publication?.__typename === "Mirror"
            ? publication.mirrorOn
            : (publication as Post)
          )?.stats?.reactions,
          hideCollect
            ? null
            : (publication?.__typename === "Mirror"
                ? publication.mirrorOn
                : (publication as Post)
              )?.stats?.countOpenActions,
          (publication?.__typename === "Mirror"
            ? publication.mirrorOn
            : (publication as Post)
          )?.stats?.comments,
        ].filter((item) => item !== undefined && item !== null);
        return (
          <div
            className="relative w-full h-full flex flex-row items-center justify-center gap-2"
            key={indexTwo}
            title={image?.[1]}
          >
            <div
              className={`relative w-fit h-fit flex items-center justify-center ${
                responded?.[indexTwo] && "mix-blend-hard-light hue-rotate-60"
              } ${
                (publication?.__typename === "Mirror"
                  ? publication?.mirrorOn
                  : (publication as Post)
                )?.openActionModules?.[0]?.__typename ===
                  "SimpleCollectOpenActionSettings" ||
                (publication?.__typename === "Mirror"
                  ? publication?.mirrorOn
                  : (publication as Post)
                )?.openActionModules?.[0]?.__typename ===
                  "MultirecipientFeeCollectOpenActionSettings"
                  ? "cursor-pointer active:scale-95"
                  : "opacity-70"
              }`}
              onClick={async () =>
                functions[indexTwo] && (functions[indexTwo] as () => void)?.()
              }
            >
              {loaders[indexTwo] ? (
                <div className="relative w-fit h-fit animate-spin flex items-center justify-center">
                  <AiOutlineLoading
                    size={gallery || display ? 12 : 15}
                    color="white"
                  />
                </div>
              ) : (
                <div
                  className={`relative ${
                    gallery || display ? "w-3 h-3" : "w-4 h-4"
                  } flex items-center justify-center ${
                    functions[indexTwo]
                      ? "cursor-pointer active:scale-95"
                      : "opacity-70"
                  }`}
                >
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/${image[0]}`}
                    draggable={false}
                    onError={(e) => handleImageError(e)}
                  />
                </div>
              )}
            </div>
            {((showOthers &&
              indexTwo !== 3 &&
              indexTwo !== 4 &&
              indexTwo !== 5) ||
              !showOthers) && (
              <div
                className={`relative w-fit h-fit flex items-center justify-center text-center ${
                  (Number(stats[indexTwo]) > 0 || image[1] === "Comments") &&
                  "cursor-pointer active:scale-95"
                }`}
                onClick={() => {
                  if (image[1] === "Comments") {
                    (publication?.__typename === "Mirror"
                      ? publication?.mirrorOn
                      : (publication as Post)
                    )?.openActionModules?.[0]?.contract?.address
                      ?.toLowerCase()
                      ?.includes(CHROMADIN_OPEN_ACTION?.toLowerCase())
                      ? router.push(
                          `/item/chromadin/${(
                            (publication?.__typename === "Mirror"
                              ? publication?.mirrorOn
                              : (publication as Post)
                            )?.metadata as ImageMetadataV3
                          )?.title?.replaceAll(" ", "_")}`
                        )
                      : (publication?.__typename === "Mirror"
                          ? publication?.mirrorOn
                          : (publication as Post)
                        )?.openActionModules?.[0]?.contract?.address
                          ?.toLowerCase()
                          ?.includes(COIN_OP_OPEN_ACTION?.toLowerCase())
                      ? router.push(
                          `/item/coinop/${(
                            (publication?.__typename === "Mirror"
                              ? publication?.mirrorOn
                              : (publication as Post)
                            )?.metadata as ImageMetadataV3
                          )?.title?.replaceAll(" ", "_")}`
                        )
                      : (publication?.__typename === "Mirror"
                          ? publication?.mirrorOn
                          : (publication as Post)
                        )?.openActionModules?.[0]?.contract?.address
                          ?.toLowerCase()
                          ?.includes(LISTENER_OPEN_ACTION?.toLowerCase())
                      ? router.push(
                          `/item/listener/${(
                            (publication?.__typename === "Mirror"
                              ? publication?.mirrorOn
                              : (publication as Post)
                            )?.metadata as ImageMetadataV3
                          )?.title?.replaceAll(" ", "_")}`
                        )
                      : (publication?.__typename === "Mirror"
                          ? publication?.mirrorOn
                          : (publication as Post)
                        )?.openActionModules?.[0]?.contract?.address
                          ?.toLowerCase()
                          ?.includes(F3M_OPEN_ACTION?.toLowerCase())
                      ? router.push(
                          `/item/f3m/${(
                            (publication?.__typename === "Mirror"
                              ? publication?.mirrorOn
                              : (publication as Post)
                            )?.metadata as ImageMetadataV3
                          )?.title?.replaceAll(" ", "_")}`
                        )
                      : router.push(`/item/pub/${publication?.id}`);
                  } else {
                    stats?.[indexTwo] &&
                      Number(stats?.[indexTwo]) > 0 &&
                      dispatch(
                        setReactBox({
                          actionOpen: true,
                          actionId: (publication?.__typename === "Mirror"
                            ? publication?.mirrorOn
                            : (publication as Post)
                          )?.id,
                          actionType: image[1],
                        })
                      );
                  }
                }}
              >
                {numeral(stats[indexTwo]).format("0a")}
              </div>
            )}
          </div>
        );
      })}
      {openMirrorChoice?.[index] && (
        <div
          className={`absolute w-fit h-fit flex flex-row gap-4 p-2 items-center justify-center bg-black/80 rounded-sm -top-6 ${
            col || layoutAmount ? "left-auto" : "left-auto tablet:left-2"
          }`}
        >
          {[
            "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
            "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM",
          ].map((image: string, indexTwo: number) => {
            const functions: ((() => Promise<void>) | (() => void))[] = [
              isSingleArgFunction(
                mirror as
                  | ((id: string) => Promise<void>)
                  | ((index: number, id: string) => Promise<void>)
                  | ((id: string, main: boolean) => Promise<void>)
              )
                ? () =>
                    (mirror as (id: string) => Promise<void>)(
                      publication?.__typename === "Mirror"
                        ? publication?.mirrorOn?.id
                        : publication?.id
                    )
                : display
                ? () =>
                    (mirror as (index: number, id: string) => Promise<void>)(
                      index,
                      publication?.__typename === "Mirror"
                        ? publication?.mirrorOn?.id
                        : publication?.id
                    )
                : creation
                ? () =>
                    (
                      mirror as (
                        id: string,
                        creation?: boolean,
                        mirror?: string
                      ) => Promise<void>
                    )(
                      publication?.__typename === "Mirror"
                        ? publication?.mirrorOn?.id
                        : publication?.id,
                      creation,
                      publication?.__typename === "Mirror"
                        ? publication?.id
                        : undefined
                    )
                : () =>
                    (
                      mirror as (
                        id: string,
                        main: boolean,
                        mirror?: string
                      ) => Promise<void>
                    )(
                      publication?.id,
                      main!,
                      publication?.__typename === "Mirror"
                        ? publication?.id
                        : undefined
                    ),
              () =>
                dispatch(
                  setPostBox({
                    actionOpen: true,
                    actionQuote: publication,
                  })
                ),
            ];
            const loaders = [interactionsLoading?.mirror];
            return (
              <div
                key={indexTwo}
                className="relative w-fit h-fit flex cursor-pointer items-center justify-center active:scale-95 hover:opacity-70"
                onClick={() => !loaders[indexTwo] && functions[indexTwo]()}
              >
                {loaders[indexTwo] ? (
                  <div className="relative w-fit h-fit animate-spin flex items-center justify-center">
                    <AiOutlineLoading
                      size={gallery || display ? 12 : 15}
                      color="white"
                    />
                  </div>
                ) : (
                  <div
                    className={`relative ${
                      gallery || display ? "w-3 h-3" : "w-4 h-4"
                    } flex items-center justify-center cursor-pointer active:scale-95`}
                  >
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/${image}`}
                      draggable={false}
                      onError={(e) => handleImageError(e)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InteractBar;
