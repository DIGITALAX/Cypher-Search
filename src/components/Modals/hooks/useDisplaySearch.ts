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
      collectionMetadata: {
        images: string[];
        mediaCover: string;
        title: string;
      };
    }[]
  >();
  const [selectedItem, setSelectedItem] = useState<Creation>();
  const [galleryLoading, setGalleryLoading] = useState<boolean>(false);
  const [gallery, setGallery] = useState<
    | {
        collected: {
          collectionId: string;
          collectionMetadata: {
            images: string[];
            mediaCover: string;
            title: string;
          };
        }[];
        created: {
          collectionId: string;
          collectionMetadata: {
            images: string[];
            mediaCover: string;
            title: string;
          };
        }[];
      }
    | undefined
  >();

  const handleGetGallery = async () => {
    setGalleryLoading(true);

    try {
      const collectedData = await getOrdersQuick(address!);
      const createdData = await getCollectionsQuick(address!);

      const existingCollectionIds =
        createdData?.data?.collectionCreateds?.map(
          (item: any) => item?.collectionId
        ) || [];

      const subOrderCollectionIds = [
        ...(collectedData?.data?.orderCreateds || []),
        ...(collectedData?.data?.nftonlyOrderCreateds || []),
      ].flatMap((item) => item?.subOrderCollectionIds || []);

      const uniqueCreatedCollectionIds = new Set(subOrderCollectionIds);
      const filteredCollectedData = subOrderCollectionIds?.filter(
        (item: any) => !uniqueCreatedCollectionIds.has(item)
      ) as any[];

      let collectedPromises = filteredCollectedData
        .map(async (id) => {
          if (!existingCollectionIds.includes(id)) {
            const res = await getOneCollectionQuick(id);
            return res?.data?.collectionCreateds?.[0];
          }
          return null;
        })
        .filter((promise) => promise !== null);

      const collected = await Promise.all(collectedPromises);

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
      [...(gallery?.collected || []), ...(gallery?.created || [])]
        .filter((item) => item?.collectionMetadata?.title?.includes(itemSearch))
        .map((item) => ({
          collectionId: item.collectionId,
          collectionMetadata: {
            images: item.collectionMetadata?.images || [],
            mediaCover: item?.collectionMetadata?.mediaCover || "",
            title: item?.collectionMetadata?.title || "",
          },
        }))
    );
  };

  const handleItemSelect = async (
    selected: {
      collectionId: string;
      collectionMetadata: {
        images: string[];
        title: string;
        mediaCover: string;
      };
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

    const newData = JSON.parse(JSON.stringify(data));

    const item = await getOneCollection(selected?.collectionId);

    switch (type) {
      case SortType.Community:
        if (value === 0) {
          newData.community = {
            main: item?.data?.collectionCreateds?.[0],
            side: data?.community?.side,
          };
        } else {
          const newSide = [
            ...(JSON.parse(JSON.stringify(data?.community?.side || [])) || []),
          ];
          newSide[value - 1] = item?.data?.collectionCreateds?.[0];
          newData.community = {
            main: data?.community?.main,
            side: newSide,
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
          const newSide = [
            ...(JSON.parse(JSON.stringify(data?.private?.side || [])) || []),
          ];
          newSide[value - 1] = item?.data?.collectionCreateds?.[0];
          newData.private = {
            main: data?.private?.main,
            side: newSide,
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
          const newSide = [
            ...(JSON.parse(JSON.stringify(data?.public?.side || [])) || []),
          ];
          newSide[value - 1] = item?.data?.collectionCreateds?.[0];
          newData.public = {
            main: data?.public?.main,
            side: newSide,
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
    } else if (open === undefined) {
      setSelectedItem(undefined);
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
