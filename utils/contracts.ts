import { Signer as EthersSigner, providers } from "ethers";
import { useContract, useContractRead } from "wagmi";

export type Signer = EthersSigner | providers.Provider | null | undefined;

import contractAddress from "../public/src/contracts/contract-address.json";

function config(signer: Signer) {
  return {
    addressOrName: {
      8545: contractAddress.Pap3rs,
    }[process.env.CHAIN_ID || 8545]!,
    contractInterface: require("../public/src/contracts/Pap3rs.json").abi,
    signerOrProvider: signer,
  };
}

export function usePapersContract(signer: Signer) {
  return useContract(config(signer));
}
