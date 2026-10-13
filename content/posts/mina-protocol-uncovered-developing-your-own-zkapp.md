---
title: "Mina Protocol Uncovered: Developing Your Own zkApp"
date: "2023-05-24"
brief: "Have you ever wondered what it would be like to build a simple project on the Mina protocol?"
topic: protocols
original: "https://reet.hashnode.dev/mina-protocol-uncovered-developing-your-own-zkapp"
---

Have you ever wondered what it would be like to build a simple project on the Mina protocol?

Well, today's your lucky day! Join me on this exciting journey as we dive into the world of Mina, zkApps, and how to create your very own project.

Let's get started!

## **What is Mina?**

Mina is a layer 1 blockchain built on zero-knowledge proofs. It uses recursive zero-knowledge proofs to verify its consensus state.

## **How does Mina work its magic?**

Mina uses zk-SNARKS (Zero-Knowledge Succinct Non-Interactive Argument of Knowledge) as its proof architecture and has developed its own zk-SNARKS called Pickles, which supports a concept of recursion- that a proof can refer to itself.

As a result, Mina proofs can refer to itself and the size of the proof can remain the same no matter what thus Mina is the world's lightest blockchain, using zk to build the privacy and security layer for web3.

## **Mina's stellar offerings**

1.  **Oracles:** Mina's zkOracles allow trustless data retrieval from any HTTPS data source. Say goodbye to trusted oracles and custom website integrations

2.  **Bridging:** States and proofs from smart contracts deployed on Mina networks can also be available on Ethereum and other EVM chains. Let's say you're already building on Ethereum, Mina's zkBridge will enable Ethereum dApps to leverage Mina's properties.

3.  **Privacy:** Users of your zkApps can interact using proofs of their personal data, instead of sharing the data itself. More private and secure for the user, and no burden on you to host and safeguard their data.

## **What are zkApps?**

Zero-Knowledge Apps (zkApps) are smart contracts powered by zero-knowledge proofs, specifically zk-SNARKS. They use an off-chain execution and mostly an off-chain state model.

In a normal Ethereum dApp, computation is done on-chain. Each computation will involve making a transaction, which is expensive.

### **BUT...**

Mina uses off-chain computation and on-chain verification, so you are only sending a tiny proof and some state changes.

If the proof is valid, it will update the state on-chain and if it is invalid state will remain unchanged.

## **Reasons why zkApps are awesome**

-   Succinct- keep the blockchain succinct and scalable.

-   Efficient- can perform complicated computations at the same cost and time as a simple computation

-   Private- keeps user data private and off-chain

## **How does a zkApp work?**

To understand this better, let's take a look at the user's journey of a simple zkApp that checks if a user is older than 18 years old or not.

It is super simple and self-explanatory but notices that no proof is generated if the user is not 18+

![](/writing/mina-protocol-uncovered-developing-your-own-zkapp/01-a9b5d7.webp)

## **Architechture of a zkApp**

A zkApp is made up of two parts:

-   UI (user interface) for users to interact with it

-   A smart contract that serves as the login behind the app

The smart contract acts as the brains of the operation while the UI acts as an interactive layer for the user. The website generates the proof, which is sent to the Mina blockchain.

## **How do you write a zkApp using Mina**

Mina zkApp CLI makes it a breeze to write zk smart contracts without any heavy circuits or maths.

The Mina zkApp:

-   provides project scaffolding

-   uses existing open technologies

-   automatically includes SnarkyJS

Mina zkApp CLI runs on the browser and NodeJS. You can use existing JS/TS libraries and tools.

## **What is SnarkyJS?**

-   SnarkyJS is a TypeScript library for writing smart contracts based on zk proofs that come with Mina zkApp CLI.

-   It enables you to write circuits and smart contracts in the language you're familiar with- TypeScript.

## **zkApp Developer Experience**

After writing and deploying smart contracts with the help of Mina zkApp CLI, it will generate two things:

1.  Smart contract file

2.  Verification key

The smart contract file will integrate with the website and the verification key is sent to the Mina blockchain.

![](/writing/mina-protocol-uncovered-developing-your-own-zkapp/02-c210c1.webp)

Enough with the theory, let's start building a zkApp right away!

## **Installations:**

First, let's tackle the boring but necessary part!

Make sure you have these installed:

-   [NodeJS16+](https://nodejs.org/en)

-   [NPM 6+](https://www.youtube.com/watch?v=pHz7TgEIa0w)

Now, download the Mina zkApp CLI using:

`npm install -g zkapp-cli`

I ran into a mac specific error and in case you do too- [here](https://stackoverflow.com/a/76275435/12424673) is the solution that helped me.

## 🛠️ **Come BUIDL with me!**

We are building a zkApp that will store a number on-chain & only allows this number to be replaced by its cube.

For example:

If the number n is 2, the user can only change n to 8 (its cube, 2^3=8)

(eg: 2 -> 8 -> 512...)

### **The process to BUIDL a zkApp on Mina:**

1.  Create a new project

2.  Write the smart contract

3.  Interact with a local blockchain

4.  Deploy to Berkeley Testnet

Take a look at the smart contract. It is fairly easy to understand with the comments.

![](/writing/mina-protocol-uncovered-developing-your-own-zkapp/03-ab4eea.webp)

### **Now, Let's ship this on testnet:**

Mina's live public testnet is Berkeley and all zkApps on Mina are currently available on Berkeley. Berkeley is in its final stages of testing before mainnet.

`zk config`

This is a tool provided for managing CLI deployments.

It will create a *config.json* in our project's directory, as well as a keys folder, containing private and public keys for our application.

Link to the GitHub repo: [here](https://github.com/reetbatra/cube-zkApp-MinaProtocol)

More detailed official documentation can be accessed here.

And there you have it! You've successfully built a simple project on the Mina protocol and explored the world of Mina, zkApps, and more.
