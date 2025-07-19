"use client"

import { useEffect } from "react"
import { GasWidget } from "@/components/gas-widget"
import { GasChart } from "@/components/gas-chart"
import { SimulationPanel } from "@/components/simulation-panel"
import { StatusBar } from "@/components/status-bar"
import { gasProvider } from "@/lib/websocket-provider"
import { CHAIN_CONFIGS } from "@/lib/chains"
import { Zap, BarChart3, Calculator } from "lucide-react"

export default function Dashboard() {
  useEffect(() => {
    // Initialize WebSocket connections
    gasProvider.connect()

    return () => {
      gasProvider.disconnect()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="relative container mx-auto p-6 space-y-8">
        {/* Hero section */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20">
              <BarChart3 className="h-8 w-8 text-secondary" />
            </div>
            <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
              <Calculator className="h-8 w-8 text-accent" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Real-Time Gas Tracker
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Monitor gas prices across Ethereum, Polygon, and Arbitrum with live USD calculations and wallet simulation
          </p>
        </div>

        {/* Status bar */}
        <StatusBar />

        {/* Gas widgets grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.keys(CHAIN_CONFIGS).map((chainKey) => (
            <GasWidget key={chainKey} chainKey={chainKey as keyof typeof CHAIN_CONFIGS} />
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GasChart />
          </div>
          <div>
            <SimulationPanel />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-muted/20">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Real-time data from native RPC endpoints</span>
          </div>
          <p className="text-xs text-muted-foreground">
            ETH/USD from Uniswap V3 • Updates every 6 seconds • Built with Next.js & Zustand
          </p>
        </div>
      </div>
    </div>
  )
}
