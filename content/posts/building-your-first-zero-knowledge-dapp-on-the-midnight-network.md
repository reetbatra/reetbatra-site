---
title: "Building Your First Zero-Knowledge dApp on the Midnight Network"
date: "2026-03-24"
brief: "Every blockchain built before Midnight has the same fundamental problem: all data is public. Your Ethereum wallet address is a fingerprint."
topic: protocols
original: "https://reet.hashnode.dev/building-your-first-zero-knowledge-dapp-on-the-midnight-network"
---

Every blockchain built before Midnight has the same fundamental problem: all data is public.

Your Ethereum wallet address is a fingerprint. Every transaction you make, every contract you interact with, every token you hold — all of it is visible to anyone with a block explorer.

Midnight solves this at the protocol level. It's not privacy added on top. It's privacy as the foundation.

The core idea: computation happens on your device. Only the proof that you did it correctly goes on-chain. Your birth year, your salary, your credentials — they never leave your machine.

This guide builds a complete age verification dApp from scratch. By the end, you'll have:

-   A deployed Compact smart contract on Midnight Preprod

-   A Node.js issuer API that signs age attestations

-   A Next.js frontend that connects to Lace Midnight wallet

-   A working ZK proof flow where users prove they're 18+ without revealing their date of birth

* * *

## What You're Building and Why

**Traditional age verification:**

> "Give us your date of birth. We'll check it and store it forever."

**Midnight age verification:**

> "Generate a cryptographic proof that your birth year is ≤ 2006. The proof is verified on-chain. Your birth year is never transmitted."

The difference is fundamental.

In the traditional model, every verification creates a liability — stored personal data that can be breached, sold, or subpoenaed.

In the Midnight model, there's nothing to breach. The on-chain record says "verified" and contains no personal information.

* * *

## Before We Start: Understanding the Architecture

### The Kachina Model

