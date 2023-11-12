import { NextPage } from "next";
import Head from "next/head";
import { NextRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Fulfillment from "@/components/Checkout/modules/Fulfillment";
import useCheckout from "@/components/Checkout/hooks/useCheckout";
import Cart from "@/components/Checkout/modules/Cart";
import Header from "@/components/Layout/modules/Header";
import useSignIn from "@/components/Layout/hooks/useSignIn";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { useAccount } from "wagmi";
import { polygon } from "viem/chains";
import { createPublicClient, http } from "viem";

const Checkout: NextPage<{
  router: NextRouter;
  client: LitNodeClient;
}> = ({ router, client }): JSX.Element => {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
  const walletConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const searchActive = useSelector(
    (state: RootState) => state.app.searchActiveReducer.value
  );
  const filtersOpen = useSelector(
    (state: RootState) => state.app.filtersOpenReducer
  );
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.items
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
  } = useSignIn(dispatch);
  const {
    collectItem,
    collectPostLoading,
    encryptFulfillment,
    encryptionLoading,
    setDetails,
    details,
  } = useCheckout(publicClient, dispatch, address, client, cartItems);

  return (
    <div
      className={`relative w-full flex flex-col items-start justify-center h-full min-h-screen`}
    >
      <Head>
        <title>Checkout</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header
        searchActive={searchActive}
        filtersOpen={filtersOpen?.value}
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
        openAccountModal={openAccountModal}
        dispatch={dispatch}
        includeSearch={false}
      />
      <div className="relative w-full h-full flex items-start justify-start flex-col py-2 gap-5 px-6 top-20">
        <div className="relative w-fit h-fit flex items-center justify-center font-aust text-3xl text-white">
          Checkout
        </div>
        <div className="relative w-96 h-fit flex items-center justify-center break-words font-bit text-white text-xs">
          Claim your cart. Each Lens collect is unique like you—one by one
          checkouts give them that personal touch. No batch buys at this time.
        </div>
        <div className="relative w-full h-fit flex items-start justify-center flex-row">
          <Cart
            collectItem={collectItem}
            collectPostLoading={collectPostLoading}
            router={router}
          />
          {
          
        //   cartItems?.find((item) => item.item.origin !== "1") && 
          
          (
            
            
            <Fulfillment
              details={details}
              dispatch={dispatch}
              encryptionLoading={encryptionLoading}
              encryptFulfillment={encryptFulfillment}
              setDetails={setDetails}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
