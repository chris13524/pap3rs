import React, { Dispatch, SetStateAction } from "react";
import { Modal, Button, Stack, TextInput, Badge } from "@mantine/core";
import { NextPage } from "next";
import { useForm } from "@mantine/form";
import { Author, addAuthor } from "../utils/author";
import { useSigner } from "wagmi";
import { useAsync } from "react-use";

const CreateAuthorModal: NextPage<{
  openedState: [boolean, Dispatch<SetStateAction<boolean>>],
  name: string,
  onCreate: (author: Author) => void,
}> = ({ openedState: [opened, setOpened], name, onCreate }) => {
  const { data: signer } = useSigner();
  const address = useAsync(async () => {
    if (signer) {
      return await signer.getAddress();
    }
  }, [signer]);

  const onSubmit = (author: Author) => {
    // TODO create it
    addAuthor(author);
    setOpened(false);
    onCreate(author);
  };

  const form = useForm<Author>({
    initialValues: {
      name,
      address: "",
    },
  });

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Create Author"
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          <TextInput
            required
            label="Author name"
            {...form.getInputProps("name")}
          />
          <TextInput
            required
            label="Wallet address"
            rightSectionWidth={60}
            rightSection={address.value &&
              <Badge
                onClick={() => form.setFieldValue("address", address.value!)}
                style={{ cursor: "pointer" }}
              >Me</Badge>}
            {...form.getInputProps("address")}
          />

          <Button type="submit">Create author</Button>
        </Stack>
      </form>
    </Modal>
  );
};

export default CreateAuthorModal;
