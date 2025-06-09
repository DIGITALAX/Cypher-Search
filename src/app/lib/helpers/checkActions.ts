import { ImageMetadata, Post, Repost } from "@lens-protocol/client";
import {
  CHROMADIN_OPEN_ACTION,
  COIN_OP_OPEN_ACTION,
  LISTENER_OPEN_ACTION,
  F3M_OPEN_ACTION,
  KINORA_OPEN_ACTION,
} from "../constants";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getOneCollectionByPostId } from "../../../../graphql/queries/getAllCollections";

const checkActions = async (item: Post | Repost, router: AppRouterInstance) => {
  let main = item?.__typename === "Repost" ? item?.repostOf : item;
  let title = (main?.metadata as ImageMetadata)?.title;
  if (
    [
      CHROMADIN_OPEN_ACTION,
      COIN_OP_OPEN_ACTION,
      F3M_OPEN_ACTION,
      LISTENER_OPEN_ACTION,
    ].some((add) => add == main?.actions?.[0]?.address) &&
    !title
  ) {
    const coll = await getOneCollectionByPostId(item?.id);

    title = coll?.data?.collectionCreateds?.[0]?.metadata?.title;
  }

  main?.actions?.[0]?.address
    ?.toLowerCase()
    ?.includes(CHROMADIN_OPEN_ACTION?.toLowerCase())
    ? router.push(`/item/chromadin/${title?.replaceAll(" ", "_")}`)
    : main?.actions?.[0]?.address
        ?.toLowerCase()
        ?.includes(COIN_OP_OPEN_ACTION?.toLowerCase())
    ? router.push(`/item/coinop/${title?.replaceAll(" ", "_")}`)
    : main?.actions?.[0]?.address
        ?.toLowerCase()
        ?.includes(LISTENER_OPEN_ACTION?.toLowerCase())
    ? router.push(`/item/listener/${title?.replaceAll(" ", "_")}`)
    : main?.actions?.[0]?.address
        ?.toLowerCase()
        ?.includes(F3M_OPEN_ACTION?.toLowerCase())
    ? router.push(`/item/f3m/${title?.replaceAll(" ", "_")}`)
    : main?.actions?.[0]?.address
        ?.toLowerCase()
        ?.includes(KINORA_OPEN_ACTION?.toLowerCase())
    ? router.push(`/item/kinora/${main?.id}`)
    : router.push(`/item/pub/${item?.id}`);
};

export default checkActions;
