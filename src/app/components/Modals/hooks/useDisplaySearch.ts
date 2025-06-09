import { useContext, useEffect, useState } from "react";
import { Collection } from "../../Common/types/common.types";
import { NFTData } from "../../Tiles/types/tiles.types";
import { ModalContext } from "@/app/providers";
import {
  Display,
  Order,
  SortType,
} from "../../Autograph/types/autograph.types";
import { useAccount } from "wagmi";
import {
  getCollectionsPaginated,
  getOneCollection,
} from "../../../../../graphql/queries/getAllCollections";
import { getOrders } from "../../../../../graphql/queries/getOrders";

const useDisplaySearch = () => {
  const context = useContext(ModalContext);
  const { address } = useAccount();
  const [itemSearch, setItemSearch] = useState<string>("");
  const [sortedGallery, setSortedGallery] = useState<
    {
      collectionId: string;
      metadata: {
        images: string[];
        mediaCover: string;
        title: string;
      };
    }[]
  >();
  const [selectedItem, setSelectedItem] = useState<Collection | NFTData>();
  const [galleryLoading, setGalleryLoading] = useState<boolean>(false);
  const [gallery, setGallery] = useState<
    | {
        collected: {
          collectionId: string;
          metadata: {
            images: string[];
            mediaCover: string;
            title: string;
          };
        }[];
        created: {
          collectionId: string;
          metadata: {
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
      const collectedData = await getOrders(address!);
      const createdData = await getCollectionsPaginated(address!, 1000, 0);

      const orderCollectionIds = (
        collectedData?.data?.orderCreateds || []
      ).flatMap((item: Order) => item?.collection || []);

      const uniqueCreatedCollectionIds = new Set(
        createdData?.data?.collectionCreateds
      );
      const filteredCollectedData = orderCollectionIds?.filter(
        (item: Collection) =>
          !uniqueCreatedCollectionIds.has(item?.collectionId)
      ) as {
        collectionId: string;
        metadata: {
          images: string[];
          mediaCover: string;
          title: string;
        };
      }[];

      setGallery({
        collected: filteredCollectedData,
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
        .filter((item) => item?.metadata?.title?.includes(itemSearch))
        .map((item) => ({
          collectionId: item.collectionId,
          metadata: {
            images: item.metadata?.images || [],
            mediaCover: item?.metadata?.mediaCover || "",
            title: item?.metadata?.title || "",
          },
        }))
    );
  };

  const handleItemSelect = async (selected: {
    collectionId: string;
    metadata: {
      images: string[];
      title: string;
      mediaCover: string;
    };
  }) => {
    let data: Display = context?.profileDisplay
      ? context?.profileDisplay
      : {
          private: undefined,
          community: undefined,
          public: undefined,
        };

    const newData = JSON.parse(JSON.stringify(data));

    const item = await getOneCollection(Number(selected?.collectionId));

    switch (context?.sortType) {
      case SortType.Community:
        if (context?.displaySearch === 0) {
          newData.community = {
            main: item?.data?.collectionCreateds?.[0],
            side: data?.community?.side,
          };
        } else {
          const newSide = [
            ...(JSON.parse(JSON.stringify(data?.community?.side || [])) || []),
          ];
          newSide[Number(context?.displaySearch) - 1] =
            item?.data?.collectionCreateds?.[0];
          newData.community = {
            main: data?.community?.main,
            side: newSide,
          };
        }
        break;
      case SortType.Private:
        if (context?.displaySearch === 0) {
          newData.private = {
            main: item?.data?.collectionCreateds?.[0],
            side: data?.private?.side,
          };
        } else {
          const newSide = [
            ...(JSON.parse(JSON.stringify(data?.private?.side || [])) || []),
          ];
          newSide[Number(context?.displaySearch) - 1] =
            item?.data?.collectionCreateds?.[0];
          newData.private = {
            main: data?.private?.main,
            side: newSide,
          };
        }

        break;
      case SortType.Public:
        if (Number(context?.displaySearch) === 0) {
          newData.public = {
            main: item?.data?.collectionCreateds?.[0],
            side: data?.public?.side,
          };
        } else {
          const newSide = [
            ...(JSON.parse(JSON.stringify(data?.public?.side || [])) || []),
          ];
          newSide[Number(context?.displaySearch) - 1] =
            item?.data?.collectionCreateds?.[0];
          newData.public = {
            main: data?.public?.main,
            side: newSide,
          };
        }

        break;
    }

    context?.setProfileDisplay(newData);
    setSelectedItem(item?.data?.collectionCreateds?.[0]);
  };

  useEffect(() => {
    if (itemSearch?.trim() !== "") {
      handleSortGallery();
    }
  }, [itemSearch]);

  useEffect(() => {
    if (!gallery && address) {
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
