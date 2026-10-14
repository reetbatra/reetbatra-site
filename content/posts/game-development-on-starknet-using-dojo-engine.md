---
title: "Game Development on Starknet using Dojo Engine"
date: "2025-02-13"
brief: "Gaming has evolved significantly, from traditional board games to digital experiences, and now, to on-chain games—a completely new paradigm enabled by blockchain…"
topic: protocols
original: "https://reet.hashnode.dev/game-development-on-starknet-using-dojo-engine"
---

## **Introduction**

Gaming has evolved significantly, from traditional board games to digital experiences, and now, to **on-chain games**—a completely new paradigm enabled by blockchain technology. With the rise of blockchain-based ecosystems, developers have started exploring new business models, financial incentives, and decentralized ownership structures that were previously impossible.

In this article, we’ll explore the need for on-chain games, their advantages, and how **Dojo Engine** helps developers build provable, decentralized, and autonomous games faster than ever before.

## **History of Games: From Board Games to On-Chain Games**

Games have been integral to human history, from ancient board games like **Chess and Go** to modern digital experiences like **World of Warcraft and Fortnite**. However, the underlying structure of games has remained largely **centralized**—players interact with a game world owned and controlled by a central entity (developers, publishers, or platforms).

### **The Transition to On-Chain Games**

On-chain games introduce a revolutionary concept: **games where both state and logic exist entirely on a blockchain**. This means that:

-   The game’s rules and mechanics are **enforced by smart contracts**.

-   Players have **true ownership** over in-game assets.

-   The game state is **public, auditable, and tamper-proof**.

-   Games can be **composable**, allowing external developers to build on top of existing game worlds.

## **Why Do We Need On-Chain Games?**

While traditional games rely on centralized servers and game economies controlled by publishers, **on-chain games** offer a radically different approach:

### **1\. Financialization as Part of the Game**

Unlike traditional games where financialization is often limited to NFTs, on-chain games integrate **economic incentives and value transfer** at their core. Players can earn, trade, and stake assets in ways that were previously impossible.

### **2\. Trustless Escrow and Arbitration**

In traditional games, disputes over in-game assets or transactions rely on centralized authorities. **On-chain games use the blockchain as an escrow and arbitrator**, ensuring fairness and transparency.

### **3\. New, More Efficient Business Models**

On-chain gaming allows for **atomic payouts, decentralized revenue sharing, and permissionless modding**. Developers can monetize gameplay through **programmable economies** rather than relying on ads or in-game purchases.

### **4\. Composability and Modding**

The best games in history, such as **DOTA and Counter-Strike**, started as **mods** of existing games. On-chain games take this further by offering **shared state and open APIs**, allowing developers to create new game mechanics, spin-off games, and community-driven extensions.

**Examples:**

-   **DOTA** (originally a Warcraft 3 mod, now a billion-dollar franchise)

-   **Counter-Strike** (originally a Half-Life mod, now a leading FPS title)

* * *

## **New User-Generated Content (UGC) Business Models**

On-chain games enable **headless games**, **atomic payouts**, and **games as protocols**, ushering in a new era of community-driven game development.

### **Examples:**

-   **Loot Survivor Clients** (players generate content in a shared game world)

-   **DF Client Plugins** (modular expansions built on top of existing games)

* * *

## **The Strength of On-Chain Games: Security & High Stakes**

One of the biggest advantages of on-chain gaming is **immutability and trustlessness**.

-   **Blockchains exist for escrow**—this is their primary function.

-   **On-chain games are impossible to cheat** because game logic is enforced at the smart contract level.

-   **High-stakes competitive games** (with financial rewards) become possible without fear of exploitation.

### **Example: Strategy Game with Buy-Ins**

A highly competitive **real-time strategy (RTS) game** where players stake assets before a match. Since all transactions and logic are on-chain, cheating is impossible, and winnings are automatically distributed based on game outcomes.

* * *

## **Types of On-Chain Games**

### **1\. Short Experiences (Rogue-Likes, Daily Challenges)**

-   Low cost, easy to pick up and play

-   Baked-in token loops for rewards