Midnight is built on [Kachina](https://ieeexplore.ieee.org/document/9505201), a zero-knowledge smart contract protocol published at IEEE CSF 2021.

Kachina divides every contract into two worlds:

**Public world**

-   The Midnight blockchain

-   Stores contract state visible to everyone

**Private world**

-   Your device

-   Stores sensitive inputs

-   Runs computations locally

When you interact with a Midnight contract:

1.  Your browser runs witness functions locally

2.  The proof server generates a ZK-SNARK

3.  The proof is included in a transaction

4.  The chain verifies the proof (~6ms with BLS12-381 curve)

5.  Public state updates

### The Compact Language

Compact is Midnight's domain-specific language for writing ZK smart contracts. It looks like TypeScript but compiles to arithmetic circuits.

**Key mental model:** Compact has two modes:

| Mode | Contains |
| --- | --- |
| Public | Ledger declarations, on-chain state, public values |
| Private | Circuit computations, witness values, intermediate calculations |

Only values wrapped in `disclose()` become public.

### The Stack

```plaintext
┌─────────────────────────────────────────────┐
│         Next.js Frontend (localhost:3000)   │
│         - React + TypeScript                │
│         - Lace Midnight Preview wallet      │
│         - Midnight.js SDK providers         │
└──────────────┬──────────────────────────────┘
               │ attestation request
┌──────────────▼──────────────────────────────┐
│         Issuer API (localhost:4000)         │
│         - Express + TypeScript              │
│         - Schnorr signing on Jubjub curve   │
│         - Age attestation service           │
└──────────────┬──────────────────────────────┘
               │ prover key + witness inputs
┌──────────────▼──────────────────────────────┐
│         Proof Server (localhost:6300)       │
│         - Docker: proof-server:7.0.0        │
│         - Generates ZK-SNARK proofs         │
└──────────────┬──────────────────────────────┘
               │ ZK proof
┌──────────────▼──────────────────────────────┐
│         Midnight Preprod Network            │
│         - Contract state (public)           │
│         - Proof verification                │
│         - Transaction finality              │
└─────────────────────────────────────────────┘
```

* * *

## Part 1: Environment Setup

### Prerequisites

-   macOS or Linux

-   Node.js 22+

-   Git

-   Brave or Chrome

### Step 1: Install the Compact Compiler

```bash
npm install -g @midnight-ntwrk/compact-cli
```

Then install the compiler version:

```bash
compact update 0.29.0
```

Verify the install:

```bash
compact --version
# Expected: 0.29.0
```

> **Common mistake:** Running `compile` before `update`. Always run `update` first.

### Step 2: Docker Setup

```bash
brew install colima docker docker-compose
colima start
docker-compose --version
```

### Step 3: Install Lace Midnight Preview

1.  Install the browser extension

2.  Create a wallet

3.  Save your 24-word seed phrase

4.  Set the network to Preprod

> **Brave users:** Turn shields off for localhost.

* * *

## Part 2: Project Structure

```bash
mkdir midnight-age-verifier
cd midnight-age-verifier
git init
mkdir -p contract/src issuer-api/src frontend/src
```

### Root `package.json`

```json
{
  "name": "midnight-age-verifier",
  "private": true,
  "type": "module",
  "workspaces": ["contract", "issuer-api", "frontend"],
  "dependencies": {
    "@midnight-ntwrk/compact-js": "2.4.0",
    "@midnight-ntwrk/compact-runtime": "0.14.0",
    "@midnight-ntwrk/ledger-v7": "7.0.0",
    "@midnight-ntwrk/midnight-js-contracts": "3.1.0"
  }
}
```

> **Version pinning is critical.** The Midnight SDK is under active development and versions are not always backward compatible.

* * *

## Part 3: Writing the Compact Contract

Create `contract/src/age-verifier.compact`:

```compact
pragma language_version 0.21;

import CompactStandardLibrary;
import "schnorr" prefix Schnorr_;

export { Schnorr_SchnorrSignature };

export enum AgeStatus { Verified, Unverified }

export struct AgeRecord {
  status: AgeStatus
}

struct Identity {
  birthYear: Uint<16>
}

export ledger admin: ZswapCoinPublicKey;
export ledger issuers: Map<Uint<16>, NativePoint>;
export ledger verifications: Map<Bytes<32>, AgeRecord>;
export ledger cutoffBirthYear: Uint<16>;

constructor() {
  admin = ownPublicKey();
  cutoffBirthYear = 2006 as Uint<16>;
}

witness getAgeAttestation(): [Identity, Schnorr_SchnorrSignature, Uint<16>];

export circuit proveAge(secretPin: Uint<16>): [] {
  const zwapPublicKey = ownPublicKey();
  const userPubKey = userPublicKey(zwapPublicKey.bytes, secretPin);

  verifyAgeAttestation(transientHash<Bytes<32>>(userPubKey));

  const record = AgeRecord { status: AgeStatus.Verified };

  verifications.insert(disclose(userPubKey), disclose(record));

  return [];
}
```

* * *

## Part 4: Schnorr Attestation

The contract verifies three things:

1.  Signature validity

2.  Age requirement

3.  Trusted issuer

The signature formula over the Jubjub curve:

```plaintext
c = H(announcement_point || issuer_pk || message)
s = (k + c * sk) mod JUBJUB_ORDER
```

The issuer API signs the user's birth year attestation using this scheme. The contract then verifies the signature on-chain without ever seeing the raw birth year.

* * *

## Part 5: Frontend Witness

The witness function is where the magic happens. The birth year is passed as a local input and used to generate the proof — it never leaves the browser.

```typescript
getAgeAttestation: (ctx) => [
  ctx.privateState,
  [
    { birthYear: BigInt(birthYear) },
    signature,
    BigInt(issuerId),
  ],
]
```

Birth year stays in browser memory. It is never transmitted.

* * *

## Part 6: Connecting to Midnight

```typescript
class BrowserZKConfigProvider extends ZKConfigProvider {
  async getProverKey(circuitId) {
    const res = await fetch(`/zk/${circuitId}.prover`);
    return new Uint8Array(await res.arrayBuffer());
  }
}
```

> **Note:** You must extend the class, not implement the interface directly.

* * *

## Part 7: Getting Test Tokens

1.  Copy your wallet address from Lace Midnight Preview

2.  Visit the Midnight faucet

3.  Request test tokens

If you see "No dust tokens found":

-   Ask in the Midnight Discord

-   Retry the faucet after a few minutes

-   Make sure you've staked tokens if required

* * *

## Part 8: Deploy the Contract

Navigate to the admin page at `/admin/deploy` and deploy your contract.

Once deployed, set these environment variables:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=<your-contract-address>
NEXT_PUBLIC_DEMO_MODE=false
```

Restart your dev server.

* * *

## Part 9: Running the Demo

Start all services:

```bash
colima start
docker-compose up -d
npm run dev
```

Open `localhost:3000/verify` and run through the flow:

1.  Connect wallet

2.  Enter birth year

3.  Generate proof

4.  Submit transaction

**First run:** 10-30 seconds (proof server warming up)

**Subsequent runs:** ~5 seconds

* * *

## You're Done

You now have a privacy-preserving age verification dApp running on Midnight.

The on-chain record proves a user is 18+. Their date of birth never touched the network. There's no database of birthdates to breach, no personal data to subpoena, and no liability for the operator.

That's what privacy at the protocol level actually looks like.
