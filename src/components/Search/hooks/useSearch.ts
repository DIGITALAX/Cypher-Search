import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useState,
} from "react";
import { setSearchActive } from "../../../../redux/reducers/searchActiveSlice";
import {
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
import getPublications from "../../../../graphql/lens/queries/publications";
import { getFilters } from "../../../../graphql/subgraph/queries/getFilters";
import {
  aggregateMicrobrands,
  aggregateSizes,
  aggregateUniqueValues,
} from "../../../../lib/helpers/aggregators";
import { getCommunityShort } from "../../../../graphql/subgraph/queries/getCommunities";

const useSearch = (
  filtersOpen: FiltersOpenState,
  lensConnected: Profile | undefined,
  searchActive: boolean,
  filterConstants: FilterValues | undefined,
  filters: Filter,
  allSearchItems: AllSearchItemsState,
  dispatch: Dispatch
) => {
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
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
  const [volume, setVolume] = useState<number[]>([]);
  const [volumeOpen, setVolumeOpen] = useState<boolean[]>([]);
  const [heart, setHeart] = useState<boolean[]>([]);

  const handleSearch = async (
    e?: KeyboardEvent | MouseEvent,
    click?: boolean
  ) => {
    setSearchLoading(true);
    if (!searchActive) {
      dispatch(setSearchActive(true));
    }
    let query: string | undefined,
      collections: Creation[] | undefined = [],
      profiles: Profile[] | undefined = [],
      publications: (Post | Comment | Quote | Mirror)[] | undefined = [],
      pubCursor: string | undefined,
      profileCursor: string | undefined,
      microbrands: Profile[] = [];
    try {
      if (
        ((e as KeyboardEvent).key === "Enter" &&
          searchInput.trim() !== "" &&
          !click) ||
        (click && searchInput.trim() !== "")
      ) {
        if (filterEmpty(filters)) {
          const searchItems = await getTextSearch(searchInput, 25, 0);

          if (searchItems?.data.cyphersearch?.length > 0)
            collections = await handleCollectionProfilesAndPublications(
              searchItems?.data.cyphersearch
            );
        } else {
          collections = await filterSearch(0);
        }
        query = searchInput;
      }
      {
        collections = await filterSearch(0);
        if (!searchInput) {
          query = filters?.hashtag || filters?.community;
        } else {
          query = searchInput;
        }
      }

      if (query) {
        const pubSearch = await searchPubs({
          limit: LimitType.TwentyFive,
          query: searchInput,
          where: {
            metadata: {
              publishedOn: filters?.origin
                ? filters?.origin?.split(",").map((word) => word.trim())
                : [
                    "chromadin",
                    "legend",
                    "kinora",
                    "litlistener",
                    "cyphersearch",
                  ],
              tags: filters?.hashtag
                ? {
                    oneOf: filters?.hashtag
                      ?.split(",")
                      .map((word) => word.trim()),
                  }
                : undefined,
              mainContentFocus: filters?.format
                ? (filters?.format
                    ?.split(",")
                    .map((word) =>
                      word.trim()
                    ) as PublicationMetadataMainFocusType[])
                : undefined,
            },
          },
        });

        const profileSearch = await searchProfiles({
          limit: LimitType.TwentyFive,
          query: searchInput,
        });

        publications = (pubSearch?.data?.searchPublications?.items || []) as (
          | Post
          | Comment
          | Mirror
          | Quote
        )[];
        profiles = (profileSearch?.data?.searchProfiles?.items ||
          []) as Profile[];
        pubCursor = pubSearch?.data?.searchPublications?.pageInfo?.next;
        profileCursor = profileSearch?.data?.searchProfiles?.pageInfo?.next;
      }

      if (filters?.microbrand) {
        const data = await getMicrobrands({
          where: {
            profileIds: [filterConstants?.microbrands?.map((item) => item[2])],
          },
        });

        microbrands = (data?.data?.profiles?.items?.map((item, index) => ({
          ...item,
          microbandCover: filterConstants?.microbrands[index][1],
          microbrandName: filterConstants?.microbrands[index][0],
        })) || []) as any;
      }

      dispatch(
        setAllSearchItems({
          actionItems: [
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
          ]?.sort(() => Math.random() - 0.5),
          actionGraphCursor: collections?.length == 25 ? 25 : undefined,
          actionLensProfileCursor:
            profiles?.length == 25 ? profileCursor : undefined,
          actionLensPubCursor:
            publications?.length == 25 ? pubCursor : undefined,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setSearchLoading(false);
  };

  const filterSearch = async (
    cursor: number
  ): Promise<Creation[] | undefined> => {
    const where = buildQuery(filters);

    let collections;

    try {
      if (searchInput.trim() !== "") {
        const searchItems = await getTextFilterSearch(
          searchInput,
          where,
          25,
          cursor
        );
        collections = searchItems?.data?.cyphersearch;
      } else {
        const searchItems = await getAllCollections(where, 25, cursor);
        collections = searchItems?.data?.collectionCreateds;
      }

      if (collections?.length > 0)
        collections = await handleCollectionProfilesAndPublications(
          collections
        );

      return collections || [];
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleMoreSearch = async () => {
    setSearchLoading(true);
    if (!searchActive) {
      dispatch(setSearchActive(true));
    }
    let query: string,
      collections: Creation[] | undefined = [],
      profiles: Profile[] | undefined = [],
      publications: (Post | Comment | Quote | Mirror)[] | undefined = [],
      pubCursor: string | undefined,
      profileCursor: string | undefined;
    try {
      if (filterEmpty(filters) && searchInput) {
        if (allSearchItems?.graphCursor) {
          const searchItems = await getTextSearch(
            searchInput,
            25,
            allSearchItems?.graphCursor
          );
          if (searchItems?.data.cyphersearch?.length > 0)
            collections = await handleCollectionProfilesAndPublications(
              searchItems?.data.cyphersearch
            );
        }

        query = searchInput;
      } else {
        if (allSearchItems?.graphCursor) {
          collections = await filterSearch(allSearchItems?.graphCursor);
        }
        if (!searchInput) {
          query = filters?.hashtag || filters?.community;
        } else {
          query = searchInput;
        }
      }

      if (query) {
        if (allSearchItems?.lensPubCursor) {
          const pubSearch = await searchPubs({
            limit: LimitType.TwentyFive,
            query: searchInput,
            cursor: allSearchItems?.lensPubCursor,
            where: {
              metadata: {
                publishedOn: filters?.origin
                  ? filters?.origin?.split(",").map((word) => word.trim())
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
                        .map((word) => word.trim()),
                    }
                  : undefined,
                mainContentFocus: filters?.format
                  ? (filters?.format
                      ?.split(",")
                      .map((word) =>
                        word.trim()
                      ) as PublicationMetadataMainFocusType[])
                  : undefined,
              },
            },
          });
          publications = (pubSearch?.data?.searchPublications?.items || []) as (
            | Post
            | Comment
            | Mirror
            | Quote
          )[];
          pubCursor = pubSearch?.data?.searchPublications?.pageInfo?.next;
        }

        if (allSearchItems?.lensProfileCursor) {
          const profileSearch = await searchProfiles({
            limit: LimitType.TwentyFive,
            query: searchInput,
          });

          profiles = (profileSearch?.data?.searchProfiles?.items ||
            []) as Profile[];

          profileCursor = profileSearch?.data?.searchProfiles?.pageInfo?.next;
        }
      }

      dispatch(
        setAllSearchItems({
          actionItems: [
            ...(collections?.map((item) => ({
              post: item,
              type: item.origin,
            })) || []),
            ...(profiles?.map((item) => ({
              post: item,
              type: "Profile",
            })) || []),
            ...(publications?.map((item) => ({
              post: item,
              publishedOn: item?.publishedOn,
              type:
                item?.__typename !== "Mirror"
                  ? (item as Post | Comment | Quote)?.metadata?.__typename
                  : item?.mirrorOn?.metadata?.__typename,
            })) || []),
          ]?.sort(() => Math.random() - 0.5),
          actionGraphCursor: allSearchItems?.graphCursor
            ? collections?.length == allSearchItems?.graphCursor + 25
              ? allSearchItems?.graphCursor + 25
              : undefined
            : undefined,
          actionLensProfileCursor: profileCursor,
          actionLensPubCursor: pubCursor,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleShuffleSearch = () => {
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
        access: getRandomElement(filterConstants?.access!),
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

  const handleCollectionProfilesAndPublications = async (
    collections: Creation[]
  ): Promise<Creation[] | undefined> => {
    try {
      const { data } = await getPublications(
        {
          where: {
            publicationIds: collections.map(
              (item) =>
                `${numberToItemTypeMap[Number(item?.origin)]}/${
                  "0x" + Number(item?.pubId)?.toString(16)
                }-${"0x" + Number(item?.profileId)?.toString(16)}`
            ),
            publicationTypes: [PublicationType.Post],
          },
        },
        lensConnected?.id
      );

      const newCollections: Creation[] = collections.map(
        (collection: Creation) => ({
          ...collection,
          profile: (
            data?.publications?.items.find(
              (item) => (item as Post).by.id === collection.profileId
            ) as Post
          ).by,
          publication: data?.publications?.items.find(
            (item) => item.id === collection.pubId
          ),
          sizes: (collection?.sizes as any)
            ?.split(",")
            .map((word: string) => word.trim()),
          colors: (collection?.colors as any)
            ?.split(",")
            .map((word: string) => word.trim()),
          mediaTypes: (collection?.mediaTypes as any)
            ?.split(",")
            .map((word: string) => word.trim()),
          access: (collection?.access as any)
            ?.split(",")
            .map((word: string) => word.trim()),
          communities: (collection?.communities as any)
            ?.split(",")
            .map((word: string) => word.trim()),
          tags: (collection?.tags as any)
            ?.split(",")
            .map((word: string) => word.trim()),
        })
      ) as Creation[];

      return newCollections;
    } catch (err: any) {
      console.error(err.message);
    }
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
        communities: community?.data?.communityCreateds?.(
          (item: { name: string; image: string; communityId: string }) => {
            return [item.name, item.image, item.communityId];
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
        "QmbnNBG8j2Qv3AAKPK5g2ivMZvdLnDbouqnCnw27nGR8jN"
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
    if (!filtersOpen.value && !filterEmpty(filters)) {
      handleSearch();
    }
  }, [filtersOpen.value]);

  return {
    handleSearch,
    handleMoreSearch,
    searchInput,
    setSearchInput,
    handleShuffleSearch,
    openDropDown,
    setOpenDropDown,
    placeholderText,
    filteredDropDownValues,
    setFilteredDropDownValues,
    searchLoading,
    handleResetFilters,
    volume,
    volumeOpen,
    setVolumeOpen,
    setVolume,
    heart,
    setHeart,
  };
};

export default useSearch;
