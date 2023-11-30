import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import { CollectionDetails, ScreenDisplay } from "../types/autograph.types";
import { erc721OwnershipCondition } from "@lens-protocol/metadata";
import lensPost from "../../../../lib/helpers/api/postChain";
import {
  Address,
  PublicClient,
  WalletClient,
  createWalletClient,
  custom,
} from "viem";
import { AnyAction, Dispatch } from "redux";
import { polygon, polygonMumbai } from "viem/chains";
import uploadPostContent from "../../../../lib/helpers/uploadPostContent";
import {
  LimitType,
  Profile,
  PublicationType,
} from "../../../../graphql/generated";
import refetchProfile from "../../../../lib/helpers/api/refetchProfile";
import {
  CHROMADIN_OPEN_ACTION,
  COIN_OP_OPEN_ACTION,
  COLLECTION_CREATOR,
  DIGITALAX_ADDRESS,
  LISTENER_OPEN_ACTION,
  NFT_CREATOR_ADDRESS,
  ZERO_ADDRESS,
  printStringToNumber,
} from "../../../../lib/constants";
import { ethers } from "ethers";
import { setPostSuccess } from "../../../../redux/reducers/postSuccessSlice";
import CollectionCreatorAbi from "./../../../../abis/CollectionCreatorAbi.json";
import getPublications from "../../../../graphql/lens/queries/publications";
import { Creation } from "@/components/Tiles/types/tiles.types";
import { getCollections } from "../../../../graphql/subgraph/queries/getCollections";
import lensHide from "../../../../lib/helpers/api/hidePost";
import { LensClient, production } from "@lens-protocol/client/gated";
import {
  LitNodeClient,
  checkAndSignAuthMessage,
  encryptString,
} from "@lit-protocol/lit-node-client";
import { AccessControlConditions } from "@lit-protocol/types";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";
import { setIndexer } from "../../../../redux/reducers/indexerSlice";
import toHexWithLeadingZero from "../../../../lib/helpers/leadingZero";
import collectionFixer from "../../../../lib/helpers/collectionFixer";

