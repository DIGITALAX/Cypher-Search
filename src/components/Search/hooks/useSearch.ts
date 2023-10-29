import { KeyboardEvent, MouseEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { setSearchActive } from "../../../../redux/reducers/searchActiveSlice";
import {
  DIGITALAX_PROFILE_ID_LENS,
  PLACEHOLDERS,
} from "../../../../lib/constants";
import {
  LimitType,
  Post,
  Profile,
  PublicationMetadataMainFocusType,
  Comment,
  Quote,
  Mirror,
} from "../../../../graphql/generated";
import cachedProfiles from "../../../../lib/helpers/cachedProfiles";
import {
  getTextFilterSearch,
  getTextSearch,
} from "../../../../graphql/subgraph/queries/getTextSearch";
import filterEmpty from "../../../../lib/helpers/filterEmpty";
import { setFilter } from "../../../../redux/reducers/filterSlice";
import { DropDown, FilterValues } from "../types/search.types";
import { setFilterConstants } from "../../../../redux/reducers/filterConstantsSlice";
import fetchIpfsJson from "../../../../lib/helpers/fetchIpfsJson";
import {
  getRandomArrayElement,
  getRandomElement,
  getRandomNumber,
} from "../../../../lib/helpers/randomElements";
import searchPubs from "../../../../graphql/lens/queries/searchPubs";
import searchProfiles from "../../../../graphql/lens/queries/searchProfiles";
import { setAllSearchItems } from "../../../../redux/reducers/searchItemsSlice";
import getProfile from "../../../../graphql/lens/queries/profile";
import { Creation } from "@/components/Tiles/types/tiles.types";
import getMicrobrands from "../../../../graphql/lens/queries/microbrands";
import { getAllCollections } from "../../../../graphql/subgraph/queries/getAllCollections";
import buildQuery from "../../../../lib/helpers/buildQuery";

const useSearch = () => {
  const searchActive = useSelector(
    (state: RootState) => state.app.searchActiveReducer.value
  );
  const filterOpen = useSelector(
    (state: RootState) => state.app.filtersOpenReducer.value
  );
  const filterConstants = useSelector(
    (state: RootState) => state.app.filterConstantsReducer.items
  );
  const filters = useSelector(
    (state: RootState) => state.app.filterReducer.filter
  );
  const profiles = useSelector(
    (state: RootState) => state.app.cachedProfilesReducer.profiles
  );
  const allSearchItems = useSelector(
    (state: RootState) => state.app.searchItemsReducer
  );
  const dispatch = useDispatch();
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

  const handleSearch = async (
    e?: KeyboardEvent | MouseEvent,
    click?: boolean
  ) => {
    setSearchLoading(true);
    if (!searchActive) {
      dispatch(setSearchActive(true));
    }
    let query: string,
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
            collections = await handleCollectionProfiles(
              searchItems?.data.cyphersearch
            );
        } else {
          collections = await filterSearch(0);
        }
        query = searchInput;
      } else {
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
                : ["chromadin", "legend", "kinora", "litlistener"],
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
        collections = await handleCollectionProfiles(collections);

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
            collections = await handleCollectionProfiles(
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
                  : ["chromadin", "legend", "kinora"],
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
        community: getRandomElement(filterConstants?.community!),
        microbrand: getRandomElement(
          filterConstants?.microbrands?.map((item) => item?.[0])!
        ),
        catalog: getRandomElement(filterConstants?.catalog!),
        access: getRandomElement(filterConstants?.access!),
        format: getRandomElement(filterConstants?.format!),
        origin: getRandomElement(
          filterConstants?.origin?.map((item) => item?.[0])!
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
        printType: getRandomArrayElement([
          "sticker",
          "hoodie",
          "shirt",
          "poster",
        ]),
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

  const handleCollectionProfiles = async (
    collections: Creation[]
  ): Promise<Creation[] | undefined> => {
    try {
      let profileCache: { [key: string]: Profile } = {};

      if (!profiles || typeof profiles !== "object") {
        profileCache = (await cachedProfiles()) as { [key: string]: Profile };
      } else {
        profileCache = profiles;
      }
      const collectionPromises = collections?.map(async (obj: Creation) => {
        let profile: Profile = profileCache[DIGITALAX_PROFILE_ID_LENS];

        if (obj?.profileId) {
          if (!profileCache[obj?.profileId]) {
            const { data } = await getProfile({
              forProfileId: obj?.profileId,
            });
            profileCache[obj?.profileId] = data?.profile?.id;
          }
          profile = profileCache[obj?.profileId];
        }

        const modifiedObj = {
          ...obj,
          profile,
        };

        return modifiedObj;
      });

      return await Promise.all(collectionPromises);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleFilterConstants = async () => {
    try {
      const json: FilterValues = (await fetchIpfsJson(
        "QmbnNBG8j2Qv3AAKPK5g2ivMZvdLnDbouqnCnw27nGR8jN"
      )) as any;
      dispatch(setFilterConstants(json));
      setFilteredDropDownValues(json);
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
    if (!filterOpen && !filterEmpty(filters)) {
      handleSearch();
    }
  }, [filterOpen]);

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
  };
};

export default useSearch;
