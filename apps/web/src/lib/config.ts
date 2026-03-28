import { http, createConfig } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { type Chain } from 'viem'

// =============================================
// Monad Testnet — custom chain definition
// Chain ID: 10143
// =============================================
export const monadTestnet: Chain = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_GETBLOCK_RPC_URL || 'https://testnet-rpc.monad.xyz',
      ],
    },
    public: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://testnet.monadexplorer.com',
    },
  },
  testnet: true,
}

// Only MetaMask (injected) — no WalletConnect
export const config = createConfig({
  chains: [monadTestnet],
  connectors: [injected()],
  transports: {
    [monadTestnet.id]: http(
      process.env.NEXT_PUBLIC_GETBLOCK_RPC_URL || 'https://testnet-rpc.monad.xyz'
    ),
  },
})
