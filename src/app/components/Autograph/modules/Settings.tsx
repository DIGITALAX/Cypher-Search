import { INFURA_GATEWAY } from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import useSettings from "../hooks/useSettings";
import { ModalContext } from "@/app/providers";
import { MetadataAttributeType } from "@lens-protocol/metadata";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";

const Settings: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const {
    handleSettingsUpdate,
    settingsUpdateLoading,
    setSettingsData,
    settingsData,
    coverImage,
    handleImage,
    pfpImage,
 
  } = useSettings(dict);
  const context = useContext(ModalContext);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative flex w-full tablet:w-4/5 h-fit items-start justify-center rounded-sm">
        <div
          className="relative w-full h-full flex flex-col items-center justify-start gap-5 p-px"
          id="pfp"
        >
          <div className="relative w-full bg-blurs flex bg-cover rounded-sm px-1.5 sm:px-3 py-3 overflow-y-scroll h-[55rem] tablet:h-[35rem]">
            <div className="relative w-full h-fit flex items-center justify-start bg-cover flex-col rounded-sm gap-5">
              <label
                className="relative w-full h-40 rounded-sm cursor-pointer p-px"
                id="pfp"
              >
                <div className="relative w-full h-full flex items-center justify-center rounded-sm opacity-70">
                  {(settingsData?.coverPicture || coverImage) && (
                    <Image
                      onError={(e) => handleImageError(e)}
                      layout="fill"
                      src={
                        coverImage
                          ? coverImage
                          : handleProfilePicture(settingsData?.coverPicture!)
                      }
                      objectFit="cover"
                      draggable={false}
                      className="relative rounded-sm w-full h-full flex"
                    />
                  )}
                  <input
                    hidden
                    type="file"
                    accept="image/png, image/gif"
                    multiple={false}
                    onChange={(e) =>
                      e?.target?.files?.[0] && handleImage(e, "cover")
                    }
                  />
                </div>
                <label
                  className="absolute top-4 right-4 z-10 border border-white w-32 h-32 rounded-sm cursor-pointer p-px"
                  id="pfp"
                >
                  <div className="relative w-full h-full flex items-center justify-center rounded-sm">
                    {(pfpImage || settingsData?.picture) && (
                      <Image
                        layout="fill"
                        onError={(e) => handleImageError(e)}
                        src={
                          pfpImage
                            ? pfpImage
                            : handleProfilePicture(settingsData?.picture!)
                        }
                        objectFit="cover"
                        draggable={false}
                        className="relative rounded-sm w-full h-full flex"
                      />
                    )}
                    <input
                      hidden
                      type="file"
                      accept="image/png, image/gif"
                      multiple={false}
                      onChange={(e) =>
                        e?.target?.files?.[0] && handleImage(e, "pfp")
                      }
                    />
                  </div>
                </label>
              </label>
              <div className="relative w-full h-fit flex flex-col gap-2 items-start justify-start">
                <div className="relative font font-bit text-white text-sm">
                  {dict?.name}
                </div>
                <div className="relative w-full h-10 rounded-sm bg-piloto border border-fuera p-px flex items-start justify-start text-left text-white font-bit">
                  <input
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        name: e.target.value,
                      })
                    }
                    style={{
                      resize: "none",
                    }}
                    value={settingsData?.name || ""}
                    className="bg-piloto p-1 flex w-full h-full items-start justify-start"
                  />
                </div>
              </div>
              <div className="relative w-full h-fit flex flex-col gap-2 items-start justify-start">
                <div className="relative font font-bit text-white text-sm">
                  Bio
                </div>
                <div className="relative w-full h-20 rounded-sm bg-piloto border border-fuera p-px flex items-start justify-start text-left text-white font-bit">
                  <textarea
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        bio: e.target.value,
                      })
                    }
                    style={{
                      resize: "none",
                    }}
                    className="bg-piloto p-1 flex w-full h-full items-start justify-start"
                    value={settingsData?.bio || ""}
                  ></textarea>
                </div>
              </div>
              <div className="relative flex flex-row items-center justify-center h-fit w-full text-white text-left gap-2 font-bit text-sm flex-wrap sm:flex-nowrap">
                <div className="relative flex flex-col gap-1 items-start justify-center w-full h-fit">
                  <div className="relative w-fit h-fit justify-start items-center">
                    {dict?.loca}
                  </div>
                  <input
                    onChange={(e) => {
                      const attributes = [...(settingsData.attributes || [])];

                      const index = attributes.findIndex(
                        (item) => item?.key === "location"
                      );

                      if (index != -1) {
                        attributes[index].value = e.target.value;
                      } else {
                        attributes.push({
                          key: "location",
                          value: e.target.value,
                          type: MetadataAttributeType.STRING,
                        });
                      }

                      setSettingsData({
                        ...settingsData,
                        attributes,
                      });
                    }}
                    value={
                      settingsData?.attributes?.find(
                        (item) => item?.key === "location"
                      )?.value || ""
                    }
                    className="bg-piloto p-1 flex w-full h-10 items-start rounded-sm justify-start border border-fuera"
                  />
                </div>
                <div className="relative flex flex-row items-center justify-center h-fit w-full text-white text-left font-fit">
                  <div className="relative flex flex-col gap-1 items-start justify-center w-full h-fit">
                    <div className="relative w-fit h-fit justify-start items-center">
                      {dict?.link}
                    </div>
                    <input
                      onChange={(e) => {
                        const attributes = [...(settingsData.attributes || [])];

                        const index = attributes.findIndex(
                          (item) => item?.key === "website"
                        );

                        if (index != -1) {
                          attributes[index].value = e.target.value;
                        } else {
                          attributes.push({
                            key: "website",
                            value: e.target.value,
                            type: MetadataAttributeType.STRING,
                          });
                        }

                        setSettingsData({
                          ...settingsData,
                          attributes,
                        });
                      }}
                      style={{
                        resize: "none",
                      }}
                      value={
                        settingsData?.attributes?.find(
                          (item) => item?.key === "website"
                        )?.value || ""
                      }
                      className="bg-piloto p-1 flex w-full h-10 items-start rounded-sm justify-start border border-fuera"
                    />
                  </div>
                </div>
              </div>
              {context?.isDesigner && (
                <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
                  <div className="relative font font-bit text-white text-sm">
                    {dict?.conM}
                  </div>
                  <div className="relative w-full h-fit flex flex-row gap-2 sm:flex-nowrap flex-wrap">
                    <label
                      className="relative border border-white w-10 h-10 cursor-pointer p-px rounded-full flex items-center justify-center"
                      id="pfp"
                    >
                      <div className="relative w-full h-full flex items-center justify-center rounded-full">
                        {settingsData?.tempMicro?.microbrandCover && (
                          <Image
                            layout="fill"
                            onError={(e) => handleImageError(e)}
                            src={settingsData?.tempMicro?.microbrandCover}
                            objectFit="cover"
                            draggable={false}
                            className="relative rounded-full w-full h-full flex"
                          />
                        )}
                        <input
                          hidden
                          type="file"
                          accept="image/png, image/gif"
                          multiple={false}
                          onChange={(e) =>
                            e?.target?.files?.[0] && handleImage(e, "micro")
                          }
                        />
                      </div>
                    </label>
                    <input
                      value={settingsData?.tempMicro?.microbrand || ""}
                      onChange={(e) =>
                        setSettingsData((prev) => ({
                          ...prev,
                          tempMicro: {
                            ...prev.tempMicro,
                            microbrand: e.target.value,
                          },
                        }))
                      }
                      className="relative p-1 text-xs bg-piloto border border-white text-white font-bit rounded-sm h-10 w-40"
                      style={{
                        resize: "none",
                      }}
                    />
                    <div
                      className={`relative w-fit px-1.5 py-1 h-10 font-bit text-white flex items-center justify-center bg-fuego border border-white rounded-sm text-xs ${
                        settingsData.tempMicro?.microbrand &&
                        settingsData.tempMicro?.microbrandCover &&
                        "cursor-pointer active:scale-95"
                      }`}
                      onClick={() =>
                        settingsData.tempMicro?.microbrand &&
                        settingsData.tempMicro?.microbrandCover &&
                        setSettingsData((prev) => ({
                          ...prev,
                          microbrands: [
                            ...prev.microbrands,
                            prev.tempMicro as {
                              microbrand: string;
                              microbrandCover: string;
                              type: string;
                            },
                          ].filter(Boolean),
                          tempMicro: {
                            microbrand: undefined,
                            microbrandCover: undefined,
                            type: undefined,
                          },
                        }))
                      }
                    >
                      <div
                        className={`top-px relative w-fit h-fit flex items-center justify-center text-center`}
                      >
                        {dict?.micro}
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full h-fit flex flex-wrap items-center justify-start gap-3">
                    {settingsData?.microbrands?.map(
                      (
                        item: { microbrand: string; microbrandCover: string },
                        index: number
                      ) => {
                        return (
                          <div
                            className="relative w-fit h-10 flex flex-row gap-2 justify-between items-center px-3 py-1.5 bg-piloto border border-white"
                            key={index}
                          >
                            <div
                              id="pfp"
                              className="relative w-6 h-6 flex items-center justify-center rounded-full"
                            >
                              <Image
                                layout="fill"
                                onError={(e) => handleImageError(e)}
                                src={
                                  item?.microbrandCover?.includes("ipfs://")
                                    ? `${INFURA_GATEWAY}/ipfs/${
                                        item?.microbrandCover?.split(
                                          "ipfs://"
                                        )?.[1]
                                      }`
                                    : item?.microbrandCover?.includes("ar://")
                                    ? `https://arweave.net/${item?.microbrandCover
                                        ?.split("ar://")?.[1]
                                        ?.replace(/"/g, "")
                                        ?.trim()}`
                                    : item?.microbrandCover
                                }
                                objectFit="cover"
                                draggable={false}
                                className="relative rounded-full w-full h-full flex"
                              />
                            </div>
                            <div className="relative w-fit h-fit text-white font-aust text-xs flex items-center justify-center">
                              {item?.microbrand?.toUpperCase()}
                            </div>
                            <div
                              className="ml-auto justify-end items-center w-fit h-fit flex cursor-pointer active:scale-95"
                              onClick={() =>
                                setSettingsData((prev) => {
                                  const arr = {
                                    ...prev,
                                  };

                                  const index = arr?.microbrands?.findIndex(
                                    (value) =>
                                      item?.microbrandCover ===
                                        value?.microbrandCover &&
                                      item?.microbrand === value?.microbrand
                                  );

                                  delete arr?.microbrands[index];
                                  return arr;
                                })
                              }
                            >
                              <ImCross color="white" size={10} />
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              <div className="relative w-full h-fit flex justify-end items-center">
                <div
                  className={`relative w-32 sm:w-40 h-10 font-bit text-white flex items-center justify-center bg-fuego border border-white text-xxs sm:text-xs rounded-sm ${
                    !settingsUpdateLoading && "cursor-pointer active:scale-95"
                  }`}
                  onClick={() => handleSettingsUpdate()}
                >
                  <div
                    className={`${
                      settingsUpdateLoading ? "animate-spin" : "top-px"
                    } relative w-fit h-fit flex items-center justify-center text-center`}
                  >
                    {settingsUpdateLoading ? (
                      <AiOutlineLoading size={15} color="white" />
                    ) : (
                      dict?.sett
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
