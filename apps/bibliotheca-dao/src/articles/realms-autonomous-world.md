---
title: "Realms - The Autonomous World"
subtitle: "It's all lead to this."
date: "2023-03-01"
tags: ["zk", "autonomous worlds", "starks"]
author: 🍞
---

> Bibliotheca DAO has been building an eternal and ever-expanding onchain game world called the Realms. Examining the notion of Realms as an ‘Autonomous World’, we'll also reflect on Loot as the catalyst - the 'big bang' event that led us here.

Loot may not be considered an onchain game in the traditional sense, but it has undoubtedly transformed the gaming landscape by introducing the concept of an open and composable world. Loot was the ‘big bang’ that created a new digital universe. Interlinked worlds are being built in that universe, like Realms, Banners and Hyperloot. Other worlds are being built in parallel universes, those that forked Loot, like DOPE DAO and Treasure DAO.

As demonstrated by the amount of building, Loot was a moment of inspiration for a new generation of developers, who are eager to collaborate across the digital realm on a shared mission to build and expand the shared ‘Lootverse’. Loot transcends conventional notions, representing more of an abstract, creative idea that permeates culture.

For just over 18 months, our contributors have been diligently developing, refining, and crafting an open-source vision for a CC0 permissionless world. Our concept has evolved from its initial focus on land ownership within the Lootverse to an autonomous, onchain world that operates independently.

In retrospect, our ambitious design objectives for the DAO’s first game title, ‘Realms: Eternum’, were ahead of their time in 2021, rendering them unattainable at that juncture. Undeterred, we continue to forge ahead and build upon our progress. Tackling the hardest blockchain problems encouraged us to find and collaborate with the most talented problem solvers. We are proud to be at the heart of an uber talented, forward thinking blockchain development community.

![Realms Autonomous World](/images/raw.png)

## Eternum: A game set in The Realms Autonomous World

Realms was born out of the Loot phenomenon, carrying a distinct vision for a continually evolving, modular game that could flawlessly incorporate all Loot assets. The concept of "Autonomous Worlds" hadn't been coined at that time; instead, we initially referred to the idea for ‘Realms: Eternum’ (aka Eternum) as a Massively Multiplayer Online Onchain Composable Game (MMOCCG, yes LOL). Later on, we dubbed it the ‘Eternal Game’. However, none of these terms resonated as powerfully or evoked the same emotional response as "Autonomous Worlds" to describe the broader hyperstructure in which the game Eternum sits.

We don't take the AW concept lightly; not every game is an Autonomous World (AW) – there is a spectrum. The chads at Lattice originally conceived the [AW terminology](https://0xparc.org/blog/autonomous-worlds), and we are embracing this shared meme as it provides a vivid depiction of what we have been building for a year and a half. From this point forward, we will retire our internal names (Eternal Games, MMOCCG) and refer to the project as, the Realms Autonomous World. ‘Realms: Eternum’ will be the first title launched in that world.

Autonomous worlds bear a remarkable resemblance to blockchains in their nature. Once deployed, they endure, with their state persisting for the duration of the chain. Players can join or leave, and developers can build upon these worlds by deploying features in a permissionless way, akin to how contracts are deployed onto a chain. There is no universally accepted definition for an Autonomous World; however, our criteria for labeling a game as such requires at least these two essential features:

1. Decentralized data availability layer: While the state execution may reside on a centralized layer, it is crucial that the state can be reconstructed if the execution layer ceases to exist. Rollups offer a solution, providing increased capacity execution layers while ensuring data is permanently settled on Ethereum. This guarantees the world's perpetual persistence.

2. Permissionless entry point for expanding the world: The World contract must be capable of accepting new systems and components without requiring permission. While this doesn't imply that every component and system will be utilized, they must adhere to this pattern, ensuring open and unrestricted access for potential enhancements.

> Note: All Autonomous Worlds are onchain games. Not all onchain games are Autonomous Worlds. In our view, an onchain game becomes an AW when it can be expanded permissionlessly.

This is just our interpretation and the heuristics we are following, but it is by no means cannonical.

