import "../styles/globals.css";
import type { AppProps } from "next/app";

import "@rainbow-me/rainbowkit/styles.css";
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from "wagmi";
// import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  // [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  // [
  //   alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }),
  //   publicProvider(),
  // ],
  [/*chain.localhost, */chain.polygonMumbai],
  [publicProvider()],
);

// console.log("chains:", chain);

const { connectors } = getDefaultWallets({
  appName: "Pap3rs",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

import Layout from "../components/layout";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ApolloProvider } from "@apollo/client";
import { graphClient } from "../utils/graph";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <ApolloProvider client={graphClient}>
          <MantineProvider>
            <NotificationsProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </NotificationsProvider>
          </MantineProvider>
        </ApolloProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
