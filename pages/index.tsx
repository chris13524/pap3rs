import { Stack, Title, Text, Grid, Space } from "@mantine/core";
import type { NextPage } from "next";
import { useSigner } from "wagmi";
import { usePapersContract } from "../utils/contracts";
import { Fragment, useEffect, useState } from "react";
import { retrieveJson } from "../utils/ipfs";
import { allPapers as featuredPapers, getPapers, PaperWithId } from "../utils/paper";
import PaperCard from "../components/paper";
import { useAsync } from "react-use";

const Home: NextPage = () => {
  const { data: signer } = useSigner();
  const contract = usePapersContract(signer);

  const paperCids = useAsync(async () => {
    if (signer && contract) {
      return await contract.listCids();
    }
  }, [signer, contract]);

  const papers = useAsync(async () => {
    if (paperCids.value) {
      const groups = [
        { name: "Featured papers", papers: featuredPapers },
        { name: "New papers", papers: paperCids.value },
      ];
      const resolvedGroups = [] as { name: string, papers: PaperWithId[] }[];
      for (const group of groups) {
        resolvedGroups.push({
          name: group.name,
          papers: await getPapers(group.papers),
        });
      }
      return resolvedGroups;
    }
  }, [paperCids]);

  return (
    <Stack p="md">
      <Title order={1}>Pap3rs</Title>

      <Text>Academic papers published on IPFS. Papers can link to each other using metadata, are versioned on Ceramic, and a smart contract can be used to fund research projects.</Text>

      {papers.value?.map(group => (
        <Fragment key={group.name}>
          <Space />
          <Title order={2}>{group.name}</Title>
          <PaperCard papers={group.papers} />
        </Fragment>
      ))}
    </Stack >
  );
};

export default Home;
