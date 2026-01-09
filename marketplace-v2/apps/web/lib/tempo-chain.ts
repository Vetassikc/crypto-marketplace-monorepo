import { defineChain } from 'viem'

export const tempoTestnet = defineChain({
  id: 123456, // Placeholder ID for Tempo Testnet
  name: 'Tempo Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Tempo USDC',
    symbol: 'USDC',
  },
  rpcUrls: {
    default: { http: ['https://rpc.tempo.xyz/testnet'] },
  },
  blockExplorers: {
    default: { name: 'Tempo Explorer', url: 'https://testnet.tempo.xyz' },
  },
})
