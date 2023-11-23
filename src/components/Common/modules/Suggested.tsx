import Header from "@/components/Layout/modules/Header";
import Tiles from "@/components/Tiles/modules/Tiles";
import { FunctionComponent } from "react";
import { SuggestedProps } from "../types/common.types";

const Suggested: FunctionComponent<SuggestedProps> = ({
  component,
  followLoading,
  followProfile,
  unfollowProfile,
  profileHovers,
  setProfileHovers,
  mirror,
  like,
  simpleCollect,
  interactionsLoading,
  setOpenMirrorChoice,
  openMirrorChoice,
  handleLensConnect,
  openAccount,
  setOpenAccount,
  signInLoading,
  cartListOpen,
  setCartListOpen,
  openConnectModal,
  handleLogout,
  handleSearch,
  handleMoreSearch,
  allSearchItems,
  handleShuffleSearch,
  placeholderText,
  searchLoading,
  dispatch,
  lensConnected,
  walletConnected,
  router,
  filtersOpen,
  layoutAmount,
  cartItems,
  setApparel,
  popUpOpen,
  setPopUpOpen,
  apparel,
  cartAnim,
  searchItems,
  moreSearchLoading,
}) => {
  return (
    <div
      className={`relative w-full h-fit flex items-center justify-center gap-10 flex-col h-full`}
      id="results"
    >
      <Header
        cartAnim={cartAnim}
        handleSearch={handleSearch}
        searchActive={true}
        searchItems={allSearchItems}
        openConnectModal={openConnectModal}
        handleLensConnect={handleLensConnect}
        handleLogout={handleLogout}
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
        includeSearch
      />
      {component}
      <Tiles
        searchItems={searchItems}
        layoutAmount={layoutAmount!}
        filtersOpen={filtersOpen}
        searchActive={true}
        handleMoreSearch={handleMoreSearch}
        moreSearchLoading={moreSearchLoading}
        popUpOpen={popUpOpen}
        setPopUpOpen={setPopUpOpen}
        apparel={apparel}
        setApparel={setApparel}
        dispatch={dispatch}
        router={router}
        cartItems={cartItems}
        mirror={mirror}
        like={like}
        simpleCollect={simpleCollect}
        interactionsLoading={interactionsLoading}
        setOpenMirrorChoice={setOpenMirrorChoice}
        openMirrorChoice={openMirrorChoice}
        searchLoading={searchLoading}
        followLoading={followLoading}
        followProfile={followProfile}
        unfollowProfile={unfollowProfile}
        profileHovers={profileHovers}
        setProfileHovers={setProfileHovers}
        lensConnected={lensConnected}
      />
    </div>
  );
};

export default Suggested;
