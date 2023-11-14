import { FunctionComponent } from "react";
import { DispatchProps } from "../../types/autograph.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY, TAGS } from "../../../../../lib/constants";

const Dispatch: FunctionComponent<DispatchProps> = ({
  collectionDetails,
  setCollectionDetails,
  type,
  handleMedia,
  lensConnected,
  collectionSettings,
  setCollectionSettings,
}): JSX.Element => {
  const microBrands = lensConnected?.metadata?.attributes?.find(
    (item) => item?.key === "microbrandCypher"
  )?.value;
  console.log(
    TAGS.some((tag) =>
      tag
        .toLowerCase()
        .includes(
          collectionDetails?.tags.split(",").pop()?.trim().toLowerCase()!
        )
    )
  );
  return (
    <div className="relative items-center justify-center text-white font-bit w-full h-full overflow-y-none">
      <div className="relative w-full h-full p-4 flex items-start justify-start">
        <div className="relative flex flex-wrap items-start justify-start w-full h-full font-aust text-white gap-4">
          <div className="relative flex flex-col items-start justify-start gap-4">
            <div className="flex flex-col items-start justif-start w-fit h-fit gap-1">
              <div className="relative w-fit h-fit text-sm">
                Collection Title
              </div>
              <input
                className="relative rounded-md p-1 bg-offBlack text-xs border border-sol h-8 w-80"
                value={collectionDetails?.title}
                onChange={(e) =>
                  setCollectionDetails((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col items-start justif-start w-fit h-fit gap-1">
              <div className="relative w-fit h-fit text-sm">
                Collection Description
              </div>
              <textarea
                value={collectionDetails?.description}
                onChange={(e) =>
                  setCollectionDetails((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="relative rounded-md p-1 bg-offBlack text-xs border border-sol h-60 w-80"
                style={{
                  resize: "none",
                }}
              ></textarea>
            </div>
            <div className="flex flex-col items-start justif-start w-fit h-fit gap-1">
              <div className="relative w-fit h-fit text-sm">
                Profilerate Your Creation. Share your prompt?
              </div>
              <textarea
                value={collectionDetails?.prompt}
                onChange={(e) =>
                  setCollectionDetails((prev) => ({
                    ...prev,
                    prompt: e.target.value,
                  }))
                }
                className="relative rounded-md p-1 bg-offBlack text-xs border border-sol h-40 w-80"
                style={{
                  resize: "none",
                }}
              ></textarea>
            </div>
          </div>
          <div className="relative flex flex-col items-start justify-start gap-4">
            <div className="flex flex-col items-start justif-start w-fit h-fit gap-1">
              <div className="relative w-fit h-fit text-sm">
                Artwork{" "}
                {type === "static"
                  ? "(png or gif)"
                  : type === "video"
                  ? "(mp4)"
                  : "(mp3)"}
              </div>
              <label
                className="relative border border-white w-80 h-80 rounded-sm cursor-pointer p-px"
                id="pfp"
              >
                <div className="relative w-full h-full flex items-center justify-center rounded-sm">
                  {collectionDetails?.images?.[0] &&
                    (type === "static" ? (
                      <Image
                        layout="fill"
                        src={collectionDetails?.images?.[0]}
                        objectFit="cover"
                        draggable={false}
                        className="relative rounded-sm w-full h-full flex"
                      />
                    ) : type === "video" ? (
                      <video
                        className="relative rounded-sm w-full h-full flex object-cover"
                        draggable={false}
                      >
                        <source src={collectionDetails?.video} />
                      </video>
                    ) : (
                      <audio
                        draggable={false}
                        className="relative rounded-sm w-full h-full flex"
                      >
                        <source src={collectionDetails?.audio} />
                      </audio>
                    ))}
                  <input
                    hidden
                    type="file"
                    accept={
                      type === "static"
                        ? "image/png"
                        : type === "video"
                        ? "video/mp4"
                        : "audio/mpeg"
                    }
                    multiple={false}
                    onChange={(e) =>
                      e?.target?.files?.[0] && handleMedia(e, type)
                    }
                  />
                </div>
              </label>
            </div>
            <div className="flex flex-col items-start justif-start w-fit h-fit gap-1">
              <div className="relative w-fit h-fit text-sm">
                Connect Microbrand?
              </div>
              <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
                {microBrands && (
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
                          <div
                            className="relative flex items-center justify-center rounded-full w-5 h-5 cursor-pointer"
                            id="pfp"
                          >
                            <Image
                              layout="fill"
                              src={`${INFURA_GATEWAY}/ipfs/${
                                JSON.parse(
                                  microBrands!
                                )?.[0]?.microbrandCover?.split("ipfs://")?.[1]
                              }`}
                              draggable={false}
                            />
                          </div>
                          <div className="relative w-fit h-fit flex items-center justify-center font-aust text-white text-sm">
                            {JSON.parse(microBrands!)?.[0]?.microbrand}
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
                                        microbrand: item.microbrand,
                                        microbrandCover: item.microbrandCover,
                                      }));
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
                                            item?.microbrandCover?.split(
                                              "ipfs://"
                                            )?.[1]
                                          }`}
                                          draggable={false}
                                        />
                                      </div>
                                      <div className="relative w-fit h-fit flex items-center justify-center font-aust text-white text-sm">
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
                )}
                <div className="relative w-full h-fit flex flex-col items-start justify-start gap-1">
                  <div className="relative w-fit h-fit text-xs">
                    New Microbrand
                  </div>
                  <div className="relative w-full h-fit flex flex-row gap-2">
                    <label
                      className="relative border border-white w-8 h-8 cursor-pointer p-px rounded-full"
                      id="pfp"
                    >
                      <div className="relative w-full h-full flex items-center justify-center rounded-full">
                        {collectionDetails?.microbrandCover && (
                          <Image
                            layout="fill"
                            src={collectionDetails?.microbrandCover}
                            objectFit="cover"
                            draggable={false}
                            className="relative rounded-full w-full h-full flex"
                          />
                        )}
                        <input
                          hidden
                          type="file"
                          accept="image/png"
                          multiple={false}
                          onChange={(e) =>
                            e?.target?.files?.[0] && handleMedia(e, "micro")
                          }
                        />
                      </div>
                    </label>
                    <input
                      value={collectionDetails?.microbrand}
                      onChange={(e) =>
                        setCollectionDetails((prev) => ({
                          ...prev,
                          microbrand: e.target.value,
                        }))
                      }
                      className="relative rounded-md p-1 bg-offBlack text-xs border border-sol h-8 w-40"
                      style={{
                        resize: "none",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex flex-col items-start justify-start gap-4">
            <div className="flex flex-col items-start justif-start w-fit h-fit gap-1">
              <div className="relative w-fit h-fit text-sm">
                Add discovery tags
              </div>
              <input
                value={collectionDetails?.tags}
                onChange={(e) =>
                  setCollectionDetails((prev) => ({
                    ...prev,
                    tags: e.target.value,
                  }))
                }
                className="relative rounded-md p-1 bg-offBlack text-xs border border-sol h-8 w-60 max-w-[15rem]"
                style={{
                  resize: "none",
                }}
              />
              {collectionDetails?.tags.split(",").pop()?.trim() &&
                TAGS.some((tag) =>
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
                  <div className="absolute top-14 bg-offBlack z-10 w-full max-w-[15rem] max-h-[6rem] h-fit flex border border-sol rounded-md overflow-y-scroll">
                    <div className="relative w-full max-w-[15rem] h-fit flex flex-col items-center justify-start">
                      {TAGS.filter((tag) =>
                        tag.toLowerCase().includes(
                          collectionDetails?.tags
                            ?.split(/,\s*|\s+|\s*$/)
                            ?.pop()
                            ?.toLowerCase() || ""
                        )
                      ).map((tag: string, index: number) => (
                        <div
                          key={index}
                          className="relative py-1 h-8 w-full flex items-center justify-center text-white border-y border-sol font-aust text-xs cursor-pointer hover:opacity-80"
                          onClick={() => {
                            const tagsArray =
                              collectionDetails.tags.split(/,\s*/);
                            tagsArray[tagsArray.length - 1] = tag;
                            const newTags = tagsArray.join(", ") + ", ";
                            setCollectionDetails((prev) => ({
                              ...prev,
                              tags: newTags,
                            }));
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
            <div className="flex flex-col items-start justif-start w-fit h-fit gap-1">
              <div className="relative w-fit h-fit text-sm">
                Who can access?
              </div>
              <input
                value={collectionDetails?.access}
                onChange={(e) =>
                  setCollectionDetails((prev) => ({
                    ...prev,
                    access: e.target.value,
                  }))
                }
                className="relative rounded-md p-1 bg-offBlack text-xs border border-sol h-8 w-full"
                style={{
                  resize: "none",
                }}
              />
            </div>
            <div className="flex flex-col items-start justif-start w-fit h-fit gap-1">
              <div className="relative w-fit h-fit text-sm">
                Which communities can collect?
              </div>
              <input
                value={collectionDetails?.communities}
                onChange={(e) =>
                  setCollectionDetails((prev) => ({
                    ...prev,
                    communities: e.target.value,
                  }))
                }
                className="relative rounded-md p-1 bg-offBlack text-xs border border-sol h-8 w-full"
                style={{
                  resize: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dispatch;
