import { ChangeEvent, useEffect, useRef, useState } from "react";
import { CollectionDetails } from "../types/autograph.types";
import lensPost from "../../../../lib/helpers/api/postChain";
import { PublicClient, createWalletClient, custom } from "viem";
import { AnyAction, Dispatch } from "redux";
import { polygon } from "viem/chains";
import uploadPostContent from "../../../../lib/helpers/uploadPostContent";
import { Profile } from "../../../../graphql/generated";
import refetchProfile from "../../../../lib/helpers/api/refetchProfile";
import WaveSurfer from "wavesurfer.js";

const useCreate = (
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  dispatch: Dispatch<AnyAction>,
  lensConnected: Profile | undefined
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
  const waveformRef = useRef(null);
  const wavesurfer = useRef<null | WaveSurfer>(null);

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
        !collectionDetails?.acceptedTokens) ||
      !address
    )
      return;
    setCreationLoading(true);

    try {
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
        prices: [`${Number(collectionDetails?.price) * 10 ** 18}`],
      };

      // CONVERT PRICE CORRECTLY!

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
    createDrop,
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
