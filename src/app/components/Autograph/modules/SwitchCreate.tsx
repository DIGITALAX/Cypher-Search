import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import {
  INFURA_GATEWAY,
  itemTypeToString,
  numberToItemTypeMap,
  printTypeToString,
} from "@/app/lib/constants";
import MediaSwitch from "../../Common/modules/MediaSwitch";
import Dispatch from "./Dispatch";
import { SwitchCreateProps } from "../types/autograph.types";
import { useRouter } from "next/navigation";
import Drop from "./Drop";
import { MediaImageMimeType } from "@lens-protocol/metadata";
import { ModalContext } from "@/app/providers";

const SwitchCreate: FunctionComponent<SwitchCreateProps> = ({
  dict,
  collectionDetails,
  setCollectionDetails,
  handleMedia,
  collectionSettings,
  setCollectionSettings,
  allDrops,
  setCreateCase,
  edit,
  createCase,
  collectionLoading,
  allCollections,
  dropDetails,
  dropsLoading,
  setDropDetails,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  switch (createCase) {
    case "collection":
      return (
        <Dispatch
          collectionDetails={collectionDetails}
          setCollectionDetails={setCollectionDetails}
          handleMedia={handleMedia}
          collectionSettings={collectionSettings}
          setCollectionSettings={setCollectionSettings}
          allDrops={allDrops}
          setCreateCase={setCreateCase}
          edit={edit}
          dict={dict}
        />
      );

    case "drop":
      return (
        <Drop
          dict={dict}
          dropDetails={dropDetails}
          dropsLoading={dropsLoading}
          allDrops={allDrops}
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
                : allCollections?.map((item, index: number) => {
            
                    return (
                      <div
                        key={index}
                        className="relative w-40 h-40 rounded-sm p-px cursor-pointer z-0"
                        id="pfp"
                        onClick={() => {
                          setCreateCase("collection");
                          setCollectionSettings((prev) => ({
                            ...prev,
                            imageIndex: 0,
                            origin:
                              itemTypeToString[
                                numberToItemTypeMap[Number(item?.origin)]
                              ],
                            media:
                              itemTypeToString[
                                numberToItemTypeMap[Number(item?.origin)]
                              ] === "chromadin"
                                ? item?.metadata?.audio
                                  ? "audio"
                                  : item?.metadata?.video
                                  ? "video"
                                  : "static"
                                : "static",
                          }));
                          setCollectionDetails({
                            title: item?.metadata?.title,
                            postId: item?.postId,
                            description: item?.metadata?.description,
                            collectionId: item?.collectionId,
                            price: String(item?.price),
                            acceptedTokens: item?.acceptedTokens,
                            images:
                              item?.metadata?.images?.length > 0
                                ? item?.metadata?.images?.map((_, i) => ({
                                    media: item?.metadata?.images?.[i],
                                    type: item?.metadata?.mediaTypes?.[
                                      i
                                    ] as MediaImageMimeType,
                                  }))
                                : [],
                            video: item?.metadata?.video,
                            audio: item?.metadata?.audio,
                            tags: item?.metadata?.tags
                              ? item?.metadata?.tags?.join(", ") + ","
                              : "",
                            cover: item?.metadata?.mediaCover,
                            prompt: item?.metadata?.prompt,
                            amount: item?.amount,
                            sizes: item?.metadata?.sizes
                              ? item?.metadata?.sizes?.join(", ") + ","
                              : "",
                            colors: item?.metadata?.colors
                              ? item?.metadata?.colors?.join(", ") + ","
                              : "",
                            microbrand: {
                              microbrand: item?.metadata?.microbrand,
                              microbrandCover: item?.metadata?.microbrandCover,
                            },
                            sex: item?.metadata?.sex,
                            style: item?.metadata?.style,
                            extra: item?.metadata?.extra,
                            access: item?.metadata?.access
                              ? item?.metadata?.access?.join(", ")
                              : "",
                            onChromadin: item?.metadata?.onChromadin,
                            dropTitle: item?.drop?.metadata?.title,
                            dropCover: item?.drop?.metadata?.cover,
                            dropCollectionIds: item?.drop?.collections?.map(
                              (item) => item?.collectionId
                            ),
                            dropId: item?.drop?.dropId,
                            printType:
                              printTypeToString[
                                item?.printType as keyof typeof printTypeToString
                              ],
                          });
                        }}
                      >
                        <div className="relative w-full h-full flex">
                          <MediaSwitch
                            type={
                              item.metadata?.mediaTypes?.[0] == "video"
                                ? "video"
                                : item.metadata?.mediaTypes?.[0] == "audio"
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
                            classNameVideo={{
                              objectFit: "cover",
                              display: "flex",
                              width: "100%",
                              height: "100%",
                              alignItems: "center",
                              justifyItems: "center",
                              borderRadius: "0.375rem",
                              position: "relative",
                            }}
                            srcUrl={
                              item.metadata?.mediaTypes?.[0] == "video"
                                ? item?.metadata?.video
                                : item.metadata?.mediaTypes?.[0] == "audio"
                                ? `${INFURA_GATEWAY}/ipfs/${
                                    item?.metadata?.audio?.split("ipfs://")?.[1]
                                  }`
                                : `${INFURA_GATEWAY}/ipfs/${
                                    item?.metadata?.images?.[0]?.split(
                                      "ipfs://"
                                    )?.[1]
                                  }`
                            }
                            srcCover={
                              item?.metadata?.mediaCover
                                ? `${INFURA_GATEWAY}/ipfs/${
                                    item?.metadata?.mediaCover?.split(
                                      "ipfs://"
                                    )?.[1]
                                  }`
                                : undefined
                            }
                          />
                        </div>
                        <div className="absolute bottom-0 right-0 w-full h-6 bg-offBlack flex items-center justify-end px-1 z-10">
                          <div className="relative mr-auto flex items-center justify-start text-white font-aust text-xxs">
                            {item?.metadata?.title?.length > 15
                              ? item?.metadata?.title?.slice(0, 12) + "..."
                              : item?.metadata?.title}
                          </div>
                          <div
                            className="relative w-4 h-4 justify-end flex items-center cursor-pointer active:scale-95 ml-auto"
                            title={dict?.goCo}
                            onClick={(e) => {
                              e.stopPropagation();
                              context?.setFiltersOpen({
                                value: false,
                                allow: false,
                              });
                              router.push(
                                `/item/${
                                  numberToItemTypeMap[Number(item?.origin)]
                                }/${item?.metadata?.title?.replaceAll(
                                  " ",
                                  "_"
                                )}`
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
        <div className="relative w-1/2  h-full flex items-center justify-center font-ignite text-xl text-white text-center break-words">
          {dict?.noth}
        </div>
      );
  }
};

export default SwitchCreate;
