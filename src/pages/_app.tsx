import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "./../../redux/store";
import { Provider } from "react-redux";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  Theme,
} from "@rainbow-me/rainbowkit";
import merge from "lodash.merge";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import Modals from "@/components/Modals/modules/Modals";
import RouterChange from "@/components/Common/modules/RouterChange";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Footer from "@/components/Layout/modules/Footer";

const walletTheme = merge(darkTheme(), {
  colors: {
    accentColor: "#111313",
  },
} as Theme);

const { chains, publicClient } = configureChains(
  [polygon],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! })]
);

const { connectors } = getDefaultWallets({
  appName: "Cypher Search",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const handleRewind = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const [routerChangeLoading, setRouterChangeLoading] =
    useState<boolean>(false);
  useEffect(() => {
    const handleStart = () => {
      setRouterChangeLoading(true);
    };

    const handleStop = () => {
      setRouterChangeLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  if (routerChangeLoading) {
    return <RouterChange />;
  }
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={walletTheme}>
        <Provider store={store}>
          <div className="relative w-full h-auto flex flex-col">
            <Component {...pageProps} />
            <Modals />
            <Footer handleRewind={handleRewind} />
          </div>
        </Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
