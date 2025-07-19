"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGasStore } from "@/lib/store"
import { CHAIN_CONFIGS } from "@/lib/chains"
import { Wifi, WifiOff } from "lucide-react"

interface GasWidgetProps {
  chainKey: keyof typeof CHAIN_CONFIGS
}

export function GasWidget({ chainKey }: GasWidgetProps) {
  const { chains, usdPrice } = useGasStore()
  const chainData = chains[chainKey]
  const config = CHAIN_CONFIGS[chainKey]

  const totalGasGwei = chainData.baseFee + chainData.priorityFee
  const gasCostUSD = (totalGasGwei * config.gasLimit * usdPrice) / 1e9

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: config.color }} />
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            {config.name}
            {chainData.connected ? (
              <Wifi className="h-3 w-3 text-green-500" />
            ) : (
              <WifiOff className="h-3 w-3 text-red-500" />
            )}
          </span>
          <Badge variant="outline" className="text-xs">
            {config.symbol}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Base Fee</p>
            <p className="font-mono font-medium">{chainData.baseFee.toFixed(2)} gwei</p>
          </div>
          <div>
            <p className="text-muted-foreground">Priority Fee</p>
            <p className="font-mono font-medium">{chainData.priorityFee.toFixed(2)} gwei</p>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Gas</span>
            <span className="font-mono font-medium">{totalGasGwei.toFixed(2)} gwei</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-muted-foreground">Cost (21k gas)</span>
            <span className="font-mono font-medium text-green-600">${gasCostUSD.toFixed(4)}</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Last update: {chainData.lastUpdate ? new Date(chainData.lastUpdate).toLocaleTimeString() : "Never"}
        </div>
      </CardContent>
    </Card>
  )
}
