import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Publication, TilesProps } from "../types/tiles.types";
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
  simpleCollect,
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
  setVolume,
  setVolumeOpen,
  fullScreenVideo,
  volume,
  volumeOpen,
  profileId,
  heart,
  setHeart,
  searchItems,
  moreSearchLoading,
  lensConnected
}): JSX.Element => {
  const renderTile = ({
    index,
    data,
  }: {
    index: number;
    data: Publication;
  }) => {
    return searchLoading ? (
      <TileLoader layoutAmount={layoutAmount} key={index} />
    ) : (
      <TileSwitch
        type={data?.type}
        lensConnected={lensConnected}
        publication={data}
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
        interactionsLoading={interactionsLoading}
        openMirrorChoice={openMirrorChoice}
        setOpenMirrorChoice={setOpenMirrorChoice}
        followLoading={followLoading}
        followProfile={followProfile}
        unfollowProfile={unfollowProfile}
        profileHovers={profileHovers}
        setProfileHovers={setProfileHovers}
        setVolume={setVolume}
        setVolumeOpen={setVolumeOpen}
        simpleCollect={simpleCollect}
        fullScreenVideo={fullScreenVideo}
        volume={volume}
        volumeOpen={volumeOpen}
        profileId={profileId}
        setHeart={setHeart}
        heart={heart}
      />
    );
  };

  return (
    <div
      className={`relative w-full min-h-screen h-fit overflow-y-scroll pb-6 px-4 ${
        searchActive || filtersOpen ? "pt-52 sm:pt-24" : "pt-24"
      }`}
    >
      <InfiniteScroll
        dataLength={
          (searchItems?.items || [])?.length + (moreSearchLoading ? 20 : 0)
        }
        loader={<></>}
        hasMore={searchItems?.hasMore || false}
        next={handleMoreSearch}
        className={`w-full h-screen items-start justify-center ${
          searchActive && "fadeTiles"
        }`}
        style={{
          height: "100vh"
        }}
      >
        <Masonry
          key={
            (searchItems?.items || [])?.length + (moreSearchLoading ? 20 : 0)
          }
          items={
            moreSearchLoading
              ? [
                  ...(searchItems?.items || []),
                  ...Array.from({ length: 20 }, (_) => ({
                    id: Math.random(),
                    type: "loader",
                  })),
                ]
              : searchItems?.items || []
          }
          render={renderTile}
          columnGutter={50}
          maxColumnCount={layoutAmount}
        />
      </InfiniteScroll>
    </div>
  );
};

export default Tiles;
