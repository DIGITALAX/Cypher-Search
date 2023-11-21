import { useEffect, useState } from "react";
import { AllSearchItemsState } from "../../../../redux/reducers/searchItemsSlice";
import getPublications from "../../../../graphql/lens/queries/publications";
import {
  LimitType,
  Post,
  Comment,
  Mirror,
  Quote,
  Profile,
  PublicationType,
} from "../../../../graphql/generated";
import { getTextSearch } from "../../../../graphql/subgraph/queries/getTextSearch";
import { Creation } from "@/components/Tiles/types/tiles.types";
import handleCollectionProfilesAndPublications from "../../../../lib/helpers/handleCollectionProfilesAndPublications";

const useSuggested = (
  routerPath: string | undefined,
  pageProfile: Profile | undefined,
  lensConnected: Profile | undefined
) => {
  const [loaders, setLoaders] = useState<{
    suggestedLoading: boolean;
    moreSuggestedLoading: boolean;
  }>({
    suggestedLoading: false,
    moreSuggestedLoading: false,
  });
  const [suggestedFeed, setSuggestedFeed] = useState<
    AllSearchItemsState | undefined
  >();

  const getSuggestedItems = async () => {
    setLoaders((prev) => ({
      ...prev,
      suggestedLoading: true,
    }));
    let collections: Creation[] = [],
      publications: (Post | Comment | Quote | Mirror)[] = [],
      pubCursor: string | undefined;
    try {
      const searchItems = await getTextSearch(
        pageProfile?.handle?.localName!,
        25,
        0
      );
      if (searchItems?.data?.cyphersearch?.length > 0) {
        collections =
          (await handleCollectionProfilesAndPublications(
            searchItems?.data?.cyphersearch,
            lensConnected
          )) || [];
      }

      const relatedPubs = await getPublications(
        {
          limit: LimitType.TwentyFive,
          where: {
            from: pageProfile?.id,
            publicationTypes: [PublicationType?.Post, PublicationType?.Quote],
          },
        },
        lensConnected?.id
      );

      publications = (relatedPubs?.data?.publications?.items || []) as (
        | Post
        | Comment
        | Mirror
        | Quote
      )[];
      pubCursor = relatedPubs?.data?.publications?.pageInfo?.next;

      setSuggestedFeed({
        items: [
          ...(collections?.map((item) => ({
            post: item,
            type: item.origin,
          })) || []),
          ...(publications?.map((item) => ({
            post: item,
            publishedOn: item?.publishedOn,
            type:
              item?.__typename !== "Mirror"
                ? (item as Post | Comment | Quote)?.metadata?.__typename
                : item?.mirrorOn?.metadata?.__typename,
          })) || []),
        ]?.sort(() => Math.random() - 0.5) as any,
        graphCursor: collections?.length == 25 ? 25 : undefined,
        lensProfileCursor: undefined,
        lensPubCursor: publications?.length == 25 ? pubCursor : undefined,
        hasMore:
          collections?.length == 25 || publications?.length == 25
            ? true
            : false,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setLoaders((prev) => ({
      ...prev,
      suggestedLoading: false,
    }));
  };

  const getMoreSuggested = async () => {
    if (!suggestedFeed?.hasMore) return;
    setLoaders((prev) => ({
      ...prev,
      moreSuggestedLoading: true,
    }));
    let collections: Creation[] = [],
      publications: (Post | Comment | Quote | Mirror)[] = [],
      pubCursor: string | undefined;
    try {
      const searchItems = await getTextSearch(
        pageProfile?.handle?.localName!,
        25,
        suggestedFeed?.graphCursor!
      );
      if (searchItems?.data?.cyphersearch?.length > 0) {
        collections =
          (await handleCollectionProfilesAndPublications(
            searchItems?.data?.cyphersearch,
            lensConnected
          )) || [];
      }

      const relatedPubs = await getPublications(
        {
          limit: LimitType.TwentyFive,
          where: {
            from: pageProfile?.id,
            publicationTypes: [PublicationType?.Post, PublicationType?.Quote],
          },
          cursor: suggestedFeed?.lensPubCursor,
        },
        lensConnected?.id
      );

      publications = (relatedPubs?.data?.publications?.items || []) as (
        | Post
        | Comment
        | Mirror
        | Quote
      )[];
      pubCursor = relatedPubs?.data?.publications?.pageInfo?.next;

      setSuggestedFeed({
        items: [
          ...suggestedFeed?.items!,
          ...[
            ...(collections?.map((item) => ({
              post: item,
              type: item.origin,
            })) || []),
            ...(publications?.map((item) => ({
              post: item,
              publishedOn: item?.publishedOn,
              type:
                item?.__typename !== "Mirror"
                  ? (item as Post | Comment | Quote)?.metadata?.__typename
                  : item?.mirrorOn?.metadata?.__typename,
            })) || []),
          ],
        ]?.sort(() => Math.random() - 0.5) as any,
        graphCursor: collections?.length == 25 ? 25 : undefined,
        lensProfileCursor: undefined,
        lensPubCursor: publications?.length == 25 ? pubCursor : undefined,
        hasMore:
          collections?.length == 25 && publications?.length == 25
            ? true
            : false,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setLoaders((prev) => ({
      ...prev,
      moreSuggestedLoading: false,
    }));
  };

  useEffect(() => {
    if (
      suggestedFeed?.items &&
      suggestedFeed?.items?.length < 1 &&
      routerPath &&
      pageProfile?.id
    ) {
      getSuggestedItems();
    }
  }, [lensConnected?.id]);

  return {
    getMoreSuggested,
    suggestedFeed,
    loaders,
  };
};

export default useSuggested;
