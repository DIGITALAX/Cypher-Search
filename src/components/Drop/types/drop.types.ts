import { CartItem } from "@/components/Common/types/common.types";
import { Creation } from "@/components/Tiles/types/tiles.types";
import { TFunction } from "i18next";
import { NextRouter } from "next/router";
import { AnyAction, Dispatch } from "redux";

export type DropMainProps = {
  collections: Creation[];
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  cartItems: CartItem[];
  t: TFunction<"common", undefined>;
};
