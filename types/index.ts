export interface GasPoint {
  timestamp: number
  baseFee: number
  priorityFee: number
  totalFee: number
}

export interface ChainData {
  baseFee: number
  priorityFee: number
  history: GasPoint[]
  lastUpdate: number
  connected: boolean
}

export interface CandlestickData {
  time: number
  open: number
  high: number
  low: number
  close: number
}

export interface AppState {
  mode: "live" | "simulation"
  chains: {
    ethereum: ChainData
    polygon: ChainData
    arbitrum: ChainData
  }
  usdPrice: number
  simulationAmount: string
  candlestickData: CandlestickData[]
  isLoading: boolean
  setMode: (mode: "live" | "simulation") => void
  updateChainData: (chain: keyof AppState["chains"], data: Partial<ChainData>) => void
  setUsdPrice: (price: number) => void
  setSimulationAmount: (amount: string) => void
  addGasPoint: (chain: keyof AppState["chains"], point: GasPoint) => void
  updateCandlestickData: (data: CandlestickData[]) => void
}

export interface ChainConfig {
  name: string
  rpcUrl: string
  symbol: string
  color: string
  gasLimit: number
}
