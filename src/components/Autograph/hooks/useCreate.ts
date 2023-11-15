import {
  ChangeEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { CollectionDetails } from "../types/autograph.types";
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
import { CHROMADIN_OPEN_ACTION, ZERO_ADDRESS } from "../../../../lib/constants";
import { ethers } from "ethers";
import { setPostSuccess } from "../../../../redux/reducers/postSuccessSlice";
import getPublications from "../../../../graphql/lens/queries/publications";

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
  ) => void
) => {
  const [createCase, setCreateCase] = useState<string | undefined>(undefined);
  const [collectionSettings, setCollectionSettings] = useState<{
    media: string;
    origin: string;
    microOpen: boolean;
    communityOpen: boolean;
    accessOpen: boolean;
    visibilityOpen: boolean;
    videoAudio: boolean;
  }>({
    media: "static",
    origin: "chromadin",
    microOpen: false,
    communityOpen: false,
    accessOpen: false,
    visibilityOpen: false,
    videoAudio: false,
  });
  const [collectionDetails, setCollectionDetails] = useState<CollectionDetails>(
    {
      title: "",
      description: "",
      price: "",
      acceptedTokens: [
        "0x566d63f1cc7f45bfc9b2bdc785ffcc6f858f0997",
        "0xf87b6343c172720ac9cc7d1c9465d63454a8ef30",
      ],
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
  const waveformRef = useRef(null);
  const wavesurfer = useRef<null | WaveSurfer>(null);

  const createCollection = async () => {
    if (
      (collectionDetails.title?.trim() !== "" &&
        collectionDetails.description?.trim() !== "" &&
        collectionSettings?.media !== "video" &&
        (!collectionDetails.images || collectionDetails.images!.length < 1) &&
        ((collectionSettings?.media === "audio" &&
          collectionDetails?.audio == "") ||
          (collectionSettings?.media === "video" &&
            collectionDetails?.video == "")) &&
        collectionDetails.price?.trim() !== "" &&
        (!collectionDetails.acceptedTokens ||
          collectionDetails.acceptedTokens!.length < 1) &&
        collectionDetails.tags?.trim() !== "" &&
        !collectionDetails?.acceptedTokens &&
        Number(collectionDetails?.amount) > 0) ||
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
      const { price, microbrand, ...restOfCollectionDetails } =
        collectionDetails;
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
          mediaType: collectionSettings?.media,
          profileHandle:
            lensConnected?.handle?.suggestedFormatted?.localName?.split(
              "@"
            )?.[1],
          microbrand: collectionDetails?.microbrand?.microbrand,
          microbrandCover: collectionDetails?.microbrand?.microbrandCover,
        }),
      });
      const contentURI = await response.json();

      await lensPost(
        postContentURI!,
        dispatch,
        [
          {
            unknownOpenAction: {
              address: CHROMADIN_OPEN_ACTION,
              data: coder.encode(
                [
                  "tuple(uint256[] prices, uint256[] communityIds, address[] acceptedTokens, string uri, address fulfiller, uint256 amount, bool unlimited, address creatorAddress)",
                ],
                [
                  {
                    prices: [`${Number(collectionDetails?.price) * 10 ** 18}`],
                    communityIds,
                    acceptedTokens: collectionDetails?.acceptedTokens,
                    uri: "ipfs://" + contentURI?.cid,
                    fulfiller: ZERO_ADDRESS,
                    amount: Number(collectionDetails?.amount),
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

      dispatch(
        setPostSuccess({
          actionValue: "collection",
          actionPubId: data?.publications?.items?.[0]?.id,
        })
      );

      setCollectionDetails({
        title: "",
        description: "",
        price: "",
        acceptedTokens: [
          "0x566d63f1cc7f45bfc9b2bdc785ffcc6f858f0997",
          "0xf87b6343c172720ac9cc7d1c9465d63454a8ef30",
        ],
        images: [],
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
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setCreationLoading(false);
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

  const handlePlayPause = () => {
    const videoElement = document.getElementById(
      "videoCollection"
    ) as HTMLVideoElement;

    if (wavesurfer.current) {
      if (videoElement && collectionSettings?.media === "video") {
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

  useEffect(() => {
    if (waveformRef.current) {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }

      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "violet",
        progressColor: "white",
        height: 16,
      });

      wavesurfer.current.on("seeking", function (seekProgress) {
        const videoElement = document.getElementById(
          "videoCollection"
        ) as HTMLVideoElement;
        if (videoElement) {
          videoElement.currentTime = seekProgress;
        }
      });

      wavesurfer.current.on("play", function () {
        const videoElement = document.getElementById(
          "videoCollection"
        ) as HTMLVideoElement;
        if (videoElement) {
          videoElement.play();
        }
      });

      wavesurfer.current.on("pause", function () {
        const videoElement = document.getElementById(
          "videoCollection"
        ) as HTMLVideoElement;
        if (videoElement) {
          videoElement.pause();
        }
      });

      if (
        collectionDetails?.audio &&
        collectionDetails?.audio !== "" &&
        collectionSettings.media === "audio"
      ) {
        wavesurfer.current.load(collectionDetails?.audio);
      } else if (
        collectionDetails?.video &&
        collectionDetails?.video !== "" &&
        collectionSettings.media === "video"
      ) {
        wavesurfer.current.load(collectionDetails?.video);
      }
    }

    return () => {
      wavesurfer.current?.destroy();
    };
  }, [
    collectionDetails?.audio,
    wavesurfer,
    collectionDetails?.video,
    collectionSettings?.media,
    collectionDetails?.images,
    waveformRef,
  ]);

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
    waveformRef,
  };
};

export default useCreate;
