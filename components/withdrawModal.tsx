import React, { useState } from "react";
import { Modal, Button, Group, NumberInput, Stack, Text, Space } from "@mantine/core";
import { useSigner } from "wagmi";
import { usePapersContract, useMockTokenContract } from "../utils/contracts";
import { NextPage } from "next";
import { parseEther, formatEther } from "ethers/lib/utils";
import { useForm } from "@mantine/form";
import { useAsync } from "react-use";
import { upperCaseFirst } from "upper-case-first";
import { Cash } from "tabler-icons-react";

const WithdrawModal: NextPage<{ cid: string }> = ({ cid }) => {
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

  type FormValues = { amount: number};

  const onSubmit = async ({ amount: amountEther }: FormValues) => {
    const amountWei = parseEther(amountEther.toString());
    const tokenName = await mockTokenContract.name();
    console.log(`Going to withdraw ${amountEther} from CID ${cid} via contract: ${contract.address}`);
    await contract.withdraw(cid, `${mockTokenContract.address}`, amountWei);
  };

  const form = useForm<FormValues>({
    initialValues: {
      amount: 100
    },
  });

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Claim your donation"
      >
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack>
            <NumberInput
              required
              label="Withdrawal amount"
              {...form.getInputProps("amount")}
            />
            <Button type="submit" size="md" radius="xl">Withdraw {form.values.amount} {tokenData.value?.symbol}</Button>
            <Text>Wallet balance: <strong>{tokenData.value?.balance}</strong> {tokenData.value?.symbol}</Text>
          </Stack>
        </form>
      </Modal>
      <Group position="center" style={{
        flexWrap: "nowrap",
      }}>
        <Button
          onClick={() => setOpened(true)}
          leftIcon={<Cash />}>
          Withdraw
        </Button>
      </Group>
    </>
  );
};

export default WithdrawModal;
