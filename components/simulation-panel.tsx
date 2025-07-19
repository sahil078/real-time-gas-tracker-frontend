"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGasStore } from "@/lib/store"
import { CHAIN_CONFIGS } from "@/lib/chains"
import { Calculator, TrendingUp, Zap, DollarSign, ArrowRight } from "lucide-react"

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

  const sortedChains = Object.entries(chains)
    .map(([chainKey, chainData]) => ({
      chainKey: chainKey as keyof typeof chains,
      chainData,
      config: CHAIN_CONFIGS[chainKey],
      costs: calculateTransactionCost(chainKey as keyof typeof chains),
    }))
    .sort((a, b) => a.costs.totalCostUSD - b.costs.totalCostUSD)

  const cheapestChain = sortedChains[0]
  const savings = sortedChains[sortedChains.length - 1]?.costs.totalCostUSD - cheapestChain?.costs.totalCostUSD

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 border-0 shadow-lg">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50" />

      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Transaction Simulator</h3>
            <p className="text-sm text-muted-foreground">Compare costs across chains</p>
          </div>
        </CardTitle>

        {/* Mode toggle with enhanced styling */}
        <div className="flex gap-2 mt-4">
          <Button
            variant={mode === "live" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("live")}
            className="flex-1 transition-all duration-200"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Live Mode
          </Button>
          <Button
            variant={mode === "simulation" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("simulation")}
            className="flex-1 transition-all duration-200"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Simulation
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 relative">
        {/* Amount input with enhanced styling */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">
            Transaction Amount
          </Label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={simulationAmount}
              onChange={(e) => setSimulationAmount(e.target.value)}
              placeholder="0.5"
              className="font-mono text-lg pl-12 h-12 bg-muted/30 border-muted/50 focus:bg-background transition-colors"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Cost comparison with enhanced cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Cross-Chain Comparison
            </h4>
            {savings > 0 && (
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
                Save ${savings.toFixed(4)}
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            {sortedChains.map(({ chainKey, chainData, config, costs }, index) => (
              <div
                key={chainKey}
                className={`relative p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                  index === 0
                    ? "bg-green-500/5 border-green-500/20 ring-1 ring-green-500/20"
                    : "bg-muted/20 border-muted/30 hover:bg-muted/30"
                }`}
              >
                {index === 0 && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-green-500 text-white text-xs">Cheapest</Badge>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{
                        backgroundColor: config.color,
                        boxShadow: `0 0 8px ${config.color}40`,
                      }}
                    />
                    <div>
                      <p className="font-semibold">{config.name}</p>
                      <p className="text-sm text-muted-foreground font-mono">{costs.gasFeesGwei.toFixed(2)} gwei</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-bold text-lg">${costs.totalCostUSD.toFixed(4)}</p>
                      {index === 0 && <ArrowRight className="h-4 w-4 text-green-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">Gas: ${costs.gasCostUSD.toFixed(4)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ETH/USD price display */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 border border-muted/30">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">ETH/USD Price</span>
            <Badge variant="outline" className="font-mono text-base px-3 py-1">
              ${usdPrice.toFixed(2)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
