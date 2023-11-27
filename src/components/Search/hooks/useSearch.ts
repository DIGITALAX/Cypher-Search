import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { setSearchActive } from "../../../../redux/reducers/searchActiveSlice";
import {
  CHROMADIN_ID,
  PLACEHOLDERS,
  TAGS,
  itemStringToNumber,
  numberToItemTypeMap,
  printStringToNumber,
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
} from "../../../../graphql/generated";
import {
  getTextFilterSearch,
  getTextSearch,
} from "../../../../graphql/subgraph/queries/getTextSearch";
import filterEmpty from "../../../../lib/helpers/filterEmpty";
import { setFilter } from "../../../../redux/reducers/filterSlice";
import { DropDown, Filter, FilterValues } from "../types/search.types";
import { setFilterConstants } from "../../../../redux/reducers/filterConstantsSlice";
import fetchIpfsJson from "../../../../lib/helpers/fetchIpfsJson";
import {
  getRandomArrayElement,
  getRandomElement,
  getRandomNumber,
} from "../../../../lib/helpers/randomElements";
import searchPubs from "../../../../graphql/lens/queries/searchPubs";
import searchProfiles from "../../../../graphql/lens/queries/searchProfiles";
import {
  AllSearchItemsState,
  setAllSearchItems,
} from "../../../../redux/reducers/searchItemsSlice";
import { Creation } from "@/components/Tiles/types/tiles.types";
import getMicrobrands from "../../../../graphql/lens/queries/microbrands";
import { getAllCollections } from "../../../../graphql/subgraph/queries/getAllCollections";
import buildQuery from "../../../../lib/helpers/buildQuery";
import { FiltersOpenState } from "../../../../redux/reducers/filtersOpenSlice";
import { Dispatch } from "redux";
import { getFilters } from "../../../../graphql/subgraph/queries/getFilters";
import {
  aggregateMicrobrands,
  aggregateSizes,
  aggregateUniqueValues,
} from "../../../../lib/helpers/aggregators";
import handleCollectionProfilesAndPublications from "../../../../lib/helpers/handleCollectionProfilesAndPublications";
import { NextRouter } from "next/router";
import getPublications from "../../../../graphql/lens/queries/publications";
import { setFilterChange } from "../../../../redux/reducers/filterChangeSlice";
import { getCommunityShort } from "../../../../graphql/subgraph/queries/getCommunities";

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
    random?: boolean,
    backup?: boolean
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
          const searchItems = await getTextSearch(
            allSearchItems?.searchInput!,
            10,
            0
          );

          if (searchItems?.data?.cyphersearch?.length > 0)
            collections = await handleCollectionProfilesAndPublications(
              searchItems?.data?.cyphersearch,
              lensConnected
            );
        } else {
          collections = await filterSearch(0);
        }
        query = allSearchItems?.searchInput;
      } else {
        collections = await filterSearch(0);
        if ((!allSearchItems?.searchInput || random) && !backup) {
          query = filters?.hashtag || filters?.community;
        } else if (backup) {
          query = TAGS?.sort(() => Math.random() - 0.5)?.[0];
        } else {
          query = allSearchItems?.searchInput;
        }
      }

      if (query) {
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

        const profileSearch = await searchProfiles(
          {
            limit: LimitType.Ten,
            query,
          },
          lensConnected?.id
        );

        let moreData: Post[] = [];

        if (
          publications?.length < 10 &&
          profileSearch?.data?.searchProfiles?.items &&
          profileSearch?.data?.searchProfiles?.items?.length > 0
        ) {
          const data = await getPublications(
            {
              limit: LimitType.Ten,
              where: {
                from: profileSearch?.data?.searchProfiles?.items?.map(
                  (item) => item?.id
                ),
                publicationTypes: [PublicationType.Post],
              },
            },
            lensConnected?.id
          );
          moreData = data?.data?.publications?.items as Post[];
          pubProfileCursor = data?.data?.publications?.pageInfo?.next;
        }

        publications = ([
          ...(pubSearch?.data?.searchPublications?.items || []),
          ...moreData,
        ] || []) as (Post | Comment | Mirror | Quote)[];
        profiles = (profileSearch?.data?.searchProfiles?.items ||
          []) as Profile[];
        pubCursor = pubSearch?.data?.searchPublications?.pageInfo?.next;
        profileCursor = profileSearch?.data?.searchProfiles?.pageInfo?.next;
      }

      if (
        filters?.format?.toLowerCase()?.includes("video") ||
        !filters?.format ||
        filters?.format?.trim() == ""
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
        filters?.microbrand &&
        filterConstants?.microbrands &&
        filterConstants?.microbrands?.length > 0
      ) {
        const data = await getMicrobrands(
          {
            where: {
              profileIds: [
                filterConstants?.microbrands?.map((item) => item[3]),
              ],
            },
          },
          lensConnected?.id
        );

        microbrands = (data?.data?.profiles?.items?.map((item, index) => ({
          ...item,
          microbandCover: filterConstants?.microbrands[index][1],
          microbrandName: filterConstants?.microbrands[index][0],
        })) || []) as any;
      }

      const allItems = [
        ...(collections?.map((item) => ({
          post: item,
          type: item.origin,
        })) || []),
        ...[
          ...(profiles?.map((item) => ({
            post: item,
            type: "Profile",
          })) || []),
          ...(microbrands?.map((item) => ({
            post: item,
            type: "Microbrand",
          })) || []),
        ],
        ...(publications?.map((item) => ({
          post: item,
          publishedOn: item?.publishedOn,
          type:
            item?.__typename !== "Mirror"
              ? (item as Post | Comment | Quote)?.metadata?.__typename
              : item?.mirrorOn?.metadata?.__typename,
        })) || []),
      ];

      dispatch(
        setAllSearchItems({
          actionItems: allItems?.sort(() => Math.random() - 0.5),
          actionGraphCursor: collections?.length == 10 ? 10 : undefined,
          actionPubProfileCursor: pubProfileCursor,
          actionLensProfileCursor: profileCursor,
          actionLensPubCursor: pubCursor,
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
    cursor: number
  ): Promise<Creation[] | undefined> => {
    const where = buildQuery(filters);

    let collections;

    try {
      if (allSearchItems?.searchInput.trim() !== "") {
        const searchItems = await getTextFilterSearch(
          allSearchItems?.searchInput!,
          where,
          10,
          cursor
        );
        collections = searchItems?.data?.cyphersearch;
      } else {
        const searchItems = await getAllCollections(where, 10, cursor);
        collections = searchItems?.data?.collectionCreateds;
      }

      if (collections?.length > 0)
        collections = await handleCollectionProfilesAndPublications(
          collections,
          lensConnected
        );

      return collections || [];
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleMoreSearch = async () => {
    if (!allSearchItems?.hasMore) {
      await handleSearch(undefined, undefined, false, true);
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
      profiles: Profile[] | undefined = [],
      publications: (Post | Comment | Quote | Mirror)[] | undefined = [],
      pubCursor: string | undefined,
      pubProfileCursor: string | undefined,
      videoCursor: string | undefined,
      profileCursor: string | undefined,
      microbrands: Profile[] = [];
    try {
      if (filterEmpty(filters) && allSearchItems?.searchInput) {
        if (allSearchItems?.graphCursor) {
          const searchItems = await getTextSearch(
            allSearchItems?.searchInput,
            10,
            allSearchItems?.graphCursor
          );
          if (searchItems?.data?.cyphersearch?.length > 0)
            collections = await handleCollectionProfilesAndPublications(
              searchItems?.data?.cyphersearch,
              lensConnected
            );
        }

        query = allSearchItems?.searchInput;
      } else {
        if (allSearchItems?.graphCursor) {
          collections = await filterSearch(allSearchItems?.graphCursor);
        }
        if (!allSearchItems?.searchInput) {
          query = filters?.hashtag || filters?.community;
        } else {
          query = allSearchItems?.searchInput;
        }
      }

      if (query) {
        if (allSearchItems?.lensPubCursor) {
          const pubSearch = await searchPubs(
            {
              limit: LimitType.Ten,
              query,
              cursor: allSearchItems?.lensPubCursor,
              where: {
                publicationTypes: [SearchPublicationType.Post],
                metadata: {
                  publishedOn: filters?.origin
                    ? filters?.origin
                        ?.split(",")
                        .map((word) => word.trim())
                        .filter((word: string) => word.length > 0)
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

      let moreData: Post[] = [];

      if (publications?.length < 10 && allSearchItems?.pubProfileCursor) {
        const items =
          profiles?.length > 0
            ? profiles
            : (allSearchItems?.items
                ?.filter((item) => item.type === "Profile")
                .map((item) => item.post) as Profile[]);

        const data = await getPublications(
          {
            limit: LimitType.Ten,
            where: {
              from: items?.map((item) => item?.id),
              publicationTypes: [PublicationType.Post],
            },
            cursor: allSearchItems?.pubProfileCursor,
          },
          lensConnected?.id
        );
        moreData = (data?.data?.publications?.items || []) as Post[];
        pubProfileCursor = data?.data?.publications?.pageInfo?.next;
      }

      if (
        (filters?.format?.toLowerCase()?.includes("video") ||
          !filters?.format ||
          filters?.format?.trim() == "") &&
        allSearchItems?.videoCursor
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

      const newItems = [
        ...(collections?.map((item) => ({
          post: item,
          type: numberToItemTypeMap[Number(item.origin)],
        })) || []),
        ...[
          ...(profiles?.map((item) => ({
            post: item,
            type: "Profile",
          })) || []),
          ...(microbrands?.map((item) => ({
            post: item,
            type: "Microbrand",
          })) || []),
        ],
        ...([...publications, ...moreData]?.map((item) => ({
          post: item,
          publishedOn: item?.publishedOn,
          type:
            item?.__typename !== "Mirror"
              ? (item as Post | Comment | Quote)?.metadata?.__typename
              : item?.mirrorOn?.metadata?.__typename,
        })) || []),
      ];

      dispatch(
        setAllSearchItems({
          actionItems: [
            ...allSearchItems?.items!,
            ...newItems?.sort(() => Math.random() - 0.5),
          ],
          actionGraphCursor: allSearchItems?.graphCursor
            ? collections?.length == allSearchItems?.graphCursor + 10
              ? allSearchItems?.graphCursor + 10
              : undefined
            : undefined,
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
      moreSearchLoading: false,
    }));
  };

  const handleShuffleSearch = async () => {
    dispatch(
      setFilter({
        hashtag: getRandomElement(filterConstants?.hashtags!),
        community: getRandomElement(
          filterConstants?.community?.map((item) => item?.[0])!
        ),
        microbrand: getRandomElement(
          filterConstants?.microbrands?.map((item) => item?.[0])!
        ),
        catalog: getRandomElement(filterConstants?.catalog!),
        access: getRandomElement(
          filterConstants?.origin?.map(
            (item) => itemStringToNumber[item?.[0]?.toUpperCase()]
          )!
        ),
        format: getRandomElement(filterConstants?.format!),
        origin: getRandomElement(
          filterConstants?.origin?.map(
            (item) => itemStringToNumber[item?.[0]?.toUpperCase()]
          )!
        ),
        editions: getRandomNumber(1, 10),
        available: true,
        fulfiller: getRandomElement(filterConstants?.fulfiller!),
        drop: getRandomElement(filterConstants?.dropsSuggested!),
        size: {
          apparel: getRandomArrayElement(filterConstants?.sizes?.apparel!),
          poster: getRandomArrayElement(filterConstants?.sizes?.poster!),
          sticker: getRandomArrayElement(filterConstants?.sizes?.sticker!),
        },
        color: getRandomArrayElement(filterConstants?.colors!),
        price: {
          min: getRandomNumber(1, 100),
          max: getRandomNumber(50, 500),
        },
        token: getRandomElement(filterConstants?.token!),
        printType: getRandomArrayElement(
          ["sticker", "hoodie", "sleeve", "crop", "shirt", "poster"]?.map(
            (item) => printStringToNumber[item.toUpperCase()]
          )
        ),
      })
    );

    await handleSearch(undefined, undefined, true);
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
        colors: string[];
        sizes: {
          poster: string[];
          sticker: string[];
          apparel: string[];
        };
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
          "drop"
        ),
        hashtags: aggregateUniqueValues(data?.data?.collectionCreateds, "tags"),
        colors: aggregateUniqueValues(data?.data?.collectionCreateds, "colors"),
        sizes: aggregateSizes(data?.data?.collectionCreateds),
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
        "QmR5RwqvyMvRbkGr4zFizeSoBp6SoBFjyyskq2u6c7dMKA"
      )) as any;

      const data = await getFilterValues();
      const filters: FilterValues = {
        ...json,
        microbrands: data?.microbrands!,
        hashtags: [...(data?.hashtags! || []), ...TAGS]?.sort(
          () => Math.random() - 0.5
        ),
        dropsSuggested: data?.dropsSuggested!,
        colors: data?.colors!,
        sizes: data?.sizes!,
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
  }, []);

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
