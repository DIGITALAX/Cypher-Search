import { useContext, useEffect, useState } from "react";
import { ModalContext } from "@/app/providers";
import { Account } from "@lens-protocol/client";
import { NFTData } from "../../Tiles/types/tiles.types";
import { Collection } from "../../Common/types/common.types";
import { GALLERY_OPTIONS } from "@/app/lib/constants";
import { Display, Drop } from "../types/autograph.types";
import handleCollectionProfilesAndPublications from "@/app/lib/helpers/handleCollectionProfilesAndPublications";
import { usePathname } from "next/navigation";
import {
  getCollectionsPaginated,
  getCollectionsPaginatedTripleA,
  getOneCollection,
} from "../../../../../graphql/queries/getAllCollections";
import {
  getOrdersPaginated,
  getOrdersPaginatedTripleA,
} from "../../../../../graphql/queries/getOrders";
import {
  getDropsPrint,
  getDropsTripleA,
} from "../../../../../graphql/queries/getDrop";
import handleCollectionProfilesAndPublicationsTripleA from "@/app/lib/helpers/handleCollectionProfilesAndPublicationsTripleA";
import { getLocaleFromPath } from "@/app/lib/helpers/getLocalPath";

const useGallery = (profile: Account | undefined) => {
  const context = useContext(ModalContext);
  const path = usePathname();
  const [moreGalleryLoading, setMoreGalleryLoading] = useState<boolean>(false);
  const [allDrops, setAllDrops] = useState<Drop[]>([]);
  const [gallery, setGallery] = useState<{
    collectedPrint: Collection[];
    createdPrint: Collection[];
    collectedTripleA: NFTData[];
    createdTripleA: NFTData[];
  }>({
    collectedPrint: [],
    createdPrint: [],
    collectedTripleA: [],
    createdTripleA: [],
  });
  const [cursorInfo, setCursorInfo] = useState<{
    collectedPrint: number;
    createdPrint: number;
    hasMorePrint: boolean;
    collectedTripleA: number;
    createdTripleA: number;
    hasMoreTripleA: boolean;
  }>({
    collectedPrint: 0,
    createdPrint: 0,
    hasMorePrint: true,
    collectedTripleA: 0,
    createdTripleA: 0,
    hasMoreTripleA: true,
  });
  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);
  const [galleryLoading, setGalleryLoading] = useState<boolean>(false);
  const [openInteractions, setOpenInteractions] = useState<boolean[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>(
    GALLERY_OPTIONS[0]?.[getLocaleFromPath(path)]
  );

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const getDisplayData = async (collections: Collection[]) => {
    try {
      const displayItems = profile?.metadata?.attributes?.find(
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
                        await getOneCollection(
                          Number(reducedDisplay.private.main)
                        )
                      )?.data?.collectionCreateds,
                      context?.lensConectado!,
                      context?.clienteLens!
                    )
                  )?.[0]
                : undefined,
            side: await Promise.all(
              (reducedDisplay.private?.side || []).map(async (id: string) =>
                id && id !== "0"
                  ? (
                      await handleCollectionProfilesAndPublications(
                        (
                          await getOneCollection(Number(id))
                        )?.data?.collectionCreateds,
                        context?.lensConectado!,
                        context?.clienteLens!
                      )
                    )?.[0]
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
                        await getOneCollection(
                          Number(reducedDisplay.community.main)
                        )
                      )?.data?.collectionCreateds,
                      context?.lensConectado!,
                      context?.clienteLens!
                    )
                  )?.[0]
                : undefined,
            side: await Promise.all(
              (reducedDisplay.community?.side || []).map(async (id: string) =>
                id && id !== "0"
                  ? (
                      await handleCollectionProfilesAndPublications(
                        (
                          await getOneCollection(Number(id))
                        )?.data?.collectionCreateds,
                        context?.lensConectado!,
                        context?.clienteLens!
                      )
                    )?.[0]
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
                        await getOneCollection(
                          Number(reducedDisplay.public.main)
                        )
                      )?.data?.collectionCreateds,
                      context?.lensConectado!,
                      context?.clienteLens!
                    )
                  )?.[0]
                : undefined,
            side: await Promise.all(
              (reducedDisplay.public?.side || []).map(async (id: string) =>
                id && id !== "0"
                  ? (
                      await handleCollectionProfilesAndPublications(
                        (
                          await getOneCollection(Number(id))
                        )?.data?.collectionCreateds,
                        context?.lensConectado!,
                        context?.clienteLens!
                      )
                    )?.[0]
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

      context?.setProfileDisplay(display);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getGallery = async () => {
    setGalleryLoading(true);
    try {
      const collectedDataPrint = await getOrdersPaginated(
        profile?.owner,
        25,
        cursorInfo.collectedPrint
      );
      const createdDataPrint = await getCollectionsPaginated(
        profile?.owner,
        25,
        cursorInfo.createdPrint
      );

      const collectedDataTripleA = await getOrdersPaginatedTripleA(
        profile?.owner,
        25,
        cursorInfo.collectedTripleA
      );
      const createdDataTripleA = await getCollectionsPaginatedTripleA(
        profile?.owner,
        25,
        cursorInfo.createdTripleA
      );
      const subOrderCollectionIds = (
        collectedDataPrint?.data?.orderCreateds || []
      ).flatMap((item: { collection: Collection }) => item?.collection || []);
      const subOrderCollectionIdsTripleA = (
        collectedDataTripleA?.data?.collectionPurchaseds || []
      ).flatMap((item: { collection: Collection }) => item?.collection || []);

      const uniqueCreatedCollectionIds = new Set(
        createdDataPrint?.data?.collectionCreateds
      );
      const filteredCollectedData = subOrderCollectionIds?.filter(
        (item: any) => !uniqueCreatedCollectionIds.has(item)
      ) as any[];
      const uniqueCreatedCollectionIdsTripleA = new Set(
        createdDataTripleA?.data?.collectionCreateds
      );
      const filteredCollectedDataTripleA = subOrderCollectionIdsTripleA?.filter(
        (item: any) => !uniqueCreatedCollectionIdsTripleA.has(item)
      ) as any[];

      let collectedPrint =
        (await handleCollectionProfilesAndPublications(
          filteredCollectedData,
          context?.lensConectado!,
          context?.clienteLens!
        )) || [];

      let createdPrint =
        (await handleCollectionProfilesAndPublications(
          createdDataPrint?.data?.collectionCreateds,
          context?.lensConectado!,
          context?.clienteLens!
        )) || [];

      let collectedTripleA =
        (await handleCollectionProfilesAndPublicationsTripleA(
          filteredCollectedDataTripleA,
          context?.lensConectado!,
          context?.clienteLens!
        )) || [];

      let createdTripleA =
        (await handleCollectionProfilesAndPublicationsTripleA(
          createdDataTripleA?.data?.collectionCreateds,
          context?.lensConectado!,
          context?.clienteLens!
        )) || [];

      setCursorInfo({
        collectedPrint: cursorInfo?.collectedPrint + 25,
        createdPrint: cursorInfo?.createdPrint + 25,
        hasMorePrint:
          collectedPrint?.length === 25 || createdPrint?.length === 25,
        collectedTripleA: cursorInfo?.collectedTripleA + 25,
        createdTripleA: cursorInfo?.createdTripleA + 25,
        hasMoreTripleA:
          collectedTripleA?.length === 25 || createdPrint?.length === 25,
      });

      await getDisplayData([...createdPrint, ...collectedPrint]);

      const dropsTripleA = await getDropsTripleA(profile?.owner);
      const dropsPrint = await getDropsPrint(profile?.owner);

      setAllDrops([
        ...dropsTripleA?.data?.dropCreateds,
        ...dropsPrint?.data?.dropCreateds,
      ]);

      setGallery({
        collectedPrint,
        createdPrint,
        collectedTripleA,
        createdTripleA,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setGalleryLoading(false);
  };

  const getMoreGallery = async () => {
    if (!cursorInfo?.hasMorePrint && !cursorInfo?.hasMoreTripleA) return;
    setMoreGalleryLoading(true);
    try {
      let collectedPrint: Collection[] = [],
        collectedTripleA: NFTData[] = [],
        createdPrint: Collection[] = [],
        createdTripleA: NFTData[] = [];
      if (
        gallery?.collectedPrint &&
        gallery?.collectedPrint?.length >= cursorInfo?.collectedPrint
      ) {
        const collectedData = await getOrdersPaginated(
          profile?.owner,
          25,
          cursorInfo.collectedPrint
        );

        collectedPrint =
          (await handleCollectionProfilesAndPublications(
            collectedData?.data?.orderCreateds?.flatMap(
              (item: { collection: Collection }) => item?.collection || []
            ),
            context?.lensConectado!,
            context?.clienteLens!
          )) || [];
      }

      if (
        gallery?.createdPrint &&
        gallery?.createdPrint?.length >= cursorInfo?.createdPrint
      ) {
        const createdData = await getCollectionsPaginated(
          profile?.owner,
          25,
          cursorInfo.createdPrint
        );
        createdPrint =
          (await handleCollectionProfilesAndPublications(
            createdData?.data?.collectionCreateds,
            context?.lensConectado!,
            context?.clienteLens!
          )) || [];
      }

      if (
        gallery?.collectedTripleA &&
        gallery?.collectedTripleA?.length >= cursorInfo?.collectedTripleA
      ) {
        const collectedData = await getOrdersPaginatedTripleA(
          profile?.owner,
          25,
          cursorInfo.collectedTripleA
        );

        collectedTripleA =
          (await handleCollectionProfilesAndPublicationsTripleA(
            collectedData?.data?.orderCreateds?.flatMap(
              (item: { collection: NFTData }) => item?.collection || []
            ),
            context?.lensConectado!,
            context?.clienteLens!
          )) || [];
      }

      if (
        gallery?.createdTripleA &&
        gallery?.createdTripleA?.length >= cursorInfo?.createdTripleA
      ) {
        const createdData = await getCollectionsPaginatedTripleA(
          profile?.owner,
          25,
          cursorInfo.createdTripleA
        );
        createdTripleA =
          (await handleCollectionProfilesAndPublicationsTripleA(
            createdData?.data?.collectionCreateds,
            context?.lensConectado!,
            context?.clienteLens!
          )) || [];
      }

      setCursorInfo({
        collectedPrint: cursorInfo?.collectedPrint + 25,
        createdPrint: cursorInfo?.createdPrint + 25,
        hasMorePrint:
          collectedPrint?.length == 25 || createdPrint?.length == 25
            ? true
            : false,
        collectedTripleA: cursorInfo?.collectedTripleA + 25,
        createdTripleA: cursorInfo?.createdTripleA + 25,
        hasMoreTripleA:
          collectedTripleA?.length == 25 || createdTripleA?.length == 25
            ? true
            : false,
      });

      setGallery({
        collectedPrint: [...(gallery?.collectedPrint || []), ...collectedPrint],
        createdPrint: [...(gallery?.createdPrint || []), ...createdPrint],
        collectedTripleA: [
          ...(gallery?.collectedTripleA || []),
          ...collectedTripleA,
        ],
        createdTripleA: [...(gallery?.createdTripleA || []), ...createdTripleA],
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setMoreGalleryLoading(false);
  };

  useEffect(() => {
    if (
      gallery?.collectedPrint?.length < 1 &&
      gallery?.createdPrint?.length < 1 &&
      gallery?.collectedTripleA?.length < 1 &&
      gallery?.createdTripleA?.length < 1 &&
      profile?.address
    ) {
      getGallery();
    }
  }, [
    profile?.address,
    context?.clienteLens,
    context?.lensConectado?.sessionClient,
    gallery?.collectedPrint?.length,
    gallery?.createdPrint?.length,
  ]);

  return {
    optionsOpen,
    setOptionsOpen,
    selectedOption,
    handleOptionSelect,
    galleryLoading,
    getMoreGallery,
    openInteractions,
    setOpenInteractions,
    gallery,
    cursorInfo,
    moreGalleryLoading,
    allDrops,
  };
};

export default useGallery;
