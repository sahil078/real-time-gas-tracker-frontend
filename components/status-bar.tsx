"use client"

import { Badge } from "@/components/ui/badge"
import { useGasStore } from "@/lib/store"
import { CHAIN_CONFIGS } from "@/lib/chains"
import { Activity, Wifi, WifiOff, Globe } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export function StatusBar() {
  const { mode, chains, usdPrice } = useGasStore()

  const connectedChains = Object.entries(chains).filter(([_, data]) => data.connected).length
  const totalChains = Object.keys(chains).length

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-background via-muted/20 to-background border border-muted/30 shadow-lg">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-50" />

      <div className="relative flex items-center justify-between p-4">
        <div className="flex items-center gap-6">
          {/* Mode indicator */}
          <Badge variant={mode === "live" ? "default" : "secondary"} className="px-3 py-1 font-semibold">
            <Activity className="h-3 w-3 mr-2" />
            {mode.toUpperCase()} MODE
          </Badge>

          {/* Connection status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {connectedChains === totalChains ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <Wifi className="h-4 w-4 text-green-500" />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <WifiOff className="h-4 w-4 text-red-500" />
                </div>
              )}
              <span className="text-sm font-medium">
                {connectedChains}/{totalChains} chains
              </span>
            </div>

            {/* Chain status indicators */}
            <div className="flex gap-1">
              {Object.entries(CHAIN_CONFIGS).map(([chainKey, config]) => (
                <div
                  key={chainKey}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    chains[chainKey as keyof typeof chains].connected ? "shadow-sm" : "opacity-50"
                  }`}
                  style={{
                    backgroundColor: config.color,
                    boxShadow: chains[chainKey as keyof typeof chains].connected ? `0 0 6px ${config.color}60` : "none",
                  }}
                  title={`${config.name} ${chains[chainKey as keyof typeof chains].connected ? "Connected" : "Disconnected"}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* ETH/USD price */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-muted/30">
            <Globe className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">ETH/USD:</span>
            <span className="font-mono font-bold text-green-600 dark:text-green-400">${usdPrice.toFixed(2)}</span>
          </div>

          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
