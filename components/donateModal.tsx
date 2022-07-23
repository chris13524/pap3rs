import React, { useState } from "react";
import { Container, Modal, Button, Group, NumberInput, Stack, Select, Text } from "@mantine/core";
import { useBalance, useSigner, useToken } from "wagmi";
import { usePapersContract, useMockTokenContract } from "../utils/contracts";
import { NextPage } from "next";
import { parseEther, formatEther } from "ethers/lib/utils";
import { useForm } from "@mantine/form";
import { useAsync } from "react-use";
import { ethers } from "ethers";
import { upperCaseFirst } from "upper-case-first";

const DonateModal: NextPage<{ cid: string }> = ({ cid }) => {
  const { data: signer } = useSigner();

  const address = useAsync(async () => {
    if (signer) {
      return await signer.getAddress();
    }
  }, [signer]);
  const { data: balance } = useBalance(address.value ? { addressOrName: address.value } : {});

  const contract = usePapersContract(signer);
  const mockTokenContract = useMockTokenContract(signer);

  const tokenData = useAsync(async () => {
    if (signer) {
      console.log("test"); // does not run
      return {
        balance: formatEther((await mockTokenContract.balanceOf(address.value)).toString()),
        symbol: await mockTokenContract.symbol(),
        allowance: formatEther((await mockTokenContract.allowance(address.value, contract.address)).toString()),
      };
    }
  }, [signer]);
  console.log("tokenData outside:",tokenData);

  const [opened, setOpened] = useState(false);

  type FormValues = { amount: number, mode: "donate" | "approve" };

  const onSubmit = async ({ amount: amountEther, mode }: FormValues) => {
    const amountWei = parseEther(amountEther.toString());

    if (mode == "approve") {
      const tokenName = await mockTokenContract.name();
      console.log(`Going to approve ${amountEther} ${tokenName}`);
      await mockTokenContract.approve(contract.address, amountWei);
    }

    if (mode == "donate") {
      console.log(`Going to donate ${amountEther} to CID ${cid} via contract: ${contract.address}`);
      await contract.donate(cid, `${mockTokenContract.address}`, amountWei);
    }
  };

  const form = useForm<FormValues>({
    initialValues: {
      amount: 100,
      mode: "donate",
    },
  });

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Donate to this paper"
      >
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack>
            <NumberInput
              required
              label="Donation amount"
              {...form.getInputProps("amount")}
            />
            <Select
              label="Approve or donate?"
              data={[
                { value: "donate", label: "Donate" },
                { value: "approve", label: "Approve" },
              ]}
              {...form.getInputProps("mode")}
            />
            <Text>Wallet balance: {tokenData.value?.balance} {tokenData.value?.symbol} ({tokenData.value?.allowance} allowance)</Text>

            <Button type="submit" size="md" radius="xl">{upperCaseFirst(form.values.mode)} {form.values.amount} {tokenData.value?.symbol}</Button>
            
          </Stack>
        </form>
      </Modal>
      <Group position="center">
        <Button onClick={() => setOpened(true)}>Donate</Button>
      </Group>
    </>
  );
};

export default DonateModal;
