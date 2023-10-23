import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import SearchBar from "../../Search/modules/SearchBar";
import { HeaderProps } from "../../Search/types/search.types";
import Link from "next/link";
import { AiOutlineLoading } from "react-icons/ai";
import { setCartItems } from "../../../../redux/reducers/cartItemsSlice";
import { CartItem } from "../types/footer.types";
import { ImageSet, NftImage } from "../../../../graphql/generated";

const Header: FunctionComponent<HeaderProps> = ({
  handleSearch,
  searchActive,
  searchInput,
  setSearchInput,
  openConnectModal,
  openAccountModal,
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
}): JSX.Element => {
  return (
    <div
      className={`fixed w-full h-fit flex p-2 top-0 z-30 bg-offBlack ${
        searchActive || filtersOpen ? "items-start justify-center flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-0 gap-4" : "flex-row items-center justify-between"
      } `}
    >
      <Link
        className={`relative w-10 h-10 flex cursor-pointer active:scale-95 items-center justify-center`}
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
      <div className={` w-fit h-10 flex flex-row gap-4 items-center justify-center ${
        searchActive || filtersOpen ? "absolute top-2 right-2 sm:top-auto sm:right-auto sm:relative" : "relative"
      }`}>
        {!lensConnected && (
          <div
            className={`w-24 h-8 relative flex items-center justify-center p-px rounded-sm text-center cursor-pointer active:scale-95 hover:opacity-70`}
            id="borderSearch"
            onClick={
              !walletConnected
                ? openConnectModal
                : walletConnected && !lensConnected
                ? () => handleLensConnect()
                : () => {}
            }
          >
            <div
              className={`relative w-full h-full rounded-sm font-vcr flex items-center justify-center text-sm bg-offBlack text-sol`}
            >
              <div
                className={`relative w-fit h-fit flex items-center justify-center ${
                  signInLoading && "animate-spin"
                }`}
              >
                {signInLoading ? (
                  <AiOutlineLoading size={15} color={"white"} />
                ) : !walletConnected ? (
                  "connect"
                ) : (
                  walletConnected && !lensConnected && "lens"
                )}
              </div>
            </div>
          </div>
        )}
        <div
          className="relative w-8 h-4/5 flex items-center justify-center cursor-pointer active:scale-95"
          id="cartAnim"
          onClick={() => setCartListOpen(!cartListOpen)}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmT5ewiqFhfo8EHxSYiFwFR67pBpg7xesdtwAu9oWBoqqu`}
            layout="fill"
            draggable={false}
          />
        </div>
        {cartItems.length > 0 && (
          <div className="absolute rounded-full border border-mar bg-black w-5 flex items-center justify-center right-10 -bottom-1 h-5 p-1 font-vcr text-mar text-xxs">
            {cartItems.length}
          </div>
        )}
        <div
          className="relative w-8 h-4/5 flex items-center justify-center cursor-pointer"
          onClick={() => lensConnected && setOpenAccount(!openAccount)}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${
              lensConnected?.metadata?.picture?.__typename === "ImageSet" &&
              (lensConnected.metadata.picture as ImageSet)?.raw.uri
                ? (lensConnected.metadata.picture as ImageSet)?.raw.uri.split(
                    "ipfs://"
                  )[1]
                : (lensConnected?.metadata?.picture as NftImage)?.image.raw.uri
                ? (
                    lensConnected?.metadata?.picture as NftImage
                  )?.image.raw.uri?.split("ipfs://")[1]
                : "QmeSSwZt92PgMfvdJih9yyypQGX8gFx3BoLXn3mXwYX5pb"
            }`}
            layout="fill"
            draggable={false}
          />
        </div>
      </div>
      {openAccount && (
        <div className="absolute w-24 h-fit right-3 top-12 flex items-center justify-center p-2 text-white flex-col font-vcr rounded-sm bg-black/80 text-xs gap-4 z-30">
          <div
            className="relative w-fit h-fit flex items-center justify-center cursor-pointer hover:opacity-80"
            onClick={() => router.push("/")}
          >
            Profile
          </div>
          <div
            className="relative w-fit h-fit flex items-center justify-center cursor-pointer hover:opacity-80"
            onClick={openAccountModal}
          >
            Logout
          </div>
        </div>
      )}
      {cartListOpen && (
        <div
          className="absolute z-30 w-60 right-3 top-12 h-72 rounded-sm bg-black/80 overflow-y-scroll flex flex-col p-3"
          id="milestone"
        >
          {cartItems?.length > 0 ? (
            <div className="relative flex flex-col gap-4 items-center justify-start w-full h-fit px-4 pt-2">
              {cartItems?.map((item, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative flex flex-col gap-2 w-full h-fit items-center justify-start"
                  >
                    <div className="relative w-full h-40 flex items-center justify-center rounded-sm ">
                      <Image
                        draggable={false}
                        layout="fill"
                        src={`${INFURA_GATEWAY}/ipfs/`}
                        className="rounded-sm"
                        objectFit="cover"
                      />
                    </div>
                    <div className="relative text-sm font-vcr text-white text-center items-center justify-center w-fit h-fit flex break-words"></div>
                    <div className="relative flex flex-row items-center justify-between gap-2 w-fit h-fit">
                      <div
                        className="relative font-dog items-center justify-center w-fit h-fit text-center cursor-pointer active:scale-95 text-white text-xs"
                        onClick={() => {
                          const newItems = cartItems.filter(
                            (value: CartItem) =>
                              value.collectionId !== item.collectionId
                          );
                          dispatch(setCartItems(newItems));
                        }}
                      >
                        x
                      </div>
                      <div className="relative w-fit h-fit items-center justify-center font-vcr text-lg text-white break-words text-center">
                        ${item.amount}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="relative flex items-center justify-center font-dog text-white text-xxs break-words w-full h-full text-center">
              No Items <br /> In Cart Yet.
            </div>
          )}
          <div
            className={`relative w-full h-10 rounded-md bg-emeral border border-black flex items-center justify-center font-dog text-white text-xs break-words text-center ${
              cartItems?.length > 0
                ? "cursor-pointer active:scale-95"
                : "opacity-70"
            }`}
            onClick={() => {
              if (cartItems?.length > 0) {
                setCartListOpen(false);
                router.push("/checkout");
              }
            }}
          >
            checkout
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
