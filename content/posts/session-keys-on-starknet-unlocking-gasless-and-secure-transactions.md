---
title: "Session Keys on Starknet: Unlocking Gasless & Secure Transactions"
date: "2025-03-24"
brief: "Introduction As blockchain adoption grows, user experience remains one of the biggest hurdles."
topic: protocols
original: "https://reet.hashnode.dev/session-keys-on-starknet-unlocking-gasless-and-secure-transactions"
---

## **Introduction**

As blockchain adoption grows, user experience remains one of the biggest hurdles. Interacting with decentralized applications (dApps) often requires signing multiple transactions, leading to frustrating delays and gas costs.

Wouldn't it be great if users could interact with dApps **seamlessly**, without signing every single transaction?

This is where **Session Keys** come in. They offer a game-changing way to execute multiple transactions securely without requiring constant user approval. In this guide, we'll explore the concept of Session Keys on Starknet, understand their benefits, and build a hands-on demo.

## **What Are Session Keys? 🤔**

A **Session Key** is a temporary key that grants limited transaction execution permissions to a dApp **without requiring user signatures for each action**. Instead of prompting for wallet confirmations on every interaction, session keys enable smooth and uninterrupted dApp usage for a specified period or under defined constraints.

How Do Session Keys Work?

1.  **User Signs Once**: The user grants permission for a specific session key with predefined rules (e.g., limited to certain functions, time duration, or spending caps).

2.  **dApp Executes Transactions**: The dApp uses this session key to sign transactions on behalf of the user within the given constraints.

3.  **Session Expires**: After the session key expires (or reaches its limits), it can no longer sign transactions, ensuring security.

### Why are session keys useful?

✅ **Gasless Transactions** – Users don’t need to pay for gas on every interaction. ✅ **Seamless UX** – No need to sign each transaction manually. ✅ **Fine-Grained Permissions** – Limited scope ensures security. ✅ **Enhanced Gaming & DeFi** – Enables better automation and fluidity in games and trading platforms.

> **Use Case Example:** Imagine a blockchain game where you need to approve every move or action. With session keys, the game can execute moves automatically within the approved parameters, improving the user experience!

## **Session Keys on Starknet**

Starknet leverages **Account Abstraction (AA)** to enhance smart contract wallets, making session keys possible. Starknet's session keys operate through **smart contract-based authentication**, allowing fine-tuned access control.

Key Features:

-   **Smart Contract-Based Access Control**: Permissions are embedded in the wallet's contract.

-   **Granular Constraints**: Developers can define specific function calls, time limits, and spending caps.

-   **Enhanced Security**: Session keys have a controlled lifespan, preventing abuse.

The **Argent Wallet** is a popular implementation of session keys on Starknet, offering developers an API to integrate session-based transactions seamlessly.

## **🛠️ Building a Session Key Demo on Starknet**

Now, let's build a demo that allows users to interact with a smart contract using session keys, similar to [this demo](https://demo-dapp-starknet-sepolia.vercel.app/).

### **Step 1: Setting Up Your Starknet Environment**

Ensure you have the following installed:

```
npm install -g starknet-devnet
npm install starknet
```

### **Step 2: Deploying a Smart Contract with Session Key Support**

We'll write a simple **Counter Contract** where a session key can increment a counter without needing multiple signatures.

**Counter Contract (Cairo)**

```
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
        session_keys: Map<felt252, bool>, // Store session keys
    }

    #[abi(embed_v0)]
    impl TestSession of super::ITestSession<ContractState> {
        fn increase_counter(ref self: ContractState, value: u128) {
            assert!(self.session_keys.contains(&get_caller()), "Unauthorized session key");
            self.count.write(self.count.read() + value);
        }

        fn decrease_counter(ref self: ContractState, value: u128) {
            assert!(self.session_keys.contains(&get_caller()), "Unauthorized session key");
            let current = self.count.read();
            if current >= value {
                self.count.write(current - value);
            } else {
                self.count.write(0);
            }
        }

        fn get_counter(self: @ContractState) -> u128 {
            self.count.read()
        }

        fn add_session_key(ref self: ContractState, key: felt252) {
            assert!(is_admin(), "Only admin can add session keys");
            self.session_keys.insert(key, true);
        }

        fn remove_session_key(ref self: ContractState, key: felt252) {
            assert!(is_admin(), "Only admin can remove session keys");
            self.session_keys.remove(key);
        }
    }
}
```

### **Step 3: Generating and Using a Session Key**

**Generating a Session Key**

```
import { starknet } from "starknet";

async function createSessionKey(wallet) {
  const sessionKey = starknet.generatePrivateKey();
  const sessionPublicKey = starknet.getPublicKey(sessionKey);

  await wallet.addSessionKey(sessionPublicKey);

  console.log("Session Key Created: ", sessionPublicKey);
  return sessionKey;
}
```

**Using the Session Key**

```
async function useSessionKey(sessionKey, contractAddress) {
  const provider = new starknet.Provider();
  const contract = new starknet.Contract(contractAddress, provider);

  await contract.increase_counter(10, { from: sessionKey });
  console.log("Counter incremented using session key!");
}
```

**Session Keys on Starknet**, allows users to interact with a smart contract without manually signing every transaction. By introducing **Session Keys**, we improved UX while maintaining security.

### **What We Achieved:**

✅ Implemented a **Session Key-enabled Counter Contract** in Cairo 2.9.2.

✅ Allowed **temporary access** to session keys with controlled permissions.

✅ Ensured **security** by restricting actions session keys can perform.

✅ Demonstrated how **session keys** can enhance gasless transactions and smooth dApp interaction.

## **Final Thoughts and Resources on Session Keys**

Session keys provide a robust way to improve blockchain usability by reducing friction in user interactions. With **Account Abstraction (AA) and Session Keys**, developers can build **decentralized applications that feel as smooth as Web2 apps** while maintaining blockchain security and decentralization.

🚀 **Want to try it out?**

Deploy your session-key-enabled dApp and share your experience!

Here is the link to my GitHub repository to follow along: [https://github.com/reetbatra/session-keys-demo](https://github.com/reetbatra/session-keys-demo)

Argent's guide on session keys: [https://docs.argent.xyz/aa-use-cases/session-keys](https://docs.argent.xyz/aa-use-cases/session-keys)

More on understanding session keys on starknet: [https://starkware.co/blog/session-keys-unlocking-better-ux/#session-keys](https://starkware.co/blog/session-keys-unlocking-better-ux/#session-keys)
