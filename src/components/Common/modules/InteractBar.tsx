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

type SingleArgFunction = (id: string) => Promise<void>;
type DualArgFunction = (index: number, id: string) => Promise<void>;

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
}): JSX.Element => {
  return (
    <div
      className={`relative w-full h-fit rounded-sm border border-frio text-base font-vcr text-mar flex gap-4 p-2 items-center justify-center bg-fuego ${
        col || layoutAmount ? "flex-col" : "flex-row"
      }`}
    >
      {(hideCollect
        ? [
            ["QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3", "Mirrors"],
            ["QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ", "Likes"],
            ["QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n", "Comments"],
          ]
        : [
            ["QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3", "Mirrors"],
            ["QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ", "Likes"],
            ["QmNomDrWUNrcy2SAVzsKoqd5dPMogeohB8PSuHCg57nyzF", "Acts"],
            ["QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n", "Comments"],
          ]
      ).map((image: string[], indexTwo: number) => {
        const functions: any = hideCollect
          ? [
              () =>
                setOpenMirrorChoice((prev) => {
                  const choices = [...prev];
                  choices[index] = !choices[index];
                  return choices;
                }),
              like,
              () => router.push(`/item/pub/${publication?.id}`),
            ]
          : [
              () =>
                setOpenMirrorChoice((prev) => {
                  const choices = [...prev];
                  choices[index] = !choices[index];
                  return choices;
                }),
              like,
              simpleCollect,
              () => router.push(`/item/pub/${publication?.id}`),
            ];
        const loaders = hideCollect
          ? [interactionsLoading?.like]
          : [interactionsLoading?.like, interactionsLoading?.simpleCollect];
        const stats = hideCollect
          ? [
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
              (publication?.__typename === "Mirror"
                ? publication.mirrorOn
                : (publication as Post)
              )?.stats?.comments,
            ]
          : [
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
              (publication?.__typename === "Mirror"
                ? publication.mirrorOn
                : (publication as Post)
              )?.stats?.countOpenActions,
              (publication?.__typename === "Mirror"
                ? publication.mirrorOn
                : (publication as Post)
              )?.stats?.comments,
            ];
        return (
          <div
            className="relative w-full h-full flex flex-row items-center justify-center gap-2"
            key={indexTwo}
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
                  functions[indexTwo] && functions[indexTwo]!();
                } else if (indexTwo === 2) {
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
                      functions[indexTwo]!(publication?.id, type);
                } else {
                  !loaders[indexTwo] &&
                    functions[indexTwo] &&
                    functions[indexTwo]!(publication?.id);
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
            <div
              className={`relative w-fit h-fit flex items-center justify-center text-center ${
                (stats[indexTwo] > 0 || image[1] === "Comments") &&
                "cursor-pointer active:scale-95"
              }`}
              onClick={() => {
                if (image[1] === "Comments") {
                  router.push(`/item/pub/${publication?.id}`);
                } else {
                  stats[indexTwo] > 0 &&
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
                  )
                    ? (functions[indexTwo] as (id: string) => Promise<void>)(
                        publication?.id
                      )
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
