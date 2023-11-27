import { ChangeEvent, useEffect, useState } from "react";
import { omit } from "lodash";
import {
  Erc20,
  FeeFollowModuleSettings,
  NftImage,
  Profile,
  RelaySuccess,
} from "../../../../graphql/generated";
import {
  ProfileMetadataSchema,
  ProfileOptions,
  MetadataAttribute,
  MetadataAttributeType,
} from "@lens-protocol/metadata";
import setFollowModule from "../../../../graphql/lens/mutations/followModule";
import createSetFollowModule from "../../../../lib/helpers/createSetFollowModule";
import { createWalletClient, custom } from "viem";
import LensHubProxy from "./../../../../abis/LensHubProxy.json";
import { polygonMumbai } from "viem/chains";
import { PublicClient } from "wagmi";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../../../../lib/constants";
import broadcast from "../../../../graphql/lens/mutations/broadcast";
import { setIndexer } from "../../../../redux/reducers/indexerSlice";
import setMeta from "../../../../lib/helpers/api/setMeta";
import refetchProfile from "../../../../lib/helpers/api/refetchProfile";
import handleIndexCheck from "../../../../graphql/lens/queries/indexed";
import { Dispatch } from "redux";
import { ScreenDisplay } from "../types/autograph.types";
import { v4 as uuidv4 } from "uuid";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";
import convertToFile from "../../../../lib/helpers/convertToFile";
import errorChoice from "../../../../lib/helpers/errorChoice";

