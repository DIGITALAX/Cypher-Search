import NotFound from "@/components/Common/modules/NotFound";
import useSignIn from "@/components/Layout/hooks/useSignIn";
import useSearch from "@/components/Search/hooks/useSearch";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import Head from "next/head";
import { NextRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { TFunction, i18n } from "i18next";

const Custom404: NextPage<{
  router: NextRouter;
  i18n: i18n;
  tCom: TFunction<"404", undefined>;
}> = ({ router, tCom, i18n }): JSX.Element => {
  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const cartAnim = useSelector(
    (state: RootState) => state.app.cartAnimReducer.value
  );
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const searchActive = useSelector(
    (state: RootState) => state.app.searchActiveReducer.value
  );
  const walletConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const filtersOpen = useSelector(
    (state: RootState) => state.app.filtersOpenReducer
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.items
  );
  const filterConstants = useSelector(
    (state: RootState) => state.app.filterConstantsReducer.items
  );
  const fullScreenVideo = useSelector(
    (state: RootState) => state.app.fullScreenVideoReducer
  );
  const filters = useSelector(
    (state: RootState) => state.app.filterReducer.filter
  );
  const allSearchItems = useSelector(
    (state: RootState) => state.app.searchItemsReducer
  );
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { handleShuffleSearch } = useSearch(
    filtersOpen,
    lensConnected,
    searchActive,
    filterConstants,
    filters,
    allSearchItems,
    dispatch,
    router
  );
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

  return (
    <>
      <Head>
        <title>Page Not Found</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NotFound
        i18n={i18n}
        fullScreenVideo={fullScreenVideo}
        router={router}
        cartAnim={cartAnim}
        searchActive={searchActive}
        t={tCom}
        filtersOpen={filtersOpen.value}
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
        handleLogout={handleLogout}
        dispatch={dispatch}
        handleShuffleSearch={handleShuffleSearch}
      />
    </>
  );
};

export default Custom404;

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["404", "footer"])),
  },
});
