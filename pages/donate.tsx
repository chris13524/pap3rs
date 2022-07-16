import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";

import { useAccount, useSigner } from "wagmi";
import { usePapersContract, useMockTokenContract } from "../utils/contracts";

async function approve(contract,cid) {
  console.log(`Awaiting claim call for cid: ${cid}`);
  await contract.claim(cid);
  console.log(`Finished claim call for cid: ${cid}`);
}

const Upload: NextPage = () => {

  const { data: signer, isError: isError2, isLoading: isLoading2 } = useSigner();
  const { data: account, isError, isLoading, address, isConnected } = useAccount();

  const contract = usePapersContract(signer);
  console.log("signer",signer);
  console.log("contract",contract);
  const mockTokenContract = useMockTokenContract(signer);
  console.log("mockTokenContract",mockTokenContract);

  let donationAmount = 100;
  let cid = "bafybeihwynhkv3kkxi7snayboj66vfyqa73wp6uxshogsedwfjoduizgmy";

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
    console.log(`Going to donate ${donationAmount} to CID ${cid} via contract: ${contract.address}`);
    await contract.donate(cid, `${contract.address}`, `${donationAmount}000000000000000000`);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Donate to Paper</title>
        <meta name="description" content="Donate to Paper" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Donate to Paper</h1>

        <p className={styles.description}>
        cid
          <input type="text" value={cid}/>
        donationAmount
          <input type="text" value={donationAmount}/>
          <button
            className="btn btn-warning"
            type="button"
            onClick={approve}
          >
          Approve {donationAmount}
          </button>
          <button
            className="btn btn-warning"
            type="button"
            onClick={donate}
          >
          Donate {donationAmount}
          </button>
        </p>
      </main>
    </div>
  );
};

export default Upload;
