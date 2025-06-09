import { ModalContext } from "@/app/providers";
import { PageSize, Post, PostReferenceType } from "@lens-protocol/client";
import { fetchPostReferences } from "@lens-protocol/client/actions";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const useCommentItem = (post: Post, commentOpen: boolean) => {
  const context = useContext(ModalContext);
  const path = usePathname();
  const [allCommentsLoading, setAllCommentsLoading] = useState<boolean>(false);
  const [allComments, setAllComments] = useState<Post[]>([]);
  const [hoverPrompt, setHoverPrompt] = useState<boolean>(false);
  const [commentInfo, setCommentInfo] = useState<{
    hasMore: boolean;
    cursor: string | undefined;
  }>({
    hasMore: true,
    cursor: undefined,
  });

  const getComments = async () => {
    setAllCommentsLoading(true);
    try {
      const data = await fetchPostReferences(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          referencedPost: post?.id,
          referenceTypes: [PostReferenceType?.CommentOn],
          pageSize: PageSize.Ten,
        }
      );

      if (data.isOk()) {
        setAllComments(data?.value?.items as Post[]);
        setCommentInfo({
          hasMore: data?.value?.items?.length == 10 ? true : false,
          cursor: data?.value?.pageInfo?.next!,
        });
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setAllCommentsLoading(false);
  };

  const getMoreComments = async () => {
    if (!commentInfo?.cursor || !commentInfo?.hasMore) return;
    try {
      const data = await fetchPostReferences(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          cursor: commentInfo?.cursor,
          referencedPost: post?.id,
          referenceTypes: [PostReferenceType?.CommentOn],
          pageSize: PageSize.Ten,
        }
      );

      if (data.isOk()) {
        setAllComments((prev) => [...prev, ...(data?.value?.items as Post[])]);
        setCommentInfo({
          hasMore: data?.value?.items?.length == 10 ? true : false,
          cursor: data?.value?.pageInfo?.next!,
        });
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (
      (allComments?.length < 1 && post && !path?.includes("microbrand")) ||
      (allComments?.length < 1 &&
        post &&
        (path?.includes("coinop") ||
          path?.includes("listener") ||
          path?.includes("item/f3m") ||
          (path?.includes("chromadin") && commentOpen)))
    ) {
      getComments();
    }
  }, [post, context?.lensConectado?.sessionClient, context?.clienteLens]);

  return {
    allComments,
    hoverPrompt,
    setHoverPrompt,
    getMoreComments,
    commentInfo,
    allCommentsLoading,
  };
};

export default useCommentItem;
