import { FunctionComponent, JSX, useContext, useState } from "react";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import numeral from "numeral";
import handleImageError from "@/app/lib/helpers/handleImageError";
import {
  addressToItemType,
  CHROMADIN_OPEN_ACTION,
  COIN_OP_OPEN_ACTION,
  F3M_OPEN_ACTION,
  INFURA_GATEWAY,
  KINORA_OPEN_ACTION,
  KINORA_OPEN_ACTION_PRINT,
  LISTENER_OPEN_ACTION,
} from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import HoverProfile from "./HoverProfile";
import { usePathname, useRouter } from "next/navigation";
import useInteractions from "../hooks/useInteractions";
import { PostBarProps } from "../types/tiles.types";
import checkActions from "@/app/lib/helpers/checkActions";
import { setCypherStorageCart } from "@/app/lib/utils";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { getOneCollectionQuick } from "../../../../../graphql/queries/getAllCollections";
import { ImageMetadata } from "@lens-protocol/client";

const PostBar: FunctionComponent<PostBarProps> = ({
  index,
  item,
  disabled,
  setCommentOpen,
  main,
  top,
  bottom,
  left,
  right,
  dict,
  commentInteraction,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const [profileHover, setProfileHover] = useState<boolean>(false);
  const [openMoreOptions, setOpenMoreOptions] = useState<boolean>(false);
  const router = useRouter();
  const path = usePathname();
  const {
    setOpenMirrorChoice,
    interactions,
    interactionsLoading,
    like,
    mirror,
    openMirrorChoice,
    collect,
    handleBookmark,
    handleHidePost,
  } = useInteractions(
    dict,
    item?.__typename === "Repost" ? item?.repostOf : item
  );
  return (
    <div className="relative w-full justify-between flex flex-col sm:flex-row items-between sm:items-center gap-2">
      <div className="relative w-fit h-fit flex flex-row items-start sm:items-center gap-2 justify-center">
        {[
          {
            image: "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
            title: "Mirrors",
            function: () => setOpenMirrorChoice((prev) => !prev),
            loader: false,
            stats: interactions?.reposts + interactions?.quotes,
            responded: interactions?.hasQuoted ?? interactions?.hasReposted,
          },
          {
            image: "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ",
            title: "Likes",
            function: () => like(),
            loader: interactionsLoading?.like,
            stats: interactions?.upvotes,
            responded: interactions?.hasUpVoted,
          },
          {
            image: "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n",
            title: "Comments",
            function: main ? null : () => setCommentOpen((prev) => !prev),
            loader: false,
            stats: commentInteraction?.comments,
            responded: commentInteraction?.hasCommented,
          },
        ].map((element, indexTwo: number) => {
          return (
            <div
              className={`relative w-full h-full flex flex-row items-center justify-center gap-1 font-earl text-white`}
              key={indexTwo}
            >
              <div
                className={`relative w-fit h-fit flex cursor-pointer items-center justify-center active:scale-95 ${
                  element?.responded && "mix-blend-hard-light hue-rotate-60"
                }`}
                onClick={() => {
                  if (disabled) {
                    context?.setFiltersOpen({ value: false, allow: false });
                    context?.setReactBox(undefined);
                    checkActions(item, router);
                  } else if (element?.function) {
                    element?.function();
                  }
                }}
              >
                {element?.loader ? (
                  <div className="relative w-fit h-fit animate-spin flex items-center justify-center">
                    <AiOutlineLoading size={15} color="white" />
                  </div>
                ) : (
                  <div
                    className={`relative w-3.5 h-3.5 flex items-center justify-center ${
                      element?.function
                        ? "cursor-pointer active:scale-95"
                        : "opacity-70"
                    } `}
                  >
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/${element?.image}`}
                      draggable={false}
                      onError={(e) => handleImageError(e)}
                    />
                  </div>
                )}
              </div>
              <div
                className={`relative w-fit h-fit flex items-center justify-center text-center text-sm ${
                  (element?.stats > 0 || element?.title === "Comments") &&
                  "cursor-pointer active:scale-95"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (disabled) {
                    context?.setFiltersOpen({ value: false, allow: false });
                    context?.setReactBox(undefined);
                    checkActions(item, router);
                  } else {
                    if (element?.stats > 0 && element?.title !== "Comments") {
                      context?.setReactBox({
                        id: (item?.__typename === "Repost"
                          ? item?.repostOf
                          : item
                        )?.id,
                        type: element?.title,
                      });
                    } else if (!main) {
                      context?.setFiltersOpen({ value: false, allow: false });
                      checkActions(item, router);
                    }
                  }
                }}
              >
                {numeral(element?.stats).format("0a")}
              </div>
            </div>
          );
        })}
      </div>
      {openMirrorChoice && (
        <div
          className={`absolute w-fit h-fit flex flex-row gap-4 p-2 items-center justify-center bg-lirio/80 rounded-sm left-2 -top-8 border border-white z-10`}
        >
          {[
            {
              image: "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
              function: () => mirror(),
              loader: interactionsLoading?.mirror,
            },
            {
              image: "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM",
              loader: false,
              function: context?.setPostBox({
                open: true,
                quote: item?.__typename === "Repost" ? item?.repostOf : item,
              }),
            },
          ].map((element, indexTwo: number) => {
            return (
              <div
                key={indexTwo}
                className="relative w-fit h-fit flex cursor-pointer items-center justify-center active:scale-95 hover:opacity-70"
                onClick={() => {
                  if (disabled) {
                    context?.setReactBox(undefined);
                    context?.setFiltersOpen({ value: false, allow: false });
                    checkActions(item, router);
                  } else {
                    !element?.loader && element.function && element?.function();
                  }
                }}
              >
                {element?.loader ? (
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
                      src={`${INFURA_GATEWAY}/ipfs/${element?.image}`}
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
            setOpenMoreOptions!((prev) => !prev);
          }}
        >
          <Image
            layout="fill"
            draggable={false}
            src={`${INFURA_GATEWAY}/ipfs/${
              index % 2 == 0 ||
              (item?.__typename === "Repost" ? item?.repostOf : item)?.metadata
                ?.__typename !== "ImageMetadata"
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
            setProfileHover(true);
          }}
        >
          <Image
            layout="fill"
            src={handleProfilePicture(item?.author?.metadata?.picture)}
            draggable={false}
            key={item?.author?.metadata?.picture}
            className="rounded-full"
            objectFit="cover"
            onError={(e) => handleImageError(e)}
          />
        </div>
        <div
          className={`relative w-5 h-5 items-center justify-center flex ${
            (item?.__typename === "Repost" ? item?.repostOf : item)
              ?.actions?.[0]?.__typename === "SimpleCollectAction" ||
            [
              CHROMADIN_OPEN_ACTION,
              LISTENER_OPEN_ACTION,
              COIN_OP_OPEN_ACTION,
              F3M_OPEN_ACTION,
              KINORA_OPEN_ACTION_PRINT,
            ]?.some((value) =>
              (item?.__typename === "Repost"
                ? item?.repostOf
                : item
              )?.actions?.[0]?.address
                ?.toLowerCase()
                ?.includes(value?.toLowerCase())
            )
              ? "cursor-pointer active:scale-95"
              : "opacity-70"
          } ${interactionsLoading?.collect && "animate-spin"} ${
            (item?.__typename === "Repost" ? item?.repostOf : item)?.operations
              ?.hasSimpleCollected && "mix-blend-hard-light hue-rotate-60"
          }`}
          onClick={
            (item?.__typename === "Repost"
              ? item?.repostOf
              : item
            )?.actions?.[0]?.address
              ?.toLowerCase()
              ?.includes(KINORA_OPEN_ACTION?.toLowerCase())
              ? () =>
                  window.open(
                    `https://kinora.irrevocable.dev/quest/${
                      (item?.__typename === "Repost" ? item?.repostOf : item)
                        ?.id
                    }`
                  )
              : [
                  CHROMADIN_OPEN_ACTION,
                  LISTENER_OPEN_ACTION,
                  COIN_OP_OPEN_ACTION,
                  F3M_OPEN_ACTION,
                  KINORA_OPEN_ACTION_PRINT,
                ]?.some((value) =>
                  (item?.__typename === "Repost"
                    ? item?.repostOf
                    : item
                  )?.actions?.[0]?.address
                    ?.toLowerCase()
                    ?.includes(value?.toLowerCase())
                )
              ? async () => {
                  const meta =
                    item?.__typename === "Repost" ? item?.repostOf : item;
                  const returned = await getOneCollectionQuick(
                    addressToItemType[meta?.actions?.[0]?.address],
                    (meta?.metadata as ImageMetadata)?.title!
                  );

                  const coll = returned?.data?.collectionCreateds?.[0];

                  if (!coll) return;

                  const newItem = {
                    buyAmount: 1,
                    price: Number(coll?.price) / 10 ** 18,
                    type: meta?.actions?.[0]?.address
                      ?.toLowerCase()
                      ?.includes(CHROMADIN_OPEN_ACTION?.toLowerCase())
                      ? "chromadin"
                      : meta?.actions?.[0]?.address
                          ?.toLowerCase()
                          ?.includes(COIN_OP_OPEN_ACTION?.toLowerCase())
                      ? "coinop"
                      : meta?.actions?.[0]?.address
                          ?.toLowerCase()
                          ?.includes(LISTENER_OPEN_ACTION?.toLowerCase())
                      ? "listener"
                      : meta?.actions?.[0]?.address
                          ?.toLowerCase()
                          ?.includes(KINORA_OPEN_ACTION_PRINT?.toLowerCase())
                      ? "kinora"
                      : "f3m",
                    color:
                      typeof coll?.metadata?.colors === "string"
                        ? (coll?.metadata?.colors as any)
                            ?.split(",")
                            ?.map((word: string) => word.trim())
                            ?.filter((word: string) => word.length > 0)?.[0]
                        : coll?.metadata?.colors?.[0],
                    size:
                      coll?.metadata?.sizes === "string"
                        ? (coll?.metadata?.sizes as any)
                            ?.split(",")
                            ?.map((word: string) => word.trim())
                            ?.filter((word: string) => word.length > 0)?.[0]
                        : coll?.metadata?.sizes?.[0],
                    currency: coll?.acceptedTokens?.[0],
                    item: {
                      ...coll,
                      profile:
                        item?.__typename == "Repost"
                          ? item?.repostOf?.author
                          : item?.author,
                    },
                  };

                  const existingItem = context?.cartItems?.find(
                    (value) =>
                      Number(value?.item?.postId) ===
                      Number(newItem?.item?.postId)
                  );
                  if (
                    Number(existingItem?.item?.tokenIdsMinted?.length || 0) +
                      Number(
                        context?.cartItems
                          ?.filter(
                            (value) =>
                              existingItem?.item?.postId == value?.item?.postId
                          )
                          ?.map((item) => item?.buyAmount)
                          ?.reduce((sum, item) => sum + Number(item), 0)
                      ) +
                      1 >
                    Number(existingItem?.item?.amount)
                  ) {
                    context?.setModalOpen(dict?.lim);
                    return;
                  }

                  const newItemDeepCopy = await JSON.parse(
                    JSON.stringify(newItem)
                  );

                  if (existingItem) {
                    const newCartItems = [...(context?.cartItems || [])];
                    const itemIndex = newCartItems?.indexOf(existingItem);

                    if (
                      existingItem?.color === newItemDeepCopy?.color &&
                      existingItem?.size === newItemDeepCopy?.size
                    ) {
                      newCartItems[itemIndex] = {
                        ...existingItem,
                        buyAmount: existingItem?.buyAmount + 1,
                      };
                    } else {
                      newCartItems.splice(itemIndex, 1);
                      newCartItems.push(newItemDeepCopy);
                    }

                    context?.setCartItems(newCartItems);
                    setCypherStorageCart(JSON.stringify(newCartItems));
                  } else {
                    context?.setCartItems([
                      ...context?.cartItems,
                      newItemDeepCopy,
                    ]);
                    setCypherStorageCart(
                      JSON.stringify([...context?.cartItems!, newItemDeepCopy])
                    );
                  }

                  context?.setCartAnim(true);
                }
              : () => collect()
          }
        >
          {interactionsLoading?.collect ? (
            <AiOutlineLoading size={15} color="white" />
          ) : (
            <Image
              layout="fill"
              draggable={false}
              src={`${INFURA_GATEWAY}/ipfs/QmZ4v5pzdnCBeyKnS9VrjZiEAbUpAVy8ECArNcpxBt6Tw4`}
            />
          )}
        </div>
        {profileHover && (
          <HoverProfile
            dict={dict}
            publication={
              (item.__typename == "Repost" ? item?.repostOf : item)?.author
            }
            setProfileHover={setProfileHover}
            parentId={item?.id}
            top={top}
            bottom={bottom}
            left={left}
            right={right}
          />
        )}
      </div>
      {openMoreOptions && (
        <div className="absolute w-fit h-fit flex flex-row gap-4 p-1 items-center justify-center bg-lirio/80 rounded-sm right-2 -top-2 sm:-top-10 border border-white z-10">
          {[
            context?.lensConectado?.profile?.address ===
            (item?.__typename == "Repost" ? item?.repostOf : item)?.author
              ?.address
              ? {
                  title: "Hide Post",
                  image: "QmUcaryzjgiLn34eXTPAZxmtfzWgTsUSeaim3yHnsmcnxx",
                  function: () => handleHidePost(),
                  loader:
                    context?.lensConectado?.profile?.address ===
                    (item?.__typename == "Repost" ? item?.repostOf : item)
                      ?.author?.address
                      ? interactionsLoading?.hide
                      : null,
                }
              : null,
            {
              title: "Bookmark",
              image: "QmUHAMRX6fenDM6Eyt36N8839b8xbiMDkN9Wb8DXKY2aZC",
              function: () => handleBookmark(),
              loader: interactionsLoading?.bookmark,
            },
            {
              title: "Report Post",
              image: "QmRNwdrGa977LxHPbBv8KEAHBEEidKUiPtn4r6SmxDZHkd",
              function: () => context?.setReportPub(item?.id),
              loader: false,
            },
            path?.includes("item") || main
              ? null
              : {
                  title: "View Post",
                  image: "QmRkAoLMAh2hxZfh5WvaxuxRUMhs285umdJWuvLa5wt6Ht",
                  function: () => {
                    context?.setFiltersOpen({ value: false, allow: false });
                    checkActions(item, router);
                  },
                  loader: false,
                },
          ]
            .filter(Boolean)
            .map((element, indexTwo: number) => {
              return (
                <div
                  key={indexTwo}
                  className="relative w-fit h-fit flex cursor-pointer items-center justify-center active:scale-95 hover:opacity-70"
                  title={element?.title}
                  onClick={() => {
                    if (disabled) return;
                    if (
                      (indexTwo !== 3 &&
                        indexTwo !== 2 &&
                        context?.lensConectado?.profile?.address ===
                          (item?.__typename == "Repost" ? item?.repostOf : item)
                            ?.author?.address) ||
                      (context?.lensConectado?.profile?.address !==
                        (item?.__typename == "Repost" ? item?.repostOf : item)
                          ?.author?.address &&
                        indexTwo !== 2 &&
                        indexTwo !== 1)
                    ) {
                      !element?.loader &&
                        element?.function &&
                        element.function();
                    } else {
                      (element?.function as () => void)();
                    }
                  }}
                >
                  {element?.loader ? (
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
                        src={`${INFURA_GATEWAY}/ipfs/${element?.image}`}
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
