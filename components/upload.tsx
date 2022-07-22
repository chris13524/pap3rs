import React, { useEffect, useState } from "react";
import { Text, Group, Button, createStyles, MantineTheme, useMantineTheme, Stack, Container, Title, TextInput, Textarea, MultiSelect } from "@mantine/core";
import { Dropzone, DropzoneStatus, MIME_TYPES } from "@mantine/dropzone";
import { CloudUpload } from "tabler-icons-react";
import { useSigner } from "wagmi";
import { usePapersContract } from "../utils/contracts";
import { useForm } from "@mantine/form";
import { retrieveJson, storeJson, web3Storage } from "../utils/ipfs";
import { allPapers, Paper } from "../utils/paper";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  dropzone: {
    borderWidth: 1,
    paddingBottom: 50,
  },

  icon: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[4],
  },

  control: {
    position: "absolute",
    width: 250,
    left: "calc(50% - 125px)",
    bottom: -20,
  },
}));

function getActiveColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][6]
    : status.rejected
      ? theme.colors.red[6]
      : theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.black;
}

async function storeWithProgress(contract: any, values: FormValues, files: File[]) {
  console.log("Storing files", files);

  // when each chunk is stored, update the percentage complete and display
  const totalSize = files.map(f => f.size).reduce((a, b) => a + b, 0);
  let uploaded = 0;

  // client.put will invoke our callbacks during the upload
  // and return the root cid when the upload completes
  const content = await web3Storage.put(files, {
    onStoredChunk: size => {
      uploaded += size;
      const pct = totalSize / uploaded;
      console.log(`Uploading... ${pct.toFixed(2)}% complete`);
    }
  });

  const metadata = await storeJson<Paper>({
    ...values,
    content,
    contentFileName: files[0].name,
  });
  console.log("metadata CID:", metadata);

  await contract.upload(metadata, values.author);

  showNotification({
    title: "Paper published",
    message: "Your paper has been published to IPFS!",
  });

  return metadata;
}

type FormValues = {
  author: string,
  title: string,
  description: string,
  references: string[],
};

function UploadForm() {
  const router = useRouter();
  const theme = useMantineTheme();
  const { classes } = useStyles();

  const { data: signer } = useSigner();
  const contract = usePapersContract(signer);

  const [files, setFiles] = useState<File[]>([]);

  const onSubmit = async (values: FormValues) => {
    const cid = await storeWithProgress(contract, values, files);
    router.push(`/paper/${cid}`);
  };

  type ResolvedPaper = Paper & { cid: string };

  const [papers, setPapers] = useState<ResolvedPaper[]>([]);
  useEffect(() => {
    (async () => {
      const papers = [];
      for (const cid of allPapers) {
        const paper = await retrieveJson<ResolvedPaper>(cid);
        paper.cid = cid;
        papers.push(paper);
      }
      setPapers(papers);
    })();
  }, []);

  const form = useForm({
    initialValues: {
      author: "",
      title: "",
      description: "",
      references: [],
    },
  });

  return (
    <Container size="sm">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack p="md">
          <Title>Upload Paper</Title>

          <TextInput
            required
            label="Author"
            {...form.getInputProps("author")}
          />

          <TextInput
            required
            label="Title"
            {...form.getInputProps("title")}
          />

          <Textarea
            label="Description"
            {...form.getInputProps("description")}
            required
          />

          {files.length == 0 &&
            <Dropzone
              onDrop={files => setFiles(files)}
              className={classes.dropzone}
              radius="md"
              accept={[MIME_TYPES.pdf]}
              maxSize={30 * 1024 ** 2}
            >
              {(status) => (
                <>
                  <div style={{ pointerEvents: "none" }}>
                    <Group position="center">
                      <CloudUpload size={50} color={getActiveColor(status, theme)} />
                    </Group>
                    <Text
                      align="center"
                      weight={700}
                      size="lg"
                      mt="xl"
                      sx={{ color: getActiveColor(status, theme) }}
                    >
                      {status.accepted
                        ? "Drop files here"
                        : status.rejected
                          ? "Pdf file less than 30mb"
                          : "Upload paper"}
                    </Text>
                    <Text align="center" size="sm" mt="xs" color="dimmed">
                      Drag&apos;n&apos;drop files here to upload. We can accept only <i>.pdf</i> files that
                      are less than 30mb in size.
                    </Text>
                  </div>
                  <Button className={classes.control} size="md" radius="xl">
                    Select files
                  </Button>
                </>
              )}
            </Dropzone>
          }
          {files.length > 0 &&
            <ul>
              {files.map(file => (
                <li key={file.lastModified}>
                  {file.name} <Button color="red" compact onClick={() => setFiles([])}>x</Button>
                </li>
              ))}
            </ul>
          }

          <MultiSelect
            data={papers.map(paper => ({ label: paper.title, value: paper.cid }))}
            label="References"
            searchable
            nothingFound="Nothing found"
            {...form.getInputProps("references")}
          />

          <Group mt="md">
            <Button type="submit">Upload</Button>
          </Group>
        </Stack>
      </form>
    </Container>
  );
}

export default UploadForm;
