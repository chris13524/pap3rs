import { Grid, Paper as MPaper, Title, Text } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { NextPage } from "next";
import { PaperWithId } from "../utils/paper";

const PaperCard: NextPage<{ papers: PaperWithId[] }> = ({ papers }) => {
  return (
    <Grid>
      {papers.map(paper => (
        <Grid.Col md={6} lg={4} key={paper.id}>
          <MPaper shadow="xs" p="md" component={NextLink} href={`/paper/${paper.id}`} style={{ height: "100%" }}>
            <Title order={4}>{paper.title}</Title>
            <Text lineClamp={4}>{paper.description}</Text>
          </MPaper>
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default PaperCard;
