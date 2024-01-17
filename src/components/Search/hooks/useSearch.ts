import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { setSearchActive } from "../../../../redux/reducers/searchActiveSlice";
import {
  CHROMADIN_ID,
  FILTER_SHUFFLE,
  PLACEHOLDERS,
  REFINED_TAGS,
  TAGS,
  numberToItemTypeMap,
} from "../../../../lib/constants";
import {
  LimitType,
  Post,
  Profile,
  PublicationMetadataMainFocusType,
  Comment,
  Quote,
  Mirror,
  SearchPublicationType,
  PublicationType,
  PublicationsWhere,
} from "../../../../graphql/generated";
import filterEmpty from "../../../../lib/helpers/filterEmpty";
import { setFilter } from "../../../../redux/reducers/filterSlice";
import { DropDown, Filter, FilterValues, Quest } from "../types/search.types";
import { setFilterConstants } from "../../../../redux/reducers/filterConstantsSlice";
import fetchIpfsJson from "../../../../lib/helpers/fetchIpfsJson";
import { getRandomElement } from "../../../../lib/helpers/randomElements";
import searchPubs from "../../../../graphql/lens/queries/searchPubs";
import searchProfiles from "../../../../graphql/lens/queries/searchProfiles";
import {
  AllSearchItemsState,
  setAllSearchItems,
} from "../../../../redux/reducers/searchItemsSlice";
import { Award, Creation, Publication } from "./../../Tiles/types/tiles.types";
import getMicrobrands from "../../../../graphql/lens/queries/microbrands";
import { getAllCollections } from "../../../../graphql/subgraph/queries/getAllCollections";
import { buildQuery } from "../../../../lib/helpers/buildQuery";
import {
  FiltersOpenState,
  setFiltersOpen,
} from "../../../../redux/reducers/filtersOpenSlice";
import { Dispatch } from "redux";
import { getFilters } from "../../../../graphql/subgraph/queries/getFilters";
import {
  aggregateMicrobrands,
  aggregateUniqueValues,
} from "../../../../lib/helpers/aggregators";
import handleCollectionProfilesAndPublications from "../../../../lib/helpers/handleCollectionProfilesAndPublications";
import { NextRouter } from "next/router";
import getPublications from "../../../../graphql/lens/queries/publications";
import { setFilterChange } from "../../../../redux/reducers/filterChangeSlice";
import { getCommunityShort } from "../../../../graphql/subgraph/queries/getCommunities";
import toHexWithLeadingZero from "../../../../lib/helpers/leadingZero";
import buildTextQuery, {
  buildKinoraProfileIds,
  buildKinoraTextQuery,
  combineQueryObjects,
} from "../../../../lib/helpers/buildTextQuery";
import mixArrays from "../../../../lib/helpers/mixArrays";
import {
  getPlayers,
  getQuestByProfile,
  getQuests,
  getQuestsWhere,
} from "../../../../graphql/subgraph/queries/getQuests";
import handleQuestData from "../../../../lib/helpers/handleQuestData";
import { getAllRewards } from "../../../../graphql/subgraph/queries/getAllRewards";
import handleAwardsData from "../../../../lib/helpers/handleAwardsData";

