import React, { Dispatch, SetStateAction, useState } from "react";
import { Modal, Button, Stack, TextInput } from "@mantine/core";
import { NextPage } from "next";
import { useForm } from "@mantine/form";
import { Author } from "../utils/author";

const CreateAuthorModal: NextPage<{
  openedState: [boolean, Dispatch<SetStateAction<boolean>>],
  name: string,
  onCreate: (author: Author) => void,
}> = ({ openedState: [opened, setOpened], name, onCreate }) => {
  const onSubmit = (author: Author) => {
    // TODO create it
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
      title="Donate to this paper"
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
            {...form.getInputProps("address")}
          />

          <Button type="submit">Create author</Button>
        </Stack>
      </form>
    </Modal>
  );
}

export default CreateAuthorModal;
