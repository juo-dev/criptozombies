import type { Abi } from 'viem'

export const CounterAbi = [
  {
    type: 'event',
    name: 'Increment',
    inputs: [
      {
        name: 'by',
        type: 'uint256',
        indexed: false,
      },
    ],
  },
  {
    type: 'function',
    name: 'incBy',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'by', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'x',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
] as const satisfies Abi
