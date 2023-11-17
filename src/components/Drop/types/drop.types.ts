import { CartItem } from "@/components/Common/types/common.types";
import { Creation } from "@/components/Tiles/types/tiles.types";
import { NextRouter } from "next/router";
import { AnyAction, Dispatch } from "redux";

export type DropMainProps = {
  collections: Creation[];
  router: NextRouter;
  handle: string;
  dispatch: Dispatch<AnyAction>
  cartItems: CartItem[]
};
