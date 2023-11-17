import useSearch from "@/components/Search/hooks/useSearch";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Tiles from "@/components/Tiles/modules/Tiles";
import Header from "@/components/Layout/modules/Header";
import useSignIn from "@/components/Layout/hooks/useSignIn";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import useTiles from "@/components/Tiles/hooks/useTiles";
import { NextRouter } from "next/router";
import Head from "next/head";
import useInteractions from "@/components/Tiles/hooks/useInteractions";
import { useAccount } from "wagmi";
import { polygon } from "viem/chains";
import { createPublicClient, http } from "viem";
import { useEffect } from "react";
import { setCartAnim } from "../../redux/reducers/cartAnimSlice";

export default function Home({ router }: { router: NextRouter }) {
  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
  const walletConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.items
  );
  const fullScreenVideo = useSelector(
    (state: RootState) => state.app.fullScreenVideoReducer
  );
  const layoutAmount = useSelector(
    (state: RootState) => state.app.layoutSwitchReducer.value
  );
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const cartAnim = useSelector(
    (state: RootState) => state.app.cartAnimReducer.value
  );
  const searchActive = useSelector(
    (state: RootState) => state.app.searchActiveReducer.value
  );
  const filtersOpen = useSelector(
    (state: RootState) => state.app.filtersOpenReducer
  );
  const filterConstants = useSelector(
    (state: RootState) => state.app.filterConstantsReducer.items
  );
  const filters = useSelector(
    (state: RootState) => state.app.filterReducer.filter
  );
  const allSearchItems = useSelector(
    (state: RootState) => state.app.searchItemsReducer
  );
  const interactionsCount = useSelector(
    (state: RootState) => state.app.interactionsCountReducer
  );
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const {
    handleSearch,
    handleMoreSearch,
    searchInput,
    setSearchInput,
    handleShuffleSearch,
    placeholderText,
    searchLoading,
    volume,
    volumeOpen,
    setVolumeOpen,
    setVolume,
    heart,
    setHeart,
  } = useSearch(
    filtersOpen,
    lensConnected,
    searchActive,
    filterConstants,
    filters,
    allSearchItems,
    dispatch,
    router
  );
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const {
    handleLensConnect,
    openAccount,
    setOpenAccount,
    signInLoading,
    cartListOpen,
    setCartListOpen,
  } = useSignIn(
    publicClient,
    address,
    isConnected,
    dispatch,
    oracleData,
    cartItems,
    lensConnected
  );
  const {
    mirror,
    like,
    collect,
    interactionsLoading,
    setOpenMirrorChoice,
    openMirrorChoice,
  } = useInteractions(
    allSearchItems.items,
    interactionsCount,
    dispatch,
    publicClient,
    address
  );
  const {
    setPopUpOpen,
    popUpOpen,
    apparel,
    setApparel,
    profileHovers,
    setProfileHovers,
    followLoading,
    followProfile,
    unfollowProfile,
  } = useTiles(
    allSearchItems.items,
    lensConnected,
    dispatch,
    publicClient,
    address
  );

  useEffect(() => {
    if (cartAnim) {
      setTimeout(() => {
        dispatch(setCartAnim(false))
      }, 1000)
    }
  }, [cartAnim])
  return (
    <div
      className={`relative w-full flex flex-col items-center justify-center sm:h-screen`}
      style={{
        height: searchActive ? "100%" : "calc(105vh - 10rem)",
      }}
    >
      <Head>
        <title>Cyper Search</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`relative w-full h-fit flex items-center justify-center gap-10 flex-col h-full`}
        id="results"
      >
        <Header
          cartAnim={cartAnim}
          handleSearch={handleSearch}
          searchActive={searchActive}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          openConnectModal={openConnectModal}
          handleLensConnect={handleLensConnect}
          openAccountModal={openAccountModal}
          lensConnected={lensConnected}
          walletConnected={walletConnected}
          openAccount={openAccount}
          setOpenAccount={setOpenAccount}
          signInLoading={signInLoading}
          filtersOpen={filtersOpen?.value}
          handleShuffleSearch={handleShuffleSearch}
          placeholderText={placeholderText}
          dispatch={dispatch}
          layoutAmount={layoutAmount}
          cartItems={cartItems}
          cartListOpen={cartListOpen}
          setCartListOpen={setCartListOpen}
          router={router}
          includeSearch
        />
        {searchActive && (
          <Tiles
            layoutAmount={layoutAmount}
            filtersOpen={filtersOpen?.value}
            searchActive={searchActive}
            handleMoreSearch={handleMoreSearch}
            popUpOpen={popUpOpen}
            setPopUpOpen={setPopUpOpen}
            apparel={apparel}
            setApparel={setApparel}
            dispatch={dispatch}
            router={router}
            cartItems={cartItems}
            mirror={mirror}
            like={like}
            simpleCollect={collect}
            interactionsLoading={interactionsLoading}
            setOpenMirrorChoice={setOpenMirrorChoice}
            openMirrorChoice={openMirrorChoice}
            searchLoading={searchLoading}
            followLoading={followLoading}
            followProfile={followProfile}
            unfollowProfile={unfollowProfile}
            profileHovers={profileHovers}
            setProfileHovers={setProfileHovers}
            fullScreenVideo={fullScreenVideo}
            volume={volume}
            volumeOpen={volumeOpen}
            setVolumeOpen={setVolumeOpen}
            setVolume={setVolume}
            profileId={lensConnected?.id}
            heart={heart}
            setHeart={setHeart}
          />
        )}
      </div>
    </div>
  );
}