const useCreate = (
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  dispatch: Dispatch<AnyAction>,
  lensConnected: Profile | undefined,
  setDropDetails: (
    e: SetStateAction<{
      collectionIds: string[];
      title: string;
      cover: string;
      dropId: string;
    }>
  ) => void,
  screenDisplay: ScreenDisplay,
  pageProfile: Profile | undefined,
  client: LitNodeClient,
  isDesigner: boolean
) => {
  const coder = new ethers.AbiCoder();
  const [createCase, setCreateCase] = useState<string | undefined>(undefined);
  const [collectionLoading, setCollectionLoading] = useState<boolean>(false);
  const [allCollections, setAllCollections] = useState<Creation[]>([]);
  const [collectionSettings, setCollectionSettings] = useState<{
    media: string;
    origin: string;
    microOpen: boolean;
    communityOpen: boolean;
    accessOpen: boolean;
    visibilityOpen: boolean;
    dropOpen: boolean;
    printOpen: boolean;
    colorOpen: boolean;
    sizeOpen: boolean;
  }>({
    media: "static",
    origin: "chromadin",
    microOpen: false,
    communityOpen: false,
    accessOpen: false,
    visibilityOpen: false,
    dropOpen: false,
    printOpen: false,
    colorOpen: false,
    sizeOpen: false,
  });
  const [collectionDetails, setCollectionDetails] = useState<CollectionDetails>(
    {
      title: "",
      description: "",
      collectionId: "",
      price: "",
      acceptedTokens: [
        "0x566d63f1cc7f45bfc9b2bdc785ffcc6f858f0997",
        "0xf87b6343c172720ac9cc7d1c9465d63454a8ef30",
      ],
      profileId: "",
      pubId: "",
      images: [],
      otherPrices: [],
      video: "",
      audio: "",
      tags: "",
      prompt: "",
      amount: "1",
      visibility: "public",
      sizes: "",
      colors: "",
      profileHandle: "",
      microbrand: {
        microbrand: "",
        microbrandCover: "",
      },
      access: "",
      dropId: "",
      dropTitle: "",
      dropCover: "",
      dropCollectionIds: [],
      communities: "",
      cover: "",
      printType: "",
    }
  );
  const [creationLoading, setCreationLoading] = useState<boolean>(false);

  const getAllCollections = async () => {
    setCollectionLoading(true);
    try {
      const data = await getCollections(address!);
      const newCollections = data?.data?.collectionCreateds?.map(
        async (collection: any) => await collectionFixer(collection)
      );
      const promises = await Promise.all(newCollections);
      setAllCollections(promises || []);
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
      collectionDetails.price?.trim() == "" ||
      !collectionDetails.acceptedTokens ||
      collectionDetails.acceptedTokens?.length < 1 ||
      Number(collectionDetails?.amount) < 0 ||
      !address
    )
      return;
    if (
      collectionSettings?.origin !== "chromadin" &&
      (collectionDetails?.sizes?.trim() == "" ||
        collectionDetails?.colors?.trim() == "" ||
        collectionDetails?.printType?.trim() == "" ||
        ((collectionDetails?.printType === "sticker" ||
          collectionDetails?.printType === "poster") &&
          collectionDetails?.otherPrices?.length !==
            collectionDetails?.sizes?.split(/,\s*/)?.slice(1).filter(Boolean)
              ?.length))
    )
      return;
    setCreationLoading(true);

    try {
      const postContentURI = await uploadPostContent(
        collectionDetails?.description?.trim() == ""
          ? " "
          : collectionDetails?.description,
        collectionSettings?.media === "static" ? collectionDetails.images : [],
        collectionSettings?.media === "video" ? [collectionDetails?.video] : [],
        collectionSettings?.media === "audio" ? [collectionDetails?.audio] : [],
        [],
        collectionDetails?.title?.trim() == "" ? " " : collectionDetails?.title,
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
        collectionDetails?.visibility === "private" ? true : false,
        collectionSettings?.media === "static"
          ? undefined
          : collectionDetails?.cover
      );

      const communityIds = collectionDetails?.communities
        ?.split(/,\s*/)
        ?.filter((com) => com.trim() !== "")
        ?.map((item) => Number(item[2]));

      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      const contentURI = await getURI(
        collectionDetails?.visibility === "private" ? true : false,
        postContentURI
      );

      if (edit) {
        await lensHide(
          `${
            "0x" + toHexWithLeadingZero(Number(collectionDetails?.profileId))
          }-${"0x" + toHexWithLeadingZero(Number(collectionDetails?.pubId))}`,
          dispatch
        );
        const { request } = await publicClient.simulateContract({
          address: COLLECTION_CREATOR,
          abi: CollectionCreatorAbi,
          functionName: "removeCollection",
          chain: polygonMumbai,
          args: [Number(collectionDetails?.collectionId)],
          account: address,
        });
        const res = await clientWallet.writeContract(request);
        await publicClient.waitForTransactionReceipt({ hash: res });
      }

      let uri: string = postContentURI?.string!;
      if (collectionDetails?.visibility === "private") {
        await client.connect();
        uri = (await handleEncrypt(
          clientWallet,
          postContentURI?.object!
        )) as string;
      }

      const prices =
        collectionSettings?.origin == "chromadin"
          ? [`${Number(collectionDetails?.price) * 10 ** 18}`]
          : [
              `${Number(collectionDetails?.price) * 10 ** 18}`,
              ...collectionDetails?.otherPrices?.map(
                (price) => `${Number(price) * 10 ** 18}`
              ),
            ];

      const dataObject = {
        prices: prices,
        communityIds,
        acceptedTokens: collectionDetails?.acceptedTokens,
        uri: contentURI,
        fulfiller:
          collectionSettings?.origin == "chromadin"
            ? ZERO_ADDRESS
            : DIGITALAX_ADDRESS,
        creatorAddress: address,
        amount: Number(collectionDetails?.amount),
        dropId: Number(collectionDetails?.dropId),
        unlimited: false,
        encrypted: collectionDetails?.visibility === "private" ? true : false,
      };

      const encoded =
        collectionSettings?.origin == "chromadin"
          ? coder.encode(
              [
                "tuple(uint256[] prices, uint256[] communityIds, address[] acceptedTokens, string uri, address fulfiller, address creatorAddress, uint256 amount, uint256 dropId, bool unlimited, bool encrypted)",
              ],
              [dataObject]
            )
          : coder.encode(
              [
                "tuple(uint256[] prices, uint256[] communityIds, address[] acceptedTokens, string uri, address fulfiller, address creatorAddress, uint256 amount, uint256 dropId, bool unlimited, bool encrypted)",
                "uint8",
              ],
              [
                dataObject,
                printStringToNumber[
                  collectionDetails?.printType.charAt(0).toUpperCase() +
                    collectionDetails?.printType.slice(1).toLowerCase()
                ],
              ]
            );
      await lensPost(
        uri,
        dispatch,
        [
          {
            unknownOpenAction: {
              address:
                collectionSettings?.origin == "chromadin"
                  ? CHROMADIN_OPEN_ACTION
                  : collectionSettings?.origin == "listener"
                  ? LISTENER_OPEN_ACTION
                  : COIN_OP_OPEN_ACTION,
              data: encoded,
            },
          },
        ],
        address,
        clientWallet,
        publicClient
      );

      await refetchProfile(dispatch, lensConnected?.id, lensConnected?.id);

      const { data } = await getPublications(
        {
          limit: LimitType.Ten,
          where: {
            from: lensConnected?.id,
            publicationTypes: [PublicationType.Post],
          },
        },
        true
      );

      await cleanCollection(
        edit ? "updated" : "created",
        collectionDetails?.title
      );
    } catch (err: any) {
      if (
        !err?.messages?.includes("Block at number") &&
        !err?.message?.includes("could not be found")
      ) {
        dispatch(setInteractError(true));
        console.error(err.message);
      } else {
        dispatch(
          setIndexer({
            actionOpen: true,
            actionMessage: "Successfully Indexed",
          })
        );

        setTimeout(() => {
          dispatch(
            setIndexer({
              actionOpen: false,
              actionMessage: undefined,
            })
          );
        }, 3000);
      }
    }
    setCreationLoading(false);
  };

  const deleteCollection = async () => {
    setCreationLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      await lensHide(
        `${"0x" + toHexWithLeadingZero(Number(collectionDetails?.profileId))}-${
          "0x" + toHexWithLeadingZero(Number(collectionDetails?.pubId))
        }`,
        dispatch
      );

      const { request } = await publicClient.simulateContract({
        address: COLLECTION_CREATOR,
        abi: CollectionCreatorAbi,
        functionName: "removeCollection",
        chain: polygonMumbai,
        args: [Number(collectionDetails?.collectionId)],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      await cleanCollection(
        "deleted",
        `${"0x" + toHexWithLeadingZero(Number(collectionDetails?.profileId))}-${
          "0x" + toHexWithLeadingZero(Number(collectionDetails?.pubId))
        }`
      );
    } catch (err: any) {
      if (
        !err?.messages?.includes("Block at number") &&
        !err?.message?.includes("could not be found")
      ) {
        dispatch(setInteractError(true));
        console.error(err.message);
      } else {
        dispatch(
          setIndexer({
            actionOpen: true,
            actionMessage: "Successfully Indexed",
          })
        );

        setTimeout(() => {
          dispatch(
            setIndexer({
              actionOpen: false,
              actionMessage: undefined,
            })
          );
        }, 3000);
      }
    }
    setCreationLoading(false);
  };

  const cleanCollection = async (actionType: string, actionPubId: string) => {
    try {
      setCollectionDetails({
        title: "",
        description: "",
        collectionId: "",
        price: "",
        acceptedTokens: [
          "0x566d63f1cc7f45bfc9b2bdc785ffcc6f858f0997",
          "0xf87b6343c172720ac9cc7d1c9465d63454a8ef30",
        ],
        images: [],
        otherPrices: [],
        profileId: "",
        pubId: "",
        video: "",
        audio: "",
        tags: "",
        prompt: "",
        amount: "",
        visibility: "public",
        sizes: "",
        colors: "",
        profileHandle: "",
        microbrand: {
          microbrand: "",
          microbrandCover: "",
        },
        access: "",
        dropId: "",
        dropTitle: "",
        dropCover: "",
        dropCollectionIds: [],
        communities: "",
        cover: "",
        printType: "",
      });
      setCollectionSettings({
        media: "static",
        origin: "chromadin",
        microOpen: false,
        communityOpen: false,
        accessOpen: false,
        visibilityOpen: false,
        dropOpen: false,
        printOpen: false,
        colorOpen: false,
        sizeOpen: false,
      });
      dispatch(
        setPostSuccess({
          actionValue: "collection",
          actionPubId,
          actionType,
        })
      );
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
          setCollectionDetails((prev) => ({
            ...prev,
            images: [
              {
                media: e.target?.result as string,
                type: file.type,
              },
            ],
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getURI = async (
    encrypted: boolean,
    postContentURI:
      | {
          string: string;
          object: Object;
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
        profileId,
        pubId,
        images,
        audio,
        video,
        cover,
        acceptedTokens,
        printType,
        otherPrices,
        colors,
        sizes,
        ...restOfCollectionDetails
      } = collectionDetails;

      const newAudio = (postContentURI?.object as any)?.lens?.audio?.item;
      const newVideo = (postContentURI?.object as any)?.lens?.video?.item;
      const newImages = [
        (postContentURI?.object as any)?.lens?.image?.item,
        ...((postContentURI?.object as any)?.lens?.attachments?.map(
          (value: { type: string; item: string }) => value?.item
        ) || []),
      ];

      let toHash: Object = {
        ...restOfCollectionDetails,
        images: newImages,
        audio: newAudio,
        video: newVideo,
        cover:
          collectionSettings?.media === "audio"
            ? (postContentURI?.object as any)?.lens?.audio?.cover
            : collectionSettings?.media === "video"
            ? (postContentURI?.object as any)?.lens?.video?.cover
            : undefined,
        tags: collectionDetails?.tags
          ?.split(/,\s*/)
          ?.filter((tag) => tag.trim() !== ""),
        access: collectionDetails?.access
          ?.split(/,\s*/)
          ?.filter((acc) => acc.trim() !== ""),
        communities: collectionDetails?.communities
          ?.split(/,\s*/)
          ?.filter((com) => com.trim() !== ""),
        mediaTypes: [collectionSettings?.media],
        profileHandle:
          lensConnected?.handle?.suggestedFormatted?.localName?.split("@")?.[1],
        microbrand: collectionDetails?.microbrand?.microbrand,
        microbrandCover: collectionDetails?.microbrand?.microbrandCover,
        colors:
          collectionSettings?.origin === "chromadin"
            ? []
            : collectionDetails?.colors
                ?.split(/,\s*/)
                ?.filter((color) => color.trim() !== ""),
        sizes:
          collectionSettings?.origin === "chromadin"
            ? []
            : collectionDetails?.sizes
                ?.split(/,\s*/)
                ?.filter((size) => size.trim() !== ""),
      };

      if (encrypted) {
        const authSig = await checkAndSignAuthMessage({
          chain: "mumbai",
        });

        const accessControlConditions = [
          {
            contractAddress: "",
            standardContractType: "",
            chain: "mumbai",
            method: "",
            parameters: [":userAddress"],
            returnValueTest: {
              comparator: "=",
              value: address,
            },
          },
          {
            operator: "or",
          },
          {
            contractAddress: NFT_CREATOR_ADDRESS,
            standardContractType: "ERC721",
            chain: 80001,
            method: "balanceOf",
            parameters: [":userAddress"],
            returnValueTest: {
              comparator: ">",
              value: "0",
            },
          },
        ];
        const { ciphertext, dataToEncryptHash } = await encryptString(
          {
            accessControlConditions:
              accessControlConditions as AccessControlConditions,
            authSig,
            chain: "mumbai",
            dataToEncrypt: JSON.stringify(toHash),
          },
          client!
        );

        toHash = {
          ciphertext,
          dataToEncryptHash,
          accessControlConditions,
        };
      }

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

  const handleEncrypt = async (
    clientWallet: WalletClient,
    postContentURI: Object
  ): Promise<string | undefined> => {
    try {
      const client = new LensClient({
        environment: production,

        authentication: {
          domain: "cyphersearch",
          uri: "https://cypher.digitalax.xyz",
        },
        signer: {
          ...clientWallet,
          getAddress: async (): Promise<Address> => {
            const addresses = await clientWallet.getAddresses();
            return addresses?.[0] ?? "default-address-or-null";
          },

          signMessage: async (message: string): Promise<string> => {
            const account = (await clientWallet.getAddresses())?.[0];
            if (!account) {
              throw new Error("No account found for signing");
            }
            return clientWallet.signMessage({ account, message });
          },
        },
      });

      const result = await client.gated.encryptPublicationMetadata(
        postContentURI as any,
        erc721OwnershipCondition({
          contract: { address: NFT_CREATOR_ADDRESS, chainId: 80001 },
        })
      );

      if (!result.isFailure()) {
        const response = await fetch("/api/ipfs", {
          method: "POST",
          body: result?.value,
        });
        const responseJSON = await response.json();
        return responseJSON?.cid;
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (
      screenDisplay === ScreenDisplay.Gallery &&
      (allCollections?.length < 1 || !allCollections) &&
      address &&
      lensConnected?.handle?.fullHandle === pageProfile?.handle?.fullHandle &&
      isDesigner
    ) {
      getAllCollections();
    }
  }, [screenDisplay, lensConnected?.id, address]);

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
  };
};

export default useCreate;
