import { useEffect, useState } from "react";
import lensMirror from "../../../../lib/helpers/api/mirrorPost";
import lensLike from "../../../../lib/helpers/api/likePost";
import { setProfileDisplay } from "../../../../redux/reducers/profileDisplaySlice";
import { Creation } from "@/components/Tiles/types/tiles.types";
import { Display, SortType } from "../types/autograph.types";
import { v4 as uuidv4 } from "uuid";
import {
  MetadataAttributeType,
  NftImage,
  Post,
  Profile,
  PublicationOperations,
  PublicationStats,
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
import { ProfileMetadataSchema } from "@lens-protocol/metadata";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";

const useGallery = (
  lensConnected: Profile | undefined,
  profileDisplay: Display | undefined,
  dispatch: Dispatch,
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
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
  const [gallery, setGallery] = useState<{
    collected: Creation[];
    created: Creation[];
  }>({
    collected: [],
    created: [],
  });
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
        const reducedDisplay = await JSON.parse(displayItems.value);
        display = {
          private: {
            main:
              reducedDisplay.private?.main &&
              reducedDisplay.private.main !== "0"
                ? (
                    await handleCollectionProfilesAndPublications(
                      (
                        await getOneCollection(reducedDisplay.private.main)
                      )?.data?.collectionCreateds,
                      lensConnected?.id
                    )
                  )?.[0]
                : undefined,
            side: await Promise.all(
              (reducedDisplay.private?.side || []).map(async (id: string) =>
                id && id !== "0"
                  ? ((
                      await handleCollectionProfilesAndPublications(
                        (
                          await getOneCollection(id)
                        )?.data?.collectionCreateds,
                        lensConnected?.id
                      )
                    )?.[0] as Creation)
                  : undefined
              )
            ),
          },
          community: {
            main:
              reducedDisplay.community?.main &&
              reducedDisplay.community.main !== "0"
                ? (
                    await handleCollectionProfilesAndPublications(
                      (
                        await getOneCollection(reducedDisplay.community.main)
                      )?.data?.collectionCreateds,
                      lensConnected?.id
                    )
                  )?.[0]
                : undefined,
            side: await Promise.all(
              (reducedDisplay.community?.side || []).map(async (id: string) =>
                id && id !== "0"
                  ? ((
                      await handleCollectionProfilesAndPublications(
                        (
                          await getOneCollection(id)
                        )?.data?.collectionCreateds,
                        lensConnected?.id
                      )
                    )?.[0] as Creation)
                  : undefined
              )
            ),
          },
          public: {
            main:
              reducedDisplay.public?.main && reducedDisplay.public.main !== "0"
                ? (
                    await handleCollectionProfilesAndPublications(
                      (
                        await getOneCollection(reducedDisplay.public.main)
                      )?.data?.collectionCreateds,
                      lensConnected?.id
                    )
                  )?.[0]
                : undefined,
            side: await Promise.all(
              (reducedDisplay.public?.side || []).map(async (id: string) =>
                id && id !== "0"
                  ? ((
                      await handleCollectionProfilesAndPublications(
                        (
                          await getOneCollection(id)
                        )?.data?.collectionCreateds,
                        lensConnected?.id
                      )
                    )?.[0] as Creation)
                  : undefined
              )
            ),
          },
        };
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

      const existingCollectionIds =
        createdData?.data?.collectionCreateds?.map(
          (item: any) => item?.collectionId
        ) || [];

      const subOrderCollectionIds = [
        ...(collectedData?.data?.orderCreateds || []),
        ...(collectedData?.data?.nftonlyOrderCreateds || []),
      ].flatMap((item) => item?.subOrderCollectionIds || []);

      let collectedPromises = subOrderCollectionIds
        .map(async (id) => {
          if (!existingCollectionIds.includes(id)) {
            const res = await getOneCollection(id);
            return res?.data?.collectionCreateds?.[0];
          }
          return null;
        })
        .filter((promise) => promise !== null);

      let collected = await Promise.all(collectedPromises);
      collected =
        (await handleCollectionProfilesAndPublications(
          collected,
          lensConnected
        )) || [];

      const created =
        (await handleCollectionProfilesAndPublications(
          createdData?.data?.collectionCreateds,
          lensConnected
        )) || [];

      setCursorInfo({
        collected: cursorInfo?.collected + 25,
        created: cursorInfo?.created + 25,
        hasMore: collected?.length === 25 || created?.length === 25,
      });

      await getDisplayData([...created, ...collected]);
      setGallery({ collected, created });
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
          ...(collectedData?.data?.nftonlyOrderCreateds || []),
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
            lensConnected
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
            lensConnected
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
    if (!lensConnected?.id) return;
    setDisplayLoading(true);
    try {
      let attributes = [...(lensConnected?.metadata?.attributes || [])];

      const existing = attributes.findIndex(
        (item) => item?.key === "cypherDisplay"
      );

      const reducedDiplay = {
        private: {
          main: profileDisplay?.private?.main?.collectionId || "0",
          side: Array.from({ length: 3 })?.map(
            (_, index: number) =>
              profileDisplay?.private?.side?.[index]?.collectionId || "0"
          ),
        },
        community: {
          main: profileDisplay?.community?.main?.collectionId || "0",
          side: Array.from({ length: 3 })?.map(
            (_, index: number) =>
              profileDisplay?.community?.side?.[index]?.collectionId || "0"
          ),
        },
        public: {
          main: profileDisplay?.public?.main?.collectionId || "0",
          side: Array.from({ length: 3 })?.map(
            (_, index: number) =>
              profileDisplay?.public?.side?.[index]?.collectionId || "0"
          ),
        },
      };

      if (existing != -1) {
        attributes[existing].value = JSON.stringify(reducedDiplay);
      } else {
        attributes.push({
          key: "cypherDisplay",
          value: JSON.stringify(reducedDiplay),
          type: MetadataAttributeType.Json,
        });
      }

      const test = ProfileMetadataSchema.safeParse({
        $schema: "https://json-schemas.lens.dev/profile/2.0.0.json",
        lens: {
          attributes: attributes?.map((item) => ({
            ...item,
            type:
              item.type.toLowerCase() === "json"
                ? "JSON"
                : item.type.charAt(0).toUpperCase() +
                  item.type.slice(1).toLowerCase(),
          })),
          bio: lensConnected?.metadata?.bio,
          coverPicture:
            lensConnected?.metadata?.coverPicture?.__typename === "ImageSet"
              ? lensConnected?.metadata?.coverPicture?.raw?.uri
              : (lensConnected?.metadata?.coverPicture as unknown as NftImage)
                  ?.image?.raw?.uri,
          name: lensConnected?.metadata?.displayName as string,
          picture:
            lensConnected?.metadata?.picture?.__typename === "ImageSet"
              ? lensConnected?.metadata?.picture?.raw?.uri
              : (lensConnected?.metadata?.picture as NftImage)?.image?.raw?.uri,
          id: uuidv4(),
          version: "2.0.0",
        },
      });

      if (test?.success) {
        const response = await fetch("/api/ipfs", {
          method: "POST",
          body: JSON.stringify(test?.data),
        });
        const responseJSON = await response.json();

        const clientWallet = createWalletClient({
          chain: polygonMumbai,
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
      } else {
        dispatch(setInteractError(true));
      }
    } catch (err: any) {
      errorChoice(err, () => {}, dispatch);
    }
    setDisplayLoading(false);
  };

  const galleryLike = async (id: string, hasReacted: boolean) => {
    if (!lensConnected?.id) return;
    const index = [
      ...(gallery?.collected || []),
      ...(gallery?.created || []),
    ].findIndex((pub) => pub.publication?.id === id);
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
      updateInteractions(
        index,
        {
          hasReacted: hasReacted ? false : true,
        },
        "reactions",
        hasReacted ? false : true
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
            "reactions",
            hasReacted ? false : true
          ),
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
    if (!lensConnected?.id) return;
    const index = [
      ...(gallery?.collected || []),
      ...(gallery?.created || []),
    ].findIndex((pub) => pub.publication?.id === id);
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
        chain: polygonMumbai,
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
        "mirrors",
        true
      );
    } catch (err: any) {
      errorChoice(
        err,
        () =>
          updateInteractions(
            index,
            {
              hasMirrored: true,
            },
            "mirrors",
            true
          ),
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
    if (!lensConnected?.id) return;
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
          hasReacted: hasReacted ? false : true,
        },
        "reactions",
        hasReacted ? false : true,
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
            "reactions",
            hasReacted ? false : true,
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
    if (!lensConnected?.id) return;
    setInteractionsDisplayLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], mirror: true };
      return updatedArray;
    });

    try {
      const clientWallet = createWalletClient({
        chain: polygonMumbai,
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
        "mirrors",
        true,
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
              hasMirrored: true,
            },
            "mirrors",
            true,
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
    statToUpdate: string,
    increase: boolean,
    display?: boolean,
    id?: string
  ) => {
    if (display) {
      const newDisplay = JSON.parse(JSON.stringify(profileDisplay));

      Object.keys(newDisplay!)?.forEach((categoryKey) => {
        if (
          (categoryKey == "private" && sortType == 1) ||
          (categoryKey == "public" && sortType == 2) ||
          (categoryKey == "community" && sortType == 0)
        ) {
          const category = newDisplay[categoryKey];

          if (category?.main?.publication?.id === id && index == 0) {
            category.main = {
              ...category.main,
              publication: {
                ...category.main?.publication,
                operations: {
                  ...category.main?.publication?.operations,
                  ...valueToUpdate,
                },
                stats: {
                  ...category.main?.publication?.stats,
                  [statToUpdate]:
                    category.main?.publication?.stats?.[
                      statToUpdate as keyof PublicationStats
                    ] + (increase ? 1 : -1),
                },
              },
            } as Creation;
          }

          if (
            category?.side?.[index - 1]?.publication?.id == id &&
            index !== 0
          ) {
            category.side[index - 1] = {
              ...category.side[index - 1],
              publication: {
                ...category.side[index - 1]?.publication,
                operations: {
                  ...category.side[index - 1]?.publication?.operations,
                  ...valueToUpdate,
                } as PublicationOperations,
                stats: {
                  ...category.side[index - 1]?.publication?.stats,
                  [statToUpdate]:
                    category.side[index - 1]?.publication?.stats?.[
                      statToUpdate as keyof PublicationStats
                    ] + (increase ? 1 : -1),
                },
              },
            };
          }
          newDisplay[categoryKey] = category;
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
          stats: {
            ...allGallery[index]?.publication?.stats,
            [statToUpdate]:
              allGallery[index]?.publication?.stats?.[
                statToUpdate as keyof PublicationStats
              ] + (increase ? 1 : -1),
          },
        } as Post & {
          decrypted: any;
        },
      };

      let newCollected: Creation[] = [],
        newCreated: Creation[] = [];

      allGallery?.forEach((item) => {
        if (
          gallery?.collected?.some(
            (collectedItem) =>
              collectedItem?.pubId === item?.pubId &&
              item?.profileId === collectedItem?.profileId
          )
        ) {
          newCollected.push(item);
        } else if (
          gallery?.created?.some(
            (createdItem) =>
              createdItem?.pubId === item?.pubId &&
              item?.profileId === createdItem?.profileId
          )
        ) {
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
      gallery?.collected?.length < 1 &&
      gallery?.created?.length < 1 &&
      pageProfile?.ownedBy?.address
    ) {
      getGallery();
    }
  }, [
    pageProfile?.ownedBy?.address,
    lensConnected?.id,
    gallery?.collected?.length,
    gallery?.created?.length,
  ]);

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
