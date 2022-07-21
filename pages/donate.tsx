import React, { useEffect, useState } from "react";
import { Text, Group, Button, createStyles, MantineTheme, useMantineTheme, Stack, Container, Title, TextInput, Textarea, MultiSelect } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";

import { useAccount, useSigner } from "wagmi";
import { usePapersContract, useMockTokenContract } from "../utils/contracts";

const Upload: NextPage = () => {

  const { data: signer, isError: isError2, isLoading: isLoading2 } = useSigner();
  const { data: account, isError, isLoading, address, isConnected } = useAccount();

  const [cid, setCid] = useState("");
  const [donationAmount, setDonationAmount] = useState("");

  const contract = usePapersContract(signer);
  const mockTokenContract = useMockTokenContract(signer);

  async function approve() {
    try {
      let tokenName = await mockTokenContract.name();
      console.log(`Going to approve ${donationAmount} ${tokenName}`);
      await mockTokenContract.approve(contract.address, `${donationAmount}000000000000000000`);
    }
    catch(error) {
      console.error("Error approving: ",error);
    }
  }

  async function donate() {
    try {
      console.log(`Going to donate ${donationAmount} to CID ${cid} via contract: ${contract.address}`);
      await contract.donate(cid, `${mockTokenContract.address}`, `${donationAmount}000000000000000000`);
    }
    catch(error) {
      console.error("Error approving: ",error);
    }
  }

  return (
    <div className={styles.container}>
        <form>
      <Head>
        <title>Donate to Paper</title>
        <meta name="description" content="Donate to Paper" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Donate to Paper</h1>

        <TextInput
          required
          label="Paper CID"
          value={cid}
          onChange={(e)=>  setCid(e.target.value)}
        />

        <TextInput
          required
          label="Donation Amount"
          value={donationAmount}
          onChange={(e)=>  setDonationAmount(e.target.value)}
        />

        <Button size="md" radius="xl" onClick={approve}>Approve {donationAmount}</Button>
        <Button size="md" radius="xl" onClick={donate}>Donate</Button>
      </main>
      </form>
    </div>
  );
};

export default Upload;
