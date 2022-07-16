import React, { useRef } from 'react';
import { Text, Group, Button, createStyles, MantineTheme, useMantineTheme } from '@mantine/core';
import { Dropzone, DropzoneStatus, MIME_TYPES } from '@mantine/dropzone';
import { CloudUpload } from 'tabler-icons-react';
import { Web3Storage } from 'web3.storage';

import { useAccount, useSigner } from 'wagmi';
import { usePapersContract } from '../utils/contracts';

function makeStorageClient () {
  let web3StorageApiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweERiMUE0ZDk2MkI4NmE5RTBFQkZkNDEwODg5NzQ2MzU3ZEFjMEI2MzEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTc3NDYxOTgzMzEsIm5hbWUiOiJwYXAzcnMifQ.4B2ZNk0N-lnux76blYlWGxvVG3ZN4_McwzhSX9t08yU';
  return new Web3Storage({ token: web3StorageApiKey })
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    marginBottom: 30,
  },

  dropzone: {
    borderWidth: 1,
    paddingBottom: 50,
  },

  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
  },

  control: {
    position: 'absolute',
    width: 250,
    left: 'calc(50% - 125px)',
    bottom: -20,
  },
}));

function getActiveColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][6]
    : status.rejected
    ? theme.colors.red[6]
    : theme.colorScheme === 'dark'
    ? theme.colors.dark[0]
    : theme.black;
}

async function storeFiles(files) {
  const client = makeStorageClient()
  const cid = await client.put(files)
  console.log('stored files with cid:', cid)
  return cid
}

async function claim(contract,cid) {
  console.log(`Awaiting claim call for cid: ${cid}`);
  await contract.claim(cid);
  console.log(`Finished claim call for cid: ${cid}`);
}

async function storeWithProgress(contract,files) {

  console.log(`Storing files`,files);

  // show the root cid as soon as it's ready
  const onRootCidReady = cid => {
    console.log(`uploading files with cid: ${cid}`);
    claim(contract,cid);
  }

  // when each chunk is stored, update the percentage complete and display
  const totalSize = files.map(f => f.size).reduce((a, b) => a + b, 0)
  let uploaded = 0

  const onStoredChunk = size => {
    uploaded += size
    const pct = totalSize / uploaded
    console.log(`Uploading... ${pct.toFixed(2)}% complete`)
  }

  // makeStorageClient returns an authorized Web3.Storage client instance
  const client = makeStorageClient()

  // client.put will invoke our callbacks during the upload
  // and return the root cid when the upload completes
  return client.put(files, { onRootCidReady, onStoredChunk })
}

function DropzoneButton() {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const openRef = useRef<() => void>();

  const { data: signer, isError: isError2, isLoading: isLoading2 } = useSigner();
  const { data: account, isError, isLoading, address, isConnected } = useAccount();

  const contract = usePapersContract(signer);
  console.log(contract);
  console.log(`isConnected=${isConnected}`);

  return (
    <div className={classes.wrapper}>
      <Dropzone
        openRef={openRef}
        onDrop={(files) => { storeWithProgress(contract,files) }}
        className={classes.dropzone}
        radius="md"
        accept={[MIME_TYPES.pdf,MIME_TYPES.png]}
        maxSize={30 * 1024 ** 2}
      >
        {(status) => (
          <div style={{ pointerEvents: 'none' }}>
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
                ? 'Drop files here'
                : status.rejected
                ? 'Pdf file less than 30mb'
                : 'Upload paper'}
            </Text>
            <Text align="center" size="sm" mt="xs" color="dimmed">
              Drag&apos;n&apos;drop files here to upload. We can accept only <i>.pdf</i> files that
              are less than 30mb in size.
            </Text>
          </div>
        )}
      </Dropzone>

      <Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current()}>
        Select files
      </Button>
    </div>
  );
}

export default DropzoneButton
