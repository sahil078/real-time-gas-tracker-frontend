import { create } from "zustand"
import { AppState ,ChainData , GasPoint } from "./type"

// Initial data structure for each chain
const initialChainData: ChainData = {
  baseFee: 0,
  priorityFee: 0,
  history: [],
  lastUpdate: 0,
  connected: false,
}

export const useGasStore = create<AppState>((set, get) => ({
  mode: "live",

  // Initialize each chain's state
  chains: {
    ethereum: { ...initialChainData },
    polygon: { ...initialChainData },
    arbitrum: { ...initialChainData },
  },

  usdPrice: 0,
  simulationAmount: "0.5",
  candlestickData: [],

  // Setters / Mutators
  setMode: (mode: string) => set({ mode }),

  updateChainData: (chain: string, data: Partial<ChainData>) =>
    set((state) => ({
      chains: {
        ...state.chains,
        [chain]: {
          ...state.chains[chain],
          ...data,
        },
      },
    })),

  setUsdPrice: (usdPrice: number) => set({ usdPrice }),

  setSimulationAmount: (simulationAmount: string) => set({ simulationAmount }),

  addGasPoint: (chain: string, point: GasPoint) =>
    set((state) => {
      const chainData = state.chains[chain]

      const updatedHistory = [...chainData.history, point].slice(-100) // Keep last 100 points only

      return {
        chains: {
          ...state.chains,
          [chain]: {
            ...chainData,
            history: updatedHistory,
            lastUpdate: Date.now(),
          },
        },
      }
    }),

  updateCandlestickData: (candlestickData: any[]) => set({ candlestickData }),
}))
