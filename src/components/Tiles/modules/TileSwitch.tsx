import { FunctionComponent } from "react";
import Chromadin from "./Tiles/Chromadin";
import ImagePost from "./Tiles/ImagePost";
import CoinOp from "./Tiles/CoinOp";
import VideoPost from "./Tiles/VideoPost";
import TextPost from "./Tiles/TextPost";
import { TileSwitchProps } from "../types/tiles.types";
import Quest from "./Tiles/Quest";
import Legend from "./Tiles/Legend";

const TileSwitch: FunctionComponent<TileSwitchProps> = ({
  type,
  publication,
  layoutAmount,
  popUpOpen,
  setPopUpOpen,
  apparel,
  setApparel,
  index,
  dispatch,
  router,
  cartItems,
}) => {
  switch (type) {
    case "image":
      return (
        <ImagePost
          layoutAmount={layoutAmount}
          router={router}
          publication={publication}
        />
      );
    case "chromadin":
      return (
        <Chromadin
          popUpOpen={popUpOpen}
          setPopUpOpen={setPopUpOpen}
          layoutAmount={layoutAmount}
          apparel={apparel}
          setApparel={setApparel}
          index={index}
          dispatch={dispatch}
          router={router}
          publication={publication}
          cartItems={cartItems}
        />
      );
    case "coinop":
      return (
        <CoinOp
          popUpOpen={popUpOpen}
          setPopUpOpen={setPopUpOpen}
          layoutAmount={layoutAmount}
          index={index}
          dispatch={dispatch}
          router={router}
          publication={publication}
          cartItems={cartItems}
        />
      );
    case "text":
      return (
        <TextPost
          layoutAmount={layoutAmount}
          router={router}
          publication={publication}
        />
      );
    case "video":
      return (
        <VideoPost
          layoutAmount={layoutAmount}
          dispatch={dispatch}
          router={router}
          publication={publication}
        />
      );
    case "quest":
      return (
        <Quest layoutAmount={layoutAmount} router={router} publication={publication} />
      );
    case "legend":
      return (
        <Legend
          layoutAmount={layoutAmount}
          index={index}
          dispatch={dispatch}
          router={router}
          publication={publication}
          cartItems={cartItems}
        />
      );

    default:
      return null;
  }
};

export default TileSwitch;
