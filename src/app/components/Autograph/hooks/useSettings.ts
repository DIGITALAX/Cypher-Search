import { ChangeEvent, useContext, useEffect, useState } from "react";
import convertToFile from "@/app/lib/helpers/convertToFile";
import { ModalContext } from "@/app/providers";
import { ScreenDisplay } from "../types/autograph.types";
import { Account, MetadataAttribute } from "@lens-protocol/client";
import {
  MetadataAttributeType,
  account,
  AccountOptions,
} from "@lens-protocol/metadata";
import {
  fetchAccount,
  setAccountMetadata,
} from "@lens-protocol/client/actions";
import { immutable } from "@lens-chain/storage-client";
import { chains } from "@lens-chain/sdk/viem";
import { typeMapping } from "@/app/lib/constants";

const useSettings = (dict: any) => {
  const context = useContext(ModalContext);
  const [settingsUpdateLoading, setSettingsUpdateLoading] =
    useState<boolean>(false);
  const [pfpImage, setPFPImage] = useState<string>();
  const [coverImage, setCoverImage] = useState<string>();
  const [settingsData, setSettingsData] = useState<
    AccountOptions & {
      microbrands: {
        microbrand: string;
        microbrandCover: string;
        type: string;
      }[];
      tempMicro: {
        microbrand: string | undefined;
        microbrandCover: string | undefined;
        type: string | undefined;
      };
    }
  >({
    attributes: [],
    bio: undefined,
    coverPicture: undefined,
    name: undefined,
    picture: undefined,
    microbrands: [],
    tempMicro: {
      type: undefined,
      microbrand: undefined,
      microbrandCover: undefined,
    },
  });

  const handleImage = async (e: ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (id === "micro") {
          setSettingsData((prev) => ({
            ...prev,
            tempMicro: {
              ...prev.tempMicro,
              microbrandCover: e.target?.result as string,
              type: file.type,
            },
          }));
        } else if (id == "cover") {
          setCoverImage(e.target?.result as string);
        } else {
          setPFPImage(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSettingsUpdate = async () => {
    if (!context?.lensConectado?.sessionClient) return;
    setSettingsUpdateLoading(true);
    let schema;

    try {
      let newImages: string[] = [];
      let hasNewCoverImage = coverImage !== undefined;
      let hasNewPfpImage = pfpImage !== undefined;

      if (hasNewCoverImage || hasNewPfpImage) {
        let images = [coverImage, pfpImage].filter(
          (image) => image !== undefined
        );
        for (let i = 0; i < images.length; i++) {
          const response = await fetch("/api/ipfs", {
            method: "POST",
            body: convertToFile(images[i] as string, "image/png"),
          });
          const responseJSON = await response.json();
          newImages.push("ipfs://" + responseJSON.cid);
        }
      }

      let newAttributes = [...(settingsData?.attributes || [])];

      if (context?.isDesigner && settingsData?.microbrands) {
        const existing = newAttributes.findIndex(
          (item) => item?.key === "microbrandCypher"
        );
        let itemsToHash: {
          microbrand: string;
          microbrandCover: string;
          type: string;
        }[] = [];

        if (existing != -1) {
          itemsToHash = settingsData?.microbrands
            .filter(Boolean)
            .filter(
              (value, index, array) =>
                array.findIndex(
                  (v) =>
                    v.microbrand === value?.microbrand &&
                    v.microbrandCover === value?.microbrandCover
                ) === index
            );
        } else {
          itemsToHash = settingsData?.microbrands;
        }

        if (itemsToHash?.length > 0) {
          const promises = itemsToHash
            ?.filter(Boolean)
            ?.map(
              async (item: {
                microbrand: string;
                microbrandCover: string;
                type: string;
              }) => {
                let microbrandCover = item.microbrandCover;
                if (!microbrandCover.includes("ipfs://")) {
                  const cover = await fetch("/api/ipfs", {
                    method: "POST",
                    body: convertToFile(item?.microbrandCover, item?.type),
                  });
                  const coverCID = await cover.json();
                  microbrandCover = "ipfs://" + coverCID?.cid;
                }

                return {
                  microbrand: item.microbrand,
                  microbrandCover,
                };
              }
            );

          const awaited = (await Promise.all(promises))?.filter(Boolean);

          if (existing != -1) {
            newAttributes[existing].value = JSON.stringify([
              ...(awaited || []),
            ]);
          } else {
            newAttributes.push({
              type: MetadataAttributeType.STRING,
              key: "microbrandCypher",
              value: JSON.stringify(awaited || []),
            });
          }
        }
      }

      const { tempMicro, microbrands, attributes, ...filteredSettingsData } =
        settingsData;

      schema = account({
        ...filteredSettingsData,
        bio: !filteredSettingsData?.bio ? undefined : filteredSettingsData?.bio,
        name: !filteredSettingsData?.name
          ? undefined
          : filteredSettingsData?.name,
        attributes:
          newAttributes?.filter((item) => item?.key !== "")?.length < 1
            ? undefined
            : newAttributes
                ?.filter((item) => item?.key !== "")
                ?.map((item) => ({
                  ...item,
                  type: typeMapping[item?.type] as any,
                })) || undefined,
        picture: hasNewPfpImage
          ? newImages[hasNewCoverImage ? 1 : 0]
          : settingsData.picture,
        coverPicture: hasNewCoverImage
          ? newImages[0]
          : settingsData.coverPicture,
      });

      const acl = immutable(chains.mainnet.id);
      const { uri } = await context?.clienteAlmacenamiento?.uploadAsJson(
        schema,
        {
          acl,
        }
      )!;

      const res = await setAccountMetadata(
        context?.lensConectado?.sessionClient!,
        {
          metadataUri: uri,
        }
      );

      if (res?.isOk()) {
        const res = await fetchAccount(context?.lensConectado?.sessionClient!, {
          address: context?.lensConectado?.profile?.address,
        });

        if (res?.isOk()) {
          context?.setLensConectado((prev) => ({
            ...prev,
            profile: res?.value as Account,
          }));
        }
      } else {
        context?.setModalOpen(dict?.error);
      }
    } catch (err: any) {
      console.error(err?.message);
    }
    setSettingsUpdateLoading(false);
  };

  useEffect(() => {
    if (
      context?.lensConectado?.profile &&
      ScreenDisplay.Settings == context?.screenDisplay
    ) {
      setSettingsData({
        attributes: context?.lensConectado?.profile?.metadata?.attributes?.map(
          (item) => ({
            type: typeMapping[item?.type],
            key: item?.key,
            value: item?.value,
          })
        ) as MetadataAttribute[] | [],
        bio: context?.lensConectado?.profile?.metadata?.bio!,
        coverPicture: context?.lensConectado?.profile?.metadata?.coverPicture,
        name: context?.lensConectado?.profile?.metadata?.name!,
        picture: context?.lensConectado?.profile?.metadata?.picture,
        microbrands: context?.lensConectado?.profile?.metadata?.attributes?.[
          context?.lensConectado?.profile?.metadata?.attributes?.findIndex(
            (item) => item?.key === "microbrandCypher"
          )
        ]
          ? JSON.parse(
              context?.lensConectado?.profile?.metadata?.attributes?.[
                context?.lensConectado?.profile?.metadata?.attributes?.findIndex(
                  (item) => item?.key === "microbrandCypher"
                )
              ]?.value || ""
            )
          : [],
        tempMicro: {
          microbrand: undefined,
          microbrandCover: undefined,
          type: undefined,
        },
      });
    }
  }, [context?.lensConectado?.profile, context?.screenDisplay]);

  return {
    handleSettingsUpdate,
    settingsUpdateLoading,
    setSettingsData,
    settingsData,
    coverImage,
    handleImage,
    pfpImage,
  };
};

export default useSettings;
