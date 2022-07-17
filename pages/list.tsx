import React, { useState, useEffect } from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

import { useAccount, useSigner } from "wagmi";
import { usePapersContract } from "../utils/contracts";

const List: NextPage = () => {
  const { data: signer, isError: isError2, isLoading: isLoading2 } = useSigner();
  const { data: account, isError, isLoading, address, isConnected } = useAccount();

  const contract = usePapersContract(signer);

  const [cids, setCids] = useState([]);

  async function listCids() {
    try {
      console.log('loading pages')
      setCids(await contract.listCids());
      console.log(`pages loaded`, cids);
    } catch (error) {
      console.error("Error getting cid list: ", error);
    }
  }

  useEffect(() => {
    // Update the document title using the browser API
    listCids();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>List of papers</title>
        <meta name="description" content="List of papers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>List of papers</h1>
        {cids.length > 0 &&
          <ul>
            {cids.map(function (cid) {
              return <li key={cid}><Link href={"/paper/" + cid}>{cid}</Link></li>;
            })}
          </ul>
        }
      </main>
    </div>
  );
};

export default List;
