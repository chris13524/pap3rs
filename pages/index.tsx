import { Paper as MPaper, Stack, Title, Text, Grid } from "@mantine/core";
import type { NextPage } from "next";
import { useAccount, useSigner } from "wagmi";
import { usePapersContract } from "../utils/contracts";
import { NextLink } from "@mantine/next";
import { useEffect, useState } from "react";
import { retrieveJson } from "../utils/ipfs";
import { Paper } from "../utils/paper";

const featuredPapers = [
  "bafybeifizkg427yhygjjbhy2uylpa7dq32wnw54zbbuusemgw6qcxoprri",
  "bafybeidugsonwrnlr5wfrmi5r7beqkhx6pphegu5kgn4eeqwrdf7e3mw6y",
  "bafybeib7d2fya6d2fjhsq7mbzaeksnw7jkhlzbmk3s6zskmced6xuies7a",
];

const Home: NextPage = () => {
  const { data: signer, isError: isError2, isLoading: isLoading2 } = useSigner();
  const { data: account, isError, isLoading, address, isConnected } = useAccount();

  const contract = usePapersContract(signer);
  // console.log(contract);
  // console.log(`isConnected=${isConnected}`);

  const [papers, setPapers] = useState<{ id: string, paper: Paper }[]>([]);
  useEffect(() => {
    (async () => {
      const papers = [];
      for (const paper of featuredPapers) {
        papers.push({ id: paper, paper: await retrieveJson<Paper>(paper) });
      }
      setPapers(papers);
    })();
  }, []);

  return (
    <Stack p="md">
      <Title order={1}>Pap3rs</Title>

      <Text>Academic papers published on IPFS. Papers can link to each other using metadata, are versioned on Ceramic, and a smart contract can be used to fund research projects.</Text>

      <Grid>
        {papers.map(paper => (
          <Grid.Col md={6} lg={4} key={paper.id}>
            <MPaper shadow="xs" p="md" component={NextLink} href={`/paper/${paper.id}`}>
              <Title order={4}>{paper.paper.title}</Title>
              <Text lineClamp={4}>{paper.paper.description}</Text>
            </MPaper>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
};

export default Home;
