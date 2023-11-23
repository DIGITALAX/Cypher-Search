import { useEffect, useState } from "react";
import lensMirror from "../../../../lib/helpers/api/mirrorPost";
import lensLike from "../../../../lib/helpers/api/likePost";
import { setProfileDisplay } from "../../../../redux/reducers/profileDisplaySlice";
import { Creation } from "@/components/Tiles/types/tiles.types";
import { Display, SortType } from "../types/autograph.types";
import {
  MetadataAttributeType,
  Post,
  Profile,
  PublicationOperations,
} from "../../../../graphql/generated";
import { createWalletClient, custom, PublicClient } from "viem";
import { polygon, polygonMumbai } from "viem/chains";
import setMeta from "../../../../lib/helpers/api/setMeta";
import refetchProfile from "../../../../lib/helpers/api/refetchProfile";
import { Dispatch } from "redux";
import { getCollectionsPaginated } from "../../../../graphql/subgraph/queries/getCollections";
import { getOrdersPaginated } from "../../../../graphql/subgraph/queries/getOrders";
import handleCollectionProfilesAndPublications from "../../../../lib/helpers/handleCollectionProfilesAndPublications";
import { getOneCollection } from "../../../../graphql/subgraph/queries/getOneCollection";
import errorChoice from "../../../../lib/helpers/errorChoice";
import getGallerySort from "../../../../lib/helpers/getGallerySort";

