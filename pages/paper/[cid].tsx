import { Stack, Text, Aside, Group, Box, ScrollArea } from "@mantine/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { retrieveJson } from "../../utils/ipfs";
import { Paper } from "../../utils/paper";

const Paper: NextPage = () => {
  const router = useRouter();
  const { cid } = router.query;
  console.log("cid:", cid);

  const [paper, setPaper] = useState<Paper>();
  useEffect(() => {
    (async () => {
      if (cid) {
        console.log("cid:", cid);
        setPaper(await retrieveJson<Paper>(cid as string));
      }
    })();
  }, [cid]);

  const src = paper ? `https://${paper.content}.ipfs.dweb.link/${paper.contentFileName}` : undefined;
  console.log("src:", src);

  return (
    <Box style={{
      display: "flex",
      flexDirection: "row",
    }}>
      <iframe src={src} style={{
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
        <Text>{paper?.description}</Text>
      </ScrollArea>
    </Box>
  );
};

export default Paper;
