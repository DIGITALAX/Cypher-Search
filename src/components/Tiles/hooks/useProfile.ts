import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { Post, Comment, Mirror, Quote } from "../../../../graphql/generated";
import follow from "../../../../graphql/lens/mutations/follow";
import pollUntilIndexed from "../../../../graphql/lens/queries/indexed";
import unfollow from "../../../../graphql/lens/mutations/unfollow";

const useProfile = () => {
  const allSearchItems = useSelector(
    (state: RootState) => state.app.searchItemsReducer.items
  );
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
    if (allSearchItems.length > 0) {
      setFollowLoading(
        Array.from({ length: allSearchItems.length }, () => false)
      );
      setProfileHovers(
        Array.from({ length: allSearchItems.length }, () => false)
      );
    }
  }, [allSearchItems.length]);

  useEffect(() => { 
    setProfileHovers(
      Array.from({ length: 10 }, () => false)
    );
  },[])

  return {
    followProfile,
    unfollowProfile,
    followLoading,
    profileHovers,
    setProfileHovers,
  };
};

export default useProfile;
