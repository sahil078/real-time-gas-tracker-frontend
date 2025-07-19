"use client"

import { useMemo } from "react"
import { useGasStore } from "@/lib/store"
import { CHAIN_CONFIGS } from "@/lib/chains"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChainData, GasPoint } from "@/types"

// ✅ Utility to merge all chain data into unified time-based points
function useMergedGasData(chains: Record<string, ChainData>) {
  return useMemo(() => {
    const timeMap: Record<number, any> = {}

    Object.entries(chains).forEach(([chainKey, chain]) => {
      chain.history.forEach((point: GasPoint) => {
        const timestamp = Math.floor(point.timestamp / 1000)
        if (!timeMap[timestamp]) {
          timeMap[timestamp] = {
            time: new Date(timestamp * 1000).toLocaleTimeString(),
          }
        }
        timeMap[timestamp][chainKey] = point.totalFee
      })
    })

    return Object.values(timeMap).sort((a, b) =>
      a.time.localeCompare(b.time)
    )
  }, [chains])
}

export function GasChart() {
  const chains = useGasStore((state) => state.chains)
  const data = useMergedGasData(chains)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gas Price History</CardTitle>
        <div className="flex gap-4 text-sm">
          {Object.entries(CHAIN_CONFIGS).map(([chainKey, config]) => (
            <div key={chainKey} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span>{config.name}</span>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="#374151" />
              <XAxis dataKey="time" stroke="#d1d5db" />
              <YAxis stroke="#d1d5db" />
              <Tooltip />
              <Legend />
              {Object.entries(CHAIN_CONFIGS).map(([chainKey, config]) => (
                <Line
                  key={chainKey}
                  type="monotone"
                  dataKey={chainKey}
                  stroke={config.color}
                  dot={false}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
