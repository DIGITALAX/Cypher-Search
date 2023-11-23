import RouterChange from "@/components/Common/modules/RouterChange";
import useSignIn from "@/components/Layout/hooks/useSignIn";
import useSearch from "@/components/Search/hooks/useSearch";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import Head from "next/head";
import { NextRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { createPublicClient, http } from "viem";
import { polygon, polygonMumbai } from "viem/chains";
import { useAccount } from "wagmi";
import { RootState } from "../../../../../redux/store";
import { useEffect, useState } from "react";
import useAutograph from "@/components/Autograph/hooks/useAutograph";
import useSuggested from "@/components/Common/hooks/useSuggested";
import useDrop from "@/components/Drop/hooks/useDrop";
import Suggested from "@/components/Common/modules/Suggested";
import DropMain from "@/components/Drop/modules/DropMain";
import useTiles from "@/components/Tiles/hooks/useTiles";
import useInteractions from "@/components/Tiles/hooks/useInteractions";
import NotFound from "@/components/Common/modules/NotFound";

const Drop: NextPage<{ router: NextRouter }> = ({ router }): JSX.Element => {
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
  const { autograph, drop } = router.query;
  const dispatch = useDispatch();
  const [globalLoading, setGlobalLoading] = useState<boolean>(true);
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const filterConstants = useSelector(
    (state: RootState) => state.app.filterConstantsReducer.items
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.items
  );
  const filtersOpen = useSelector(
    (state: RootState) => state.app.filtersOpenReducer
  );
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const fullScreenVideo = useSelector(
    (state: RootState) => state.app.fullScreenVideoReducer
  );
  const walletConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const searchActive = useSelector(
    (state: RootState) => state.app.searchActiveReducer.value
  );
  const filters = useSelector(
    (state: RootState) => state.app.filterReducer.filter
  );
  const cartAnim = useSelector(
    (state: RootState) => state.app.cartAnimReducer.value
  );
  const layoutAmount = useSelector(
    (state: RootState) => state.app.layoutSwitchReducer.value
  );
  const allSearchItems = useSelector(
    (state: RootState) => state.app.searchItemsReducer
  );
  const { address, isConnected } = useAccount();
  const { profileLoading, profile } = useAutograph(
    autograph as string,
    lensConnected
  );
  const { getMoreSuggested, suggestedFeed, loaders } = useSuggested(
    drop as string,
    profile,
    lensConnected
  );
  const { handleSearch, handleShuffleSearch, placeholderText } = useSearch(
    filtersOpen,
    lensConnected,
    searchActive,
    filterConstants,
    filters,
    suggestedFeed,
    dispatch,
    router
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
    mirror,
    like,
    collect,
    interactionsLoading,
    setOpenMirrorChoice,
    openMirrorChoice,
  } = useInteractions(
    suggestedFeed,
    dispatch,
    publicClient,
    address,
    lensConnected
  );
  const { dropLoading, dropItem, collections } = useDrop(
    drop as string,
    profile
  );
  const {
    setPopUpOpen,
    popUpOpen,
    apparel,
    setApparel,
    profileHovers,
    setProfileHovers,
    followLoading,
    followProfile,
    unfollowProfile,
  } = useTiles(
    suggestedFeed?.items || [],
    lensConnected,
    dispatch,
    publicClient,
    address
  );

  useEffect(() => {
    setTimeout(() => {
      if (!profileLoading && !dropLoading) {
        setGlobalLoading(false);
      }
    }, 1000);
  }, [profileLoading]);

  if (!profileLoading && !globalLoading && !dropLoading) {
    return (
      <>
        {!profile || collections?.length < 1 ? (
          <NotFound
            fullScreenVideo={fullScreenVideo}
            cartAnim={cartAnim}
            router={router}
            searchActive={searchActive}
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
        ) : (
          profile &&
          collections?.length > 0 && (
            <div
              className="relative flex flex-col w-full h-full flex-grow"
              id="results"
            >
              <Head>
                <title>
                  {(drop as string)?.toUpperCase()} |{" "}
                  {profile?.handle?.localName?.toUpperCase()}
                </title>
                <meta
                  name="og:url"
                  content={`https://cypher.digitalax.xyz/autograph/${
                    profile?.handle?.suggestedFormatted?.localName?.split(
                      "@"
                    )[1]
                  }`}
                />
                <meta
                  name="og:title"
                  content={profile?.handle?.localName?.toUpperCase()}
                />
                <meta name="og:description" content={profile?.metadata?.bio} />
                <meta
                  name="og:image"
                  content={
                    !dropItem?.cover
                      ? "https://cypher.digitalax.xyz/card.png/"
                      : `https://chromadin.infura-ipfs.io/ipfs/${dropItem?.cover?.split(
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
                  content={
                    !dropItem?.cover
                      ? "https://cypher.digitalax.xyz/card.png/"
                      : `https://chromadin.infura-ipfs.io/ipfs/${dropItem?.cover?.split(
                          "ipfs://"
                        )}`
                  }
                />
                <meta
                  name="twitter:url"
                  content={`https://cypher.digitalax.xyz/autograph/${
                    profile?.handle?.suggestedFormatted?.localName?.split(
                      "@"
                    )[1]
                  }`}
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
                  href="https://cypher.digitalax.xyz/fonts/Bitblox.otf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/otf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/Austral.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/otf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/Ignite.otf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/otf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/BebasNeue.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/Vcr.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/InternalRainbows.otf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/otf"
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
                  href="https://cypher.digitalax.xyz/fonts/Gamer.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/Network.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
                <link
                  rel="preload"
                  href="https://cypher.digitalax.xyz/fonts/Dogica.ttf"
                  as="font"
                  crossOrigin="anonymous"
                  type="font/ttf"
                />
              </Head>
              <Suggested
                fullScreenVideo={fullScreenVideo}
                moreSearchLoading={loaders?.moreSuggestedLoading}
                searchItems={suggestedFeed}
                cartAnim={cartAnim}
                component={
                  <DropMain
                    collections={collections}
                    handle={
                      profile?.handle?.suggestedFormatted?.localName?.split(
                        "@"
                      )?.[1]!
                    }
                    router={router}
                    dispatch={dispatch}
                    cartItems={cartItems}
                  />
                }
                handleSearch={handleSearch}
                allSearchItems={allSearchItems}
                openConnectModal={openConnectModal}
                handleLensConnect={handleLensConnect}
                handleLogout={handleLogout}
                lensConnected={lensConnected}
                walletConnected={walletConnected}
                openAccount={openAccount}
                setOpenAccount={setOpenAccount}
                signInLoading={signInLoading}
                filtersOpen={filtersOpen?.value}
                handleShuffleSearch={handleShuffleSearch}
                placeholderText={placeholderText}
                dispatch={dispatch}
                layoutAmount={layoutAmount}
                cartItems={cartItems}
                cartListOpen={cartListOpen}
                setCartListOpen={setCartListOpen}
                router={router}
                includeSearch
                handleMoreSearch={getMoreSuggested}
                popUpOpen={popUpOpen}
                setPopUpOpen={setPopUpOpen}
                apparel={apparel}
                setApparel={setApparel}
                mirror={mirror}
                like={like}
                simpleCollect={collect}
                interactionsLoading={interactionsLoading}
                setOpenMirrorChoice={setOpenMirrorChoice}
                openMirrorChoice={openMirrorChoice}
                searchLoading={loaders?.suggestedLoading}
                followLoading={followLoading}
                followProfile={followProfile}
                unfollowProfile={unfollowProfile}
                profileHovers={profileHovers}
                setProfileHovers={setProfileHovers}
              />
            </div>
          )
        )}
      </>
    );
  }

  return <RouterChange />;
};

export default Drop;
