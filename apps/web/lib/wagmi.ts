import { http, createConfig } from 'wagmi'
import { tempoTestnet } from './tempo-chain'

export const config = createConfig({
  chains: [tempoTestnet],
  transports: {
    [tempoTestnet.id]: http(),
  },
})
