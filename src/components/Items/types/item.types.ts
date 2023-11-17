import { Creation, Publication } from "@/components/Tiles/types/tiles.types";
import { NextRouter } from "next/router";
import { AnyAction, Dispatch } from "redux";

export type SwitchTypeProps = {
  type: string;
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  itemData: Publication;
};

export type ChromadinProps = {
  itemData: Creation
}

export type CoinOpProps = {
  itemData: Creation
}