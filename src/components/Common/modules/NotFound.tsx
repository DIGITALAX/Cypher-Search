import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Image from "next/legacy/image";
import Link from "next/link";
import Accounts from "./Accounts";
import { NotFoundProps } from "../types/common.types";

const NotFound: FunctionComponent<NotFoundProps> = ({
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
  handleShuffleSearch,
  cartAnim,
  fullScreenVideo,
}): JSX.Element => {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center">
      <Link
        className={`absolute top-2 left-2 w-10 h-10 flex cursor-pointer active:scale-95 items-center justify-center`}
        href={"/"}
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmYbjMNQAVuQSWNNQ5AKbQtt4Dxw2ax4SvLNwKhCNDniL2`}
          layout="fill"
          draggable={false}
        />
      </Link>
      <div
        className="relative w-11/12 h-60 sm:w-4/5 md:w-2/3 sm:h-2/3 flex items-center justify-center cursor-pointer hover:opacity-70"
        onClick={() => {
          handleShuffleSearch();
          router.push("/");
        }}
      >
        <Image
          layout="fill"
          objectFit="contain"
          src={`${INFURA_GATEWAY}/ipfs/Qma4968Gu8irNB74GJqg9xMqs8g4aDYqsx5pTUgJAUBD28`}
          draggable={false}
          priority
        />
      </div>
      <div className="absolute right-2 top-2 flex">
        <Accounts
          fullScreenVideo={fullScreenVideo}
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
          auto
          cartAnim={cartAnim}
        />
      </div>
    </div>
  );
};

export default NotFound;
