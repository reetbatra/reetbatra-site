---
title: "Mastering Chain Abstraction: How to Simplify Multi-Chain Interactions"
date: "2024-07-12"
brief: "Last year in crypto was all about Account Abstraction hype and indeed it did solve major UX problems and facilitated smoother interactions, but we are still a long way from crypto…"
topic: protocols
original: "https://reet.hashnode.dev/mastering-chain-abstraction-how-to-simplify-multi-chain-interactions"
---

Last year in crypto was all about Account Abstraction hype and indeed it did solve major UX problems and facilitated smoother interactions, but we are still a long way from crypto mass adoption. That is exactly where chain abstraction comes in.

Let's be honest, if you've been hanging around in the web3 space, how many dApps do you have installed on your phone, and how many of them do you even open on a daily basis? Unless you're into trading, and even then mainly on DEXs, you're not really a web3 user. Most of us are just advocates of blockchain tech, not big users, because the UX sucks and there are countless other barriers.

# The Problem

Now, if you say you have massive on-chain activity, my next question is, on which blockchain? There are hundreds of L1s and then there are L2s, and the list is never-ending. Of course, if the blockchain is EVM-compatible, you use the standard wallets, DEXs, block explorers, etc. But if you're exploring non-EVM L2s or even chains like Solana, you need to have multiple wallets, store multiple seed phrases, and check multiple block explorers for each blockchain.

Bridging itself is complex: the user must identify a bridge that supports the destination chain, approve the transaction, pay gas fees, and then wait for the bridge to transfer the tokens to the new chain. Each of these steps adds friction and increases the chances of a mistake, which might lead to loss of funds, making the user experience even more daunting.

For developers, the landscape isn’t any easier. They face the challenge of user distribution across different chains while their application’s functionality might reside on another. This disconnect limits their applications' potential reach and usability. Moreover, committing to a single ecosystem can restrict their ability to leverage the technical advantages of other chains, stifling innovation and growth.

![](/writing/mastering-chain-abstraction-how-to-simplify-multi-chain-interactions/01-b9e08d.webp)

# The Solution: Chain Abstraction

## What the heck is Chain Abstraction?

