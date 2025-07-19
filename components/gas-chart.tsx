"use client"

import { useEffect, useRef } from "react"
import { createChart, type IChartApi, type ISeriesApi } from "lightweight-charts"
import { useGasStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CHAIN_CONFIGS } from "@/lib/chains"

export function GasChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRefs = useRef<Record<string, ISeriesApi<"Line">>>({})

  const { chains } = useGasStore()

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: "transparent" },
        textColor: "#d1d5db",
      },
      grid: {
        vertLines: { color: "#374151" },
        horzLines: { color: "#374151" },
      },
      rightPriceScale: {
        borderColor: "#4b5563",
      },
      timeScale: {
        borderColor: "#4b5563",
        timeVisible: true,
        secondsVisible: false,
      },
    })

    chartRef.current = chart

    // Create series for each chain
    Object.entries(CHAIN_CONFIGS).forEach(([chainKey, config]) => {
      const series = chart.addLineSeries({
        color: config.color,
        lineWidth: 2,
        title: config.name,
      })
      seriesRefs.current[chainKey] = series
    })

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (chartRef.current) {
        chartRef.current.remove()
      }
    }
  }, [])

  useEffect(() => {
    // Update chart data when gas data changes
    Object.entries(chains).forEach(([chainKey, chainData]) => {
      const series = seriesRefs.current[chainKey]
      if (series && chainData.history.length > 0) {
        const chartData = chainData.history.map((point) => ({
          time: Math.floor(point.timestamp / 1000) as any,
          value: point.totalFee,
        }))
        series.setData(chartData)
      }
    })
  }, [chains])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gas Price History</CardTitle>
        <div className="flex gap-4 text-sm">
          {Object.entries(CHAIN_CONFIGS).map(([chainKey, config]) => (
            <div key={chainKey} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
              <span>{config.name}</span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartContainerRef} className="w-full" />
      </CardContent>
    </Card>
  )
}
