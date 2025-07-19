"use client"

import { Badge } from "@/components/ui/badge"
import { useGasStore } from "@/lib/store"
import { CHAIN_CONFIGS } from "@/lib/chains"
import { Activity, Wifi, WifiOff } from "lucide-react"

export function StatusBar() {
  const { mode, chains, usdPrice } = useGasStore()

  const connectedChains = Object.entries(chains).filter(([_, data]) => data.connected).length
  const totalChains = Object.keys(chains).length

  return (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-4">
        <Badge variant={mode === "live" ? "default" : "secondary"}>
          <Activity className="h-3 w-3 mr-1" />
          {mode.toUpperCase()} MODE
        </Badge>

        <div className="flex items-center gap-2 text-sm">
          {connectedChains === totalChains ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          <span className="text-muted-foreground">
            {connectedChains}/{totalChains} chains connected
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="text-muted-foreground">ETH/USD: </span>
          <span className="font-mono font-medium">${usdPrice.toFixed(2)}</span>
        </div>

        <div className="flex gap-1">
          {Object.entries(CHAIN_CONFIGS).map(([chainKey, config]) => (
            <div
              key={chainKey}
              className={`w-2 h-2 rounded-full ${
                chains[chainKey as keyof typeof chains].connected ? "bg-green-500" : "bg-red-500"
              }`}
              title={`${config.name} ${chains[chainKey as keyof typeof chains].connected ? "Connected" : "Disconnected"}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
