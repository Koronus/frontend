"use client"

import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react"

type TrendDirection = "up" | "down" | "stable"
type ValueStatus = "normal" | "warning" | "critical"

interface KpiCardProps {
  icon: LucideIcon
  title: string
  value: string
  norm?: string
  trend: TrendDirection
  trendGood?: "up" | "down" // Which direction is considered good
  status?: ValueStatus
  onClick?: () => void
  isActive?: boolean
}

const statusStyles: Record<ValueStatus, string> = {
  normal: "text-green-400",
  warning: "text-amber-400",
  critical: "text-red-400",
}

const trendIcons: Record<TrendDirection, LucideIcon> = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
}

export function KpiCard({
  icon: Icon,
  title,
  value,
  norm,
  trend,
  trendGood = "up",
  status = "normal",
  onClick,
  isActive,
}: KpiCardProps) {
  const TrendIcon = trendIcons[trend]
  
  // Determine if the trend is positive based on what's good for this metric
  const isTrendPositive = trend === "stable" || trend === trendGood
  const trendColor = isTrendPositive ? "text-emerald-400" : "text-red-400"

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col gap-3 p-4 rounded-xl border transition-all text-left",
        "bg-background/50 border-zinc-800 hover:bg-selectground hover:border-zinc-700",
        isActive && "ring-2  border-zinc-600 bg-selectground"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-zinc-800/80">
            <Icon className="size-4 text-zinc-400" />
          </div>
          <span className="text-sm text-foreground font-medium">{title}</span>
        </div>
        <div className={cn("flex items-center gap-1", trendColor)}>
          <TrendIcon className="size-4" />
        </div>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <span className={cn("text-2xl font-bold tracking-tight", statusStyles[status])}>
          {value}
        </span>
      </div>

      {/* Norm */}
      {norm && (
        <div className="text-xs text-zinc-500">
          Норма: <span className="text-foreground">{norm}</span>
        </div>
      )}

      {/* Sparkline-like decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl overflow-hidden">
        <div
          className={cn(
            "h-full transition-all",
            status === "critical" && "bg-red-500/30",
            status === "warning" && "bg-amber-500/30",
            status === "normal" && "bg-emerald-500/20"
          )}
          style={{ width: "100%" }}
        />
      </div>
    </button>
  )
}
