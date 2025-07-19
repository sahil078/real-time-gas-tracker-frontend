import { create } from "zustand"
import type { AppState } from "@/types"

const initialChainData = {
  baseFee: 0,
  priorityFee: 0,
  history: [],
  lastUpdate: 0,
  connected: false,
}

export const useGasStore = create<AppState>((set, get) => ({
  mode: "live",
  chains: {
    ethereum: { ...initialChainData },
    polygon: { ...initialChainData },
    arbitrum: { ...initialChainData },
  },
  usdPrice: 0,
  simulationAmount: "0.5",
  candlestickData: [],
  isLoading: false,

  setMode: (mode) => set({ mode }),

  updateChainData: (chain, data) =>
    set((state) => ({
      chains: {
        ...state.chains,
        [chain]: { ...state.chains[chain], ...data },
      },
    })),

  setUsdPrice: (usdPrice) => set({ usdPrice }),

  setSimulationAmount: (simulationAmount) => set({ simulationAmount }),

  addGasPoint: (chain, point) =>
    set((state) => {
      const chainData = state.chains[chain]
      const newHistory = [...chainData.history, point].slice(-100)

      return {
        chains: {
          ...state.chains,
          [chain]: {
            ...chainData,
            history: newHistory,
            lastUpdate: Date.now(),
          },
        },
      }
    }),

  updateCandlestickData: (candlestickData) => set({ candlestickData }),
}))
