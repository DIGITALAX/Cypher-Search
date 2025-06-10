import {
  INFURA_GATEWAY,
  itemStringToType,
  itemTypeToNumber,
} from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { Account, ImageMetadata, Post, Repost } from "@lens-protocol/client";
import { useContext, useEffect, useState } from "react";
import { GeneralPub } from "../../Tiles/types/tiles.types";
import { Collection } from "../../Common/types/common.types";
import {
  fetchAccount,
  fetchAccountsAvailable,
  fetchPost,
} from "@lens-protocol/client/actions";
import {
  getCollectionsPaginated,
  getOneCollectionTitle,
  getOneCollectionTripleA,
} from "../../../../../graphql/queries/getAllCollections";
import handleCollectionProfilesAndPublications from "@/app/lib/helpers/handleCollectionProfilesAndPublications";
import { FetchResult } from "@apollo/client";
import { manejearCatalogos } from "@/app/lib/helpers/manejarCatalogos";
import collectionFixer from "@/app/lib/helpers/collectionFixer";
import handleCollectionProfilesAndPublicationsTripleA from "@/app/lib/helpers/handleCollectionProfilesAndPublicationsTripleA";

const useData = (type: string, id: string) => {
  const context = useContext(ModalContext);
  const [globalLoading, setGlobalLoading] = useState<boolean>(true);
  const [itemLoading, setItemLoading] = useState<boolean>(false);
  const [itemData, setItemData] = useState<GeneralPub>();
  const [relatedData, setRelatedData] = useState<{
    collections: Collection[];
    microbrand: [
      {
        microbrand: string;
        microbrandCover: string;
      }
    ];
  }>();

  const getItemData = async () => {
    setItemLoading(true);
    try {
      let pub: Post | Repost | undefined;
      switch (type?.toLowerCase()) {
        case "catalog":
          const cata = await manejearCatalogos(
            context?.lensConectado!,
            context?.clienteLens!,
            0,
            0,
            id
          );
          setItemData({
            post: cata?.[0],
            type,
          });
          break;

        case "chromadin":
        case "listener":
        case "coinop":
        case "f3m":
          const coll = (await getCollection(
            decodeURIComponent(id?.replaceAll("_", " ")),
            type
          )) as Collection;

          const res = await fetchPost(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              post: coll?.postId,
            }
          );

          if (res.isOk()) {
            pub = res?.value as Post;
          }

          if (coll) {
          }

          setItemData({
            post: coll
              ? {
                  ...coll,
                  profile: pub?.author,
                  publication: pub as Post,
                }
              : pub,
            type,
          });

          break;

        case "kinora":
          //   const data = await getQuest(
          //     parseInt(id?.split("-")?.[0], 16),
          //     parseInt(id?.split("-")?.[1], 16)
          //   );

          //   const quest = (
          //     await handleQuestData(
          //       data?.data?.questInstantiateds,
          //       lensConnected,
          //       true
          //     )
          //   )?.[0] as Quest;

          //   setItemData({
          //     post: quest,
          //     type,
          //   });
          break;

        case "pub":
          pub = (await getPub(id)) as Post;
          const collection = (await getCollection(
            (pub?.metadata as ImageMetadata)?.title!,
            type
          )) as Collection;
          setItemData({
            post: collection
              ? {
                  ...collection,
                  profile: pub?.author,
                  publication: pub,
                }
              : pub,
            type,
          });

          break;

        case "triplea":
          let tripleColl;

          tripleColl = await getOneCollectionTripleA(
            decodeURIComponent(id?.replaceAll("_", " "))
          );
          tripleColl = await handleCollectionProfilesAndPublicationsTripleA(
            tripleColl?.data?.collectionCreateds,
            context?.lensConectado!,
            context?.clienteLens!
          );

          setItemData({
            post: tripleColl?.[0],
            type,
          });

          break;

        case "microbrand":
          const profile = await getIdProfile();

          const collections = await getIdCollections(profile?.owner);
          setItemData({
            post: profile,
            type,
          });

          const micro = context?.filterConstants?.microbrands?.find(
            (item) =>
              item[0]?.toLowerCase() ===
              (id?.includes("re_de")
                ? id
                : id?.replaceAll("_", " ")
              )?.toLowerCase()
          );

          let item = profile?.metadata?.attributes?.[
            profile?.metadata?.attributes?.findIndex(
              (item) => item?.key === "microbrandCypher"
            )
          ]?.value as any;

          if (item) {
            item = await JSON.parse(item);
          } else {
            item = [
              {
                microbrand: micro?.[0]!,
                microbrandCover: `ipfs://${micro?.[1]!}`,
              },
            ] as any;
          }
          if (item) {
            setRelatedData({
              collections: collections || [],
              microbrand: item,
            });
          }

          break;
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setItemLoading(false);
    setGlobalLoading(false);
  };

  const getIdProfile = async (): Promise<Account | undefined> => {
    try {
      if (!context?.filterConstants) return;
      const item = context?.filterConstants?.microbrands?.find(
        (item) =>
          item[0]?.toLowerCase() ===
          (id?.includes("re_de") ? id : id?.replaceAll("_", " "))?.toLowerCase()
      );

      const res = await fetchAccountsAvailable(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          managedBy: item?.[2],
        }
      );

      if (res?.isOk()) {
        return res?.value?.items?.[0]?.account as Account;
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getIdCollections = async (
    creator: string
  ): Promise<Collection[] | undefined> => {
    try {
      const data = await getCollectionsPaginated(creator, 30, 0);
      return await handleCollectionProfilesAndPublications(
        data?.data?.collectionCreateds,
        context?.lensConectado!,
        context?.clienteLens!
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getCollection = async (
    title: string,
    type: string
  ): Promise<Collection | undefined> => {
    let data: FetchResult | void;
    try {
      data = await getOneCollectionTitle(
        title,
        itemTypeToNumber[itemStringToType[type]]
      );

      if (data?.data?.collectionCreateds?.length < 1) {
        data = await getOneCollectionTitle(
          window.location.href?.split(`/item/${type}/`)[1],
          itemTypeToNumber[itemStringToType[type]]
        );
      }

      if (data?.data?.collectionCreateds?.[0]) {
        return collectionFixer(data?.data?.collectionCreateds?.[0]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getPub = async (post: string): Promise<Post | Repost | undefined> => {
    try {
      const res = await fetchPost(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          post,
        }
      );

      if (res?.isOk()) {
        return res?.value as Post;
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (type && id && context?.filterConstants && context?.clienteLens) {
      if (type === "microbrand" && !context?.filterConstants) return;
      getItemData();
    }
  }, [
    type,
    context?.lensConectado?.profile,
    id,
    context?.filterConstants?.hashtags,
    context?.clienteLens,
  ]);

  return {
    globalLoading,
    itemLoading,
    itemData,
    relatedData,
  };
};

export default useData;
