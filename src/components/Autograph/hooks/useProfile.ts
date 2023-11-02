import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { Post, Comment, Mirror, Quote } from "../../../../graphql/generated";
import { Creation } from "@/components/Tiles/types/tiles.types";
import lensFollow from "../../../../lib/helpers/api/followProfile";
import lensUnfollow from "../../../../lib/helpers/api/unfollowProfile";

const useProfile = () => {
  const dispatch = useDispatch();
  const profileFeed = useSelector(
    (state: RootState) => state.app.autographFeedReducer.feed
  );
  const galleryItems = useSelector(
    (state: RootState) => state.app.galleryItemsReducer.items
  );
  const [feedProfileHovers, setFeedProfileHovers] = useState<boolean[]>([]);
  const [feedFollowLoading, setFeedFollowLoading] = useState<boolean[]>([]);
  const [galleryProfileHovers, setGalleryProfileHovers] = useState<boolean[]>(
    []
  );
  const [galleryFollowLoading, setGalleryFollowLoading] = useState<boolean[]>(
    []
  );

  const followProfile = async (id: string, feed?: boolean) => {
    const index = (
      feed
        ? profileFeed
        : [...(galleryItems?.collected || []), ...(galleryItems?.created || [])]
    )?.findIndex(
      (pub) =>
        (feed
          ? (pub as Post | Quote | Mirror).__typename === "Mirror"
            ? (pub as Mirror).mirrorOn.id
            : (pub as Post | Quote).id
          : (pub as Creation)?.pubId) === id
    );
    if (index === -1) {
      return;
    }

    if (feed) {
      setFeedFollowLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = true;
        return updatedArray;
      });
    } else {
      setGalleryFollowLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = true;
        return updatedArray;
      });
    }

    try {
      await lensFollow(id, dispatch);
    } catch (err: any) {
      console.error(err.message);
    }
    if (feed) {
      setFeedFollowLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = false;
        return updatedArray;
      });
    } else {
      setGalleryFollowLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = false;
        return updatedArray;
      });
    }
  };

  const unfollowProfile = async (id: string, feed?: boolean) => {
    const index = (
      feed
        ? profileFeed
        : [...(galleryItems?.collected || []), ...(galleryItems?.created || [])]
    )?.findIndex(
      (pub) =>
        (feed
          ? (pub as Post | Quote | Mirror).__typename === "Mirror"
            ? (pub as Mirror).mirrorOn.id
            : (pub as Post | Quote).id
          : (pub as Creation)?.pubId) === id
    );
    if (index === -1) {
      return;
    }

    if (feed) {
      setFeedFollowLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = true;
        return updatedArray;
      });
    } else {
      setGalleryFollowLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = true;
        return updatedArray;
      });
    }

    try {
      await lensUnfollow(id, dispatch);
    } catch (err: any) {
      console.error(err.message);
    }
    if (feed) {
      setFeedFollowLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = false;
        return updatedArray;
      });
    } else {
      setGalleryFollowLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = false;
        return updatedArray;
      });
    }
  };
  useEffect(() => {
    if (profileFeed?.length > 0) {
      setFeedFollowLoading(
        Array.from({ length: profileFeed?.length }, () => false)
      );
      setFeedProfileHovers(
        Array.from({ length: profileFeed?.length }, () => false)
      );
    }

    if (
      (galleryItems?.collected && galleryItems?.collected?.length > 0) ||
      (galleryItems?.created && galleryItems?.created?.length > 0)
    ) {
      setFeedFollowLoading(
        Array.from(
          {
            length:
              galleryItems?.collected?.length ||
              0 + galleryItems?.created?.length ||
              0,
          },
          () => false
        )
      );
      setFeedProfileHovers(
        Array.from(
          {
            length:
              galleryItems?.collected?.length ||
              0 + galleryItems?.created?.length ||
              0,
          },
          () => false
        )
      );
    }
  }, [
    galleryItems?.collected?.length,
    galleryItems?.created?.length,
    profileFeed?.length,
  ]);

  return {
    followProfile,
    unfollowProfile,
    feedFollowLoading,
    galleryFollowLoading,
    feedProfileHovers,
    setFeedProfileHovers,
    galleryProfileHovers,
    setGalleryProfileHovers,
  };
};

export default useProfile;
