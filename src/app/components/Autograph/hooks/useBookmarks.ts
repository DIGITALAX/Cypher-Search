import { ModalContext } from "@/app/providers";
import { PageSize, Post, Repost } from "@lens-protocol/client";
import { useContext, useEffect, useState } from "react";
import { ScreenDisplay } from "../types/autograph.types";
import { fetchPostBookmarks } from "@lens-protocol/client/actions";

const useBookmarks = () => {
  const context = useContext(ModalContext);
  const [bookmarks, setBookmarks] = useState<(Post | Repost)[]>([]);
  const [bookmarkCursor, setBookmarkCursor] = useState<string>();
  const [hasMoreBookmarks, setHasMoreBookmarks] = useState<boolean>(false);
  const [bookmarksLoading, setBookmarksLoading] = useState<boolean>(false);

  const getBookmarks = async () => {
    setBookmarksLoading(true);
    try {
      const res = await fetchPostBookmarks(
        context?.lensConectado?.sessionClient!,
        {
          pageSize: PageSize.Ten,
        }
      );

      if (res?.isOk()) {
        setBookmarkCursor(res?.value?.pageInfo?.next!);
        setBookmarks(res?.value?.items as Post[]);

        if (res?.value?.items?.length == 10) {
          setHasMoreBookmarks(true);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setBookmarksLoading(false);
  };

  const handleMoreBookmarks = async () => {
    if (!hasMoreBookmarks) return;
    setBookmarksLoading(true);
    try {
      const res = await fetchPostBookmarks(
        context?.lensConectado?.sessionClient!,
        {
          cursor: bookmarkCursor,
          pageSize: PageSize.Ten,
        }
      );

      if (res?.isOk()) {
        setBookmarkCursor(res?.value?.pageInfo?.next!);
        setBookmarks([...bookmarks, ...(res?.value?.items as Post[])]);

        if (res?.value?.items?.length == 10) {
          setHasMoreBookmarks(true);
        } else {
          setHasMoreBookmarks(false);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setBookmarksLoading(false);
  };

  useEffect(() => {
    if (
      context?.screenDisplay == ScreenDisplay.Bookmarks &&
      bookmarks?.length < 1 &&
      context?.lensConectado?.sessionClient
    ) {
      getBookmarks();
    }
  }, [context?.screenDisplay, context?.lensConectado?.sessionClient]);

  return {
    handleMoreBookmarks,
    bookmarksLoading,
    hasMoreBookmarks,
    bookmarks,
  };
};

export default useBookmarks;
