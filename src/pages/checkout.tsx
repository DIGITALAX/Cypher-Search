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
import { useTranslation } from "./_app";

const Checkout: NextPage<{
  router: NextRouter;
  client: LitNodeClient;
  tCom: (key: string | number) => string;
}> = ({ router, client }): JSX.Element => {
  const dispatch = useDispatch();
  const { t, setLocale, locale } = useTranslation();
  const { address, isConnected } = useAccount();
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const walletConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const filterChange = useSelector(
    (state: RootState) => state.app.filterChangeReducer.change
  );
  const searchActive = useSelector(
    (state: RootState) => state.app.searchActiveReducer.value
  );
  const fullScreenVideo = useSelector(
    (state: RootState) => state.app.fullScreenVideoReducer
  );
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const filtersOpen = useSelector(
    (state: RootState) => state.app.filtersOpenReducer
  );
  const header = useSelector((state: RootState) => state.app.headerSlice.value);
  const allSearchItems = useSelector(
    (state: RootState) => state.app.searchItemsReducer
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
    handleLogout,
  } = useSignIn(
    publicClient,
    address,
    isConnected,
    dispatch,
    oracleData,
    cartItems,
    lensConnected,
    cartAnim,
    openAccountModal
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
    groupedByPubId,
    approveLoading,
    chosenVariation,
    setChosenVariation,
  } = useCheckout(
    publicClient,
    dispatch,
    address,
    lensConnected,
    client,
    oracleData,
    cartItems,
    router,
    t
  );
  return (
    <div
      className={`relative w-full flex flex-col items-start justify-center h-fit overflow-y-scroll grow`}
    >
      <Head>
        <title>Checkout</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="og:url"
          content={"https://cypher.digitalax.xyz/card.png/"}
        />
      </Head>
      <Header
        locale={locale}
        header={header}
        t={t}
        setLocale={setLocale}
        filterChange={filterChange}
        fullScreenVideo={fullScreenVideo}
        searchItems={allSearchItems}
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
        handleLogout={handleLogout}
        dispatch={dispatch}
        includeSearch={false}
      />
      <div className="relative w-full h-fit flex items-start justify-start flex-col md:flex-row gap-4 md:flex-nowrap flex-wrap px-4 md:pt-auto pt-32">
        <Fulfillment
          t={t}
          collectPostLoading={collectPostLoading}
          details={details}
          encryptionLoading={encryptionLoading}
          encryptFulfillment={encryptFulfillment}
          setDetails={setDetails}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          encryptedStrings={encryptedStrings}
          total={cartItems?.reduce(
            (sum, item) => sum + Number(item?.price) * Number(item?.buyAmount),
            0
          )}
          checkoutCurrency={checkoutCurrency}
          rate={Number(
            oracleData?.find(
              (oracle) =>
                oracle.currency?.toLowerCase() ===
                checkoutCurrency?.toLowerCase()
            )?.rate
          )}
          setCheckoutCurrency={setCheckoutCurrency}
          cartItems={cartItems}
          collectItem={collectItem}
          isApprovedSpend={isApprovedSpend}
          approveSpend={approveSpend}
          chooseCartItem={chooseCartItem}
          approveLoading={approveLoading}
          groupedByPubId={groupedByPubId}
        />
        <Cart
          router={router}
          t={t}
          cartItems={cartItems}
          chooseCartItem={chooseCartItem}
          setChooseCartItem={setChooseCartItem}
          collectPostLoading={collectPostLoading}
          groupedByPubId={groupedByPubId}
          dispatch={dispatch}
          chosenVariation={chosenVariation}
          setChosenVariation={setChosenVariation}
          encryptedStrings={encryptedStrings}
        />
      </div>
    </div>
  );
};

export default Checkout;
