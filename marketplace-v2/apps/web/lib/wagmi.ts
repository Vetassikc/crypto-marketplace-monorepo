import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { tempoTestnet } from './tempo-chain'

export const config = createConfig({
  chains: [tempoTestnet, mainnet, sepolia],
  transports: {
    [tempoTestnet.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})
