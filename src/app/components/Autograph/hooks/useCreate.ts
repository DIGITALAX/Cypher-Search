import { ChangeEvent, useContext, useEffect, useState } from "react";
import {
  CollectionDetails,
  CollectionSettings,
  Drop,
  ScreenDisplay,
} from "../types/autograph.types";
import {
  ACCEPTED_TOKENS,
  CHROMADIN_OPEN_ACTION,
  COIN_OP_OPEN_ACTION,
  COLLECTION_CREATOR,
  DIGITALAX_ADDRESS,
  F3M_OPEN_ACTION,
  KINORA_OPEN_ACTION_PRINT,
  LISTENER_OPEN_ACTION,
} from "@/app/lib/constants";
import collectionFixer from "@/app/lib/helpers/collectionFixer";
import { useAccount } from "wagmi";
import { post, deletePost } from "@lens-protocol/client/actions";
import { ethers } from "ethers";
import { ModalContext } from "@/app/providers";
import { Account } from "@lens-protocol/client";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { chains } from "@lens-chain/sdk/viem";
import CollectionCreatorAbi from "./../../../../../abis/CollectionCreator.json";
import { Indexar } from "../../Search/types/search.types";
import { Collection } from "../../Common/types/common.types";
import uploadPostContent from "@/app/lib/helpers/uploadPostContent";
import {
  AudioMetadata,
  ImageMetadata,
  MediaImageMimeType,
  TextOnlyMetadata,
  VideoMetadata,
} from "@lens-protocol/metadata";
import convertToFile from "@/app/lib/helpers/convertToFile";
import { getDropsPrint } from "../../../../../graphql/queries/getDrop";

