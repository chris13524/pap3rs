import { Text, Box, ScrollArea, List, Title, Stack, Anchor, Group, Badge, Loader, Center } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { retrieveJson } from "../../utils/ipfs";
import { Paper } from "../../utils/paper";
import DonateModal from "../../components/donateModal";
import WithdrawModal from "../../components/withdrawModal";
import { Author } from "../../utils/author";

type ResolvedPaper = Paper & { resolvedReferences: (Paper & { cid: string })[], resolvedReviews: (Paper & { cid: string })[], resolvedAuthors: (Author & { cid: string })[] };

const Paper: NextPage = () => {
  const router = useRouter();
  const cid = router.query.cid as string;

  const [paper, setPaper] = useState<ResolvedPaper>();
  useEffect(() => {
    (async () => {
      if (cid) {
        const paper = Object.assign(await retrieveJson<ResolvedPaper>(cid), { resolvedReferences: [], resolvedReviews: [], resolvedAuthors: [] });
        for (const cid of paper.references) {
          paper.resolvedReferences.push(Object.assign(await retrieveJson<Paper>(cid), { cid: cid }));
        }
        // for (const cid of paper.reviews) {
        //   paper.resolvedReviews.push(Object.assign(await retrieveJson<Paper>(cid), { cid: cid }));
        // }

        paper.resolvedAuthors.push({ name: "Vitalik Buterin", address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", cid: "aaaa" });
        paper.resolvedAuthors.push({ name: "Satoshi Nakamoto", address: "yyyy", cid: "bbbb" });
        paper.resolvedReviews.push({ title: "Other paper" } as (Paper & { cid: string }));
        paper.resolvedReviews.push({ title: "Other paper" } as (Paper & { cid: string }));
        paper.resolvedReviews.push({ title: "Other paper" } as (Paper & { cid: string }));
        paper.resolvedReviews.push({ title: "Other paper" } as (Paper & { cid: string }));
        setPaper(paper);
      }
    })();
  }, [cid]);

  const src = paper ? `https://${paper.content}.ipfs.dweb.link/${paper.contentFileName}` : undefined;
  const [iframeLoading, setIframeLoading] = useState(true);

  return (
    <Box style={{
      display: "flex",
      flexDirection: "row",
      height: "100%",
    }}>
      <div style={{
        width: "100%",
      }}>
        {iframeLoading &&
          <Center>
            <Loader size={100} style={{ margin: "100px auto" }} />
          </Center>
        }
        <iframe
          onLoad={() => setIframeLoading(false)}
          src={src}
          key={src}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            border: 0,
          }} />
      </div>
      <ScrollArea p="md" style={{
        flexShrink: 1,
        maxWidth: "300px",
      }}>
        <Stack spacing="lg">
          <Title>{paper?.title}</Title>
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
          <DonateModal cid={cid} />
          <WithdrawModal cid={cid} />
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
          {paper?.resolvedReviews.length ? <>
            <Title order={4}>Reviews</Title>
            <List>
              {paper?.resolvedReviews?.map(review => (
                <List.Item key={review.cid}>
                  <Anchor component={NextLink} href={`/paper/${review.cid}`}>
                    {review.title}
                  </Anchor>
                </List.Item>
              ))}
            </List>
          </> : <></>}
        </Stack>
      </ScrollArea>
    </Box>
  );
};

export default Paper;
