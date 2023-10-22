import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { TilesProps } from "../types/tiles.types";
import TileSwitch from "./TileSwitch";
import { Masonry } from "masonic";

const Tiles: FunctionComponent<TilesProps> = ({
  handleMoreSearch,
  searchActive,
  layoutAmount,
  popUpOpen,
  setPopUpOpen,
  apparel,
  setApparel,
  dispatch,
  router,
  cartItems,
}): JSX.Element => {
  const items = [
    { id: 0, type: "image" },
    { id: 1, type: "video" },
    { id: 3, type: "chromadin" },
    { id: 2, type: "quest" },
    { id: 4, type: "coinop" },
    { id: 5, type: "quest" },
    { id: 6, type: "legend" },
    { id: 6, type: "listener" },
    { id: 6, type: "listener" },
    { id: 7, type: "quest" },
    { id: 8, type: "chromadin" },
    { id: 9, type: "video" },
    { id: 10, type: "text" },
    { id: 11, type: "text" },
    { id: 12, type: "coinop" },
    { id: 13, type: "image" },
    { id: 14, type: "coinop" },
    { id: 15, type: "legend" },
  ];

  const renderTile = ({
    index,
    data,
  }: {
    index: number;
    data: {
      id: number;
      type: string;
    };
  }) => {
    return (
      <TileSwitch
        key={data.id}
        type={data.type}
        publication={""}
        cartItems={cartItems}
        layoutAmount={layoutAmount}
        popUpOpen={popUpOpen}
        setPopUpOpen={setPopUpOpen}
        apparel={apparel}
        setApparel={setApparel}
        index={index}
        dispatch={dispatch}
        router={router}
      />
    );
  };

  return (
    <div className="relative w-full h-fit overflow-y-scroll pt-24 pb-6 px-4">
      <InfiniteScroll
        dataLength={16}
        loader={<></>}
        hasMore={true}
        next={handleMoreSearch}
        className={`w-full h-full items-start justify-center ${
          searchActive && "fadeTiles"
        }`}
      >
        <Masonry
          key={0}
          items={items}
          render={renderTile}
          columnGutter={50}
          maxColumnCount={layoutAmount}
        />
      </InfiniteScroll>
    </div>
  );
};

export default Tiles;
