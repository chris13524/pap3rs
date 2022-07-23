import { Title, Text, Space, Stack } from "@mantine/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useAsync } from "react-use";
import PaperCard from "../../components/paper";
import { allPapers, getPapers } from "../../utils/paper";

const Author: NextPage = ({ }) => {
    const router = useRouter();
    const cid = router.query.cid as string;

    const name = "Vitalik Buterin";
    const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

    const papers = useAsync(() => getPapers(allPapers));

    return (
        <Stack p="md">
            <Title>{name}</Title>
            <Text>{address}</Text>

            <Space />
            <Title order={2}>Papers</Title>
            {papers.value && <PaperCard papers={papers.value} />}
        </Stack>
    );
};

export default Author;
