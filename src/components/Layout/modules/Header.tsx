import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import SearchBar from "../../Search/modules/SearchBar";
import { HeaderProps } from "../../Search/types/search.types";
import Accounts from "@/components/Common/modules/Accounts";
import { setAllSearchItems } from "../../../../redux/reducers/searchItemsSlice";
import { setSearchActive } from "../../../../redux/reducers/searchActiveSlice";
import { setFiltersOpen } from "../../../../redux/reducers/filtersOpenSlice";

const Header: FunctionComponent<HeaderProps> = ({
  handleSearch,
  searchActive,
  openConnectModal,
  handleLensConnect,
  walletConnected,
  lensConnected,
  setOpenAccount,
  openAccount,
  signInLoading,
  filtersOpen,
  handleShuffleSearch,
  placeholderText,
  dispatch,
  layoutAmount,
  cartItems,
  cartListOpen,
  setCartListOpen,
  router,
  includeSearch,
  cartAnim,
  handleLogout,
  searchItems,
  fullScreenVideo,
  filterChange
}): JSX.Element => {
  return (
    <div
      className={`fixed w-full h-fit flex p-2 top-0 z-30 bg-offBlack ${
        searchActive || filtersOpen
          ? "items-start justify-center flex-col sm:flex-row sm:items-center sm:justify-between gap-6 galaxy:gap-8"
          : "flex-row items-center justify-between"
      } `}
    >
      <div className="relative w-fit h-fit flex items-center justify-center cursor-pointer active:scale-95">
        <div
          className={`relative w-10 h-10 flex items-center justify-center`}
          // href={"/"}
          onClick={(e) => {
            e.stopPropagation();
            router.push("/");
            dispatch(setSearchActive(false));
            dispatch(
              setFiltersOpen({
                actionValue: false,
                actionAllow: false,
              })
            );
            dispatch(
              setAllSearchItems({
                actionItems: [],
                actionHasMore: true,
                actionInput: "",
              })
            );
          }}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmYbjMNQAVuQSWNNQ5AKbQtt4Dxw2ax4SvLNwKhCNDniL2`}
            layout="fill"
            draggable={false}
          />
        </div>
      </div>
      {includeSearch && (
        <SearchBar
          filterChange={filterChange}
          dispatch={dispatch}
          handleSearch={handleSearch!}
          searchActive={searchActive}
          filtersOpen={filtersOpen}
          handleShuffleSearch={handleShuffleSearch!}
          placeholderText={placeholderText}
          layoutAmount={layoutAmount!}
          router={router}
          searchItems={searchItems}
        />
      )}
      <Accounts
        fullScreenVideo={fullScreenVideo}
        cartAnim={cartAnim}
        searchActive={searchActive}
        filtersOpen={filtersOpen}
        lensConnected={lensConnected}
        walletConnected={walletConnected}
        handleLensConnect={handleLensConnect}
        openConnectModal={openConnectModal}
        setOpenAccount={setOpenAccount}
        cartItems={cartItems}
        openAccount={openAccount}
        cartListOpen={cartListOpen}
        signInLoading={signInLoading}
        setCartListOpen={setCartListOpen}
        router={router}
        handleLogout={handleLogout}
        dispatch={dispatch}
      />
    </div>
  );
};

export default Header;
