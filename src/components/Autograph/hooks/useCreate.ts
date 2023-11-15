import {
  ChangeEvent,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { CollectionDetails, ScreenDisplay } from "../types/autograph.types";
import lensPost from "../../../../lib/helpers/api/postChain";
import { PublicClient, createWalletClient, custom } from "viem";
import { AnyAction, Dispatch } from "redux";
import { polygon } from "viem/chains";
import uploadPostContent from "../../../../lib/helpers/uploadPostContent";
import {
  LimitType,
  Profile,
  PublicationType,
} from "../../../../graphql/generated";
import refetchProfile from "../../../../lib/helpers/api/refetchProfile";
import WaveSurfer from "wavesurfer.js";
import {
  CHROMADIN_OPEN_ACTION,
  COLLECTION_CREATOR,
  INFURA_GATEWAY,
  ZERO_ADDRESS,
} from "../../../../lib/constants";
import { ethers } from "ethers";
import { setPostSuccess } from "../../../../redux/reducers/postSuccessSlice";
import CollectionCreatorAbi from "./../../../../abis/CollectionCreatorAbi.json";
import getPublications from "../../../../graphql/lens/queries/publications";
import { Creation } from "@/components/Tiles/types/tiles.types";
import { getCollections } from "../../../../graphql/subgraph/queries/getCollections";

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
  pageProfile: Profile | undefined
) => {
  const [createCase, setCreateCase] = useState<string | undefined>(undefined);
  const [collectionLoading, setCollectingLoading] = useState<boolean>(false);
  const [allCollections, setAllCollections] = useState<Creation[]>([]);
  const [collectionSettings, setCollectionSettings] = useState<{
    media: string;
    origin: string;
    microOpen: boolean;
    communityOpen: boolean;
    accessOpen: boolean;
    visibilityOpen: boolean;
    videoAudio: boolean;
    dropOpen: boolean;
  }>({
    media: "static",
    origin: "chromadin",
    microOpen: false,
    communityOpen: false,
    accessOpen: false,
    visibilityOpen: false,
    videoAudio: false,
    dropOpen: false,
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
      video: "",
      audio: "",
      tags: "",
      prompt: "",
      amount: "1",
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

  const getAllCollections = async () => {
    setCollectingLoading(true);
    try {
      const data = await getCollections(address!);
      data?.data?.collectionCreateds?.map((collection: any) => ({
        ...collection,
        sizes: collection?.sizes?.split(",").map((word: string) => word.trim()),
        colors: collection?.colors
          ?.split(",")
          .map((word: string) => word.trim()),
        mediaTypes: collection?.mediaTypes
          ?.split(",")
          .map((word: string) => word.trim()),
        access: collection?.access
          ?.split(",")
          .map((word: string) => word.trim()),
        communities: collection?.communities
          ?.split(",")
          .map((word: string) => word.trim()),
        tags: collection?.tags?.split(",").map((word: string) => word.trim()),
      }));
      setAllCollections(data?.data?.collectionCreateds || []);
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectingLoading(false);
  };

  const createCollection = async () => {
    if (
      collectionDetails?.drop?.trim() == "" ||
      collectionDetails.title?.trim() == "" ||
      collectionDetails.description?.trim() == "" ||
      (collectionSettings?.media == "static" &&
        (!collectionDetails.images || collectionDetails.images!.length < 1)) ||
      (collectionSettings?.media === "audio" &&
        collectionDetails?.audio == "") ||
      (collectionSettings?.media === "video" &&
        collectionDetails?.video == "") ||
      collectionDetails.price?.trim() == "" ||
      !collectionDetails.acceptedTokens ||
      collectionDetails.acceptedTokens!.length < 1 ||
      collectionDetails.tags?.trim() == "" ||
      Number(collectionDetails?.amount) < 0 ||
      !address
    )
      return;
    setCreationLoading(true);

    try {
      const coder = new ethers.AbiCoder();
      const postContentURI = await uploadPostContent(
        collectionDetails?.description,
        collectionSettings?.media !== "video" ? collectionDetails.images : [],
        collectionSettings?.media === "video" ? [collectionDetails?.video] : [],
        [],
        collectionSettings?.media === "audio" ? [collectionDetails?.audio] : [],
        collectionDetails?.title,
        collectionDetails?.tags
          ?.split(/,\s*|\s+/)
          ?.filter((tag) => tag.trim() !== "")
      );

      const communityIds = collectionDetails?.communities
        ?.split(/,\s*|\s+/)
        ?.filter((com) => com.trim() !== "")
        ?.map((item) => Number(item[2]));

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const contentURI = await getURI();

      await lensPost(
        postContentURI!,
        dispatch,
        [
          {
            unknownOpenAction: {
              address: CHROMADIN_OPEN_ACTION,
              data: coder.encode(
                [
                  "tuple(uint256[] prices, uint256[] communityIds, address[] acceptedTokens, string uri, address fulfiller, uint256 amount, uint256 dropId, bool unlimited, address creatorAddress)",
                ],
                [
                  {
                    prices: [`${Number(collectionDetails?.price) * 10 ** 18}`],
                    communityIds,
                    acceptedTokens: collectionDetails?.acceptedTokens,
                    uri: contentURI,
                    fulfiller: ZERO_ADDRESS,
                    amount: Number(collectionDetails?.amount),
                    dropId: Number(collectionDetails?.drop),
                    unlimited: false,
                    creatorAddress: address,
                  },
                ]
              ),
            },
          },
        ],
        address,
        clientWallet,
        publicClient
      );

      await refetchProfile(dispatch, lensConnected?.id);

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

      await cleanCollection("created", data?.publications?.items?.[0]?.id);
    } catch (err: any) {
      console.error(err.message);
    }
    setCreationLoading(false);
  };

  const editCollection = async () => {
    setCreationLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });
      const communityIds = collectionDetails?.communities
        ?.split(/,\s*|\s+/)
        ?.filter((com) => com.trim() !== "")
        ?.map((item) => Number(item[2]));

      const contentURI = await getURI();

      const { request } = await publicClient.simulateContract({
        address: COLLECTION_CREATOR,
        abi: CollectionCreatorAbi,
        functionName: "updateCollection",
        chain: polygon,
        args: [
          Number(collectionDetails?.collectionId),
          {
            acceptedTokens: collectionDetails?.acceptedTokens,
            prices: [`${Number(collectionDetails?.price) * 10 ** 18}`],
            communityIds,
            uri: contentURI,
            fulfiller: ZERO_ADDRESS,
            creator: address,
            printType: 6,
            origin: 1,
            amount: Number(collectionDetails?.amount),
            pubId: Number(collectionDetails?.pubId),
            profileId: Number(collectionDetails?.profileId),
            dropId: Number(collectionDetails?.drop),
            unlimited: false,
          },
        ],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      await cleanCollection(
        "updated",
        `${Number(collectionDetails?.profileId)?.toString(16)}-${Number(
          collectionDetails?.pubId
        )?.toString(16)}`
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setCreationLoading(false);
  };

  const deleteCollection = async () => {
    setCreationLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });
      const { request } = await publicClient.simulateContract({
        address: COLLECTION_CREATOR,
        abi: CollectionCreatorAbi,
        functionName: "removeDrop",
        chain: polygon,
        args: [Number(collectionDetails?.collectionId)],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      await cleanCollection(
        "deleted",
        `${Number(collectionDetails?.profileId)?.toString(16)}-${Number(
          collectionDetails?.pubId
        )?.toString(16)}`
      );
    } catch (err: any) {
      console.error(err.message);
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
        profileId: "",
        pubId: "",
        video: "",
        audio: "",
        tags: "",
        prompt: "",
        amount: "",
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
      });
      setCollectionSettings({
        media: "static",
        origin: "chromadin",
        microOpen: false,
        communityOpen: false,
        accessOpen: false,
        visibilityOpen: false,
        videoAudio: false,
        dropOpen: false,
      });
      dispatch(
        setPostSuccess({
          actionValue: "coll",
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
          setCollectionDetails((prev) => ({
            ...prev,
            video: e.target?.result as string,
          }));
        } else if (id == "drop") {
          setDropDetails((prev) => ({
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

    if (id === "video") {
      const video = document.createElement("video");
      video.muted = true;
      video.crossOrigin = "anonymous";
      video.preload = "auto";

      const value = new Promise((resolve, reject) => {
        video.addEventListener("error", reject);

        video.addEventListener(
          "canplay",
          () => {
            video.currentTime = 0.99;
          },
          { once: true }
        );

        video.addEventListener(
          "seeked",
          () =>
            resolve(
              (video as any).mozHasAudio ||
                Boolean((video as any).webkitAudioDecodedByteCount) ||
                Boolean((video as any).audioTracks?.length)
            ),
          {
            once: true,
          }
        );

        video.src = URL.createObjectURL((e as any).target.files[0]);
      });

      const hasAudio = await value;

      setCollectionSettings((prev) => ({
        ...prev,
        videoAudio: hasAudio as boolean,
      }));
    }
  };

  const handlePlayPause = (
    key: string,
    wavesurfer: MutableRefObject<WaveSurfer | null>,
    type: string
  ) => {
    const videoElement = document.getElementById(key) as HTMLVideoElement;

    if (wavesurfer.current) {
      if (videoElement && type === "video") {
        if (videoElement.paused) {
          videoElement.play();
          wavesurfer.current.play();
        } else {
          videoElement.pause();
          wavesurfer.current.pause();
        }
      } else {
        if (wavesurfer.current.isPlaying()) {
          wavesurfer.current.pause();
        } else {
          wavesurfer.current.play();
        }
      }
    }
  };

  const getURI = async (): Promise<string | undefined> => {
    try {
      const {
        price,
        microbrand,
        drop,
        collectionId,
        profileId,
        pubId,
        ...restOfCollectionDetails
      } = collectionDetails;
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify({
          ...restOfCollectionDetails,
          tags: collectionDetails?.tags
            ?.split(/,\s*|\s+/)
            ?.filter((tag) => tag.trim() !== ""),
          access: collectionDetails?.access
            ?.split(/,\s*|\s+/)
            ?.filter((acc) => acc.trim() !== ""),
          communities: collectionDetails?.communities
            ?.split(/,\s*|\s+/)
            ?.filter((com) => com.trim() !== ""),
          mediaTypes: [collectionSettings?.media],
          profileHandle:
            lensConnected?.handle?.suggestedFormatted?.localName?.split(
              "@"
            )?.[1],
          microbrand: collectionDetails?.microbrand?.microbrand,
          microbrandCover: collectionDetails?.microbrand?.microbrandCover,
        }),
      });
      const res = await response.json();
      return "ipfs://" + res?.cid;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (
      screenDisplay === ScreenDisplay.Gallery &&
      allCollections?.length < 1 &&
      address &&
      lensConnected?.handle?.fullHandle === pageProfile?.handle?.fullHandle
    ) {
      getAllCollections();
    }
  }, []);

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
    handlePlayPause,
    editCollection,
    deleteCollection,
    allCollections,
    collectionLoading,
  };
};

export default useCreate;
