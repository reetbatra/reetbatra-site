---
title: "Paymaster: The Secret to Making dApps Feel Like Web2"
date: "2025-02-25"
brief: "Imagine a world where gas fees no longer hinder smooth and frictionless transactions."
topic: protocols
original: "https://reet.hashnode.dev/paymaster-the-secret-to-making-dapps-feel-like-web2"
---

## Introduction

Imagine a world where gas fees no longer hinder smooth and frictionless transactions. With **Paymaster**, we've brought this vision to life by allowing users to pay their gas fees using **various tokens**, eliminating the need to hold ETH or STRK just to cover transaction costs.

Whether you hold **stablecoins, major tokens, or other assets**, you can now transact freely, focusing entirely on using the dApp to its full potential without the hassle of gas management.

In this blog, we’ll explore **Paymaster’s core functionalities**, its benefits, and how you can integrate it into your **Starknet dApp** for a seamless user experience.

* * *

## What is Paymaster? 🏦

**Paymaster** is an innovative solution that enables **gasless transactions** and flexible gas payments. Instead of requiring users to hold ETH or STRK for transaction fees, Paymaster allows dApps to either **sponsor gas fees** or let users pay using **any supported token**.

### How Does Paymaster Work?

1.  **Sponsor Gas Fees**: The dApp covers the user's gas costs, creating a frictionless onboarding experience.

2.  **Flexible Token Payments**: Users can pay gas fees with any token they hold, not just ETH or STRK.

3.  **Meta-Transactions**: Transactions can be executed on behalf of users, making interactions smoother.

### Benefits of Paymaster:

✅ **Frictionless UX** – No need for users to manage gas tokens.

✅ **Onboarding Simplification** – New users can interact with dApps without holding ETH.

✅ **Gas Payments in Any Token** – Users can pay gas fees with stablecoins or any supported token.

✅ **Improved dApp Adoption** – Lower barriers encourage more interaction.

> **Use Case Example:** Imagine a DeFi platform where users can swap tokens without worrying about ETH for gas fees. Paymaster makes this possible!
> 
> or…
> 
> POAPs! You can sponsor user’s gas fees to mint NFTs for free! Now, if that is not onboarding your grandma onchain, idk what is 🤔

* * *

## AVNU’s Paymaster on Starknet 🛠️

### **Architecture Overview**

-   **User chooses a gas token**: Instead of ETH, users select USDC, USDT, or another supported asset.

-   **Signature Approval**: Users sign a transaction without needing ETH.

-   **API Calls**: The dApp makes calls to fetch gas prices, generate typed data, and execute transactions.

-   **Transaction Execution**: The Paymaster service handles the rest, ensuring smooth blockchain execution.

Before diving into **AVNU’s Gasless SDK**, let's first understand why we need **Paymaster** and whether there are alternative solutions.

### **The Problem with Traditional Gas Fees**

On Ethereum and Starknet, users must hold **ETH (or STRK)** to pay for transaction fees. This creates several friction points:

-   New users must **acquire ETH/STRK** before using a dApp.

-   Managing multiple tokens for **gas and transactions** adds complexity.

-   **Due to gas fee requirements, DeFi, gaming, and consumer applications** struggle with adoption

    ### **Are There Alternative Solutions?**

    There are a few other solutions available:

    -   **Meta-transactions** (Users sign messages, relayers execute the transaction, covering gas fees.)

    -   **Third-party sponsorship services** (Protocols or projects cover gas fees for new users.)

    -   **Layer 2 scaling** solutions reduce fees but still require ETH/STRK.

Among these, **AVNU’s Paymaster** offers **a flexible** and **developer-friendly** approach, allowing both sponsorship and token-based gas payments.

## **Gasless vs Gas-Free: Understanding the Difference**

### **Gas-Free Transactions** 🔥

Gas-Free means **no fees for the user or dApp**—transactions are executed without any cost. This typically requires a sponsor (like a project or protocol) covering all gas fees.

### **Gasless Transactions** 💨

Gasless means the **user doesn’t need ETH** for gas but still pays fees using another token. This eliminates the need to manage ETH, making transactions smoother while keeping a decentralized cost structure.

## **Do You Need an API Key for Paymaster?** 🔑

### **When is an API Key Required?**

An **API key is required** in the following cases:

-   **Sponsoring transactions** – If a dApp wants to cover the gas fees on behalf of users, it must authenticate via an API key.

-   **Using advanced Paymaster features**, such as rewards-based gas sponsorship.

-   **Building and executing typed data via the API** – Required for sponsored transactions.

### **When is an API Key Not Required?**

An **API key is NOT required** when:

