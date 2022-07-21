import { Paper as MPaper, Stack, Title, Text, Grid, Space } from "@mantine/core";
import type { NextPage } from "next";
import { useSigner } from "wagmi";
import { usePapersContract } from "../utils/contracts";
import { NextLink } from "@mantine/next";
import { Fragment, useEffect, useState } from "react";
import { retrieveJson } from "../utils/ipfs";
import { allPapers as featuredPapers, Paper } from "../utils/paper";

const Home: NextPage = () => {
  const { data: signer } = useSigner();
  const contract = usePapersContract(signer);

  const [papers, setPapers] = useState<{ name: string, papers: { id: string, paper: Paper }[] }[]>([]);
  useEffect(() => {
    if (signer && contract) {
      (async () => {
        const groups = [
          { name: "Featured papers", papers: featuredPapers },
          { name: "New papers", papers: await contract.listCids() },
        ];
        const papers = [];
        for (const group of groups) {
          const newGroup = { name: group.name, papers: [] as { id: string, paper: Paper }[] };
          for (const paper of group.papers) {
            newGroup.papers.push({ id: paper, paper: await retrieveJson<Paper>(paper) });
          }
          papers.push(newGroup);
        }
        setPapers(papers);
      })();
    }
  }, [signer, contract]);

  return (
    <Stack p="md">
      <Title order={1}>Pap3rs</Title>

      <Text>Academic papers published on IPFS. Papers can link to each other using metadata, are versioned on Ceramic, and a smart contract can be used to fund research projects.</Text>

      {papers.map(group => (
        <Fragment key={group.name}>
          <Space />
          <Title order={2}>{group.name}</Title>
          <Grid>
            {group.papers.map(paper => (
              <Grid.Col md={6} lg={4} key={`${group.name} ${paper.id}`}>
                <MPaper shadow="xs" p="md" component={NextLink} href={`/paper/${paper.id}`} style={{ height: "100%" }}>
                  <Title order={4}>{paper.paper.title}</Title>
                  <Text lineClamp={4}>{paper.paper.description}</Text>
                </MPaper>
              </Grid.Col>
            ))}
          </Grid>
        </Fragment>
      ))}
    </Stack >
  );
};

export default Home;
