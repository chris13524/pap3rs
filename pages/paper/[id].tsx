import { AppShell, Center, Header, Navbar } from "@mantine/core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import Logo from "../../components/logo";

const Paper: NextPage = () => {
    const cid = "https://bafybeihwynhkv3kkxi7snayboj66vfyqa73wp6uxshogsedwfjoduizgmy";
    const filename = "Towards%20a%20Decentralized%20Process%20for%20Scientific%20Publication%20and%20Peer%20Review.pdf";
    const src = `${cid}.ipfs.dweb.link/${filename}`;

    return (
        <iframe src={src} style={{
            width: "100%",
            height: "100%",
        }}></iframe>
    );
};

export default Paper;
