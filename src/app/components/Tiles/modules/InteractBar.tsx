import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";
import numeral from "numeral";
import { AiOutlineLoading } from "react-icons/ai";
import { ModalContext } from "@/app/providers";
import { InteractBarProps } from "../types/tiles.types";
import useInteractions from "../hooks/useInteractions";
import { usePathname, useRouter } from "next/navigation";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { ImageMetadata } from "@lens-protocol/client";
import checkActions from "@/app/lib/helpers/checkActions";
import { getLocaleFromPath } from "@/app/lib/helpers/getLocalPath";

const InteractBar: FunctionComponent<InteractBarProps> = ({
  dict,
  publication,
  col,
  gallery,
  display,
  hideCollect,
  showOthers,
  comment,
  item,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const router = useRouter();
  const path = usePathname();
  const {
    openMirrorChoice,
    setOpenMirrorChoice,
    interactionsLoading,
    interactions,
    like,
    collect,
    handleBookmark,
    handleHidePost,
    mirror,
  } = useInteractions(dict, publication);

  return (
    <div
      className={`relative w-full h-fit rounded-sm border border-frio font-vcr text-mar flex gap-4 p-2 items-center justify-center bg-fuego tablet:flex-nowrap flex-wrap z-10 ${
        col || !item ? "flex-col" : "flex-row"
      } ${gallery || display ? "text-xxs" : "text-base"}`}
    >
      {[
        {
          image: "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
          title: { en: "Mirrors", es: "Republicaciones" },
          loader: interactionsLoading?.mirror,
          stats: interactions?.reposts! + interactions?.quotes! || 0,
          responded: interactions?.hasReposted || interactions?.hasQuoted,
          function: () => setOpenMirrorChoice(!openMirrorChoice),
        },
        ,
        {
          image: "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ",
          title: { es: "Me Gusta", en: "Likes" },
          loader: interactionsLoading?.like,
          stats: interactions?.upvotes,
          responded: interactions?.hasUpVoted,
          function: () => like(),
        },
        hideCollect
          ? null
          : {
              image: "QmNomDrWUNrcy2SAVzsKoqd5dPMogeohB8PSuHCg57nyzF",
              title: { es: "Coleccionados", en: "Collects" },
              loader: interactionsLoading?.collect,
              stats: interactions?.collects,
              responded: interactions?.hasSimpleCollected,
              function:
                hideCollect ||
                publication?.actions?.[0]?.__typename !== "SimpleCollectAction"
                  ? null
                  : () => collect(),
            },

        {
          image: "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n",
          title: { es: "Comentarios", en: "Comments" },
          loader: false,
          stats: publication?.stats?.comments,
          responded: publication?.operations?.hasCommented?.optimistic,
          function: comment
            ? () => comment()
            : display
            ? () => {
                context?.setFiltersOpen({ value: false, allow: false });
                router.push(
                  `/item/${display}/${(
                    publication?.metadata as ImageMetadata
                  )?.title?.replaceAll(" ", "_")}`
                );
              }
            : () => {
                context?.setFiltersOpen({ value: false, allow: false });
                checkActions(publication, router);
              },
        },

        showOthers
          ? {
              image: "QmVqEuvsEfvkEDjg3Mv65nFnM2Dos4dr1M6iC2U1zwrwdC",
              title: { es: "Ocultar Pub", en: "Hide Post" },
              loader: false,
              stats: 0,
              responded: false,
              function: showOthers ? () => handleHidePost!() : null,
            }
          : null,
        showOthers
          ? {
              image: "QmVXkRB4HCd6gkXmj1cweEh4nVV6oBuKCAWfsKUEJae433",
              title: { es: "Marcar", en: "Bookmark" },
              loader: interactionsLoading?.bookmark,
              stats: interactions?.bookmarks,
              responded: interactions?.hasBookmarked,
              function: showOthers ? () => handleBookmark!() : null,
            }
          : null,
        showOthers
          ? {
              image: "QmeygnP3UsDZqoUwA9x2aMBAcw6amiWxSPePm5jdsx28D1",
              title: { es: "Reportear Pub", en: "Report Post" },
              loader: false,
              stats: 0,
              responded: false,
              function: showOthers
                ? () => context?.setReportPub(publication?.id)
                : null,
            }
          : null,
      ]
        ?.filter(Boolean)
        .map((item, index: number) => {
          return (
            <div
              className="relative w-full h-full flex flex-row items-center justify-center gap-2"
              key={index}
              title={item?.title?.[getLocaleFromPath(path)]}
            >
              <div
                className={`relative w-fit h-fit flex items-center justify-center ${
                  item?.responded && "mix-blend-hard-light hue-rotate-60"
                } ${
                  publication?.actions?.[0]?.__typename ===
                  "SimpleCollectAction"
                    ? "cursor-pointer active:scale-95"
                    : "opacity-70"
                }`}
                onClick={async () => item?.function && item?.function()}
              >
                {item?.loader ? (
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
                      item?.function
                        ? "cursor-pointer active:scale-95"
                        : "opacity-70"
                    }`}
                  >
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/${item?.image}`}
                      draggable={false}
                      onError={(e) => handleImageError(e)}
                    />
                  </div>
                )}
              </div>
              {((showOthers && index !== 3 && index !== 4 && index !== 5) ||
                !showOthers) && (
                <div
                  className={`relative w-fit h-fit flex items-center justify-center text-center ${
                    (Number(item?.stats) > 0 ||
                      item?.title?.en === "Comments") &&
                    "cursor-pointer active:scale-95"
                  }`}
                  onClick={() => {
                    if (
                      item?.title?.en === "Comments" &&
                      path?.includes("/item/")
                    ) {
                      context?.setFiltersOpen({ value: false, allow: false });
                      checkActions(publication, router);
                    } else {
                      item?.stats &&
                        Number(item?.stats) > 0 &&
                        context?.setReactBox({
                          id: publication?.id,
                          type: item?.title?.en,
                        });
                    }
                  }}
                >
                  {numeral(item?.stats).format("0a")}
                </div>
              )}
            </div>
          );
        })}
      {openMirrorChoice && (
        <div
          className={`absolute w-fit h-fit flex flex-row gap-4 p-2 items-center justify-center bg-black/80 rounded-sm -top-6 ${
            col || context?.layoutSwitch
              ? "left-auto"
              : "left-auto tablet:left-2"
          }`}
        >
          {[
            "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
            "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM",
          ].map((image: string, indexTwo: number) => {
            const functions: ((() => Promise<void>) | (() => void))[] = [
              () => mirror(),
              () =>
                context?.setPostBox({
                  open: true,
                  quote: publication,
                }),
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
