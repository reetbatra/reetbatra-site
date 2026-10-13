---
title: "Understanding ZK-SNARKs vs. ZK-STARKs"
date: "2024-07-02"
brief: "ZK-proofs are very hot and trending right now! Everyone is trying to get a hang of ZK tech but it might seem a bit daunting at first."
topic: protocols
original: "https://reet.hashnode.dev/understadning-zk-snarks-vs-zk-starks"
---

ZK-proofs are very hot and trending right now! Everyone is trying to get a hang of ZK tech but it might seem a bit daunting at first. My [zk-stuff](https://reet.hashnode.dev/series/zk-stuff) blog series is aimed at breaking down complex ZK-terms and share cool resources with you to get going.

Up until now, we have covered [what are zk-proofs](/writing/a-beginners-guide-to-zero-knowledge-proofs) and various blockchain implementations of ZK in the blockchain ecosystem such as [Polygon's zkEVM](https://reet.hashnode.dev/dive-deeper-polygons-zkevm) and [zkApps by Mina Protocol](/writing/mina-protocol-uncovered-developing-your-own-zkapp). And today, we will take a look at major differences between ZK-SNARKS and ZK-STARKS.

By now, you should know what zk proofs are- if you don't buckle up and take 3 mins to get the gist of it by reading up my [beginner's guide to zk-proofs](/writing/a-beginners-guide-to-zero-knowledge-proofs) here!

Read more on how, what and why zk proofs were introduced [here](https://people.csail.mit.edu/silvio/Selected%20Scientific%20Papers/Proof%20Systems/The_Knowledge_Complexity_Of_Interactive_Proof_Systems.pdf).

# What are zk proofs?

To quickly summarise-

A zero-knowledge proof is a cryptographic technique that allows one party (the prover) to prove the validity of a statement to another party (the verifier) without revealing any information beyond the fact that the statement is true. This proof system involves a prover and a verifier, enabling users to publicly demonstrate their knowledge or ownership of information without disclosing the actual details.

![](/writing/understadning-zk-snarks-vs-zk-starks/01-a6810b.webp)

# Types of zk Proofs

Broadly there are two types of ZK proofs- interactive and non-interactive.

![](/writing/understadning-zk-snarks-vs-zk-starks/02-f66ca3.webp)

## Interactive ZK proofs:

![](/writing/understadning-zk-snarks-vs-zk-starks/03-26b6c6.webp)

-   Requires multiple back and forth interactions between prover and verifier in order for the verifier to actually reach some conclusion.

-   When the prover sends a response to the verifier it has two components- a challenge and an answer.

-   Eg: Challenge could be- "Is the front door red in color?" and answer could be "Yes".

-   But since we don't know for 100% certainty as we haven't seen the door if the answer provided was right or not.

-   So you'll want to repeat these iterations until you reach a level of certainty that you're mathematically comfortable with, then verifier will be satisfied with the response.

-   If the verifier is not 100% certain with the response, then it asks for a new challenge and this cycles keeps repeating in loop until the verifier is satisfied enough to conclude the response.

### Pros:

High-level security, ideal for real-time applications.

### Cons:

Not ideal for asynchronous systems as it requires multiple rounds of interactions.

Example: Alice and Bob proving knowledge of a common password

**Scenario:** Imagine Alice wants to prove to Bob that she knows the password to a secure vault without revealing the password itself.

**Steps in a Non-Interactive Zero-Knowledge Proof:**

-   **Setup:** Alice and Bob agree on a method to verify the password without revealing it. This could be a secure system that checks passwords.
-   **Prover:** Alice proves her knowledge of the password through repeated interactions with Bob.
-   **Verifier:** Bob can be convinced but needs multiple interactions to reach certainty.

## Why Do We Need Non-Interactive Zero-Knowledge Proofs?

-   **Interactivity Requirement:**

    -   Interactive ZKPs need multiple back-and-forth interactions between the prover and verifier, requiring both parties to be actively involved at the same time.

    -   **Independent Verification:**

        -   Interactive ZKPs cannot be independently verified by third parties.
-   **Scalability and Efficiency:**

    -   Interactive ZKPs are impractical for scenarios with many participants, such as blockchain networks.

    -   Non-interactive ZKPs are more efficient as a single proof can be verified by many participants independently.

## Non-Interactive ZK Proofs

![](/writing/understadning-zk-snarks-vs-zk-starks/04-97076f.webp)

-   A single round of communication is done in one shot (no loops here).

-   The prover provides a single response containing batch of proves of multiple challenges, and then the verifier uses the same set of challenges to verify all proofs, then immediately concludes whether or not the prover has satisfied their requirements.

Alice and Bob example in interactive and non-interactive ZKP: **Interactive ZKP:**

-   Alice proves her knowledge of the password through repeated interactions with Bob.
-   Bob can be convinced but needs multiple interactions.

**Non-Interactive ZKP:**

-   Alice provides a single proof, and Bob verifies it without further interaction.

### Pros:

-   Scalable and efficient, better suited for blockchain and DeFi systems.

### Cons:

-   Slightly less secure compared to Interactive Zero-Knowledge Proofs.

## Types of Non-Interactive ZK-proofs

1.  ## ZK-SNARKS

ZK-SNARKS stands for Zero-Knowledge **Succinct** Non-Interactive Argument of Knowledge:

-   Succinct literally means small in size. Thus, ZK-SNARKS are small and hence quickly verifiable.

-   Requires a "shared key" during the initial setup phase. A common reference string (CRS) is built by an agreement made by both prover and verifier in the system.

-   Anyone with access to the shared key can verify the proofs made by the system, so to keep the proofs secure, it is expected that the keys are actually destroyed after the CRS is generated.

-   ZK-SNARKS are not quantum-resistant, so they are considered attackable by quantum computers. However, with newer releases, this could be avoided.

-   SNARKS use [elliptic curve pairing](https://medium.com/@VitalikButerin/exploring-elliptic-curve-pairings-c73c1864e627), a cryptographic technique that allows two different elliptic curves to interact. This enables efficient and secure verification of proofs by mapping the problem onto a simpler mathematical structure, ensuring both speed and security in the verification process.

    2.  ## ZK-STARKS

ZK-STARKS stands for Zero Knowledge **Scalable Transparent** Argument of Knowledge:

-   SNARKS are transparent; they do not require any CRS or destruction of keys, hence there is no risk of leaking those keys.

-   They are also plausibly post-quantum secure, hence less risk of being attacked by quantum computers.

-   Proof size is larger, and they scale more efficiently when dealing with bigger data.

-   STARKS use [polynomials](https://medium.com/iovlabs-innovation-stories/building-zk-snarks-volume-2-444ec711efe0) for their cryptographic foundation. The technique involves breaking down computations into polynomial forms and proving their correctness through efficient polynomial commitment schemes.

# Comparing ZK-SNARKs vs. ZK-STARKs

Let's break down the key distinctions between these two types of zero-knowledge proofs:

| Aspect | ZK-SNARKS | ZK-STARKS |
| --- | --- | --- |
| **Proof Size** | Compact | Larger |
| **Trusted Setup** | Required | Not needed |
| **Verification Time** | Rapid | Fast, excels with large datasets |
| **Quantum Security** | Vulnerable | Quantum-resistant |
| **Transparency** | Less transparent | More transparent |
| **Scalability** | Less scalable | Highly scalable |
| **Use Cases** | Privacy coins, DeFi, ID verification | Layer 2 solutions, transparency-focused applications |

### In Detail:

**Proof Size:**  
ZK-SNARKs offer compact proof sizes, making them ideal for environments where data availability is crucial, such as Ethereum's EVM. In contrast, ZK-STARKs produce larger proofs, which can increase costs.

**Trusted Setup:**  
ZK-SNARKs require a trusted setup, a critical step that can pose security risks if not executed correctly. On the other hand, ZK-STARKs eliminate the need for a trusted setup, which enhances their resilience and reduces potential risks.

**Verification Time:**  
ZK-SNARKs are known for their rapid verification times. ZK-STARKs also achieve fast verification, but they perform particularly well with large datasets.

**Quantum Security:**  
ZK-SNARKs are vulnerable to attacks from quantum computers, posing a risk in the future as quantum technology advances. ZK-STARKs, however, are designed to be quantum-resistant, offering a more secure solution in the face of quantum threats.

**Transparency:**  
ZK-SNARKs may be perceived as less transparent due to their reliance on a trusted setup. In contrast, ZK-STARKs are more transparent, using publicly verifiable randomness to establish parameters, ensuring a more open and trustless verification process.

**Scalability:**  
ZK-SNARKs are less scalable, with proof sizes increasing linearly with the complexity of the computation. ZK-STARKs, however, are highly scalable, particularly when handling extensive data, as their proving and verification times increase at a quasilinear rate.

**Use Cases:**  
ZK-SNARKs excel in systems where proof size and speed are paramount. They are well-suited for privacy coins, identity verification, and decentralized finance (DeFi) applications, thanks to their compact proof sizes and consistent verification times. On the other hand, ZK-STARKs are ideal for scenarios where transparency and quantum resistance are top priorities, making them particularly suitable for Layer-2 solutions.

**Now that we understand all about zk proofs and their types, your goal should be more exploration. The zk world is always and forever evolving, and the sky is the limit.**

### Here are a few amazing things to look out for:

-   [Polygon's ZKevm](https://reet.hashnode.dev/dive-deeper-polygons-zkevm)

-   [MINA Protocol](/writing/mina-protocol-uncovered-developing-your-own-zkapp)

-   Starknet, zkSync, Loopring, StarkEx, and more!
