import { NextPage } from "next";
import { NextRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useAutograph from "@/components/Autograph/hooks/useAutograph";
import RouterChange from "@/components/Common/modules/RouterChange";
import NotFound from "@/components/Common/modules/NotFound";
import useSearch from "@/components/Search/hooks/useSearch";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import useSignIn from "@/components/Layout/hooks/useSignIn";
import { useAccount } from "wagmi";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { TFunction, i18n } from "i18next";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
const AutoHydrateSSR = dynamic(
  () => import("@/components/Autograph/modules/AutoHydrate"),
  {
    ssr: false,
  }
);

const Autograph: NextPage<{
  router: NextRouter;
  client: LitNodeClient;
  tCom: TFunction<"common", undefined>;
  i18n: i18n;
}> = ({ router, client, tCom, i18n }): JSX.Element => {
  // const dispatch = useDispatch();
  // const { address, isConnected } = useAccount();
  // const params = useParams<{ autograph: string }>();
  // const publicClient = createPublicClient({
  //   chain: polygon,
  //   transport: http(
  //     `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
  //   ),
  // });
  // const [globalLoading, setGlobalLoading] = useState<boolean>(true);
  // const fullScreenVideo = useSelector(
  //   (state: RootState) => state.app.fullScreenVideoReducer
  // );
  // const filterConstants = useSelector(
  //   (state: RootState) => state.app.filterConstantsReducer.items
  // );
  // const filters = useSelector(
  //   (state: RootState) => state.app.filterReducer.filter
  // );
  // const allSearchItems = useSelector(
  //   (state: RootState) => state.app.searchItemsReducer
  // );
  // const cartItems = useSelector(
  //   (state: RootState) => state.app.cartItemsReducer.items
  // );
  // const cartAnim = useSelector(
  //   (state: RootState) => state.app.cartAnimReducer.value
  // );
  // const searchActive = useSelector(
  //   (state: RootState) => state.app.searchActiveReducer.value
  // );
  // const filtersOpen = useSelector(
  //   (state: RootState) => state.app.filtersOpenReducer
  // );
  // const lensConnected = useSelector(
  //   (state: RootState) => state.app.lensConnectedReducer.profile
  // );
  // const oracleData = useSelector(
  //   (state: RootState) => state.app.oracleDataReducer.data
  // );
  // const walletConnected = useSelector(
  //   (state: RootState) => state.app.walletConnectedReducer.value
  // );
  // const { profileLoading, profile } = useAutograph(
  //   params?.autograph,
  //   lensConnected
  // );

  // const { openConnectModal } = useConnectModal();
  // const { openAccountModal } = useAccountModal();
  // const {
  //   handleLensConnect,
  //   openAccount,
  //   setOpenAccount,
  //   signInLoading,
  //   cartListOpen,
  //   setCartListOpen,
  //   handleLogout,
  // } = useSignIn(
  //   publicClient,
  //   address,
  //   isConnected,
  //   dispatch,
  //   oracleData,
  //   cartItems,
  //   lensConnected,
  //   cartAnim,
  //   openAccountModal
  // );
  // const { handleShuffleSearch } = useSearch(
  //   filtersOpen,
  //   lensConnected,
  //   searchActive,
  //   filterConstants,
  //   filters,
  //   allSearchItems,
  //   dispatch,
  //   router
  // );

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     if (
  //       !profileLoading
  //       //  && !feedLoading && !galleryLoading
  //     ) {
  //       setGlobalLoading(false);
  //     }
  //   }, 1000);

  //   return () => clearTimeout(timeoutId);
  // }, [
  //   profileLoading,
  //   // , feedLoading, galleryLoading
  // ]);

  // if (
  //   !profileLoading &&
  //   !globalLoading &&
  //   profile &&
  //   // !feedLoading &&
  //   // !galleryLoading &&
  //   i18n.isInitialized
  // ) {
    return ( <></>
      // <>
      //   {!profile ? (
      //     <NotFound
      //       t={tCom}
      //       i18n={i18n}
      //       fullScreenVideo={fullScreenVideo}
      //       cartAnim={cartAnim}
      //       router={router}
      //       searchActive={searchActive}
      //       filtersOpen={filtersOpen.value}
      //       lensConnected={lensConnected}
      //       walletConnected={walletConnected}
      //       handleLensConnect={handleLensConnect}
      //       openConnectModal={openConnectModal}
      //       setOpenAccount={setOpenAccount}
      //       cartItems={cartItems}
      //       openAccount={openAccount}
      //       cartListOpen={cartListOpen}
      //       signInLoading={signInLoading}
      //       setCartListOpen={setCartListOpen}
      //       handleLogout={handleLogout}
      //       dispatch={dispatch}
      //       handleShuffleSearch={handleShuffleSearch}
      //     />
      //   ) : (
      // profile && (
      // <AutoHydrateSSR
      //   router={router}
      //   tCom={tCom}
      //   dispatch={dispatch}
      //   lensConnected={lensConnected}
      //   publicClient={publicClient}
      //   address={address}
      //   client={client}
      //   profile={profile!}
      //   cartItems={cartItems}
      //   openConnectModal={openConnectModal}
      //   handleLensConnect={handleLensConnect}
      //   walletConnected={walletConnected}
      //   handleLogout={handleLogout}
      //   filterConstants={filterConstants}
      //   handleShuffleSearch={handleShuffleSearch}
      // />
    );
    // )
    // }
    //   </>
    // );
  // }

  // return <RouterChange />;
};

export default Autograph;

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: false,
  };
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", [
      "autograph",
      "footer",
      "common",
    ])),
  },
});
