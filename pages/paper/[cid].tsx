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
import { useQuery, gql } from "@apollo/client";

// type ResolvedPaper = Paper & { resolvedReferences: (Paper & { cid: string })[], resolvedReviews: (Paper & { cid: string })[], resolvedAuthors: (Author & { cid: string })[] };
type ResolvedPaper = Omit<Paper, "authors" | "references" | "reviews"> & {
  authors: { author: Author & { id: string } }[],
  references: { reference: Paper & { id: string } }[],
  reviews: { review: Paper & { id: string } }[],
};

const Paper: NextPage = () => {
  const router = useRouter();
  const cid = router.query.cid as string;

  // const [paper, setPaper] = useState<ResolvedPaper>();
  // useEffect(() => {
  //   (async () => {
  //     if (cid) {
  //       const paper = Object.assign(await retrieveJson<ResolvedPaper>(cid), { resolvedReferences: [], resolvedReviews: [], resolvedAuthors: [] });
  //       for (const cid of paper.references) {
  //         paper.resolvedReferences.push(Object.assign(await retrieveJson<Paper>(cid), { cid: cid }));
  //       }
  //       // for (const cid of paper.reviews) {
  //       //   paper.resolvedReviews.push(Object.assign(await retrieveJson<Paper>(cid), { cid: cid }));
  //       // }

  //       paper.resolvedAuthors.push({ name: "Vitalik Buterin", address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", cid: "aaaa" });
  //       paper.resolvedAuthors.push({ name: "Satoshi Nakamoto", address: "yyyy", cid: "bbbb" });
  //       paper.resolvedReviews.push({ title: "Other paper" } as (Paper & { cid: string }));
  //       paper.resolvedReviews.push({ title: "Other paper" } as (Paper & { cid: string }));
  //       paper.resolvedReviews.push({ title: "Other paper" } as (Paper & { cid: string }));
  //       paper.resolvedReviews.push({ title: "Other paper" } as (Paper & { cid: string }));
  //       setPaper(paper);
  //     }
  //   })();
  // }, [cid]);

  const paper = useQuery<{ paper: ResolvedPaper }>(gql`
    query ResolvedPaper($id: String!) {
      paper(id: $id) {
        authors {
          author {
            id
            name
            address
          }
        }
        title
        description
        content
        contentFileName
        references {
          reference {
            id
            title
          }
        }
        reviews {
          review {
            id
            title
          }
        }
      }
    }
  `, {
    variables: {
      id: cid,
    }
  });

  const src = paper.data && paper.data.paper ? `https://${paper.data.paper.content}.ipfs.dweb.link/${paper.data.paper.contentFileName}` : undefined;
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
          {paper.loading
            ? <Loader />
            : paper.error
              ? paper.error.message
              : <>
                <Title>{paper.data?.paper.title}</Title>
                <Group>
                  {paper.data?.paper.authors.map(author => (
                    <Badge key={author.author.id}
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
                      component={NextLink} href={`/author/${author.author.id}`} >
                      {author.author.name}
                    </Badge>
                  ))}
                </Group>
                <DonateModal cid={cid} />
                <WithdrawModal cid={cid} />
                <Text>{paper.data?.paper.description}</Text>
                {paper.data?.paper.references.length ? <>
                  <Title order={4}>References</Title>
                  <List>
                    {paper.data?.paper.references?.map(reference => (
                      <List.Item key={reference.reference.id}>
                        <Anchor component={NextLink} href={`/paper/${reference.reference.id}`}>
                          {reference.reference.title}
                        </Anchor>
                      </List.Item>
                    ))}
                  </List>
                </> : <></>}
                {paper.data?.paper.reviews.length ? <>
                  <Title order={4}>Reviews</Title>
                  <List>
                    {paper.data?.paper.reviews?.map(review => (
                      <List.Item key={review.review.id}>
                        <Anchor component={NextLink} href={`/paper/${review.review.id}`}>
                          {review.review.title}
                        </Anchor>
                      </List.Item>
                    ))}
                  </List>
                </> : <></>}
              </>}
        </Stack>
      </ScrollArea>
    </Box>
  );
};

export default Paper;
