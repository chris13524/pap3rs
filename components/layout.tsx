import { MantineProvider, AppShell, Center, Header, Group } from "@mantine/core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import Head from "next/head";
import { ReactNode } from "react";
import Logo from "./logo";
import NavLinks from "./navlinks";

const Layout: NextPage<{ children: ReactNode }> = ({ children }) => {
  return <>
    <Head>
      <title>Pap3rs</title>
      <meta name="description" content="Academic papers published on IPFS" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <MantineProvider theme={{ colorScheme: "dark", colors: {
      // override dark colors to change them for all components
      dark: [
        "#d5d7e0",
        "#acaebf",
        "#8c8fa3",
        "#666980",
        "#4d4f66",
        "#34354a",
        "#2b2c3d",
        "#1d1e30",
        "#0c0d21",
        "#01010a",
      ],
    } }} withGlobalStyles withNormalizeCSS>
      <AppShell
        padding={0}
        header={
          <Header height={60}>
            <Group sx={{ height: "100%" }} px={20} position="apart">
              <Logo />
              <NavLinks />
              <ConnectButton />
            </Group>
          </Header>
        }
        styles={theme => ({
          root: {
            height: "100vh",
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
            display: "flex",
            flexDirection: "column",
          },
          body: {
            flexGrow: 1,
            height: "calc(100% - 60px)",
          },
        })}
      >
        {children}
      </AppShell>
    </MantineProvider>
  </>;
};

export default Layout;
