import { AppShell, Center, Navbar, Title } from "@mantine/core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import Link from "next/link";
import { ReactNode } from "react";
import Logo from "./logo";

const Layout: NextPage<{ children: ReactNode }> = ({ children }) => {
    return <AppShell
        padding="md"
        navbar={
            <Navbar width={{ base: 300 }} p="xs">
                <Navbar.Section>
                    <Center><Logo /></Center>
                </Navbar.Section>
                <Navbar.Section>
                    <Link href="/">Home</Link>
                </Navbar.Section>
                <Navbar.Section>
                    <Link href="/paper/abc">View</Link>
                </Navbar.Section>
                <Navbar.Section>
                    <Link href="/upload">Upload</Link><br/>
                </Navbar.Section>
                <Navbar.Section grow>
                    <Link href="/donate">Donate</Link><br/>
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
            main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
    >
        {children}
    </AppShell>;
};

export default Layout;
