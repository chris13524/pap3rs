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
    <MantineProvider theme={{ colorScheme: "light" }} withGlobalStyles withNormalizeCSS>
      <AppShell
        padding={0}
        header={
          <Header height={60}>
            <Group sx={{ height: '100%' }} px={20} position="apart">
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
          },
        })}
      >
        {children}
      </AppShell>
    </MantineProvider>
  </>;
};

export default Layout;
