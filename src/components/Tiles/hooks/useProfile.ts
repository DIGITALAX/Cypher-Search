import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { Post, Comment, Mirror, Quote } from "../../../../graphql/generated";
import { useRouter } from "next/router";
import lensFollow from "../../../../lib/helpers/api/followProfile";
import lensUnfollow from "../../../../lib/helpers/api/unfollowProfile";

const useProfile = () => {
  const dispatch = useDispatch();
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
      await lensFollow(id, dispatch);
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
      await lensUnfollow(id, dispatch);
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
