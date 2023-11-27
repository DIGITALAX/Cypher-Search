import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import { setCartItems } from "../../../../redux/reducers/cartItemsSlice";
import { AccountsProps, CartItem } from "../types/common.types";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import { setCypherStorageCart } from "../../../../lib/utils";
import { setFiltersOpen } from "../../../../redux/reducers/filtersOpenSlice";
import { setPostBox } from "../../../../redux/reducers/postBoxSlice";
import { ImCross } from "react-icons/im";
import { setFullScreenVideo } from "../../../../redux/reducers/fullScreenVideoSlice";
import handleImageError from "../../../../lib/helpers/handleImageError";
import CartList from "./CartList";

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
  handleLogout,
  dispatch,
  auto,
  cartAnim,
  fullScreenVideo,
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
          id={cartAnim ? "cartAnim" : ""}
          title="Cart"
          onClick={() => setCartListOpen(!cartListOpen)}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmT5ewiqFhfo8EHxSYiFwFR67pBpg7xesdtwAu9oWBoqqu`}
            layout="fill"
            draggable={false}
          />
        </div>
        {cartItems?.length > 0 && (
          <div className="absolute rounded-full border border-mar bg-black w-5 flex items-center justify-center right-[8.5rem] -bottom-1 h-5 p-1 font-vcr text-mar text-xxs z-1">
            {cartItems?.length}
          </div>
        )}

        <div
          className="relative w-8 h-4/5 flex items-center justify-center cursor-pointer active:scale-95"
          onClick={() =>
            dispatch(
              setFullScreenVideo({
                actionOpen: fullScreenVideo?.open ? false : true,
                actionTime: fullScreenVideo?.currentTime,
                actionDuration: fullScreenVideo?.duration,
                actionIsPlaying: fullScreenVideo?.isPlaying,
                actionVolume: fullScreenVideo?.volume,
                actionVolumeOpen: fullScreenVideo?.volumeOpen,
                actionAllVideos: fullScreenVideo?.allVideos,
                actionCursor: fullScreenVideo?.cursor,
                actionIndex: fullScreenVideo?.index,
              })
            )
          }
          title="The Dial Pirate Radio"
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmUkpLp5Jf9NB9eT6dCupJa9fGvA2NkuzTKkqA1uaNFqXL`}
            layout="fill"
            draggable={false}
          />
        </div>
        <div
          className="relative w-8 h-4/5 flex items-center justify-center cursor-pointer active:scale-95"
          onClick={
            !walletConnected
              ? openConnectModal
              : walletConnected && !lensConnected
              ? () => handleLensConnect()
              : () =>
                  dispatch(
                    setPostBox({
                      actionOpen: true,
                    })
                  )
          }
          title="Make Post"
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmeNsRR8iiJBZgyeMsnESEKbZPDMB8RFKXxBYC3xYfPovK`}
            layout="fill"
            draggable={false}
          />
        </div>
        {lensConnected && (
          <div
            className="relative w-8 h-4/5 flex items-center justify-center cursor-pointer rounded-full"
            id="pfp"
            onClick={() => lensConnected && setOpenAccount(!openAccount)}
          >
            {profilePicture && (
              <Image
                src={profilePicture}
                className="rounded-full"
                layout="fill"
                draggable={false}
                objectFit="cover"
                onError={(e) => handleImageError(e)}
              />
            )}
          </div>
        )}
      </div>
      {openAccount && (
        <div className="absolute w-32 h-fit right-3 top-14 sm:top-24 tablet:top-16 flex items-center justify-center text-sol flex-col font-bit rounded-sm bg-black text-xs z-30 border border-sol">
          <div
            className="relative w-full h-full flex items-center justify-center border-sol cursor-pointer hover:opacity-80 border-b"
            onClick={() => {
              setOpenAccount(false);
              dispatch(
                setFiltersOpen({
                  actionValue: false,
                  actionAllow: false,
                })
              );
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
            onClick={() => handleLogout()}
          >
            <div className="relative w-fit h-fit items-center justify-center p-2 flex">
              Logout
            </div>
          </div>
        </div>
      )}
      {cartListOpen && (
        <CartList
          dispatch={dispatch}
          router={router}
          cartItems={cartItems}
          setCartListOpen={setCartListOpen}
        />
      )}
    </>
  );
};

export default Accounts;
