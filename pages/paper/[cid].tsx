import { Text, Box, ScrollArea, List, Title, Stack, Anchor } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { retrieveJson } from "../../utils/ipfs";
import { Paper } from "../../utils/paper";

type ResolvedPaper = Paper & { resolvedReferences: (Paper & { cid: string })[] };

const Paper: NextPage = () => {
  const router = useRouter();
  const { cid } = router.query;

  const [paper, setPaper] = useState<ResolvedPaper>();
  useEffect(() => {
    (async () => {
      if (cid) {
        const paper = Object.assign(await retrieveJson<ResolvedPaper>(cid as string), { resolvedReferences: [] });
        for (const reference of paper.references) {
          paper.resolvedReferences.push(Object.assign(await retrieveJson<Paper>(reference), { cid: reference }));
        }
        setPaper(paper);
      }
    })();
  }, [cid]);

  const src = paper ? `https://${paper.content}.ipfs.dweb.link/${paper.contentFileName}` : undefined;

  return (
    <Box style={{
      display: "flex",
      flexDirection: "row",
    }}>
      <iframe key={src} src={src} style={{
        display: "block",
        width: "100%",
        height: "100vh",
        border: 0,
      }} />
      <ScrollArea p="md" style={{
        flexShrink: 1,
        maxWidth: "300px",
        height: "100vh",
      }}>
        <Stack>
          <Text>{paper?.title}</Text>
          <Text>{paper?.description}</Text>

          <Title order={4}>References</Title>
          <List>
            {paper?.resolvedReferences?.map(reference => (
              <List.Item key={reference.cid}>
                <Anchor component={NextLink} href={`/paper/${reference.cid}`}>
                  {reference.title}
                </Anchor>
              </List.Item>
            ))}
          </List>
        </Stack>
      </ScrollArea>
    </Box>
  );
};

export default Paper;