const useGallery = (
  lensConnected: Profile | undefined,
  profileDisplay: Display | undefined,
  dispatch: Dispatch,
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  postSuccess: string | undefined,
  pageProfile: Profile | undefined
) => {
  const [sortType, setSortType] = useState<SortType>(SortType.Public);
  const [interactionsGalleryLoading, setInteractionsGalleryLoading] = useState<
    {
      like: boolean;
      mirror: boolean;
      bookmark: boolean;
      hide: boolean;
    }[]
  >([]);
  const [gallery, setGallery] = useState<
    | {
        collected: Creation[];
        created: Creation[];
      }
    | undefined
  >();
  const [cursorInfo, setCursorInfo] = useState<{
    collected: number;
    created: number;
    hasMore: boolean;
  }>({
    collected: 0,
    created: 0,
    hasMore: true,
  });
  const [openMirrorGalleryChoice, setOpenMirrorGalleryChoice] = useState<
    boolean[]
  >([]);
  const [interactionsDisplayLoading, setInteractionsDisplayLoading] = useState<
    {
      like: boolean;
      mirror: boolean;
      simpleCollect: boolean;
      bookmark: boolean;
      interested: boolean;
      hide: boolean;
    }[]
  >(
    Array.from({ length: 4 }, () => ({
      like: false,
      mirror: false,
      simpleCollect: false,
      bookmark: false,
      interested: false,
      hide: false,
    }))
  );
  const [openMirrorDisplayChoice, setOpenMirrorDisplayChoice] = useState<
    boolean[]
  >(Array.from({ length: 4 }, () => false));
  const [displayLoading, setDisplayLoading] = useState<boolean>(false);
  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);
  const [galleryLoading, setGalleryLoading] = useState<boolean>(false);
  const [openInteractions, setOpenInteractions] = useState<boolean[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("NEWEST");

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const getDisplayData = async (collections: Creation[]) => {
    try {
      const displayItems = lensConnected?.metadata?.attributes?.find(
        (item) => item?.key === "cypherDisplay"
      );
      let display: Display | undefined;

      if (displayItems?.value) {
        display = await JSON.parse(displayItems.value);
      } else {
        if (collections?.length > 0) {
          display = {
            public: {
              main: collections?.[0],
              side: [collections?.[1], collections?.[2], collections?.[3]],
            },
          };
        }
      }

      dispatch(setProfileDisplay(display));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getGallery = async () => {
    setGalleryLoading(true);
    try {
      const collectedData = await getOrdersPaginated(
        pageProfile?.ownedBy?.address,
        25,
        cursorInfo.collected
      );
      const createdData = await getCollectionsPaginated(
        pageProfile?.ownedBy?.address,
        25,
        cursorInfo.created
      );

      let collected: Creation[] = [];

      const collData = [
        ...(collectedData?.data?.orderCreateds || []),
        ...(collectedData?.data?.nFTOnlyOrderCreateds || []),
      ]?.map((item: { subOrderCollectionIds: string[] }) => {
        (item?.subOrderCollectionIds || [])?.map(async (item: string) => {
          const res = await getOneCollection(item);
          collected.push(res?.data?.collectionCreateds?.[0]);
        });
      });

      await Promise.all(collData);

      const created =
        (await handleCollectionProfilesAndPublications(
          createdData?.data?.collectionCreateds,
          lensConnected?.id
        )) || [];
      collected =
        (await handleCollectionProfilesAndPublications(
          collected,
          lensConnected?.id
        )) || [];

      setCursorInfo({
        collected: cursorInfo?.collected + 25,
        created: cursorInfo?.created + 25,
        hasMore:
          collected?.length == 25 || created?.length == 25 ? true : false,
      });

      await getDisplayData([...(created || []), ...(collected || [])]);
      setGallery({
        collected,
        created,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setGalleryLoading(false);
  };

  const getMoreGallery = async () => {
    if (!cursorInfo?.hasMore) return;
    try {
      let collected: Creation[] = [],
        created: Creation[] = [];
      if (
        gallery?.collected &&
        gallery?.collected?.length >= cursorInfo?.collected
      ) {
        const collectedData = await getOrdersPaginated(
          pageProfile?.ownedBy?.address,
          25,
          cursorInfo.collected
        );

        const collData = [
          ...(collectedData?.data?.orderCreateds || []),
          ...(collectedData?.data?.nFTOnlyOrderCreateds || []),
        ]?.map((item: { subOrderCollectionIds: string[] }) => {
          (item?.subOrderCollectionIds || [])?.map(async (item: string) => {
            const res = await getOneCollection(item);
            collected.push(res?.data?.collectionCreateds?.[0]);
          });
        });

        await Promise.all(collData);

        collected =
          (await handleCollectionProfilesAndPublications(
            collected,
            lensConnected?.id
          )) || [];
      }

      if (gallery?.created && gallery?.created?.length >= cursorInfo?.created) {
        const createdData = await getCollectionsPaginated(
          pageProfile?.ownedBy?.address,
          25,
          cursorInfo.created
        );
        created =
          (await handleCollectionProfilesAndPublications(
            createdData?.data?.collectionCreateds,
            lensConnected?.id
          )) || [];
      }

      setCursorInfo({
        collected: cursorInfo?.collected + 25,
        created: cursorInfo?.created + 25,
        hasMore:
          collected?.length == 25 || created?.length == 25 ? true : false,
      });

      setGallery({
        collected: [...(gallery?.collected || []), ...collected],
        created: [...(gallery?.created || []), ...created],
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleSetDisplay = async () => {
    setDisplayLoading(true);
    try {
      let attributes = [...(lensConnected?.metadata?.attributes || [])];

      const existing = attributes.findIndex(
        (item) => item?.key === "cypherDisplay"
      );

      if (existing != -1) {
        attributes[existing].value = JSON.stringify(profileDisplay);
      } else {
        attributes.push({
          key: "cypherDisplay",
          value: JSON.stringify(profileDisplay),
          type: MetadataAttributeType.Json,
        });
      }

      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify({
          __typename: lensConnected?.metadata?.__typename,
          appId: "cypersearch",
          attributes,
          bio: lensConnected?.metadata?.bio,
          coverPicture: lensConnected?.metadata?.coverPicture,
          displayName: lensConnected?.metadata?.displayName,
          picture: lensConnected?.metadata?.picture,
          rawURI: lensConnected?.metadata?.rawURI,
        }),
      });
      const responseJSON = await response.json();

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await setMeta(
        "ipfs://" + responseJSON.cid,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );

      await refetchProfile(dispatch, lensConnected?.id, lensConnected?.id);
    } catch (err: any) {
      console.error(err.message);
    }
    setDisplayLoading(false);
  };

  const galleryLike = async (id: string, hasReacted: boolean) => {
    const index = [
      ...(gallery?.collected || []),
      ...(gallery?.created || []),
    ].findIndex((pub) => pub.pubId === id);
    if (index === -1) {
      return;
    }
    setInteractionsGalleryLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], like: true };
      return updatedArray;
    });

    try {
      await lensLike(id, dispatch, hasReacted);
      updateInteractions(index, {
        hasReacted: hasReacted ? false : true,
      });
    } catch (err: any) {
      errorChoice(
        err,
        () =>
          updateInteractions(index, {
            hasReacted: hasReacted ? false : true,
          }),
        dispatch
      );
    }

    setInteractionsGalleryLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], like: false };
      return updatedArray;
    });
  };

  const galleryMirror = async (id: string) => {
    const index = [
      ...(gallery?.collected || []),
      ...(gallery?.created || []),
    ].findIndex((pub) => pub.pubId === id);
    if (index === -1) {
      return;
    }
    setInteractionsGalleryLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], mirror: true };
      return updatedArray;
    });

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });
      await lensMirror(
        id,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      updateInteractions(index, {
        hasMirrored: true,
      });
    } catch (err: any) {
      errorChoice(
        err,
        () =>
          updateInteractions(index, {
            hasReacted: true,
          }),
        dispatch
      );
    }

    setInteractionsGalleryLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], mirror: false };
      return updatedArray;
    });
  };

  const displayLike = async (
    index: number,
    id: string,
    hasReacted: boolean
  ) => {
    setInteractionsDisplayLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], like: true };
      return updatedArray;
    });

    try {
      await lensLike(id, dispatch, hasReacted);
      updateInteractions(
        index,
        {
          hasMirrored: true,
        },
        true,
        id
      );
    } catch (err: any) {
      errorChoice(
        err,
        () =>
          updateInteractions(
            index,
            {
              hasReacted: hasReacted ? false : true,
            },
            true,
            id
          ),
        dispatch
      );
    }

    setInteractionsDisplayLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], like: false };
      return updatedArray;
    });
  };

  const displayMirror = async (index: number, id: string) => {
    setInteractionsDisplayLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], mirror: true };
      return updatedArray;
    });

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });
      await lensMirror(
        id,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      updateInteractions(
        index,
        {
          hasMirrored: true,
        },
        true,
        id
      );
    } catch (err: any) {
      errorChoice(
        err,
        () =>
          updateInteractions(
            index,
            {
              hasReacted: true,
            },
            true,
            id
          ),
        dispatch
      );
    }

    setInteractionsDisplayLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], mirror: false };
      return updatedArray;
    });
  };

  const updateInteractions = (
    index: number,
    valueToUpdate: Object,
    display?: boolean,
    id?: string
  ) => {
    if (display) {
      const newDisplay = profileDisplay;
      const updateItem = (item: Creation, newItem: Creation) =>
        item.publication?.id === id ? newItem : item;

      Object.keys(newDisplay!).forEach((categoryKey) => {
        const category = (newDisplay as any)?.[categoryKey];

        if (category?.main?.publication?.id === id) {
          category.main = {
            ...category.main,
            publication: {
              ...category.main?.publication,
              operations: {
                ...category.main?.publication?.operations,
                ...valueToUpdate,
              },
            },
          } as Creation;
        }

        if (category?.side) {
          category.side = category.side.map((item: Creation) =>
            updateItem(item, {
              ...item,
              publication: {
                ...item?.publication,
                operations: {
                  ...item?.publication?.operations,
                  ...valueToUpdate,
                } as PublicationOperations,
              } as Post & {
                decrypted: any;
              },
            })
          );
        }
      });

      dispatch(setProfileDisplay(newDisplay));
    } else {
      const allGallery = getGallerySort(selectedOption, gallery);
      allGallery[index] = {
        ...allGallery[index],
        publication: {
          ...allGallery[index].publication,
          operations: {
            ...allGallery[index].publication?.operations,
            ...valueToUpdate,
          } as PublicationOperations,
        } as Post & {
          decrypted: any;
        },
      };

      let newCollected: Creation[] = [],
        newCreated: Creation[] = [];
      allGallery.forEach((item) => {
        if (gallery?.collected?.includes(item)) {
          newCollected.push(item);
        } else if (gallery?.created?.includes(item)) {
          newCreated.push(item);
        }
      });

      setGallery({
        collected: newCollected,
        created: newCreated,
      });
    }
  };

  useEffect(() => {
    if (
      gallery?.collected &&
      gallery?.created &&
      gallery?.collected?.length < 1 &&
      gallery?.created?.length < 1
    ) {
      getGallery();
    }
  }, []);

  useEffect(() => {
    if (postSuccess) {
      getGallery();
    }
  }, [postSuccess]);

  useEffect(() => {
    if (
      (gallery?.collected && gallery?.collected?.length > 0) ||
      (gallery?.created && gallery?.created?.length > 0)
    ) {
      setOpenInteractions(
        Array.from(
          {
            length:
              gallery?.collected?.length || 0 + gallery?.created?.length || 0,
          },
          () => false
        )
      );
      setOpenMirrorGalleryChoice(
        Array.from(
          {
            length:
              gallery?.collected?.length || 0 + gallery?.created?.length || 0,
          },
          () => false
        )
      );
      setInteractionsGalleryLoading(
        Array.from(
          {
            length:
              gallery?.collected?.length || 0 + gallery?.created?.length || 0,
          },
          () => ({
            like: false,
            mirror: false,
            quote: false,
            bookmark: false,
            interested: false,
            hide: false,
          })
        )
      );
    }
  }, [gallery?.collected?.length, gallery?.created?.length]);

  return {
    interactionsGalleryLoading,
    galleryMirror,
    galleryLike,
    openMirrorGalleryChoice,
    setOpenMirrorGalleryChoice,
    interactionsDisplayLoading,
    openMirrorDisplayChoice,
    setOpenMirrorDisplayChoice,
    displayLike,
    displayMirror,
    handleSetDisplay,
    displayLoading,
    optionsOpen,
    setOptionsOpen,
    selectedOption,
    handleOptionSelect,
    galleryLoading,
    getMoreGallery,
    openInteractions,
    setOpenInteractions,
    sortType,
    setSortType,
    gallery,
    cursorInfo,
  };
};

export default useGallery;