const useSettings = (
  lensConnected: Profile | undefined,
  availableCurrencies: Erc20[],
  dispatch: Dispatch,
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  screenDisplay: ScreenDisplay,
  isDesigner: boolean,
  pageProfile: Profile | undefined
) => {
  const [settingsUpdateLoading, setSettingsUpdateLoading] =
    useState<boolean>(false);
  const [followUpdateLoading, setFollowUpdateLoading] =
    useState<boolean>(false);
  const [openType, setOpenType] = useState<boolean>(false);
  const [currencyOpen, setCurrencyOpen] = useState<boolean>(false);
  const [pfpImage, setPFPImage] = useState<string>();
  const [coverImage, setCoverImage] = useState<string>();
  const [settingsData, setSettingsData] = useState<
    ProfileOptions & {
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
    attributes: undefined,
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
  const [followData, setFollowData] = useState<{
    type: "FreeFollowModule" | "FeeFollowModule" | "RevertFollowModule";
    value: string | undefined;
    currency: Erc20 | undefined;
  }>({
    type:
      !lensConnected?.followModule?.type ||
      lensConnected?.followModule?.type === "UnknownFollowModule"
        ? "FreeFollowModule"
        : (lensConnected?.followModule?.type as any),
    value:
      lensConnected?.followModule?.type === "FeeFollowModule"
        ? (lensConnected?.followModule as FeeFollowModuleSettings)?.amount
            ?.value
        : undefined,
    currency:
      (lensConnected?.followModule as FeeFollowModuleSettings)?.amount?.asset ||
      availableCurrencies?.[0],
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
    setSettingsUpdateLoading(true);
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

      if (isDesigner && settingsData?.microbrands) {
        const existing = newAttributes.findIndex(
          (item) => item?.key === "microbrandCypher"
        );
        let itemsToHash: {
          microbrand: string;
          microbrandCover: string;
          type: string;
        }[] = [];

        if (existing != -1) {
          const parsed = await JSON.parse(newAttributes[existing]?.value);

          itemsToHash = [...settingsData?.microbrands, ...parsed].filter(
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
                const cover = await fetch("/api/ipfs", {
                  method: "POST",
                  body: convertToFile(item?.microbrandCover, item?.type),
                });
                const coverCID = await cover.json();
                return {
                  microbrand: item.microbrand,
                  microbrandCover: "ipfs://" + coverCID?.cid,
                };
              }
            );

          const awaited = (await Promise.all(promises))?.filter(Boolean);

          if (existing != -1) {
            newAttributes[existing].value = JSON.stringify([
              ...(await JSON.parse(newAttributes[existing]?.value)),
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
      const metadata = {
        ...filteredSettingsData,
        attributes: newAttributes?.map((item) => ({
          ...item,
          type:
            item.type.toLowerCase() === "json"
              ? "JSON"
              : item.type.charAt(0).toUpperCase() +
                item.type.slice(1).toLowerCase(),
        })),
        picture: hasNewPfpImage
          ? newImages[hasNewCoverImage ? 1 : 0]
          : settingsData.picture,
        coverPicture: hasNewCoverImage
          ? newImages[0]
          : settingsData.coverPicture,
        id: uuidv4(),
        version: "2.0.0",
      };

      const test = ProfileMetadataSchema.safeParse({
        $schema: "https://json-schemas.lens.dev/profile/2.0.0.json",
        lens: metadata,
      });

      if (test?.success) {
        const response = await fetch("/api/ipfs", {
          method: "POST",
          body: JSON.stringify(test?.data),
        });
        const responseJSON = await response.json();

        const clientWallet = createWalletClient({
          chain: polygonMumbai,
          transport: custom((window as any).ethereum),
        });

        await setMeta(
          "ipfs://" + responseJSON.cid,
          dispatch,
          address as `0x${string}`,
          clientWallet,
          publicClient
        );

        await refetchProfile(dispatch, lensConnected?.id, lensConnected?.id);
      } else {
        setInteractError(true);
      }
    } catch (err: any) {
      errorChoice(err, () => {}, dispatch);
    }
    setSettingsUpdateLoading(false);
  };

  const handleFollowUpdate = async () => {
    setFollowUpdateLoading(true);
    try {
      const { data } = await setFollowModule({
        followModule: createSetFollowModule(
          followData?.type,
          followData?.value,
          followData?.currency?.contract?.address,
          lensConnected?.ownedBy?.address
        ),
      });

      const typedData = data?.createSetFollowModuleTypedData.typedData;

      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      const signature = await clientWallet.signTypedData({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]),
        primaryType: "SetFollowModule",
        message: omit(typedData?.value, ["__typename"]),
        account: address as `0x${string}`,
      });

      const broadcastResult = await broadcast({
        id: data?.createSetFollowModuleTypedData.id,
        signature,
      });

      if (
        broadcastResult?.data?.broadcastOnchain?.__typename === "RelayError"
      ) {
        const { request } = await publicClient.simulateContract({
          address: LENS_HUB_PROXY_ADDRESS_MATIC,
          abi: LensHubProxy,
          functionName: "setFollowModule",
          chain: polygonMumbai,
          args: [
            typedData?.value.profileId,
            typedData?.value.followModule,
            typedData?.value.followModuleInitData,
          ],
          account: address,
        });
        const res = await clientWallet.writeContract(request);
        const tx = await publicClient.waitForTransactionReceipt({ hash: res });
        dispatch(
          setIndexer({
            actionOpen: true,
            actionMessage: "Indexing Interaction",
          })
        );
        await handleIndexCheck(
          {
            forTxHash: tx.transactionHash,
          },
          dispatch
        );
      } else {
        dispatch(
          setIndexer({
            actionOpen: true,
            actionMessage: "Indexing Interaction",
          })
        );
        setTimeout(async () => {
          await handleIndexCheck(
            {
              forTxId: (broadcastResult?.data?.broadcastOnchain as RelaySuccess)
                .txId,
            },
            dispatch
          );
        }, 7000);
      }
      await refetchProfile(dispatch, lensConnected?.id, lensConnected?.id);
    } catch (err: any) {
      console.error(err.message);
    }
    setFollowUpdateLoading(false);
  };

  useEffect(() => {
    if (
      lensConnected?.id &&
      // lensConnected?.handle?.fullHandle === pageProfile?.handle?.fullHandle &&
      ScreenDisplay.Settings == screenDisplay
    ) {
      setSettingsData({
        attributes: lensConnected?.metadata?.attributes?.map((item) => ({
          type: item?.type,
          key: item?.key,
          value: item?.value,
        })) as MetadataAttribute[] | undefined,
        bio: lensConnected?.metadata?.bio,
        coverPicture:
          lensConnected?.metadata?.coverPicture?.__typename === "ImageSet"
            ? lensConnected?.metadata?.coverPicture?.raw?.uri
            : (lensConnected?.metadata?.coverPicture as unknown as NftImage)
                ?.image?.raw?.uri,
        name: lensConnected?.metadata?.displayName as string,
        picture:
          lensConnected?.metadata?.picture?.__typename === "ImageSet"
            ? lensConnected?.metadata?.picture?.raw?.uri
            : (lensConnected?.metadata?.picture as NftImage)?.image?.raw?.uri,
        microbrands: lensConnected?.metadata?.attributes?.[
          lensConnected?.metadata?.attributes?.findIndex(
            (item) => item?.key === "microbrandCypher"
          )
        ]
          ? JSON.parse(
              lensConnected?.metadata?.attributes?.[
                lensConnected?.metadata?.attributes?.findIndex(
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
  }, [lensConnected?.id, screenDisplay, pageProfile]);

  return {
    handleSettingsUpdate,
    settingsUpdateLoading,
    setSettingsData,
    settingsData,
    coverImage,
    handleImage,
    pfpImage,
    handleFollowUpdate,
    followUpdateLoading,
    followData,
    setFollowData,
    openType,
    setOpenType,

    currencyOpen,
    setCurrencyOpen,
  };
};

export default useSettings;
