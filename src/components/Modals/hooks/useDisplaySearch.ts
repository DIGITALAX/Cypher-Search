import {
  Display,
  SortType,
} from "@/components/Autograph/types/autograph.types";
import { Creation } from "@/components/Tiles/types/tiles.types";
import { useEffect, useState } from "react";
import { Dispatch } from "redux";
import { setProfileDisplay } from "../../../../redux/reducers/profileDisplaySlice";
import {
  getOneCollection,
  getOneCollectionQuick,
} from "../../../../graphql/subgraph/queries/getOneCollection";
import { getOrdersQuick } from "../../../../graphql/subgraph/queries/getOrders";
import { getCollectionsQuick } from "../../../../graphql/subgraph/queries/getCollections";

const useDisplaySearch = (
  profileDisplay: Display | undefined,
  dispatch: Dispatch,
  address: `0x${string}` | undefined,
  open: number | undefined
) => {
  const [itemSearch, setItemSearch] = useState<string>("");
  const [sortedGallery, setSortedGallery] = useState<
    {
      collectionId: string;
      images: string[];
      title: string;
    }[]
  >();
  const [selectedItem, setSelectedItem] = useState<Creation>();
  const [galleryLoading, setGalleryLoading] = useState<boolean>(false);
  const [gallery, setGallery] = useState<
    | {
        collected: Creation[];
        created: Creation[];
      }
    | undefined
  >();

  const handleGetGallery = async () => {
    setGalleryLoading(true);

    try {
      const collectedData = await getOrdersQuick(address!);
      const createdData = await getCollectionsQuick(address!);

      const promises = [
        ...(collectedData?.data?.orderCreateds || []),
        ...(collectedData?.data?.nFTOnlyOrderCreateds || []),
      ]?.map((item: { subOrderCollectionIds: string[] }) => {
        item?.subOrderCollectionIds?.map(async (item: string) => {
          const res = await getOneCollectionQuick(item);
          collected.push(res?.data?.collectionCreateds?.[0]);
        });
      });

      const collected = await Promise.all(promises);

      setGallery({
        collected: collected as any,
        created: createdData?.data?.collectionCreateds,
      });
    } catch (err: any) {
      console.error(err.message);
    }

    setGalleryLoading(false);
  };

  const handleSortGallery = () => {
    setSortedGallery(
      [...(gallery?.collected || []), ...(gallery?.created || [])]?.filter(
        (item: { collectionId: string; images: string[]; title: string }) =>
          item.title?.includes(itemSearch)
      )
    );
  };

  const handleItemSelect = async (
    selected: {
      collectionId: string;
      images: string[];
      title: string;
    },
    type: SortType,
    value: number
  ) => {
    let data: Display = profileDisplay
      ? profileDisplay
      : {
          private: undefined,
          community: undefined,
          public: undefined,
        };

    const newData = { ...data };

    const item = await getOneCollection(selected?.collectionId);

    switch (type) {
      case SortType.Community:
        if (value === 0) {
          newData.community = {
            main: item?.data?.collectionCreateds?.[0],
            side: data?.community?.side,
          };
        } else {
          const newSide = [...(data?.community?.side || [])];
          newSide[value - 1] = item?.data?.collectionCreateds?.[0];
          data = {
            ...data,
            community: {
              main: data?.community?.main,
              side: newSide,
            },
          };
        }
        break;
      case SortType.Private:
        if (value === 0) {
          newData.private = {
            main: item?.data?.collectionCreateds?.[0],
            side: data?.private?.side,
          };
        } else {
          const newSide = [...(data?.private?.side || [])];
          newSide[value - 1] = item?.data?.collectionCreateds?.[0];
          data = {
            ...data,
            private: {
              main: data?.private?.main,
              side: newSide,
            },
          };
        }

        break;
      case SortType.Public:
        if (value === 0) {
          newData.public = {
            main: item?.data?.collectionCreateds?.[0],
            side: data?.public?.side,
          };
        } else {
          const newSide = [...(data?.public?.side || [])];
          newSide[value - 1] = item?.data?.collectionCreateds?.[0];
          data = {
            ...data,
            public: {
              main: data?.public?.main,
              side: newSide,
            },
          };
        }

        break;
    }

    dispatch(setProfileDisplay(newData));
    setSelectedItem(item?.data?.collectionCreateds?.[0]);
  };

  useEffect(() => {
    if (itemSearch?.trim() !== "") {
      handleSortGallery();
    }
  }, [itemSearch]);

  useEffect(() => {
    if (!gallery && address && open !== undefined) {
      handleGetGallery();
    }
  }, [open]);

  return {
    itemSearch,
    setItemSearch,
    sortedGallery,
    selectedItem,
    handleItemSelect,
    gallery,
    galleryLoading,
  };
};

export default useDisplaySearch;
