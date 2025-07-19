"use client"

import { useEffect } from "react"
import { GasWidget } from "@/components/gas-widget"
import { GasChart } from "@/components/gas-chart"
import { SimulationPanel } from "@/components/simulation-panel"
import { StatusBar } from "@/components/status-bar"
import { gasProvider } from "@/lib/websocket-provider"
import { CHAIN_CONFIGS } from "@/lib/chains"

export default function Dashboard() {
  useEffect(() => {
    // Initialize WebSocket connections
    gasProvider.connect()

    return () => {
      gasProvider.disconnect()
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Real-Time Cross-Chain Gas Tracker</h1>
          <p className="text-muted-foreground">
            Monitor gas prices across Ethereum, Polygon, and Arbitrum with live USD calculations
          </p>
        </div>

        <StatusBar />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.keys(CHAIN_CONFIGS).map((chainKey) => (
            <GasWidget key={chainKey} chainKey={chainKey as keyof typeof CHAIN_CONFIGS} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GasChart />
          </div>
          <div>
            <SimulationPanel />
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Real-time data from native RPC endpoints • ETH/USD from Uniswap V3 • Updates every 6 seconds</p>
        </div>
      </div>
    </div>
  )
}
