---
title: "Solidity vs Cairo: A technical overview"
date: "2025-07-13"
brief: "Myth: You need to learn Solidity before you can understand Cairo or build on Starknet."
topic: protocols
original: "https://reet.hashnode.dev/solidity-vs-cairo-a-technical-overview"
---

**Myth:** You need to learn Solidity before you can understand Cairo or build on Starknet.

**Fact:** Cairo is a standalone language, and anyone with a solid grasp of blockchain fundamentals can pick it up. Solidity is **not** a prerequisite.

I can’t stress this enough:

Cairo doesn’t depend on Solidity, EVM patterns, or Ethereum-specific tooling. It’s a whole new world of provable computation.

When people ask me, *“Should I learn Solidity first?”*

I say: **No.**

What you need is an understanding of **how blockchains work**:

-   What is a transaction?

-   How does a smart contract update state?

-   What’s a signature?

-   Why do we care about scalability and trust minimization?

## What is Cairo?

Cairo is a **Turing-complete programming language** designed to write programs whose execution can be **proven**, using STARKs (Scalable Transparent ARguments of Knowledge).

In simple terms, it is the backbone of Starknet.

Cairo lets you write code that says, *“Here’s what I computed, and here’s the cryptographic proof I did it right.”*

So, is Cairo “better” than Solidity?

That’s the wrong question.

## **Which is better — Cairo or Solidity?**

Asking **which is better** is like asking:

> *“Is a motorcycle better than a car?”*

They’re designed for **different terrains.**

-   Solidity runs on the Ethereum Virtual Machine (EVM), a deterministic, execution-first system.

-   Cairo runs on the Cairo Virtual Machine (CairoVM), a proof-first system that generates evidence for correct computations.

Suppose Ethereum and Solidity are about **running computation securely. In that case, one step at a time**, then Starknet and Cairo are about **batching thousands of computations and proving you did them correctly, all at once.**

Neither is “better”; they serve **different design goals.**

## **CairoVM vs EVM: What’s Under the Hood?**

Let’s peek under the hood.

-   **EVM** (Ethereum Virtual Machine)

    The EVM is a stack-based virtual machine with a fixed set of opcodes (ADD, MUL, SLOAD, etc). It manages gas, memory, and storage per transaction.

    It’s optimized for **deterministic execution** across a global, decentralized network.

-   **CairoVM** (Cairo Virtual Machine)

    The CairoVM is a CPU-like virtual machine designed for generating **execution traces**, the kind that STARKs can compress into a proof.

    It’s optimized for **efficient proof generation, not just raw execution.**

If you want a deeper dive into the EVM, you can check [my write-up here](/writing/dive-deeper-into-the-ethereum-virtual-machine-evm).

