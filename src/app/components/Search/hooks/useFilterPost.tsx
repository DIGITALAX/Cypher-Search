import { itemStringToNumber, numberToItemTypeMap } from "@/app/lib/constants";
import collectionFixer from "@/app/lib/helpers/collectionFixer";
import { ModalContext } from "@/app/providers";
import { useContext, useEffect, useState } from "react";
import { GeneralPub } from "../../Tiles/types/tiles.types";
import { fetchPost } from "@lens-protocol/client/actions";
import { Account, Post } from "@lens-protocol/client";
import { getOneRandomCollection } from "../../../../../graphql/queries/getAllCollections";
import { ItemType } from "../../Common/types/common.types";

const useFilterPost = () => {
  const context = useContext(ModalContext);
  const [publication, setPublication] = useState<GeneralPub>();

  const getCollection = async () => {
    try {
      const origin = ["Chromadin", "CoinOp", "Listener", "F3M"][
        Math.floor(Math.random() * 4)
      ];
      const data = await getOneRandomCollection(itemStringToNumber[origin]);
      if (!data?.data?.collectionCreateds) return;
      const pubData = await fetchPost(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          post: data?.data?.collectionCreateds?.[0]?.postId,
        }
      );
      const coll = await collectionFixer(data?.data?.collectionCreateds?.[0]);

      let post: Post | undefined = undefined,
        profile: Account | undefined = undefined;

      if (pubData?.isOk()) {
        post = pubData?.value as Post;
        profile = pubData?.value?.author as Account;
      }
      setPublication({
        post: {
          ...coll,
          post,
          profile,
        },
        type:
          itemStringToNumber[origin] == "4"
            ? ItemType.CoinOp
            : numberToItemTypeMap[Number(itemStringToNumber[origin])],
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (context?.filtersOpen?.value && !publication && context?.clienteLens) {
      getCollection();
    } else {
      setPublication(undefined);
    }
  }, [
    context?.filtersOpen?.value,
    context?.lensConectado?.profile,
    context?.clienteLens,
  ]);

  return {
    publication,
  };
};

export default useFilterPost;
