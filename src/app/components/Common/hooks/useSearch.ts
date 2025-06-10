import {
  CHROMADIN,
  FILTER_SHUFFLE,
  LANGS,
  numberToItemTypeMap,
  PLACEHOLDERS,
  REFINED_TAGS,
} from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { usePathname, useRouter } from "next/navigation";
import {
  KeyboardEvent,
  MouseEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AutographCollection,
  Award,
  Catalogo,
  Collection,
  Filter,
  PostFilter,
  Quest,
} from "../types/common.types";
import filterEmpty from "@/app/lib/helpers/filterEmpty";
import buildTextQuery, {
  buildKinoraTextQuery,
  buildTextQueryTripleA,
  combineQueryObjects,
} from "@/app/lib/helpers/buildTextQuery";
import mixArrays from "@/app/lib/helpers/mixArrays";
import { GeneralPub, NFTData } from "../../Tiles/types/tiles.types";
import {
  Account,
  evmAddress,
  MainContentFocus,
  PageSize,
  Post,
  PostType,
  Repost,
} from "@lens-protocol/client";
import handleCollectionProfilesAndPublications from "@/app/lib/helpers/handleCollectionProfilesAndPublications";
import {
  fetchAccounts,
  fetchAccountsBulk,
  fetchPosts,
} from "@lens-protocol/client/actions";
import { buildQuery, buildQueryTripleA } from "@/app/lib/helpers/buildQuery";
import {
  getAllCollections,
  getAllCollectionsTripleA,
} from "../../../../../graphql/queries/getAllCollections";
import handleCollectionProfilesAndPublicationsTripleA from "@/app/lib/helpers/handleCollectionProfilesAndPublicationsTripleA";
import { manejearCatalogos } from "@/app/lib/helpers/manejarCatalogos";