For CairoVM, the [Cairo whitepaper](https://eprint.iacr.org/2021/1063.pdf) gives you a technical playground to explore.

Here is a CairoVM and EVM are the hearts of Cairo and Solidity, we must explore them in detail. I’ve jotted a comparison between them:

| **Catergoy** | **Solidity/ EVM** | **Cairo/ CairoVM** |
| --- | --- | --- |
| **Memory Model** | Stack (1024 items), memory (temporary), storage (persistent) | Unbounded memory with segments, records all reads/writes for provable trace |
| **State management** | SLOAD, SSTORE for persistent storage; mappings, structs | Explicit storage with #\[storage\] structs; LegacyMap, Map types |
| **Access control** | msg.sender, tx.origin | get\_caller\_address(), no magic globals, everything explicit |
| **Inheritance** | Classical inheritance, override, virtual, abstract contracts | Traits, composition; no inheritance trees, modular behavior reuse |
| **Polymorphism** | Function override, interface implementation | Trait implementations, modular function composition |
| **Events** | event keyword, emit statement | #\[event\] decorator, emit inside contract functions |
| **Error handling** | require(), assert(), revert() | Result<T, Error>, match blocks; no panic, no exception throwing |
| **Contract upgrades** | Proxy patterns (UUPS, Transparent Proxy) | Proxy + delegate patterns, WIP ecosystem but emerging standards |
| **External calls** | Low-level call(), delegatecall(), interface calls | call\_contract(), library calls, explicit call patterns |
| **Randomness** | block.timestamp, blockhash() (pseudo) | No native randomness; must use oracles or external data for random-like behavior |
| **Determinism** | Deterministic execution across nodes | Deterministic trace, but proof compression enables off-chain heavy lifting |

## Types: Cairo vs Solidity

| **Solidity Types** | **Cairo Types** |
| --- | --- |
| uint256, int256 | u256 (from cairo\_u256), felt252 |
| address | ContractAddress |
| string, bytes | felt252, arrays of felt252 |
| bool | bool (true/false) |
| structs | structs (same idea, more explicit) |

**Key difference:** Everything revolves around felt252- a **field element** in a finite field. So, when you want to store strings or large integers, you often encode/decode them across multiple felts.

## Functions: Cairo vs Solidity

| **Solidity** | **Cairo** |
| --- | --- |
| function foo() public {} | #\[external\] fn foo(ref self: ContractState) {} |
| view functions with view or pure | #\[view\] fn foo(self: ContractState) -> ReturnType {} |
| modifiers (onlyOwner) | inline assert() checks or trait-based patterns |
| constructors (constructor()) | #\[constructor\] fn constructor(ref self: ContractState, args...) {} |

**What stands out?**

Cairo has no **modifiers or inheritance-based access control**: You write the checks inside the function or abstract them using traits. Functions are decorated explicitly as #\[external\], #\[view\], or #\[constructor\].

## Modules: Cairo vs Solidity

Cairo’s modularity is inspired by **Rust, not OOP.** Instead of chaining inheritance, you **compose behavior** using traits and modules. This makes contracts more modular, less tangled, and easier to reason about.

| **Solidity** | **Cairo** |
| --- | --- |
| Contracts can inherit other contracts | Modules group functions; no inheritance |
| Libraries | Modules or library crates |
| Interfaces | Traits, implemented by modules |

## Arrays: Cairo vs Solidity

| **Solidity** | **Cairo** |
| --- | --- |
| uint256\[\], address\[\], fixed-size arrays | Array<T>, manually managed dynamic arrays |
| Push/pop on dynamic arrays | Use Array trait methods or implement manually |
| Mapping with keys → arrays | LegacyMap with key → Array of felt252 or structs |

In Cairo, arrays are more **manual**: you often work with array structs and explicitly handle reading, writing, and bounds. But this manualness gives you **predictability**, crucial for provable computation.

## TL;DR

If you come from Solidity, Cairo at first feels more low-level. But that’s by design.

✅ You control how memory is used.

✅ You explicitly manage access, state, and storage.

✅ You build modular, composable contracts without inheritance trees.

Instead of thinking **“why is this harder?”**, think **“why is this provable, scalable, and secure?”**

## **ERC-20 in Solidity vs Cairo, Explained**

We’ve walked through theory, architecture, and compilation, and now, let’s try to break it down with an example of an ERC-20 contract, so you can **understand what differs and why.**

![](/writing/solidity-vs-cairo-a-technical-overview/01-a8b3b5.webp)

### **What’s happening in the Solidity ERC-20?**

In Solidity, the ERC-20 contract does a few key things:

-   Defines storage with mapping(address => uint256) for balances and nested mappings for allowances.

-   Uses functions like transfer, approve, and transferFrom to handle token flows.

-   Handles access with msg.sender and safety with require() or revert().

-   Emits events like Transfer and Approval.

### **What’s happening in the Cairo ERC-20?**

In the Cairo 2 contract, things **look similar on the surface, but run very differently under the hood:**

-   Uses Map<ContractAddress, felt252> for balances and Map<(ContractAddress, ContractAddress), felt252> for allowances.

-   Caller is determined explicitly via get\_caller\_address().

-   Arithmetic and logic happen within a finite field (felt252), not unbounded integers.

-   Events are first-class with the #\[event\] decorator.

-   Functions are split into the interface (impl IERC20Impl) and internal helpers (impl InternalImpl), following Rust-like trait patterns.

Most importantly, **the system is designed to be provable**\- meaning every token transfer, approval, or mint is something you can generate a cryptographic proof of, compress, and verify on-chain. Instead of relying on implicit behavior (like msg.sender or Solidity’s modifiers), you **explicitly design your contract’s state, calls, and flows.**

Instead of trusting consensus for computation, you **prove correctness with STARKs.**

## Final thoughts and takeaway

If you’ve made it this far, here’s the truth I want you to walk away with:

You don’t need Solidity to learn Cairo.

You don’t need to be an Ethereum dev, a crypto OG, or a zero-knowledge researcher.

Cairo isn’t harder, it’s different. And once you embrace the difference, you unlock the ability to build scalable, provable systems that go beyond what the EVM can offer today.

So, whether you’re coming from Solidity or diving in fresh, welcome to the Cairo ecosystem.

## Resources to jump right in!

If you know Solidity, start here: [Cairo book](https://www.starknet.io/cairo-book/)

If you’re new to the blockchain world, start here: [Starklings](https://starklings.app/)

I can’t wait to see what you BUIDL!
