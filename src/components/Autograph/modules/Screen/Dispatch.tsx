import { FunctionComponent } from "react";
import { DispatchProps, ScreenDisplay } from "../../types/autograph.types";
import Image from "next/legacy/image";
import {
  ACCEPTED_TOKENS_MUMBAI,
  INFURA_GATEWAY,
} from "../../../../../lib/constants";
import { HiOutlinePlayPause } from "react-icons/hi2";
import { BsCloudUpload } from "react-icons/bs";
import { setScreenDisplay } from "../../../../../redux/reducers/screenDisplaySlice";

const Dispatch: FunctionComponent<DispatchProps> = ({
  collectionDetails,
  setCollectionDetails,
  handleMedia,
  lensConnected,
  collectionSettings,
  setCollectionSettings,
  filterConstants,
  dispatch,
  waveformRef,
  handlePlayPause,
}): JSX.Element => {
  const microBrands = lensConnected?.metadata?.attributes?.find(
    (item) => item?.key === "microbrandCypher"
  )?.value;

  return (
    <div className="relative items-center justify-center text-white font-bit w-full h-full overflow-y-auto">
      <div className="relative w-full h-full p-4 flex items-start justify-start">
        <div className="relative flex flex-wrap items-start justify-start w-full h-full font-aust text-white gap-4">
          <div className="relative flex flex-col items-start justify-start gap-4">
            <div className="flex flex-col items-start justif-start w-fit h-fit gap-1">
              <div className="relative w-fit h-fit text-sm">
                Collection Title
              </div>
              <input
                className="relative rounded-md p-1 bg-offBlack text-xs border border-sol h-10 w-80"
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
                {collectionSettings?.media === "static"
                  ? "(png or gif)"
                  : collectionSettings?.media === "video"
                  ? "(mp4)"
                  : "(mp3)"}
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center">
                <label
                  className="relative border border-white w-80 h-80 rounded-sm cursor-pointer p-px"
                  id="pfp"
                >
                  <div className="relative w-full h-full flex items-center justify-center rounded-sm">
                    {collectionDetails?.images?.[0] &&
                    collectionSettings?.media === "static" ? (
                      <Image
                        layout="fill"
                        src={collectionDetails?.images?.[0]}
                        objectFit="cover"
                        draggable={false}
                        className="relative rounded-sm w-full h-full flex"
                      />
                    ) : (
                      <>
                        {collectionSettings?.media === "audio" ? (
                          collectionDetails?.images?.[0] && (
                            <Image
                              layout="fill"
                              src={collectionDetails?.images?.[0]}
                              objectFit="cover"
                              draggable={false}
                              className="relative rounded-sm w-full h-full flex"
                            />
                          )
                        ) : (
                          <video
                            className="relative rounded-sm w-full h-full flex object-cover"
                            id="videoCollection"
                            draggable={false}
                            controls={false}
                            muted
                            // autoPlay
                            playsInline
                            loop
                            key={collectionDetails?.video}
                          >
                            <source src={collectionDetails?.video} />
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
                          : "image/png"
                      }
                      multiple={false}
                      onChange={(e) =>
                        e?.target?.files?.[0] &&
                        handleMedia(
                          e,
                          collectionSettings?.media === "audio"
                            ? "static"
                            : collectionSettings?.media
                        )
                      }
                    />
                  </div>
                </label>
                {(collectionDetails?.audio ||
                  collectionSettings?.videoAudio ||
                  collectionSettings?.media === "audio") &&
                  collectionSettings?.media !== "static" && (
                    <div className="absolute right-0 bottom-0 w-full h-10 flex flex-row gap-1.5 items-center justify-between bg-offBlack px-1 border border-white">
                      <div
                        className="relative flex w-fit h-fit items-center justify-center flex cursor-pointer active:scale-95"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayPause();
                        }}
                      >
                        <HiOutlinePlayPause color="white" size={15} />
                      </div>
                      <div
                        className="relative w-full h-fit justify-center items-center cursor-pointer"
                        ref={waveformRef}
                      />
                      {collectionSettings?.media === "audio" && (
                        <label className="relative flex justify-end items-end cursor-pointer active:scale-95">
                          <BsCloudUpload size={15} />
                          <input
                            hidden
                            type="file"
                            accept={"audio/mpeg"}
                            multiple={false}
                            onChange={(e) => {
                              e.preventDefault();
                              e?.target?.files?.[0] && handleMedia(e, "audio");
                            }}
                          />
                        </label>
                      )}
                    </div>
                  )}
              </div>
            </div>
            <div className="flex flex-col items-start justif-start w-fit h-fit gap-3">
              <div className="relative w-fit h-fit text-sm">
                Connect Microbrand?
              </div>
              <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
                {microBrands ? (
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
                              className="rounded-full"
                              objectFit="cover"
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
          </div>
          <div className="relative flex flex-col items-start justify-start gap-4">
            <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
              <div className="relative w-fit h-fit flex text-white font-aust text-sm">
                Price {`( USD )`}
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
                          src={`${INFURA_GATEWAY}/ipfs/${item[0]}`}
                          className="flex"
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
            <div className="flex flex-col items-start justif-start w-fit h-fit gap-1 relative">
              <div className="relative w-fit h-fit text-sm">Discovery Tags</div>
              <input
                value={collectionDetails?.tags}
                onChange={(e) =>
                  setCollectionDetails((prev) => ({
                    ...prev,
                    tags: e.target.value.toLowerCase(),
                  }))
                }
                className="relative rounded-md p-1 bg-offBlack text-xs border border-sol h-10 w-60 max-w-[15rem]"
                style={{
                  resize: "none",
                }}
              />
              {collectionDetails?.tags.split(",").pop()?.trim() &&
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
                              const allArray = collectionDetails.tags
                                .split(/,\s*/)
                                .map((t) => t.trim());

                              if (!allArray.includes(tag.trim())) {
                                const tagsArray =
                                  collectionDetails.tags.split(/,\s*/);
                                tagsArray[tagsArray.length - 1] = tag;
                                const newTags = tagsArray.join(", ") + ", ";
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
              <div className="relative w-fit h-fit text-sm">Eco-Access</div>
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
                      {filterConstants?.access?.map(
                        (item: string, index: number) => {
                          return (
                            <div
                              key={index}
                              className="relative w-full py-1 h-10 flex items-center justify-center text-white border-y border-sol font-aust cursor-pointer hover:opacity-80"
                              onClick={() => {
                                setCollectionSettings((prev) => ({
                                  ...prev,
                                  accessOpen: !prev.accessOpen,
                                }));

                                const allArray = collectionDetails.access
                                  .split(/,\s*/)
                                  .map((t) => t.trim());

                                if (!allArray.includes(item.trim())) {
                                  const accessArray =
                                    collectionDetails.access.split(/,\s*/);
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
                        }
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="relative w-full h-fit flex flex-col items-start justify-start gap-1">
              <div className="relative w-fit h-fit text-sm">Visibility</div>
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
                            className="relative w-full py-1 h-10 flex items-center justify-center text-white border-y border-sol font-aust cursor-pointer hover:opacity-80"
                            onClick={() => {
                              setCollectionSettings((prev) => ({
                                ...prev,
                                visibilityOpen: !prev.visibilityOpen,
                              }));

                              setCollectionDetails((prev) => ({
                                ...prev,
                                visibility: item?.[0],
                              }));
                            }}
                          >
                            <div className="relative w-fit h-fit flex items-center flex-row gap-1.5 justify-start">
                              <div className="relative flex items-center justify-center w-5 h-5 cursor-pointer">
                                <Image
                                  layout="fill"
                                  src={`${INFURA_GATEWAY}/ipfs/${item?.[1]}`}
                                  draggable={false}
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
                <div className="relative w-fit h-fit text-sm">Communities</div>
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
                                  const allArray = collectionDetails.communities
                                    .split(/,\s*/)
                                    .map((t) => t.trim());

                                  if (!allArray.includes(item?.[0].trim())) {
                                    const communityArray =
                                      collectionDetails.communities.split(
                                        /,\s*/
                                      );
                                    communityArray[communityArray.length - 1] =
                                      item?.[0];

                                    setCollectionDetails((prev) => ({
                                      ...prev,
                                      communities:
                                        communityArray.join(", ") + ", ",
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
        </div>
      </div>
    </div>
  );
};

export default Dispatch;
