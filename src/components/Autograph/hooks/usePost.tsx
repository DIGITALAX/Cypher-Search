import { useState } from "react";
import { MakePostComment } from "../types/autograph.types";
import { createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import { PublicClient } from "wagmi";
import uploadPostContent from "../../../../lib/helpers/uploadPostContent";
import lensPost from "../../../../lib/helpers/api/postChain";
import { Dispatch } from "redux";
import {
  PostCollectGifState,
  setPostCollectGif,
} from "../../../../redux/reducers/postCollectGifSlice";

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
      postCollectGif.gifs?.["post"]!
    )
      return;
    setPostLoading([true]);

    try {
      const contentURI = await uploadPostContent(
        makePost[0]?.content,
        makePost[0]?.images!,
        makePost[0]?.videos!,
        [],
        postCollectGif.gifs?.["post"]!
      );

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensPost(
        contentURI?.string!,
        dispatch,
        [
          {
            collectOpenAction: {
              simpleCollectOpenAction: postCollectGif.collectTypes?.["post"]!,
            },
          },
        ],
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
    } catch (err: any) {
      console.error(err.message);
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
