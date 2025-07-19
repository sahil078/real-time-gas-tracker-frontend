"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGasStore } from "@/lib/store"
import { CHAIN_CONFIGS } from "@/lib/chains"
import { Calculator, TrendingUp } from "lucide-react"

export function SimulationPanel() {
  const { mode, simulationAmount, setSimulationAmount, chains, usdPrice, setMode } = useGasStore()

  const calculateTransactionCost = (chainKey: keyof typeof chains) => {
    const chainData = chains[chainKey]
    const config = CHAIN_CONFIGS[chainKey]
    const amount = Number.parseFloat(simulationAmount) || 0

    const gasFeesGwei = chainData.baseFee + chainData.priorityFee
    const gasCostETH = (gasFeesGwei * config.gasLimit) / 1e9
    const gasCostUSD = gasCostETH * usdPrice
    const totalCostUSD = amount * usdPrice + gasCostUSD

    return {
      gasCostETH,
      gasCostUSD,
      totalCostUSD,
      gasFeesGwei,
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Transaction Simulator
        </CardTitle>
        <div className="flex gap-2">
          <Button variant={mode === "live" ? "default" : "outline"} size="sm" onClick={() => setMode("live")}>
            <TrendingUp className="h-4 w-4 mr-1" />
            Live Mode
          </Button>
          <Button
            variant={mode === "simulation" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("simulation")}
          >
            <Calculator className="h-4 w-4 mr-1" />
            Simulation Mode
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="amount">Transaction Amount (ETH)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={simulationAmount}
            onChange={(e) => setSimulationAmount(e.target.value)}
            placeholder="0.5"
            className="font-mono"
          />
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Cross-Chain Cost Comparison</h4>
          <div className="grid gap-3">
            {Object.entries(chains).map(([chainKey, chainData]) => {
              const config = CHAIN_CONFIGS[chainKey]
              const costs = calculateTransactionCost(chainKey as keyof typeof chains)

              return (
                <div key={chainKey} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
                    <div>
                      <p className="font-medium">{config.name}</p>
                      <p className="text-sm text-muted-foreground">Gas: {costs.gasFeesGwei.toFixed(2)} gwei</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-medium">${costs.totalCostUSD.toFixed(4)}</p>
                    <p className="text-sm text-muted-foreground">Gas: ${costs.gasCostUSD.toFixed(4)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="pt-3 border-t">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">ETH/USD Price:</span>
            <Badge variant="outline" className="font-mono">
              ${usdPrice.toFixed(2)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