const useSearch = (
  filtersOpen: FiltersOpenState,
  lensConnected: Profile | undefined,
  searchActive: boolean,
  filterConstants: FilterValues | undefined,
  filters: Filter,
  allSearchItems: AllSearchItemsState | undefined,
  dispatch: Dispatch,
  router: NextRouter
) => {
  const [loaders, setLoaders] = useState<{
    searchLoading: boolean;
    moreSearchLoading: boolean;
  }>({
    searchLoading: false,
    moreSearchLoading: false,
  });
  const [placeholderText, setPlaceholderText] = useState<string>();
  const [filteredDropDownValues, setFilteredDropDownValues] = useState<
    FilterValues | undefined
  >(filterConstants);
  const [openDropDown, setOpenDropDown] = useState<DropDown>({
    hashtag: false,
    community: false,
    microbrand: false,
    catalog: false,
    access: false,
    format: false,
    origin: false,
    size: false,
    price: false,
    token: false,
    fulfiller: false,
  });

  const handleSearch = async (
    e?: KeyboardEvent | MouseEvent,
    click?: boolean,
    backup?: boolean,
    random?: Filter
  ) => {
    setLoaders((prev) => ({
      ...prev,
      searchLoading: true,
    }));
    if (router?.asPath !== "/") {
      await router.push("/");
    }
    if (!searchActive) {
      dispatch(setSearchActive(true));
    }
    let query: string | undefined,
      collections: Creation[] | undefined = [],
      quests: Quest[] | undefined = [],
      awards: Award[] | undefined = [],
      profiles: Profile[] | undefined = [],
      publications: (Post | Comment | Quote | Mirror)[] | undefined = [],
      pubCursor: string | undefined,
      profileCursor: string | undefined,
      pubProfileCursor: string | undefined,
      videoCursor: string | undefined,
      microbrands: Profile[] = [];
    try {
      if (
        ((e as KeyboardEvent)?.key === "Enter" &&
          allSearchItems?.searchInput.trim() !== "" &&
          !click) ||
        (click && allSearchItems?.searchInput.trim() !== "")
      ) {
        if (filterEmpty(filters) && !backup) {
          const where = buildTextQuery(
            allSearchItems?.searchInput?.replaceAll("@", "")!
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
                lensConnected
              );
          }

          const kinoraWhere = buildKinoraTextQuery(
            allSearchItems?.searchInput?.replaceAll("@", "")!
          );

          if (kinoraWhere) {
            const kinoraItems = await getQuestsWhere(kinoraWhere, 10, 0);

            if (kinoraItems?.data?.questInstantiateds?.length > 0)
              quests = await handleQuestData(
                kinoraItems?.data?.questInstantiateds,
                lensConnected
              );
          }
        } else {
          const data = await filterSearch(
            0,
            0,
            query?.replaceAll("@", "") || ""
          );

          quests = data?.quests;
          collections = data?.collections;
        }
        query = allSearchItems?.searchInput?.replaceAll("@", "");
      } else {
        const data = await filterSearch(
          0,
          undefined,
          query?.replaceAll("@", "") || "",
          random
        );

        quests = data?.quests;
        collections = data?.collections;
        if (!allSearchItems?.searchInput && backup) {
          query = REFINED_TAGS?.sort(() => Math.random() - 0.5)?.[0];
        } else {
          query = allSearchItems?.searchInput?.replaceAll("@", "");
        }
      }

      if (query) {
        const profileSearch = await searchProfiles(
          {
            limit: LimitType.Ten,
            query,
          },
          lensConnected?.id
        );

        profiles = (profileSearch?.data?.searchProfiles?.items ||
          []) as Profile[];
        profileCursor = profileSearch?.data?.searchProfiles?.pageInfo?.next;

        if (
          (!filters?.microbrand || filters?.microbrand == "") &&
          (!collections || collections?.length < 1)
        ) {
          const pubSearch = await searchPubs(
            {
              limit: LimitType.Ten,
              query,
              where: {
                publicationTypes: [SearchPublicationType.Post],
                metadata: {
                  publishedOn: filters?.origin
                    ? filters?.origin
                        ?.split(",")
                        .map((word) => word.trim())
                        .filter((word: string) => word.length > 0)
                    : undefined,
                  tags: filters?.hashtag
                    ? {
                        oneOf: filters?.hashtag
                          ?.split(",")
                          .map((word) => word.trim())
                          .filter((word: string) => word.length > 0),
                      }
                    : undefined,
                  mainContentFocus: filters?.format
                    ? (filters?.format
                        ?.split(",")
                        .map((word) => word.trim())
                        .filter(
                          (word: string) => word.length > 0
                        ) as PublicationMetadataMainFocusType[])
                    : undefined,
                },
              },
            },
            lensConnected?.id
          );

          publications = ([
            ...(pubSearch?.data?.searchPublications?.items || []),
          ] || []) as (Post | Comment | Mirror | Quote)[];
          pubCursor = pubSearch?.data?.searchPublications?.pageInfo?.next;
        }
      }

      if (publications?.length < 1) {
        let where: PublicationsWhere = {
          publicationTypes: [PublicationType.Post],
        };

        if (
          filters?.microbrand &&
          filters?.microbrand?.trim() !== "" &&
          filterConstants?.microbrands
        ) {
          where = {
            ...where,
            from: filterConstants?.microbrands
              ?.filter((item) =>
                filters?.microbrand
                  ?.split(",")
                  .map((word) => word.trim())
                  ?.map((item) => item?.toLowerCase())
                  ?.includes(item?.[0]?.toLowerCase())
              )
              ?.map((item) => `${toHexWithLeadingZero(Number(item[2]))}`),
          };
        } else if (collections && collections?.length > 0) {
          where = {
            ...where,
            from: Array.from(
              new Set(
                collections?.map(
                  (item) => `${toHexWithLeadingZero(Number(item.profileId))}`
                )
              )
            ),
          };
        }

        if (where.from && where.from?.length > 0) {
          const data = await getPublications(
            {
              limit: LimitType.Ten,
              where,
            },
            lensConnected?.id
          );

          publications = ([...(data?.data?.publications?.items || [])] ||
            []) as (Post | Comment | Mirror | Quote)[];
          pubProfileCursor = data?.data?.publications?.pageInfo?.next;
        }
      }

      if (
        ((filters?.format?.toLowerCase()?.includes("video") ||
          publications?.length + profiles?.length < 10) &&
          publications?.filter(
            (item) =>
              (item as Post)?.metadata?.__typename == "VideoMetadataV3" ||
              item?.by?.id?.toLowerCase() == CHROMADIN_ID?.toLowerCase()
          )?.length < 10 &&
          query?.trim() == "") ||
        query?.toLowerCase()?.includes("chromadin")
      ) {
        const data = await getPublications(
          {
            limit: LimitType.Ten,
            where: {
              publicationTypes: [PublicationType.Post],
              from: [CHROMADIN_ID],
            },
          },
          lensConnected?.id
        );

        videoCursor = data?.data?.publications?.pageInfo?.next;

        publications = [
          ...publications,
          ...(data?.data?.publications?.items || []),
        ] as (Post | Comment | Quote | Mirror)[];
      }

      if (
        (quests || [])?.length < 1 &&
        filters?.origin?.toLowerCase()?.includes("kinora")
      ) {
        const kinoraItems = await getQuests(10, 0);
        if (kinoraItems?.data?.questInstantiateds?.length > 0)
          quests = await handleQuestData(
            kinoraItems?.data?.questInstantiateds,
            lensConnected
          );
      }

      if (
        filters?.origin?.toLowerCase()?.includes("kinora") ||
        query?.toLowerCase()?.includes("kinora") ||
        query?.toLowerCase()?.includes("quest")
      ) {
        const data = await getAllRewards(10, 0);
        if (data?.data?.rewards?.length > 0) {
          awards = await handleAwardsData(data?.data?.rewards);
        }
      }

      if (
        ((filters?.microbrand?.trim() !== "" && filters?.microbrand) ||
          (query &&
            filterConstants?.microbrands?.filter((item) =>
              item?.[0]?.toLowerCase()?.includes(query?.toLowerCase() || "")
            )?.length &&
            filterConstants?.microbrands?.filter((item) =>
              item?.[0]?.toLowerCase()?.includes(query?.toLowerCase() || "")
            )?.length > 0)) &&
        filterConstants?.microbrands &&
        filterConstants?.microbrands?.length > 0
      ) {
        if ((quests || [])?.length < 1) {
          const where = buildKinoraProfileIds(
            filters?.microbrand?.trim() !== "" && filters?.microbrand
              ? filterConstants?.microbrands
                  ?.filter((item) =>
                    filters?.microbrand
                      ?.split(",")
                      .map((word) => word.trim())
                      ?.map((item) => item?.toLowerCase())
                      ?.includes(item?.[0]?.toLowerCase())
                  )
                  ?.map((item) => `${toHexWithLeadingZero(Number(item[2]))}`)
              : filterConstants?.microbrands
                  ?.filter((item) =>
                    item?.[0]?.toLowerCase()?.includes(query!?.toLowerCase())
                  )
                  ?.map((item) => `${toHexWithLeadingZero(Number(item[2]))}`)
          );
          if (where) {
            const kinoraItems = await getQuestByProfile(where, 10, 0);
            if (kinoraItems?.data?.questInstantiateds?.length > 0) {
              quests = await handleQuestData(
                kinoraItems?.data?.questInstantiateds,
                lensConnected
              );
            }
          }
        }

        const data = await getMicrobrands(
          {
            where: {
              profileIds:
                filters?.microbrand?.trim() !== "" && filters?.microbrand
                  ? filterConstants?.microbrands
                      ?.filter((item) =>
                        filters?.microbrand
                          ?.split(",")
                          .map((word) => word.trim())
                          ?.map((item) => item?.toLowerCase())
                          ?.includes(item?.[0]?.toLowerCase())
                      )
                      ?.map(
                        (item) => `${toHexWithLeadingZero(Number(item[2]))}`
                      )
                  : filterConstants?.microbrands
                      ?.filter((item) =>
                        item?.[0]
                          ?.toLowerCase()
                          ?.includes(query!?.toLowerCase())
                      )
                      ?.map(
                        (item) => `${toHexWithLeadingZero(Number(item[2]))}`
                      ),
            },
          },
          lensConnected?.id
        );

        microbrands = (data?.data?.profiles?.items?.map((item) => {
          const index = filterConstants?.microbrands?.findIndex(
            (micro) =>
              micro?.[2]?.toLowerCase() ==
              parseInt(item?.id?.toLowerCase(), 16).toString()
          );
          return {
            ...item,
            microbandCover: filterConstants?.microbrands[index][1],
            microbrandName: filterConstants?.microbrands[index][0],
          };
        }) || []) as any;
      }

      const allItems = [
        collections?.map((item) => ({
          post: item,
          type: numberToItemTypeMap[Number(item.origin)],
        })) || [],
        quests?.map((item) => ({
          post: item,
          type: "Kinora",
        })) || [],
        awards?.map((item) => ({
          post: item,
          type: "Award",
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
          publishedOn: item?.publishedOn,
          type:
            item?.__typename !== "Mirror"
              ? (item as Post | Comment | Quote)?.metadata?.__typename
              : item?.mirrorOn?.metadata?.__typename,
        })) || [],
      ] as Publication[][];

      dispatch(
        setAllSearchItems({
          actionItems: backup
            ? [...(allSearchItems?.items || []), ...mixArrays(allItems)]
            : mixArrays(allItems),
          actionGraphCursor: collections?.length == 10 ? 10 : undefined,
          actionKinoraCursor: quests?.length == 10 ? 10 : undefined,
          actionAwardCursor: awards?.length == 10 ? 10 : undefined,
          actionLensProfileCursor: profileCursor,
          actionLensPubCursor: pubCursor,
          actionPubProfileCursor: pubProfileCursor,
          actionVideoCursor: videoCursor,
          actionHasMore:
            collections?.length == 10 ||
            publications?.length >= 10 ||
            profiles?.length == 10 ||
            pubProfileCursor ||
            videoCursor
              ? true
              : false,
          actionInput: allSearchItems?.searchInput,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setLoaders((prev) => ({
      ...prev,
      searchLoading: false,
    }));
  };

  const filterSearch = async (
    cursor: number | undefined,
    kinoraCursor: number | undefined,
    query: string,
    newFilters?: Filter
  ): Promise<
    | {
        collections: Creation[];
        quests: Quest[];
      }
    | undefined
  > => {
    const where = buildQuery(newFilters ? newFilters : filters);
    let collections, quests;

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
              "owner",
              "collectionMetadata_title",
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

      if (kinoraCursor !== undefined) {
        const kinoraItems = await getQuests(10, kinoraCursor);
        if (kinoraItems?.data?.questInstantiateds?.length > 0)
          quests = await handleQuestData(
            kinoraItems?.data?.questInstantiateds,
            lensConnected
          );
      }

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
            community,
            ...rest
          } = filters;
          where = buildQuery({
            ...rest,
            format: "",
            origin: "",
            community: "",
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
            "owner",
            "collectionMetadata_title",
          ][Math.floor(Math.random() * 2)]
        );
        collections = searchItems?.data?.collectionCreateds;
      }

      if (collections?.length > 0) {
        collections = await handleCollectionProfilesAndPublications(
          collections,
          lensConnected
        );
      }

      return { collections: collections || [], quests: quests || [] };
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleMoreSearch = async () => {
    if (!allSearchItems?.hasMore) {
      await handleSearch(undefined, undefined, true);
      return;
    }

    setLoaders((prev) => ({
      ...prev,
      moreSearchLoading: true,
    }));
    if (!searchActive) {
      dispatch(setSearchActive(true));
    }
    let query: string,
      collections: Creation[] | undefined = [],
      quests: Quest[] | undefined = [],
      awards: Award[] | undefined = [],
      profiles: Profile[] | undefined = [],
      publications: (Post | Comment | Quote | Mirror)[] | undefined = [],
      pubProfileCursor: string | undefined,
      pubCursor: string | undefined,
      videoCursor: string | undefined,
      profileCursor: string | undefined,
      microbrands: Profile[] = [];
    try {
      if (filterEmpty(filters) && allSearchItems?.searchInput) {
        if (allSearchItems?.graphCursor) {
          const where = buildTextQuery(
            allSearchItems?.searchInput?.replaceAll("@", "")!
          );
          if (where) {
            const searchItems = await getAllCollections(
              where,
              10,
              allSearchItems?.graphCursor,
              "desc",
              "blockTimestamp"
            );

            if (searchItems?.data?.collectionCreateds?.length > 0)
              collections = await handleCollectionProfilesAndPublications(
                searchItems?.data?.collectionCreateds,
                lensConnected
              );
          }
        }

        query = allSearchItems?.searchInput?.replaceAll("@", "");
      } else {
        if (allSearchItems?.graphCursor || allSearchItems?.kinoraCursor) {
          const data = await filterSearch(
            allSearchItems?.graphCursor,
            allSearchItems?.kinoraCursor,
            allSearchItems?.searchInput || ""
          );

          collections = data?.collections;
          quests = data?.quests;
        }

        query = allSearchItems?.searchInput?.replaceAll("@", "");
      }

      if (query) {
        if (
          allSearchItems?.lensPubCursor &&
          (!filters?.microbrand || filters?.microbrand?.trim() == "") &&
          (!collections || collections?.length < 1)
        ) {
          const pubSearch = await searchPubs(
            {
              limit: LimitType.Ten,
              query,
              cursor: allSearchItems?.lensPubCursor,
              where: {
                publicationTypes: [SearchPublicationType.Post],
                metadata: {
                  publishedOn: filters?.origin
                    ? [
                        ...filters?.origin
                          ?.split(",")
                          .map((word) => word.trim())
                          .filter((word: string) => word.length > 0),
                        "cyphersearch",
                      ]
                    : [
                        "chromadin",
                        "legend",
                        "kinora",
                        "cyphersearch",
                        "litlistener",
                      ],
                  tags: filters?.hashtag
                    ? {
                        oneOf: filters?.hashtag
                          ?.split(",")
                          .map((word) => word.trim())
                          .filter((word: string) => word.length > 0),
                      }
                    : undefined,
                  mainContentFocus: filters?.format
                    ? (filters?.format
                        ?.split(",")
                        .map((word) => word.trim())
                        .filter(
                          (word: string) => word.length > 0
                        ) as PublicationMetadataMainFocusType[])
                    : undefined,
                },
              },
            },
            lensConnected?.id
          );
          publications = (pubSearch?.data?.searchPublications?.items || []) as (
            | Post
            | Comment
            | Mirror
            | Quote
          )[];
          pubCursor = pubSearch?.data?.searchPublications?.pageInfo?.next;
        }

        if (allSearchItems?.lensProfileCursor) {
          const profileSearch = await searchProfiles(
            {
              cursor: allSearchItems?.lensProfileCursor,
              limit: LimitType.Ten,
              query,
            },
            lensConnected?.id
          );

          profiles = (profileSearch?.data?.searchProfiles?.items ||
            []) as Profile[];
          profileCursor = profileSearch?.data?.searchProfiles?.pageInfo?.next;
        }
      }

      if (
        (filters?.microbrand?.trim() !== "" && filters?.microbrand) ||
        (collections && collections?.length > 0) ||
        allSearchItems?.items?.filter(
          (item) =>
            (item.post as Creation)?.amount &&
            Number((item.post as Creation)?.amount) > 0
        )?.length > 0
      ) {
        let where: PublicationsWhere = {
          publicationTypes: [PublicationType.Post],
        };

        if (filters?.microbrand?.trim() !== "" && filters?.microbrand) {
          where = {
            ...where,
            from: filterConstants?.microbrands
              ?.filter((item) =>
                filters?.microbrand
                  ?.split(",")
                  .map((word) => word.trim())
                  ?.map((item) => item?.toLowerCase())
                  ?.includes(item?.[0]?.toLowerCase())
              )
              ?.map((item) => `${toHexWithLeadingZero(Number(item[2]))}`),
          };
        } else if (
          (collections && collections?.length > 0) ||
          allSearchItems?.items?.filter(
            (item) =>
              (item.post as Creation)?.amount &&
              Number((item.post as Creation)?.amount) > 0
          )?.length > 0
        ) {
          where = {
            ...where,
            from:
              collections && collections?.length > 0
                ? Array.from(
                    new Set(
                      collections?.map(
                        (item) =>
                          `${toHexWithLeadingZero(Number(item.profileId))}`
                      )
                    )
                  )
                : (
                    allSearchItems?.items?.filter(
                      (item) =>
                        (item.post as Creation)?.amount &&
                        Number((item.post as Creation)?.amount) > 0
                    ) as Publication[]
                  )?.map(
                    (item: Publication) =>
                      `${toHexWithLeadingZero(
                        Number((item?.post as Creation)?.profileId)
                      )}`
                  ),
          };
        }

        const data = await getPublications(
          {
            limit: LimitType.Ten,
            where,
            cursor: allSearchItems?.pubProfileCursor,
          },
          lensConnected?.id
        );
        publications = (data?.data?.publications?.items || []) as Post[];
        pubProfileCursor = data?.data?.publications?.pageInfo?.next;
      }

      if (
        ((filters?.format?.toLowerCase()?.includes("video") ||
          publications?.length + profiles?.length < 10) &&
          allSearchItems?.videoCursor &&
          publications?.filter(
            (item) => (item as Post)?.metadata?.__typename == "VideoMetadataV3"
          )?.length < 10) ||
        query?.toLowerCase()?.includes("chromadin")
      ) {
        const data = await getPublications(
          {
            limit: LimitType.Ten,
            where: {
              publicationTypes: [PublicationType.Post],
              from: [CHROMADIN_ID],
            },
            cursor: allSearchItems?.videoCursor,
          },
          lensConnected?.id
        );

        videoCursor = data?.data?.publications?.pageInfo?.next;

        publications = [
          ...publications,
          ...(data?.data?.publications?.items || []),
        ] as (Post | Comment | Quote | Mirror)[];
      }

      if (allSearchItems?.awardCursor) {
        const data = await getAllRewards(10, allSearchItems?.awardCursor);
        if (data?.data?.rewards?.length > 0) {
          awards = await handleAwardsData(data?.data?.rewards);
        }
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
        awards?.map((item) => ({
          post: item,
          type: "Award",
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
          publishedOn: item?.publishedOn,
          type:
            item?.__typename !== "Mirror"
              ? (item as Post | Comment | Quote)?.metadata?.__typename
              : item?.mirrorOn?.metadata?.__typename,
        })) || [],
      ] as Publication[][];
      dispatch(
        setAllSearchItems({
          actionItems: [...allSearchItems?.items!, ...mixArrays(newItems)],
          actionGraphCursor: allSearchItems?.graphCursor
            ? collections?.length == 10
              ? allSearchItems?.graphCursor + 10
              : undefined
            : undefined,
          actionKinoraCursor: allSearchItems?.kinoraCursor
            ? quests?.length == 10
              ? allSearchItems?.kinoraCursor + 10
              : undefined
            : undefined,
          actionAwardCursor: allSearchItems?.awardCursor
            ? awards?.length == 10
              ? allSearchItems?.awardCursor + 10
              : undefined
            : undefined,
          actionLensProfileCursor: profileCursor,
          actionLensPubCursor: pubCursor,
          actionVideoCursor: videoCursor,
          actionPubProfileCursor: pubProfileCursor,
          actionHasMore:
            collections?.length == 10 ||
            publications?.length >= 10 ||
            profiles?.length == 10 ||
            pubProfileCursor ||
            videoCursor
              ? true
              : false,
          actionInput: allSearchItems?.searchInput,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setLoaders((prev) => ({
      ...prev,
      moreSearchLoading: false,
    }));
  };

  const handleShuffleSearch = async () => {
    const newFilters = FILTER_SHUFFLE?.[
      Math.floor(Math.random() * FILTER_SHUFFLE.length)
    ] as Filter;
    dispatch(setFilter(newFilters));

    await handleSearch(undefined, undefined, false, newFilters);
  };

  const handleResetFilters = () => {
    dispatch(
      setFilter({
        hashtag: "",
        community: "",
        microbrand: "",
        catalog: "",
        access: "",
        format: "",
        origin: "",
        editions: 1,
        available: true,
        fulfiller: "",
        drop: "",
        size: {
          apparel: [],
          poster: [],
          sticker: [],
        },
        color: [],
        price: {
          min: 0,
          max: 500,
        },
        token: "",
        printType: [],
      })
    );

    dispatch(setFilterChange(true));

    setOpenDropDown({
      hashtag: false,
      community: false,
      microbrand: false,
      catalog: false,
      access: false,
      format: false,
      origin: false,
      size: false,
      price: false,
      token: false,
      fulfiller: false,
    });
  };

  const getFilterValues = async (): Promise<
    | {
        microbrands: string[][];
        dropsSuggested: string[];
        hashtags: string[];
        communities: string[][];
      }
    | undefined
  > => {
    try {
      const data = await getFilters();
      const community = await getCommunityShort();

      return {
        microbrands: aggregateMicrobrands(data?.data?.collectionCreateds),
        dropsSuggested: aggregateUniqueValues(
          data?.data?.collectionCreateds,
          "dropTitle"
        ),
        hashtags: aggregateUniqueValues(
          [...data?.data?.collectionCreateds, ...TAGS],
          "tags"
        ),
        communities: community?.data?.communityCreateds?.map?.(
          (item: { name: string; cover: string; communityId: string }) => {
            return [item.name, item.cover, item.communityId];
          }
        ),
      };
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleFilterConstants = async () => {
    try {
      const json: FilterValues = (await fetchIpfsJson(
        "QmX7bVukD1ZYxsV8i4UE5EygvczT1FfD1nDPZpHkyXEBFK"
      )) as any;

      const data = await getFilterValues();
      const filters: FilterValues = {
        ...json,
        microbrands: data?.microbrands!,
        hashtags: (data?.hashtags! || [])?.sort(() => Math.random() - 0.5),
        dropsSuggested: data?.dropsSuggested!,
        community: data?.communities!,
      };

      dispatch(setFilterConstants(filters));
      setFilteredDropDownValues(filters);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    setPlaceholderText(PLACEHOLDERS[Math.floor(Math.random() * 4)]);
  }, []);

  useEffect(() => {
    if (!filterConstants) {
      handleFilterConstants();
    }
  }, [filterConstants]);

  useEffect(() => {
    if (
      !filtersOpen.value &&
      !filterEmpty(filters) &&
      router?.asPath === "/" &&
      filtersOpen.allow
    ) {
      handleSearch();
    }
  }, [filtersOpen.value, filtersOpen.allow]);

  return {
    handleSearch,
    handleMoreSearch,
    handleShuffleSearch,
    openDropDown,
    setOpenDropDown,
    placeholderText,
    filteredDropDownValues,
    setFilteredDropDownValues,
    handleResetFilters,
    loaders,
  };
};

export default useSearch;
