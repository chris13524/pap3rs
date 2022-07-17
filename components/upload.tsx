import React, { useState } from "react";
import { Text, Group, Button, createStyles, MantineTheme, useMantineTheme, Stack, Container, Title, TextInput, Textarea } from "@mantine/core";
import { Dropzone, DropzoneStatus, MIME_TYPES } from "@mantine/dropzone";
import { CloudUpload } from "tabler-icons-react";
import { useAccount, useSigner } from "wagmi";
import { usePapersContract } from "../utils/contracts";
import { useForm } from "@mantine/form";
import { storeJson, web3Storage } from "../utils/ipfs";
import { Paper } from "../utils/paper";

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

async function storeWithProgress(contract, values: { title: string, description: string }, files: File[]) {
  console.log("Storing files", files);

  // when each chunk is stored, update the percentage complete and display
  const totalSize = files.map(f => f.size).reduce((a, b) => a + b, 0);
  let uploaded = 0;

  const onStoredChunk = size => {
    uploaded += size;
    const pct = totalSize / uploaded;
    console.log(`Uploading... ${pct.toFixed(2)}% complete`);
  };

  // client.put will invoke our callbacks during the upload
  // and return the root cid when the upload completes
  const content = await web3Storage.put(files, { onStoredChunk });

  const metadata = await storeJson<Paper>({
    ...values,
    content,
    contentFileName: files[0].name,
    references: [],
  });
  console.log("metadata CID:", metadata);

  await contract.claim(metadata);

  return metadata;
}

function DropzoneButton() {
  const theme = useMantineTheme();
  const { classes } = useStyles();

  const { data: signer, isError: isError2, isLoading: isLoading2 } = useSigner();
  const { data: account, isError, isLoading, address, isConnected } = useAccount();

  const contract = usePapersContract(signer);
  console.log(contract);
  console.log(`isConnected=${isConnected}`);

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
    },
  });

  const [files, setFiles] = useState<File[]>([]);

  return (
    <Container size="sm">
      <form onSubmit={form.onSubmit(values => storeWithProgress(contract, values, files))}>
        <Stack p="md">
          <Title>Upload Paper</Title>

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

          <Dropzone
            onDrop={files => setFiles(files)}
            className={classes.dropzone}
            radius="md"
            accept={[MIME_TYPES.pdf, MIME_TYPES.png]}
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

          <Group mt="md">
            <Button type="submit">Upload</Button>
          </Group>
        </Stack>
      </form>
    </Container>
  );
}

export default DropzoneButton;
