import { Stack, Title, Text, Grid, Space, Container, ScrollArea, LoadingOverlay, Loader } from "@mantine/core";
import type { NextPage } from "next";
import { useSigner } from "wagmi";
import { usePapersContract } from "../utils/contracts";
import { Fragment, useEffect, useState } from "react";
import { retrieveJson } from "../utils/ipfs";
import { allPapers as featuredPapers, getPapers, Paper, PaperWithId } from "../utils/paper";
import PaperCard from "../components/paper";
import { useAsync } from "react-use";
import { useQuery, gql } from "@apollo/client";

const Home: NextPage = () => {
  const { data: signer } = useSigner();
  const contract = usePapersContract(signer);

  // const paperCids = useAsync(async () => {
  //   if (signer && contract) {
  //     return await contract.listCids();
  //   }
  // }, [signer, contract]);

  // const papers = useAsync(async () => {
  //   let paps = await getPapers(['blahblah']); // TODO: maybe we pass in a sublist at some point, but service won't select specific ones yet
  //   const paperCids = [];
  //   for (const pap of paps) {
  //     paperCids.push(pap.content);
  //   }
  //   if (paperCids) {
  //     const groups = [
  //       { name: "Featured papers", papers: featuredPapers },
  //       { name: "New papers", papers: paperCids },
  //     ];
  //     const resolvedGroups = [] as { name: string, papers: PaperWithId[] }[];
  //     for (const group of groups) {
  //       resolvedGroups.push({
  //         name: group.name,
  //         papers: await getPapers(group.papers),
  //       });
  //     }
  //     return [...resolvedGroups, ...resolvedGroups, ...resolvedGroups];
  //   }
  // }, []);

  const papers = useQuery<{ papers: (Paper & { id: string })[] }>(gql`
    {
      papers {
        id
        title
        description
      }
    }
  `);

  return (
    <ScrollArea style={{
      height: "calc(100vh - 60px)",
    }}>
      <Container>
        <Stack p="md">
          {papers.loading
            ? <Loader size={100} style={{ margin: "100px auto" }} />
            : papers.error
              ? <Text>{papers.error.message}</Text>
              : <>
                <Space h="md" />
                <Text>Academic papers published on IPFS. Papers can link to each other using metadata, are versioned on Ceramic, and a smart contract can be used to fund research projects.</Text>
                {/* {papers.data?.papers.map(group => (
                  <Fragment key={group.name}>
                    <Space />
                    <Title order={2}>{group.name}</Title>
                    <PaperCard papers={group.papers} />
                  </Fragment>
                ))} */}
                <Title order={2}>New papers</Title>
                <PaperCard papers={papers.data!.papers} />
              </>
          }
        </Stack >
      </Container>
    </ScrollArea>
  );
};

export default Home;
