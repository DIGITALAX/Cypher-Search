import { handleMedia } from "@/app/lib/helpers/handleMedia";
import { AudioMetadata, Post, VideoMetadata } from "@lens-protocol/client";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { VideoControls } from "../types/tiles.types";
import { ModalContext } from "@/app/providers";
import {
  addReaction,
  executePostAction,
  repost,
} from "@lens-protocol/client/actions";
import { Indexar } from "../../Search/types/search.types";
import pollResult from "@/app/lib/helpers/pollResult";

const useVideo = (dict: any, publication: Post) => {
  const context = useContext(ModalContext);
  const [mediaData, setMediaData] = useState<{
    url: string;
    type: "Image" | "Video" | "Audio";
    cover?: string;
  }>();
  const [interactions, setInteractions] = useState<{
    reactions: number;
    comments: number;
    mirrors: number;
    hasReacted: boolean;
    hasMirrored: boolean;
    hasCommented: boolean;
    hasQuoted: boolean;
    quotes: number;
    hasCollected: boolean;
    collects: number;
  }>({
    reactions: 0,
    comments: 0,
    mirrors: 0,
    hasCommented: false,
    hasMirrored: false,
    hasReacted: false,
    collects: 0,
    hasCollected: false,
    quotes: 0,
    hasQuoted: false,
  });
  const [interactionsLoading, setInteractionsLoading] = useState<{
    like: boolean;
    collect: boolean;
    mirror: boolean;
  }>({
    like: false,
    collect: false,
    mirror: false,
  });
  const videoRef = useRef<null | HTMLVideoElement>(null);
  const [videoInfo, setVideoInfo] = useState<VideoControls>({
    volume: 0.5,
    volumeOpen: false,
    heart: false,
    seeked: 0,
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    loading: false,
  });

  const collect = async () => {
    if (!context?.lensConectado?.profile) return;

    setInteractionsLoading((prev) => ({
      ...prev,
      collect: true,
    }));

    try {
      const data = await executePostAction(
        context?.lensConectado?.sessionClient!,
        {
          post: publication?.id,
          action: {
            simpleCollect: {
              selected: true,
            },
          },
        }
      );

      if (data.isOk()) {
        if ((data.value as any)?.reason?.includes("Signless")) {
          context?.setSignless?.(true);
        } else if ((data.value as any)?.hash) {
          context?.setIndexar(Indexar.Indexando);
          if (
            await pollResult(
              (data.value as any)?.hash,
              context?.lensConectado?.sessionClient!
            )
          ) {
            context?.setIndexar(Indexar.Success);
            setInteractions((prev) => ({
              ...prev,
              hasSimpleCollected: true,
              collects: prev?.collects + 1,
            }));
          } else {
            context?.setModalOpen(dict?.error);
          }

          setTimeout(() => {
            context?.setIndexar(Indexar.Inactive);
          }, 3000);
        }
      }

      setInteractions((prev) => ({
        ...prev,
        hasCollected: true,
        collects: prev.collects + 1,
      }));
    } catch (err: any) {
      context?.setModalOpen(dict?.error);
    }
  };

  const like = async (): Promise<void> => {
    if (!context?.lensConectado?.sessionClient) return;
    setInteractionsLoading((prev) => ({
      ...prev,
      like: true,
    }));

    try {
      await addReaction(context?.lensConectado?.sessionClient, {
        post: publication?.id,
        reaction: interactions?.hasReacted ? "DOWNVOTE" : "UPVOTE",
      });

      setInteractions((prev) => ({
        ...prev,
        hasReacted: prev?.hasReacted ? false : true,
        reactions: prev?.hasReacted
          ? Number(prev?.reactions) - 1
          : Number(prev?.reactions) + 1,
      }));
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsLoading((prev) => ({
      ...prev,
      like: false,
    }));
  };

  const mirror = async (): Promise<void> => {
    if (!context?.lensConectado?.sessionClient) return;
    setInteractionsLoading((prev) => ({
      ...prev,
      mirror: true,
    }));

    try {
      const res = await repost(context?.lensConectado?.sessionClient, {
        post: publication?.id,
      });

      if (res.isOk()) {
        if ((res.value as any)?.reason?.includes("Signless")) {
          context?.setSignless?.(true);
        } else if ((res.value as any)?.hash) {
          context?.setIndexar(Indexar.Indexando);
          if (
            await pollResult(
              (res.value as any)?.hash,
              context?.lensConectado?.sessionClient!
            )
          ) {
            context?.setIndexar(Indexar.Success);
            setInteractions((prev) => ({
              ...prev,
              hasMirrored: true,
              mirrors: prev?.mirrors + 1,
            }));
          } else {
            context?.setModalOpen(dict?.error);
          }

          setTimeout(() => {
            context?.setIndexar(Indexar.Inactive);
          }, 3000);
        }
      } else {
        context?.setModalOpen?.(dict?.error);
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsLoading((prev) => ({
      ...prev,
      mirror: false,
    }));
  };

  useEffect(() => {
    if (publication && !mediaData) {
      setInteractions({
        reactions: publication?.stats?.upvotes,
        comments: publication?.stats?.comments,
        mirrors: publication?.stats?.reposts,
        hasCommented:
          publication?.operations?.hasCommented?.optimistic ?? false,
        hasMirrored: publication?.operations?.hasReposted?.optimistic ?? false,
        hasReacted: publication?.operations?.hasUpvoted ?? false,
        hasCollected: publication?.operations?.hasSimpleCollected ?? false,
        hasQuoted: publication?.operations?.hasQuoted?.optimistic ?? false,
        quotes: publication?.stats?.quotes,
        collects: publication?.stats?.collects,
      });
      setMediaData(
        handleMedia(
          (publication?.metadata as VideoMetadata)?.video ??
            (publication?.metadata as AudioMetadata)?.audio
        )
      );
    }
  }, [publication]);

  useEffect(() => {
    const video = videoRef?.current;
    if (video) {
      const newVolume = parseFloat(videoInfo?.volume?.toString());
      if (Number.isFinite(newVolume) && video) {
        video.volume = newVolume;
      }
    }
  }, [videoInfo?.volume]);

  useEffect(() => {
    const video = videoRef?.current;

    if (Number.isFinite(videoInfo?.seeked) && video) {
      video.currentTime = videoInfo?.seeked;
    }
  }, [videoInfo?.seeked]);

  useEffect(() => {
    const playPause = async () => {
      const video = videoRef?.current;
      if (!video) {
        setVideoInfo((prev) => ({
          ...prev,
          loading: false,
        }));
        return;
      }

      if (videoInfo?.isPlaying) {
        await video.play();
      } else {
        video.pause();
      }

      setVideoInfo((prev) => ({
        ...prev,
        loading: false,
      }));
    };

    playPause();
  }, [videoInfo?.isPlaying]);

  return {
    mediaData,
    videoInfo,
    videoRef,
    setVideoInfo,
    interactionsLoading,
    interactions,
    collect,
    mirror,
    like,
  };
};

export default useVideo;
