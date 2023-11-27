import { FunctionComponent } from "react";
import { SwitchCreateProps } from "../../types/autograph.types";
import Dispatch from "./Dispatch";
import Image from "next/legacy/image";
import {
  INFURA_GATEWAY,
  numberToItemTypeMap,
} from "../../../../../lib/constants";
import { Creation } from "@/components/Tiles/types/tiles.types";
import Drop from "./Drop";
import toHexWithLeadingZero from "../../../../../lib/helpers/leadingZero";
import MediaSwitch from "@/components/Common/modules/MediaSwitch";

const SwitchCreate: FunctionComponent<SwitchCreateProps> = ({
  type,
  collectionDetails,
  setCollectionDetails,
  router,
  handleMedia,
  lensConnected,
  collectionSettings,
  setCollectionSettings,
  filterConstants,
  dispatch,
  setDropDetails,
  dropsLoading,
  allDrops,
  dropDetails,
  setCreateCase,
  allCollections,
  collectionLoading,
}): JSX.Element => {
  switch (type) {
    case "collection":
      return (
        <Dispatch
          allDrops={allDrops}
          filterConstants={filterConstants}
          collectionDetails={collectionDetails}
          setCollectionDetails={setCollectionDetails}
          handleMedia={handleMedia}
          lensConnected={lensConnected}
          collectionSettings={collectionSettings}
          setCollectionSettings={setCollectionSettings}
          dispatch={dispatch}
          setCreateCase={setCreateCase}
        />
      );

    case "drop":
      return (
        <Drop
          handle={
            lensConnected?.handle?.suggestedFormatted?.localName?.split(
              "@"
            )?.[1]!
          }
          dropDetails={dropDetails}
          dropsLoading={dropsLoading}
          allDrops={allDrops}
          router={router}
          setDropDetails={setDropDetails}
        />
      );

    default:
      return allCollections?.length > 0 || collectionLoading ? (
        <div
          className="relative w-4/5 h-full overflow-x-scroll flex justify-start items-start"
          id="prerollScroll"
        >
          <div className="relative w-full h-full flex items-start justify-start">
            <div
              className={`relative w-full h-fit flex flex-wrap gap-6 items-start justify-start`}
            >
              {collectionLoading
                ? Array.from({ length: 20 })?.map((_, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`relative w-40 h-40 rounded-sm p-px animate-pulse`}
                        id="pfp"
                      ></div>
                    );
                  })
                : allCollections
                    ?.sort(() => Math.random() - 0.5)
                    ?.map((item: Creation, index: number) => {
                      return (
                        <div
                          key={index}
                          className="relative w-40 h-40 rounded-sm p-px cursor-pointer"
                          id="pfp"
                          onClick={() => {
                            setCreateCase("collection");
                            setCollectionSettings((prev) => ({
                              ...prev,
                              origin: "chromadin",
                              media: item?.audio
                                ? "audio"
                                : item?.video
                                ? "video"
                                : "static",
                            }));
                            setCollectionDetails({
                              title: item?.title,
                              profileId: item?.profileId,
                              pubId: item?.pubId,
                              description: item?.description,
                              collectionId: item?.collectionId,
                              price: item?.prices?.[0],
                              acceptedTokens: item?.acceptedTokens,
                              images: [
                                {
                                  media: item?.images?.[0],
                                  type: item?.mediaTypes?.[0],
                                },
                              ],
                              video: item?.video,
                              audio: item?.audio,
                              tags: item?.tags
                                ? item?.tags?.join(", ") + ","
                                : "",
                              cover: "",
                              prompt: item?.prompt,
                              amount: item?.amount,
                              visibility: item?.visibility,
                              sizes: item?.sizes,
                              colors: item?.colors,
                              profileHandle: item?.profileHandle,
                              microbrand: {
                                microbrand: item?.microbrand,
                                microbrandCover: item?.microbrandCover,
                              },
                              access: item?.access
                                ? item?.access?.join(", ")
                                : "",
                              dropTitle: item?.dropTitle,
                              dropCover: item?.dropCover,
                              dropCollectionIds: item?.dropCollectionIds,
                              dropId: item?.dropId,
                              communities: item?.communities
                                ? item?.communities?.join(", ")
                                : "",
                            });
                          }}
                        >
                          <div className="relative w-full h-full flex">
                            <MediaSwitch
                              type={
                                item.mediaTypes?.[0] == "video"
                                  ? "video"
                                  : item.mediaTypes?.[0] == "audio"
                                  ? "audio"
                                  : "image"
                              }
                              hidden
                              classNameImage={
                                "rounded-md w-full h-full flex relative"
                              }
                              classNameAudio={"rounded-md w-full h-full flex relative"}

                              classNameVideo={
                                "object-cover w-full h-full flex items-center justify-center rounded-md relative"
                              }
                              srcUrl={
                                item.mediaTypes?.[0] == "video"
                                  ? `${INFURA_GATEWAY}/ipfs/${
                                      item?.video?.split("ipfs://")?.[1]
                                    }`
                                  : item.mediaTypes?.[0] == "audio"
                                  ? `${INFURA_GATEWAY}/ipfs/${
                                      item?.audio?.split("ipfs://")?.[1]
                                    }`
                                  : `${INFURA_GATEWAY}/ipfs/${
                                      item?.images?.[0]?.split("ipfs://")?.[1]
                                    }`
                              }
                              srcCover={
                                item?.mediaCover
                                  ? `${INFURA_GATEWAY}/ipfs/${
                                      item?.mediaCover?.split("ipfs://")?.[1]
                                    }`
                                  : undefined
                              }
                            />
                          </div>
                          <div className="absolute bottom-0 right-0 w-full h-6 bg-offBlack flex items-center justify-end px-1">
                            <div className="relative mr-auto flex items-center justify-start text-white font-aust text-xxs">
                              {item?.title}
                            </div>
                            <div
                              className="relative w-4 h-4 justify-end flex items-center cursor-pointer active:scale-95 ml-auto"
                              title="Go to Collection"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/item/${
                                    numberToItemTypeMap[Number(item?.origin)]
                                  }/${
                                    "0x" +
                                    toHexWithLeadingZero(
                                      Number(item?.profileId)
                                    )
                                  }-${
                                    "0x" +
                                    toHexWithLeadingZero(Number(item?.pubId))
                                  }`
                                );
                              }}
                            >
                              <Image
                                draggable={false}
                                layout="fill"
                                src={`${INFURA_GATEWAY}/ipfs/QmRkAoLMAh2hxZfh5WvaxuxRUMhs285umdJWuvLa5wt6Ht`}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-1/2 h-fit flex items-center justify-center font-ignite text-xl text-white text-center break-words">
          Nothing to see here yet. Create products for the market!
        </div>
      );
  }
};

export default SwitchCreate;
