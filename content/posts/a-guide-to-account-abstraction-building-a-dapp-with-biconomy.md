---
title: "A guide to Account Abstraction & BUILDing a dApp with Biconomy"
date: "2023-08-20"
brief: "If you have come across this, I'm sure this is not the first article you are reading to understand AA, trust me, I've been there."
topic: protocols
original: "https://reet.hashnode.dev/a-guide-to-account-abstraction-building-a-dapp-with-biconomy"
---

If you have come across this, I'm sure this is not the first article you are reading to understand AA, trust me, I've been there.

When I hear about AA, the only 2 words that are constant are EOAs and UX improvements.

No one really tells how AA works, but everyone will come and talk about the outcome that is derived from AA.

When you finish reading this article, I am certain you will truly understand what AA is all about and why is everyone saying it's the future.

First, let's make one thing clear; This is NOT account abstraction:

-   gasless transactions

-   "web3-auth" type social login

-   native multi-sig

Some of these might be the result of AA, but this is not AA.

Yes, AA improves user experience.

Yes, AA makes it easy for your grandma to use a dApp.

## But WTF is AA?

AA is nothing but the ability to set the validity conditions of a transaction programmatically.

[EIP-4337 by Vitalik](https://eips.ethereum.org/EIPS/eip-4337); which is the talk of the town describes AA as the ability to use smart contract wallets containing arbitrary verification logic instead of EOAs as their primary account.

### What are validity conditions?

Currently, all transactions on Ethereum are valid only and only if:

-   there is enough balance to pay for gas

-   the transaction has a valid digital signature

-   the [nonce](https://www.youtube.com/watch?v=EOgpr73-pgc) is correct

### So...Where is account abstraction here?

Now, imagine that you, as a developer, can define your own set of conditions for a transaction to be valid!

While you ponder that thought, let's take a look at the two types of Account Abstraction that exist:

***Stateless AA:*** doesn't depend on the external state

***Stateful AA:*** can depend on external state

## Leveraging AA with Biconomy

Biconomy is a developer tooling platform focused on infrastructure and tooling for the Ethereum ecosystem. Biconomy implements a modified version of EIP-4337 and offers features like paying for users’ gas fees as part of an SDK.

So, yeah, paying users' gas fees is truly a result of AA, but it's not only limited to that.

Using AA, you can also create smart accounts through which you can:

-   Pay gas in any token

-   Social or biometric-based wallet creation & login

-   Account recovery in case of loss of seed phrase

-   Remove the necessity to sign endless pop-ups (session keys)

-   Simple onboarding for non-web3 users

-   Setting spending limits

Pretty cool, right?

Let's take a deeper look into how bionomy is leveraging AA to provide what you might need:

1.  ***Gasless transactions:*** Sponsor gas for all your users, or conditionally for your most loyal users. Or let them pay gas in any token.

2.  ***Chain-agnostic dApps:*** Make your application chain agnostic in minutes. No complicated dev efforts are required. They aggregate the leading protocols such as Wormhole, Axelar and more to save development time.

3.  ***Batching transactions:*** Batch multiple transactions into a one-click experience. Users just sign the whole batch once and our relayers manage all transactions on their behalf.

Enough with the theory, we are getting straight to building a very simple dApp leveraging AA and integrating Biconomy's SDK:

I followed the [official documentation](https://docs.biconomy.io/quick-start/build-your-first-aa-powered-dapp) for building this and it was a pretty smooth experience.

As developing a dApp, here are some main steps, you need to follow:

1.  Write the smart contract

We are building a simple counter dApp. This smart contract acts as a simple counter. It has a public state variable count which stores the count. It has a function incrementCount() which increases the count by 1 and emits an event updateCount which passes the new count.

```
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
contract Counter {
    uint256 public count;

    event updateCount(uint newCount);

    function incrementCount() public returns(uint256) {
        count +=1;
        emit updateCount(count);
        return count;
    }
}
```

1.  Register the smart contract

Using Biconomy's dashboard simply register the contract and don't forget to save the contract address for later.

Here's mine: **0xd9145cce52d386f254917e481eb44e9943f39138**

I have used Polygon's Mumbai testnet for deploying the contract and you can get some funds from [this](https://faucet.polygon.technology/) faucet.

1.  Initialising frontend

We are using vite to create a react app here, just to make things simpler. Just make sure to install all the dependencies here.

```
yarn add @biconomy/core-types @biconomy/smart-account @biconomy/web3-auth ethers@5.7.2
yarn add @esbuild-plugins/node-globals-polyfill rollup-plugin-polyfill-node stream-browserify
```

1.  SDK Integration

While following the documentation, I faced an error in regard to some external packages.

Here is a snapshot of the error:

![](/writing/a-guide-to-account-abstraction-building-a-dapp-with-biconomy/01-f99e52.webp)

It was fairly simple to debug and it worked after I replaced this:

![](/writing/a-guide-to-account-abstraction-building-a-dapp-with-biconomy/02-67df68.webp)

1.  1.  Gasless txn

Coming to the superhero portion! Setting up gasless transactions, it is easier than you think. Just follow along.

Here's what we have accomplished so far:

```
// Initialize Biconomy SDK const 
socialLoginSDK = new SocialLogin()

// Create smart account 
const smartAccount = new SmartAccount(web3Provider) const acct = await smartAccount.init()

// Send gasless transaction 
const txResponse = await smartAccount.sendTransaction({ transaction: tx1 })
```

That's pretty much it!

You can check my GitHub repo for the source code [here](https://github.com/reetbatra/counter-dApp-biconomy).

So, next time when you're building a dApp, use Biconomy's AA to improve its UX (now you know what exactly does this mean!)

To read more on ERC4337, check [this](https://github.com/4337Mafia/awesome-account-abstraction) awesome repo fo amazing articles and blogs.
