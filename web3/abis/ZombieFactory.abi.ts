import type { Abi } from "viem";

export const ZombieFactoryAbi = [
  {
    type: "event",
    name: "NewZombie",
    inputs: [
      {
        name: "zombieId",
        type: "uint256",
        indexed: false,
      },
      {
        name: "name",
        type: "string",
        indexed: false,
      },
      {
        name: "dna",
        type: "uint256",
        indexed: false,
      },
    ],
  },
  {
    type: "function",
    name: "createRandomZombie",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "_name",
        type: "string",
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "zombies",
    stateMutability: "view",
    inputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "name",
        type: "string",
      },
      {
        name: "dna",
        type: "uint256",
      },
    ],
  },
] as const satisfies Abi;
