import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { TilesProps } from "../types/tiles.types";
import TileSwitch from "./TileSwitch";
import { Masonry } from "masonic";
import TileLoader from "@/components/Common/modules/TileLoader";

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
  mirror,
  like,
  comment,
  quote,
  collect,
  interactionsLoading,
  openMirrorChoice,
  setOpenMirrorChoice,
  filtersOpen,
  searchLoading,
  unfollowProfile,
  followProfile,
  followLoading,
  profileHovers,
  setProfileHovers,
}): JSX.Element => {
  const items = [
    { id: 0, type: "image" },
    { id: 1, type: "video" },
    { id: 3, type: "chromadin" },
    { id: 16, type: "profile" },
    { id: 17, type: "microbrand" },
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
      id: string;
      type: string;
    };
  }) => {
    return searchLoading ? (
      <TileLoader layoutAmount={layoutAmount} key={index} />
    ) : (
      <TileSwitch
        key={index}
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
        mirror={mirror}
        like={like}
        comment={comment}
        quote={quote}
        collect={collect}
        interactionsLoading={interactionsLoading}
        openMirrorChoice={openMirrorChoice}
        setOpenMirrorChoice={setOpenMirrorChoice}
        followLoading={followLoading}
        followProfile={followProfile}
        unfollowProfile={unfollowProfile}
        profileHovers={profileHovers}
        setProfileHovers={setProfileHovers}
      />
    );
  };

  return (
    <div
      className={`relative w-full h-fit overflow-y-scroll pb-6 px-4 ${
        searchActive || filtersOpen ? "pt-52 sm:pt-24" : "pt-24"
      }`}
    >
      <InfiniteScroll
        dataLength={16}
        loader={<TileLoader layoutAmount={layoutAmount} />}
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
