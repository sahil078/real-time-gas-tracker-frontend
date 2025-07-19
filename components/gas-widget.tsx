"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGasStore } from "@/lib/store"
import { CHAIN_CONFIGS } from "@/lib/chains"
import { Wifi, WifiOff, TrendingUp, TrendingDown, Activity } from "lucide-react"
import { useTheme } from "next-themes"

interface GasWidgetProps {
  chainKey: keyof typeof CHAIN_CONFIGS
}

export function GasWidget({ chainKey }: GasWidgetProps) {
  const { chains, usdPrice } = useGasStore()
  const { theme } = useTheme()
  const chainData = chains[chainKey]
  const config = CHAIN_CONFIGS[chainKey]

  const totalGasGwei = chainData.baseFee + chainData.priorityFee
  const gasCostUSD = (totalGasGwei * config.gasLimit * usdPrice) / 1e9

  // Calculate trend (simplified)
  const isIncreasing =
    chainData.history.length > 1 &&
    chainData.history[chainData.history.length - 1].totalFee > chainData.history[chainData.history.length - 2]?.totalFee

  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-background via-background to-muted/20">
      {/* Animated border gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Chain color indicator */}
      <div
        className="absolute top-0 left-0 w-1 h-full opacity-80"
        style={{
          background: `linear-gradient(180deg, ${config.color}, ${config.color}80)`,
        }}
      />

      {/* Glow effect */}
      <div className="absolute -top-1 -left-1 w-2 h-8 blur-sm opacity-60" style={{ backgroundColor: config.color }} />

      <CardHeader className="pb-3 relative">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 font-semibold">
            {config.name}
            <div className="flex items-center gap-1">
              {chainData.connected ? (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <Wifi className="h-3 w-3 text-green-500" />
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <WifiOff className="h-3 w-3 text-red-500" />
                </div>
              )}
            </div>
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono bg-muted/50 backdrop-blur-sm">
              {config.symbol}
            </Badge>
            {isIncreasing ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Base Fee</p>
            <div className="flex items-center gap-2">
              <p className="font-mono font-bold text-lg">{chainData.baseFee.toFixed(1)}</p>
              <span className="text-xs text-muted-foreground">gwei</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Priority Fee</p>
            <div className="flex items-center gap-2">
              <p className="font-mono font-bold text-lg">{chainData.priorityFee.toFixed(1)}</p>
              <span className="text-xs text-muted-foreground">gwei</span>
            </div>
          </div>
        </div>

        {/* Total gas section with gradient background */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-muted/30 to-muted/10 border border-muted/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" style={{ color: config.color }} />
              Total Gas
            </span>
            <span className="font-mono font-bold text-lg">{totalGasGwei.toFixed(2)} gwei</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Cost (21k gas)</span>
            <div className="text-right">
              <span className="font-mono font-bold text-green-600 dark:text-green-400">${gasCostUSD.toFixed(4)}</span>
            </div>
          </div>
        </div>

        {/* Status footer */}
        <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t border-muted/30">
          <span>Last update</span>
          <span className="font-mono">
            {chainData.lastUpdate ? new Date(chainData.lastUpdate).toLocaleTimeString() : "Never"}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
