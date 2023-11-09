import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import { ImageSet, NftImage } from "../../../../graphql/generated";
import { setCartItems } from "../../../../redux/reducers/cartItemsSlice";
import { AccountsProps, CartItem } from "../types/common.types";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";

const Accounts: FunctionComponent<AccountsProps> = ({
  searchActive,
  filtersOpen,
  lensConnected,
  walletConnected,
  handleLensConnect,
  openConnectModal,
  setOpenAccount,
  cartItems,
  openAccount,
  cartListOpen,
  signInLoading,
  setCartListOpen,
  router,
  openAccountModal,
  dispatch,
  auto,
}): JSX.Element => {
  const profilePicture = createProfilePicture(lensConnected?.metadata?.picture);
  return (
    <>
      <div
        className={`w-fit h-10 flex flex-row gap-4 items-center justify-center ${
          (searchActive || filtersOpen) && !auto
            ? "absolute top-2 right-2 sm:top-auto sm:right-auto sm:relative"
            : "relative"
        }`}
      >
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
          className="relative w-8 h-4/5 flex items-center justify-center cursor-pointer rounded-full"
          id="pfp"
          onClick={() => lensConnected && setOpenAccount(!openAccount)}
        >
          {profilePicture && (
            <Image src={profilePicture} className="rounded-full" layout="fill" draggable={false} />
          )}
        </div>
      </div>
      {openAccount && (
        <div className="absolute w-32 h-fit right-3 top-14 sm:top-24 tablet:top-16 flex items-center justify-center text-sol flex-col font-bit rounded-sm bg-black text-xs z-30 border border-sol">
          <div
            className="relative w-full h-full flex items-center justify-center border-sol cursor-pointer hover:opacity-80 border-b"
            onClick={() => {
              setOpenAccount(false);
              router.push(
                `/autograph/${
                  lensConnected?.handle?.suggestedFormatted?.localName?.split(
                    "@"
                  )[1]
                }`
              );
            }}
          >
            <div className="relative w-fit h-fit items-center justify-center p-2 flex">
              Autograph
            </div>
          </div>
          <div
            className="relative w-full h-full flex items-center justify-center cursor-pointer hover:opacity-80"
            onClick={openAccountModal}
          >
            <div className="relative w-fit h-fit items-center justify-center p-2 flex">
              Logout
            </div>
          </div>
        </div>
      )}
      {cartListOpen && (
        <div
          className="absolute z-30 w-60 right-3 top-20 top-14 sm:top-24 tablet:top-16 h-72 rounded-sm bg-black overflow-y-scroll flex flex-col p-3 border border-sol"
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
                              value?.item?.collectionId !==
                              item?.item?.collectionId
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
            className={`relative w-full h-10 rounded-sm bg-sol border border-black flex items-center justify-center font-bit text-black text-sm break-words text-center ${
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
            Checkout
          </div>
        </div>
      )}
    </>
  );
};

export default Accounts;
