import { Paper, Stack, Title, Text, Grid, UnstyledButton } from "@mantine/core";
import type { NextPage } from "next";
import { useAccount, useSigner } from "wagmi";
import { usePapersContract } from "../utils/contracts";
import { NextLink } from "@mantine/next";

type Paper = {
  cid: string,
  title: string,
  description: string,
};

const featuredPapers: Paper[] = [
  { cid: "bafybeihwynhkv3kkxi7snayboj66vfyqa73wp6uxshogsedwfjoduizgmy", title: "Towards a Decentralized Process for Scientific Publication and Peer Review using Blockchain and IPFS", description: "The current processes of scientific publication and peer review raise concerns around fairness, quality, performance, cost, and accuracy. The Open Access movement has been unable to fulfill all its promises, and a few middlemen publishers can still impose policies and concentrate profits. This paper, using emerging distributed technologies such as Blockchain and IPFS, proposes a decentralized publication system for open science. The proposed system would provide (1) a distributed reviewer reputation system, (2) an Open Access by-design infrastructure, and (3) transparent governance processes. A survey is used to evaluate the problems, proposed solutions and possible adoption resistances, while a working prototype serves as a proof-of-concept. Additionally, the paper discusses the implementation, in a distributed context, of different privacy settings for both open peer review and reputation systems, introducing a novel approach supporting both anonymous and accountable reviews. The paper concludes reviewing the open challenges of this ambitious proposal." },
  { cid: "bafybeihwynhkv3kkxi7snayboj66vfyqa73wp6uxshogsedwfjoduizgm2", title: "decentralized papers 2", description: "my desc" },
];

const Home: NextPage = () => {

  const { data: signer, isError: isError2, isLoading: isLoading2 } = useSigner();
  const { data: account, isError, isLoading, address, isConnected } = useAccount();

  const contract = usePapersContract(signer);
  // console.log(contract);
  // console.log(`isConnected=${isConnected}`);

  return (
    <Stack p="md">
      <Title order={1}>Pap3rs</Title>

      <Text>Academic papers published on IPFS. Papers can link to each other using metadata, are versioned on Ceramic, and a smart contract can be used to fund research projects.</Text>

      <Grid>
        {featuredPapers.map(paper => (
          <Grid.Col md={6} lg={4} key={paper.cid}>
            <Paper shadow="xs" p="md" component={NextLink} href={`/paper/${paper.cid}`}>
              <Title order={4}>{paper.title}</Title>
              <Text lineClamp={4}>{paper.description}</Text>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
};

export default Home;
