import Footer from "@/components/Layout/modules/Footer";
import useSearch from "@/components/Search/hooks/useSearch";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Tiles from "@/components/Tiles/modules/Tiles";
import Header from "@/components/Layout/modules/Header";
import useSignIn from "@/components/Layout/hooks/useSignIn";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import useTiles from "@/components/Tiles/hooks/useTiles";
import { useRouter } from "next/router";
import Head from "next/head";
import useInteractions from "@/components/Tiles/hooks/useInteractions";
import useProfile from "@/components/Tiles/hooks/useProfile";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleRewind = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const searchActive = useSelector(
    (state: RootState) => state.app.searchActiveReducer.value
  );
  const walletConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const filtersOpen = useSelector(
    (state: RootState) => state.app.filtersOpenReducer.value
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.items
  );
  const layoutAmount = useSelector(
    (state: RootState) => state.app.layoutSwitchReducer.value
  );
  const {
    handleSearch,
    handleMoreSearch,
    searchInput,
    setSearchInput,
    handleShuffleSearch,
    placeholderText,
    searchLoading,
  } = useSearch();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const {
    handleLensConnect,
    openAccount,
    setOpenAccount,
    signInLoading,
    cartListOpen,
    setCartListOpen,
  } = useSignIn();
  const {
    mirror,
    like,
    comment,
    quote,
    interactionsLoading,
    setOpenMirrorChoice,
    openMirrorChoice,
    
  } = useInteractions();
  const { followLoading, followProfile, unfollowProfile , profileHovers,
    setProfileHovers,} = useProfile();
  const { setPopUpOpen, popUpOpen, apparel, setApparel } = useTiles();
  return (
    <div
      className={`relative w-full flex flex-col items-center justify-center ${
        searchActive ? "h-full" : "h-[150vh] sm:h-screen"
      }`}
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
          filtersOpen={filtersOpen}
          handleShuffleSearch={handleShuffleSearch}
          placeholderText={placeholderText}
          dispatch={dispatch}
          layoutAmount={layoutAmount}
          cartItems={cartItems}
          cartListOpen={cartListOpen}
          setCartListOpen={setCartListOpen}
          router={router}
        />

        {searchActive && (
          <Tiles
            layoutAmount={layoutAmount}
            filtersOpen={filtersOpen}
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
            comment={comment}
            quote={quote}
            interactionsLoading={interactionsLoading}
            setOpenMirrorChoice={setOpenMirrorChoice}
            openMirrorChoice={openMirrorChoice}
            searchLoading={searchLoading}
            followLoading={followLoading}
            followProfile={followProfile}
            unfollowProfile={unfollowProfile}
            profileHovers={profileHovers}
            setProfileHovers={setProfileHovers}
          />
        )}
      </div>
      <Footer handleRewind={handleRewind} />
    </div>
  );
}
