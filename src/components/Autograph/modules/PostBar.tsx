import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import {
  ImageSet,
  Mirror,
  NftImage,
  Post,
} from "../../../../graphql/generated";
import numeral from "numeral";
import { PostBarProps } from "../types/autograph.types";
import HoverProfile from "@/components/Common/modules/HoverProfile";

const PostBar: FunctionComponent<PostBarProps> = ({
  index,
  like,
  mirror,
  quote,
  comment,
  collect,
  interactionsLoading,
  item,
  openMirrorChoice,
  setOpenMirrorChoice,
  router,
  profileHovers,
  setProfileHovers,
  followLoading,
  followProfile,
  unfollowProfile,
}): JSX.Element => {
  return (
    <div className="relative w-full justify-between flex flex-row items-center gap-2">
      <div className="relative w-fit h-fit flex flex-row items-center gap-1.5 justify-center">
        {[
          "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
          "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ",
          "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n",
        ].map((image: string, indexTwo: number) => {
          const functions = [like, comment];

          const loaders = [
            interactionsLoading?.like,
            interactionsLoading?.comment,
          ];

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
                  if (indexTwo === 2) {
                    const choices = [...openMirrorChoice];
                    choices[index] = !choices[index];
                    setOpenMirrorChoice(choices);
                  } else {
                    !loaders[index] &&
                      functions[indexTwo] &&
                      functions[indexTwo]!(item?.id);
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
                      src={`${INFURA_GATEWAY}/ipfs/${image}`}
                      draggable={false}
                    />
                  </div>
                )}
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center text-center cursor-pointer active:scale-95">
                {numeral(stats[indexTwo]).format("0a")}
              </div>
            </div>
          );
        })}
      </div>
      {!openMirrorChoice?.[index] && (
        <div className="absolute w-fit h-fit flex flex-row gap-4 p-2 items-center justify-center bg-ballena/20 rounded-sm left-2 -top-8">
          {[
            "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
            "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM",
          ].map((image: string, indexTwo: number) => {
            const functions: (
              | ((id: string) => Promise<void>)
              | ((index: number, id: string) => Promise<void>)
            )[] = [mirror, quote];
            const loaders = [
              interactionsLoading?.mirror,
              interactionsLoading?.quote,
            ];
            return (
              <div
                key={indexTwo}
                className="relative w-fit h-fit flex cursor-pointer items-center justify-center active:scale-95 hover:opacity-70"
                onClick={() =>
                  !loaders[index] &&
                  (functions[indexTwo] as (id: string) => Promise<void>)(
                    item?.id
                  )
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
      <div className="relative w-fit h-fit flex flex-row gap-2">
        <div
          className="relative w-12 h-5 items-center justify-center flex cursor-pointer active:scale-95"
          onClick={() => router.push(`/item/pub/${item.id}`)}
        >
          <Image
            layout="fill"
            draggable={false}
            src={`${INFURA_GATEWAY}/ipfs/QmTQYdbL5iJkzMAwHh52SWvzopssTEEV5dRaENNrJgmesH`}
          />
        </div>
        <div
          className="relative flex items-center justify-center rounded-full w-5 h-5 cursor-pointer"
          id="pfp"
          onMouseEnter={() => {
            const updatedArray = [...profileHovers];
            updatedArray[index] = true;
            setProfileHovers(updatedArray);
          }}
        >
          <Image
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/${
              item?.by?.metadata?.picture?.__typename === "ImageSet"
                ? (item?.by?.metadata?.picture as ImageSet)?.raw?.uri?.split(
                    "ipfs://"
                  )[1]
                : (
                    item?.by?.metadata?.picture as NftImage
                  )?.image?.raw?.uri?.split("ipfs://")[1]
            }`}
            draggable={false}
          />
        </div>
        <div
          className={`relative w-5 h-5 items-center justify-center flex ${
            item?.__typename === "Mirror"
              ? (item as Mirror)?.mirrorOn?.openActionModules?.[0]
                  ?.__typename === "SimpleCollectOpenActionSettings" ||
                (item as Mirror)?.mirrorOn?.openActionModules?.[0]
                  ?.__typename === "MultirecipientFeeCollectOpenActionSettings"
              : (item as Post)?.openActionModules?.[0]?.__typename ===
                  "SimpleCollectOpenActionSettings" ||
                (item as Post)?.openActionModules?.[0]?.__typename ===
                  "MultirecipientFeeCollectOpenActionSettings"
              ? "cursor-pointer active:scale-95"
              : "opacity-70"
          } ${interactionsLoading?.collect && "animate-spin"}`}
          onClick={() =>
            !interactionsLoading?.collect &&
            (item?.__typename === "Mirror"
              ? (item as Mirror)?.mirrorOn?.openActionModules?.[0]
                  ?.__typename === "SimpleCollectOpenActionSettings" ||
                (item as Mirror)?.mirrorOn?.openActionModules?.[0]
                  ?.__typename === "MultirecipientFeeCollectOpenActionSettings"
              : (item as Post)?.openActionModules?.[0]?.__typename ===
                  "SimpleCollectOpenActionSettings" ||
                (item as Post)?.openActionModules?.[0]?.__typename ===
                  "MultirecipientFeeCollectOpenActionSettings") &&
            collect(
              item?.__typename === "Mirror"
                ? (item as Mirror)?.mirrorOn?.id
                : item?.id,
              item?.__typename === "Mirror"
                ? (item as Mirror)?.mirrorOn?.openActionModules?.[0]
                    ?.__typename!
                : (item as Post)?.openActionModules?.[0]?.__typename!
            )
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
        {profileHovers?.[index] && (
          <HoverProfile
            followLoading={followLoading}
            followProfile={followProfile}
            unfollowProfile={unfollowProfile}
            router={router}
            publication={item?.by}
            index={index}
            profileHovers={profileHovers}
            setProfileHovers={setProfileHovers}
            feed
          />
        )}
      </div>
    </div>
  );
};

export default PostBar;
