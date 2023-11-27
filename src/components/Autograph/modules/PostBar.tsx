import { FunctionComponent } from "react";
import {
  CHROMADIN_OPEN_ACTION,
  COIN_OP_OPEN_ACTION,
  INFURA_GATEWAY,
  LISTENER_OPEN_ACTION,
} from "../../../../lib/constants";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import {
  ImageMetadataV3,
  Post,
  UnknownOpenActionModuleSettings,
} from "../../../../graphql/generated";
import numeral from "numeral";
import { PostBarProps } from "../types/autograph.types";
import HoverProfile from "@/components/Common/modules/HoverProfile";
import { setReportPub } from "../../../../redux/reducers/reportPubSlice";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import { setReactBox } from "../../../../redux/reducers/reactBoxSlice";
import { setPostBox } from "../../../../redux/reducers/postBoxSlice";
import collectLogic from "../../../../lib/helpers/collectLogic";
import handleImageError from "../../../../lib/helpers/handleImageError";
import decodeReturnedData from "../../../../lib/helpers/decodeReturned";
import { setCartItems } from "../../../../redux/reducers/cartItemsSlice";
import { setCypherStorageCart } from "../../../../lib/utils";
import { setCartAnim } from "../../../../redux/reducers/cartAnimSlice";

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
  lensConnected,
  cartItems,
}): JSX.Element => {
  const profilePicture = createProfilePicture(item?.by?.metadata?.picture);
  return (
    <div className="relative w-full justify-between flex flex-col sm:flex-row items-between sm:items-center gap-2">
      <div className="relative w-fit h-fit flex flex-row items-start sm:items-center gap-2 justify-center">
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
            main
              ? null
              : () =>
                  setCommentsOpen((prev) => {
                    const arr = [...prev];
                    arr[index] = !commentsOpen[index];
                    return arr;
                  }),
          ];

          const loaders = [interactionsLoading?.like];

          const stats = [
            item?.__typename === "Mirror"
              ? item?.mirrorOn?.stats?.mirrors! + item?.mirrorOn?.stats?.quotes!
              : (item as Post)?.stats?.mirrors! +
                (item as Post)?.stats?.quotes!,
            item?.__typename === "Mirror"
              ? item?.mirrorOn?.stats?.reactions
              : (item as Post)?.stats?.reactions,
            item?.__typename === "Mirror"
              ? item?.mirrorOn?.stats?.comments
              : (item as Post)?.stats?.comments,
          ];

          const responded = [
            (item?.__typename === "Mirror" ? item?.mirrorOn : (item as Post))
              ?.operations?.hasMirrored ||
              (item?.__typename === "Mirror" ? item?.mirrorOn : (item as Post))
                ?.operations?.hasQuoted,
            (item?.__typename === "Mirror" ? item?.mirrorOn : (item as Post))
              ?.operations?.hasReacted,
          ];

          return (
            <div
              className={`relative w-full h-full flex flex-row items-center justify-center gap-1 font-earl ${
                (item?.__typename === "Mirror"
                  ? item?.mirrorOn
                  : (item as Post)
                )?.isEncrypted
                  ? "text-black"
                  : "text-white"
              }`}
              key={indexTwo}
            >
              <div
                className={`relative w-fit h-fit flex cursor-pointer items-center justify-center active:scale-95 ${
                  responded?.[indexTwo] && "mix-blend-hard-light hue-rotate-60"
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
                    if (functions[indexTwo]) {
                      if (image[1] !== "Likes") {
                        main
                          ? functions[indexTwo]!(item?.id, main)
                          : (
                              functions[indexTwo]! as (
                                id: string
                              ) => Promise<void>
                            )(item?.id);
                      } else {
                        main
                          ? (functions[indexTwo] as (
                              id: string,
                              hasReacted: boolean,
                              main: boolean
                            ) => Promise<void>)!(
                              item?.id,
                              (item?.__typename === "Mirror"
                                ? item?.mirrorOn
                                : (item as Post)
                              )?.operations?.hasReacted,
                              main
                            )
                          : (
                              functions[indexTwo]! as (
                                id: string,
                                hasReacted: boolean
                              ) => Promise<void>
                            )(
                              item?.id,
                              (item?.__typename === "Mirror"
                                ? item?.mirrorOn
                                : (item as Post)
                              )?.operations?.hasReacted
                            );
                      }
                    }
                  }
                }}
              >
                {loaders[index] && image[1] === "Likes" ? (
                  <div className="relative w-fit h-fit animate-spin flex items-center justify-center">
                    <AiOutlineLoading size={15} color="white" />
                  </div>
                ) : (
                  <div
                    className={`relative w-3.5 h-3.5 flex items-center justify-center ${
                      functions[indexTwo]
                        ? "cursor-pointer active:scale-95"
                        : "opacity-70"
                    } `}
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
              <div
                className={`relative w-fit h-fit flex items-center justify-center text-center text-sm ${
                  (stats[indexTwo] > 0 || image[1] === "Comments") &&
                  "cursor-pointer active:scale-95"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (disabled) {
                    dispatch(
                      setReactBox({
                        actionOpen: false,
                      })
                    );
                    router.push(`/item/pub/${item?.id}`);
                  } else {
                    stats[indexTwo] > 0 && image[1] !== "Comments"
                      ? dispatch(
                          setReactBox({
                            actionOpen: true,
                            actionId: (item?.__typename === "Mirror"
                              ? item?.mirrorOn
                              : (item as Post)
                            )?.id,
                            actionType: image[1],
                          })
                        )
                      : !main && router.push(`/item/pub/${item?.id}`);
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
        <div
          className={`absolute w-fit h-fit flex flex-row gap-4 p-2 items-center justify-center bg-lirio/80 rounded-sm left-2 -top-8 border border-white`}
        >
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
                {loaders[index] && indexTwo == 0 ? (
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
                      onError={(e) => handleImageError(e)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <div className="relative w-fit h-fit flex flex-row gap-2 items-end sm:items-center justify-center ml-auto">
        <div
          className="relative w-8 h-3.5 items-center justify-center flex cursor-pointer active:scale-95"
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
              (item?.__typename === "Mirror" ? item?.mirrorOn : (item as Post))
                ?.metadata?.__typename !== "ImageMetadataV3"
                ? "QmNpvEkdHfhFViALNCedoF3WLTngxXG67XnPYaeaFCsA49"
                : "QmTQYdbL5iJkzMAwHh52SWvzopssTEEV5dRaENNrJgmesH"
            }`}
          />
        </div>
        <div
          className="relative flex items-center justify-center rounded-full w-5 h-5 cursor-pointer"
          id="pfp"
          onMouseEnter={(e) => {
            if (disabled) return;
            setProfileHovers!((prev) => {
              const arr = [...(prev || [])];
              arr[index] = true;
              return arr;
            });
          }}
        >
          {profilePicture && (
            <Image
              layout="fill"
              src={profilePicture}
              draggable={false}
              className="rounded-full"
              objectFit="cover"
              onError={(e) => handleImageError(e)}
            />
          )}
        </div>
        <div
          className={`relative w-5 h-5 items-center justify-center flex ${
            (item?.__typename === "Mirror" ? item?.mirrorOn : (item as Post))
              ?.openActionModules?.[0]?.__typename ===
              "SimpleCollectOpenActionSettings" ||
            (item?.__typename === "Mirror" ? item?.mirrorOn : (item as Post))
              ?.openActionModules?.[0]?.__typename ===
              "MultirecipientFeeCollectOpenActionSettings" ||
            [
              CHROMADIN_OPEN_ACTION,
              LISTENER_OPEN_ACTION,
              COIN_OP_OPEN_ACTION,
            ]?.some((value) =>
              (item?.__typename === "Mirror"
                ? item?.mirrorOn
                : (item as Post)
              )?.openActionModules?.[0]?.contract?.address
                ?.toLowerCase()
                ?.includes(value?.toLowerCase())
            )
              ? "cursor-pointer active:scale-95"
              : "opacity-70"
          } ${interactionsLoading?.simpleCollect && "animate-spin"} ${
            (item?.__typename === "Mirror" ? item?.mirrorOn : (item as Post))
              ?.operations?.hasActed?.value &&
            "mix-blend-hard-light hue-rotate-60"
          }`}
          onClick={
            [
              CHROMADIN_OPEN_ACTION,
              LISTENER_OPEN_ACTION,
              COIN_OP_OPEN_ACTION,
            ]?.some((value) =>
              (item?.__typename === "Mirror"
                ? item?.mirrorOn
                : (item as Post)
              )?.openActionModules?.[0]?.contract?.address
                ?.toLowerCase()
                ?.includes(value?.toLowerCase())
            )
              ? async () => {
                  const meta =
                    item?.__typename === "Mirror"
                      ? item?.mirrorOn
                      : (item as Post);
                  const returned = await decodeReturnedData(
                    (
                      meta
                        ?.openActionModules?.[0] as UnknownOpenActionModuleSettings
                    )?.openActionModuleReturnData
                  );
                  const newItem = {
                    ...returned,
                    amount: 1,
                    price: Number(returned?.prices?.[0]),
                    type: meta?.openActionModules?.[0]?.contract?.address
                      ?.toLowerCase()
                      ?.includes(CHROMADIN_OPEN_ACTION?.toLowerCase())
                      ? "chromadin"
                      : meta?.openActionModules?.[0]?.contract?.address
                          ?.toLowerCase()
                          ?.includes(COIN_OP_OPEN_ACTION?.toLowerCase())
                      ? "coinop"
                      : "listener",
                    color: returned?.colors?.split(",")?.[0],
                    size: returned?.sizes?.split(",")?.[0],
                    purchased: false,
                    chosenIndex: 0,
                  };

                  const existingItem = cartItems?.find(
                    (value) => value?.item?.pubId === returned?.pubId
                  );

                  if (existingItem) {
                    const newCartItems = [...cartItems];
                    const itemIndex = newCartItems?.indexOf(existingItem);

                    if (
                      existingItem?.color === newItem?.color &&
                      existingItem?.size === newItem?.size
                    ) {
                      newCartItems[itemIndex] = {
                        ...existingItem,
                        amount: existingItem?.amount + 1,
                      };
                    } else {
                      newCartItems.splice(itemIndex, 1);
                      newCartItems.push(newItem);
                    }

                    dispatch(setCartItems(newCartItems));
                    setCypherStorageCart(JSON.stringify(newCartItems));
                  } else {
                    dispatch(setCartItems([...cartItems, newItem]));
                    setCypherStorageCart(
                      JSON.stringify([...cartItems, newItem])
                    );
                  }

                  dispatch(setCartAnim(true));
                }
              : () =>
                  collectLogic(
                    (item?.__typename === "Mirror"
                      ? item?.mirrorOn
                      : (item as Post)) as Post,
                    disabled,
                    interactionsLoading?.simpleCollect!,
                    dispatch,
                    main!,
                    simpleCollect
                  )
          }
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
            lensConnected={lensConnected}
            parentId={item?.id}
            top={main || router.asPath?.includes("autograph") ? "auto" : "20px"}
            bottom={
              main || router.asPath?.includes("autograph") ? "2px" : "auto"
            }
            left={"auto"}
            right={"2px"}
          />
        )}
      </div>
      {openMoreOptions?.[index] && (
        <div className="absolute w-fit h-fit flex flex-row gap-4 p-1 items-center justify-center bg-lirio/80 rounded-sm right-2 -top-2 sm:-top-10 border border-white z-10">
          {(
            [
              lensConnected?.id ===
              (item?.__typename == "Mirror" ? item?.mirrorOn : (item as Post))
                ?.by?.id
                ? [
                    "Hide Post",
                    "QmUcaryzjgiLn34eXTPAZxmtfzWgTsUSeaim3yHnsmcnxx",
                  ]
                : null,
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
              lensConnected?.id === meta?.by?.id ? handleHidePost : null,
              handleBookmark,
              () =>
                dispatch(
                  setReportPub({
                    actionOpen: true,
                    actionFor: item?.id,
                  })
                ),
              () =>
                meta?.openActionModules?.[0]?.contract?.address
                  ?.toLowerCase()
                  ?.includes(CHROMADIN_OPEN_ACTION?.toLowerCase())
                  ? router.push(
                      `/item/chromadin/${(
                        meta?.metadata as ImageMetadataV3
                      )?.title?.replaceAll(" ", "_")}`
                    )
                  : meta?.openActionModules?.[0]?.contract?.address
                      ?.toLowerCase()
                      ?.includes(COIN_OP_OPEN_ACTION?.toLowerCase())
                  ? router.push(
                      `/item/coinop/${(
                        meta?.metadata as ImageMetadataV3
                      )?.title?.replaceAll(" ", "_")}`
                    )
                  : meta?.openActionModules?.[0]?.contract?.address
                      ?.toLowerCase()
                      ?.includes(LISTENER_OPEN_ACTION?.toLowerCase())
                  ? router.push(
                      `/item/listener/${(
                        meta?.metadata as ImageMetadataV3
                      )?.title?.replaceAll(" ", "_")}`
                    )
                  : router.push(`/item/pub/${item?.id}`),
            ]?.filter(Boolean);

            const loaders = [
              lensConnected?.id === meta?.by?.id
                ? interactionsLoading?.hide
                : null,
              interactionsLoading?.bookmark,
            ]?.filter((item) => item !== null && item !== undefined);
            return (
              <div
                key={indexTwo}
                className="relative w-fit h-fit flex cursor-pointer items-center justify-center active:scale-95 hover:opacity-70"
                title={image[0]}
                onClick={() => {
                  if (disabled) return;
                  if (
                    (indexTwo !== 3 &&
                      indexTwo !== 2 &&
                      lensConnected?.id === meta?.by?.id) ||
                    (lensConnected?.id !== meta?.by?.id &&
                      indexTwo !== 2 &&
                      indexTwo !== 1)
                  ) {
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
                {loaders[indexTwo] ? (
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

export default PostBar;
