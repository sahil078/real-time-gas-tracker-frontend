"use client"

import { useEffect, useRef, useState } from "react"
import { createChart, type IChartApi, type ISeriesApi, ColorType } from "lightweight-charts"
import { useGasStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CHAIN_CONFIGS } from "@/lib/chains"
import { useTheme } from "next-themes"
import { BarChart3, TrendingUp, Maximize2 } from "lucide-react"

export function GasChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRefs = useRef<Record<string, ISeriesApi<"Line">>>({})
  const [isFullscreen, setIsFullscreen] = useState(false)

  const { chains } = useGasStore()
  const { theme } = useTheme()

  useEffect(() => {
    if (!chartContainerRef.current) return

    const isDark = theme === "dark"

    // Create chart with enhanced styling
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: isFullscreen ? 600 : 400,
      layout: {
        background: {
          type: ColorType.Solid,
          color: isDark ? "rgba(0, 0, 0, 0)" : "rgba(255, 255, 255, 0)",
        },
        textColor: isDark ? "#e5e7eb" : "#374151",
        fontSize: 12,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      },
      grid: {
        vertLines: {
          color: isDark ? "rgba(55, 65, 81, 0.3)" : "rgba(229, 231, 235, 0.5)",
          style: 1,
        },
        horzLines: {
          color: isDark ? "rgba(55, 65, 81, 0.3)" : "rgba(229, 231, 235, 0.5)",
          style: 1,
        },
      },
      rightPriceScale: {
        borderColor: isDark ? "rgba(75, 85, 99, 0.5)" : "rgba(209, 213, 219, 0.5)",
        textColor: isDark ? "#9ca3af" : "#6b7280",
      },
      timeScale: {
        borderColor: isDark ? "rgba(75, 85, 99, 0.5)" : "rgba(209, 213, 219, 0.5)",
        textColor: isDark ? "#9ca3af" : "#6b7280",
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: isDark ? "rgba(156, 163, 175, 0.5)" : "rgba(107, 114, 128, 0.5)",
          width: 1,
          style: 2,
        },
        horzLine: {
          color: isDark ? "rgba(156, 163, 175, 0.5)" : "rgba(107, 114, 128, 0.5)",
          width: 1,
          style: 2,
        },
      },
    })

    chartRef.current = chart

    // Create enhanced series for each chain
    Object.entries(CHAIN_CONFIGS).forEach(([chainKey, config]) => {
      const series = chart.addLineSeries({
        color: config.color,
        lineWidth: 3,
        lineStyle: 0,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 6,
        crosshairMarkerBorderColor: config.color,
        crosshairMarkerBackgroundColor: config.color,
        lastValueVisible: true,
        priceLineVisible: true,
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
  }, [theme, isFullscreen])

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
    <Card className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/10 border-0 shadow-lg">
      {/* Header with gradient background */}
      <CardHeader className="bg-gradient-to-r from-muted/20 to-muted/5 border-b border-muted/20">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Gas Price History</h3>
              <p className="text-sm text-muted-foreground">Real-time cross-chain gas tracking</p>
            </div>
          </CardTitle>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)} className="h-8 w-8">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Chain legend with enhanced styling */}
        <div className="flex flex-wrap gap-3 mt-4">
          {Object.entries(CHAIN_CONFIGS).map(([chainKey, config]) => {
            const chainData = chains[chainKey as keyof typeof chains]
            const currentGas = chainData.baseFee + chainData.priorityFee

            return (
              <div
                key={chainKey}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-background/50 backdrop-blur-sm border border-muted/30"
              >
                <div
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{
                    backgroundColor: config.color,
                    boxShadow: `0 0 8px ${config.color}40`,
                  }}
                />
                <span className="text-sm font-medium">{config.name}</span>
                <span className="text-xs text-muted-foreground font-mono">{currentGas.toFixed(1)} gwei</span>
                {chainData.connected && <TrendingUp className="h-3 w-3 text-green-500" />}
              </div>
            )
          })}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div ref={chartContainerRef} className="w-full relative" style={{ height: isFullscreen ? 600 : 400 }} />

        {/* Overlay gradient for better visual appeal */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
      </CardContent>
    </Card>
  )
}
