---
title: "ZK Compute"
subtitle: "Our devices are the network"
date: "2023-03-01"
tags: ["zk", "autonomous worlds", "starks"]
author: 🍞
---

## What are ZK proofs?

Zero-knowledge proofs, or ZK proofs for short, are a powerful tool for verifying the validity of information without revealing any additional details about that information. This not only has privacy implications but also implications for the next generation of public computing infrastructure.

You may have heard my simple epuharism before but if you haven't:

Zips compress data | ZK proofs compress computation
But what does this actually mean in practise? Well let's explore.

To note - Zero-knowledge proofs are not a new tech, in fact the first paper "Non-interactive Zero-Knowledge Proofs of Knowledge" by Shafi Goldwasser, Silvio Micali, and Charles Rackoff, was published in the Journal of the ACM in 1989.

## Layers of compute

Next is using local devices for cryptographic proof and shared verifiers. ZK proofs are a form of compressed computation, by running a program that requires consensus among all parties, then sharing a small byte-sized proof that the program was executed as intended. This not only reduces computational resources but increases efficiency and scalability of the system.

## Decentralizing Computing: Evolution from Remote State Machines to True Decentralization

The current implementation of blockchains as distributed state machines that use signature verification to validate transactions is a powerful mechanism. However, the requirement for nodes to re-execute computations limits the scalability of the network. To truly achieve decentralization in blockchains, it is necessary to limit the amount of computation required in the virtual machine design. Failure to do so can result in a centralized network, as seen in projects like Solana, which is not a true blockchain in the sense. To overcome this limitation, Zero-Knowledge (ZK) proofs can be utilized as a form of compressed computation. By running a program that requires consensus among all parties and sharing a small, byte-sized proof of the execution, the system's efficiency and scalability can be improved.

> So where do we go from here?
> The proliferation of devices with computing capabilities presents an opportunity to utilize Zero-Knowledge (ZK) proofs for creating a truly decentralized network. Instead of relying on a limited number of nodes to run computations, such as Ethereum nodes, we can harness the power of our devices by utilizing their ability to generate ZK proofs. By leveraging the computing power of our devices, we can create and share ZK proofs with a verifier node, and we can execute arbitrarily complex smart contracts and dapps on-device, reducing the computational load on the network while maintaining the security guarantees of a decentralized system.

## Is this a new blockchain design?

The current approach of most ZK teams is to build blockchains using STARKs or SNARKs for scalability and rollup of transactions, similar to Ethereum. However, this approach increases efficiency and scalability, but it still uses the same state machine model.

From here - we should be trying to design a network
