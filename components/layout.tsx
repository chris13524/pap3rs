import { AppShell, Center, Navbar } from "@mantine/core";
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
      <link rel="icon" href="/favicon.png" />
    </Head>
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
      // header={<Header height={60} p="xs">{
      //     <></>
      // }</Header>}
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      {children}
    </AppShell>
  </>;
};

export default Layout;
