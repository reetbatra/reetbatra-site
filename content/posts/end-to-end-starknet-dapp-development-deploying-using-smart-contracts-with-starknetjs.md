---
title: "End-to-End Starknet dApp Development with Starknet.js"
date: "2025-02-10"
brief: "Starknet is a powerful Layer 2 scaling solution for Ethereum that enables developers to deploy and interact with Cairo-based smart contracts."
topic: protocols
original: "https://reet.hashnode.dev/end-to-end-starknet-dapp-development-deploying-using-smart-contracts-with-starknetjs"
---

Starknet is a powerful Layer 2 scaling solution for Ethereum that enables developers to deploy and interact with **Cairo-based smart contracts**. But how do we build an end-to-end dApp, from **contract deployment** to **frontend interaction**?

We relied on **Starkli** (Starknet CLI) to deploy contracts, which is a banger. However, with **Starknet.js**, we can **interact with contracts seamlessly from our frontend** without switching tools. In this guide, we will:

• **Deploy a contract to Starknet**

• **Read from and write a contract using Starknet.js**

• **Integrate with a Next.js frontend**

• **Connect a Starknet wallet (ArgentX or Braavos)**

• **Perform transactions (increase/decrease a counter)**

By the end, you’ll have **a fully functional Starknet dApp** running with **Starknet.js**.

