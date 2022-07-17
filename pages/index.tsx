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
  { cid: "bafybeihwynhkv3kkxi7snayboj66vfyqa73wp6uxshogsedwfjoduizgmy", title: "decentralized papers", description: "my desc" },
  { cid: "bafybeihwynhkv3kkxi7snayboj66vfyqa73wp6uxshogsedwfjoduizgmy", title: "decentralized papers 2", description: "my desc" },
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
          <Grid.Col md={6} lg={4}>
            <Paper shadow="xs" p="md" component={NextLink} href={`/paper/${paper.cid}`}>
              <Title order={2}>{paper.title}</Title>
              <Text>{paper.description}</Text>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
};

export default Home;
