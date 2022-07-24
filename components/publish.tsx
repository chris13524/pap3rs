import React, { useState } from "react";
import { Text, Group, Button, createStyles, MantineTheme, useMantineTheme, Stack, Container, Title, TextInput, Textarea, MultiSelect, LoadingOverlay, Loader } from "@mantine/core";
import { Dropzone, DropzoneStatus, MIME_TYPES } from "@mantine/dropzone";
import { CloudUpload } from "tabler-icons-react";
import { useSigner } from "wagmi";
import { usePapersContract } from "../utils/contracts";
import { useForm } from "@mantine/form";
import { web3Storage } from "../utils/ipfs";
import { Paper } from "../utils/paper";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import CreateAuthorModal from "./CreateAuthorModal";
import { gql, useQuery } from "@apollo/client";
import { Author } from "../utils/author";

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
    },
  });

  const paper = {
    ...values,
    content,
    contentFileName: files[0].name,
  };

  await contract.upload(paper.authors, paper.title, paper.description, paper.content, paper.contentFileName, paper.references, paper.reviews);

  showNotification({
    title: "Paper published",
    message: "Your paper has been published to IPFS!",
  });

  return paper.content;
}

type FormValues = {
  authors: string[],
  title: string,
  description: string,
  references: string[],
  reviews: string[],
};

function UploadForm() {
  const router = useRouter();
  const theme = useMantineTheme();
  const { classes } = useStyles();

  const { data: signer } = useSigner();
  const contract = usePapersContract(signer);

  const [files, setFiles] = useState<File[]>([]);

  const [uploading, setUploading] = useState(false);
  const onSubmit = (values: FormValues) => {
    setUploading(true);
    storeWithProgress(contract, values, files)
      .then(cid => setTimeout(() => router.push(`/paper/${cid}`), 5000));
  };

  // type ResolvedPaper = Paper & { cid: string };

  // const [papers, setPapers] = useState<ResolvedPaper[]>([]);
  // useEffect(() => {
  //   (async () => {
  //     const papers = [];
  //     for (const cid of allPapers) {
  //       const paper = await retrieveJson<ResolvedPaper>(cid);
  //       paper.cid = cid;
  //       papers.push(paper);
  //     }
  //     setPapers(papers);
  //   })();
  // }, []);

  // const [authors, setAuthors] = useState<Author[]>([]);
  // useEffect(() => {
  //   (async () => {
  //     const papers = await allAuthors();
  //     setAuthors(papers);
  //   })();
  // }, []);

  const papers = useQuery<{ papers: (Paper & { id: string })[] }>(gql`
    {
      papers {
        id
        title
      }
    }
  `);

  const queryAuthors = useQuery<{ authors: Author[] }>(gql`
    {
      authors {
        id
        name
        address
      }
    }
  `);
  const [authors, setAuthors] = useState<Author[]>([]);
  if (authors === [] && queryAuthors.data !== undefined) setAuthors(queryAuthors.data.authors);

  const form = useForm<FormValues>({
    initialValues: {
      authors: [],
      title: "",
      description: "",
      references: [],
      reviews: [],
    },
  });

  // TODO can we simplify this?
  // TODO handle cancel
  const [createAuthorModalName, setCreateAuthorModalName] = useState("");
  const createAuthorModalOpenedState = useState(false);

  return (
    <div style={{ position: "relative", minHeight: "100%" }}>
      <LoadingOverlay visible={uploading} loaderProps={{ size: 100 }} />
      <Container size="sm">
        {createAuthorModalName &&
          <CreateAuthorModal
            openedState={createAuthorModalOpenedState}
            name={createAuthorModalName}
            onCreate={author => {
              // add new author to available authors ()
              setAuthors(authors => [...authors, author]);

              // update selected author to use new name entered in modal
              form.setFieldValue("authors", form.values.authors.map(mappedAuthor => {
                if (mappedAuthor == createAuthorModalName) {
                  return author.address;
                } else {
                  return mappedAuthor;
                }
              }));

              // reset modal state for next interaction
              setCreateAuthorModalName("");
            }}
          />
        }
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack p="md">
            <Title>Publish Paper</Title>

            {queryAuthors.loading || papers.loading
              ? <Loader />
              : queryAuthors.error || papers.error
                ? (`${queryAuthors.error?.message}` + `${papers.error?.message}`)
                : <>
                  <MultiSelect
                    required
                    data={authors.map(author => ({ label: author.name, value: author.address }))}
                    label="Authors"
                    searchable
                    creatable
                    getCreateLabel={query => `+ Create author ${query}`}
                    onCreate={name => {
                      setCreateAuthorModalName(name);
                      createAuthorModalOpenedState[1](true);
                    }}
                    {...form.getInputProps("authors")}
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
                    data={papers.data!.papers.map(paper => ({ label: paper.title, value: paper.id }))}
                    label="References"
                    searchable
                    nothingFound="Nothing found"
                    {...form.getInputProps("references")}
                  />

                  <MultiSelect
                    data={papers.data!.papers.map(paper => ({ label: paper.title, value: paper.id }))}
                    label="Reviews"
                    searchable
                    nothingFound="Nothing found"
                    {...form.getInputProps("reviews")}
                  />
                </>}

            <Group mt="md">
              <Button type="submit">Publish</Button>
            </Group>
          </Stack>
        </form>
      </Container>
    </div>
  );
}

export default UploadForm;