The source code of this demo can be accessed [here](https://github.com/reetbatra/starknetjs-counter).

# Getting Started

## Prerequisites

To follow this guide, ensure you have:

• **Node.js** (v18+)

• **Yarn or npm**

• **A Starknet wallet (ArgentX or Braavos)**

• **Basic knowledge of TypeScript & Next.js**

• **Cairo (for smart contracts)**

• **Scarb (Starknet package manager)**

There is a single command installation too! You can follow [this](https://x.com/starkience/status/1892592039315026308) 1 minute video guide.

## **Step 1: Setting Up a New Project**

Simply create a new folder where you want your project to be:

```
mkdir counter
scarb init
```

You should have the option to choose between the Cairo test and Starknet Foundry; I went ahead with the recommended one for this tutorial.

![](/writing/end-to-end-starknet-dapp-development-deploying-using-smart-contracts-with-starknetjs/01-458c34.webp)

This should create a src folder with a lib.cairo file, which will be our contract file in Cairo. This tutorial is not focused on learning cairo but for developers who want to learn Starknet.js, hence using a simple counter contract to interact with smart contract is used.

This is new lib.cairo file in Cairo which has 3 major functions:

-   read the counter value

-   increase the counter value with a custom argument provided through frontend

-   decrease the counter value

```
// Cairo 2.9.2

#[starknet::interface]
trait ITestSession<TContractState> {
    fn increase_counter(ref self: TContractState, value: u128);
    fn decrease_counter(ref self: TContractState, value: u128);
    fn get_counter(self: @TContractState) -> u128;
}

#[starknet::contract]
mod test_session {
    use starknet::storage::StoragePointerWriteAccess;
    use starknet::storage::StoragePointerReadAccess;

    #[storage]
    struct Storage {
        count: u128,
    }

    #[abi(embed_v0)]
    impl TestSession of super::ITestSession<ContractState> {
        fn increase_counter(ref self: ContractState, value: u128) {
            self.count.write(self.count.read() + value);
        }

        fn decrease_counter(ref self: ContractState, value: u128) {
            let current = self.count.read();
            if current >= value {
                self.count.write(current - value);
            } else {
                self.count.write(0); // Prevents underflow
            }
        }

        fn get_counter(self: @ContractState) -> u128 {
            self.count.read()
        }
    }
}
```

Once the contract is there, we should build it to get the casm and sierra files. This can be done using these commands. Make sure to be inside the contracts folder. This step might take a while.

```
cd contracts
scarb build
```

After compiling, your **ABI** (Application Binary Interface) and contract artifacts will be inside target/dev/ including sierra and casm files.

## **Step 2: Connecting to a Starknet Wallet**

### Installing a wallet

Download **ArgentX** or **Braavos**:

• [ArgentX Chrome Extension](https://chrome.google.com/webstore/detail/argent-x/dlcobpjiigpikoobohmabehhmhfoodbb)\- standard account

• [Braavos Wallet](https://braavos.app/)

Once installed, **create an account** and **fund it with Sepolia ETH**.

## **Step 3: Deploying the Contract**

We will use **Starknet.js** to deploy the contract.

**For this tutorial, we’d need:**

1.  The contract’s ABI

2.  The contract’s Address

3.  An Argent or Braavos wallet

4.  React.js \[front-end framework\]

5.  Starknetjs \[dependency\]

    Make a new file called deploy.ts in the root directory. Since, our contract is already there as we’re using public RPC URL, we’d just be deploying a new instance of it. If you’re using your own new contract, follow [these](https://starknetjs.com/docs/guides/create_contract) steps to deploy it.

This is your deploy.ts file which is simply used to deploy your contract. Here we’re only deploying a new instance of it. You’d need a wallet account with the address, private key, and classHash of the contract. To save the ABI, I’ve logged it here and saved it in a separate JSON file inside public folder as you’d need to access it later.

After your contract is deployed, save its address and check it on Starkscan/voyager.

```
import {
  Contract,
  Account,
  json,
  shortString,
  RpcProvider,
  hash,
} from "starknet";
import fs from "fs";

async function main() {
  const provider = new RpcProvider({
      nodeUrl: "https://starknet-sepolia.public.blastapi.io",
  });

  // Check that communication with provider is OK
  const ci = await provider.getChainId();
  console.log("chain Id =", ci);

  // Initialize existing Argent X testnet accountn
  const accountAddress =
      "0x...";
  const privateKey =
      "0x....";
  const account0 = new Account(provider, accountAddress, privateKey);
  console.log("existing_ACCOUNT_ADDRESS =", accountAddress);
  console.log("existing account connected.\n");

  // Since we already have the classhash, we will be skipping this part
  const testClassHash =
      "0x396823b2b056397dc8f3da80d20ae8f4b0630d33b089b36ba3c3c9a7a51c7d0";

  const deployResponse = await account0.deployContract({ classHash: testClassHash });
  await provider.waitForTransaction(deployResponse.transaction_hash);

  // Read ABI of Test contract
  const { abi: testAbi } = await provider.getClassByHash(testClassHash);
  if (testAbi === undefined) {
      throw new Error("no abi.");
  }

  // ✅ Log Full ABI
  console.log("Full ABI:", JSON.stringify(testAbi, null, 2));

  // Connect the new contract instance:
  const myTestContract = new Contract(testAbi, deployResponse.contract_address, provider);
  console.log("✅ Test Contract connected at =", myTestContract.address);
}

// contract address: 0x75410d36a0690670137c3d15c01fcfa2ce094a4d0791dc769ef18c1c423a7f8

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
```

Use this command to run your deploy file.

```
npx tsx deploy.ts
```

I’ve attached my ABI.json file here for reference:

```
[
    {
      "type": "impl",
      "name": "TestSession",
      "interface_name": "counter_starknetjs::ITestSession"
    },
    {
      "type": "interface",
      "name": "counter_starknetjs::ITestSession",
      "items": [
        {
          "type": "function",
          "name": "increase_counter",
          "inputs": [
            {
              "name": "value",
              "type": "core::integer::u128"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "decrease_counter",
          "inputs": [
            {
              "name": "value",
              "type": "core::integer::u128"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "get_counter",
          "inputs": [],
          "outputs": [
            {
              "type": "core::integer::u128"
            }
          ],
          "state_mutability": "view"
        }
      ]
    },
    {
      "type": "event",
      "name": "counter_starknetjs::test_session::Event",
      "kind": "enum",
      "variants": []
    }
  ]
```

## Step 4: Connecting contracts to frontend

Create a new folder and initialize it with the next.js (App router), and install starknet-react, which uses starknet.js under the hood to interact with frontend.

```
mkdir web
npx create-next-app@latest starknet-counter
cd starknet-counter
npm install starknet @starknet-react/core @starknet-react/chains
```

Move your ABI.json file to the public folder to access it more easily.

Create a new component called Providers.tsx to configure chains, providers, connectors, wallets, and accounts. This will be a client-side component.

```
"use client";
import React from "react";

import { sepolia } from "@starknet-react/chains";
import {
  StarknetConfig,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
  jsonRpcProvider
} from "@starknet-react/core";

export function Providers({ children }: { children: React.ReactNode }) {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [
      argent(),
      braavos(),
    ],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: "onlyIfNoConnectors",
    // Randomize the order of the connectors.
    order: "random"
  });

  return (
    <StarknetConfig
      chains={[sepolia]}
      provider={jsonRpcProvider({rpc: (chain) => ({nodeUrl: process.env.NEXT_PUBLIC_RPC_URL})})}
      connectors={connectors}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
}
```

Then go to your layout.tsx file and wrap it in the Providers component. Don’t forget to import it. This is how it should look like:

```
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Counter Starknetjs",
  description: "Counter demo by starknet js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
        {children}
        </Providers>

      </body>
    </html>
  );
}
```

We’d need another component to check wallet connection; this will also be a client-side component that will let the users connect or disconnect their Braavos or Argent wallet while also showing their address. This is how my WalletBar.tsx file looks like:

```
"use client";
import { useConnect, useDisconnect, useAccount } from "@starknet-react/core";

const WalletBar: React.FC = () => {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  return (
    <div className="flex flex-col items-center p-4 bg-gradient-to-br from-[#1A1A2E] to-[#0F3460] rounded-2xl shadow-lg w-full max-w-sm">
      {!address ? (
        <div className="flex flex-wrap justify-center gap-3">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              className="px-5 py-2 font-medium rounded-lg bg-[#0F3460] text-white border border-[#1B98E0] hover:bg-[#1B98E0] transition-all duration-300 shadow-md"
            >
              Connect {connector.id}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-3">
          <div className="text-sm bg-[#1B98E0] px-4 py-2 text-white font-semibold rounded-lg shadow-md">
            🔗 Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          <button
            onClick={() => disconnect()}
            className="px-5 py-2 font-medium rounded-lg bg-red-600 text-white border border-red-800 hover:bg-red-800 transition-all duration-300 shadow-md"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletBar;
```

## Step 4: Reading data from blockchain

We’d modify our page.tsx file to read the data from blockchain and connect our wallet as well. This will also be loaded on the client side so, add “use client” on the top.

We will be using pre-defined react hooks for this.

```
export default function Home() {
  // ✅  Read the latest block
  const { data: blockNumberData, isLoading: blockNumberIsLoading, isError: blockNumberIsError } = useBlockNumber({ blockIdentifier: "latest" });

  // ✅ Read your balance
  const { address: userAddress } = useAccount();
  const { isLoading: balanceIsLoading, isError: balanceIsError, error: balanceError, data: balanceData } = useBalance({ address: userAddress, watch: true });
}
```

## Step 5: Interacting with smart contracts

For this- we will call functions defined in the contract to increase or decrease the counter.

```
export default function Home() {
  // ✅ Read from a contract
  const contractAddress = "0x75410d36a0690670137c3d15c01fcfa2ce094a4d0791dc769ef18c1c423a7f8";
  const { data: readData, isError: readIsError, isLoading: readIsLoading, error: readError } = useReadContract({
    functionName: "get_counter",
    args: [],
    abi: ABI as Abi,
    address: contractAddress,
    watch: true,
    refetchInterval: 1000,
  });

  // ✅ Increase & Decrease Counter
  const [amount, setAmount] = useState<number | ''>(0);
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAmount(value === "" ? "" : Number(value));
  };
```

That’s it!

You can design the UI as preferred. Here’s how a simple UI can look with all the basic functionality required:

![](/writing/end-to-end-starknet-dapp-development-deploying-using-smart-contracts-with-starknetjs/02-dc5db7.webp)

## **Conclusion**

In this guide, we:

✅ **Wrote & deployed a Starknet contract using Starknet.js**

✅ **Connected a Starknet wallet**

✅ **Interacted with the contract using Starknet.js**

✅ **Designed a Next.js frontend**

This tutorial provides a **solid foundation** for building **full-stack dApps on Starknet**. The **full source code is available on GitHub**.

## Resources:

1.  Source code on GitHub- [https://github.com/reetbatra/starknetjs-counter](https://github.com/reetbatra/starknetjs-counter)

2.  Official Starknet.js docs- [https://starknetjs.com/docs/guides/intro](https://starknetjs.com/docs/guides/intro)

3.  Starknet-react docs- [https://www.starknet-react.com/docs/getting-started](https://www.starknet-react.com/docs/getting-started)

4.  Counter contract example- [https://starknet-by-example.voyager.online/getting-started/basics/counter](https://starknet-by-example.voyager.online/getting-started/basics/counter)

Stay tuned for more such tutorials along the way. See you in the trenches!
