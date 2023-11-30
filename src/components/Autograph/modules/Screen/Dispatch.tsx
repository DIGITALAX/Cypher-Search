import { FunctionComponent } from "react";
import {
  DispatchProps,
  Drop,
  ScreenDisplay,
} from "../../types/autograph.types";
import Image from "next/legacy/image";
import {
  ACCEPTED_TOKENS_MUMBAI,
  INFURA_GATEWAY,
} from "../../../../../lib/constants";
import { setScreenDisplay } from "../../../../../redux/reducers/screenDisplaySlice";
import Waveform from "./Waveform";
import handleImageError from "../../../../../lib/helpers/handleImageError";

const Dispatch: FunctionComponent<DispatchProps> = ({
  collectionDetails,
  setCollectionDetails,
  handleMedia,
  lensConnected,
  collectionSettings,
  setCollectionSettings,
  filterConstants,
  dispatch,
  allDrops,
  setCreateCase,
  edit,
}): JSX.Element => {
  const microBrands = lensConnected?.metadata?.attributes?.find(
    (item) => item?.key === "microbrandCypher"
  )?.value;
  return (
    <div className="relative items-center justify-center text-white font-bit w-full h-full overflow-y-auto">
      <div className="relative w-full h-full p-4 flex items-start justify-start">
        <div className="relative flex flex-wrap items-start justify-start w-full h-full font-aust text-white gap-4">
          <div className="relative flex flex-col items-start justify-start gap-4">
            <div className="flex flex-col items-start justify-start w-fit h-fit gap-1">
              <div className="relative w-fit h-fit text-sm break-words">
                Collection Title
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
                Collection Description
              </div>

              <textarea
                value={collectionDetails?.description || ""}
                onChange={(e) =>
                  setCollectionDetails((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="relative rounded-md p-1 bg-offBlack text-xs border border-sol h-60 w-60 sm:w-80"
                style={{
                  resize: "none",
                }}
              ></textarea>
              <div
                className={`absolute flex items-center justify-center bottom-1 z-10 right-1 text-xs font-bit ${
                  collectionDetails?.description?.length > 1990
                    ? "text-sol"
                    : "text-white"
                }`}
              >{`${collectionDetails?.description?.length}/2000`}</div>
            </div>
            <div className="flex flex-col items-start justify-start w-fit h-fit gap-1 relative">
              <div className="relative w-fit h-fit text-sm break-words">
                Profilerate Your Creation. Share your prompt?
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
              >{`${collectionDetails?.prompt?.length}/2000`}</div>
            </div>
          </div>
          <div className="relative flex flex-col items-start justify-start gap-4">
            <div className="flex flex-col items-start justify-start w-fit h-fit gap-1">
              <div className="relative w-fit h-fit text-sm break-words">
                Artwork{" "}
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
                          collectionDetails?.images?.[0]?.media?.includes(
                            "ipfs://"
                          )
                            ? `${INFURA_GATEWAY}/ipfs/${
                                collectionDetails?.images?.[0]?.media?.split(
                                  "ipfs://"
                                )?.[1]
                              }`
                            : collectionDetails?.images?.[0]?.media
                        }
                        onError={(e) => handleImageError(e)}
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
                      upload
                      keyValue={
                        collectionDetails?.audio || collectionDetails?.video
                      }
                    />
                  )}
              </div>
            </div>
            <div className="flex flex-col items-start justify-start w-fit h-fit gap-3">
              <div className="relative w-fit h-fit text-sm break-words">
                Connect Microbrand?
              </div>
              <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
                {microBrands && microBrands?.length > 0 ? (
                  <div className="relative w-full h-fit flex flex-col items-start justify-start gap-1">
                    <div className="relative w-fit h-fit text-xs">
                      Current Brands:
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
                        <div className="relative w-fit h-fit flex items-center flex-row gap-1.5 justify-start">
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
                          <div className="relative w-fit h-fit flex items-center justify-center font-aust text-white text-xs">
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
                              className="relative w-full py-1 h-10 flex items-center justify-center text-white border-y border-sol font-aust text-sm cursor-pointer hover:opacity-80"
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
                              <div className="relative w-fit h-fit flex items-center flex-row gap-1.5 justify-start">
                                <div className="relative w-fit h-fit flex items-center justify-center font-aust text-white text-xs">
                                  No Brand
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
                                    className="relative w-full py-1 h-10 flex items-center justify-center text-white border-y border-sol font-aust text-sm cursor-pointer hover:opacity-80"
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
                                    <div className="relative w-fit h-fit flex items-center flex-row gap-1.5 justify-start">
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
                      dispatch(setScreenDisplay(ScreenDisplay.Settings))
                    }
                  >
                    Connect a microbrand in settings.
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start justify-start w-fit h-fit gap-3">
              <div className="relative w-fit h-fit text-sm break-words">
                Select Drop
              </div>
              <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
                {allDrops?.length > 0 ? (
                  <div className="relative w-full h-fit flex flex-col items-start justify-start gap-1">
                    <div className="relative w-fit h-fit text-xs">
                      Available Drops:
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
                        <div className="relative w-fit h-fit flex items-center flex-row gap-1.5 justify-start">
                          <div className="relative w-fit h-fit flex items-center justify-center font-aust text-white text-sm">
                            {
                              allDrops?.find(
                                (item) =>
                                  item.dropId === collectionDetails?.dropId
                              )?.dropDetails?.dropTitle
                            }
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
                            {allDrops?.map((item: Drop, index: number) => {
                              return (
                                <div
                                  key={index}
                                  className="relative w-full py-1 h-10 flex items-center justify-center text-white border-y border-sol font-aust text-sm cursor-pointer hover:opacity-80"
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
                                  <div className="relative w-fit h-fit flex items-center flex-row gap-1.5 justify-start">
                                    <div className="relative w-fit h-fit flex items-center justify-center font-aust text-white text-sm">
                                      {item?.dropDetails?.dropTitle}
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
                    Create a Drop before continuing.
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="relative flex flex-col items-start justify-start gap-4">
            <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
              <div className="relative w-fit h-fit flex text-white font-aust text-sm">
                Price {`( USD )`}
                {collectionSettings?.origin !== "chromadin" &&
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
              {collectionSettings?.origin !== "chromadin" &&
                (collectionDetails?.printType === "sticker" ||
                  collectionDetails?.printType === "poster") &&
                collectionDetails?.sizes
                  ?.split(/,\s*/)
                  ?.slice(1)
                  ?.filter(Boolean)?.length > 0 &&
                collectionDetails?.sizes
                  ?.split(/,\s*/)
                  ?.slice(1)
                  ?.filter(Boolean)
                  .map((size: string, index: number) => (
                    <div key={index}>
                      <div className="relative w-fit h-fit flex text-white font-aust text-sm">
                        Price {`( USD ) ( ${size} )`}
                      </div>
                      <input
                        type="number"
                        value={collectionDetails?.otherPrices?.[index] || ""}
                        onChange={(e) => {
                          const updatedPrices = [
                            ...collectionDetails?.otherPrices,
                          ];
                          updatedPrices[index] = e.target.value;
                          setCollectionDetails((prev) => ({
                            ...prev,
                            otherPrices: updatedPrices,
                          }));
                        }}
                        className="relative rounded-md p-1 bg-offBlack text-xs border border-sol h-10 w-60 max-w-[15rem]"
                        style={{ resize: "none" }}
                      />
                    </div>
                  ))}
            </div>
            <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
              <div className="relative w-fit h-fit flex text-white font-aust text-sm">
                Purchase Tokens
              </div>
              <div className="relative flex flex-row flex-wrap items-start justify-start gap-5 w-full h-fit">
                {ACCEPTED_TOKENS_MUMBAI?.map(
                  (item: string[], indexTwo: number) => {
                    return (
                      <div
                        className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95 ${
                          collectionDetails?.acceptedTokens?.includes(item[2])
                            ? "opacity-100"
                            : "opacity-50"
                        }`}
                        key={indexTwo}
                        onClick={() => {
                          setCollectionDetails((prev) => {
                            const newAcceptedTokens =
                              prev?.acceptedTokens?.includes(item[2])
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
                          height={35}
                        />
                      </div>
                    );
                  }
                )}
              </div>
            </div>
            <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
              <div className="relative w-fit h-fit flex text-white font-aust text-sm">
                Amount
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
                Discovery Tags
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
                filterConstants?.hashtags?.some((tag) =>
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
                      {filterConstants?.hashtags
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
                Eco-Access
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
                      {filterConstants?.access
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
            <div className="relative w-full h-fit flex flex-col items-start justify-start gap-1">
              <div className="relative w-fit h-fit text-sm break-words">
                Visibility
              </div>
              <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1">
                <div
                  className={`relative h-10 flex flex-row justify-between p-2 w-60 max-w-[15rem] items-center justify-center border border-sol rounded-md cursor-pointer bg-offBlack gap-1`}
                  onClick={() =>
                    setCollectionSettings((prev) => ({
                      ...prev,
                      visibilityOpen: !prev.visibilityOpen,
                    }))
                  }
                >
                  <div className="relative w-full whitespace-nowrap h-full flex items-center justify-start font-aust text-white text-xs overflow-x-scroll">
                    {collectionDetails?.visibility}
                  </div>
                  <div className="relative w-4 h-3 flex items-center justify-center">
                    <Image
                      layout="fill"
                      draggable={false}
                      src={`${INFURA_GATEWAY}/ipfs/QmRKmMYJj7KAwf4BDGwrd51tKWoS8djnLGWT5XNdrJMztk`}
                    />
                  </div>
                </div>
                {collectionSettings?.visibilityOpen && (
                  <div className="absolute top-10 bg-offBlack z-10 w-full max-w-[15rem] max-h-[6rem] h-fit flex border border-sol rounded-md overflow-y-scroll">
                    <div className="relative w-full h-fit flex flex-col items-center justify-start">
                      {[
                        [
                          "public",
                          "QmNno9d9M82f21Z1633FBLtvA8ZNH8BSmy7BwSwHnuBEy8",
                        ],
                        [
                          "community",
                          "QmTwkfEqUXHAfY47BeMfQm7wGEtVwLxaRQzy5BrsgKyX8r",
                        ],
                        [
                          "private",
                          "QmVnr2XT1hbkSNBWQNGC4GcTeWJx4cWRFxQjhe26JReQC1",
                        ],
                      ]?.map((item: string[], index: number) => {
                        return (
                          <div
                            key={index}
                            className="relative w-full py-1 h-10 flex items-center justify-center text-white border-y border-sol font-aust opacity-80"
                            // onClick={() => {
                            //   setCollectionSettings((prev) => ({
                            //     ...prev,
                            //     visibilityOpen: !prev.visibilityOpen,
                            //   }));

                            //   setCollectionDetails((prev) => ({
                            //     ...prev,
                            //     visibility: item?.[0],
                            //   }));
                            // }}
                          >
                            <div className="relative w-fit h-fit flex items-center flex-row gap-1.5 justify-start">
                              <div className="relative flex items-center justify-center w-5 h-5 cursor-pointer">
                                <Image
                                  layout="fill"
                                  src={`${INFURA_GATEWAY}/ipfs/${item?.[1]}`}
                                  draggable={false}
                                  onError={(e) => handleImageError(e)}
                                />
                              </div>
                              <div className="relative w-fit h-fit flex items-center justify-center font-aust text-white text-xs">
                                {item?.[0]}
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
            {collectionDetails?.visibility === "community" && (
              <div className="relative w-full h-fit flex flex-col items-start justify-start gap-1">
                <div className="relative w-fit h-fit text-sm break-words">
                  Communities
                </div>
                <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1">
                  <div
                    className={`relative h-10 flex flex-row justify-between p-2 w-60 max-w-[15rem] items-center justify-center border border-sol rounded-md cursor-pointer bg-offBlack gap-1`}
                    onClick={() =>
                      setCollectionSettings((prev) => ({
                        ...prev,
                        communityOpen: !prev.communityOpen,
                      }))
                    }
                  >
                    <div className="relative w-full whitespace-nowrap h-full flex items-center justify-start font-aust text-white text-xs overflow-x-scroll">
                      {collectionDetails?.communities}
                    </div>
                    <div className="relative w-4 h-3 flex items-center justify-center">
                      <Image
                        layout="fill"
                        draggable={false}
                        src={`${INFURA_GATEWAY}/ipfs/QmRKmMYJj7KAwf4BDGwrd51tKWoS8djnLGWT5XNdrJMztk`}
                      />
                    </div>
                  </div>
                  {collectionSettings?.communityOpen && (
                    <div className="absolute top-10 bg-offBlack z-10 w-full max-w-[15rem] max-h-[6rem] h-fit flex border border-sol rounded-md overflow-y-scroll">
                      <div className="relative w-full h-fit flex flex-col items-center justify-start">
                        {filterConstants?.community?.map(
                          (item: string[], index: number) => {
                            return (
                              <div
                                key={index}
                                className="relative w-full py-1 h-10 flex items-center justify-center text-white border-y border-sol font-aust cursor-pointer hover:opacity-80"
                                onClick={() => {
                                  setCollectionSettings((prev) => ({
                                    ...prev,
                                    communityOpen: !prev.communityOpen,
                                  }));
                                  const allArray =
                                    collectionDetails?.communities
                                      ?.split(/,\s*/)
                                      ?.map((t) => t.trim());

                                  if (!allArray.includes(item?.[0].trim())) {
                                    const communityArray =
                                      collectionDetails?.communities?.split(
                                        /,\s*/
                                      );
                                    communityArray[communityArray?.length - 1] =
                                      item?.[0];

                                    setCollectionDetails((prev) => ({
                                      ...prev,
                                      communities:
                                        communityArray?.join(", ") + ", ",
                                    }));
                                  }
                                }}
                              >
                                <div className="relative w-fit h-fit flex items-center flex-row gap-1.5 justify-start">
                                  <div
                                    className="relative flex items-center justify-center rounded-full w-5 h-5 cursor-pointer"
                                    id="pfp"
                                  >
                                    <Image
                                      layout="fill"
                                      src={`${INFURA_GATEWAY}/ipfs/${
                                        item?.[1]?.split("ipfs://")?.[1]
                                      }`}
                                      className="rounded-full"
                                      objectFit="cover"
                                      draggable={false}
                                      onError={(e) => handleImageError(e)}
                                    />
                                  </div>
                                  <div className="relative w-fit h-fit flex items-center justify-center font-aust text-white text-xs">
                                    {item?.[0]}
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
            )}
          </div>
          {collectionSettings?.origin !== "chromadin" && (
            <div className="relative w-fit h-fit flex flex-wrap gap-4">
              <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1">
                <div className="relative w-fit h-fit text-sm break-words">
                  Sizes
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
                        {filterConstants?.sizes?.[
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
                                        filterConstants?.sizes[
                                          (collectionDetails?.printType as "poster") ||
                                            "sticker"
                                        ].indexOf(a) -
                                        filterConstants?.sizes[
                                          (collectionDetails?.printType as "poster") ||
                                            "sticker"
                                        ].indexOf(b)
                                    );
                                  } else {
                                    sizeArray?.sort(
                                      (a, b) =>
                                        filterConstants?.sizes[
                                          "apparel"
                                        ].indexOf(a) -
                                        filterConstants?.sizes[
                                          "apparel"
                                        ].indexOf(b)
                                    );
                                  }

                                  setCollectionDetails((prev) => ({
                                    ...prev,
                                    sizes: sizeArray.join(", ") + ", ",
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
                  Base Colors
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
                        {filterConstants?.colors?.map(
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
                  Print Type
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
                          "sticker",
                          "hoodie",
                          "sleeve",
                          "crop",
                          "shirt",
                          "poster",
                        ]?.map((item: string, index: number) => {
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
                                  (item !== "poster" &&
                                    item !== "sticker" &&
                                    collectionDetails?.sizes
                                      ?.split(/,\s*/)
                                      ?.some(
                                        (item) =>
                                          filterConstants?.sizes?.sticker?.includes(
                                            item
                                          ) ||
                                          filterConstants?.sizes?.poster?.includes(
                                            item
                                          )
                                      )) ||
                                  (item === "sticker" &&
                                    collectionDetails?.sizes
                                      ?.split(/,\s*/)
                                      ?.some(
                                        (item) =>
                                          filterConstants?.sizes?.apparel?.includes(
                                            item
                                          ) ||
                                          filterConstants?.sizes?.poster?.includes(
                                            item
                                          )
                                      )) ||
                                  (item === "poster" &&
                                    collectionDetails?.sizes
                                      ?.split(/,\s*/)
                                      ?.some(
                                        (item) =>
                                          filterConstants?.sizes?.apparel?.includes(
                                            item
                                          ) ||
                                          filterConstants?.sizes?.sticker?.includes(
                                            item
                                          )
                                      ))
                                ) {
                                  sizes = "";
                                }

                                setCollectionDetails((prev) => ({
                                  ...prev,
                                  printType: item,
                                  sizes,
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Dispatch;