The open nature of an AW fosters the development of intriguing economic models, such as the ["Play to Die"](https://loaf.coffee/posts/economic-hyperstructures) concept, which allows developers to compete at the application layer within the world akin to an app store.

Autonomous worlds ought to be credibly neutral and not subject to central control by any group or individual. Be cautious of those who exploit the AW name for a quick profit in the future. Eternum's launch is not the end game for Realms or Loot; rather, it marks the beginning of a continuous evolution. It is our hope that in 10 years, Eternum will bear little resemblance to the game as it exists today, having grown and transformed over time.

## Where we started

Our initial game design, conceived in 2021, was based on the [diamond pattern](https://eips.ethereum.org/EIPS/eip-2535) and ran on Arbitrum. As we navigated the development process, we encountered various challenges and came to reason that the Ethereum Virtual Machine and Solidity were not as suitable as we would have liked for our World.

As we investigated various options, Starknet emerged as the leading long-term solution due to its ability to abstract from the Ethereum Virtual Machine (EVM) while maintaining compatibility. Enthusiastically, we adopted Cairo and restructured the game using a Module Controller system, originally conceptualized by Perama for Dopewars. Implementing this modular controller pattern enabled the successful separation of security modules and state from the core logic. Nevertheless, we recognized that relying solely on this approach did not provide the necessary degree of abstraction for developers to build and extend the Autonomous World (AW) beyond Eternum, which has consistently been our primary design goal.

![Module Controller](/images/MC.png)

It's important to acknowledge that numerous teams within Starknet have been advocating for autonomous worlds for quite some time, with notable implementations by Guilty Gyoza of Topology, the Influence team and Dope Wars RYO. Subjectively speaking, Starknet boasts the highest concentration of exceptional builders across the entire crypto universe, and with Cairo 1.0 beautiful abstraction it will continue to be.

> It is worth noting that the EVM ecosystem is undergoing rapid evolution. As a result, various shapes and forms of Autonomous Worlds (AWs) will emerge in many environments, EVM and Cairo VM. Our chosen path involves non-EVM but EVM compatibility with Starknet and Cairo as Cairo Virtual Machine provides interesting isomorphic approach to constructing verifiable compute. It is possible run the VM in [WASM](https://github.com/lambdaclass/cairo-rs#webassembly-demo), custom app chains running [Substrate](https://github.com/keep-starknet-strange/madara) or [Starknet](https://www.starknet.io/en) itself. There is a flourishing ecosystem emerging around WASM and Cairo, and we are at the heart of it.

## Enter Dojo

The advent of [MUD](https://mud.dev/) and the Lattices team adoption of an [Entity-Component-System](https://github.com/SanderMertens/ecs-faq) (ECS) pattern written in Solidity prompted us to reevaluate our approach to Eternum. In late November, the Realms team, together with [Cartridge](https://cartridge.gg/) and [Briq](https://briq.construction/), started collaborating on a Cairo 1.0 onchain gaming toolchain called [Dojo](https://github.com/dojoengine/dojo), heavily built upon the learnings of [MUD](https://mud.dev/).

### What is Dojo?

Dojo is a dedicated Rust and Cairo 1.0 toolchain designed for terraforming Autonomous Worlds, bearing a close resemblance to MUD in terms of abstraction, albeit not an exact 1:1 match. Owing to the outstanding work accomplished by the Cairo 1.0 team, Dojo effectively eliminates much of the contract boilerplate associated with writing systems and components. All the work of structuring queries and mutating the world is consolidated into a set of easy to understand commands. Over the coming months tutorials on how these specifically work will be released for developers to build upon.

![Module Controller](/images/ECS.png)

Dojo's primary objective is to empower developers to begin building on Autonomous Worlds within a matter of hours, as opposed to months, thus expediting the onboarding process and promoting growth in the Realms Autonomous World and other AWs. By having worlds adhere to a common set of standards for components and systems, these elements can be efficiently shared across different worlds. This advantage doesn't even factor in the shared auditing, backend engineering, and other intricate work involved in constructing these worlds.

![Sumo](/images/sumo.png)

> Dojo is an open-source project looking for active contributors, if you love games, Rust or Cairo - join the [discord](https://discord.gg/GFfYbRuXtZ).

## Eternum and Dojo

While the Realms: Eternum Developer Alpha currently operates on a modular controller pattern, with an indexer and a web client for testing game features, we plan to migrate the game to the Dojo stack. This transition aims to enhance the development velocity and facilitate shared engineering resources, ultimately empowering developers to contribute more effectively to the world's expansion.

While this transition might appear to be a significant shift, we already have most of the client design in place, so the primary focus will be on contract work in Cairo 1, from which we intended to migrate regardless. This highlights the beauty of onchain games – their headless nature! The ability to effortlessly swap out contracts and clients allows for flexibility and adaptability in a shapeshifting world.

Eternum, aspires to endure alongside Ethereum itself. Its final form will inevitably differ from its current state, embodying the essence of an Autonomous World—unbridled, unconstrained, and permissionless.
