// types/index.ts or types/store.ts
export type GasPoint = {
    timestamp: number
    totalFee: number
    baseFee: number
    priorityFee: number
  }
  
  export interface ChainData {
    baseFee: number
    priorityFee: number
    history: GasPoint[]
    lastUpdate: number
    connected: boolean
  }
  
  export interface AppState {
    mode: string
    chains: Record<string, ChainData>
    usdPrice: number
    simulationAmount: string
    candlestickData: any[]
  
    setMode: (mode: string) => void
    updateChainData: (chain: string, data: Partial<ChainData>) => void
    setUsdPrice: (price: number) => void
    setSimulationAmount: (amount: string) => void
    addGasPoint: (chain: string, point: GasPoint) => void
    updateCandlestickData: (data: any[]) => void
  }
  