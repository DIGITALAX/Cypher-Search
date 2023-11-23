import { useState } from "react";
import { MakePostComment } from "../types/autograph.types";
import { createWalletClient, custom } from "viem";
import { polygon, polygonMumbai } from "viem/chains";
import { PublicClient } from "wagmi";
import uploadPostContent from "../../../../lib/helpers/uploadPostContent";
import lensPost from "../../../../lib/helpers/api/postChain";
import { Dispatch } from "redux";
import {
  PostCollectGifState,
  setPostCollectGif,
} from "../../../../redux/reducers/postCollectGifSlice";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";
import { setIndexer } from "../../../../redux/reducers/indexerSlice";

const usePost = (
  dispatch: Dispatch,
  postCollectGif: PostCollectGifState,
  publicClient: PublicClient,
  address: `0x${string}` | undefined
) => {
  const [postLoading, setPostLoading] = useState<boolean[]>([false]);
  const [postContentLoading, setPostContentLoading] = useState<
    {
      image: boolean;
      video: boolean;
    }[]
  >([
    {
      image: false,
      video: false,
    },
  ]);
  const [makePost, setMakePost] = useState<MakePostComment[]>([
    {
      content: "",
      images: [],
      videos: [],
    },
  ]);

  const post = async () => {
    if (
      !makePost[0]?.content &&
      !makePost[0]?.images &&
      !makePost[0]?.videos &&
      !postCollectGif.gifs?.["post"]
    )
      return;
    setPostLoading([true]);

    try {
      const contentURI = await uploadPostContent(
        makePost[0]?.content?.trim() == "" ? " " : makePost[0]?.content,
        makePost[0]?.images || [],
        makePost[0]?.videos || [],
        [],
        postCollectGif.gifs?.["post"] || []
      );

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensPost(
        contentURI?.string!,
        dispatch,
        postCollectGif.collectTypes?.["post"]
          ? [
              {
                collectOpenAction: {
                  simpleCollectOpenAction:
                    postCollectGif.collectTypes?.["post"]!,
                },
              },
            ]
          : undefined,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      const gifs = { ...postCollectGif.gifs };
      delete gifs["post"];
      const cts = { ...postCollectGif.collectTypes };
      delete cts["post"];
      dispatch(
        setPostCollectGif({
          actionCollectType: cts,
          actionGifs: gifs,
        })
      );
      setMakePost([
        {
          content: "",
          images: [],
          videos: [],
        },
      ]);
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
    setPostLoading([false]);
  };

  return {
    makePost,
    setMakePost,
    postLoading,
    post,
    postContentLoading,
    setPostContentLoading,
  };
};

export default usePost;
