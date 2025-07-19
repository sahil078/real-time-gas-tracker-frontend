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

// ✅ Normalize and merge gas data across chains
function useMergedGasData(chains: Record<string, ChainData>) {
  return useMemo(() => {
    const timeMap: Record<number, any> = {}

    Object.entries(chains).forEach(([chainKey, chain]) => {
      chain.history.forEach((point: GasPoint) => {
        const timestamp = Math.floor(point.timestamp / 1000)

        if (!timeMap[timestamp]) {
          timeMap[timestamp] = {
            timestamp,
            time: new Date(timestamp * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }
        }

        timeMap[timestamp][chainKey] = point.totalFee
      })
    })

    // Fill in missing chain values as null for clean line rendering
    const filled = Object.values(timeMap).map((entry) => {
      Object.keys(CHAIN_CONFIGS).forEach((key) => {
        if (!(key in entry)) entry[key] = null
      })
      return entry
    })

    return filled.sort((a, b) => a.timestamp - b.timestamp)
  }, [chains])
}

export function GasChart() {
  const chains = useGasStore((state) => state.chains)
  const data = useMergedGasData(chains)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gas Price History</CardTitle>
        <div className="flex gap-4 text-sm mt-2">
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
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid stroke="#374151" />
              <XAxis dataKey="time" stroke="#d1d5db" />
              <YAxis
                stroke="#d1d5db"
                domain={["auto", "auto"]}
                tickFormatter={(val) => val?.toFixed?.(0)}
              />
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
                  isAnimationActive={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