const useCreate = (profile: Account | undefined, dict: any) => {
  const coder = new ethers.AbiCoder();
  const context = useContext(ModalContext);
  const publicClient = createPublicClient({
    chain: chains.mainnet,
    transport: http("https://rpc.lens.xyz"),
  });
  const { address } = useAccount();
  const [createCase, setCreateCase] = useState<string | undefined>(undefined);
  const [collectionLoading, setCollectionLoading] = useState<boolean>(false);
  const [allCollections, setAllCollections] = useState<Collection[]>([]);
  const [allDrops, setAllDrops] = useState<Drop[]>([]);
  const [searchCollection, setSearchCollection] = useState<string>("");
  const [createDropLoading, setCreateDropLoading] = useState<boolean>(false);
  const [dropDetails, setDropDetails] = useState<{
    collectionIds: string[];
    title: string;
    cover: string;
    dropId: string;
  }>({
    collectionIds: [],
    title: "",
    cover: "",
    dropId: "",
  });
  const [collectionSettings, setCollectionSettings] =
    useState<CollectionSettings>({
      media: "static",
      origin: "chromadin",
      microOpen: false,
      communityOpen: false,
      accessOpen: false,
      dropOpen: false,
      printOpen: false,
      colorOpen: false,
      sizeOpen: false,
      styleOpen: false,
      sexOpen: false,
      imageIndex: 0,
      chromadinOpen: false,
    });
  const [collectionDetails, setCollectionDetails] = useState<CollectionDetails>(
    {
      title: "",
      description: "",
      collectionId: "",
      price: "",
      acceptedTokens: [ACCEPTED_TOKENS[1][2], ACCEPTED_TOKENS[2][2]],
      postId: "",
      images: [],
      video: "",
      audio: "",
      tags: "",
      prompt: "",
      amount: "1",
      sizes: "",
      colors: "",
      onChromadin: "no",
      microbrand: {
        microbrand: "",
        microbrandCover: "",
      },
      access: "",
      dropId: "",
      dropTitle: "",
      dropCover: "",
      dropCollectionIds: [],
      cover: "",
      printType: "",
      sex: "",
      style: "",
      extra: "",
    }
  );
  const [creationLoading, setCreationLoading] = useState<boolean>(false);

  const getAllCollections = async () => {
    setCollectionLoading(true);
    try {
      const data = await getDropsPrint(address!);

      const newCollections = data?.data?.dropCreateds
        ?.flatMap((drop: Drop) =>
          drop?.collections?.flatMap((col) => ({
            ...col,
            drop: {
              dropId: drop?.dropId,
              collections: drop?.collections?.map((col) => col?.collectionId),
              metadata: {
                title: drop?.metadata?.title,
                cover: drop?.metadata?.cover,
              },
            },
          }))
        )
        ?.map(async (collection: any) => await collectionFixer(collection));
      const promises = await Promise.all(newCollections);
      setAllCollections(promises || []);
      setAllDrops(data?.data?.dropCreateds);
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectionLoading(false);
  };

  const createCollection = async (edit?: boolean) => {
    if (
      collectionDetails?.dropId?.trim() == "" ||
      collectionDetails.title?.trim() == "" ||
      collectionDetails.description?.trim() == "" ||
      collectionDetails.description?.length > 2000 ||
      collectionDetails.prompt?.length > 2000 ||
      (collectionSettings?.media == "static" &&
        (!collectionDetails.images || collectionDetails.images?.length < 1)) ||
      (collectionSettings?.media === "audio" &&
        collectionDetails?.audio == "") ||
      (collectionSettings?.media === "video" &&
        collectionDetails?.video == "") ||
      (collectionDetails.price?.trim() == "" &&
        Number(collectionDetails.price) > 0) ||
      !collectionDetails.acceptedTokens ||
      collectionDetails.acceptedTokens?.length < 1 ||
      Number(collectionDetails?.amount) <= 0 ||
      !address
    )
      return;
    if (
      (collectionSettings?.origin !== "0" &&
        collectionSettings?.origin !== "3" &&
        (collectionDetails?.sizes?.trim() == "" ||
          collectionDetails?.colors?.trim() == "" ||
          collectionDetails?.printType?.trim() == "")) ||
      (collectionSettings?.origin === "3" &&
        (collectionDetails?.sex?.trim() == "" ||
          collectionDetails?.style?.trim() == ""))
    )
      return;
    setCreationLoading(true);

    try {
      const postContentURI = await uploadPostContent(
        context?.clienteAlmacenamiento!,
        collectionDetails?.description?.trim() == ""
          ? " "
          : collectionDetails?.description,
        collectionSettings?.media === "static"
          ? collectionDetails.images?.filter((i) => i.media?.trim() !== "")
          : [],
        collectionSettings?.media === "video" ? [collectionDetails?.video] : [],
        collectionSettings?.media === "audio" ? [collectionDetails?.audio] : [],
        [],
        collectionDetails?.title?.trim() == ""
          ? " "
          : collectionSettings?.origin == "1" &&
            collectionDetails?.onChromadin === "yes"
          ? collectionDetails?.title + " (Print)"
          : collectionDetails?.title,
        Array.from(
          new Set(
            (
              collectionDetails?.tags
                ?.split(/,\s*/)
                ?.filter((tag) => tag.trim() !== "") || []
            ).map((tag) => tag.toLowerCase())
          )
        )
          .map((lowerCaseTag) =>
            collectionDetails?.tags
              ?.split(/,\s*/)
              .find((tag) => tag.toLowerCase() === lowerCaseTag)
          )
          .filter((tag) => tag !== undefined) as string[],
        collectionSettings?.media === "static"
          ? undefined
          : collectionDetails?.cover
      );

      const contentURI = await getURI(postContentURI);

      if (edit) {
        await deletePost(context?.lensConectado?.sessionClient!, {
          post: collectionDetails?.postId,
        });

        const { request } = await publicClient.simulateContract({
          address: COLLECTION_CREATOR,
          abi: CollectionCreatorAbi,
          functionName: "removeCollection",
          chain: chains.mainnet,
          args: [Number(collectionDetails?.collectionId)],
          account: address,
        });
        const clientWallet = createWalletClient({
          chain: chains.mainnet,
          transport: custom((window as any).ethereum),
        });

        const res = await clientWallet.writeContract(request);
        await publicClient.waitForTransactionReceipt({ hash: res });
      }

      await post(context?.lensConectado?.sessionClient!, {
        contentUri: postContentURI?.uri,
        actions: [
          {
            unknown: {
              address:
                collectionSettings?.origin == "0"
                  ? CHROMADIN_OPEN_ACTION
                  : collectionSettings?.origin == "2"
                  ? LISTENER_OPEN_ACTION
                  : collectionSettings?.origin == "3"
                  ? F3M_OPEN_ACTION
                  : collectionSettings?.origin == "4"
                  ? KINORA_OPEN_ACTION_PRINT
                  : COIN_OP_OPEN_ACTION,
              params: [
                {
                  raw: {
                    key: ethers.keccak256(
                      ethers.toUtf8Bytes("lens.param.collectionCreator")
                    ),
                    data: coder.encode(
                      [
                        "tuple(address[] acceptedTokens, string uri, address fulfiller, uint256 price, uint256 dropId, uint256 amount, uint8 printType, bool unlimited)",
                      ],
                      [
                        {
                          acceptedTokens: collectionDetails?.acceptedTokens,
                          uri: contentURI,
                          fulfiller: DIGITALAX_ADDRESS,
                          price: collectionDetails?.price,
                          dropId: collectionDetails?.dropId,
                          amount: Number(collectionDetails?.amount),
                          printType: Number(collectionDetails?.printType),
                          unlimited: false,
                        },
                      ]
                    ),
                  },
                },
              ],
            },
          },
        ],
      });

      await cleanCollection(
        edit ? "updated" : "created",
        collectionDetails?.title
      );
    } catch (err: any) {
      if (
        !err?.messages?.includes("Block at number") &&
        !err?.message?.includes("could not be found")
      ) {
        context?.setModalOpen(dict?.error);
        console.error(err.message);
      } else {
        context?.setIndexar(Indexar.Success);

        setTimeout(() => {
          context?.setIndexar(Indexar.Inactive);
        }, 3000);
      }
    }
    setCreationLoading(false);
  };

  const deleteCollection = async () => {
    setCreationLoading(true);
    try {
      const res = await deletePost(context?.lensConectado?.sessionClient!, {
        post: collectionDetails?.postId,
      });

      if (res?.isOk()) {
        const clientWallet = createWalletClient({
          chain: chains.mainnet,
          transport: custom((window as any).ethereum),
        });

        const { request } = await publicClient.simulateContract({
          address: COLLECTION_CREATOR,
          abi: CollectionCreatorAbi,
          functionName: "removeCollection",
          chain: chains.mainnet,
          args: [Number(collectionDetails?.collectionId)],
          account: address,
        });
        const res = await clientWallet.writeContract(request);
        await publicClient.waitForTransactionReceipt({ hash: res });

        await cleanCollection("deleted", collectionDetails?.postId);
      }
    } catch (err: any) {
      if (
        !err?.messages?.includes("Block at number") &&
        !err?.message?.includes("could not be found")
      ) {
        context?.setModalOpen(dict?.error);
        console.error(err.message);
      } else {
        context?.setIndexar(Indexar.Success);

        setTimeout(() => {
          context?.setIndexar(Indexar.Inactive);
        }, 3000);
      }
    }
    setCreationLoading(false);
  };

  const cleanCollection = async (type: string, id: string) => {
    try {
      setCollectionDetails({
        title: "",
        description: "",
        collectionId: "",
        price: "",
        acceptedTokens: [ACCEPTED_TOKENS[1][2], ACCEPTED_TOKENS[2][2]],
        images: [],
        postId: "",
        video: "",
        audio: "",
        tags: "",
        prompt: "",
        amount: "",
        sizes: "",
        colors: "",
        microbrand: {
          microbrand: "",
          microbrandCover: "",
        },
        access: "",
        dropId: "",
        onChromadin: "no",
        dropTitle: "",
        dropCover: "",
        dropCollectionIds: [],
        cover: "",
        printType: "",
        sex: "",
        style: "",
        extra: "",
      });
      setCollectionSettings({
        media: "static",
        origin: "chromadin",
        microOpen: false,
        communityOpen: false,
        accessOpen: false,
        dropOpen: false,
        printOpen: false,
        colorOpen: false,
        sizeOpen: false,
        styleOpen: false,
        sexOpen: false,
        imageIndex: 0,
        chromadinOpen: false,
      });
      context?.setPostSuccess({
        value: "collection",
        id,
        type,
      });
      await getAllCollections();
    } catch (err: any) {
      console.error(err.message);
    }
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
          const video = document.createElement("video");
          video.src = e.target?.result as string;
          video.currentTime = 0.1;

          video.addEventListener("loadeddata", () => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext("2d");
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

            setCollectionDetails((prev) => ({
              ...prev,
              video: e.target?.result as string,
              cover: canvas.toDataURL(),
            }));
          });

          video.load();
        } else if (id == "drop") {
          setDropDetails((prev) => ({
            ...prev,
            cover: e.target?.result as string,
          }));
        } else if (id == "cover") {
          setCollectionDetails((prev) => ({
            ...prev,
            cover: e.target?.result as string,
          }));
        } else {
          setCollectionDetails((prev) => {
            const obj = { ...prev };
            const allImages = [...obj.images];
            allImages[collectionSettings?.imageIndex] = {
              media: e.target?.result as string,
              type: MediaImageMimeType.PNG,
            };
            return {
              ...obj,
              images: allImages,
            };
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getURI = async (
    postContentURI:
      | {
          uri: string;
          schema:
            | TextOnlyMetadata
            | VideoMetadata
            | ImageMetadata
            | AudioMetadata;
        }
      | undefined
  ): Promise<string | undefined> => {
    try {
      const {
        price,
        microbrand,
        dropId,
        dropCollectionIds,
        dropCover,
        dropTitle,
        collectionId,
        postId,
        images,
        audio,
        video,
        cover,
        acceptedTokens,
        printType,
        colors,
        sizes,
        sex,
        style,
        title,
        onChromadin,
        ...restOfCollectionDetails
      } = collectionDetails;

      const newAudio = (postContentURI?.schema as AudioMetadata)?.lens?.audio
        ?.item;
      const newVideo = (postContentURI?.schema as VideoMetadata)?.lens?.video
        ?.item;
      const newImages = [
        (postContentURI?.schema as ImageMetadata)?.lens?.image?.item,
        ...((postContentURI?.schema as ImageMetadata)?.lens?.attachments?.map(
          (value: { type: string; item: string }) => value?.item
        ) || []),
      ]?.filter(Boolean);

      let other = {};

      if (collectionSettings?.origin == "3") {
        other = {
          sex: collectionDetails?.sex,
          style: collectionDetails?.style,
          extra: collectionDetails?.extra,
        };
      }

      if (collectionSettings?.origin == "1") {
        other = {
          onChromadin: onChromadin?.trim() === "" ? "no" : onChromadin,
        };
      }

      let toHash: Object = {
        ...restOfCollectionDetails,
        images: newImages,
        audio: newAudio,
        video: newVideo,
        title:
          collectionSettings?.origin == "1" &&
          collectionDetails?.onChromadin === "yes"
            ? title + " (Print)"
            : title,
        cover:
          collectionSettings?.media === "audio"
            ? (postContentURI?.schema as AudioMetadata)?.lens?.audio?.cover
            : collectionSettings?.media === "video"
            ? (postContentURI?.schema as VideoMetadata)?.lens?.video?.cover
            : undefined,
        tags: collectionDetails?.tags
          ?.split(/,\s*/)
          ?.filter((tag) => tag.trim() !== ""),
        access: collectionDetails?.access
          ?.split(/,\s*/)
          ?.filter((acc) => acc.trim() !== ""),
        mediaTypes: [collectionSettings?.media],
        microbrand: collectionDetails?.microbrand?.microbrand,
        microbrandCover: collectionDetails?.microbrand?.microbrandCover,
        colors:
          collectionSettings?.origin === "0"
            ? []
            : collectionDetails?.colors
                ?.split(/,\s*/)
                ?.filter((color) => color.trim() !== ""),
        sizes:
          collectionSettings?.origin === "0"
            ? []
            : collectionDetails?.sizes
                ?.split(/,\s*/)
                ?.filter((size) => size.trim() !== ""),
        ...other,
      };

      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify(toHash),
      });
      const res = await response.json();
      return "ipfs://" + res?.cid;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const editDrop = async () => {
    setCreateDropLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: chains.mainnet,
        transport: custom((window as any).ethereum),
      });

      let newImage: string = dropDetails?.cover;

      if (dropDetails?.cover?.includes("base64")) {
        const response = await fetch("/api/ipfs", {
          method: "POST",
          body: convertToFile(newImage, "image/png"),
        });
        const responseJSON = await response.json();
        newImage = "ipfs://" + responseJSON.cid;
      }

      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify({
          title: dropDetails?.title,
          cover: newImage,
        }),
      });
      const dropURI = await response.json();

      const { request } = await publicClient.simulateContract({
        address: COLLECTION_CREATOR,
        abi: CollectionCreatorAbi,
        functionName: "updateDrop",
        chain: chains.mainnet,
        args: [
          dropDetails?.collectionIds?.map((item) => Number(item)),
          "ipfs://" + dropURI?.cid,
          Number(dropDetails?.dropId),
        ],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      await cleanDrop("updated");
    } catch (err: any) {
      console.error(err.message);
    }

    setCreateDropLoading(false);
  };

  const deleteDrop = async () => {
    setCreateDropLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: chains.mainnet,
        transport: custom((window as any).ethereum),
      });

      const { request } = await publicClient.simulateContract({
        address: COLLECTION_CREATOR,
        abi: CollectionCreatorAbi,
        functionName: "removeDrop",
        chain: chains.mainnet,
        args: [Number(dropDetails?.dropId)],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      await cleanDrop("deleted");
    } catch (err: any) {
      console.error(err.message);
    }

    setCreateDropLoading(false);
  };

  const createDrop = async () => {
    setCreateDropLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: chains.mainnet,
        transport: custom((window as any).ethereum),
      });

      const imageRes = await fetch("/api/ipfs", {
        method: "POST",
        body: convertToFile(dropDetails?.cover, "image/png"),
      });
      const responseJSON = await imageRes.json();

      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify({
          title: dropDetails?.title,
          cover: "ipfs://" + responseJSON.cid,
        }),
      });
      const dropURI = await response.json();

      const { request } = await publicClient.simulateContract({
        address: COLLECTION_CREATOR,
        abi: CollectionCreatorAbi,
        functionName: "createDrop",
        chain: chains.mainnet,
        args: ["ipfs://" + dropURI?.cid],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      await cleanDrop("created");
    } catch (err: any) {
      console.error(err.message);
    }

    setCreateDropLoading(false);
  };

  const cleanDrop = async (type: string) => {
    try {
      setDropDetails({
        collectionIds: [],
        title: "",
        cover: "",
        dropId: "",
      });

      context?.setPostSuccess({
        value: "drop",
        id: dropDetails?.title,
        type,
      });

      await getAllCollections();
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (
      context?.screenDisplay === ScreenDisplay.Gallery &&
      (allCollections?.length < 1 || !allCollections) &&
      address &&
      context?.lensConectado?.profile?.address == profile?.address &&
      context?.isDesigner
    ) {
      getAllCollections();
    }
  }, [context?.screenDisplay, context?.lensConectado?.profile, address]);

  return {
    createCase,
    setCollectionDetails,
    setCreateCase,
    collectionDetails,
    createCollection,
    creationLoading,
    setCollectionSettings,
    collectionSettings,
    handleMedia,
    deleteCollection,
    allCollections,
    collectionLoading,
    dropDetails,
    createDrop,
    createDropLoading,
    editDrop,
    deleteDrop,
    setDropDetails,
    searchCollection,
    setSearchCollection,
    allDrops,
  };
};

export default useCreate;
