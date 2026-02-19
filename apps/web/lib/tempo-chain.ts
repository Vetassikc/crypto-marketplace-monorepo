import { defineChain } from 'viem'

export const tempoTestnet = defineChain({
  id: 42431,
  name: 'Tempo Moderato',
  nativeCurrency: {
    decimals: 18,
    name: 'Alpha USD',
    symbol: 'AUSD',
  },
  rpcUrls: {
    default: { http: ['https://rpc.moderato.tempo.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Tempo Explorer', url: 'https://scout.moderato.tempo.xyz' },
  },
})
