import { Text, Box, ScrollArea, List, Title, Stack, Anchor, Group, Badge } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { retrieveJson } from "../../utils/ipfs";
import { Paper } from "../../utils/paper";
import DonateModal from "../../components/donateModal";
import { Author } from "../../utils/author";

type ResolvedPaper = Paper & { resolvedReferences: (Paper & { cid: string })[], resolvedAuthors: (Author & { cid: string })[] };

const Paper: NextPage = () => {
  const router = useRouter();
  const cid = router.query.cid as string;

  const [paper, setPaper] = useState<ResolvedPaper>();
  useEffect(() => {
    (async () => {
      if (cid) {
        const paper = Object.assign(await retrieveJson<ResolvedPaper>(cid), { resolvedReferences: [], resolvedAuthors: [] });
        for (const reference of paper.references) {
          paper.resolvedReferences.push(Object.assign(await retrieveJson<Paper>(reference), { cid: reference }));

          paper.resolvedAuthors.push({ name: "Vitalik Buterin", address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", cid: "aaaa" });
          paper.resolvedAuthors.push({ name: "Satoshi Nakamoto", address: "yyyy", cid: "bbbb" });
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
      height: "100%",
    }}>
      <iframe key={src} src={src} style={{
        display: "block",
        width: "100%",
        border: 0,
      }} />
      <ScrollArea p="md" style={{
        flexShrink: 1,
        maxWidth: "300px",
      }}>
        <Stack>
          <Group>
            {paper?.resolvedAuthors.map(author => (
              <Badge key={author.cid}
                color="gray" variant="outline"
                styles={{
                  root: {
                    cursor: "pointer",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "darkgray",
                      color: "white",
                    },
                  },
                }}
                component={NextLink} href={`/author/${author.cid}`} >
                {author.name}
              </Badge>
            ))}
          </Group>
          <Text>{paper?.title}</Text>
          <Text>{paper?.description}</Text>
          {paper?.resolvedReferences.length ? <>
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
          </> : <></>}
          <DonateModal cid={cid} />
        </Stack>
      </ScrollArea>
    </Box>
  );
};

export default Paper;
