import { ChangeEvent, useState } from "react";
import { omit } from "lodash";
import {
  Erc20,
  FeeFollowModuleSettings,
  Profile,
  ProfileMetadata,
  RelaySuccess,
} from "../../../../graphql/generated";
import setFollowModule from "../../../../graphql/lens/mutations/followModule";
import createSetFollowModule from "../../../../lib/helpers/createSetFollowModule";
import {  createWalletClient, custom } from "viem";
import LensHubProxy from "./../../../../abis/LensHubProxy.json";
import { polygon } from "viem/chains";
import { PublicClient } from "wagmi";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../../../../lib/constants";
import broadcast from "../../../../graphql/lens/mutations/broadcast";
import { setIndexer } from "../../../../redux/reducers/indexerSlice";
import setMeta from "../../../../lib/helpers/api/setMeta";
import refetchProfile from "../../../../lib/helpers/api/refetchProfile";
import handleIndexCheck from "../../../../graphql/lens/queries/indexed";
import { Dispatch } from "redux";

const useSettings = (
  lensConnected: Profile | undefined,
  availableCurrencies: Erc20[],
  dispatch: Dispatch,
  publicClient: PublicClient,
  address: `0x${string}` | undefined
) => {
  const [settingsUpdateLoading, setSettingsUpdateLoading] =
    useState<boolean>(false);
  const [followUpdateLoading, setFollowUpdateLoading] =
    useState<boolean>(false);
  const [openType, setOpenType] = useState<boolean>(false);
  const [currencyOpen, setCurrencyOpen] = useState<boolean>(false);
  const [pfpImage, setPFPImage] = useState<string>();
  const [coverImage, setCoverImage] = useState<string>();
  const [settingsData, setSettingsData] = useState<ProfileMetadata>({
    __typename: lensConnected?.metadata?.__typename,
    appId: "cypersearch",
    attributes: lensConnected?.metadata?.attributes,
    bio: lensConnected?.metadata?.bio,
    coverPicture: lensConnected?.metadata?.coverPicture,
    displayName: lensConnected?.metadata?.displayName,
    picture: lensConnected?.metadata?.picture,
    rawURI: lensConnected?.metadata?.rawURI,
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
        if (id == "cover") {
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
            body: images[i],
          });
          const responseJSON = await response.json();
          newImages.push("ipfs://" + responseJSON.cid);
        }
      }

      const metadata: ProfileMetadata = {
        ...settingsData,
        picture: hasNewPfpImage
          ? {
              raw: {
                uri: newImages[hasNewCoverImage ? 1 : 0],
              },
            }
          : settingsData.picture,
        coverPicture: hasNewCoverImage
          ? {
              raw: {
                uri: newImages[0],
              },
            }
          : settingsData.coverPicture,
      };

      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify(metadata),
      });
      const responseJSON = await response.json();

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await setMeta(
        "ipfs://" + responseJSON.cid,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );

      await refetchProfile(dispatch, lensConnected?.id);
    } catch (err: any) {
      console.error(err.message);
    }
    setSettingsUpdateLoading(false);
  };

  const handleFollowUpdate = async () => {
    setFollowUpdateLoading(true);
    try {
      const { data } = await setFollowModule({
        followModule: createSetFollowModule(
          followData.type,
          followData.value,
          followData?.currency?.contract?.address,
          lensConnected?.ownedBy?.address
        ),
      });

      const typedData = data?.createSetFollowModuleTypedData.typedData;

      const clientWallet = createWalletClient({
        chain: polygon,
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
          chain: polygon,
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
      await refetchProfile(dispatch, lensConnected?.id);
    } catch (err: any) {
      console.error(err.message);
    }
    setFollowUpdateLoading(false);
  };

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
