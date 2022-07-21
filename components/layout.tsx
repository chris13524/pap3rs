import { MantineProvider, AppShell, Center, Navbar } from "@mantine/core";
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
    <MantineProvider theme={{ colorScheme: 'light' }} withGlobalStyles withNormalizeCSS>
    <AppShell
      padding={0}
      navbar={
        <Navbar width={{ base: 300 }} p="xs">
          <Navbar.Section>
            <Center><Logo /></Center>
          </Navbar.Section>
          <Navbar.Section grow mt="xs">
            <NavLinks />
          </Navbar.Section>
          <Navbar.Section>
            <Center><ConnectButton /></Center>
            </Navbar.Section>
        </Navbar>
      }
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      {children}
    </AppShell>
    </MantineProvider>
  </>;
};

export default Layout;