-   Game Examples: RYO, Loot Survivor, Paved

### **2\. Session-Based Games (With Stakes, RTS, Civilization-Like Games)**

-   Multiplayer & asynchronous mechanics

-   Session-based with buy-ins and rewards

-   Game Examples: Eternum, Sky Strife, Dark Forest, ZConquer

### **3\. Autonomous Worlds (Self-Evolving, Persistent Game Worlds)**

-   Decentralized and self-governing

-   No single entity owns the game

-   No fully autonomous world exists yet, but early prototypes are emerging

## **What is Dojo?**

**Dojo is an open-source, community-driven provable game engine** designed to **accelerate on-chain game development**. Before Dojo, developers had to build **their own indexers, contract architectures, and game clients** from scratch.

With Dojo, developers can go from **zero to a fully functional game in just a week**.

### **Why Dojo?**

-   **Standardizes the development experience (DevX) for on-chain games**

-   **Simplifies on-chain state management via models**

-   **Minimizes boilerplate code**

-   **Provides powerful developer tooling**

* * *

## **How Does Dojo Work?**

Dojo extends the **Cairo compiler**, injects macros, and creates a **standardized ORM-like state management system**. All states are stored in a **World contract**, and **Dojo contracts mutate this state**.

### **Architecture Overview**

![](/writing/game-development-on-starknet-using-dojo-engine/01-4f98e3.webp)

#### **World Contract**

-   Provides the interface for on-chain worlds

-   Designed for **composability and extensibility**

-   Registers models that extend storage

-   Deploys contracts that extend logic

-   Manages access control for data modifications

* * *

## **What You Need for This Tutorial**

To follow along, ensure you have:

-   **Dojo installed** (`dojoup`)

-   **Sozo, Katana, Torii, and Origami installed**

-   **A basic understanding of Cairo and smart contract development**

### **Dojo Toolchain Overview**

-   **Sozo**: Command-line tool for managing Dojo projects

-   **Torii**: Automatic indexer for your models (SQL/Postgres support)

-   **Katana**: Local devnet for testing game logic

-   **Origami**: Game development library with common patterns

-   **BYO Client**: Official clients in **Dojo.js, Unity, C, and more**

* * *

## **Building the Game: Red vs. Blue Team**

### **Game Overview**

We are developing **Red vs. Blue Team**, a **map control game** where players join either the **Red** or **Blue** team. Players can **paint tiles** on the game map and aim to **maintain control** of the most territory. However, each player is limited to **one action every 60 seconds**, making strategic tile placement critical.

### **Game Components**

To implement this game, we need:

#### **1\. Player Registration**

-   Players will be identified using their **wallet address**.

-   Upon registration, a player selects a **team (Red or Blue)**.

#### **2\. Tile System**

-   The game board consists of **tiles**, each defined by **x and y keys**.

-   Each tile has a **color** (either Red or Blue) to reflect the controlling team.

### **Game Functions**

#### **1\. Register Player**

-   A new player joins the game by registering with their **wallet address**.

-   The player selects a **team (Red or Blue)**.

#### **2\. Paint Tile**

-   A player selects a **tile (x, y)** to paint in their team’s color.

-   A cooldown prevents players from painting **more than once every 60 seconds**.

-   The team with the most painted tiles maintains control.

* * *

# Let’s jump into code!

Contracts and client folders are self-explanatory. However, the key is understanding how we need to run each of them and how they are interlinked.

