import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import {
  ImageMetadataV3,
  Post,
  PublicationMetadataMediaImage,
} from "../../../../graphql/generated";
import numeral from "numeral";
import { PostBarProps } from "../types/autograph.types";
import HoverProfile from "@/components/Common/modules/HoverProfile";
import { setReportPub } from "../../../../redux/reducers/reportPubSlice";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import { setReactBox } from "../../../../redux/reducers/reactBoxSlice";
import { setPostBox } from "../../../../redux/reducers/postBoxSlice";
import { setFollowCollect } from "../../../../redux/reducers/followCollectSlice";

const PostBar: FunctionComponent<PostBarProps> = ({
  index,
  like,
  mirror,
  dispatch,
  simpleCollect,
  interactionsLoading,
  item,
  openMirrorChoice,
  setOpenMirrorChoice,
  openMoreOptions,
  setOpenMoreOptions,
  router,
  profileHovers,
  setProfileHovers,
  followLoading,
  followProfile,
  unfollowProfile,
  handleHidePost,
  handleBookmark,
  disabled,
  commentsOpen,
  setCommentsOpen,
  main,
}): JSX.Element => {
  const profilePicture = createProfilePicture(item?.by?.metadata?.picture);
  return (
    <div className="relative w-full justify-between flex flex-row items-center gap-2">
      <div className="relative w-fit h-fit flex flex-row items-center gap-1.5 justify-center">
        {[
          ["QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3", "Mirrors"],
          ["QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ", "Likes"],
          ["QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n", "Comments"],
        ].map((image: string[], indexTwo: number) => {
          const functions = [
            () =>
              setOpenMirrorChoice!((prev) => {
                const choices = [...prev!];
                choices[index] = !choices[index];
                return choices;
              }),

            like,
            () =>
              setCommentsOpen((prev) => {
                const arr = [...prev];
                arr[index] = !commentsOpen[index];
                return arr;
              }),
          ];

          const loaders = [interactionsLoading?.like];

          const stats = [
            item?.__typename === "Mirror"
              ? item?.mirrorOn?.stats?.reactions
              : (item as Post)?.stats?.reactions,
            item?.__typename === "Mirror"
              ? item?.mirrorOn?.stats?.comments
              : (item as Post)?.stats?.comments,
            item?.__typename === "Mirror"
              ? item?.mirrorOn?.stats?.mirrors! + item?.mirrorOn?.stats?.quotes!
              : (item as Post)?.stats?.mirrors! +
                (item as Post)?.stats?.quotes!,
          ];

          return (
            <div
              className="relative w-full h-full flex flex-row items-center justify-center gap-2 text-white font-earl"
              key={indexTwo}
            >
              <div
                className="relative w-fit h-fit flex cursor-pointer items-center justify-center active:scale-95"
                onClick={() => {
                  if (disabled) {
                    dispatch(
                      setReactBox({
                        actionOpen: false,
                      })
                    );
                    router.push(`/item/pub/${item?.id}`);
                  } else {
                    functions[indexTwo] &&
                      (main
                        ? functions[indexTwo]!(item?.id, main)
                        : (
                            functions[indexTwo]! as (
                              id: string
                            ) => Promise<void>
                          )(item?.id));
                  }
                }}
              >
                {loaders[index] ? (
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
                  if (disabled) {
                    dispatch(
                      setReactBox({
                        actionOpen: false,
                      })
                    );
                    router.push(`/item/pub/${item?.id}`);
                  } else {
                    (stats[indexTwo] > 0 || image[1] === "Comments") &&
                      dispatch(
                        setReactBox({
                          actionOpen: true,
                          actionId: item?.id,
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
      </div>
      {openMirrorChoice?.[index] && (
        <div className="absolute w-fit h-fit flex flex-row gap-4 p-2 items-center justify-center bg-lirio/80 rounded-sm left-2 -top-8 border border-white">
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
              mirror!,
              () =>
                dispatch(
                  setPostBox({
                    actionOpen: true,
                    actionQuote: item,
                  })
                ),
            ];
            const loaders = [interactionsLoading?.mirror];
            return (
              <div
                key={indexTwo}
                className="relative w-fit h-fit flex cursor-pointer items-center justify-center active:scale-95 hover:opacity-70"
                onClick={() => {
                  if (disabled) {
                    dispatch(
                      setReactBox({
                        actionOpen: false,
                      })
                    );

                    router.push(`/item/pub/${item?.id}`);
                  } else {
                    !loaders[index] &&
                      (main
                        ? (
                            functions[indexTwo] as (
                              id: string,
                              main: boolean
                            ) => Promise<void>
                          )(item?.id, main)
                        : (
                            functions[indexTwo] as (id: string) => Promise<void>
                          )(item?.id));
                  }
                }}
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
      <div className="relative w-fit h-fit flex flex-row gap-2">
        <div
          className="relative w-14 h-5 items-center justify-center flex cursor-pointer active:scale-95"
          onClick={() => {
            if (disabled) return;
            setOpenMoreOptions!((prev) => {
              const arr = [...prev!];
              arr[index] = !arr[index];
              return arr;
            });
          }}
        >
          <Image
            layout="fill"
            draggable={false}
            src={`${INFURA_GATEWAY}/ipfs/${
              index % 2 == 0 ||
              (item?.__typename === "Mirror" ? item.mirrorOn : (item as Post))
                .metadata.__typename !== "ImageMetadataV3"
                ? "QmNpvEkdHfhFViALNCedoF3WLTngxXG67XnPYaeaFCsA49"
                : "QmTQYdbL5iJkzMAwHh52SWvzopssTEEV5dRaENNrJgmesH"
            }`}
          />
        </div>
        <div
          className="relative flex items-center justify-center rounded-full w-5 h-5 cursor-pointer"
          id="pfp"
          onMouseEnter={() => {
            if (disabled) return;
            setProfileHovers!((prev) => {
              const updatedArray = [...prev!];
              updatedArray[index] = true;
              return updatedArray;
            });
          }}
        >
          {profilePicture && (
            <Image layout="fill" src={profilePicture} draggable={false} />
          )}
        </div>
        <div
          className={`relative w-5 h-5 items-center justify-center flex ${
            (item?.__typename === "Mirror" ? item?.mirrorOn : (item as Post))
              ?.openActionModules?.[0]?.__typename ===
              "SimpleCollectOpenActionSettings" ||
            (item?.__typename === "Mirror" ? item?.mirrorOn : (item as Post))
              ?.openActionModules?.[0]?.__typename ===
              "MultirecipientFeeCollectOpenActionSettings"
              ? "cursor-pointer active:scale-95"
              : "opacity-70"
          } ${interactionsLoading?.simpleCollect && "animate-spin"}`}
          onClick={() => {
            const pub =
              item?.__typename === "Mirror" ? item?.mirrorOn : (item as Post);
            if (
              disabled ||
              interactionsLoading?.simpleCollect ||
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
              : main
              ? simpleCollect!(
                  pub?.id,
                  pub?.openActionModules?.[0]?.__typename,
                  main
                )
              : (simpleCollect! as (id: string, type: string) => Promise<void>)(
                  pub?.id,
                  pub?.openActionModules?.[0]?.__typename
                );
          }}
        >
          {interactionsLoading?.simpleCollect ? (
            <AiOutlineLoading size={15} color="white" />
          ) : (
            <Image
              layout="fill"
              draggable={false}
              src={`${INFURA_GATEWAY}/ipfs/QmZ4v5pzdnCBeyKnS9VrjZiEAbUpAVy8ECArNcpxBt6Tw4`}
            />
          )}
        </div>
        {profileHovers?.[index] && (
          <HoverProfile
            followLoading={followLoading!}
            followProfile={followProfile!}
            unfollowProfile={unfollowProfile!}
            router={router}
            publication={item?.by}
            index={index}
            setProfileHovers={setProfileHovers!}
            feed
            dispatch={dispatch}
          />
        )}
      </div>
      {openMoreOptions?.[index] && (
        <div className="absolute w-fit h-fit flex flex-row gap-4 p-1 items-center justify-center bg-lirio/80 rounded-sm right-2 -top-10 border border-white">
          {(
            [
              ["Hide Post", "QmUcaryzjgiLn34eXTPAZxmtfzWgTsUSeaim3yHnsmcnxx"],
              ["Bookmark", "QmUHAMRX6fenDM6Eyt36N8839b8xbiMDkN9Wb8DXKY2aZC"],
              ["Report Post", "QmRNwdrGa977LxHPbBv8KEAHBEEidKUiPtn4r6SmxDZHkd"],
              router.asPath.includes("item") || main
                ? null
                : [
                    "View Post",
                    "QmRkAoLMAh2hxZfh5WvaxuxRUMhs285umdJWuvLa5wt6Ht",
                  ],
            ].filter(Boolean) as string[][]
          ).map((image: string[], indexTwo: number) => {
            const meta =
              item?.__typename == "Mirror" ? item?.mirrorOn : (item as Post);
            const functions = [
              handleHidePost,
              handleBookmark,
              () =>
                dispatch(
                  setReportPub({
                    actionOpen: true,
                    actionFor: item?.id,
                  })
                ),
              () =>
                meta?.metadata?.tags?.includes(
                  "MintedWithLoveOnCypherChromadin"
                )
                  ? router.push(
                      `/item/chromadin/${
                        (meta?.metadata as ImageMetadataV3)?.title
                      }`
                    )
                  : meta?.metadata?.tags?.includes(
                      "MintedWithLoveOnCypherCoinOp"
                    )
                  ? router.push(
                      `/item/coinop/${
                        (meta?.metadata as ImageMetadataV3)?.title
                      }`
                    )
                  : meta?.metadata?.tags?.includes(
                      "MintedWithLoveOnCypherListener"
                    )
                  ? router.push(
                      `/item/listener/${
                        (meta?.metadata as ImageMetadataV3)?.title
                      }`
                    )
                  : router.push(`/item/pub/${item?.id}`),
            ];

            const loaders = [
              interactionsLoading?.hide,
              interactionsLoading?.bookmark,
            ];
            return (
              <div
                key={indexTwo}
                className="relative w-fit h-fit flex cursor-pointer items-center justify-center active:scale-95 hover:opacity-70"
                title={image[0]}
                onClick={() => {
                  if (disabled) return;
                  if (indexTwo !== 3 && indexTwo !== 2) {
                    !loaders[index] && main
                      ? (
                          functions[indexTwo] as (
                            id: string,
                            index: number,
                            main: boolean
                          ) => Promise<void>
                        )(item?.id, index, main)
                      : (
                          functions[indexTwo] as (
                            id: string,
                            index: number
                          ) => Promise<void>
                        )(item?.id, index);
                  } else {
                    (functions[indexTwo] as () => void)();
                  }
                }}
              >
                {loaders[index] ? (
                  <div className="relative w-fit h-fit animate-spin flex items-center justify-center">
                    <AiOutlineLoading size={15} color="white" />
                  </div>
                ) : (
                  <div
                    className={
                      "relative w-5 h-5 flex items-center justify-center cursor-pointer active:scale-95"
                    }
                  >
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/${image[1]}`}
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

export default PostBar;
