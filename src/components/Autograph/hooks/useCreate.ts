import { ChangeEvent, useEffect, useState } from "react";
import { CollectionDetails, ScreenDisplay } from "../types/autograph.types";
import lensPost from "../../../../lib/helpers/api/postChain";
import { PublicClient, createWalletClient, custom } from "viem";
import { AnyAction, Dispatch } from "redux";
import { polygon, polygonMumbai } from "viem/chains";
import uploadPostContent from "../../../../lib/helpers/uploadPostContent";
import { Client } from "@xmtp/react-sdk";
import { DIGITALAX_ADDRESS } from "../../../../lib/constants";
import { MetadataAttributeType, Profile } from "../../../../graphql/generated";
import setMeta from "../../../../lib/helpers/api/setMeta";
import refetchProfile from "../../../../lib/helpers/api/refetchProfile";

const useCreate = (
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  dispatch: Dispatch<AnyAction>,
  lensConnected: Profile | undefined
) => {
  const [createCase, setCreateCase] = useState<string | undefined>(undefined);
  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [collectionSettings, setCollectionSettings] = useState<{
    media: string;
    origin: string;
    microOpen: boolean;
    communityOpen: boolean;
    accessOpen: boolean;
  }>({
    media: "static",
    origin: "chromadin",
    microOpen: false,
    communityOpen: false,
    accessOpen: false,
  });
  const [collectionDetails, setCollectionDetails] = useState<CollectionDetails>(
    {
      title: "",
      description: "",
      prices: [],
      acceptedTokens: [],
      images: [],
      video: "",
      audio: "",
      tags: "",
      prompt: "",
      visibility: "",
      sizes: [],
      colors: [],
      profileHandle: "",
      microbrand: {
        microbrand: "",
        microbrandCover: "",
      },
      access: "",
      drop: "",
      communities: "",
    }
  );
  const [creationLoading, setCreationLoading] = useState<boolean>(false);

  const createDrop = async () => {
    setCreationLoading(true);
    try {
    } catch (err: any) {
      console.error(err.message);
    }

    setCreationLoading(false);
  };

  const createCollection = async () => {
    if (
      (collectionDetails.title?.trim() !== "" &&
        collectionDetails.description?.trim() !== "" &&
        (!collectionDetails.images || collectionDetails.images!.length < 1) &&
        (!collectionDetails.prices || collectionDetails.prices!.length < 1) &&
        (!collectionDetails.acceptedTokens ||
          collectionDetails.acceptedTokens!.length < 1) &&
        collectionDetails.tags?.trim() !== "" &&
        !collectionDetails?.acceptedTokens) ||
      !address
    )
      return;
    setCreationLoading(true);

    try {
      const postContentURI = await uploadPostContent(
        collectionDetails?.description,
        collectionDetails.images,
        [collectionDetails?.video],
        [],
        [collectionDetails?.audio],
        collectionDetails?.title,
        collectionDetails?.tags
          ?.split(/,\s*|\s+/)
          ?.filter((tag) => tag.trim() !== "")
      );

      const collectionURI = {
        ...collectionDetails,
        tags: collectionDetails?.tags
          ?.split(/,\s*|\s+/)
          ?.filter((tag) => tag.trim() !== ""),
        access: collectionDetails?.access
          ?.split(/,\s*|\s+/)
          ?.filter((tag) => tag.trim() !== ""),
        communities: collectionDetails?.communities
          ?.split(/,\s*|\s+/)
          ?.filter((tag) => tag.trim() !== ""),
        mediaType: collectionSettings?.media,
      };

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      // await lensPost(
      //   contentURI,
      //   dispatch,
      //   [
      //    { unknownOpenAction: {
      //         address: ,
      //         data: ,

      //       }}
      //   ],
      //   address,
      //   clientWallet,
      //   publicClient
      // );

      await refetchProfile(dispatch, lensConnected?.id);

      // REFETCH COLLECTIONS AND ALL POSTS TOO!!!
    } catch (err: any) {
      console.error(err.message);
    }
    setCreationLoading(false);
  };

  const handleSendMessage = async () => {
    setMessageLoading(true);
    try {
      const clientWallet = createWalletClient({
        account: address,
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      const client = await Client.create(clientWallet, {
        env: "production",
      });
      const conversation = await client.conversations.newConversation(
        DIGITALAX_ADDRESS
      );
      const data = conversation.send(message);
      if ((await data).sent) {
        setMessage("Message sent! We'll be in touch shortly.");
        setTimeout(() => {
          setMessage("");
        }, 6000);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setMessageLoading(false);
  };

  const handleMedia = async (e: ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (id == "audio") {
          setCollectionDetails((prev) => ({
            ...prev,
            audio: e.target?.result as string,
          }));
        } else if (id == "video") {
          setCollectionDetails((prev) => ({
            ...prev,
            video: e.target?.result as string,
          }));
        } else {
          setCollectionDetails((prev) => ({
            ...prev,
            images: [e.target?.result as string],
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return {
    createCase,
    setCollectionDetails,
    setCreateCase,
    collectionDetails,
    createDrop,
    createCollection,
    creationLoading,
    setCollectionSettings,
    collectionSettings,
    message,
    setMessage,
    messageLoading,
    handleSendMessage,
    handleMedia,
  };
};

export default useCreate;
