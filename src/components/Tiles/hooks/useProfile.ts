import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { Post, Comment, Mirror, Quote } from "../../../../graphql/generated";
import follow from "../../../../graphql/lens/mutations/follow";
import pollUntilIndexed from "../../../../graphql/lens/queries/indexed";
import unfollow from "../../../../graphql/lens/mutations/unfollow";
import { useRouter } from "next/router";

const useProfile = () => {
  const allSearchItems = useSelector(
    (state: RootState) => state.app.searchItemsReducer.items
  );
  const galleryItems = useSelector(
    (state: RootState) => state.app.galleryItemsReducer.items
  );
  const router = useRouter();
  const [profileHovers, setProfileHovers] = useState<boolean[]>([]);
  const [followLoading, setFollowLoading] = useState<boolean[]>([]);

  const followProfile = async (id: string) => {
    const index = allSearchItems.findIndex(
      (pub) => (pub.post as Post | Comment | Mirror | Quote)?.id === id
    );
    if (index === -1) {
      return;
    }

    setFollowLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = true;
      return updatedArray;
    });

    try {
      const { data } = await follow({
        follow: [
          {
            profileId: id,
          },
        ],
      });

      if (data?.follow.__typename === "RelaySuccess") {
        const result = await pollUntilIndexed({
          forTxId: data?.follow?.txId,
        });

        if (result === true) {
        } else {
          console.error(result);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setFollowLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = false;
      return updatedArray;
    });
  };

  const unfollowProfile = async (id: string) => {
    const index = allSearchItems.findIndex(
      (pub) => (pub.post as Post | Comment | Mirror | Quote)?.id === id
    );
    if (index === -1) {
      return;
    }

    setFollowLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = true;
      return updatedArray;
    });
    try {
      const { data } = await unfollow({
        unfollow: [
          {
            profileId: id,
          },
        ],
      });

      if (data?.unfollow.__typename === "RelaySuccess") {
        const result = await pollUntilIndexed({
          forTxId: data?.unfollow?.txId,
        });

        if (result === true) {
        } else {
          console.error(result);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setFollowLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = false;
      return updatedArray;
    });
  };

  useEffect(() => {
    if (
      (router.asPath.includes("autograph") &&
        ((galleryItems?.collected && galleryItems?.collected?.length > 0) ||
          (galleryItems?.created && galleryItems?.created?.length > 0))) ||
      (!router.asPath.includes("autograph") && allSearchItems.length > 0)
    ) {
      let length: number = 0;
      if (!router.asPath.includes("autograph") && allSearchItems.length > 0) {
        length = allSearchItems.length;
      } else if (
        router.asPath.includes("autograph") &&
        ((galleryItems?.collected && galleryItems?.collected?.length > 0) ||
          (galleryItems?.created && galleryItems?.created?.length > 0))
      ) {
        length =
          galleryItems?.collected?.length ||
          0 + galleryItems?.created?.length ||
          0;
      }

      if (length > 0) {
        setFollowLoading(Array.from({ length }, () => false));
        setProfileHovers(Array.from({ length }, () => false));
      }
    }
  }, [
    allSearchItems.length,
    router.asPath,
    galleryItems?.collected?.length,
    galleryItems?.created?.length,
  ]);

  useEffect(() => {
    setProfileHovers(Array.from({ length: 10 }, () => false));
  }, []);

  return {
    followProfile,
    unfollowProfile,
    followLoading,
    profileHovers,
    setProfileHovers,
  };
};

export default useProfile;
