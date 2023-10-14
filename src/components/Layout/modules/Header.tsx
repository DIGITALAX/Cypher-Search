import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import SearchBar from "../../Search/modules/SearchBar";
import { HeaderProps } from "../../Search/types/search.types";
import Link from "next/link";
import { AiOutlineLoading } from "react-icons/ai";

const Header: FunctionComponent<HeaderProps> = ({
  handleSearch,
  searchActive,
  searchInput,
  setSearchInput,
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
}): JSX.Element => {
  return (
    <div className="fixed w-full h-fit flex items-center justify-between p-2 top-0 z-20 bg-offBlack">
      <Link
        className="relative w-10 h-10 flex items-center justify-center cursor-pointer active:scale-95"
        href={"/"}
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmYbjMNQAVuQSWNNQ5AKbQtt4Dxw2ax4SvLNwKhCNDniL2`}
          layout="fill"
          draggable={false}
        />
      </Link>
      <SearchBar
        dispatch={dispatch}
        handleSearch={handleSearch}
        searchActive={searchActive}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        filtersOpen={filtersOpen}
        handleShuffleSearch={handleShuffleSearch}
        placeholderText={placeholderText}
        layoutAmount={layoutAmount}
      />
      <div className="relative w-fit h-10 flex flex-row gap-4 items-center justify-center">
        <div
          className={`w-24 h-8 relative flex items-center justify-center p-px rounded-sm text-center cursor-pointer active:scale-95 hover:opacity-70 ${
            signInLoading && "animate-spin"
          }`}
          id="borderSearch"
          onClick={
            !walletConnected
              ? openConnectModal
              : walletConnected && !lensConnected
              ? () => handleLensConnect()
              : () => setOpenAccount(!openAccount)
          }
        >
          <div className="relative w-full h-full rounded-sm bg-offBlack text-sol font-vcr flex items-center justify-center text-sm">
            {signInLoading ? (
              <AiOutlineLoading size={15} color={"white"} />
            ) : !walletConnected ? (
              "connect"
            ) : walletConnected && !lensConnected ? (
              "lens"
            ) : (
              "account"
            )}
          </div>
        </div>
        {openAccount && (
          <div className="absolute w-24 h-8 top-10 flex items-center justify-center p-px rounded-sm"></div>
        )}
        <div
          className="relative w-8 h-4/5 flex items-center justify-center cursor-pointer active:scale-95"
          id="cartAnim"
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmT5ewiqFhfo8EHxSYiFwFR67pBpg7xesdtwAu9oWBoqqu`}
            layout="fill"
            draggable={false}
          />
        </div>
        <div className="relative w-8 h-4/5 flex items-center justify-center">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmeSSwZt92PgMfvdJih9yyypQGX8gFx3BoLXn3mXwYX5pb`}
            layout="fill"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
