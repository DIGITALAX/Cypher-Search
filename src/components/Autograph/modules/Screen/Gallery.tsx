import { FunctionComponent } from "react";
import { GalleryScreenProps } from "../../types/autograph.types";
import { AiOutlineLoading } from "react-icons/ai";
import SwitchCreate from "./SwitchCreate";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { Creation } from "@/components/Tiles/types/tiles.types";

const Gallery: FunctionComponent<GalleryScreenProps> = ({
  setCollectionDetails,
  collectionDetails,
  createDrop,
  createCollection,
  creationLoading,
  router,
  collectionSettings,
  setCollectionSettings,
  isDesigner,
  handleSendMessage,
  digiMessage,
  setDigiMessage,
  digiMessageLoading,
  setCreateCase,
  createCase,
  handleMedia,
  lensConnected,
  filterConstants,
  dispatch,
  handlePlayPause,
  dropDetails,
  setDropDetails,
  allDrops,
  createDropLoading,
  dropsLoading,
  searchCollection,
  setSearchCollection,
  editDrop,
  deleteDrop,
  deleteCollection,
  allCollections,
  collectionLoading,
}): JSX.Element => {
  return (
    <div className="relative flex flex-row gap-4 items-start justify-center w-full h-full">
      <div className="relative flex w-4/5 h-fit items-start justify-center rounded-sm">
        <div
          className="relative w-full h-full flex flex-col items-center justify-start gap-5 p-px"
          id="pfp"
        >
          <div
            className={`relative w-full h-full bg-blurs flex bg-cover rounded-sm p-3 justify-center min-h-[35rem] max-h-[35rem] overflow-y-scroll ${
              (!createCase &&
                (allCollections?.length < 0 || collectionLoading)) ||
              (createCase === "drop" && (allDrops?.length > 0 || dropsLoading))
                ? "items-start"
                : "items-center"
            }`}
          >
            <SwitchCreate
              setCreateCase={setCreateCase}
              dropDetails={dropDetails}
              dropsLoading={dropsLoading}
              collectionLoading={collectionLoading}
              allDrops={allDrops}
              setDropDetails={setDropDetails}
              handlePlayPause={handlePlayPause}
              router={router}
              allCollections={allCollections}
              dispatch={dispatch}
              type={createCase}
              filterConstants={filterConstants}
              collectionDetails={collectionDetails}
              setCollectionDetails={setCollectionDetails}
              handleMedia={handleMedia}
              lensConnected={lensConnected}
              collectionSettings={collectionSettings}
              setCollectionSettings={setCollectionSettings}
            />
          </div>
        </div>
      </div>
      <div
        className="relative flex w-80 h-full p-px flex-col items-start justify-start"
        id="mar"
      >
        <div className="relative w-full min-h-[35rem] max-h-[35rem] h-full flex flex-col bg-piloto gap-6 items-center justify-start p-3">
          {!createCase && (
            <div className="font-bit text-white text-xs text-center flex w-4/5 h-fit relative">
              Fine-Tune Your gallery, with Art, collectibles, and rare gems that
              are more than they seem.
            </div>
          )}
          {isDesigner && (
            <div className="relative w-full h-fit flex items-center justify-center flex-col gap-1">
              <div className="relative w-fit h-fit flex items-center justify-center text-center font-bit text-white text-sm">
                Interested to mint? Send us a message!
              </div>
              <textarea
                className={`relative w-full p-1 bg-offBlack border border-white rounded-md h-32 font-bit text-xs flex items-center justify-center ${
                  digiMessage === "Message sent! We'll be in touch shortly."
                    ? "text-sol"
                    : "text-white"
                }`}
                style={{ resize: "none" }}
                onChange={(e) => setDigiMessage(e.target.value)}
                value={digiMessage}
              ></textarea>
              <div
                className={`relative w-full h-fit justify-end items-end flex ${
                  digiMessage === "Message sent! We'll be in touch shortly." &&
                  "opacity-50"
                }`}
              >
                <div
                  className={`"relative w-20 h-7 border border-white rounded-md text-white font-aust text-sm flex items-center justify-center ${
                    !digiMessageLoading && "cursor-pointer"
                  }`}
                  onClick={() => !digiMessageLoading && handleSendMessage(true)}
                >
                  <div
                    className={`relative w-fit h-fit items-center justify-center flex ${
                      digiMessageLoading && "animate-spin"
                    }`}
                  >
                    {digiMessageLoading ? (
                      <AiOutlineLoading color="white" size={15} />
                    ) : (
                      "Send"
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div
            className={`relative w-full h-full flex flex-col gap-7 items-center justify-start ${
              !isDesigner && "opacity-70"
            }`}
          >
            {createCase && (
              <div className="relative w-full h-fit flex items-center justify-center">
                <div
                  className="relative w-fit h-fit relative justify-center items-center font-bit text-xs flex cursor-pointer text-white"
                  onClick={() => setCreateCase(undefined)}
                >
                  {`<<<  Back to gallery`}
                </div>
              </div>
            )}

            {!createCase && (
              <>
                <div
                  className="relative w-full h-10 bg-olor border border-[#DAB275] flex items-center justify-center text-saph font-bit text-lg cursor-pointer active:scale-95"
                  onClick={() => !isDesigner && setCreateCase("collection")}
                >
                  <div className="relative w-fit h-fit items-center justify-center flex top-1">
                    + New Collection
                  </div>
                </div>
                <div
                  className="relative w-full h-10 bg-olor border border-[#DAB275] flex items-center justify-center text-saph font-bit text-lg cursor-pointer active:scale-95"
                  onClick={() => !isDesigner && setCreateCase("drop")}
                >
                  <div className="relative w-fit h-fit items-center justify-center flex top-1">
                    + New Drop
                  </div>
                </div>
              </>
            )}
            {createCase === "collection" && (
              <div className="relative w-full h-fit flex flex-col items-start justify-start gap-4">
                <div className="relative w-full h-fit flex flex-col items-center justify-start gap-2">
                  <div className="relative w-fit h-fit font-bit text-white text-sm">
                    Choose Origin
                  </div>
                  <div className="relative w-full h-fit flex flex-col items-center justify-start gap-2">
                    {[
                      "chromadin",
                      "coinop",
                      "autograph quarterly",
                      "legend",
                      "the dial",
                    ]?.map((item: string, index: number) => {
                      return (
                        <div
                          key={index}
                          className={`relative w-44 h-8 bg-[#DAB275] border-olor flex items-center justify-center text-white font-bit text-sm ${
                            item === collectionSettings?.origin
                              ? "border-2"
                              : "border"
                          } ${
                            index !== 0
                              ? "opacity-50"
                              : "cursor-pointer active:scale-95"
                          }`}
                          onClick={() =>
                            index === 0 &&
                            setCollectionSettings((prev) => ({
                              ...prev,
                              origin: item,
                            }))
                          }
                        >
                          <div className="relative w-fit h-fit items-center justify-center flex top-1">
                            {item}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="relative w-full h-fit flex flex-col items-center justify-start gap-2">
                  <div className="relative w-fit h-fit font-bit text-white text-sm">
                    Choose Media
                  </div>
                  <div className="relative w-full h-fit flex flex-col items-center justify-start gap-2">
                    {["static", "audio", "video"]?.map(
                      (item: string, index: number) => {
                        return (
                          <div
                            key={index}
                            className={`relative w-44 h-8 bg-[#DAB275] border-olor flex items-center cursor-pointer active:scale-95 justify-center text-white font-bit text-sm ${
                              collectionSettings?.media === item
                                ? "border-2"
                                : "border"
                            }`}
                            onClick={() =>
                              setCollectionSettings((prev) => ({
                                ...prev,
                                media: item,
                              }))
                            }
                          >
                            <div className="relative w-fit h-fit items-center justify-center flex top-px">
                              {item}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            )}
            {createCase === "drop" && (
              <div className="relative w-full h-fit flex flex-col items-start justify-start gap-4">
                <div className="relative w-full h-fit flex flex-col items-center justify-start gap-4">
                  <div className="relative w-fit h-fit flex items-center justify-center flex-col gap-2">
                    <div className="flex flex-col items-start justif-start w-fit h-fit gap-1 font-aust text-white">
                      <div className="relative w-fit h-fit text-sm">
                        Drop Title
                      </div>
                      <input
                        className="relative rounded-md p-1 bg-offBlack text-xs border border-sol h-10 w-60"
                        value={dropDetails?.title}
                        onChange={(e) =>
                          setDropDetails((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <label
                      className="relative border border-white w-60 h-60 rounded-sm cursor-pointer p-px"
                      id="pfp"
                    >
                      <div className="relative w-full h-full flex items-center justify-center rounded-sm">
                        {dropDetails?.cover && (
                          <Image
                            layout="fill"
                            src={
                              dropDetails?.cover?.includes("ipfs://")
                                ? `${INFURA_GATEWAY}/ipfs/${
                                    dropDetails?.cover?.split("ipfs://")?.[1]
                                  }`
                                : dropDetails?.cover
                            }
                            objectFit="cover"
                            draggable={false}
                            className="relative rounded-sm w-full h-full flex"
                          />
                        )}
                        <input
                          hidden
                          type="file"
                          accept={"image/png, image/gif"}
                          multiple={false}
                          onChange={(e) =>
                            e?.target?.files?.[0] && handleMedia(e, "drop")
                          }
                        />
                      </div>
                    </label>
                    {dropDetails?.dropId !== "" && (
                      <>
                        <div className="flex flex-col items-start justif-start w-fit h-fit gap-1 font-aust text-white">
                          <div className="relative w-fit h-fit text-sm">
                            Add Collections
                          </div>
                          <input
                            className="relative rounded-md p-1 bg-offBlack text-xs border border-sol h-10 w-60"
                            value={searchCollection}
                            onChange={(e) =>
                              setSearchCollection(e.target.value)
                            }
                          />
                        </div>
                        {allCollections?.filter((item) =>
                          item?.title
                            ?.toLowerCase()
                            ?.includes(searchCollection?.toLowerCase())
                        ) && (
                          <div className="absolute w-full max-h-[10rem] h-fit flex overflow-y-scroll bg-offBlack z-1 border border-white rounded-md">
                            <div className="relative w-full h-fit flex flex-col ">
                              {allCollections
                                ?.filter((item) =>
                                  item?.title
                                    ?.toLowerCase()
                                    ?.includes(searchCollection?.toLowerCase())
                                )
                                ?.map((item: Creation, index: number) => {
                                  return (
                                    <div
                                      key={index}
                                      className="relative px-2 py-1 text-center flex justify-center items-center hover:opacity-70 cursor-pointer active:scale-95"
                                      onClick={() => {
                                        if (
                                          !dropDetails?.collectionIds?.find(
                                            (value) =>
                                              item.collectionId === value
                                          )
                                        ) {
                                          setSearchCollection("");
                                          setDropDetails((prev) => ({
                                            ...prev,
                                            collectionIds: [
                                              ...prev.collectionIds,
                                              item.collectionId,
                                            ],
                                          }));
                                        }
                                      }}
                                    >
                                      <div className="relative w-fit h-fit flex items-center justify-center text-white font-aust text-xs">
                                        {item?.title}
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    <div className="relative w-60 overflow-x-scroll h-fit flex items-center justify-start">
                      <div className="relative w-fit h-fit flex justify-start items-center flex-row gap-2">
                        {dropDetails?.collectionIds?.map(
                          (item: string, index: number) => {
                            return (
                              <div
                                key={index}
                                className="relative w-10 h-10 rounded-sm border border-white"
                              >
                                <Image
                                  className="relative w-full h-full rounded-sm flex"
                                  objectFit="cover"
                                  layout="fill"
                                  src={`${INFURA_GATEWAY}/ipfs/${
                                    allCollections
                                      ?.find(
                                        (value) => value.collectionId == item
                                      )
                                      ?.images?.[0]?.split("ipsf://")?.[1]
                                  }`}
                                />
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {((createCase === "collection" &&
              collectionDetails?.collectionId == "") ||
              (createCase === "drop" && dropDetails?.dropId == "")) && (
              <div
                className={`relative w-44 h-8 bg-piloto border-white border flex items-center justify-center text-white font-aust text-sm ${
                  (createCase === "collection"
                    ? !creationLoading
                    : !createDropLoading) && "cursor-pointer active:scale-95"
                }`}
                onClick={() =>
                  (createCase === "collection"
                    ? !creationLoading
                    : !createDropLoading) &&
                  (createCase === "collection"
                    ? createCollection()
                    : createDrop())
                }
              >
                <div
                  className={`relative w-fit h-fit items-center justify-center flex ${
                    (createCase === "collection"
                      ? creationLoading
                      : createDropLoading) && "animate-spin"
                  }`}
                >
                  {(
                    createCase === "collection"
                      ? creationLoading
                      : createDropLoading
                  ) ? (
                    <AiOutlineLoading color="white" size={15} />
                  ) : (
                    "Create"
                  )}
                </div>
              </div>
            )}
            {((createCase === "drop" && dropDetails?.dropId != "") ||
              (createCase === "collection" &&
                collectionDetails?.collectionId !== "")) && (
              <div className="relative w-fit h-fit flex flex-row gap-2 items-center justify-center">
                <div
                  className={`relative w-28 h-8 bg-piloto border-white border flex items-center justify-center text-white font-aust text-sm ${
                    (createCase === "collection"
                      ? !creationLoading
                      : !createDropLoading) && "cursor-pointer active:scale-95"
                  }`}
                  onClick={() =>
                    (createCase === "collection"
                      ? !creationLoading
                      : !createDropLoading) &&
                    (createCase === "collection"
                      ? createCollection(true)
                      : editDrop())
                  }
                >
                  <div
                    className={`relative w-fit h-fit items-center justify-center flex ${
                      (createCase === "collection"
                        ? creationLoading
                        : createDropLoading) && "animate-spin"
                    }`}
                  >
                    {(
                      createCase === "collection"
                        ? creationLoading
                        : createDropLoading
                    ) ? (
                      <AiOutlineLoading color="white" size={15} />
                    ) : (
                      "Edit"
                    )}
                  </div>
                </div>
                <div
                  className={`relative w-28 h-8 bg-piloto border-white border flex items-center justify-center text-white font-aust text-sm ${
                    (createCase === "collection"
                      ? !creationLoading
                      : !createDropLoading) && "cursor-pointer active:scale-95"
                  }`}
                  onClick={() =>
                    (createCase === "collection"
                      ? !creationLoading
                      : !createDropLoading) &&
                    (createCase === "collection"
                      ? deleteCollection()
                      : deleteDrop())
                  }
                >
                  <div
                    className={`relative w-fit h-fit items-center justify-center flex ${
                      (createCase === "collection"
                        ? creationLoading
                        : createDropLoading) && "animate-spin"
                    }`}
                  >
                    {(
                      createCase === "collection"
                        ? creationLoading
                        : createDropLoading
                    ) ? (
                      <AiOutlineLoading color="white" size={15} />
                    ) : (
                      "Delete"
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
