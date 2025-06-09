import { numberToItemTypeMap } from "@/app/lib/constants";
import buildTextQuery, {
  buildTextQueryTripleA,
} from "@/app/lib/helpers/buildTextQuery";
import { ModalContext } from "@/app/providers";
import {
  Account,
  PageSize,
  Post,
  PostType,
  Repost,
} from "@lens-protocol/client";
import { useContext } from "react";
import { GeneralPub, NFTData } from "../../Tiles/types/tiles.types";
import { Drop } from "../../Autograph/types/autograph.types";
import { Collection } from "../types/common.types";
import {
  fetchAccountsAvailable,
  fetchPosts,
} from "@lens-protocol/client/actions";
import {
  getAllCollections,
  getAllCollectionsTripleA,
} from "../../../../../graphql/queries/getAllCollections";
import handleCollectionProfilesAndPublications from "@/app/lib/helpers/handleCollectionProfilesAndPublications";
import { usePathname } from "next/navigation";
import handleCollectionProfilesAndPublicationsTripleA from "@/app/lib/helpers/handleCollectionProfilesAndPublicationsTripleA";

const useSuggested = (data: Drop | GeneralPub | undefined) => {
  const context = useContext(ModalContext);
  const path = usePathname();
  const getSuggestedItems = async () => {
    if (!data || !context?.clienteLens) return;
    context?.setSearchItems((prev) => ({
      ...prev,
      searchLoading: true,
    }));
    let collections: Collection[] = [],
      publications: (Post | Repost)[] = [],
      tripleA: NFTData[] = [];

    let profile: Account | undefined;

    if ((data as Drop)?.designer) {
      const res = await fetchAccountsAvailable(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          managedBy: (data as Drop)?.designer,
        }
      );
      if (res?.isOk()) {
        profile = res?.value?.items?.[0]?.account as Account;
      }
    } else {
      if (((data as GeneralPub)?.post as Post)?.__typename == "Post") {
        profile = ((data as GeneralPub)?.post as Post)?.author;
      } else if (
        ((data as GeneralPub)?.post as Repost)?.__typename == "Repost"
      ) {
        profile = ((data as GeneralPub)?.post as Repost)?.repostOf?.author;
      } else if (((data as GeneralPub)?.post as Collection)?.profile) {
        profile = ((data as GeneralPub)?.post as Collection)?.profile;
      } else if (((data as GeneralPub)?.post as Account)?.address) {
        profile = (data as GeneralPub)?.post as Account;
      }
    }

    if (!profile) {
      context?.setSearchItems((prev) => ({
        ...prev,
        searchLoading: false,
      }));
      return;
    }

    try {
      if (path?.includes("/triplea/")) {
        const whereTripleA = buildTextQueryTripleA(
          profile?.username?.localName!,
          profile?.owner
        );

        if (whereTripleA) {
          const data = await getAllCollectionsTripleA(
            whereTripleA,
            25,
            0,
            "desc",
            "blockTimestamp"
          );

          if (data?.data?.collectionCreateds?.length > 0)
            tripleA =
              (await handleCollectionProfilesAndPublicationsTripleA(
                data?.data?.collectionCreateds,
                context?.lensConectado!,
                context?.clienteLens!
              )) || [];
        }
      }
      const textWhere = buildTextQuery(
        profile?.username?.localName!,
        profile?.owner
      );
      if (textWhere) {
        const searchItems = await getAllCollections(
          textWhere,
          25,
          0,
          "desc",
          "blockTimestamp"
        );

        if (searchItems?.data?.collectionCreateds?.length > 0) {
          collections =
            (await handleCollectionProfilesAndPublications(
              searchItems?.data?.collectionCreateds,
              context?.lensConectado!,
              context?.clienteLens!
            )) || [];
        }
      }

      const relatedPubs = await fetchPosts(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          pageSize: PageSize.Ten,
          filter: {
            authors: [profile?.address],
            postTypes: [PostType?.Root],
          },
        }
      );

      if (relatedPubs?.isOk()) {
        publications = relatedPubs?.value?.items as Post[];
      }

      context?.setSearchItems((prev) => ({
        ...prev,
        input: "",
        items: [
          ...(collections?.map((item) => ({
            post: item,
            type: numberToItemTypeMap[Number(item.origin)],
          })) || []),
          ...(tripleA?.map((item) => ({
            post: item,
            type: "TripleA",
          })) || []),
          ...(publications?.map((item) => ({
            post: item,
            type:
              item?.__typename !== "Repost"
                ? item?.metadata?.__typename
                : item?.repostOf?.metadata?.__typename,
          })) || []),
        ]?.sort(() => Math.random() - 0.5) as any,
        graphCursor: collections?.length == 25 ? 25 : undefined,
        lensProfileCursor: undefined,
        tripleACursor: tripleA?.length == 25 ? 25 : undefined,
        lensPubCursor: undefined,
        hasMore:
          collections?.length == 25 || tripleA?.length == 25 ? true : false,
      }));
    } catch (err: any) {
      console.error(err.message);
    }
    context?.setSearchItems((prev) => ({
      ...prev,
      searchLoading: false,
    }));
  };

  return {
    getSuggestedItems,
  };
};

export default useSuggested;
