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
import { ACCEPTED_TOKENS_MUMBAI } from "../../lib/constants";

const Checkout: NextPage<{
  router: NextRouter;
  client: LitNodeClient;
}> = ({ router, client }): JSX.Element => {
  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();
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
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const filtersOpen = useSelector(
    (state: RootState) => state.app.filtersOpenReducer
  );
  const cartAnim = useSelector(
    (state: RootState) => state.app.cartAnimReducer.value
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
    collectItem,
    collectPostLoading,
    encryptFulfillment,
    encryptionLoading,
    setDetails,
    details,
    openDropdown,
    setOpenDropdown,
    checkoutCurrency,
    setCheckoutCurrency,
    encryptedStrings,
    approveSpend,
    isApprovedSpend,
    chooseCartItem,
    setChooseCartItem,
    setEncryptedStrings,
    completedPurchases,
    groupedByPubId,
    setCompletedPurchases,
  } = useCheckout(
    publicClient,
    dispatch,
    address,
    lensConnected,
    client,
    oracleData,
    cartItems
  );

  return (
    <div
      className={`relative w-full flex flex-col items-start justify-center h-full min-h-screen`}
    >
      <Head>
        <title>Checkout</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header
        cartAnim={cartAnim}
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
      <div className="relative w-full h-fit flex items-start justify-start flex-row px-4">
        <Fulfillment
          setEncryptedStrings={setEncryptedStrings}
          collectPostLoading={collectPostLoading}
          details={details}
          encryptionLoading={encryptionLoading}
          encryptFulfillment={encryptFulfillment}
          setDetails={setDetails}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          encryptedStrings={encryptedStrings}
          total={cartItems?.reduce((sum, item) => sum + Number(item.price), 0)}
          checkoutCurrency={checkoutCurrency}
          rate={Number(
            oracleData?.find(
              (oracle) =>
                oracle.currency ===
                ACCEPTED_TOKENS_MUMBAI.find(
                  (item) => item[2] === checkoutCurrency
                )?.[2]
            )?.rate
          )}
          setCheckoutCurrency={setCheckoutCurrency}
          cartItems={cartItems}
          collectItem={collectItem}
          isApprovedSpend={isApprovedSpend}
          approveSpend={approveSpend}
          chooseCartItem={chooseCartItem}
        />
        <Cart
          router={router}
          cartItems={cartItems}
          chooseCartItem={chooseCartItem}
          setChooseCartItem={setChooseCartItem}
          collectPostLoading={collectPostLoading}
          completedPurchases={completedPurchases}
          groupedByPubId={groupedByPubId}
          dispatch={dispatch}
          setCompletedPurchases={setCompletedPurchases}
        />
      </div>
    </div>
  );
};

export default Checkout;
