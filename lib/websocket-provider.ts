import type { ethers } from "ethers"
import { CHAIN_CONFIGS } from "./chains"
import { useGasStore } from "./store"
import type { GasPoint } from "@/types"

class WebSocketGasProvider {
  private providers: Map<string, ethers.providers.WebSocketProvider> = new Map()
  private intervals: Map<string, NodeJS.Timeout> = new Map()

  async connect() {
    for (const [chainKey, config] of Object.entries(CHAIN_CONFIGS)) {
      try {
        // For demo purposes, we'll simulate WebSocket connections
        // In production, you'd use actual WebSocket URLs
        this.simulateGasUpdates(chainKey)

        useGasStore.getState().updateChainData(chainKey as any, { connected: true })
      } catch (error) {
        console.error(`Failed to connect to ${chainKey}:`, error)
        useGasStore.getState().updateChainData(chainKey as any, { connected: false })
      }
    }

    // Start USD price updates
    this.startUsdPriceUpdates()
  }

  private simulateGasUpdates(chainKey: string) {
    const interval = setInterval(() => {
      const baseFee = Math.random() * 50 + 10 // 10-60 gwei
      const priorityFee = Math.random() * 5 + 1 // 1-6 gwei

      const gasPoint: GasPoint = {
        timestamp: Date.now(),
        baseFee,
        priorityFee,
        totalFee: baseFee + priorityFee,
      }

      useGasStore.getState().updateChainData(chainKey as any, {
        baseFee,
        priorityFee,
      })

      useGasStore.getState().addGasPoint(chainKey as any, gasPoint)
    }, 6000) // Update every 6 seconds

    this.intervals.set(chainKey, interval)
  }

  private startUsdPriceUpdates() {
    // Simulate ETH/USD price updates
    const updatePrice = () => {
      const basePrice = 2000
      const volatility = 100
      const price = basePrice + (Math.random() - 0.5) * volatility
      useGasStore.getState().setUsdPrice(price)
    }

    updatePrice()
    setInterval(updatePrice, 10000) // Update every 10 seconds
  }

  disconnect() {
    this.providers.forEach((provider) => {
      provider.destroy()
    })
    this.providers.clear()

    this.intervals.forEach((interval) => {
      clearInterval(interval)
    })
    this.intervals.clear()
  }
}

export const gasProvider = new WebSocketGasProvider()