Please take a look at the source code [here](https://github.com/reetbatra/paint-me). I initialized the project using the [Dojo starter kit](https://book.dojoengine.org/tutorial/dojo-starter).

The client (React+Vite) application can be run using

```
npm install
npm run dev
```

Then start the Katana local node with the following command:

```
katana --disable-fee --allowed-origins "*"
```

In another terminal window, navigate again to the contracts directory and build the contracts using Sozo, and apply the migrations to deploy the contracts:

```
sozo build 
sozo migrate apply
```

Start the Torii server, replacing 0x6457e5a40e8d0faf6996d8d0213d6ba2f44760606e110e03e3d239c5f769e87 with the actual world address if different:

```
torii --world 0x6457e5a40e8d0faf6996d8d0213d6ba2f44760606e110e03e3d239c5f769e87 --allowed-origins "*"
```

## Models

Models define data structures annotated with `#[dojo::model]` for integration into Dojo.

### Tile Model (tile.cairo)

```
#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct Tile {
    #[key]
    x: u16,
    #[key]
    y: u16,
    color: felt252
}
```

-   `#[key] x, y`: Primary keys for grid location.

-   `color: felt252`: Stores tile color.

Each tile represents a grid coordinate where players can paint.

### Player Model (player.cairo)

```
const TIME_BETWEEN_ACTIONS: u64 = 120;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct Player {
    #[key]
    address: starknet::ContractAddress,
    player: u32,
    last_action: u64
}

#[generate_trait]
impl PlayerImpl of PlayerTrait {
    fn check_can_place(self: Player) {
        if starknet::get_block_timestamp() - self.last_action < TIME_BETWEEN_ACTIONS {
            panic!("Not enough time has passed");
        }
    }
}
```

-   `TIME_BETWEEN_ACTIONS`: 120-second cooldown to prevent spam.

-   `#[key] address`: Primary key for player identity.

-   `check_can_place()`: Enforces action cooldown.

This structure ensures fair play by restricting frequent updates.

## Contract Systems

Contracts define the logic that enables players to take actions like spawning and painting tiles.

### Actions Contract (actions.cairo)

```
// define the interface
#[dojo::interface]
trait IActions {
    fn spawn();
    fn paint(x: u16, y: u16, color: felt252);
}

#[dojo::contract]
mod actions {
    use super::{IActions};
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use boot_camp_paint::models::{tile::{Tile}, player::{Player}};

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn spawn(world: IWorldDispatcher) {
            let address = get_caller_address();
            let player = world.uuid();
            let existing_player = get!(world, (player), Player);
            assert(existing_player.last_action == 0, "ACTIONS: player already exists");
            let last_action = get_block_timestamp();
            set!(world, Player { address, player, last_action });
        }

        fn paint(world: IWorldDispatcher, x: u16, y: u16, color: felt252) {
            let address = get_caller_address();
            let player = get!(world, (address), Player);
            assert(player.address == address, "ACTIONS: not player");
            set!(world, Tile { x, y, color });
        }
    }
}
```

-   **IActions Interface:** Defines the available actions: `spawn()` and `paint(x, y, color)`.

-   **spawn() Function:**

    -   Retrieves the caller’s address.

    -   Generates a unique player ID.

    -   Ensures the player doesn’t already exist.

    -   Records the player in the world state.

-   **paint() Function:**

    -   Retrieves the caller’s address.

    -   Verifies the caller is an existing player.

    -   Updates the tile color at the specified `(x, y)` coordinates.

This system ensures that only registered players can modify tiles and prevents duplicate player creation.

After running these contracts and building them, you should be able to spin up a local katana devnet.

## World Write

Once you run the contracts on Katana, you should get a console log of the contract address. Save it for later.

## Indexing

Then you should be able to start a torii server in a new terminal using this command.

`torii --world 0x6457e5a40e8d0faf6996d8d0213d6ba2f44760606e110e03e3d239c5f769e87 --allowed-origins "*"`

Based on this, you should see a graphQL link on the terminal that you can access which will automatically generate schema for you.

Now, the only portion pending is frontend! Take a look at my older [tutorial](/writing/end-to-end-starknet-dapp-development-deploying-using-smart-contracts-with-starknetjs) for the same.

Wola! This is all you need to get started with dojo-engine.

## Resources

1.  [https://book.dojoengine.org/tutorial/dojo-starter](https://book.dojoengine.org/tutorial/dojo-starter)

2.  [https://www.youtube.com/watch?v=xKYqFMibIB0](https://www.youtube.com/watch?v=xKYqFMibIB0&list=PLMXIoXErTTYWyWg4AQVJP1N-7ZoYh4g1y&index=10)

3.  [https://www.youtube.com/watch?v=sj0lJjufby4](https://www.youtube.com/watch?v=sj0lJjufby4)
