import { useState } from "react";
import { MakePostComment } from "../types/autograph.types";
import { createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import { PublicClient } from "wagmi";
import uploadPostContent from "../../../../lib/helpers/uploadPostContent";
import lensPost from "../../../../lib/helpers/api/postChain";
import { Dispatch } from "redux";

const usePost = (
  dispatch: Dispatch,
  publicClient: PublicClient,
  address: `0x${string}` | undefined
) => {
  const [postLoading, setPostLoading] = useState<boolean[]>([false]);
  const [postContentLoading, setPostContentLoading] = useState<
    {
      image: boolean;
      video: boolean;
      gif: boolean;
    }[]
  >([
    {
      image: false,
      video: false,
      gif: false,
    },
  ]);
  const [gifCollectOpen, setGifCollectOpen] = useState<
    {
      gif: boolean;
      collect: boolean;
    }[]
  >([
    {
      gif: false,
      collect: false,
    },
  ]);
  const [makePost, setMakePost] = useState<MakePostComment[]>([
    {
      collectType: undefined,
      content: "",
      images: [],
      videos: [],
      gifs: [],
      searchedGifs: [],
      search: "",
      collectibleOpen: false,
      collectible: "",
      award: "",
      whoCollectsOpen: false,
      creatorAwardOpen: false,
      currencyOpen: false,
    },
  ]);

  const post = async () => {
    if (
      !makePost[0]?.content &&
      !makePost[0]?.images &&
      !makePost[0]?.videos &&
      !makePost[0]?.gifs
    )
      return;
    setPostLoading([true]);

    try {
      const contentURI = await uploadPostContent(
        makePost[0]?.content,
        makePost[0]?.images!,
        makePost[0]?.videos!,
        makePost[0]?.gifs!
      );

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensPost(
        contentURI!,
        dispatch,
        makePost[0]?.collectType,
        address as `0x${string}`,
        clientWallet,
        publicClient
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
    gifCollectOpen,
    setGifCollectOpen,
  };
};

export default usePost;
