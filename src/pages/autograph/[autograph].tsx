import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import useAutograph from "@/components/Autograph/hooks/useAutograph";
import RouterChange from "@/components/Common/modules/RouterChange";
import NotFound from "@/components/Common/modules/NotFound";
import useSearch from "@/components/Search/hooks/useSearch";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import useSignIn from "@/components/Layout/hooks/useSignIn";
import Web from "@/components/Autograph/modules/Web";
import Bio from "@/components/Autograph/modules/Bio";
import Feed from "@/components/Autograph/modules/Feed";
import Gallery from "@/components/Autograph/modules/Gallery";

const Autograph: NextPage = (): JSX.Element => {
  const autoDispatch = useSelector(
    (state: RootState) => state.app.autographReducer
  );
  const router = useRouter();
  const { autograph } = router.query;
  const dispatch = useDispatch();
  const [globalLoading, setGlobalLoading] = useState<boolean>(true);
  const searchActive = useSelector(
    (state: RootState) => state.app.searchActiveReducer.value
  );
  const walletConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const filtersOpen = useSelector(
    (state: RootState) => state.app.filtersOpenReducer.value
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.items
  );
  const { handleShuffleSearch } = useSearch();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const {
    handleLensConnect,
    openAccount,
    setOpenAccount,
    signInLoading,
    cartListOpen,
    setCartListOpen,
  } = useSignIn();
  const {
    profileLoading,
    notFound,
    getProfileData,
    setScreenDisplay,
    screenDisplay,
    sortType,
    setSortType,
  } = useAutograph();

  useEffect(() => {
    if (autograph && !profileLoading) {
      getProfileData(autograph as string);
    }
  }, [autograph]);

  useEffect(() => {
    setTimeout(() => {
      if (!profileLoading) {
        setGlobalLoading(false);
      }
    }, 1000);
  }, [profileLoading]);

  console.log(lensConnected);

  if (!profileLoading && !globalLoading) {
    return (
      <>
        {notFound ? (
          <NotFound
            router={router}
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
            openAccountModal={openAccountModal}
            dispatch={dispatch}
            handleShuffleSearch={handleShuffleSearch}
          />
        ) : (
          autoDispatch.profile && (
            <div className="relative flex flex-col w-full h-full" id="results">
              <Head>
                <title>
                  Chromadin |{" "}
                  {autoDispatch.profile?.handle?.localName?.toUpperCase()}
                </title>
                <meta
                  name="og:url"
                  content={`https://chromadin.xyz/autograph/${autoDispatch.profile?.handle?.localName}`}
                />
                <meta
                  name="og:title"
                  content={autoDispatch.profile?.handle?.localName?.toUpperCase()}
                />
                <meta
                  name="og:description"
                  content={autoDispatch.profile?.metadata?.bio}
                />
                <meta
                  name="og:image"
                  content={
                    !autoDispatch?.display?.public?.main?.images?.[0]
                      ? "https://chromadin.xyz/card.png/"
                      : `https://chromadin.infura-ipfs.io/ipfs/${autoDispatch?.display?.public?.main?.images?.[0]?.split(
                          "ipfs://"
                        )}`
                  }
                />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@digitalax" />
                <meta name="twitter:creator" content="@digitalax" />
                <meta
                  name="twitter:image"
                  content={`https://chromadin.xyz/autograph/${autoDispatch.profile?.handle?.localName}`}
                />
                <meta
                  name="twitter:url"
                  content={`https://chromadin.xyz/autograph/${autoDispatch.profile?.handle?.localName}`}
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                  rel="canonical"
                  href={"https://cypher.digitalax.xyz/card.png/"}
                />
                <link
                  rel="preconnect"
                  href="https://fonts.gstatic.com"
                  crossOrigin="anonymous"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/ArcadeClassic.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/DSDigi.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/EarlsRevenge.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/Geometria.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/ClashDisplay.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/DosisRegular.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/EconomicaBold.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/EconomicaRegular.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/Manaspc.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
              </Head>
              <Web
                router={router}
                handleShuffleSearch={handleShuffleSearch}
                openConnectModal={openConnectModal}
                autograph={autoDispatch}
                handleLensConnect={handleLensConnect}
                walletConnected={walletConnected}
                lensConnected={lensConnected}
                openAccountModal={openAccountModal}
                screenDisplay={screenDisplay}
                setScreenDisplay={setScreenDisplay}
                sortType={sortType}
                setSortType={setSortType}
              />
              <Bio />
              <div className="relative flex flex-row gap-3 items-start justify-between">
                <Feed />
                <Gallery />
              </div>
            </div>
          )
        )}
      </>
    );
  }

  return <RouterChange />;
};

export default Autograph;