-   The user is **paying gas fees themselves** using supported tokens (e.g., USDC, USDT, etc.).

-   Checking **account compatibility** with the gasless service.

-   Fetching **gas token prices** for display in the UI.

* * *

## 🏗️ Implementing AVNU’s Paymaster in Your Starknet dApp

## **Setting Up a Basic Starknet Project**

Before jumping into AVNU’s Gasless SDK, let's first set up a basic Starknet project. This will help you understand how Paymaster integrates into a real-world dApp.

### **Step 1: Creating a New Starknet Project**

Start by setting up a new JavaScript/TypeScript project for Starknet development.

```
mkdir starknet-gasless-dapp && cd starknet-gasless-dapp
npm init -y # or yarn init -y
```

### **Step 2: Installing Required Dependencies**

```
yarn add starknet dotenv @avnu/gasless-sdk axios
```

### **Step 3: Setting Up a .env File for API Keys**

Create a `.env` file to securely store your API keys:

```
touch .env
```

Inside `.env`, add:

```
PAYMASTER_API_KEY=your-api-key-here
```

### **Step 4: Setting Up a Basic Starknet Account & Contract Call**

```
import { Provider, Account, Contract } from "starknet";
import dotenv from "dotenv";
dotenv.config();

const provider = new Provider({ rpc: "https://starknet.api.avnu.fi" });
const account = new Account(provider, "YOUR_ACCOUNT_ADDRESS", "YOUR_PRIVATE_KEY");

async function callContract() {
    const contract = new Contract("CONTRACT_ADDRESS", ABI, account);
    const result = await contract.call("functionName", [param1, param2]);
    console.log("Result:", result);
}

callContract();
```

At this point, we have set up a basic Starknet project that interacts with a contract. However, **this setup still requires ETH/STRK for gas fees**—this is where AVNU’s Gasless SDK comes in.

## **Using the Gasless SDK Without an API Key**

If the user is paying gas fees in an alternative token, we can proceed without an API key.

### **Checking Gasless Compatibility**

```
import { fetchAccountCompatibility } from '@avnu/gasless-sdk';

async function checkCompatibility(accountAddress) {
    const compatibility = await fetchAccountCompatibility(accountAddress);
    console.log("Gasless Compatible:", compatibility.isCompatible);
}
```

### **Fetching Gas Token Prices**

```
import { fetchGasTokenPrices } from '@avnu/gasless-sdk';

async function getGasPrices() {
    const prices = await fetchGasTokenPrices();
    console.log("Gas Token Prices:", prices);
}
```

### **Executing a Gasless Transaction (User Pays with a Supported Token)**

```
import { executeCalls } from '@avnu/gasless-sdk';

async function executeGasless(account, calls) {
    const response = await executeCalls(account, calls, {
        gasTokenAddress: "USDC", // User pays gas in USDC
        maxGasTokenAmount: BigInt(1000000000),
    });
    console.log("Transaction Hash:", response.transactionHash);
}
```

## **Using the Gasless SDK With an API Key (Sponsored Transactions)** 🔑

If the dApp wants to sponsor gas fees, we need to use an API key. Contact AVNU to get your own API key.

### **Fetching Gasless Service Status**

```
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function checkGaslessStatus() {
    const response = await axios.get('https://starknet.api.avnu.fi/paymaster/v1/status');
    console.log("Gasless Service Status:", response.data);
}
```

### **Building Typed Data for Sponsored Transactions**

```
async function buildTypedData(userAddress, calls) {
    const response = await axios.post('https://starknet.api.avnu.fi/paymaster/v1/build-typed-data', {
        userAddress,
        gasTokenAddress: null, // Sponsored gas
        maxGasTokenAmount: null, // Sponsored gas
        calls,
    }, {
        headers: { 'api-key': process.env.PAYMASTER_API_KEY },
    });
    console.log("Typed Data:", response.data);
}
```

### **Executing Sponsored Transactions**

```
async function executeSponsoredTransaction(userAddress, typedData, signature) {
    const response = await axios.post('https://starknet.api.avnu.fi/paymaster/v1/execute', {
        userAddress,
        typedData,
        signature,
    }, {
        headers: { 'api-key': process.env.PAYMASTER_API_KEY },
    });
    console.log("Sponsored Transaction Hash:", response.data.transactionHash);
}
```

* * *

## 📚 Additional Resources

-   [AVNU Docs](https://doc.avnu.fi/avnu-paymaster/integration)

-   [Argent Wallet & Session Keys](https://docs.argent.xyz/aa-use-cases/session-keys)

💡 **Stay updated with the latest in Starknet, Cairo and more!**
