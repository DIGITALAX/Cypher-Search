import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { InteractBarProps } from "../types/common.types";
import numeral from "numeral";
import { AiOutlineLoading } from "react-icons/ai";
import { setPostBox } from "../../../../redux/reducers/postBoxSlice";
import { Post } from "../../../../graphql/generated";
import { setReactBox } from "../../../../redux/reducers/reactBoxSlice";
import { setFollowCollect } from "../../../../redux/reducers/followCollectSlice";
import { setReportPub } from "../../../../redux/reducers/reportPubSlice";

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
  type,
  hideCollect,
  dispatch,
  router,
  comment,
  main,
  showOthers,
  handleHidePost,
  handleBookmark,
}): JSX.Element => {
  return (
    <div
      className={`relative w-full h-fit rounded-sm border border-frio text-base font-vcr text-mar flex gap-4 p-2 items-center justify-center bg-fuego ${
        col || layoutAmount ? "flex-col" : "flex-row"
      }`}
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
          like,
          hideCollect ? null : simpleCollect,
          comment
            ? () => comment()
            : () => router.push(`/item/pub/${publication?.id}`),
          showOthers ? handleHidePost : null,
          showOthers ? handleBookmark : null,
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

        const loaders = [
          interactionsLoading?.like,
          hideCollect ? null : interactionsLoading?.simpleCollect,
          showOthers ? interactionsLoading?.hide : null,
          showOthers ? interactionsLoading?.bookmark : null,
        ].filter(Boolean);
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
        ].filter(Boolean);
        return (
          <div
            className="relative w-full h-full flex flex-row items-center justify-center gap-2"
            key={indexTwo}
            title={image?.[1]}
          >
            <div
              className={`relative w-fit h-fit flex items-center justify-center ${
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
              onClick={() => {
                if (indexTwo === 0 || image[1] === "Comments") {
                  functions[indexTwo] &&
                    (functions[indexTwo]! as () => Promise<void>)();
                }
                if (showOthers && (index === 3 || index === 4 || index === 5)) {
                  (
                    functions[indexTwo] as (
                      id: string,
                      index: number
                    ) => Promise<void>
                  )(
                    publication?.__typename === "Mirror"
                      ? publication?.mirrorOn?.id
                      : publication?.id,
                    index
                  );
                } else if (indexTwo === 2 && !hideCollect) {
                  const pub =
                    publication?.__typename === "Mirror"
                      ? publication?.mirrorOn
                      : (publication as Post);
                  if (
                    loaders[indexTwo] ||
                    (pub?.openActionModules?.[0]?.__typename !==
                      "SimpleCollectOpenActionSettings" &&
                      pub?.openActionModules?.[0]?.__typename !==
                        "MultirecipientFeeCollectOpenActionSettings")
                  )
                    return;

                  Number(pub?.openActionModules?.[0].amount.value) > 0 ||
                  pub?.openActionModules?.[0].endsAt ||
                  Number(pub.openActionModules?.[0].collectLimit)
                    ? dispatch(
                        setFollowCollect({
                          actionType: "collect",
                          actionCollect: {
                            id: pub?.id,
                            stats: pub.stats.countOpenActions,
                            item: pub?.openActionModules?.[0],
                          },
                        })
                      )
                    : functions[indexTwo] &&
                      (functions[indexTwo]! as any)(publication?.id, type!);
                } else if (indexTwo === 1) {
                  !loaders[indexTwo] &&
                    functions[indexTwo] &&
                    (
                      functions[indexTwo]! as (
                        id: string,
                        main: boolean
                      ) => Promise<void>
                    )(publication?.id, main!);
                } else {
                  !loaders[indexTwo] &&
                    functions[indexTwo] &&
                    (functions[indexTwo]! as (id: string) => Promise<void>)(
                      publication?.id
                    );
                }
              }}
            >
              {loaders[indexTwo] ? (
                <div className="relative w-fit h-fit animate-spin flex items-center justify-center">
                  <AiOutlineLoading size={15} color="white" />
                </div>
              ) : (
                <div
                  className={`relative w-4 h-4 flex items-center justify-center ${
                    functions[indexTwo]
                      ? "cursor-pointer active:scale-95"
                      : "opacity-70"
                  }`}
                >
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/${image[0]}`}
                    draggable={false}
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
                    router.push(`/item/pub/${publication?.id}`);
                  } else {
                    stats?.[indexTwo] &&
                      Number(stats?.[indexTwo]) > 0 &&
                      dispatch(
                        setReactBox({
                          actionOpen: true,
                          actionId: publication?.id,
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
        <div className="absolute w-fit h-fit flex flex-row gap-4 p-2 items-center justify-center bg-black/80 rounded-sm left-2 -top-6">
          {[
            "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
            "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM",
          ].map((image: string, indexTwo: number) => {
            const functions: (
              | ((id: string) => Promise<void>)
              | ((index: number, id: string) => Promise<void>)
              | ((id: string, main: boolean) => Promise<void>)
              | (() => void)
            )[] = [
              mirror,
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
                onClick={() =>
                  !loaders[index] &&
                  (isSingleArgFunction(
                    functions[indexTwo] as
                      | ((id: string) => Promise<void>)
                      | ((index: number, id: string) => Promise<void>)
                      | ((id: string, main: boolean) => Promise<void>)
                  )
                    ? (functions[indexTwo] as (id: string) => Promise<void>)(
                        publication?.id
                      )
                    : router.asPath.includes("item")
                    ? (
                        functions[indexTwo] as (
                          id: string,
                          main: boolean
                        ) => Promise<void>
                      )(publication?.id, main!)
                    : (
                        functions[indexTwo] as (
                          index: number,
                          id: string
                        ) => Promise<void>
                      )(indexTwo, publication?.id))
                }
              >
                {loaders[index] ? (
                  <div className="relative w-fit h-fit animate-spin flex items-center justify-center">
                    <AiOutlineLoading size={15} color="white" />
                  </div>
                ) : (
                  <div
                    className={
                      "relative w-4 h-4 flex items-center justify-center cursor-pointer active:scale-95"
                    }
                  >
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/${image}`}
                      draggable={false}
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
