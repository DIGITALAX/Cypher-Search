import { FunctionComponent } from "react";
import { GalleryScreenProps } from "../../types/autograph.types";
import { AiOutlineLoading } from "react-icons/ai";
import SwitchCreate from "./SwitchCreate";
import Image from "next/legacy/image";
import { F3M_ADDRESS, INFURA_GATEWAY } from "../../../../../lib/constants";
import { Creation } from "@/components/Tiles/types/tiles.types";
import handleImageError from "../../../../../lib/helpers/handleImageError";
import MediaSwitch from "@/components/Common/modules/MediaSwitch";
import { ImCross } from "react-icons/im";

const Gallery: FunctionComponent<GalleryScreenProps> = ({
  setCollectionDetails,
  collectionDetails,
  createDrop,
  createCollection,
  creationLoading,
  t,
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
  locale,
  lensConnected,
  filterConstants,
  dispatch,
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
  address,
}): JSX.Element => {
  return (
    <div className="relative flex flex-col tablet:flex-row gap-4 items-start justify-center w-full h-full">
      <div className="relative flex w-full tablet:w-4/5 h-fit items-start justify-center rounded-sm">
        <div
          className="relative w-full h-full flex flex-col items-center justify-start gap-5 p-px"
          id="pfp"
        >
          <div
            className={`relative w-full bg-blurs flex bg-cover rounded-sm p-3 justify-center h-[35rem] overflow-y-scroll ${
              (!createCase &&
                (allCollections?.length < 0 || collectionLoading)) ||
              (createCase === "drop" && (allDrops?.length > 0 || dropsLoading))
                ? "items-start"
                : "items-center"
            }`}
          >
            <SwitchCreate
              t={t}
              locale={locale}
              setCreateCase={setCreateCase}
              dropDetails={dropDetails}
              dropsLoading={dropsLoading}
              collectionLoading={collectionLoading}
              allDrops={allDrops}
              setDropDetails={setDropDetails}
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
              edit={
                createCase === "collection" &&
                collectionDetails?.collectionId !== ""
              }
            />
          </div>
        </div>
      </div>
      <div
        className="relative flex w-full tablet:w-80 h-fit p-px flex-col items-start justify-start"
        id="mar"
      >
        <div className="relative w-full h-fit tablet:h-[35rem] flex flex-col bg-piloto gap-6 items-center justify-start p-3">
          {!createCase && (
            <div className="font-bit text-white text-xs text-center flex w-4/5 h-fit relative">
              {t("fine")}
            </div>
          )}
          {!isDesigner && (
            <div className="relative w-full h-fit flex items-center justify-center flex-col gap-1">
              <div className="relative w-fit h-fit flex items-center justify-center text-center font-bit text-white text-sm">
                {t("mint")}
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
                      t("send")
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
                  {t("back")}
                </div>
              </div>
            )}

            {!createCase && (
              <>
                <div
                  className="relative w-full h-10 bg-olor border border-[#DAB275] flex items-center justify-center text-saph font-bit text-lg cursor-pointer active:scale-95"
                  onClick={() => {
                    if (isDesigner) {
                      setCreateCase("collection");
                      setCollectionDetails({
                        title: "",
                        description: "",
                        collectionId: "",
                        price: "",
                        acceptedTokens: [
                          "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
                          "0x6968105460f67c3bf751be7c15f92f5286fd0ce5",
                        ],
                        otherPrices: [],
                        printType: "",
                        cover: "",
                        images: [],
                        profileId: "",
                        pubId: "",
                        video: "",
                        audio: "",
                        tags: "",
                        prompt: "",
                        amount: "",
                        visibility: "public",
                        sizes: "",
                        colors: "",
                        profileHandle: "",
                        microbrand: {
                          microbrand: "",
                          microbrandCover: "",
                        },
                        onChromadin: "no",
                        access: "",
                        dropId: "",
                        dropTitle: "",
                        dropCover: "",
                        dropCollectionIds: [],
                        communities: "",
                        sex: "",
                        style: "",
                        extra: "",
                      });
                      setCollectionSettings({
                        media: "static",
                        origin: "chromadin",
                        microOpen: false,
                        communityOpen: false,
                        accessOpen: false,
                        visibilityOpen: false,
                        dropOpen: false,
                        printOpen: false,
                        colorOpen: false,
                        sizeOpen: false,
                        chromadinOpen: false,
                        sexOpen: false,
                        styleOpen: false,
                        imageIndex: 0,
                      });
                    }
                  }}
                >
                  <div className="relative w-fit h-fit items-center justify-center flex top-1">
                    {t("new")}
                  </div>
                </div>
                <div
                  className="relative w-full h-10 bg-olor border border-[#DAB275] flex items-center justify-center text-saph font-bit text-lg cursor-pointer active:scale-95"
                  onClick={() => isDesigner && setCreateCase("drop")}
                >
                  <div className="relative w-fit h-fit items-center justify-center flex top-1">
                    {t("newD")}
                  </div>
                </div>
              </>
            )}
            {createCase === "collection" && (
              <div className="relative w-full h-fit flex flex-col sm:flex-row tablet:flex-col items-start justify-start gap-4">
                <div className="relative w-full h-fit flex flex-col items-center justify-start gap-2">
                  <div className="relative w-fit h-fit font-bit text-white text-sm">
                    {t("orig")}
                  </div>
                  <div className="relative w-full h-fit flex overflow-y-scroll max-h-[14rem]">
                    <div className="relative w-full h-fit flex flex-col items-center justify-start gap-2">
                      {[
                        { es: "chromadin", en: "chromadin" },
                        { es: "coinop", en: "coinop" },
                        { es: "oyente", en: "listener" },
                        {
                          es: "autógrafo trimestral",
                          en: "autograph quarterly",
                        },
                        { es: "leyenda", en: "legend" },
                        { es: "el dial", en: "the dial" },
                        { es: "f3m", en: "f3m" },
                      ]?.map(
                        (item: { es: string; en: string }, index: number) => {
                          return (
                            <div
                              key={index}
                              className={`relative w-44 h-8 bg-[#DAB275] border-olor flex items-center justify-center text-white font-bit text-sm ${
                                item?.en === collectionSettings?.origin
                                  ? "border-2"
                                  : "border"
                              } ${
                                ((index === 6 &&
                                  address?.toLowerCase() ==
                                    F3M_ADDRESS?.toLowerCase()) ||
                                  index == 0 ||
                                  index == 1 ||
                                  index == 2) &&
                                createCase === "collection" &&
                                collectionDetails?.collectionId == ""
                                  ? "cursor-pointer active:scale-95"
                                  : "opacity-50"
                              }`}
                              onClick={() =>
                                (index === 0 ||
                                  index === 1 ||
                                  index === 2 ||
                                  (index === 6 && address === F3M_ADDRESS)) &&
                                collectionDetails?.collectionId == "" &&
                                setCollectionSettings((prev) => ({
                                  ...prev,
                                  origin: item?.en,
                                  imageIndex: 0,
                                }))
                              }
                            >
                              <div className="relative w-fit h-fit items-center justify-center flex top-1">
                                {item?.[locale as "en" | "es"]}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
                <div className="relative w-full h-fit flex flex-col items-center justify-start gap-2">
                  <div className="relative w-fit h-fit font-bit text-white text-sm">
                    {t("med")}
                  </div>
                  <div className="relative w-full h-fit flex flex-col items-center justify-start gap-2">
                    {[
                      { es: "estática", en: "static" },
                      { es: "audio", en: "audio" },
                      { es: "vídeo", en: "video" },
                    ]?.map(
                      (item: { es: string; en: string }, index: number) => {
                        return (
                          <div
                            key={index}
                            className={`relative w-44 h-8 bg-[#DAB275] border-olor flex items-center justify-center text-white font-bit text-sm ${
                              collectionSettings?.media === item?.en
                                ? "border-2"
                                : "border"
                            } ${
                              collectionSettings?.origin == "chromadin"
                                ? "cursor-pointer active:scale-95"
                                : "opacity-50"
                            }`}
                            onClick={() =>
                              collectionSettings?.origin == "chromadin" &&
                              setCollectionSettings((prev) => ({
                                ...prev,
                                media: item.en,
                              }))
                            }
                          >
                            <div className="relative w-fit h-fit items-center justify-center flex top-px">
                              {item?.[locale as "en" | "es"]}
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
                    <div className="flex flex-col items-start justify-start w-fit h-fit gap-1 font-aust text-white">
                      <div className="relative w-fit h-fit text-sm">
                        {t("dropT")}
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
                            onError={(e) => handleImageError(e)}
                            src={
                              dropDetails?.cover?.includes("ipfs://")
                                ? `${INFURA_GATEWAY}/ipfs/${
                                    dropDetails?.cover?.split("ipfs://")?.[1]
                                  }`
                                : dropDetails?.cover?.includes("ar://")
                                ? `https://arweave.net/${dropDetails?.cover
                                    ?.split("ar://")?.[1]
                                    ?.replace(/"/g, "")
                                    ?.trim()}`
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
                        <div className="flex flex-col items-start justify-start w-fit h-fit gap-1 font-aust text-white relative">
                          <div className="relative w-fit h-fit text-sm">
                            {t("addC")}
                          </div>
                          <input
                            className="relative rounded-md p-1 bg-offBlack text-xs border border-sol h-10 w-60"
                            value={searchCollection}
                            onChange={(e) =>
                              setSearchCollection(e.target.value)
                            }
                          />
                          {allCollections?.filter((item) =>
                            item?.collectionMetadata?.title
                              ?.toLowerCase()
                              ?.includes(searchCollection?.toLowerCase())
                          )?.length > 0 &&
                            searchCollection?.trim() !== "" && (
                              <div className="absolute w-full max-h-[10rem] h-fit flex overflow-y-scroll bg-offBlack z-1 border border-sol rounded-md items-start top-[4.2rem]">
                                <div className="relative w-full h-fit flex flex-col justify-start">
                                  {allCollections
                                    ?.filter((item) =>
                                      item?.collectionMetadata?.title
                                        ?.toLowerCase()
                                        ?.includes(
                                          searchCollection?.toLowerCase()
                                        )
                                    )
                                    ?.map((item: Creation, index: number) => {
                                      return (
                                        <div
                                          key={index}
                                          className="relative px-2 py-1 text-center flex justify-center items-center hover:opacity-70 cursor-pointer h-10 w-full active:scale-95"
                                          onClick={() => {
                                            if (
                                              !dropDetails?.collectionIds?.find(
                                                (value) =>
                                                  item.collectionId === value
                                              )
                                            ) {
                                              setDropDetails((prev) => ({
                                                ...prev,
                                                collectionIds: [
                                                  ...prev.collectionIds,
                                                  item?.collectionId,
                                                ],
                                              }));
                                            }
                                            setSearchCollection("");
                                          }}
                                        >
                                          <div className="relative w-fit h-fit flex items-center justify-center text-white font-aust text-xs">
                                            {item?.collectionMetadata?.title}
                                          </div>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            )}
                        </div>
                      </>
                    )}
                    <div className="relative w-60 overflow-x-scroll h-fit flex items-center justify-start">
                      <div className="relative w-fit h-fit flex justify-start items-center flex-row gap-2">
                        {dropDetails?.collectionIds?.map(
                          (item: string, index: number) => {
                            return (
                              <div
                                key={index}
                                className="relative w-10 h-10 rounded-sm border border-white "
                              >
                                <MediaSwitch
                                  type={
                                    allCollections?.find(
                                      (value) => value.collectionId == item
                                    )?.collectionMetadata?.mediaTypes?.[0] ==
                                    "video"
                                      ? "video"
                                      : allCollections?.find(
                                          (value) => value.collectionId == item
                                        )?.collectionMetadata
                                          ?.mediaTypes?.[0] == "audio"
                                      ? "audio"
                                      : "image"
                                  }
                                  hidden
                                  classNameImage={
                                    "relative w-full h-full rounded-sm flex"
                                  }
                                  classNameVideo={{
                                    objectFit: "cover",
                                    display: "flex",
                                    width: "100%",
                                    height: "100%",
                                    alignItems: "center",
                                    justifyItems: "center",
                                    borderRadius: "0.125rem",
                                    position: "relative",
                                  }}
                                  classNameAudio={
                                    "relative w-full h-full rounded-sm flex"
                                  }
                                  srcUrl={
                                    allCollections?.find(
                                      (value) => value.collectionId == item
                                    )?.collectionMetadata?.mediaTypes?.[0] ==
                                    "video"
                                      ? allCollections?.find(
                                          (value) => value.collectionId == item
                                        )?.collectionMetadata?.video!
                                      : allCollections?.find(
                                          (value) => value.collectionId == item
                                        )?.collectionMetadata
                                          ?.mediaTypes?.[0] == "audio"
                                      ? `${INFURA_GATEWAY}/ipfs/${
                                          allCollections
                                            ?.find(
                                              (value) =>
                                                value.collectionId == item
                                            )
                                            ?.collectionMetadata?.audio?.split(
                                              "ipfs://"
                                            )?.[1]
                                        }`
                                      : `${INFURA_GATEWAY}/ipfs/${
                                          allCollections
                                            ?.find(
                                              (value) =>
                                                value.collectionId == item
                                            )
                                            ?.collectionMetadata?.images?.[0]?.split(
                                              "ipfs://"
                                            )?.[1]
                                        }`
                                  }
                                  srcCover={
                                    allCollections?.find(
                                      (value) => value.collectionId == item
                                    )?.collectionMetadata?.mediaCover
                                      ? `${INFURA_GATEWAY}/ipfs/${
                                          allCollections
                                            ?.find(
                                              (value) =>
                                                value.collectionId == item
                                            )
                                            ?.collectionMetadata?.mediaCover?.split(
                                              "ipfs://"
                                            )?.[1]
                                        }`
                                      : undefined
                                  }
                                />
                                <div
                                  className="absolute top-2.5 left-2 rounded-full w-5 h-5 flex items-center justify-center bg-offBlack border border-white cursor-pointer hover:opacity-70 active:scale-95"
                                  onClick={() => {
                                    if (
                                      dropDetails?.collectionIds?.find(
                                        (value) =>
                                          allCollections?.find(
                                            (value) =>
                                              value.collectionId == item
                                          )?.collectionId === value
                                      )
                                    ) {
                                      setDropDetails((prev) => {
                                        const obj = { ...prev };
                                        const filteredArray =
                                          obj?.collectionIds?.filter(
                                            (value) =>
                                              value !==
                                              allCollections?.find(
                                                (collection) =>
                                                  collection.collectionId ===
                                                  item
                                              )?.collectionId
                                          );

                                        obj.collectionIds = filteredArray;

                                        return obj;
                                      });
                                    }
                                  }}
                                >
                                  <ImCross color="white" size={7} />
                                </div>
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
                    t("crea")
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
                      t("edit")
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
                      t("delete")
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