const useSearch = () => {
  const context = useContext(ModalContext);
  const [placeholder, setPlaceholder] = useState<string>();
  const path = usePathname();
  const router = useRouter();

  const handleSearch = async (
    e?: KeyboardEvent | MouseEvent,
    click?: boolean,
    backup?: boolean,
    random?: Filter
  ) => {
    context?.setSearchItems((prev) => ({
      ...prev,
      searchLoading: true,
    }));

    if (!LANGS.some((lang) => path === lang)) {
      router.prefetch("/");
      router.push("/");
    }
    if (!context?.searchActive) {
      context?.setSearchActive(true);
    }
    let query: string | undefined,
      collections: Collection[] | undefined = [],
      quests: Quest[] | undefined = [],
      awards: Award[] | undefined = [],
      tripleA: NFTData[] | undefined = [],
      catalogos: (Catalogo | AutographCollection)[] | undefined = [],
      profiles: Account[] | undefined = [],
      publications: (Post | Repost)[] | undefined = [],
      pubCursor: string | undefined,
      profileCursor: string | undefined,
      pubProfileCursor: string | undefined,
      videoCursor: string | undefined,
      microbrands: Account[] = [];
    try {
      if (
        ((e as KeyboardEvent)?.key === "Enter" &&
          context?.searchItems?.input.trim() !== "" &&
          !click) ||
        (click && context?.searchItems?.input?.trim() !== "")
      ) {
        if (filterEmpty(context?.filters!) && !backup) {
          const where = buildTextQuery(
            context?.searchItems?.input?.replaceAll("@", "")!
          );

          if (where) {
            const searchItems = await getAllCollections(
              where,
              10,
              0,
              "desc",
              "blockTimestamp"
            );

            if (searchItems?.data?.collectionCreateds?.length > 0)
              collections = await handleCollectionProfilesAndPublications(
                searchItems?.data?.collectionCreateds,
                context?.lensConectado!,
                context?.clienteLens!
              );
          }

          const whereTripleA = buildTextQueryTripleA(
            context?.searchItems?.input?.replaceAll("@", "")!
          );

          if (whereTripleA) {
            const data = await getAllCollectionsTripleA(
              whereTripleA,
              10,
              0,
              "desc",
              "blockTimestamp"
            );

            if (data?.data?.collectionCreateds?.length > 0)
              tripleA = await handleCollectionProfilesAndPublicationsTripleA(
                data?.data?.collectionCreateds,
                context?.lensConectado!,
                context?.clienteLens!
              );
          }

          const kinoraWhere = buildKinoraTextQuery(
            context?.searchItems?.input?.replaceAll("@", "")!
          );

          if (kinoraWhere) {
            // const kinoraItems = await getQuestsWhere(kinoraWhere, 10, 0);
            // if (kinoraItems?.data?.questInstantiateds?.length > 0)
            //   quests = await handleQuestData(
            //     kinoraItems?.data?.questInstantiateds,
            //     lensConnected
            //   );
          }
        } else {
          const data = await filterSearch(
            0,
            0,
            0,
            query?.replaceAll("@", "") || ""
          );

          quests = data?.quests;
          collections = data?.collections;
        }
        query = context?.searchItems?.input?.replaceAll("@", "");
      } else {
        const data = await filterSearch(
          0,
          0,
          undefined,
          query?.replaceAll("@", "") || "",
          random
        );

        quests = data?.quests;
        collections = data?.collections;
        tripleA = data?.tripleA;
        if (!context?.searchItems?.input && backup) {
          query = REFINED_TAGS?.sort(() => Math.random() - 0.5)?.[0];
        } else {
          query = context?.searchItems?.input?.replaceAll("@", "");
        }
      }

      if (query) {
        const profileSearch = await fetchAccounts(
          context?.lensConectado?.sessionClient ?? context?.clienteLens!,
          {
            pageSize: PageSize.Ten,
            filter: {
              searchBy: {
                localNameQuery: query,
              },
            },
          }
        );

        if (profileSearch?.isOk()) {
          profiles = (profileSearch?.value?.items || []) as Account[];
          profileCursor = profileSearch?.value?.pageInfo?.next!;
        }

        if (
          (!context?.filters?.microbrand ||
            context?.filters?.microbrand == "") &&
          (!collections || collections?.length < 1)
        ) {
          const pubSearch = await fetchPosts(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              pageSize: PageSize.Ten,
              filter: {
                searchQuery: query,
                postTypes: [PostType.Root],
                metadata: {
                  mainContentFocus: context?.filters?.format
                    ? context.filters?.format
                        ?.split(",")
                        .map((word) => word.trim())
                        .filter((word: string) => word.length > 0)
                    : undefined,
                  tags: context?.filters?.hashtag
                    ? {
                        oneOf: context?.filters?.hashtag
                          ?.split(",")
                          .map((word) => word.trim())
                          .filter((word: string) => word.length > 0),
                      }
                    : undefined,
                },
              },
            }
          );

          if (pubSearch?.isOk()) {
            publications = (pubSearch?.value?.items || []) as (Post | Repost)[];
            pubCursor = pubSearch?.value?.pageInfo?.next!;
          }
        }
      }

      if (publications?.length < 1) {
        let filter: PostFilter = {
          postTypes: [PostType.Root],
        };

        if (
          context?.filters?.microbrand &&
          context?.filters?.microbrand?.trim() !== "" &&
          context?.filterConstants?.microbrands
        ) {
          filter = {
            ...filter,
            authors: context?.filterConstants?.microbrands
              ?.filter((item) =>
                context?.filters?.microbrand
                  ?.split(",")
                  .map((word) => word.trim())
                  ?.map((item) => item?.toLowerCase())
                  ?.includes(item?.[0]?.toLowerCase())
              )
              ?.map((item) => evmAddress(item[2])),
          };
        } else if (collections && collections?.length > 0) {
          filter = {
            ...filter,
            authors: Array.from(
              new Set(collections?.map((item) => item?.profile?.address))
            ),
          };
        }

        if (filter.authors && filter.authors?.length > 0) {
          const data = await fetchPosts(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              pageSize: PageSize.Ten,
              filter,
            }
          );

          if (data?.isOk()) {
            publications = (data?.value?.items || []) as (Post | Repost)[];
            pubProfileCursor = data?.value?.pageInfo?.next!;
          }
        }
      }

      if (
        ((context?.filters?.format?.toLowerCase()?.includes("video") ||
          publications?.length + profiles?.length < 10) &&
          publications?.filter(
            (item) =>
              (item as Post)?.metadata?.__typename == "VideoMetadata" ||
              item?.author?.address?.toLowerCase() == CHROMADIN?.toLowerCase()
          )?.length < 10 &&
          query?.trim() == "") ||
        query?.toLowerCase()?.includes("chromadin")
      ) {
        const data = await fetchPosts(
          context?.lensConectado?.sessionClient ?? context?.clienteLens!,
          {
            pageSize: PageSize.Ten,
            filter: {
              postTypes: [PostType.Root],
              authors: [CHROMADIN],
            },
          }
        );

        if (data?.isOk()) {
          videoCursor = data?.value?.pageInfo?.next!;

          publications = [...publications, ...(data?.value?.items || [])] as (
            | Post
            | Repost
          )[];
        }
      }

      // if (
      //   (quests || [])?.length < 1 &&
      //   context?.filters?.origin?.toLowerCase()?.includes("kinora")
      // ) {
      //   const kinoraItems = await getQuests(10, 0);
      //   if (kinoraItems?.data?.questInstantiateds?.length > 0)
      //     quests = await handleQuestData(
      //       kinoraItems?.data?.questInstantiateds,
      //       lensConnected
      //     );
      // }

      // if (
      //   context?.filters?.origin?.toLowerCase()?.includes("kinora") ||
      //   query?.toLowerCase()?.includes("kinora") ||
      //   query?.toLowerCase()?.includes("quest")
      // ) {
      //   const data = await getAllRewards(10, 0);
      //   if (data?.data?.rewards?.length > 0) {
      //     awards = await handleAwardsData(data?.data?.rewards);
      //   }
      // }

      if (context?.filters?.catalog?.trim() !== "") {
        catalogos = await manejearCatalogos(
          context?.lensConectado!,
          context?.clienteLens!,
          10,
          0
        );
      }

      if (
        ((context?.filters?.microbrand?.trim() !== "" &&
          context?.filters?.microbrand) ||
          (query &&
            context?.filterConstants?.microbrands?.filter((item) =>
              item?.[0]?.toLowerCase()?.includes(query?.toLowerCase() || "")
            )?.length &&
            context?.filterConstants?.microbrands?.filter((item) =>
              item?.[0]?.toLowerCase()?.includes(query?.toLowerCase() || "")
            )?.length > 0)) &&
        context?.filterConstants?.microbrands &&
        context?.filterConstants?.microbrands?.length > 0
      ) {
        if ((quests || [])?.length < 1) {
          // const filter = buildKinoraProfileIds(
          //   context?.filters?.microbrand?.trim() !== "" &&
          //     context?.filters?.microbrand
          //     ? context?.filterConstants?.microbrands
          //         ?.filter((item) =>
          //           context?.filters?.microbrand
          //             ?.split(",")
          //             .map((word) => word.trim())
          //             ?.map((item) => item?.toLowerCase())
          //             ?.includes(item?.[0]?.toLowerCase())
          //         )
          //         ?.map((item) => `${toHexWithLeadingZero(Number(item[2]))}`)
          //     : context?.filterConstants?.microbrands
          //         ?.filter((item) =>
          //           item?.[0]?.toLowerCase()?.includes(query!?.toLowerCase())
          //         )
          //         ?.map((item) => `${toHexWithLeadingZero(Number(item[2]))}`)
          // );
          // if (where) {
          //   const kinoraItems = await getQuestByProfile(where, 10, 0);
          //   if (kinoraItems?.data?.questInstantiateds?.length > 0) {
          //     quests = await handleQuestData(
          //       kinoraItems?.data?.questInstantiateds,
          //       lensConnected
          //     );
          //   }
          // }
        }

        const data = await fetchAccountsBulk(
          context?.lensConectado?.sessionClient ?? context?.clienteLens!,
          {
            addresses:
              context?.filters?.microbrand?.trim() !== "" &&
              context?.filters?.microbrand
                ? context?.filterConstants?.microbrands
                    ?.filter((item) =>
                      context?.filters?.microbrand
                        ?.split(",")
                        .map((word) => word.trim())
                        ?.map((item) => item?.toLowerCase())
                        ?.includes(item?.[0]?.toLowerCase())
                    )
                    ?.map((item) => evmAddress(item[2]))
                : context?.filterConstants?.microbrands
                    ?.filter((item) =>
                      item?.[0]?.toLowerCase()?.includes(query!?.toLowerCase())
                    )
                    ?.map((item) => evmAddress(item[2])),
          }
        );

        if (data.isOk()) {
          microbrands = (data?.value?.map((item) => {
            const index = context?.filterConstants?.microbrands?.findIndex(
              (micro) =>
                micro?.[2]?.toLowerCase() == item?.address?.toLowerCase()
            )!;
            return {
              ...item,
              microbandCover: context?.filterConstants?.microbrands[index]?.[1],
              microbrandName: context?.filterConstants?.microbrands[index]?.[0],
            };
          }) || []) as any;
        }
      }

      const allItems = [
        collections?.map((item) => ({
          post: item,
          type: numberToItemTypeMap[Number(item.origin)],
        })) || [],
        tripleA?.map((item) => ({
          post: item,
          type: "TripleA",
        })) || [],
        quests?.map((item) => ({
          post: item,
          type: "Kinora",
        })) || [],
        awards?.map((item) => ({
          post: item,
          type: "Award",
        })) || [],
        catalogos?.map((item) => ({
          post: item,
          type: "Catalogo",
        })) || [],
        [
          ...(profiles?.map((item) => ({
            post: item,
            type: "Profile",
          })) || []),
          ...(microbrands?.map((item) => ({
            post: item,
            type: "Microbrand",
          })) || []),
        ],
        publications?.map((item) => ({
          post: item,
          type:
            item?.__typename !== "Repost"
              ? (item as Post)?.metadata?.__typename
              : item?.repostOf?.metadata?.__typename,
        })) || [],
      ]?.filter((item) => item?.length > 0) as GeneralPub[][];

      context?.setSearchItems((prev) => ({
        ...prev,
        items: backup
          ? [...(prev?.items || []), ...mixArrays(allItems)]
          : mixArrays(allItems),
        graphCursor: Number(collections?.length) >= 10 ? 10 : undefined,
        kinoraCursor: Number(quests?.length) >= 10 ? 10 : undefined,
        awardCursor: Number(awards?.length) >= 10 ? 10 : undefined,
        tripleACursor: Number(tripleA?.length) >= 10 ? 10 : undefined,
        catalogoCursor: Number(catalogos?.length) >= 10 ? 10 : undefined,
        lensProfileCursor: profileCursor,
        lensPubCursor: pubCursor,
        pubProfileCursor: pubProfileCursor,
        videoCursor: videoCursor,
        hasMore:
          Number(collections?.length) >= 10 ||
          Number(publications?.length) >= 10 ||
          Number(profiles?.length) >= 10 ||
          pubProfileCursor ||
          videoCursor
            ? true
            : false,
      }));
    } catch (err: any) {
      console.error(err.message);
    }
    context?.setSearchItems((prev) => ({
      ...prev,
      searchLoading: false,
    }));
  };

  const filterSearch = async (
    cursor: number | undefined,
    tripleACursor: number | undefined,
    kinoraCursor: number | undefined,
    query: string,
    newFilters?: Filter
  ): Promise<
    | {
        collections: Collection[];
        quests: Quest[];
        tripleA: NFTData[];
      }
    | undefined
  > => {
    let filter = newFilters ? newFilters : context?.filters!;
    const where = buildQuery(filter);
    const whereTripleA = buildQueryTripleA(filter);

    let collections, quests, tripleA;
    try {
      if (cursor !== undefined) {
        if (query.trim() !== "") {
          const textWhere = buildTextQuery(query?.replaceAll("@", "")!);
          const combinedWhere = combineQueryObjects(textWhere, where);
          const searchItems = await getAllCollections(
            combinedWhere,
            10,
            cursor,
            ["asc", "desc"][Math.floor(Math.random() * 2)],
            [
              "printType",
              "origin",
              "blockTimestamp",
              "designer",
              "metadata_title",
            ][Math.floor(Math.random() * 5)]
          );
          collections = searchItems?.data?.collectionCreateds;
        } else {
          const searchItems = await getAllCollections(
            where,
            10,
            cursor,
            ["asc", "desc"][Math.floor(Math.random() * 2)],
            "blockTimestamp"
          );
          collections = searchItems?.data?.collectionCreateds;
        }
      }

      if (tripleACursor !== undefined) {
        if (query.trim() !== "") {
          const textWhere = buildTextQueryTripleA(query?.replaceAll("@", "")!);

          const combinedWhere = combineQueryObjects(textWhere, whereTripleA);

          const searchItems = await getAllCollectionsTripleA(
            combinedWhere,
            10,
            tripleACursor,
            ["asc", "desc"][Math.floor(Math.random() * 2)],
            ["blockTimestamp", "artist", "metadata_title"][
              Math.floor(Math.random() * 5)
            ]
          );
          collections = searchItems?.data?.collectionCreateds;
        } else {
          const searchItems = await getAllCollectionsTripleA(
            whereTripleA,
            10,
            tripleACursor,
            ["asc", "desc"][Math.floor(Math.random() * 2)],
            "blockTimestamp"
          );

          tripleA = searchItems?.data?.collectionCreateds;
        }
      }

      // if (kinoraCursor !== undefined) {
      //   const kinoraItems = await getQuests(10, kinoraCursor);
      //   if (kinoraItems?.data?.questInstantiateds?.length > 0)
      //     quests = await handleQuestData(
      //       kinoraItems?.data?.questInstantiateds,
      //       lensConnected
      //     );
      // }

      if (collections?.length < 1 && cursor !== undefined) {
        let where: Object;
        if (query.trim() !== "") {
          where = buildTextQuery(query?.replaceAll("@", "")!)!;
        } else {
          const {
            format,
            origin,
            fulfiller,
            size,
            color,
            price,
            catalog,
            editions,
            available,
            token,
            drop,
            ...rest
          } = context?.filters!;
          where = buildQuery({
            ...rest,
            format: "",
            origin: "",

            fulfiller: "",
            size: {
              apparel: [],
              poster: [],
              sticker: [],
            },
            color: [],
            price: {
              min: 0,
              max: 0,
            },
            catalog: "",
            editions: 0,
            available: true,
            token: "",
            drop: "",
          });
        }

        const searchItems = await getAllCollections(
          where,
          10,
          cursor,
          ["asc", "desc"][Math.floor(Math.random() * 2)],
          [
            "printType",
            "origin",
            "blockTimestamp",
            "designer",
            "metadata_title",
          ][Math.floor(Math.random() * 2)]
        );
        collections = searchItems?.data?.collectionCreateds;
      }

      if (collections?.length > 0) {
        collections = await handleCollectionProfilesAndPublications(
          collections,
          context?.lensConectado!,
          context?.clienteLens!
        );
      }

      if (tripleA?.length < 1 && tripleACursor !== undefined) {
        let where: Object;

        if (query.trim() !== "") {
          where = buildTextQueryTripleA(query?.replaceAll("@", "")!)!;
        } else {
          const {
            format,
            origin,
            fulfiller,
            size,
            color,
            price,
            catalog,
            editions,
            available,
            token,
            drop,
            ...rest
          } = context?.filters!;
          where = buildQueryTripleA({
            ...rest,
            format: "",
            origin: "",

            fulfiller: "",
            size: {
              apparel: [],
              poster: [],
              sticker: [],
            },
            color: [],
            price: {
              min: 0,
              max: 0,
            },
            catalog: "",
            editions: 0,
            available: true,
            token: "",
            drop: "",
          });
        }

        const searchItems = await getAllCollectionsTripleA(
          where,
          10,
          tripleACursor,
          ["asc", "desc"][Math.floor(Math.random() * 2)],
          ["origin", "blockTimestamp", "artist", "metadata_title"][
            Math.floor(Math.random() * 2)
          ]
        );
        tripleA = searchItems?.data?.collectionCreateds;
      }

      if (tripleA?.length > 0) {
        tripleA = await handleCollectionProfilesAndPublicationsTripleA(
          tripleA,
          context?.lensConectado!,
          context?.clienteLens!
        );
      }

      return {
        collections: collections || [],
        quests: quests || [],
        tripleA: tripleA || [],
      };
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleMoreSearch = async () => {
    context?.setSearchItems((prev) => ({
      ...prev,
      moreSearch: false,
    }));

    if (!context?.searchItems?.hasMore) {
      await handleSearch(undefined, undefined, true);
      return;
    }

    context?.setSearchItems((prev) => ({
      ...prev,
      moreSearchLoading: true,
    }));
    if (!context?.searchActive) {
      context?.setSearchActive(true);
    }
    let query: string,
      collections: Collection[] | undefined = [],
      quests: Quest[] | undefined = [],
      tripleA: NFTData[] | undefined = [],
      awards: Award[] | undefined = [],
      catalogos: (Catalogo | AutographCollection)[] | undefined = [],
      profiles: Account[] | undefined = [],
      publications: (Post | Repost)[] | undefined = [],
      pubProfileCursor: string | undefined,
      pubCursor: string | undefined,
      videoCursor: string | undefined,
      profileCursor: string | undefined,
      microbrands: Account[] = [];
    try {
      if (filterEmpty(context?.filters) && context?.searchItems?.input) {
        if (context?.searchItems?.graphCursor) {
          const where = buildTextQuery(
            context?.searchItems?.input?.replaceAll("@", "")!
          );
          if (where) {
            const searchItems = await getAllCollections(
              where,
              10,
              context?.searchItems?.graphCursor,
              "desc",
              "blockTimestamp"
            );

            if (searchItems?.data?.collectionCreateds?.length > 0)
              collections = await handleCollectionProfilesAndPublications(
                searchItems?.data?.collectionCreateds,
                context?.lensConectado!,
                context?.clienteLens!
              );
          }
        }

        if (context?.searchItems?.tripleACursor) {
          const tripleAWhere = buildTextQueryTripleA(
            context?.searchItems?.input?.replaceAll("@", "")!
          );
          if (tripleAWhere) {
            const searchItems = await getAllCollectionsTripleA(
              tripleAWhere,
              10,
              context?.searchItems?.tripleACursor,
              "desc",
              "blockTimestamp"
            );

            if (searchItems?.data?.collectionCreateds?.length > 0)
              tripleA = await handleCollectionProfilesAndPublicationsTripleA(
                searchItems?.data?.collectionCreateds,
                context?.lensConectado!,
                context?.clienteLens!
              );
          }
        }

        query = context?.searchItems?.input?.replaceAll("@", "");
      } else {
        if (
          context?.searchItems?.graphCursor ||
          context?.searchItems?.kinoraCursor ||
          context?.searchItems?.tripleACursor
        ) {
          const data = await filterSearch(
            context?.searchItems?.graphCursor,
            context?.searchItems?.tripleACursor,
            context?.searchItems?.kinoraCursor,
            context?.searchItems?.input || ""
          );

          collections = data?.collections;
          quests = data?.quests;
          tripleA = data?.tripleA;
        }

        query = context?.searchItems?.input?.replaceAll("@", "");
      }

      if (query) {
        if (
          context?.searchItems?.lensPubCursor &&
          (!context?.filters?.microbrand ||
            context?.filters?.microbrand?.trim() == "") &&
          (!collections || collections?.length < 1)
        ) {
          const pubSearch = await fetchPosts(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              pageSize: PageSize.Ten,
              filter: {
                searchQuery: query,
                postTypes: [PostType.Root],
                metadata: {
                  tags: context?.filters?.hashtag
                    ? {
                        oneOf: context?.filters?.hashtag
                          ?.split(",")
                          .map((word) => word.trim())
                          .filter((word: string) => word.length > 0),
                        all: context?.filters?.origin
                          ? [
                              ...context?.filters?.origin
                                ?.split(",")
                                .map((word) => word.trim())
                                .filter((word: string) => word.length > 0),
                              "cyphersearch",
                            ]
                          : [
                              "chromadin",
                              "triplea",
                              "kinora",
                              "cyphersearch",
                              "litlistener",
                            ],
                      }
                    : undefined,
                  mainContentFocus: context?.filters?.format
                    ? (context?.filters?.format
                        ?.split(",")
                        .map((word) => word.trim())
                        .filter(
                          (word: string) => word.length > 0
                        ) as MainContentFocus[])
                    : undefined,
                },
              },
              cursor: context?.searchItems?.lensPubCursor,
            }
          );

          if (pubSearch?.isOk()) {
            publications = (pubSearch?.value?.items || []) as (Post | Repost)[];
            pubCursor = pubSearch?.value?.pageInfo?.next!;
          }
        }

        if (context?.searchItems?.lensProfileCursor) {
          const profileSearch = await fetchAccounts(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              cursor: context?.searchItems?.lensProfileCursor,
              pageSize: PageSize.Ten,
              filter: {
                searchBy: {
                  localNameQuery: query,
                },
              },
            }
          );

          if (profileSearch?.isOk()) {
            profiles = (profileSearch?.value?.items || []) as Account[];
            profileCursor = profileSearch?.value?.pageInfo?.next!;
          }
        }
      }

      if (
        (context?.filters?.microbrand?.trim() !== "" &&
          context?.filters?.microbrand) ||
        (collections && collections?.length > 0) ||
        context?.searchItems?.items?.filter(
          (item) =>
            (item.post as Collection)?.amount &&
            Number((item.post as Collection)?.amount) > 0
        )?.length > 0
      ) {
        let filter: PostFilter = {
          postTypes: [PostType.Root],
        };

        if (
          context?.filters?.microbrand?.trim() !== "" &&
          context?.filters?.microbrand
        ) {
          filter = {
            ...filter,
            authors: context?.filterConstants?.microbrands
              ?.filter((item) =>
                context?.filters?.microbrand
                  ?.split(",")
                  .map((word) => word.trim())
                  ?.map((item) => item?.toLowerCase())
                  ?.includes(item?.[0]?.toLowerCase())
              )
              ?.map((item) => evmAddress(item[2]))
              ?.filter(Boolean),
          };
        } else if (
          (collections && collections?.length > 0) ||
          context?.searchItems?.items?.filter(
            (item) =>
              (item.post as Collection)?.amount &&
              Number((item.post as Collection)?.amount) > 0
          )?.length > 0
        ) {
          filter = {
            ...filter,
            authors:
              collections && collections?.length > 0
                ? Array.from(
                    new Set(collections?.map((item) => item?.profile?.address))
                  )?.filter(Boolean)
                : (
                    context?.searchItems?.items?.filter(
                      (item) =>
                        (item.post as Collection)?.amount &&
                        Number((item.post as Collection)?.amount) > 0
                    ) as GeneralPub[]
                  )
                    ?.map(
                      (item: GeneralPub) =>
                        (item?.post as Collection)?.profile?.address
                    )
                    ?.filter(Boolean),
          };
        }

        const data = await fetchPosts(
          context?.lensConectado?.sessionClient ?? context?.clienteLens!,
          {
            pageSize: PageSize.Ten,
            filter,
            cursor: context?.searchItems?.pubProfileCursor,
          }
        );
        if (data?.isOk()) {
          publications = (data?.value?.items || []) as Post[];
          pubProfileCursor = data?.value?.pageInfo?.next!;
        }
      }

      if (
        ((context?.filters?.format?.toLowerCase()?.includes("video") ||
          publications?.length + profiles?.length < 10) &&
          context?.searchItems?.videoCursor &&
          publications?.filter(
            (item) => (item as Post)?.metadata?.__typename == "VideoMetadata"
          )?.length < 10) ||
        query?.toLowerCase()?.includes("chromadin")
      ) {
        const data = await fetchPosts(
          context?.lensConectado?.sessionClient ?? context?.clienteLens!,
          {
            pageSize: PageSize.Ten,
            filter: {
              postTypes: [PostType.Root],
              authors: [CHROMADIN],
            },
            cursor: context?.searchItems?.videoCursor,
          }
        );

        if (data?.isOk()) {
          videoCursor = data?.value?.pageInfo?.next!;

          publications = [...publications, ...(data?.value?.items || [])] as (
            | Post
            | Repost
          )[];
        }
      }

      // if (context?.searchItems?.awardCursor) {
      //   const data = await getAllRewards(10, context?.searchItems?.awardCursor);
      //   if (data?.data?.rewards?.length > 0) {
      //     awards = await handleAwardsData(data?.data?.rewards);
      //   }
      // }

      if (context?.searchItems?.catalogoCursor) {
        catalogos = await manejearCatalogos(
          context?.lensConectado!,
          context?.clienteLens!,
          10,
          context?.searchItems?.catalogoCursor
        );
      }

      const newItems = [
        collections?.map((item) => ({
          post: item,
          type: numberToItemTypeMap[Number(item.origin)],
        })) || [],
        quests?.map((item) => ({
          post: item,
          type: "Kinora",
        })) || [],
        tripleA?.map((item) => ({
          post: item,
          type: "TripleA",
        })) || [],
        awards?.map((item) => ({
          post: item,
          type: "Award",
        })) || [],
        catalogos?.map((item) => ({
          post: item,
          type: "Catalogo",
        })) || [],
        [
          ...(profiles?.map((item) => ({
            post: item,
            type: "Profile",
          })) || []),
          ...(microbrands?.map((item) => ({
            post: item,
            type: "Microbrand",
          })) || []),
        ],
        [...publications]?.map((item) => ({
          post: item,
          type:
            item?.__typename !== "Repost"
              ? (item as Post)?.metadata?.__typename
              : item?.repostOf?.metadata?.__typename,
        })) || [],
      ]?.filter((item) => item?.length > 0) as GeneralPub[][];

      context?.setSearchItems((prev) => ({
        ...prev,
        items: [...prev?.items!, ...mixArrays(newItems)],
        graphCursor: prev?.graphCursor
          ? Number(collections?.length) >= 10
            ? prev?.graphCursor + 10
            : undefined
          : undefined,
        tripleACursor: prev?.tripleACursor
          ? Number(collections?.length) >= 10
            ? prev?.tripleACursor + 10
            : undefined
          : undefined,
        kinoraCursor: prev?.kinoraCursor
          ? Number(quests?.length) >= 10
            ? prev?.kinoraCursor + 10
            : undefined
          : undefined,
        awardCursor: prev?.awardCursor
          ? Number(awards?.length) >= 10
            ? prev?.awardCursor + 10
            : undefined
          : undefined,
        catalogoCursor: prev?.catalogoCursor
          ? Number(catalogos?.length) >= 10
            ? prev?.catalogoCursor + 10
            : undefined
          : undefined,
        lensProfileCursor: profileCursor,
        lensPubCursor: pubCursor,
        videoCursor: videoCursor,
        pubProfileCursor: pubProfileCursor,
        hasMore:
          Number(collections?.length) >= 10 ||
          Number(publications?.length) >= 10 ||
          Number(profiles?.length) >= 10 ||
          pubProfileCursor ||
          videoCursor
            ? true
            : false,
      }));
    } catch (err: any) {
      console.error(err.message);
    }

    context?.setSearchItems((prev) => ({
      ...prev,
      moreSearchLoading: false,
    }));
  };

  const handleShuffleSearch = async () => {
    const newFilters = FILTER_SHUFFLE?.[
      Math.floor(Math.random() * FILTER_SHUFFLE.length)
    ] as Filter;
    context?.setFilters(newFilters);
    await handleSearch(undefined, undefined, false, newFilters);
  };

  useEffect(() => {
    if (context?.searchItems?.moreSearch) {
      handleMoreSearch();
    }
  }, [context?.searchItems?.moreSearch]);

  useEffect(() => {
    if (
      !context?.filtersOpen.value &&
      !filterEmpty(context?.filters!) &&
      LANGS.some((lang) => path === lang) &&
      context?.filtersOpen.allow &&
      (context?.clienteLens || context?.lensConectado?.sessionClient)
    ) {
      handleSearch();
    }
  }, [
    context?.filtersOpen.value,
    context?.filtersOpen.allow,
    context?.clienteLens,
    context?.lensConectado?.sessionClient,
  ]);

  useEffect(() => {
    if (!placeholder) {
      setPlaceholder(
        PLACEHOLDERS[Math.floor(Math.random() * 4)][
          (path.match(/(?<=\/)(en|es)(?=\/)/)?.[0] ?? "en") as "en"
        ]
      );
    }
  }, []);

  return {
    handleSearch,
    handleShuffleSearch,
    placeholder,
  };
};

export default useSearch;
