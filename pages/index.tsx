import { Title } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Pap3rs</title>
        <meta name="description" content="Academic papers published on IPFS" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Title order={1}>Pap3rs</Title>
    </>
  );
};

export default Home;
