import type { ChainConfig } from "@/types"

export const CHAIN_CONFIGS: Record<string, ChainConfig> = {
  ethereum: {
    name: "Ethereum",
    rpcUrl: "wss://eth-mainnet.ws.alchemyapi.io/v2/demo",
    symbol: "ETH",
    color: "#627EEA",
    gasLimit: 21000,
  },
  polygon: {
    name: "Polygon",
    rpcUrl: "wss://polygon-mainnet.ws.alchemyapi.io/v2/demo",
    symbol: "MATIC",
    color: "#8247E5",
    gasLimit: 21000,
  },
  arbitrum: {
    name: "Arbitrum",
    rpcUrl: "wss://arb-mainnet.ws.alchemyapi.io/v2/demo",
    symbol: "ETH",
    color: "#28A0F0",
    gasLimit: 21000,
  },
}

export const UNISWAP_V3_ETH_USDC_POOL = "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"
