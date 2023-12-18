import { FunctionComponent } from "react";
import { SwitchCreateProps } from "../../types/autograph.types";
import Dispatch from "./Dispatch";
import Image from "next/legacy/image";
import {
  INFURA_GATEWAY,
  itemTypeToString,
  numberToItemTypeMap,
  printTypeToString,
} from "../../../../../lib/constants";
import { Creation, PrintType } from "@/components/Tiles/types/tiles.types";
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
  edit,
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
          edit={edit}
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
                : allCollections?.map((item: Creation, index: number) => {
                    return (
                      <div
                        key={index}
                        className="relative w-40 h-40 rounded-sm p-px cursor-pointer"
                        id="pfp"
                        onClick={() => {
                          setCreateCase("collection");
                          setCollectionSettings((prev) => ({
                            ...prev,
                            origin:
                              itemTypeToString[
                                numberToItemTypeMap[Number(item?.origin)]
                              ],
                            media:
                              itemTypeToString[
                                numberToItemTypeMap[Number(item?.origin)]
                              ] === "chromadin"
                                ? item?.collectionMetadata?.audio
                                  ? "audio"
                                  : item?.collectionMetadata?.video
                                  ? "video"
                                  : "static"
                                : "static",
                          }));
                          setCollectionDetails({
                            title: item?.collectionMetadata?.title,
                            profileId: item?.profileId,
                            pubId: item?.pubId,
                            description: item?.collectionMetadata?.description,
                            collectionId: item?.collectionId,
                            price: item?.prices?.[0],
                            otherPrices: item?.prices?.slice(1),
                            acceptedTokens: item?.acceptedTokens,
                            images: item?.collectionMetadata?.images?.[0]
                              ? [
                                  {
                                    media:
                                      item?.collectionMetadata?.images?.[0],
                                    type: item?.collectionMetadata
                                      ?.mediaTypes?.[0],
                                  },
                                ]
                              : [],
                            video: item?.collectionMetadata?.video,
                            audio: item?.collectionMetadata?.audio,
                            tags: item?.collectionMetadata?.tags
                              ? item?.collectionMetadata?.tags?.join(", ") + ","
                              : "",
                            cover: item?.collectionMetadata?.mediaCover,
                            prompt: item?.collectionMetadata?.prompt,
                            amount: item?.amount,
                            visibility: item?.collectionMetadata?.visibility,
                            sizes: item?.collectionMetadata?.sizes
                              ? item?.collectionMetadata?.sizes?.join(", ") +
                                ","
                              : "",
                            colors: item?.collectionMetadata?.colors
                              ? item?.collectionMetadata?.colors?.join(", ") +
                                ","
                              : "",
                            profileHandle:
                              item?.collectionMetadata?.profileHandle,
                            microbrand: {
                              microbrand: item?.collectionMetadata?.microbrand,
                              microbrandCover:
                                item?.collectionMetadata?.microbrandCover,
                            },
                            sex: item?.collectionMetadata?.sex,
                            style: item?.collectionMetadata?.style,
                            access: item?.collectionMetadata?.access
                              ? item?.collectionMetadata?.access?.join(", ")
                              : "",
                            onChromadin: item?.collectionMetadata?.onChromadin,
                            dropTitle: item?.dropMetadata?.dropTitle,
                            dropCover: item?.dropMetadata?.dropCover,
                            dropCollectionIds: item?.dropCollectionIds,
                            dropId: item?.dropId,
                            printType:
                              printTypeToString[
                                Number(item?.printType) as unknown as PrintType
                              ],
                            communities: item?.collectionMetadata?.communities
                              ? item?.collectionMetadata?.communities?.join(
                                  ", "
                                )
                              : "",
                          });
                        }}
                      >
                        <div className="relative w-full h-full flex">
                          <MediaSwitch
                            type={
                              item.collectionMetadata?.mediaTypes?.[0] ==
                              "video"
                                ? "video"
                                : item.collectionMetadata?.mediaTypes?.[0] ==
                                  "audio"
                                ? "audio"
                                : "image"
                            }
                            hidden
                            classNameImage={
                              "rounded-md w-full h-full flex relative"
                            }
                            classNameAudio={
                              "rounded-md w-full h-full flex relative"
                            }
                            classNameVideo={
                              "object-cover w-full h-full flex items-center justify-center rounded-md relative"
                            }
                            srcUrl={
                              item.collectionMetadata?.mediaTypes?.[0] ==
                              "video"
                                ? `${INFURA_GATEWAY}/ipfs/${
                                    item?.collectionMetadata?.video?.split(
                                      "ipfs://"
                                    )?.[1]
                                  }`
                                : item.collectionMetadata?.mediaTypes?.[0] ==
                                  "audio"
                                ? `${INFURA_GATEWAY}/ipfs/${
                                    item?.collectionMetadata?.audio?.split(
                                      "ipfs://"
                                    )?.[1]
                                  }`
                                : `${INFURA_GATEWAY}/ipfs/${
                                    item?.collectionMetadata?.images?.[0]?.split(
                                      "ipfs://"
                                    )?.[1]
                                  }`
                            }
                            srcCover={
                              item?.collectionMetadata?.mediaCover
                                ? `${INFURA_GATEWAY}/ipfs/${
                                    item?.collectionMetadata?.mediaCover?.split(
                                      "ipfs://"
                                    )?.[1]
                                  }`
                                : undefined
                            }
                          />
                        </div>
                        <div className="absolute bottom-0 right-0 w-full h-6 bg-offBlack flex items-center justify-end px-1">
                          <div className="relative mr-auto flex items-center justify-start text-white font-aust text-xxs">
                            {item?.collectionMetadata?.title?.length > 15
                              ? item?.collectionMetadata?.title?.slice(0, 12) +
                                "..."
                              : item?.collectionMetadata?.title}
                          </div>
                          <div
                            className="relative w-4 h-4 justify-end flex items-center cursor-pointer active:scale-95 ml-auto"
                            title="Go to Collection"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(
                                `/item/${
                                  numberToItemTypeMap[Number(item?.origin)]
                                }/${toHexWithLeadingZero(
                                  Number(item?.profileId)
                                )}-${toHexWithLeadingZero(Number(item?.pubId))}`
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
