"use client"

import { X, AlertTriangle, FileText, ClipboardPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

import { metricsDetails } from "@/lib/metricks-detail"

interface DetailPanelProps {
  onClose: () => void
  activeMetric: string
}

export function DetailPanel({ onClose, activeMetric }: DetailPanelProps) {
  // Получаем данные для активной метрики
  const metricData = metricsDetails[activeMetric]

  // Если метрика не найдена, показываем заглушку
  if (!metricData) {
    return (
      <aside className="flex flex-col h-full bg-background border-l border-zinc-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-base font-semibold text-foreground">
            Детализация показателя
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-zinc-500">Данные не найдены</p>
        </div>
      </aside>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-400 bg-red-500/20 border-red-500/30"
      case "warning":
        return "text-amber-400 bg-amber-500/20 border-amber-500/30"
      default:
        return "text-emerald-400 bg-emerald-500/20 border-emerald-500/30"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "critical":
        return "Критично"
      case "warning":
        return "Внимание"
      default:
        return "Норма"
    }
  }

  const getChartColor = (status: string) => {
    switch (status) {
      case "critical":
        return "#ef4444"
      case "warning":
        return "#f59e0b"
      default:
        return "#10b981"
    }
  }

  const formatYAxis = (value: number) => {
    if (metricData.title.includes("Температура")) {
      return `${value}°C`
    }
    if (metricData.title.includes("FCR") || metricData.title.includes("Конверсия")) {
      return value.toString()
    }
    if (metricData.title.includes("Аммиак")) {
      return `${value} ppm`
    }
    if (metricData.title.includes("Вес")) {
      return metricData.currentValue.includes("кг") ? `${value} кг` : `${value} г`
    }
    if (metricData.title.includes("Потребление корма")){
      return metricData.currentValue.includes("кг") ? `${value} кг` : `${value} г`
    }

    if (metricData.title.includes("Потребление воды")){
      return metricData.currentValue.includes("мл") ? `${value} мл` : `${value} л`
    }

    return `${value}%`
  }

  const formatTooltip = (value: number) => {
    if (metricData.title.includes("Температура")) {
      return [`${value}°F`, metricData.title]
    }
    if (metricData.title.includes("FCR") || metricData.title.includes("Конверсия")) {
      return [value.toString(), metricData.title]
    }
    if (metricData.title.includes("Аммиак")) {
      return [`${value} ppm`, metricData.title]
    }
    if (metricData.title.includes("Вес")) {
      const unit = metricData.currentValue.includes("кг") ? "кг" : "г"
      return [`${value} ${unit}`, metricData.title]
    }
    return [`${value}`, metricData.title]
  }

  return (
    <aside className="flex flex-col h-full bg-background border-r border-zinc-800">
      {/* Header */}
      <div className="px-6 py-4.5 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            Детализация показателя
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Закрыть панель"
          >
            <X className="size-5" />
          </button>
        </div>
        <p className="text-sm text-foreground mt-1">
          {metricData.title}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 p-5">
          <div className="p-4 rounded-xl bg-background border border-zinc-800">
            <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">
              Текущее значение
            </p>
            <p className={`text-3xl font-bold ${
              metricData.status === "critical" 
                ? "text-red-400" 
                : metricData.status === "warning"
                ? "text-amber-400"
                : "text-emerald-400"
            }`}>
              {metricData.currentValue}
            </p>
            <Badge className={`mt-2 ${getStatusColor(metricData.status)}`}>
              {getStatusText(metricData.status)}
            </Badge>
          </div>
          <div className="p-4 rounded-xl bg-background border border-zinc-800">
            <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">
              Целевой диапазон (Норма)
            </p>
            <p className="text-3xl font-bold text-emerald-400">
              {metricData.targetRange}
            </p>
            <Badge className="mt-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              Норма
            </Badge>
          </div>
        </div>

        {/* Chart */}
        <div className="px-5 pb-5">
          <div className="p-4 rounded-xl bg-background border border-zinc-800">
            <h3 className="text-sm font-medium text-foreground mb-4">
              Динамика за 7 дней
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={metricData.chartData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={getChartColor(metricData.status)} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={getChartColor(metricData.status)} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#27272a"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#71717a", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#71717a", fontSize: 12 }}
                    tickFormatter={formatYAxis}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                    formatter={formatTooltip}
                    labelStyle={{ color: "#a1a1aa" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={getChartColor(metricData.status)}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorMetric)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Problem Locations */}
        <div className="px-5 pb-5">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Проблемные локации
          </h3>
          <div className="space-y-2">
            {metricData.problemLocations.map((location) => (
              <div
                key={location.name}
                className="flex items-center justify-between p-3 rounded-lg bg-background border border-zinc-800"
              >
                <span className="text-sm text-foreground">{location.name}</span>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      location.status === "critical"
                        ? "text-red-400 font-semibold"
                        : "text-amber-400 font-semibold"
                    }
                  >
                    {location.value}
                  </span>
                  <Badge
                    className={
                      location.status === "critical"
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    }
                  >
                    {location.status === "critical" ? "Критично" : "Внимание"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Incidents Alert */}
        {metricData.relatedIncident && (
          <div className="px-5 pb-5">
            <div className="flex gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="size-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-400 mb-1">
                  {metricData.relatedIncident.title}
                </h4>
                <p className="text-sm text-amber-400">
                  {metricData.relatedIncident.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-zinc-800">
        <Button
          variant="outline"
          className="border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 hover:text-white"
        >
          <FileText className="size-4" />
          Полный отчет
        </Button>
        <Button className="bg-red-600 text-white hover:bg-red-700">
          <ClipboardPlus className="size-4" />
          Создать задачу
        </Button>
      </div>
    </aside>
  )
}