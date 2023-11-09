import { Publication } from "@/components/Tiles/types/tiles.types";
import { useEffect, useState } from "react";
import { getOneRandomCollection } from "../../../../graphql/subgraph/queries/getOneCollection";
import getPublication from "../../../../graphql/lens/queries/publication";
import { FiltersOpenState } from "../../../../redux/reducers/filtersOpenSlice";

const useFilterPost = (filtersOpen: FiltersOpenState) => {
  const [publication, setPublication] = useState<Publication>();
  const [popUpOpen, setPopUpOpen] = useState<boolean[]>(
    Array.from(
      {
        length: 1,
      },
      () => false
    )
  );
  const [apparel, setApparel] = useState<boolean[]>(
    Array.from(
      {
        length: 1,
      },
      () => false
    )
  );
  const [interactionsLoading, setInteractionsLoading] = useState<
    {
      like: boolean;
      mirror: boolean;
    }[]
  >(
    Array.from(
      {
        length: 1,
      },
      () => ({
        like: false,
        mirror: false,
      })
    )
  );
  const [profileHovers, setProfileHovers] = useState<boolean[]>(
    Array.from(
      {
        length: 1,
      },
      () => false
    )
  );
  const [openMirrorChoice, setOpenMirrorChoice] = useState<boolean[]>(
    Array.from(
      {
        length: 1,
      },
      () => false
    )
  );
  const [followLoading, setFollowLoading] = useState<boolean[]>(
    Array.from(
      {
        length: 1,
      },
      () => false
    )
  );

  const mirror = async () => {
    setInteractionsLoading((prev) => {
      const arr = [...interactionsLoading];
      arr[0] = { ...arr[0], mirror: true };
      return arr;
    });
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setInteractionsLoading((prev) => {
      const arr = [...prev];
      arr[0] = { ...arr[0], mirror: false };
      return arr;
    });
  };

  const like = async () => {
    setInteractionsLoading((prev) => {
      const arr = [...prev];
      arr[0] = { ...arr[0], like: true };
      return arr;
    });
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setInteractionsLoading((prev) => {
      const arr = [...prev];
      arr[0] = { ...arr[0], like: true };
      return arr;
    });
  };

  const unfollowProfile = async () => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const followProfile = async () => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getCollection = async () => {
    try {
      const origin = ["chromadin", "coinop", "listener"][
        Math.floor(Math.random() * 3)
      ];
      const data = await getOneRandomCollection(
        origin,
        ["chromadin", "coinop", "listener"][Math.floor(Math.random() * 3)]
      );
      if (!data?.data?.collectionCreateds) return;
      const pubData = await getPublication({
        forId: data?.data?.collectionCreateds?.[0]?.pubId,
      });
      setPublication({
        publishedOn: origin,
        post: {
          ...data?.data?.collectionCreateds?.[0],
          publication: pubData?.data?.publication,
        },
        type: "Post",
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (filtersOpen?.value && !publication) {
      getCollection();
    } else {
      setPublication(undefined);
    }
  }, [filtersOpen?.value]);

  return {
    popUpOpen,
    setApparel,
    apparel,
    mirror,
    like,
    setPopUpOpen,
    interactionsLoading,
    openMirrorChoice,
    setOpenMirrorChoice,
    unfollowProfile,
    followProfile,
    followLoading,
    profileHovers,
    setProfileHovers,
    publication,
  };
};

export default useFilterPost;
