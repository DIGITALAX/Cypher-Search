import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import { ModalContext } from "@/app/providers";
import { ACCEPTED_TOKENS, INFURA_GATEWAY } from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { DispatchProps, ScreenDisplay } from "../types/autograph.types";
import Waveform from "../../Common/modules/Waveform";
import { usePathname } from "next/navigation";
import { getLocaleFromPath } from "@/app/lib/helpers/getLocalPath";

const Dispatch: FunctionComponent<DispatchProps> = ({
  collectionDetails,
  setCollectionDetails,
  handleMedia,
  collectionSettings,
  setCollectionSettings,
  allDrops,
  setCreateCase,
  edit,
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const path = usePathname();
  const microBrands =
    context?.lensConectado?.profile?.metadata?.attributes?.find(
      (item) => item?.key === "microbrandCypher"
    )?.value;

  return (
    <div className="relative items-center justify-center text-white font-bit w-full h-full overflow-y-auto">
      <div className="relative w-full h-full p-4 flex items-start justify-start">
        <div className="relative flex flex-wrap items-start justify-start w-full h-full font-aust text-white gap-4">
          <div className="relative flex flex-col items-start justify-start gap-4">
            <div className="flex flex-col items-start justify-start w-fit h-fit gap-1">
              <div className="relative w-fit h-fit text-sm break-words">
                {dict?.colTi}
              </div>
              <input
                className="relative rounded-md p-1 bg-offBlack text-xs border border-sol h-10 w-60 sm:w-80"
                value={collectionDetails?.title}
                onChange={(e) =>
                  setCollectionDetails((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col items-start justify-start w-fit h-fit gap-1 relative">
              <div className="relative w-fit h-fit text-sm break-words">
                {dict?.colD}
              </div>
              <textarea
                value={collectionDetails?.description || ""}
                onChange={(e) =>
                  setCollectionDetails((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="relative rounded-md p-1 bg-offBlack text-xs border border-sol h-60 w-60 sm:w-80 break-all"
                style={{
                  resize: "none",
                }}
              ></textarea>
              <div
                className={`absolute flex items-center justify-center bottom-1 z-10 right-1 text-xs font-bit break-all ${
                  collectionDetails?.description?.length > 1990
                    ? "text-sol"
                    : "text-white"
                }`}
              >{`${collectionDetails?.description?.length || 0}/2000`}</div>
            </div>
            <div className="flex flex-col items-start justify-start w-fit h-fit gap-1 relative">
              <div className="relative w-fit h-fit text-sm break-words">
                {dict?.prof}
              </div>
              <textarea
                value={collectionDetails?.prompt || ""}
                onChange={(e) =>
                  setCollectionDetails((prev) => ({
                    ...prev,
                    prompt: e.target.value,
                  }))
                }
                className="relative rounded-md p-1 bg-offBlack text-xs border border-sol h-40 w-60 sm:w-80"
                style={{
                  resize: "none",
                }}
              ></textarea>
              <div
                className={`absolute flex items-center justify-center bottom-1 z-10 right-1 text-xs font-bit ${
                  collectionDetails?.prompt?.length > 1990
                    ? "text-sol"
                    : "text-white"
                }`}
              >{`${collectionDetails?.prompt?.length || 0}/2000`}</div>
            </div>
          </div>
          <div className="relative flex flex-col items-start justify-start gap-4">
            <div className="flex flex-col items-start justify-start w-fit h-fit gap-1">
              <div className="relative w-fit h-fit text-sm break-words">
                {dict?.art}{" "}
                {collectionSettings?.media === "static"
                  ? "(png / gif)"
                  : collectionSettings?.media === "video"
                  ? "(mp4)"
                  : "(png / gif + mp3)"}
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center">
                <label
                  className="relative border border-white w-60 sm:w-80 h-80 rounded-sm cursor-pointer p-px"
                  id="pfp"
                >
                  <div className="relative w-full h-full flex items-center justify-center rounded-sm">
                    {collectionDetails?.images?.[0] &&
                    collectionSettings?.media === "static" ? (
                      <Image
                        layout="fill"
                        src={
                          collectionDetails?.images?.[
                            collectionSettings?.origin !== "0"
                              ? collectionSettings?.imageIndex
                              : 0
                          ]?.media?.includes("ipfs://")
                            ? `${INFURA_GATEWAY}/ipfs/${
                                collectionDetails?.images?.[
                                  collectionSettings?.origin !== "0"
                                    ? collectionSettings?.imageIndex
                                    : 0
                                ]?.media?.split("ipfs://")?.[1]
                              }`
                            : collectionDetails?.images?.[
                                collectionSettings?.origin !== "0"
                                  ? collectionSettings?.imageIndex
                                  : 0
                              ]?.media
                        }
                        // onError={(e) => handleImageError(e)}
                        objectFit="cover"
                        draggable={false}
                        className="relative rounded-sm w-full h-full flex"
                      />
                    ) : (
                      <>
                        {collectionSettings?.media === "audio" ? (
                          collectionDetails?.cover && (
                            <Image
                              layout="fill"
                              onError={(e) => handleImageError(e)}
                              src={
                                collectionDetails?.cover?.includes("ipfs://")
                                  ? `${INFURA_GATEWAY}/ipfs/${
                                      collectionDetails?.cover?.split(
                                        "ipfs://"
                                      )?.[1]
                                    }`
                                  : collectionDetails?.cover
                              }
                              objectFit="cover"
                              draggable={false}
                              className="relative rounded-sm w-full h-full flex"
                            />
                          )
                        ) : (
                          <video
                            className="relative rounded-sm w-full h-full flex object-cover"
                            id={collectionDetails?.video}
                            draggable={false}
                            controls={false}
                            playsInline
                            loop
                            key={collectionDetails?.video}
                          >
                            <source
                              src={
                                collectionDetails?.video?.includes("ipfs://")
                                  ? `${INFURA_GATEWAY}/ipfs/${
                                      collectionDetails?.video?.split(
                                        "ipfs://"
                                      )?.[1]
                                    }`
                                  : collectionDetails?.video?.includes("ar://")
                                  ? `https://arweave.net/${collectionDetails?.video
                                      ?.split("ar://")?.[1]
                                      ?.replace(/"/g, "")
                                      ?.trim()}`
                                  : collectionDetails?.video
                              }
                            />
                          </video>
                        )}
                      </>
                    )}
                    <input
                      hidden
                      type="file"
                      accept={
                        collectionSettings?.media === "video"
                          ? "video/mp4"
                          : "image/png, image/gif"
                      }
                      multiple={false}
                      onChange={(e) =>
                        e?.target?.files?.[0] &&
                        handleMedia(
                          e,
                          collectionSettings?.media === "audio"
                            ? "cover"
                            : collectionSettings?.media
                        )
                      }
                    />
                    {collectionSettings?.origin !== "chromadin" && (
                      <div className="absolute z-2 right-2 top-2 w-fit h-fit flex flex-row items-center justify-center gap-1.5 z-10">
                        <div
                          className="relative w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCollectionSettings((prev) => ({
                              ...prev,
                              imageIndex:
                                prev.imageIndex > 0 ? prev.imageIndex - 1 : 3,
                            }));
                          }}
                        >
                          <Image
                            src={`${INFURA_GATEWAY}/ipfs/Qma3jm41B4zYQBxag5sJSmfZ45GNykVb8TX9cE3syLafz2`}
                            layout="fill"
                            draggable={false}
                          />
                        </div>
                        <div
                          className="relative  w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCollectionSettings((prev) => ({
                              ...prev,
                              imageIndex:
                                prev.imageIndex < 3 ? prev.imageIndex + 1 : 0,
                            }));
                          }}
                        >
                          <Image
                            src={`${INFURA_GATEWAY}/ipfs/QmcBVNVZWGBDcAxF4i564uSNGZrUvzhu5DKkXESvhY45m6`}
                            layout="fill"
                            draggable={false}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </label>
                {(collectionDetails?.audio ||
                  collectionSettings?.media === "video" ||
                  collectionSettings?.media === "audio") &&
                  collectionSettings?.media !== "static" && (
                    <Waveform
                      handleMedia={async (e) => {
                        e.preventDefault();
                        e?.target?.files?.[0] &&
                          (await handleMedia(e, "audio"));
                      }}
                      type={collectionSettings?.media}
                      video={collectionDetails?.video}
                      audio={collectionDetails?.audio}
                      upload={
                        collectionSettings?.media === "audio" ? true : false
                      }
                      keyValue={
                        collectionDetails?.audio || collectionDetails?.video
                      }
                    />
                  )}
              </div>
            </div>
            <div className="flex flex-col items-start justify-start w-fit h-fit gap-3">
              <div className="relative w-full h-fit text-sm break-words">
                {dict?.mic}
              </div>
              <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
                {microBrands && microBrands?.length > 0 ? (
                  <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1">
                    <div className="relative w-fit h-fit text-xs">
                      {dict?.marcC}
                    </div>
                    <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1">
                      <div
                        className={`relative h-10 flex flex-row justify-between p-2 w-40 items-center justify-center border border-sol rounded-md cursor-pointer bg-offBlack`}
                        onClick={() =>
                          setCollectionSettings((prev) => ({
                            ...prev,
                            microOpen: !prev.microOpen,
                          }))
                        }
                      >
                        <div className="relative w-full h-fit flex items-center flex-row gap-1.5 justify-center">
                          {collectionDetails?.microbrand?.microbrandCover && (
                            <div
                              className="relative flex items-center justify-center rounded-full w-5 h-5 cursor-pointer"
                              id="pfp"
                            >
                              (
                              <Image
                                onError={(e) => handleImageError(e)}
                                layout="fill"
                                src={`${INFURA_GATEWAY}/ipfs/${
                                  collectionDetails?.microbrand?.microbrandCover?.split(
                                    "ipfs://"
                                  )?.[1]
                                }`}
                                className="rounded-full"
                                objectFit="cover"
                                draggable={false}
                              />
                              )
                            </div>
                          )}
                          <div className="relative w- h-fit flex items-center justify-center font-aust text-white text-xs">
                            {collectionDetails?.microbrand?.microbrand}
                          </div>
                        </div>
                        <div className="relative w-4 h-3 flex items-center justify-center">
                          <Image
                            layout="fill"
                            draggable={false}
                            src={`${INFURA_GATEWAY}/ipfs/QmRKmMYJj7KAwf4BDGwrd51tKWoS8djnLGWT5XNdrJMztk`}
                          />
                        </div>
                      </div>
                      {collectionSettings?.microOpen && (
                        <div className="absolute top-10 bg-offBlack z-10 w-40 max-h-[6rem] h-fit flex border border-sol rounded-md overflow-y-scroll">
                          <div className="relative w-full h-fit flex flex-col items-center justify-start">
                            <div
                              className="relative w-full py-1 h-10 flex items-center justify-center text-white border-y border-sol text-center font-aust text-sm cursor-pointer hover:opacity-80"
                              onClick={() => {
                                setCollectionSettings((prev) => ({
                                  ...prev,
                                  microOpen: !prev.microOpen,
                                }));
                                setCollectionDetails((prev) => ({
                                  ...prev,
                                  microbrand: {
                                    microbrand: "",
                                    microbrandCover: "",
                                  },
                                }));
                              }}
                            >
                              <div className="relative w-full h-fit flex items-center flex-row gap-1.5 justify-center">
                                <div className="relative w-fit h-fit flex items-center justify-center font-aust text-white text-xs">
                                  {dict?.marcN}
                                </div>
                              </div>
                            </div>
                            {JSON.parse(microBrands!)?.map(
                              (
                                item: {
                                  microbrand: string;
                                  microbrandCover: string;
                                },
                                index: number
                              ) => {
                                return (
                                  <div
                                    key={index}
                                    className="relative w-full py-1 h-10 flex items-center justify-center text-white text-center border-y border-sol font-aust text-sm cursor-pointer hover:opacity-80"
                                    onClick={() => {
                                      setCollectionSettings((prev) => ({
                                        ...prev,
                                        microOpen: !prev.microOpen,
                                      }));
                                      setCollectionDetails((prev) => ({
                                        ...prev,
                                        microbrand: item,
                                      }));
                                    }}
                                  >
                                    <div className="relative w-full h-fit flex items-center flex-row gap-1.5 justify-center">
                                      <div
                                        className="relative flex items-center justify-center rounded-full w-5 h-5 cursor-pointer"
                                        id="pfp"
                                      >
                                        <Image
                                          onError={(e) => handleImageError(e)}
                                          layout="fill"
                                          src={`${INFURA_GATEWAY}/ipfs/${
                                            item?.microbrandCover?.split(
                                              "ipfs://"
                                            )?.[1]
                                          }`}
                                          className="rounded-full"
                                          objectFit="cover"
                                          draggable={false}
                                        />
                                      </div>
                                      <div className="relative w-fit h-fit flex items-center justify-center font-aust text-white text-xs">
                                        {item?.microbrand}
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    className="relative text-xs w-fit h-fit flex break-words cursor-pointer"
                    onClick={() =>
                      context?.setScreenDisplay(ScreenDisplay.Settings)
                    }
                  >
                    {dict?.setM}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start justify-start w-fit h-fit gap-3">
              <div className="relative w-fit h-fit text-sm break-words">
                {dict?.dropS}
              </div>
              <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
                {allDrops?.length > 0 ? (
                  <div className="relative w-full h-fit flex flex-col items-start justify-start gap-1">
                    <div className="relative w-full h-fit text-xs">
                      {dict?.dropA}
                    </div>
                    <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1">
                      <div
                        className={`relative h-10 flex flex-row justify-between p-2 w-40 items-center justify-center border border-sol rounded-md cursor-pointer bg-offBlack`}
                        onClick={() => {
                          if (!edit)
                            setCollectionSettings((prev) => ({
                              ...prev,
                              dropOpen: !prev.dropOpen,
                            }));
                        }}
                      >
                        <div className="relative w-full h-fit flex items-center flex-row gap-1.5 justify-center">
                          <div className="relative w-fit h-fit flex items-center justify-center font-aust text-white text-xs">
                            {(allDrops?.find(
                              (item) =>
                                item.dropId === collectionDetails?.dropId
                            )?.metadata?.title?.length || 0) > 20
                              ? allDrops
                                  ?.find(
                                    (item) =>
                                      item.dropId === collectionDetails?.dropId
                                  )
                                  ?.metadata?.title?.slice(0, 17) + "..."
                              : allDrops?.find(
                                  (item) =>
                                    item.dropId === collectionDetails?.dropId
                                )?.metadata?.title}
                          </div>
                        </div>
                        <div className="relative w-4 h-3 flex items-center justify-center">
                          <Image
                            layout="fill"
                            draggable={false}
                            src={`${INFURA_GATEWAY}/ipfs/QmRKmMYJj7KAwf4BDGwrd51tKWoS8djnLGWT5XNdrJMztk`}
                          />
                        </div>
                      </div>
                      {collectionSettings?.dropOpen && (
                        <div className="absolute top-10 bg-offBlack z-10 w-40 max-h-[6rem] h-fit flex border border-sol rounded-md overflow-y-scroll">
                          <div className="relative w-full h-fit flex flex-col items-center justify-start">
                            {allDrops?.map((item, index: number) => {
                              return (
                                <div
                                  key={index}
                                  className="relative w-full py-1 h-10 flex items-center justify-center text-center text-white border-y border-sol font-aust text-sm cursor-pointer hover:opacity-80"
                                  onClick={() => {
                                    if (!edit) {
                                      setCollectionSettings((prev) => ({
                                        ...prev,
                                        dropOpen: !prev.dropOpen,
                                      }));
                                      setCollectionDetails((prev) => ({
                                        ...prev,
                                        dropId: item.dropId,
                                      }));
                                    }
                                  }}
                                >
                                  <div className="relative w-full h-fit flex items-center flex-row gap-1.5 justify-center">
                                    <div className="relative w-fit h-fit flex items-center justify-center font-aust text-white text-xs">
                                      {item?.metadata?.title?.length > 20
                                        ? item?.metadata?.title?.slice(0, 17) +
                                          "..."
                                        : item?.metadata?.title}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    className="relative text-xs w-fit h-fit flex break-words cursor-pointer"
                    onClick={() => setCreateCase("drop")}
                  >
                    {dict?.dropC}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="relative flex flex-col items-start justify-start gap-4">
            <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
              <div className="relative w-fit h-fit flex text-white font-aust text-sm">
                {dict?.pri} {`( USD )`}
                {collectionSettings?.origin !== "0" &&
                  (collectionDetails?.printType === "sticker" ||
                    collectionDetails?.printType === "poster") &&
                  ` ${collectionDetails?.sizes?.split(/,\s*/)?.[0]}`}
              </div>
              <input
                type="number"
                value={collectionDetails?.price}
                onChange={(e) =>
                  setCollectionDetails((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }))
                }
                className="relative rounded-md p-1 bg-offBlack text-xs border border-sol h-10 w-60 max-w-[15rem]"
                style={{
                  resize: "none",
                }}
              />
            </div>
            <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
              <div className="relative w-fit h-fit flex text-white font-aust text-sm">
                {dict?.toks}
              </div>
              <div className="relative flex flex-row flex-wrap items-start justify-start gap-5 w-full h-fit">
                {ACCEPTED_TOKENS?.map((item: string[], indexTwo: number) => {
                  return (
                    <div
                      className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95 ${
                        collectionDetails?.acceptedTokens?.includes(
                          item[2]?.toLowerCase()
                        )
                          ? "opacity-100"
                          : "opacity-50"
                      }`}
                      key={indexTwo}
                      onClick={() => {
                        setCollectionDetails((prev) => {
                          const newAcceptedTokens =
                            prev?.acceptedTokens?.includes(
                              item[2]?.toLowerCase()
                            )
                              ? prev.acceptedTokens.filter(
                                  (token) => token !== item[2]
                                )
                              : [...(prev?.acceptedTokens || []), item[2]];

                          return {
                            ...prev,
                            acceptedTokens: newAcceptedTokens,
                          };
                        });
                      }}
                    >
                      <Image
                        onError={(e) => handleImageError(e)}
                        src={`${INFURA_GATEWAY}/ipfs/${item[0]}`}
                        className="flex rounded-full"
                        draggable={false}
                        width={30}
                        height={30}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
              <div className="relative w-fit h-fit flex text-white font-aust text-sm">
                {dict?.am}
              </div>
              <input
                type="number"
                value={collectionDetails?.amount}
                onChange={(e) =>
                  setCollectionDetails((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
                className="relative rounded-md p-1 bg-offBlack text-xs border border-sol h-10 w-60 max-w-[15rem]"
                style={{
                  resize: "none",
                }}
              />
            </div>
            <div className="flex flex-col items-start justify-start w-fit h-fit gap-1 relative">
              <div className="relative w-fit h-fit text-sm break-words">
                {dict?.tag}
              </div>
              <input
                value={collectionDetails?.tags}
                onChange={(e) =>
                  setCollectionDetails((prev) => ({
                    ...prev,
                    tags: e.target.value,
                  }))
                }
                className="relative rounded-md p-1 bg-offBlack text-xs border border-sol h-10 w-60 max-w-[15rem]"
                style={{
                  resize: "none",
                }}
              />
              {collectionDetails?.tags?.split(",").pop()?.trim() &&
                context?.filterConstants?.hashtags?.some((tag) =>
                  tag
                    .toLowerCase()
                    .includes(
                      collectionDetails.tags
                        .split(",")
                        .pop()
                        ?.trim()
                        .toLowerCase()!
                    )
                ) && (
                  <div className="absolute top-16 bg-offBlack z-10 w-full max-w-[15rem] max-h-[6rem] h-fit flex border border-sol rounded-md overflow-y-scroll">
                    <div className="relative w-full max-w-[15rem] h-fit flex flex-col items-center justify-start">
                      {context?.filterConstants?.hashtags
                        ?.filter((tag) =>
                          tag.toLowerCase().includes(
                            collectionDetails?.tags
                              ?.split(/,\s*|\s+|\s*$/)
                              ?.pop()
                              ?.toLowerCase() || ""
                          )
                        )
                        .map((tag: string, index: number) => (
                          <div
                            key={index}
                            className="relative py-1 h-10 w-full flex items-center justify-center text-white border-y border-sol font-aust text-xs cursor-pointer hover:opacity-80"
                            onClick={() => {
                              const allArray = collectionDetails?.tags
                                .split(/,\s*/)
                                .map((t) => t.trim());

                              if (!allArray.includes(tag.trim())) {
                                const tagsArray =
                                  collectionDetails?.tags?.split(/,\s*/);
                                tagsArray[tagsArray?.length - 1] = tag;
                                const newTags = tagsArray?.join(", ") + ", ";
                                setCollectionDetails((prev) => ({
                                  ...prev,
                                  tags: newTags,
                                }));
                              }
                            }}
                          >
                            <div className="relative w-fit h-fit flex items-center gap-1.5 justify-start">
                              {tag}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
            </div>
            <div className="relative w-full h-fit flex flex-col items-start justify-start gap-1">
              <div className="relative w-fit h-fit text-sm break-words">
                {dict?.ecoA}
              </div>
              <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1">
                <div
                  className={`relative h-10 flex flex-row justify-between p-2 w-60 max-w-[15rem] items-center justify-center border border-sol rounded-md cursor-pointer bg-offBlack gap-1`}
                  onClick={() =>
                    setCollectionSettings((prev) => ({
                      ...prev,
                      accessOpen: !prev.accessOpen,
                    }))
                  }
                >
                  <div className="relative w-full whitespace-nowrap h-full flex items-center justify-start font-aust text-white text-xs overflow-x-scroll">
                    {collectionDetails?.access}
                  </div>
                  <div className="relative w-4 h-3 flex items-center justify-center">
                    <Image
                      layout="fill"
                      draggable={false}
                      src={`${INFURA_GATEWAY}/ipfs/QmRKmMYJj7KAwf4BDGwrd51tKWoS8djnLGWT5XNdrJMztk`}
                    />
                  </div>
                </div>
                {collectionSettings?.accessOpen && (
                  <div className="absolute top-10 bg-offBlack z-10 w-full max-w-[15rem] max-h-[6rem] h-fit flex border border-sol rounded-md overflow-y-scroll">
                    <div className="relative w-full h-fit flex flex-col items-center justify-start">
                      {context?.filterConstants?.access
                        ?.map((item) => item[0])
                        ?.map((item: string, index: number) => {
                          return (
                            <div
                              key={index}
                              className="relative w-full py-1 h-10 flex items-center justify-center text-white border-y border-sol font-aust cursor-pointer hover:opacity-80"
                              onClick={() => {
                                setCollectionSettings((prev) => ({
                                  ...prev,
                                  accessOpen: !prev.accessOpen,
                                }));

                                const allArray = collectionDetails?.access
                                  ?.split(/,\s*/)
                                  ?.map((t) => t.trim());

                                if (!allArray.includes(item.trim())) {
                                  const accessArray =
                                    collectionDetails?.access?.split(/,\s*/);
                                  accessArray[accessArray.length - 1] = item;

                                  setCollectionDetails((prev) => ({
                                    ...prev,
                                    access: accessArray.join(", ") + ", ",
                                  }));
                                } else {
                                  const index = allArray.indexOf(item.trim());
                                  if (index > -1) {
                                    allArray.splice(index, 1);
                                  }
                                  setCollectionDetails((prev) => ({
                                    ...prev,
                                    access: allArray.join(", "),
                                  }));
                                }
                              }}
                            >
                              <div className="relative w-fit h-fit flex items-center justify-center font-aust text-white text-xs">
                                {item}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {collectionSettings?.origin !== "0" &&
          collectionSettings?.origin !== "3" ? (
            <div className="relative w-fit h-fit flex flex-wrap gap-4">
              <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1">
                <div className="relative w-fit h-fit text-sm break-words">
                  {dict?.siz}
                </div>
                <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1">
                  <div
                    className={`relative h-10 flex flex-row justify-between p-2 w-60 max-w-[15rem] items-center justify-center border border-sol rounded-md cursor-pointer bg-offBlack gap-1`}
                    onClick={() =>
                      setCollectionSettings((prev) => ({
                        ...prev,
                        sizeOpen: !prev.sizeOpen,
                      }))
                    }
                  >
                    <div className="relative w-full whitespace-nowrap h-full flex items-center justify-start font-aust text-white text-xs overflow-x-scroll">
                      {collectionDetails?.sizes}
                    </div>
                    <div className="relative w-4 h-3 flex items-center justify-center">
                      <Image
                        layout="fill"
                        draggable={false}
                        src={`${INFURA_GATEWAY}/ipfs/QmRKmMYJj7KAwf4BDGwrd51tKWoS8djnLGWT5XNdrJMztk`}
                      />
                    </div>
                  </div>
                  {collectionSettings?.sizeOpen && (
                    <div className="absolute top-10 bg-offBlack z-10 w-full max-w-[15rem] max-h-[6rem] h-fit flex border border-sol rounded-md overflow-y-scroll">
                      <div className="relative w-full h-fit flex flex-col items-center justify-start">
                        {context?.filterConstants?.sizes?.[
                          collectionDetails?.printType !== "sticker" &&
                          collectionDetails?.printType !== "poster"
                            ? "apparel"
                            : collectionDetails?.printType == "sticker"
                            ? "sticker"
                            : "poster"
                        ]?.map((item: string, index: number) => {
                          return (
                            <div
                              key={index}
                              className="relative w-full py-1 h-10 flex items-center justify-center text-white border-y border-sol font-aust cursor-pointer hover:opacity-80"
                              onClick={() => {
                                setCollectionSettings((prev) => ({
                                  ...prev,
                                  sizeOpen: !prev.sizeOpen,
                                }));

                                const allArray = collectionDetails?.sizes
                                  ?.split(/,\s*/)
                                  ?.map((t) => t.trim());

                                if (!allArray.includes(item.trim())) {
                                  const sizeArray =
                                    collectionDetails?.sizes?.split(/,\s*/);
                                  sizeArray[sizeArray.length - 1] = item;

                                  if (
                                    collectionDetails?.printType ===
                                      "sticker" ||
                                    collectionDetails?.printType === "poster"
                                  ) {
                                    sizeArray?.sort(
                                      (a, b) =>
                                        context?.filterConstants?.sizes!?.[
                                          (collectionDetails?.printType as "poster") ||
                                            "sticker"
                                        ].indexOf(a) -
                                        context?.filterConstants?.sizes!?.[
                                          (collectionDetails?.printType as "poster") ||
                                            "sticker"
                                        ].indexOf(b)
                                    );
                                  } else {
                                    sizeArray?.sort(
                                      (a, b) =>
                                        context?.filterConstants?.sizes!?.[
                                          "apparel"
                                        ].indexOf(a) -
                                        context?.filterConstants?.sizes!?.[
                                          "apparel"
                                        ].indexOf(b)
                                    );
                                  }

                                  setCollectionDetails((prev) => ({
                                    ...prev,
                                    sizes: sizeArray.join(", ") + ", ",
                                  }));
                                } else {
                                  const index = allArray.indexOf(item.trim());
                                  if (index > -1) {
                                    allArray.splice(index, 1);
                                  }
                                  setCollectionDetails((prev) => ({
                                    ...prev,
                                    sizes: allArray.join(", "),
                                  }));
                                }
                              }}
                            >
                              <div className="relative w-fit h-fit flex items-center justify-center font-aust text-white text-xs">
                                {item}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1">
                <div className="relative w-fit h-fit text-sm break-words">
                  {dict?.col}
                </div>
                <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1">
                  <div
                    className={`relative h-10 flex flex-row justify-between p-2 w-60 max-w-[15rem] items-center justify-center border border-sol rounded-md cursor-pointer bg-offBlack gap-1`}
                    onClick={() =>
                      setCollectionSettings((prev) => ({
                        ...prev,
                        colorOpen: !prev.colorOpen,
                      }))
                    }
                  >
                    <div className="relative w-full whitespace-nowrap h-full flex items-center justify-start font-aust text-white text-xs overflow-x-scroll">
                      {collectionDetails?.colors}
                    </div>
                    <div className="relative w-4 h-3 flex items-center justify-center">
                      <Image
                        layout="fill"
                        draggable={false}
                        src={`${INFURA_GATEWAY}/ipfs/QmRKmMYJj7KAwf4BDGwrd51tKWoS8djnLGWT5XNdrJMztk`}
                      />
                    </div>
                  </div>
                  {collectionSettings?.colorOpen && (
                    <div className="absolute top-10 bg-offBlack z-10 w-full max-w-[15rem] max-h-[6rem] h-fit flex border border-sol rounded-md overflow-y-scroll">
                      <div className="relative w-full h-fit flex flex-col items-center justify-start">
                        {context?.filterConstants?.colors?.map(
                          (item: string, index: number) => {
                            return (
                              <div
                                key={index}
                                className="relative w-full py-1 h-10 flex items-center justify-center text-white border-y border-sol font-aust cursor-pointer hover:opacity-80"
                                onClick={() => {
                                  setCollectionSettings((prev) => ({
                                    ...prev,
                                    colorOpen: !prev.colorOpen,
                                  }));

                                  const allArray = collectionDetails?.colors
                                    ?.split(/,\s*/)
                                    ?.map((t) => t.trim());

                                  if (!allArray.includes(item.trim())) {
                                    const colorArray =
                                      collectionDetails?.colors?.split(/,\s*/);
                                    colorArray[colorArray.length - 1] = item;

                                    setCollectionDetails((prev) => ({
                                      ...prev,
                                      colors: colorArray.join(", ") + ", ",
                                    }));
                                  } else {
                                    const index = allArray.indexOf(item.trim());
                                    if (index > -1) {
                                      allArray.splice(index, 1);
                                    }
                                    setCollectionDetails((prev) => ({
                                      ...prev,
                                      colors: allArray.join(", "),
                                    }));
                                  }
                                }}
                              >
                                <div
                                  className="relative w-5 h-5 flex items-center rounded-full justify-center border border-white"
                                  style={{
                                    backgroundColor: item,
                                  }}
                                ></div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1">
                <div className="relative w-fit h-fit text-sm break-words">
                  {dict?.type}
                </div>
                <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1">
                  <div
                    className={`relative h-10 flex flex-row justify-between p-2 w-60 max-w-[15rem] items-center justify-center border border-sol rounded-md cursor-pointer bg-offBlack gap-1`}
                    onClick={() =>
                      setCollectionSettings((prev) => ({
                        ...prev,
                        printOpen: !prev.printOpen,
                      }))
                    }
                  >
                    <div className="relative w-full whitespace-nowrap h-full flex items-center justify-start font-aust text-white text-xs overflow-x-scroll">
                      {collectionDetails?.printType}
                    </div>
                    <div className="relative w-4 h-3 flex items-center justify-center">
                      <Image
                        layout="fill"
                        draggable={false}
                        src={`${INFURA_GATEWAY}/ipfs/QmRKmMYJj7KAwf4BDGwrd51tKWoS8djnLGWT5XNdrJMztk`}
                      />
                    </div>
                  </div>
                  {collectionSettings?.printOpen && (
                    <div className="absolute top-10 bg-offBlack z-10 w-full max-w-[15rem] max-h-[6rem] h-fit flex border border-sol rounded-md overflow-y-scroll">
                      <div className="relative w-full h-fit flex flex-col items-center justify-start">
                        {[
                          { en: "sticker", es: "pegatina" },
                          { en: "hoodie", es: "sudadera" },
                          { en: "sleeve", es: "mangas largas" },
                          { en: "crop", es: "corto" },
                          { en: "shirt", es: "camiseta" },
                          { en: "poster", es: "cartel" },
                        ]?.map(
                          (item: { es: string; en: string }, index: number) => {
                            return (
                              <div
                                key={index}
                                className="relative w-full py-1 h-10 flex items-center justify-center text-white border-y border-sol font-aust cursor-pointer hover:opacity-80"
                                onClick={() => {
                                  setCollectionSettings((prev) => ({
                                    ...prev,
                                    printOpen: !prev.printOpen,
                                  }));

                                  let sizes = collectionDetails?.sizes;

                                  if (
                                    (item.en !== "poster" &&
                                      item.en !== "sticker" &&
                                      collectionDetails?.sizes
                                        ?.split(/,\s*/)
                                        ?.some(
                                          (item) =>
                                            context?.filterConstants?.sizes?.sticker?.includes(
                                              item
                                            ) ||
                                            context?.filterConstants?.sizes?.poster?.includes(
                                              item
                                            )
                                        )) ||
                                    (item.en === "sticker" &&
                                      collectionDetails?.sizes
                                        ?.split(/,\s*/)
                                        ?.some(
                                          (item) =>
                                            context?.filterConstants?.sizes?.apparel?.includes(
                                              item
                                            ) ||
                                            context?.filterConstants?.sizes?.poster?.includes(
                                              item
                                            )
                                        )) ||
                                    (item.en === "poster" &&
                                      collectionDetails?.sizes
                                        ?.split(/,\s*/)
                                        ?.some(
                                          (item) =>
                                            context?.filterConstants?.sizes?.apparel?.includes(
                                              item
                                            ) ||
                                            context?.filterConstants?.sizes?.sticker?.includes(
                                              item
                                            )
                                        ))
                                  ) {
                                    sizes = "";
                                  }

                                  setCollectionDetails((prev) => ({
                                    ...prev,
                                    printType: item.en,
                                    sizes,
                                  }));
                                }}
                              >
                                <div className="relative w-fit h-fit flex items-center justify-center font-aust text-white text-xs">
                                  {item?.[getLocaleFromPath(path)]}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {collectionSettings?.origin == "1" && (
                <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1">
                  <div className="relative w-fit h-fit text-sm break-words">
                    {dict?.chrom}
                  </div>
                  <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1">
                    <div
                      className={`relative h-10 flex flex-row justify-between p-2 w-60 max-w-[15rem] items-center justify-center border border-sol rounded-md cursor-pointer bg-offBlack gap-1`}
                      onClick={() =>
                        setCollectionSettings((prev) => ({
                          ...prev,
                          chromadinOpen: !prev.chromadinOpen,
                        }))
                      }
                    >
                      <div className="relative w-full whitespace-nowrap h-full flex items-center justify-start font-aust text-white text-xs overflow-x-scroll">
                        {collectionDetails?.onChromadin}
                      </div>
                      <div className="relative w-4 h-3 flex items-center justify-center">
                        <Image
                          layout="fill"
                          draggable={false}
                          src={`${INFURA_GATEWAY}/ipfs/QmRKmMYJj7KAwf4BDGwrd51tKWoS8djnLGWT5XNdrJMztk`}
                        />
                      </div>
                    </div>
                    {collectionSettings?.chromadinOpen && (
                      <div className="absolute top-10 bg-offBlack z-10 w-full max-w-[15rem] max-h-[6rem] h-fit flex border border-sol rounded-md overflow-y-scroll">
                        <div className="relative w-full h-fit flex flex-col items-center justify-start">
                          {[
                            dict?.yes?.toLowerCase(),
                            dict?.no?.toLowerCase(),
                          ]?.map((item: string, index: number) => {
                            return (
                              <div
                                key={index}
                                className="relative w-full py-1 h-10 flex items-center justify-center text-white border-y border-sol font-aust cursor-pointer hover:opacity-80"
                                onClick={() => {
                                  setCollectionSettings((prev) => ({
                                    ...prev,
                                    chromadinOpen: !prev.chromadinOpen,
                                  }));

                                  setCollectionDetails((prev) => ({
                                    ...prev,
                                    onChromadin: item,
                                  }));
                                }}
                              >
                                <div className="relative w-fit h-fit flex items-center justify-center font-aust text-white text-xs">
                                  {item}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            collectionSettings?.origin == "3" && (
              <div className="relative w-fit h-fit flex flex-col gap-4">
                <div className="relative w-fit h-fit flex flex-wrap gap-4">
                  <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1">
                    <div className="relative w-fit h-fit text-sm break-words">
                      Sex
                    </div>
                    <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1">
                      <div
                        className={`relative h-10 flex flex-row justify-between p-2 w-60 max-w-[15rem] items-center justify-center border border-sol rounded-md cursor-pointer bg-offBlack gap-1`}
                        onClick={() =>
                          setCollectionSettings((prev) => ({
                            ...prev,
                            sexOpen: !prev.sexOpen,
                          }))
                        }
                      >
                        <div className="relative w-full whitespace-nowrap h-full flex items-center justify-start font-aust text-white text-xs overflow-x-scroll">
                          {collectionDetails?.sex}
                        </div>
                        <div className="relative w-4 h-3 flex items-center justify-center">
                          <Image
                            layout="fill"
                            draggable={false}
                            src={`${INFURA_GATEWAY}/ipfs/QmRKmMYJj7KAwf4BDGwrd51tKWoS8djnLGWT5XNdrJMztk`}
                          />
                        </div>
                      </div>
                      {collectionSettings?.sexOpen && (
                        <div className="absolute top-10 bg-offBlack z-10 w-full max-w-[15rem] max-h-[6rem] h-fit flex border border-sol rounded-md overflow-y-scroll">
                          <div className="relative w-full h-fit flex flex-col items-center justify-start">
                            {context?.filterConstants?.sexes?.map(
                              (item: string, index: number) => {
                                return (
                                  <div
                                    key={index}
                                    className="relative w-full py-1 h-10 flex items-center justify-center text-white border-y border-sol font-aust cursor-pointer hover:opacity-80"
                                    onClick={() => {
                                      setCollectionSettings((prev) => ({
                                        ...prev,
                                        sexOpen: !prev.sexOpen,
                                      }));

                                      setCollectionDetails((prev) => ({
                                        ...prev,
                                        sex: item,
                                      }));
                                    }}
                                  >
                                    <div className="relative w-fit h-fit flex items-center justify-center font-aust text-white text-xs">
                                      {item}
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1">
                    <div className="relative w-fit h-fit text-sm break-words">
                      {dict?.sty}
                    </div>
                    <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1">
                      <div
                        className={`relative h-10 flex flex-row justify-between p-2 w-60 max-w-[15rem] items-center justify-center border border-sol rounded-md cursor-pointer bg-offBlack gap-1`}
                        onClick={() =>
                          setCollectionSettings((prev) => ({
                            ...prev,
                            styleOpen: !prev.styleOpen,
                          }))
                        }
                      >
                        <div className="relative w-full whitespace-nowrap h-full flex items-center justify-start font-aust text-white text-xs overflow-x-scroll">
                          {collectionDetails?.style}
                        </div>
                        <div className="relative w-4 h-3 flex items-center justify-center">
                          <Image
                            layout="fill"
                            draggable={false}
                            src={`${INFURA_GATEWAY}/ipfs/QmRKmMYJj7KAwf4BDGwrd51tKWoS8djnLGWT5XNdrJMztk`}
                          />
                        </div>
                      </div>
                      {collectionSettings?.styleOpen && (
                        <div className="absolute top-10 bg-offBlack z-10 w-full max-w-[15rem] max-h-[6rem] h-fit flex border border-sol rounded-md overflow-y-scroll">
                          <div className="relative w-full h-fit flex flex-col items-center justify-start">
                            {context?.filterConstants?.styles
                              ?.map((item) => item?.[0])
                              ?.map((item: string, index: number) => {
                                return (
                                  <div
                                    key={index}
                                    className="relative w-full py-1 h-10 flex items-center justify-center text-white border-y border-sol font-aust cursor-pointer hover:opacity-80"
                                    onClick={() => {
                                      setCollectionSettings((prev) => ({
                                        ...prev,
                                        styleOpen: !prev.styleOpen,
                                      }));

                                      setCollectionDetails((prev) => ({
                                        ...prev,
                                        style: item,
                                      }));
                                    }}
                                  >
                                    <div className="relative w-fit h-fit flex items-center justify-center font-aust text-white text-xs">
                                      {item}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start justify-start w-fit h-fit gap-1 relative">
                  <div className="relative w-fit h-fit text-sm break-words">
                    {dict?.add}
                  </div>
                  <textarea
                    value={collectionDetails?.extra || ""}
                    onChange={(e) =>
                      setCollectionDetails((prev) => ({
                        ...prev,
                        extra: e.target.value,
                      }))
                    }
                    className="relative rounded-md p-1 bg-offBlack text-xs border border-sol h-40 w-60 sm:w-80 break-all"
                    style={{
                      resize: "none",
                    }}
                  ></textarea>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Dispatch;
