import { FunctionComponent } from "react";
import { SettingsProps } from "../../types/autograph.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { AiOutlineLoading } from "react-icons/ai";
import { Erc20, MetadataAttributeType } from "../../../../../graphql/generated";
import { ImCross } from "react-icons/im";

const Settings: FunctionComponent<SettingsProps> = ({
  setSettingsData,
  settingsData,
  handleSettingsUpdate,
  settingsUpdateLoading,
  handleImage,
  coverImage,
  pfpImage,
  followUpdateLoading,
  handleFollowUpdate,
  followData,
  setFollowData,
  openType,
  setOpenType,
  currencies,
  setCurrencyOpen,
  currencyOpen,
  isDesigner,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative flex w-4/5 h-fit items-start justify-center rounded-sm">
        <div
          className="relative w-full h-full flex flex-col items-center justify-start gap-5 p-px"
          id="pfp"
        >
          <div className="relative w-full bg-blurs flex bg-cover rounded-sm p-3 overflow-y-scroll h-[35rem]">
            <div className="relative w-full h-fit flex items-center justify-start bg-cover flex-col rounded-sm gap-5">
              <label
                className="relative w-full h-40 rounded-sm cursor-pointer p-px"
                id="pfp"
              >
                <div className="relative w-full h-full flex items-center justify-center rounded-sm opacity-70">
                  {(settingsData?.coverPicture || coverImage) && (
                    <Image
                      layout="fill"
                      src={
                        coverImage
                          ? coverImage
                          : `${INFURA_GATEWAY}/ipfs/${
                              settingsData?.coverPicture?.split("ipfs://")[1]
                            }`
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
                        src={
                          pfpImage
                            ? pfpImage
                            : `${INFURA_GATEWAY}/ipfs/${
                                settingsData?.picture?.split("ipfs://")?.[1]
                              }` || ""
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
                  Display Name
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
                    value={settingsData?.bio}
                  ></textarea>
                </div>
              </div>
              <div className="relative flex flex-row items-center justify-center h-fit w-full text-white text-left gap-2 font-bit text-sm">
                <div className="relative flex flex-col gap-1 items-start justify-center w-full h-fit">
                  <div className="relative w-fit h-fit justify-start items-center">
                    Location?
                  </div>
                  <input
                    onChange={(e) => {
                      const attributes = [...(settingsData.attributes || [])];

                      const index = attributes.findIndex(
                        (item) => item?.key === "location"
                      );

                      if (index != -1) {
                        attributes[index].value === e.target.value;
                      } else {
                        attributes.push({
                          key: "location",
                          value: e.target.value,
                          type: MetadataAttributeType.String as any,
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
                        (item) => item?.key === "location"
                      )?.value
                    }
                    className="bg-piloto p-1 flex w-full h-10 items-start rounded-sm justify-start border border-fuera"
                  />
                </div>
                <div className="relative flex flex-row items-center justify-center h-fit w-full text-white text-left font-fit">
                  <div className="relative flex flex-col gap-1 items-start justify-center w-full h-fit">
                    <div className="relative w-fit h-fit justify-start items-center">
                      Link?
                    </div>
                    <input
                      onChange={(e) => {
                        const attributes = [...(settingsData.attributes || [])];

                        const index = attributes.findIndex(
                          (item) => item?.key === "website"
                        );

                        if (index != -1) {
                          attributes[index].value === e.target.value;
                        } else {
                          attributes.push({
                            key: "website",
                            value: e.target.value,
                            type: MetadataAttributeType.String as any,
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
                        )?.value
                      }
                      className="bg-piloto p-1 flex w-full h-10 items-start rounded-sm justify-start border border-fuera"
                    />
                  </div>
                </div>
              </div>
              {isDesigner && (
                <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
                  <div className="relative font font-bit text-white text-sm">
                    Connected Microbrands
                  </div>
                  <div className="relative w-full h-fit flex flex-row gap-2">
                    <label
                      className="relative border border-white w-10 h-10 cursor-pointer p-px rounded-full flex items-center justify-center"
                      id="pfp"
                    >
                      <div className="relative w-full h-full flex items-center justify-center rounded-full">
                        {settingsData?.tempMicro?.microbrandCover && (
                          <Image
                            layout="fill"
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
                            },
                          ],
                          tempMicro: {
                            microbrand: undefined,
                            microbrandCover: undefined,
                          },
                        }))
                      }
                    >
                      <div
                        className={`top-px relative w-fit h-fit flex items-center justify-center text-center`}
                      >
                        Add Micro
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
                                src={
                                  item?.microbrandCover?.includes("ipfs://")
                                    ? `${INFURA_GATEWAY}/ipfs/${
                                        item?.microbrandCover?.split(
                                          "ipfs://"
                                        )?.[1]
                                      }`
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

                                  const index = arr.microbrands.findIndex(
                                    (value) =>
                                      item.microbrandCover ===
                                        value.microbrandCover &&
                                      item.microbrand === value.microbrand
                                  );

                                  delete arr.microbrands[index];
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
                  className={`relative w-32 h-10 font-bit text-white flex items-center justify-center bg-fuego border border-white text-xs rounded-sm ${
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
                      "Update Settings"
                    )}
                  </div>
                </div>
              </div>
              <div className="relative w-full h-fit flex flex-row gap-2 items-start justify-start">
                <div className="relative w-fit h-fit flex flex-col gap-2 items-start justify-start">
                  <div className="relative font font-bit text-white text-sm">
                    Follow Module
                  </div>
                  <div className="relative flex flex-row items-start justify-start gap-3">
                    <div className="relative flex flex-col items-start justify-start h-10 w-60">
                      <div
                        className="relative w-full h-full rounded-sm bg-piloto border border-fuera flex items-center justify-center text-left text-white font-bit cursor-pointer px-3 py-1 text-center"
                        onClick={() => setOpenType(!openType)}
                      >
                        <div className="relative flex items-center justify-center w-fit h-fit">
                          {followData?.type
                            ?.replace(/([a-z])([A-Z])/g, "$1 $2")
                            ?.toLowerCase()}
                        </div>
                      </div>
                      {openType && (
                        <div className="absolute flex flex-col items-center justify-start w-full h-full top-10 z-10">
                          {[
                            "FreeFollowModule",
                            "FeeFollowModule",
                            "RevertFollowModule",
                          ]
                            .filter((item) => item !== followData.type)
                            ?.map((item: string, index) => {
                              return (
                                <div
                                  className="relative w-full h-fit rounded-sm bg-piloto border border-fuera flex items-center  justify-center text-left text-white font-bit cursor-pointer px-3 py-1 text-center"
                                  key={index}
                                  onClick={() => {
                                    setOpenType(!openType);
                                    setFollowData({
                                      ...followData,
                                      type: item as any,
                                    });
                                  }}
                                >
                                  <div className="relative flex items-center justify-center w-fit h-fit">
                                    {item
                                      ?.replace(/([a-z])([A-Z])/g, "$1 $2")
                                      ?.toLowerCase()}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {followData.type === "FeeFollowModule" && (
                  <div className="relative flex flex-row gap-3 items-center justify-center">
                    <div className="relative w-full h-fit flex flex-col gap-2 items-start justify-start">
                      <div className="relative font font-bit text-white text-sm">
                        Amount
                      </div>
                      <div className="relative w-full h-10 rounded-sm bg-piloto border border-fuera p-px flex items-start justify-start text-left text-white font-bit">
                        <textarea
                          onChange={(e) =>
                            setFollowData({
                              ...followData,
                              value: e.target.value,
                            })
                          }
                          style={{
                            resize: "none",
                          }}
                          className="bg-piloto p-1 flex w-full h-full items-start justify-start"
                          value={followData?.value || 0}
                        ></textarea>
                      </div>
                    </div>
                    <div className="relative w-full h-fit flex flex-col gap-2 items-start justify-start">
                      <div className="relative font font-bit text-white text-sm">
                        Currency
                      </div>
                      <div className="relative flex flex-row items-start justify-start gap-3">
                        <div className="relative flex flex-col items-start justify-start h-10 w-60">
                          <div
                            className="relative w-full h-full rounded-sm bg-piloto border border-fuera flex items-center justify-center text-left text-white font-bit cursor-pointer px-3 py-1 text-center"
                            onClick={() => setCurrencyOpen(!currencyOpen)}
                          >
                            <div className="relative flex items-center justify-center w-fit h-fit">
                              {followData?.currency?.name}
                            </div>
                          </div>
                          {currencyOpen && (
                            <div className="absolute flex flex-col items-center justify-start w-full h-40 overflow-y-scroll top-10 z-10">
                              {currencies
                                ?.filter((item) => item !== followData.currency)
                                ?.map((item: Erc20, index) => {
                                  return (
                                    <div
                                      className="relative w-full h-fit rounded-sm bg-piloto border border-fuera flex items-center  justify-center text-left text-white font-bit cursor-pointer px-3 py-1 text-center"
                                      key={index}
                                      onClick={() => {
                                        setCurrencyOpen(!currencyOpen);
                                        setFollowData({
                                          ...followData,
                                          currency: item,
                                        });
                                      }}
                                    >
                                      <div className="relative flex items-center justify-center w-fit h-fit">
                                        {item?.name}
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative w-full h-fit flex justify-end items-center">
                <div
                  className={`relative w-40 h-10 font-bit text-white flex items-center justify-center bg-fuego border border-white rounded-sm text-xs ${
                    !followUpdateLoading && "cursor-pointer active:scale-95"
                  }`}
                  onClick={() => !followUpdateLoading && handleFollowUpdate()}
                >
                  <div
                    className={`${
                      followUpdateLoading ? "animate-spin" : "top-px"
                    } relative w-fit h-fit flex items-center justify-center text-center`}
                  >
                    {followUpdateLoading ? (
                      <AiOutlineLoading size={15} color="white" />
                    ) : (
                      "Update Follow Module"
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
