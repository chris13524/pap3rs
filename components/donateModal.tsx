import React, { useEffect, useState } from "react";
import { Container, TextInput, Text, Modal, Button, Group } from "@mantine/core";

import { useAccount, useSigner } from "wagmi";
import { usePapersContract, useMockTokenContract } from "../utils/contracts";

function DonateModal() {

  const [opened, setOpened] = useState(false);

  const { data: signer, isError: isError2, isLoading: isLoading2 } = useSigner();
  const { data: account, isError, isLoading, address, isConnected } = useAccount();

  const [donationAmount, setDonationAmount] = useState("");

  const contract = usePapersContract(signer);
  const mockTokenContract = useMockTokenContract(signer);

  async function approve() {
    try {
      let tokenName = await mockTokenContract.name();
      console.log(`Going to approve ${donationAmount} ${tokenName}`);
      await mockTokenContract.approve(contract.address, `${donationAmount}000000000000000000`);
    }
    catch(error) {
      console.error("Error approving: ",error);
    }
  }

  async function donate() {
    try {
      console.log(`Going to donate ${donationAmount} to CID ${this.props.cid} via contract: ${contract.address}`);
      await contract.donate(this.props.cid, `${mockTokenContract.address}`, `${donationAmount}000000000000000000`);
    }
    catch(error) {
      console.error("Error approving: ",error);
    }
  }

  return (
    <Container size="sm">
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Donate to this paper"
    >

    <TextInput
      required
      label="Donation Amount"
      value={donationAmount}
      onChange={(e)=>  setDonationAmount(e.target.value)}
    />

    <Button size="md" radius="xl" onClick={approve}>Approve {donationAmount}</Button>
    <Button size="md" radius="xl" onClick={donate}>Donate</Button>
    </Modal>
        <Group position="center">
          <Button onClick={() => setOpened(true)}>Donate</Button>
        </Group>
    </Container>
  );
}

export default DonateModal;