Chain Abstraction is a concept introduced by [NEAR Protocol](https://docs.near.org/build/chain-abstraction/what-is). The idea behind chain abstraction is quite simple: **blockchain** technology should be **abstracted away** from the user experience. In other words, people should **not realize** when they are **using a blockchain**, nor **which blockchain** they are using.

Chain Abstraction takes away the complexity of having to use multiple wallets on multiple chains, and having one unified experience.

A user wouldn’t have to care about the underlying technology, hence the complexity of knowing the chain, managing tokens, swapping, etc. Theoretically, combining chain abstraction with intents is the most UX-friendly solution.

A fully chain-abstracted experience looks like this:

-   Emma discovers a DeFi game called "CryptoQuest," hosted on the **Near Protocol**.
-   Emma uses her **Ethereum**\-based DAI to buy an in-game item. The app bridges her DAI to **Near Protocol** using atomic swaps, making the process seamless.
-   Emma earns game tokens and buys a rare NFT listed on the **Binance Smart Chain**. The app handles the cross-chain transaction in the background.
-   Emma gifts the NFT to her friend Liam, whose wallet is on **Avalanche**. Using chain abstraction, she sends it directly to Liam’s Universal Account, paying the gas fee in USDT.
-   Liam takes a loan against the NFT on **Aave (Polygon)** and invests in a DeFi project on **Fantom**, all within the CryptoQuest interface.
-   Liam’s Universal Account and the app's unified interface make it easy to manage assets across multiple blockchains without technical hassle.

### Chain Abstraction

Simply put, Chain abstraction will let users manage assets seamlessly without managing complex chains, wallets, gas fees, or bridges.

### Intents

As the term implies, intent is the simplest expression of a user’s goal. For instance, an intent could be, “A user wants to send Token X to Y chain.” This action is facilitated by various third-party entities such as solvers, relayers, and paymasters.

## How Chain Abstraction Works

Chain abstraction aims to streamline the user experience by hiding the complexities of interacting with multiple blockchain networks. Here’s a detailed look at how it works:

### Account Abstraction

-   **Traditional Method:** Users need separate accounts (wallets) for each blockchain, each with unique addresses and private keys.

-   **Abstracted Method:** Users manage multiple blockchain accounts through a single interface using Universal Accounts. Multi-Party Computation (MPC) and Threshold Signature Schemes (TSS) enhance security. Social logins simplify onboarding, allowing access via familiar credentials like Google or Facebook.

### Liquidity Abstraction

-   **Traditional Method:** Users manually bridge assets between blockchains, which is cumbersome and risky.

-   **Abstracted Method:**

    -   **Atomic Swaps:** Directly exchange assets between different blockchains without intermediaries.

    -   **Automated Market Makers (AMMs):** Facilitate seamless asset swaps across chains.

    -   **Cross-Chain Messaging Protocols:** Protocols like LayerZero enable secure communication between blockchains, facilitating transactions without traditional bridges.

### Gas Abstraction

-   **Traditional Method:** Users need to hold the native token of each blockchain to pay for transaction fees.

-   **Abstracted Method:**

    -   **Meta Transactions:** Allow users to pay gas fees in a token of their choice (e.g., USDT, USDC) with a relayer paying the gas fee and being reimbursed later.

    -   **Gasless Transactions:** Some platforms cover the gas fees, allowing users to perform transactions without directly paying for gas.

### Smart Contract Abstraction

-   **Traditional Method:** Developers must deploy and manage smart contracts on each blockchain, which is complex and resource-intensive.

-   **Abstracted Method:**

    -   **Cross-Chain Smart Contracts:** Enable a single smart contract to interact with multiple blockchains.

    -   **Interoperability Standards:** Standards like the Inter-Blockchain Communication (IBC) protocol allow smart contracts on different blockchains to communicate seamlessly.

### User Interface Abstraction

-   **Traditional Method:** Users switch between different DApps and interfaces for each blockchain, each with its own learning curve.

-   **Abstracted Method:**

    -   **Unified Interfaces:** Provide a single, cohesive interface that abstracts away the underlying blockchain differences.

    -   **Contextual Interaction:** The interface adjusts based on the blockchain the user is interacting with, ensuring a smooth and consistent user experience.

## Tech Behind Chain Abstraction

### Unified APIs

Unified APIs provide a consistent interface for developers, abstracting differences between blockchain networks. They present a standard set of functions for tasks like sending transactions, deploying smart contracts, and querying blockchain data.

Example:

```
// Unified API for sending transactions
const sendTransaction = async (network, from, to, value) => {
  const transaction = await unifiedAPI.sendTransaction({
    network,
    from,
    to,
    value,
  });
  console.log('Transaction Hash:', transaction.hash);
};

// Usage for Ethereum
sendTransaction('ethereum', '0xYourAddress', '0xRecipientAddress', '1.0');
```

### Cross-chain Communication Protocols

Cross-chain communication involves techniques like:

-   **Atomic Swaps:** Exchange assets between blockchains without a trusted third party using hash time-locked contracts (HTLCs).

-   **Relays:** Systems where one blockchain monitors the state of another.

-   **Interoperability Protocols:** Protocols like the Inter-Blockchain Communication (IBC) enable secure and reliable data exchange between different blockchains.

Example:

```
const initiateAtomicSwap = async (network1, network2, from, to, value) => {
  const tx1 = await unifiedAPI.initiateSwap({
    network: network1,
    from,
    to,
    value,
    hashLock: '0xHashLockValue',
    timeLock: 3600,
  });
  console.log('Swap initiated on network1:', tx1.hash);

  const tx2 = await unifiedAPI.initiateSwap({
    network: network2,
    from,
    to,
    value,
    hashLock: '0xHashLockValue',
    timeLock: 3600,
  });
  console.log('Swap initiated on network2:', tx2.hash);
};
```

### Smart Contract Deployment Tools

Chain abstraction tools simplify deploying smart contracts across multiple blockchains by providing deployment scripts and frameworks.

Example:

```

const deployContract = async (network, contractCode) => {
  const contract = await unifiedAPI.deployContract({
    network,
    code: contractCode,
  });
  console.log('Contract Address:', contract.address);
};

// Deploy to multiple blockchains
deployContract('ethereum', '0xYourSmartContractBytecode');
deployContract('polygon', '0xYourSmartContractBytecode');
```

Huh! Too much tech, by now you can guess that Chain Abstraction is pretty powerful and amazing. Let's take a look at some benefits of Chain Abstraction:

## Benefits of Chain Abstraction

### **For Users:**

-   **Simplified Experience:** Users can interact with multiple blockchains without needing to understand the technical details or manage multiple wallets.

-   **Enhanced Security:** By abstracting away risky elements like cross-chain bridges, users can enjoy safer interactions.

-   **Seamless Interactions:** Users can perform complex multi-chain actions through a single interface, improving the overall user experience.

### **For Developers:**

-   **Streamlined Development:** Developers can focus on creating user-friendly applications without worrying about the intricacies of different blockchains.

-   **Greater Interoperability:** Chain abstraction facilitates easier integration and interaction between different blockchain networks.

-   **Improved Adoption:** By simplifying the user experience, chain abstraction can help drive broader adoption of blockchain technology.

Let's say you wear your entrepreneur pants for a day and decide to build a decentralised version of Uber.

**Why Do We Need a Decentralized Uber?**

A decentralised Uber tackles high fees, data privacy issues, and the control exerted by centralised platforms. It offers lower fees, better privacy, increased transparency, and resilience against outages, creating a fairer and more efficient service for drivers and passengers.

Now you need to choose the blockchain you want to build your dUber based on factors like gas fees, transaction speed, and scalability must be considered. Onboarding users to the chosen blockchain adds another layer of difficulty, as it requires educating users about blockchain technology. Additionally, integrating various blockchain ecosystems and maintaining a consistent user experience across them can be complex and resource-intensive.

**How Chain Abstraction Can Improve a Decentralised Uber**

Chain abstraction simplifies user interactions across multiple blockchains, allowing seamless payments in any cryptocurrency without worrying about gas fees. Users can manage multiple blockchain accounts through a single interface, ensuring a unified and user-friendly experience. This approach also supports a unified reputation system and decentralised dispute resolution, enhancing trust and fairness on the platform.

## Current Landscape of Chain Abstraction

The leading players in the chain abstraction space include Near Protocol, Polygon's AggLayer, Optimism's Superchain, Particle Network, Agoric, Connext, Liquality, and Orderly Network. Each of these projects tackles chain abstraction from unique perspectives, using different blockchain layers, technologies, and developer tools. As a result, the practical implementation of chain abstraction is still evolving.

Current market solutions offer distinct approaches to chain abstraction. For example, NEAR Protocol uses MPC Nodes for account aggregation, while Optimism’s Superchain focuses on L2-to-L2 bridging to unify OP L2s. Polygon’s AggLayer employs ZKP aggregation to unify CDK L2s. Particle Network provides cross-chain messaging and a universal settlement layer through universal accounts. Additionally, Connext, Agoric, Liquality, and Orderly Network offer APIs and development kits to facilitate seamless cross-chain interactions. Each of these solutions contributes to a more integrated and user-friendly blockchain ecosystem.

The world of chain abstraction is indeed very huge and fascinating, if you wish to explore more, I am listing few resources I found helpful while researching for this article:

1.  NEAR docs on Chain Abstraction- [here](https://www.google.com/search?q=chain+abstraction&sourceid=chrome&ie=UTF-8)

2.  Chain Abstracted podcast- [here](https://youtube.com/playlist?list=PL9tzQn_TEuFX6Tdr8xGqHntARYhxpzaGt&si=Qiw47mWjoGBbLPH2)

3.  Cake framework by Frontier- [here](https://frontier.tech/the-cake-framework)

4.  Arcana's take on chain abstraction- [here](https://arcana.network/blog/a-beginner-s-guide-to-chain-abstraction)

5.  Why web3 onboarding is still broker by Aarc- [here](https://blog.aarc.xyz/why-is-web3-wallet-onboarding-still-broken-a-deep-dive/)

6.  Chain Abstraction by Binance Academy- [here](https://academy.binance.com/es/articles/what-is-chain-abstraction)

7.  Particle's take on Chain Abstraction- [here](https://blog.particle.network/what-is-chain-abstraction-a-formal-definition/)

8.  Developer Dao on Chain Abstraction- [here](https://blog.developerdao.com/near-chain-abstraction-explained)
