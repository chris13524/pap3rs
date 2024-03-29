import React, { useState } from "react";
import { Modal, Button, Group, NumberInput, Stack, Text, Space } from "@mantine/core";
import { useSigner } from "wagmi";
import { usePapersContract, useMockTokenContract } from "../utils/contracts";
import { NextPage } from "next";
import { parseEther, formatEther } from "ethers/lib/utils";
import { useForm } from "@mantine/form";
import { useAsync } from "react-use";
import { upperCaseFirst } from "upper-case-first";
import { Gift } from "tabler-icons-react";

const DonateModal: NextPage<{ cid: string }> = ({ cid }) => {
  const { data: signer } = useSigner();

  const address = useAsync(async () => {
    if (signer) {
      return await signer.getAddress();
    }
  }, [signer]);

  const contract = usePapersContract(signer);
  const mockTokenContract = useMockTokenContract(signer);

  const tokenData = useAsync(async () => {
    if (signer && contract && mockTokenContract && address) {
      return {
        balance: formatEther((await mockTokenContract.balanceOf(address.value)).toString()),
        symbol: await mockTokenContract.symbol(),
        allowance: formatEther((await mockTokenContract.allowance(address.value, contract.address)).toString()),
        donationAmount: formatEther((await contract.getDonationBalance(cid, mockTokenContract.address)).toString()),
      };
    }
  }, [signer, contract, mockTokenContract, address]);

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
      const tokenName = await mockTokenContract.name();
      console.log(`Going to approve ${amountEther} ${tokenName}`);
      await mockTokenContract.approve(contract.address, amountWei);
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
            <Button type="submit" size="md" radius="xl">{upperCaseFirst(form.values.mode)} {form.values.amount} {tokenData.value?.symbol}</Button>
            <Text>Wallet balance: <strong>{tokenData.value?.balance}</strong> {tokenData.value?.symbol}</Text>
          </Stack>
        </form>
      </Modal>
      <Group position="center" style={{
        flexWrap: "nowrap",
      }}>
        <Button
          onClick={() => setOpened(true)}
          leftIcon={<Gift />}>
          Donate
        </Button>
        <Text>{tokenData.value?.donationAmount} {tokenData.value?.symbol} donated!</Text>
      </Group>
    </>
  );
};

export default DonateModal;
