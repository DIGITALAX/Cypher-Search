import { useEffect, useState } from "react";
import { Comment, LimitType, Profile } from "../../../../graphql/generated";
import getPublications from "../../../../graphql/lens/queries/publications";
import { AnyAction, Dispatch } from "redux";
import lensHide from "../../../../lib/helpers/api/hidePost";
import lensBookmark from "../../../../lib/helpers/api/bookmarkPost";
import lensCollect from "../../../../lib/helpers/api/collectPost";
import { polygon, polygonMumbai } from "viem/chains";
import { PublicClient, createWalletClient, custom } from "viem";
import lensComment from "../../../../lib/helpers/api/commentPost";
import uploadPostContent from "../../../../lib/helpers/uploadPostContent";
import { PostCollectGifState } from "../../../../redux/reducers/postCollectGifSlice";
import { MakePostComment } from "@/components/Autograph/types/autograph.types";
import lensLike from "../../../../lib/helpers/api/likePost";
import lensMirror from "../../../../lib/helpers/api/mirrorPost";
import { NextRouter } from "next/router";
import { Creation } from "@/components/Tiles/types/tiles.types";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";

const useComment = (
  address: `0x${string}` | undefined,
  publicClient: PublicClient,
  pubId: string,
  lensConnected: Profile | undefined,
  dispatch: Dispatch<AnyAction>,
  postCollectGif: PostCollectGifState,
  router: NextRouter,
  collections: Creation[] | undefined
) => {
  const [commentSwitch, setCommentSwitch] = useState<boolean>(false);
  const [allCommentsLoading, setAllCommentsLoading] = useState<boolean>(false);
  const [allComments, setAllComments] = useState<
    (Comment & {
      decrypted: any;
    })[]
  >([]);
  const [openItemMirrorChoice, setOpenItemMirrorChoice] = useState<boolean[]>(
    []
  );
  const [openInteractions, setOpenInteractions] = useState<boolean[]>([]);
  const [openMainMirrorChoice, setMainOpenMirrorChoice] = useState<boolean[]>([
    false,
  ]);
  const [openMoreOptions, setOpenMoreOptions] = useState<boolean[]>([]);
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
  const [commentsOpen, setCommentsOpen] = useState<boolean[]>([]);
  const [contentLoading, setContentLoading] = useState<
    {
      image: boolean;
      video: boolean;
    }[]
  >([]);
  const [mainContentLoading, setMainContentLoading] = useState<
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
  const [makeComment, setMakeComment] = useState<MakePostComment[]>([]);
  const [mainMakeComment, setMainMakeComment] = useState<MakePostComment[]>([
    {
      content: "",
      images: [],
      videos: [],
    },
  ]);
  const [interactionsItemsLoading, setInteractionsItemsLoading] = useState<
    {
      like: boolean;
      mirror: boolean;
      comment: boolean;
      simpleCollect: boolean;
      bookmark: boolean;
      hide: boolean;
    }[]
  >([]);
  const [mainInteractionsLoading, setMainInteractionsLoading] = useState<
    {
      like: boolean;
      mirror: boolean;
      comment: boolean;
      simpleCollect: boolean;
      bookmark: boolean;
      hide: boolean;
    }[]
  >([
    {
      like: false,
      mirror: false,
      comment: false,
      simpleCollect: false,
      bookmark: false,
      hide: false,
    },
  ]);
  const [commentCursor, setCommentCursor] = useState<string>();

  const getComments = async () => {
    setAllCommentsLoading(true);
    try {
      const data = await getPublications(
        {
          where: {
            commentOn: {
              id: pubId,
              // ranking: {
              //   filter: CommentRankingFilterType.Relevant,
              // },
            },
          },
          limit: LimitType.Ten,
        },
        lensConnected?.id
      );
      setAllComments(
        (data?.data?.publications?.items || []) as (Comment & {
          decrypted: any;
        })[]
      );
      setCommentCursor(data?.data?.publications?.pageInfo?.next);
      if (data?.data?.publications?.items?.length != 10) {
        setHasMoreComments(false);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setAllCommentsLoading(false);
  };

  const handleMoreComments = async () => {
    if (!hasMoreComments) return;

    try {
      const data = await getPublications(
        {
          where: {
            commentOn: {
              id: pubId,
              // ranking: {
              //   filter: CommentRankingFilterType.Relevant,
              // },
            },
          },
          limit: LimitType.Ten,
          cursor: commentCursor,
        },
        lensConnected?.id
      );
      setAllComments([
        ...allComments,
        ...((data?.data?.publications?.items || []) as (Comment & {
          decrypted: any;
        })[]),
      ]);
      setCommentCursor(data?.data?.publications?.pageInfo?.next);
      if (data?.data?.publications?.items?.length != 10) {
        setHasMoreComments(false);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleHidePost = async (id: string, index: number) => {
    setInteractionsItemsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], hide: true };
      return updatedArray;
    });
    try {
      await lensHide(id, dispatch);
    } catch (err: any) {
      dispatch(setInteractError(true));
      console.error(err.message);
    }
    setInteractionsItemsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], hide: false };
      return updatedArray;
    });
  };

  const handleBookmark = async (on: string, index: number, main?: boolean) => {
    setInteractionsItemsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], bookmark: true };
      return updatedArray;
    });
    try {
      await lensBookmark(on, dispatch);
    } catch (err: any) {
      dispatch(setInteractError(true));
      console.error(err.message);
    }
    setInteractionsItemsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], bookmark: false };
      return updatedArray;
    });
  };

  const simpleCollect = async (id: string, type: string, main: boolean) => {
    if (main) {
      setMainInteractionsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[0] = { ...updatedArray[0], simpleCollect: true };
        return updatedArray;
      });
    } else {
      const index = allComments?.findIndex((pub) => pub.id === id);
      if (index === -1) {
        return;
      }

      setInteractionsItemsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = { ...updatedArray[index], simpleCollect: true };
        return updatedArray;
      });
    }

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensCollect(
        id,
        type,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
    } catch (err: any) {
      dispatch(setInteractError(true));
      console.error(err.message);
    }

    if (main) {
      setMainInteractionsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[0] = { ...updatedArray[0], simpleCollect: false };
        return updatedArray;
      });
    } else {
      const index = allComments?.findIndex((pub) => pub.id === id);
      if (index === -1) {
        return;
      }

      setInteractionsItemsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = { ...updatedArray[index], simpleCollect: false };
        return updatedArray;
      });
    }
  };

  const comment = async (id: string, main?: boolean) => {
    let content: string | undefined,
      images:
        | {
            media: string;
            type: string;
          }[]
        | undefined,
      videos: string[] | undefined;

    const index = main
      ? undefined
      : allComments?.findIndex((pub) => pub.id === id);

    if (!main) {
      if (
        !makeComment[index!]?.content &&
        !makeComment[index!]?.images &&
        !makeComment[index!]?.videos &&
        !postCollectGif?.gifs?.[id]
      )
        return;
      content = makeComment[index!]?.content;
      images = makeComment[index!]?.images!;
      videos = makeComment[index!]?.videos!;
    } else {
      if (
        !mainMakeComment[0]?.content &&
        !mainMakeComment[0]?.images &&
        !mainMakeComment[0]?.videos &&
        !postCollectGif?.gifs?.[id]
      )
        return;
      content = mainMakeComment[0]?.content;
      images = mainMakeComment[0]?.images!;
      videos = mainMakeComment[0]?.videos!;
    }

    handleLoaders(true, main!, index, "comment");

    try {
      const contentURI = await uploadPostContent(
        content?.trim() == "" ? " " : content,
        images || [],
        videos || [],
        [],
        postCollectGif?.gifs?.[id] || []
      );

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensComment(
        id,
        contentURI?.string!,
        dispatch,
        postCollectGif?.collectTypes?.[id]
          ? [
              {
                collectOpenAction: {
                  simpleCollectOpenAction: postCollectGif?.collectTypes?.[id],
                },
              },
            ]
          : undefined,
        address as `0x${string}`,
        clientWallet,
        publicClient,
        () => clearComment(index, main!)
      );
    } catch (err: any) {
      dispatch(setInteractError(true));
      console.error(err.message);
    }

    handleLoaders(false, main!, index, "comment");
  };

  const handleLoaders = (
    start: boolean,
    main: boolean,
    index: number | undefined,
    type: string
  ) => {
    if (start) {
      if (!main) {
        if (index === -1) {
          return;
        }

        setInteractionsItemsLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index!] = { ...updatedArray[index!], [type]: true };
          return updatedArray;
        });
      } else {
        setMainInteractionsLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[0] = { ...updatedArray[0], [type]: true };
          return updatedArray;
        });
      }
    } else {
      if (!main) {
        setInteractionsItemsLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index!] = { ...updatedArray[index!], [type]: false };
          return updatedArray;
        });
      } else {
        setMainInteractionsLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[0] = { ...updatedArray[0], [type]: false };
          return updatedArray;
        });
      }
    }
  };

  const clearComment = (index: number | undefined, main: boolean) => {
    if (!main) {
      setMakeComment((prev) => {
        const updatedArray = [...prev];
        updatedArray[index!] = {
          content: "",
          images: [],
          videos: [],
        };
        return updatedArray;
      });
      setCommentsOpen((prev) => {
        const updatedArray = [...prev];
        updatedArray[index!] = !updatedArray[index!];
        return updatedArray;
      });
    } else {
      setMainMakeComment((prev) => {
        const updatedArr = [...prev];
        updatedArr[0] = {
          content: "",
          images: [],
          videos: [],
        };
        return updatedArr;
      });
    }
  };

  const mirror = async (id: string, main?: boolean) => {
    const index = main
      ? undefined
      : allComments?.findIndex((pub) => pub.id === id);
    handleLoaders(true, main!, index, "mirror");

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });
      await lensMirror(
        id,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
    } catch (err: any) {
      dispatch(setInteractError(true));
      console.error(err.message);
    }

    handleLoaders(false, main!, index, "mirror");
  };

  const like = async (id: string, hasReacted: boolean, main?: boolean) => {
    const index = main
      ? undefined
      : allComments?.findIndex((pub) => pub.id === id);
    handleLoaders(false, main!, index, "like");

    try {
      await lensLike(id, dispatch, hasReacted);
    } catch (err: any) {
      dispatch(setInteractError(true));
      console.error(err.message);
    }

    handleLoaders(false, main!, index, "like");
  };

  useEffect(() => {
    if (
      (allComments?.length < 1 &&
        pubId &&
        !router?.asPath?.includes("microbrand")) ||
      (allComments?.length < 1 &&
        pubId &&
        (router.asPath?.includes("coinop") ||
          router.asPath?.includes("listener") ||
          (router.asPath?.includes("chromadin") && commentSwitch)))
    ) {
      getComments();
    }
  }, [pubId, lensConnected?.id]);

  useEffect(() => {
    if (allComments?.length > 0 || (collections && collections?.length > 0)) {
      setInteractionsItemsLoading(
        Array.from(
          { length: (collections ? collections : allComments).length },
          () => ({
            like: false,
            mirror: false,
            comment: false,
            simpleCollect: false,
            bookmark: false,
            hide: false,
          })
        )
      );
      setOpenMoreOptions(
        Array.from(
          { length: (collections ? collections : allComments).length },
          () => false
        )
      );
      setContentLoading(
        Array.from(
          { length: (collections ? collections : allComments).length },
          () => ({
            image: false,
            video: false,
            gif: false,
          })
        )
      );
      setOpenItemMirrorChoice(
        Array.from(
          { length: (collections ? collections : allComments).length },
          () => false
        )
      );
      setMakeComment(
        Array.from(
          { length: (collections ? collections : allComments).length },
          () => ({
            content: "",
            images: [],
            videos: [],
          })
        )
      );
      setOpenInteractions(
        Array.from(
          { length: (collections ? collections : allComments).length },
          () => false
        )
      );
      setCommentsOpen(
        Array.from(
          { length: (collections ? collections : allComments).length },
          () => false
        )
      );
    }
  }, [allComments?.length, collections?.length]);

  return {
    mainMakeComment,
    setMainMakeComment,
    setMakeComment,
    mainContentLoading,
    setMainContentLoading,
    comment,
    makeComment,
    setCommentsOpen,
    commentsOpen,
    interactionsItemsLoading,
    openItemMirrorChoice,
    setOpenItemMirrorChoice,
    simpleCollect,
    setOpenMoreOptions,
    openMoreOptions,
    handleBookmark,
    handleHidePost,
    contentLoading,
    setContentLoading,
    handleMoreComments,
    allComments,
    allCommentsLoading,
    hasMoreComments,
    setMainOpenMirrorChoice,
    openMainMirrorChoice,
    commentSwitch,
    setCommentSwitch,
    mainInteractionsLoading,
    mirror,
    like,
    openInteractions,
    setOpenInteractions,
  };
};

export default useComment;
