import { Title } from "@mantine/core";
import type { NextPage } from "next";
import Link from 'next/link';
import Head from "next/head";
import { useAccount, useSigner } from 'wagmi';
import { usePapersContract } from '../utils/contracts';
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {

    const { data: signer, isError: isError2, isLoading: isLoading2 } = useSigner();
    const { data: account, isError, isLoading, address, isConnected } = useAccount();

    const contract = usePapersContract(signer);
    console.log(contract);
    console.log(`isConnected=${isConnected}`);

    //var name = await contract.name();

  async function loadName() {
      var name = await contract.name();
      console.log(`Contract name: ${name}`);
  }

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
      <button
            className="btn btn-warning"
            type="button"
            onClick={loadName}
          >
            loadName
          </button>
          <Link href="/upload"><a className={styles.link}>Upload</a></Link>
          </div>
      }

    </>
  );
};

export default Home;
