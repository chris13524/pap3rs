import { Title } from "@mantine/core";
import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import { useAccount, useSigner } from "wagmi";
import { usePapersContract } from "../utils/contracts";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {

  const { data: signer, isError: isError2, isLoading: isLoading2 } = useSigner();
  const { data: account, isError, isLoading, address, isConnected } = useAccount();

  const contract = usePapersContract(signer);
  console.log(contract);
  console.log(`isConnected=${isConnected}`);

  return (
    <>
      <Head>
        <title>Pap3rs</title>
        <meta name="description" content="Academic papers published on IPFS" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Title order={1}>Pap3rs</Title>

      {isConnected &&
        <div>
          <p>Academic papers published on IPFS. Papers can link to each other using metadata, are versioned on Ceramic, and a smart contract can be used to fund research projects.</p>
        </div>
      }

    </>
  );
};

export default Home;
