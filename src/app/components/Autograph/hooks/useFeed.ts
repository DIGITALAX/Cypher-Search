import { useContext, useEffect, useState } from "react";
import { Account, PageSize, Post, Repost } from "@lens-protocol/client";
import { ModalContext } from "@/app/providers";
import { fetchPosts } from "@lens-protocol/client/actions";

const useFeed = (profile: Account) => {
  const context = useContext(ModalContext);
  const [profileFeed, setProfileFeed] = useState<(Post | Repost)[]>([]);
  const [hasMoreFeed, setHasMoreFeed] = useState<boolean>(false);
  const [feedLoading, setFeedLoading] = useState<boolean>(false);
  const [feedCursor, setFeedCursor] = useState<string>();

  const getFeed = async () => {
    setFeedLoading(true);
    try {
      const res = await fetchPosts(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          pageSize: PageSize.Fifty,
          filter: {
            authors: [profile?.address],
          },
        }
      );

      if (res?.isOk()) {
        setProfileFeed(res?.value?.items as (Post | Repost)[]);
        setFeedCursor(res?.value?.pageInfo?.next!);
        if (res?.value?.items && res?.value?.items?.length === 50) {
          setHasMoreFeed(true);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setFeedLoading(false);
  };

  const getMoreFeed = async () => {
    if (!feedCursor || !hasMoreFeed) return;

    try {
      const res = await fetchPosts(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          pageSize: PageSize.Fifty,
          cursor: feedCursor,
          filter: {
            authors: [profile?.address],
          },
        }
      );

      if (res?.isOk()) {
        setProfileFeed([
          ...profileFeed,
          ...(res?.value?.items as (Post | Repost)[]),
        ]);
        setFeedCursor(res?.value?.pageInfo?.next!);
        if (res?.value?.items && res?.value?.items?.length === 50) {
          setHasMoreFeed(true);
        } else {
          setHasMoreFeed(false);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (
      profileFeed?.length < 1 &&
      profile?.address &&
      (context?.lensConectado?.sessionClient || context?.clienteLens)
    ) {
      getFeed();
    }
  }, [profile, context?.lensConectado?.sessionClient]);

  return {
    profileFeed,
    hasMoreFeed,
    getMoreFeed,
    feedLoading,
  };
};

export default useFeed;
