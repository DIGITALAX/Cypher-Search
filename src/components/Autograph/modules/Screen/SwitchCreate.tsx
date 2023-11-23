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
import Waveform from "./Waveform";
import handleImageError from "../../../../../lib/helpers/handleImageError";

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
                              tags: item?.tags.join(", "),
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
                              access: item?.access?.join(", "),
                              dropTitle: item?.dropTitle,
                              dropCover: item?.dropCover,
                              dropCollectionIds: item?.dropCollectionIds,
                              dropId: item?.dropId,
                              communities: item?.communities?.join(", "),
                            });
                          }}
                        >
                          <div className="relative w-full h-full flex">
                            {item?.audio === "audio" || item?.images?.[0] ? (
                              item?.images?.[0] && (
                                <Image
                                  layout="fill"
                                  src={`${INFURA_GATEWAY}/ipfs/${
                                    item?.images?.[0]?.split("ipfs://")?.[1]
                                  }`}
                                  onError={(e) => handleImageError(e)}
                                  objectFit="cover"
                                  draggable={false}
                                  className="relative rounded-sm w-full h-full flex"
                                />
                              )
                            ) : (
                              <video
                                className="relative rounded-sm w-full h-full flex object-cover"
                                id={item?.video}
                                draggable={false}
                                controls={false}
                                playsInline
                                loop
                                key={item?.video}
                              >
                                <source
                                  src={`${INFURA_GATEWAY}/ipfs/${
                                    item?.video?.split("ipfs://")?.[1]
                                  }`}
                                />
                              </video>
                            )}
                            {(item?.audio || item?.video) && (
                              <Waveform
                                audio={item?.audio}
                                type={item?.audio ? "audio" : "video"}
                                keyValue={item?.audio || item?.video}
                                video={item?.video}
                              />
                            )}
                          </div>
                          <div className="absolute bottom-0 right-0 w-full h-6 bg-offBlack flex items-center justify-end px-1">
                            <div
                              className="relative w-4 h-4 justify-end flex items-center cursor-pointer active:scale-95 ml-auto"
                              title="Go to Collection"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/item/${
                                    numberToItemTypeMap[Number(item?.origin)]
                                  }/${Number(item?.profileId)?.toString(
                                    16
                                  )}-${Number(item?.pubId)?.toString(16)}`
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
