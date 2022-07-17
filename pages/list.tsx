import React, { useState, useEffect } from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { useSigner } from "wagmi";
import { usePapersContract } from "../utils/contracts";

const List: NextPage = () => {
  const { data: signer } = useSigner();
  const contract = usePapersContract(signer);

  const [cids, setCids] = useState([]);
  useEffect(() => {
    if (signer) {
      (async () => {
        setCids(await contract.listCids());
      })();
    }
  }, [signer]);

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
